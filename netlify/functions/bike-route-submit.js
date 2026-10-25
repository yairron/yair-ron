// bike-route-submit.js
// =====================
// מקבל הגשה מטופס "הוספת מסלול" (YR1/bike/add_route/add_route.html) ומעביר אותה ל-Google
// Apps Script ששולח אותה במייל עם קובץ ה-GPX מצורף (ראו netlify/bike-route-submit-apps-script.gs.js).
//
// התפקיד כאן: לבדוק מקור, גודל ושדות, ולהוסיף את הטוקן הסודי וכתובת ה-IP (להגבלת קצב
// בצד ה-Apps Script) - כך שכתובת ה-Apps Script והטוקן לא מופיעים בדף עצמו.
//
// משתני סביבה ב-Netlify: BIKE_ROUTE_SUBMIT_URL (כתובת ה-Web App, .../exec) ו-
// BIKE_ROUTE_SUBMIT_SECRET (אותו ערך כמו SECRET ב-Script Properties של ה-Apps Script).
//
// קובץ ה-GPX מגיע דחוס ב-gzip ומקודד base64 (gpxBase64, gzip:true): Netlify מגביל גוף בקשה
// לפונקציה ל-6MB, ו-base64 של קובץ 5MB לא דחוס היה מגיע ל-6.7MB. דפדפן בלי CompressionStream
// שולח לא דחוס (gzip:false), ואז הדף עצמו מגביל ל-4MB.

const ALLOWED_ORIGINS = ['https://yairron.com'];
const MAX_BASE64_CHARS = 5.5 * 1024 * 1024;
const TEXT_LIMITS = { routeName: 120, fileName: 150, notes: 3000, places: 500, senderName: 100,
  senderEmail: 200, recordedDate: 20, drivingNote: 300 };
const NUMBER_FIELDS = ['distanceKm', 'climbM', 'descentM', 'startLat', 'startLon'];

function isAllowedOrigin(req) {
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method Not Allowed' });
  if (!isAllowedOrigin(req)) return json(403, { error: 'מקור לא מורשה' });

  const url = process.env.BIKE_ROUTE_SUBMIT_URL;
  const secret = process.env.BIKE_ROUTE_SUBMIT_SECRET;
  if (!url || !secret) {
    // שמות המשתנים לא סודיים - מוצגים כדי שיהיה ברור מה חסר בהגדרות Netlify
    const missing = [!url && 'BIKE_ROUTE_SUBMIT_URL', !secret && 'BIKE_ROUTE_SUBMIT_SECRET'].filter(Boolean).join(', ');
    return json(503, { error: 'שליחת הטופס עדיין לא הוגדרה באתר', missing });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'בקשה לא תקינה' });
  }

  // שדה מלכודת לבוטים - מוסתר בדף, אדם לא ממלא אותו. מחזירים "הצלחה" בלי לשלוח.
  if (body.website) return json(200, { ok: true });

  const gpxBase64 = body.gpxBase64;
  if (typeof gpxBase64 !== 'string' || !gpxBase64 || !/^[A-Za-z0-9+/=]+$/.test(gpxBase64)) {
    return json(400, { error: 'לא התקבל קובץ GPX' });
  }
  if (gpxBase64.length > MAX_BASE64_CHARS) return json(413, { error: 'הקובץ גדול מדי (מקסימום 5MB)' });

  const payload = { secret, gpxBase64, gzip: body.gzip === true,
    clientIp: req.headers.get('x-nf-client-connection-ip') || '' };
  for (const [key, max] of Object.entries(TEXT_LIMITS)) {
    payload[key] = String(body[key] ?? '').trim().slice(0, max);
  }
  for (const key of NUMBER_FIELDS) {
    const n = Number(body[key]);
    payload[key] = body[key] === null || body[key] === undefined || !Number.isFinite(n) ? null : n;
  }
  if (!payload.routeName) return json(400, { error: 'חסר שם מסלול' });

  try {
    // text/plain ולא application/json - Apps Script משבש עברית בגוף JSON (תקלה מתועדת,
    // ראו netlify/chat-log-apps-script.gs.js). הגוף עצמו עדיין JSON תקני.
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const result = await resp.json();
    if (result.ok) return json(200, { ok: true });
    if (String(result.error || '').startsWith('rate limit')) {
      return json(429, { error: 'נשלחו יותר מדי מסלולים בזמן קצר. אפשר לנסות שוב מאוחר יותר.' });
    }
    console.error('apps script error:', result.error);
    return json(502, { error: 'השליחה נכשלה. אפשר לנסות שוב מאוחר יותר.' });
  } catch (err) {
    console.error('apps script fetch failed:', err);
    return json(502, { error: 'השליחה נכשלה. אפשר לנסות שוב מאוחר יותר.' });
  }
};
