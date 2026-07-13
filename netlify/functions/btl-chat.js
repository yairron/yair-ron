const ALLOWED_ORIGINS = ['https://yairron.com'];
const SUMMARY_URL = 'https://yairron.com/btl/ai-summary.txt';
const SITEMAP_URL = 'https://yairron.com/btl/sitemap.xml';
const SITE_BASE = 'https://yairron.com/btl/';
const MAX_QUESTION_LENGTH = 500;
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PREFIX = `אתה עוזר מידע בנושא ביטוח לאומי וזכויות אזרחים ותיקים בישראל, מבוסס על אתר yairron.com/btl.
ענה בעברית, בקצרה ובבהירות, אך ורק על סמך המידע שסופק לך.
אם התשובה לא נמצאת במידע הזמין לך (כולל אחרי שימוש בכלי get_page_content), אמור זאת בפירוש ואל תמציא ואל תנחש.

חשוב מאוד: הסיכום מכיל כמה סוגי קצבאות שונים (זקנה, נכות כללית, שאירים, עולים חדשים ועוד),
ולעיתים יש להם תקרות הכנסה או סכומים דומים במספרים אך שונים במהות ובסוג הקצבה.
לפני שאתה עונה עם מספר, ודא בבירור שהמספר שייך בדיוק לסוג הקצבה שנשאלת עליו, ולא לקצבה
דומה/סמוכה בטקסט. אם יש ספק לאיזו קצבה שייך מספר מסוים - ציין זאת במפורש בתשובה במקום לנחש.

חשוב לגבי עיצוב: אל תשתמש בסימני חץ (→ ← ⇒ וכדומה) בתשובה בעברית - בטקסט RTL הם
נוטים להיראות הפוכים כשמעורבבים עם מספרים. במקום חץ, כתוב מילים כמו "כלומר", "לכן",
"בהתאם לכך", או פסיק/מקף רגיל.

סיכום תוכן האתר:
`;

const GET_PAGE_TOOL = {
  name: 'get_page_content',
  description:
    'שולף את התוכן המלא של עמוד ספציפי מתוך אתר yairron.com/btl, לשימוש כאשר הסיכום שסופק אינו מפורט מספיק כדי לענות על השאלה. יש להעביר נתיב מדויק מתוך רשימת העמודים הידועה שסופקה.',
  input_schema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'הנתיב היחסי של העמוד תחת yairron.com/btl/, לדוגמה senior_rights/nechut_vs_shairim',
      },
    },
    required: ['path'],
  },
};

function isAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSitemapPaths(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches
    .map((m) => m[1].replace(SITE_BASE, ''))
    .filter((p) => p !== '');
}

async function callClaude(messages, systemPrompt, tools) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages,
      ...(tools ? { tools } : {}),
    }),
  });
}

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 529]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// עומס זמני/rate-limit בצד Anthropic קורה מדי פעם - ניסיון חוזר יחיד אחרי השהיה קצרה
// פותר את רוב המקרים בלי להוסיף מורכבות של backoff מלא.
async function callClaudeWithRetry(messages, systemPrompt, tools) {
  let res = await callClaude(messages, systemPrompt, tools);
  if (!res.ok && TRANSIENT_STATUSES.has(res.status)) {
    await sleep(800);
    res = await callClaude(messages, systemPrompt, tools);
  }
  return res;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!isAllowedOrigin(event)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'מקור לא מורשה' }) };
  }

  let question;
  try {
    ({ question } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'בקשה לא תקינה' }) };
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'לא התקבלה שאלה' }) };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return { statusCode: 400, body: JSON.stringify({ error: 'השאלה ארוכה מדי' }) };
  }

  let summary;
  let sitemapPaths = [];
  try {
    const [summaryRes, sitemapRes] = await Promise.all([fetch(SUMMARY_URL), fetch(SITEMAP_URL)]);
    if (!summaryRes.ok) throw new Error(`summary status ${summaryRes.status}`);
    summary = await summaryRes.text();
    if (sitemapRes.ok) {
      sitemapPaths = extractSitemapPaths(await sitemapRes.text());
    }
  } catch (err) {
    console.error('Failed to load site content:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'שגיאה בטעינת תוכן האתר' }) };
  }

  const systemPrompt =
    SYSTEM_PREFIX +
    summary +
    (sitemapPaths.length
      ? `\n\nאם הסיכום אינו מספיק מפורט לשאלה, אפשר להשתמש בכלי get_page_content כדי לשלוף עמוד מלא מתוך הרשימה הבאה:\n${sitemapPaths.join('\n')}`
      : '');

  const messages = [{ role: 'user', content: question }];
  const MAX_TOOL_ROUNDS = 3;

  try {
    let apiRes = await callClaudeWithRetry(messages, systemPrompt, [GET_PAGE_TOOL]);
    if (!apiRes.ok) {
      console.error('Anthropic API error:', apiRes.status, await apiRes.text());
      return { statusCode: 502, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
    }
    let data = await apiRes.json();
    let round = 0;

    // המודל עשוי לרצות לשלוף עוד עמוד גם אחרי סבב ראשון - חייבים להשאיר את הכלי
    // זמין בכל סבב (לא רק בראשון), אחרת הוא רק "מספר" בטקסט שהוא הולך לחפש
    // ולא באמת מבצע את זה, והשיחה נתקעת. מוגבל למספר סבבים כדי למנוע לולאה אינסופית.
    while (data.stop_reason === 'tool_use' && round < MAX_TOOL_ROUNDS) {
      round++;
      // המודל עשוי לבקש כמה עמודים במקביל (כמה בלוקי tool_use בתגובה אחת) -
      // Anthropic דורש tool_result תואם לכל אחד מהם, אחרת מתקבלת שגיאת 400.
      const toolUses = data.content.filter((b) => b.type === 'tool_use');

      const toolResults = await Promise.all(
        toolUses.map(async (toolUse) => {
          const requestedPath = String(toolUse.input?.path || '').replace(/^\/+/, '');
          let toolResultText;

          if (!sitemapPaths.includes(requestedPath)) {
            toolResultText = 'העמוד המבוקש אינו קיים ברשימת העמודים הידועה.';
          } else {
            try {
              const pageRes = await fetch(SITE_BASE + requestedPath);
              toolResultText = pageRes.ok ? stripHtml(await pageRes.text()).slice(0, 20000) : 'שגיאה בטעינת העמוד המבוקש.';
            } catch {
              toolResultText = 'שגיאה בטעינת העמוד המבוקש.';
            }
          }

          return { type: 'tool_result', tool_use_id: toolUse.id, content: toolResultText };
        })
      );

      messages.push({ role: 'assistant', content: data.content });
      messages.push({ role: 'user', content: toolResults });

      const allowTool = round < MAX_TOOL_ROUNDS;
      apiRes = await callClaudeWithRetry(messages, systemPrompt, allowTool ? [GET_PAGE_TOOL] : null);
      if (!apiRes.ok) {
        console.error('Anthropic API error (follow-up):', apiRes.status, await apiRes.text());
        return { statusCode: 502, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
      }
      data = await apiRes.json();
    }

    const answer = data.content?.find((b) => b.type === 'text')?.text || 'לא הצלחתי לענות על השאלה.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error('btl-chat function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'שגיאה כללית' }) };
  }
};
