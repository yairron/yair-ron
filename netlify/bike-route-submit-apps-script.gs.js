// Google Apps Script - נקודת קצה (Web App) ששולחת במייל מסלול שהוגש בטופס "הוספת מסלול"
// של קטלוג מסלולי האופניים (YR1/bike/add_route/add_route.html).
//
// הקובץ הזה **לא** נפרס דרך Netlify/git - הוא נשמר כאן רק לתיעוד ולבקרת גרסאות. ההפעלה
// בפועל: להדביק את כל התוכן בפרויקט Apps Script עצמאי (script.google.com) ולפרסם כ-Web App.
// הוראות מלאות, צעד אחר צעד: YR1/bike/route_catalog/GPX_files/scripts/README.md, הסעיף
// "טופס הוספת מסלול".
//
// הזרימה: הדפדפן -> netlify/functions/bike-route-submit.js (בודק מקור, גודל ושדות, ומוסיף
// את הטוקן הסודי) -> כאן. כאן: בודקים טוקן, מגבילים קצב, משחזרים את קובץ ה-GPX (הדף דוחס
// אותו ב-gzip כדי לעבור את מגבלת 6MB של Netlify Functions) ושולחים מייל עם הקובץ מצורף.
//
// המייל נשלח **מהחשבון שמריץ את הסקריפט אל אותו חשבון** (Execute as: Me) - לכן אין כאן
// כתובת מייל קשיחה. הטוקן הסודי נשמר ב-Script Properties בשם SECRET, לא בקוד.

const MAX_GPX_BYTES = 5 * 1024 * 1024;   // אותו מקסימום כמו בטופס (5MB)
const MAX_PER_IP_PER_HOUR = 5;          // הגנה מספאם - מאותה כתובת IP
const MAX_PER_DAY = 40;                 // תקרה כוללת, הרבה מתחת למכסת Gmail (100 מיילים ביום)

function doPost(e) {
  try {
    // getDataAsString('UTF-8') ולא e.postData.contents - האחרון משבש עברית (תקלה מתועדת
    // של Apps Script, נמצאה בפועל גם ב-netlify/chat-log-apps-script.gs.js).
    const body = JSON.parse(e.postData.getDataAsString('UTF-8'));

    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const limitError = checkRateLimit(String(body.clientIp || 'unknown'));
    if (limitError) {
      return jsonResponse({ ok: false, error: limitError });
    }

    const routeName = clean(body.routeName, 120);
    const fileName = clean(body.fileName, 150).replace(/[\\/:*?"<>|]/g, '_') || 'route.gpx';
    if (!routeName || !body.gpxBase64) {
      return jsonResponse({ ok: false, error: 'missing fields' });
    }

    let gpxBlob = Utilities.newBlob(Utilities.base64Decode(body.gpxBase64), 'application/x-gzip');
    if (body.gzip) {
      gpxBlob = Utilities.ungzip(gpxBlob);
    }
    if (gpxBlob.getBytes().length > MAX_GPX_BYTES) {
      return jsonResponse({ ok: false, error: 'file too large' });
    }
    gpxBlob.setName(/\.gpx$/i.test(fileName) ? fileName : fileName + '.gpx');
    gpxBlob.setContentType('application/gpx+xml');

    const senderEmail = clean(body.senderEmail, 200);
    const validSender = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail);
    const owner = Session.getEffectiveUser().getEmail();

    const mail = {
      to: owner,
      subject: '🚵 מסלול חדש לקטלוג: ' + routeName,
      htmlBody: buildHtml(body, routeName, fileName),
      attachments: [gpxBlob],
      name: 'קטלוג מסלולים - טופס הוספה',
    };
    if (validSender) {
      mail.replyTo = senderEmail;
    }
    MailApp.sendEmail(mail);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) });
  }
}

// מחזיר הודעת שגיאה אם חרגו מהמגבלה, אחרת null (ומעדכן את המונים).
function checkRateLimit(ip) {
  const cache = CacheService.getScriptCache();
  const ipKey = 'ip:' + ip;
  const dayKey = 'day:' + Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'yyyy-MM-dd');
  const ipCount = Number(cache.get(ipKey) || 0);
  const dayCount = Number(cache.get(dayKey) || 0);
  if (ipCount >= MAX_PER_IP_PER_HOUR) return 'rate limit (ip)';
  if (dayCount >= MAX_PER_DAY) return 'rate limit (day)';
  cache.put(ipKey, String(ipCount + 1), 60 * 60);
  cache.put(dayKey, String(dayCount + 1), 24 * 60 * 60);
  return null;
}

function buildHtml(body, routeName, fileName) {
  const rows = [
    ['שם המסלול', esc(routeName)],
    ['קובץ', esc(fileName)],
    ['מרחק', body.distanceKm != null ? esc(String(body.distanceKm)) + ' ק"מ' : ''],
    ['טיפוס / ירידה', body.climbM != null ? '↗' + esc(String(body.climbM)) + ' ↘' + esc(String(body.descentM)) + ' מ\'' : ''],
    ['תאריך ההקלטה', esc(clean(body.recordedDate, 20))],
    ['נקודת התחלה', startLink(body.startLat, body.startLon)],
    ['נסיעה ברכב', esc(clean(body.drivingNote, 300))],
    ['הערות', esc(clean(body.notes, 3000)).replace(/\n/g, '<br>')],
    ['מקומות עניין', esc(clean(body.places, 500))],
    ['שם השולח', esc(clean(body.senderName, 100))],
    ['מייל השולח', esc(clean(body.senderEmail, 200))],
  ];
  const tr = rows
    .filter(function (r) { return r[1]; })
    .map(function (r) {
      return '<tr><th style="text-align:right;padding:6px 10px;background:#F2F8F3;white-space:nowrap">' + r[0] +
        '</th><td style="padding:6px 10px">' + r[1] + '</td></tr>';
    }).join('');
  return '<div dir="rtl" style="font-family:Arial,sans-serif;font-size:14px">' +
    '<h2 style="color:#1F6B4C">מסלול חדש הוגש בטופס "הוספת מסלול"</h2>' +
    '<table style="border-collapse:collapse;border:1px solid #CFE0D3">' + tr + '</table>' +
    '<p style="color:#5C7A6B">קובץ ה-GPX מצורף. להוספה לקטלוג: לשמור אותו בתיקיית GPX_files, ' +
    'ולהוסיף את ההערות והמקומות לגיליון route-notes.</p></div>';
}

function startLink(lat, lon) {
  lat = Number(lat);
  lon = Number(lon);
  if (!isFinite(lat) || !isFinite(lon)) return '';
  const text = lat.toFixed(6) + ', ' + lon.toFixed(6);
  return '<a href="https://www.google.com/maps?q=' + lat + ',' + lon + '">' + text + '</a>';
}

function clean(value, maxLen) {
  return String(value == null ? '' : value).trim().slice(0, maxLen);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// להרצה ידנית מהעורך (בחירת testSetup ולחיצה על Run) - מבקש את הרשאת שליחת המייל
// ושולח אליך מייל בדיקה קצר, בלי לעבור דרך האתר.
function testSetup() {
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'בדיקת טופס הוספת מסלול', 'הסקריפט מורשה לשלוח מיילים.');
}
