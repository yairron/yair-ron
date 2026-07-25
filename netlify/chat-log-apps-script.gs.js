// Google Apps Script - נקודת קצה (Web App) לרישום שאלות שנשאלו בצ'אט ה-AI של BTL.
//
// הקובץ הזה **לא** נפרס דרך Netlify/git - הוא נשמר כאן רק לתיעוד ולבקרת גרסאות.
// כדי להפעיל בפועל: להדביק את התוכן לתוך עורך ה-Apps Script המצורף לגיליון
// Google Sheet ייעודי (בגיליון: Extensions → Apps Script), ואז לפרסם כ-Web App
// (Deploy → New deployment → סוג "Web app" → Execute as: Me →
// Who has access: Anyone - חובה, כי הפונקציה ב-Netlify קוראת אליו כבקשה אנונימית
// בלי OAuth). הפריסה מחזירה כתובת כמו https://script.google.com/macros/s/XXX/exec -
// יש לשמור אותה כמשתנה סביבה CHAT_LOG_WEBHOOK_URL ב-Netlify (לא בקוד).
//
// מה נשמר בגיליון: רק טקסט השאלה + חותמת זמן. בכוונה לא IP, לא session, לא שום
// מזהה אחר - השאלות כאן נוגעות למידע רגיש (בריאות/משפחה/הגירה/הכנסות), ראו הדיון
// ב-CLAUDE.md על שיקולי פרטיות לפני שמוסיפים כאן שדות נוספים.
//
// הכינו מראש בגיליון עצמו שורת כותרות: Timestamp | Question

// טוקן סודי משותף - יש להחליף בערך אקראי משלכם, ולשמור את אותו ערך גם כמשתנה
// סביבה CHAT_LOG_SECRET ב-Netlify. הגנה נוספת מעבר לכך שכתובת ה-Web App עצמה כבר
// קשה לניחוש - מונע כתיבה לגיליון על ידי מי שבכל זאת מגלה את הכתובת.
const SHARED_SECRET = 'REPLACE_WITH_RANDOM_SECRET';

function doPost(e) {
  try {
    // e.postData.contents לפעמים מפענח לא נכון תווים שאינם לטיניים (עברית וכו') -
    // תקלה מתועדת של Apps Script. getDataAsString('UTF-8') הוא הפתרון הנכון.
    const body = JSON.parse(e.postData.getDataAsString('UTF-8'));

    if (body.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const question = String(body.question || '').trim();
    if (!question) {
      return jsonResponse({ ok: false, error: 'missing question' });
    }

    // הגבלת אורך הגנתית - זהה ל-MAX_QUESTION_LENGTH הקיים ב-btl-chat.js, ליתר ביטחון
    // גם אם מישהו קורא לנקודת הקצה הזו ישירות בלי לעבור דרך הפונקציה.
    const safeQuestion = question.slice(0, 500);
    const timestamp = String(body.timestamp || new Date().toISOString());

    SpreadsheetApp.getActiveSpreadsheet()
      .getActiveSheet()
      .appendRow([timestamp, safeQuestion]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
