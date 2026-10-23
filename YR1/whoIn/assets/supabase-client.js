// אתחול Supabase client + helpers משותפים לכל דפי "מי נמצא".
// כל דף טוען את הקובץ הזה (אחרי supabase-js מ-CDN) לפני header.js ולפני
// קוד הדף עצמו. אין כאן build step - זה סקריפט רגיל שרץ כמו שהוא.
//
// יש למלא את שני הערכים הבאים פעם אחת, אחרי יצירת פרויקט Supabase
// (Project Settings → API → Project URL / anon public key). שני הערכים
// האלה מיועדים להיות ציבוריים - שכבת ההגנה האמיתית היא ה-RLS policies
// שמוגדרות ב-sql/schema.sql, לא הסתרת המפתחות האלה.
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STATUS_LABELS = {
  in: 'נמצא',
  partial: 'נמצא חלקית',
  out: 'לא נמצא',
  unknown: 'לא יודע עדיין',
};

const STATUS_ORDER = ['in', 'partial', 'out', 'unknown'];

// מפנה ל-login.html אם אין session פעיל. יש לקרוא לזה בתחילת כל דף
// שדורש התחברות (כל דף חוץ מ-login.html עצמו).
async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// שולף את שורת ה-profile של המשתמש המחובר (כולל is_admin/is_blocked).
async function getMyProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) {
    console.error('getMyProfile failed:', error);
    return null;
  }
  return data;
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

// עוזר עיצוב תאריך/שעה בעברית (למשל "25.07.2026 14:30").
function formatDateTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

// public_profiles אינו טבלה עם FK רגיל (זה view), אז PostgREST לא יכול
// לעשות embed אוטומטי אליו. משתמשים בזה בכל מקום שצריך שמות לפי רשימת
// מזהים (event_invitees, group_members, responses וכו').
async function fetchProfilesByIds(ids) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (!uniqueIds.length) return new Map();
  const { data, error } = await supabaseClient
    .from('public_profiles')
    .select('id, display_name, email')
    .in('id', uniqueIds);
  if (error) {
    console.error('fetchProfilesByIds failed:', error);
    return new Map();
  }
  return new Map(data.map((p) => [p.id, p]));
}

// חיפוש משתמשים לפי שם/אימייל לבורר משתתפים (event.html/group.html).
async function searchProfiles(query, excludeIds) {
  const q = query.trim().replace(/[(),%]/g, '');
  if (!q) return [];
  const { data, error } = await supabaseClient
    .from('public_profiles')
    .select('id, display_name, email')
    .or(`display_name.ilike.%${q}%,email.ilike.%${q}%`)
    .limit(10);
  if (error) {
    console.error('searchProfiles failed:', error);
    return [];
  }
  const exclude = new Set(excludeIds || []);
  return data.filter((p) => !exclude.has(p.id));
}
