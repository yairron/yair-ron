// gps-upload-temp-store.js
// ==========================
// אחסון זמני וחד-פעמי לקובץ GPX שנבחר עכשיו מהמחשב ב-YR1/bike/gps_upload/gps_upload.html,
// כדי שכפתור "עריכת קובץ" יוכל לפתוח את gpx.studio עם הקובץ טעון בפועל (gpx.studio/app
// דורש כתובת HTTPS ציבורית לכל קובץ - ראו gps_upload.html - לקובץ שרק נבחר מהמחשב אין
// כתובת כזו בלי השלב הזה).
//
// POST { content: "<טקסט GPX גולמי>" } -> { id: "<uuid>.gpx" }  (רק מ-yairron.com, ראו isAllowedOrigin)
// GET  ?id=<uuid>.gpx                  -> תוכן הקובץ, Content-Type: application/gpx+xml
//                                          (פתוח לכל origin - כך gpx.studio עצמו יכול לשלוף)
//
// חשוב - Functions v2 (export default), לא v1 (exports.handler) כמו שאר הפונקציות כאן:
// אומת בפועל (21.08.2026, שגיאת MissingBlobsEnvironmentError ב-curl ישיר מול ה-endpoint
// החי) ש-Netlify Blobs מזריק siteID/token אוטומטית רק בפונקציות v2 - ב-v1 הם פשוט חסרים.
// זה שינוי מבודד לקובץ הזה בלבד; _redirects ממשיך לעבוד אותו דבר (עדיין
// /.netlify/functions/gps-upload-temp-store), ושאר הפונקציות (v1) לא נגעו בהן.
//
// חד-פעמי במכוון: הערך נמחק מיד אחרי שנשלף בהצלחה (delete-on-read) - אין צורך במנגנון
// תפוגה/ניקוי נפרד, כי המטרה היחידה היא לתת ל-gpx.studio הזדמנות שליפה אחת.
//
// חשוב - מגבלת גודל בפועל: בדיקה חיה (21.08.2026) הראתה שקובץ יום רכיבה בודד אמיתי
// שנוסף לאחרונה ל-route_catalog הגיע ל-3.1MB - ערך MAX_CONTENT_BYTES כאן מוגדר בהתאם
// (15MB, מרווח בטחון נדיב מעל זה), אבל אין וודאות מלאה על תקרת גודל-payload בפועל
// של Functions v2 עצמן - לא אומת ישירות.
import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';

const ALLOWED_ORIGINS = ['https://yairron.com'];
const STORE_NAME = 'gps-upload-temp';
const MAX_CONTENT_BYTES = 15 * 1024 * 1024;
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.gpx$/i;

function isAllowedOrigin(req) {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const store = getStore(STORE_NAME);

  if (req.method === 'POST') {
    if (!isAllowedOrigin(req)) {
      return json(403, { error: 'מקור לא מורשה' });
    }
    let payload;
    try {
      payload = await req.json();
    } catch {
      return json(400, { error: 'בקשה לא תקינה' });
    }
    const content = payload.content;
    if (typeof content !== 'string' || !content.trim()) {
      return json(400, { error: 'לא התקבל תוכן קובץ' });
    }
    if (Buffer.byteLength(content, 'utf8') > MAX_CONTENT_BYTES) {
      return json(413, { error: 'הקובץ גדול מדי' });
    }
    // סיומת .gpx כחלק מה-id עצמו (לא רק ב-URL) - gpx.studio קובע את שם/סוג הקובץ לפי
    // הרכיב האחרון בנתיב ה-URL (url.split('/').pop()), לא לפי Content-Type, ראו +page.svelte.
    const id = `${randomUUID()}.gpx`;
    await store.set(id, content);
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    // redirect מסוג rewrite (200, ראו _redirects) מנתב את הבקשה לפונקציה הזו בלי
    // לשנות בפועל את ה-URL שהפונקציה רואה (אומת בפועל, 21.08.2026) - לכן כשמגיעים
    // דרך /api/gps-temp/<id> אין ?id= בכלל ב-req.url, ושולפים את ה-id מהרכיב האחרון
    // בנתיב עצמו. גישה ישירה ל-/.netlify/functions/...?id=<id> (למשל לבדיקה) עדיין
    // נתמכת דרך ה-query param.
    let id = url.searchParams.get('id') || '';
    if (!id) {
      const segments = url.pathname.split('/').filter(Boolean);
      id = segments[segments.length - 1] || '';
    }
    if (!ID_PATTERN.test(id)) {
      return new Response('Bad Request', { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    const content = await store.get(id);
    if (content === null) {
      return new Response('Not Found', { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    await store.delete(id);
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/gpx+xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  }

  return json(405, { error: 'Method Not Allowed' });
};
