// אפליקציית "מי נמצא" (YR1/whoIn) - פעולות ניהול משתמשים שחייבות Supabase
// Service Role Key (סוד שאסור שיהיה בלקוח): חסימה/ביטול חסימה/מחיקה של
// משתמש, דרך Supabase Auth Admin API. מחיקת אירועים לא עוברת דרך כאן -
// זו פעולת מחיקת שורה רגילה שנאכפת ב-RLS (is_admin() או creator_id).
//
// באותו דפוס בדיוק כמו netlify/functions/btl-chat.js: בדיקת method,
// בדיקת Origin, ולידציית גוף הבקשה, headers משותפים, שגיאות בעברית.
// משתמש רק ב-fetch הגלובלי (Node 18+) - בלי תלות npm חדשה.

const ALLOWED_ORIGINS = ['https://yairron.com'];
const NO_STORE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const ALLOWED_ACTIONS = ['block', 'unblock', 'delete'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BAN_DURATION = '87600h'; // 10 שנים - קרוב ל"לצמיתות" בלי ban_duration שלילי לא נתמך

function isAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function jsonResponse(statusCode, body) {
  return { statusCode, headers: NO_STORE_HEADERS, body: JSON.stringify(body) };
}

async function getCallerId(accessToken) {
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.id || null;
}

async function isCallerAdmin(callerId) {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${callerId}&select=is_admin`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return Boolean(rows[0] && rows[0].is_admin);
}

async function setBan(userId, banDuration) {
  return fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ban_duration: banDuration }),
  });
}

async function setBlockedFlag(userId, isBlocked) {
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ is_blocked: isBlocked }),
  });
}

async function deleteUser(userId) {
  return fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'Method Not Allowed' });
  }
  if (!isAllowedOrigin(event)) {
    return jsonResponse(403, { ok: false, error: 'מקור לא מורשה' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { ok: false, error: 'בקשה לא תקינה' });
  }

  const { action, userId } = body;
  if (!ALLOWED_ACTIONS.includes(action)) {
    return jsonResponse(400, { ok: false, error: 'פעולה לא מוכרת' });
  }
  if (typeof userId !== 'string' || !UUID_RE.test(userId)) {
    return jsonResponse(400, { ok: false, error: 'מזהה משתמש לא תקין' });
  }

  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const accessToken = authHeader.replace(/^Bearer\s+/i, '');
  if (!accessToken) {
    return jsonResponse(401, { ok: false, error: 'לא מחובר' });
  }

  const callerId = await getCallerId(accessToken);
  if (!callerId) {
    return jsonResponse(401, { ok: false, error: 'לא מחובר' });
  }
  if (callerId === userId) {
    return jsonResponse(400, { ok: false, error: 'לא ניתן לבצע פעולה זו על עצמך' });
  }

  const admin = await isCallerAdmin(callerId);
  if (!admin) {
    return jsonResponse(403, { ok: false, error: 'אין הרשאת מנהל מערכת' });
  }

  try {
    if (action === 'block') {
      const banRes = await setBan(userId, BAN_DURATION);
      if (!banRes.ok) return jsonResponse(502, { ok: false, error: 'חסימה נכשלה' });
      await setBlockedFlag(userId, true);
    } else if (action === 'unblock') {
      const banRes = await setBan(userId, 'none');
      if (!banRes.ok) return jsonResponse(502, { ok: false, error: 'ביטול חסימה נכשל' });
      await setBlockedFlag(userId, false);
    } else if (action === 'delete') {
      const delRes = await deleteUser(userId);
      if (!delRes.ok) return jsonResponse(502, { ok: false, error: 'מחיקה נכשלה' });
    }
  } catch (err) {
    return jsonResponse(500, { ok: false, error: 'שגיאה כללית' });
  }

  return jsonResponse(200, { ok: true });
};
