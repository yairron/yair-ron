# מי נמצא

אפליקציית "מי נמצא" — פתיחת אירועים ותשובות נוכחות (נמצא/נמצא חלקית/לא נמצא/לא יודע עדיין), קבוצות הזמנה, וניהול מערכת. ראו את התכנון המלא ב-`CLAUDE.md` בשורש הריפו.

## הקמה חד-פעמית

1. **יצירת פרויקט Supabase** — [supabase.com](https://supabase.com) → New Project (חינמי). לשמור את הסיסמה של בסיס הנתונים במקום בטוח.
2. **הרצת הסכימה** — Supabase Dashboard → SQL Editor → להדביק את כל התוכן של `sql/schema.sql` → Run.
3. **הגדרות Auth** — Authentication → Providers → Email. מומלץ לכבות את "Confirm email" (Confirm email = Off) כדי שהרשמה עם אימייל+נייד תעבוד מיידית בלי מייל אישור — מתאים לקבוצה סגורה עם עד 200 משתמשים. אם משאירים דלוק, משתמש חדש יצטרך ללחוץ על קישור אימות במייל לפני שיוכל להתחבר.
4. **מילוי מפתחות בצד הלקוח** — ב-`assets/supabase-client.js`, למלא את `SUPABASE_URL` ו-`SUPABASE_ANON_KEY` (Project Settings → API). שני הערכים האלה מיועדים להיות ציבוריים.
5. **משתני סביבה ב-Netlify** — Site settings → Environment variables:
   - `SUPABASE_URL` — אותו ערך כמו למעלה.
   - `SUPABASE_ANON_KEY` — אותו ערך כמו למעלה.
   - `SUPABASE_SERVICE_ROLE_KEY` — מ-Project Settings → API → `service_role` (**סוד** - לסמן Secret. לא להכניס לקוד/git).
6. **הרשמת המשתמש הראשון** — להיכנס ל-`login.html` באתר החי ולהירשם רגיל (אימייל + שם + נייד).
7. **הפיכת המשתמש הראשון לאדמין** — SQL Editor, הרצה חד-פעמית:
   ```sql
   update public.profiles set is_admin = true where email = 'your-email@example.com';
   ```
8. פריסה: `git push` — Netlify כבר מקושר ל-GitHub ויפרוס אוטומטית.

## פיתוח מקומי

```
netlify dev
```
(יש `netlify-cli` כ-devDependency תחת `BTL/support_files/senior_rights` — או להתקין גלובלית: `npm install -g netlify-cli`). כדי שהפונקציה `whoin-admin` תעבוד מקומית, להגדיר קובץ `.env` מקומי (**לא ב-git**) עם שלושת משתני הסביבה מסעיף 5.

## מבנה

ראו את סעיף "אפליקציית מי נמצא" ב-`CLAUDE.md` בשורש הריפו לפירוט מלא של הסכימה, ה-RLS policies, ומבנה הדפים.
