-- אפליקציית "מי נמצא" — סכימת Supabase (Postgres)
-- להריץ פעם אחת בפרויקט Supabase חדש: SQL Editor → הדבקה → Run.
-- ראו CLAUDE.md / YR1/whoIn/README.md להוראות הקמה מלאות.

create extension if not exists pgcrypto;

-- ============================================================
-- טבלאות
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  phone text,
  is_admin boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (end_at >= start_at)
);

create table public.event_invitees (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- לתיעוד/תצוגה בלבד ("הוזמן דרך קבוצת X") — לא מקור האמת להרשאות,
-- זה תמיד event_invitees.
create table public.event_invited_groups (
  event_id uuid not null references public.events(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  primary key (event_id, group_id)
);

create table public.responses (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('in', 'partial', 'out', 'unknown')),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index events_creator_id_idx on public.events(creator_id);
create index event_invitees_user_id_idx on public.event_invitees(user_id);
create index group_members_user_id_idx on public.group_members(user_id);
create index responses_user_id_idx on public.responses(user_id);

-- ============================================================
-- טריגרים
-- ============================================================

-- יצירת שורת profile אוטומטית בהרשמה. display_name/phone מגיעים מ-
-- options.data שנשלח ל-supabase.auth.signUp() בלקוח.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger responses_set_updated_at
before update on public.responses
for each row execute function public.set_updated_at();

-- ============================================================
-- is_admin() — עזר ל-RLS policies
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;

-- עוד ארבע פונקציות עזר security definer, לאותה סיבה בדיוק: ה-policies של
-- events/event_invitees (ובהתאמה groups/group_members) בודקות זו את זו
-- לרוחב שתי טבלאות. עטיפת כל בדיקה כזו בפונקציית security definer (ולא
-- exists(select ...) גולמי בתוך ה-policy) היא הדפוס המתועד של Supabase
-- למניעת הערכת RLS מקוננת/מיותרת בין שתי טבלאות שמפנות זו לזו, ומהירה
-- יותר מ-exists גולמי שהיה עובר דרך ה-RLS של הטבלה הפנימית שוב.

create or replace function public.is_event_creator(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.events
    where id = p_event_id and creator_id = auth.uid()
  );
$$;

create or replace function public.is_event_invitee(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.event_invitees
    where event_id = p_event_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_group_creator(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.groups
    where id = p_group_id and creator_id = auth.uid()
  );
$$;

create or replace function public.is_group_member(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  );
$$;

grant execute on function public.is_event_creator(uuid) to authenticated;
grant execute on function public.is_event_invitee(uuid) to authenticated;
grant execute on function public.is_group_creator(uuid) to authenticated;
grant execute on function public.is_group_member(uuid) to authenticated;

-- מגן על is_admin/is_blocked מפני עדכון ע"י המשתמש עצמו: מותר לשנות רק
-- לאדמין קיים (public.is_admin()) או לקריאה עם ה-service_role (הפונקציה
-- ב-netlify/functions/whoin-admin.js) — auth.role() = 'service_role' עוקף
-- RLS אבל לא טריגרים, לכן הבדיקה כאן קריטית.
create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.is_admin is distinct from old.is_admin or new.is_blocked is distinct from old.is_blocked) then
    if auth.role() <> 'service_role' and not public.is_admin() then
      raise exception 'not allowed to change is_admin/is_blocked';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_privileged
before update on public.profiles
for each row execute function public.protect_privileged_columns();

-- ============================================================
-- public_profiles — view מצומצם לבחירת משתתפים/חברי קבוצה
-- ============================================================
-- security_invoker = false בכוונה: ה-view רץ בהרשאות הבעלים (עוקף את
-- ה-RLS המצמצם של profiles ל"שורה עצמית בלבד") אבל חושף רק את שלוש
-- העמודות הבאות — לא phone/is_admin/is_blocked. אל תשנו ל-
-- security_invoker = true, זה ישבור את יכולת החיפוש של משתמשים אחרים.
create view public.public_profiles
with (security_invoker = false) as
select id, display_name, email from public.profiles;

grant select on public.public_profiles to authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.events enable row level security;
alter table public.event_invitees enable row level security;
alter table public.event_invited_groups enable row level security;
alter table public.responses enable row level security;

-- profiles ----------------------------------------------------

create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- groups --------------------------------------------------------

create policy "groups_select"
on public.groups for select
using (
  creator_id = auth.uid()
  or public.is_group_member(id)
  or public.is_admin()
);

create policy "groups_insert"
on public.groups for insert
with check (creator_id = auth.uid());

create policy "groups_update"
on public.groups for update
using (creator_id = auth.uid() or public.is_admin())
with check (creator_id = auth.uid() or public.is_admin());

create policy "groups_delete"
on public.groups for delete
using (creator_id = auth.uid() or public.is_admin());

-- group_members ---------------------------------------------------

create policy "group_members_select"
on public.group_members for select
using (
  user_id = auth.uid()
  or public.is_group_creator(group_id)
  or public.is_admin()
);

create policy "group_members_insert"
on public.group_members for insert
with check (
  public.is_group_creator(group_id)
  or public.is_admin()
);

create policy "group_members_delete"
on public.group_members for delete
using (
  public.is_group_creator(group_id)
  or public.is_admin()
);

-- events --------------------------------------------------------

create policy "events_select"
on public.events for select
using (
  creator_id = auth.uid()
  or public.is_event_invitee(id)
  or public.is_admin()
);

create policy "events_insert"
on public.events for insert
with check (creator_id = auth.uid());

create policy "events_update"
on public.events for update
using (creator_id = auth.uid() or public.is_admin())
with check (creator_id = auth.uid() or public.is_admin());

create policy "events_delete"
on public.events for delete
using (creator_id = auth.uid() or public.is_admin());

-- event_invitees ------------------------------------------------

create policy "event_invitees_select"
on public.event_invitees for select
using (
  user_id = auth.uid()
  or public.is_event_creator(event_id)
  or public.is_admin()
);

create policy "event_invitees_insert"
on public.event_invitees for insert
with check (
  public.is_event_creator(event_id)
  or public.is_admin()
);

create policy "event_invitees_delete"
on public.event_invitees for delete
using (
  public.is_event_creator(event_id)
  or public.is_admin()
);

-- event_invited_groups --------------------------------------------

create policy "event_invited_groups_select"
on public.event_invited_groups for select
using (
  public.is_event_creator(event_id)
  or public.is_admin()
);

create policy "event_invited_groups_insert"
on public.event_invited_groups for insert
with check (
  public.is_event_creator(event_id)
  or public.is_admin()
);

create policy "event_invited_groups_delete"
on public.event_invited_groups for delete
using (
  public.is_event_creator(event_id)
  or public.is_admin()
);

-- responses -------------------------------------------------------
-- כל מוזמן לאירוע רואה את התגובות של כל שאר המוזמנים (כדי לדעת מי בא) --
-- לא רק את שלו.

create policy "responses_select"
on public.responses for select
using (
  user_id = auth.uid()
  or public.is_event_invitee(event_id)
  or public.is_event_creator(event_id)
  or public.is_admin()
);

create policy "responses_insert"
on public.responses for insert
with check (
  user_id = auth.uid()
  and public.is_event_invitee(event_id)
);

create policy "responses_update"
on public.responses for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and public.is_event_invitee(event_id)
);

-- ============================================================
-- בוטסטראפ אדמין ראשון — הרצה חד-פעמית וידנית, אחרי הרשמה רגילה:
-- update public.profiles set is_admin = true where email = 'your-email@example.com';
-- ============================================================
