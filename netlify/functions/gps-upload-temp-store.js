// gps-upload-temp-store.js
// ==========================
// אחסון זמני וחד-פעמי לקובץ GPX שנבחר עכשיו מהמחשב ב-YR1/bike/gps_upload/gps_upload.html,
// כדי שכפתור "עריכת קובץ" יוכל לפתוח את gpx.studio עם הקובץ טעון בפועל (gpx.studio/app
// דורש כתובת HTTPS ציבורית לכל קובץ - ראו gpx_upload.html - לקובץ שרק נבחר מהמחשב אין
// כתובת כזו בלי השלב הזה).
//
// POST { content: "<טקסט GPX גולמי>" } -> { id: "<uuid>.gpx" }  (רק מ-yairron.com, ראו isAllowedOrigin)
// GET  ?id=<uuid>.gpx                  -> תוכן הקובץ, Content-Type: application/gpx+xml
//                                          (פתוח לכל origin - כך gpx.studio עצמו יכול לשלוף)
//
// משתמש ב-Netlify Blobs (getStore) - תכונה מובנית של Netlify, ללא צורך ב-package.json/
// npm install בריפו (בניגוד למה שנשקל ונדחה בעבר עבור btl-chat, ראו CLAUDE.md - שם זה
// היה על תלות rate-limiting, לא על אחסון זמני כמו כאן). Netlify מגדיר את get Store()
// אוטומטית בסביבת ההרצה בפועל (production), בלי קובץ קונפיגורציה נוסף.
//
// חד-פעמי במכוון: הערך נמחק מיד אחרי שנשלף בהצלחה (delete-on-read) - אין צורך במנגנון
// תפוגה/ניקוי נפרד, כי המטרה היחידה היא לתת ל-gpx.studio הזדמנות שליפה אחת.
//
// חשוב - מגבלת גודל בפועל: Netlify Functions ה"קלאסיות" (exports.handler, כמו כל שאר
// הפונקציות כאן) רצות על AWS Lambda מאחורי הקלעים, עם תקרת payload סינכרונית של כ-6MB.
// קבצי GPX חדשים שמוקלטים ליום רכיבה בודד כמעט תמיד קטנים בהרבה מזה (בדיקה בפועל,
// 21.08.2026: חציון הקבצים הקיימים ב-route_catalog הוא כ-350KB) - אבל קובץ ענק במיוחד
// עדיין עלול להיכשל על התקרה הזו לפני שהוא מגיע לבדיקת MAX_CONTENT_BYTES כאן בכלל.
const { getStore } = require('@netlify/blobs');
const crypto = require('crypto');

const ALLOWED_ORIGINS = ['https://yairron.com'];
const STORE_NAME = 'gps-upload-temp';
const MAX_CONTENT_BYTES = 15 * 1024 * 1024;
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.gpx$/i;

function isAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const store = getStore(STORE_NAME);

  if (event.httpMethod === 'POST') {
    if (!isAllowedOrigin(event)) {
      return { statusCode: 403, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'מקור לא מורשה' }) };
    }
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'בקשה לא תקינה' }) };
    }
    const content = payload.content;
    if (typeof content !== 'string' || !content.trim()) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'לא התקבל תוכן קובץ' }) };
    }
    if (Buffer.byteLength(content, 'utf8') > MAX_CONTENT_BYTES) {
      return { statusCode: 413, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'הקובץ גדול מדי' }) };
    }
    // סיומת .gpx כחלק מה-id עצמו (לא רק ב-URL) - gpx.studio קובע את שם/סוג הקובץ לפי
    // הרכיב האחרון בנתיב ה-URL (url.split('/').pop()), לא לפי Content-Type, ראו +page.svelte.
    const id = `${crypto.randomUUID()}.gpx`;
    await store.set(id, content);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ id }),
    };
  }

  if (event.httpMethod === 'GET') {
    const id = (event.queryStringParameters || {}).id || '';
    if (!ID_PATTERN.test(id)) {
      return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'Bad Request' };
    }
    const content = await store.get(id);
    if (content === null) {
      return { statusCode: 404, headers: { 'Access-Control-Allow-Origin': '*' }, body: 'Not Found' };
    }
    await store.delete(id);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/gpx+xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
      body: content,
    };
  }

  return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
};
