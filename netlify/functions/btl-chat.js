const ALLOWED_ORIGINS = ['https://yairron.com'];
const SUMMARY_URL = 'https://yairron.com/btl/ai-summary.txt';
const MAX_QUESTION_LENGTH = 500;
const MODEL = 'claude-haiku-4-5-20251001';
const PREVIEW_LENGTH = 150;
const MAX_HISTORY_ITEMS = 3;
const MAX_HISTORY_ANSWER_LENGTH = 4000;

// תיאור קצר ואמין לכל עמוד (מבוסס על meta description האמיתי של כל דף) - משמש לאינדקס
// שהמודל רואה כדי לבחור עמוד רלוונטי. תחזוקה ידנית: כשמוסיפים עמוד חדש ל-ai-summary.txt
// יש להוסיף כאן שורה תואמת, אחרת ייפול ל-fallback האוטומטי (פחות מדויק).
const PATH_DESCRIPTIONS = {
  'additional_guides/html/additional_guides_index.html':
    'עמוד ריכוז לצפייה במסמכי PDF מקור בנושאי זכויות מול הביטוח הלאומי: אמנות בינלאומיות, גמלת זקנה מיוחדת, מקרים מיוחדים ועוד.',
  'additional_guides/html/amnot_binleumiot.html':
    'סיכום מפורט על אמנות בינלאומיות לביטחון סוציאלי: רשימת מדינות החתומות עם ישראל, עקרונות מניעת כפל תשלום וצירוף תקופות ביטוח.',
  'additional_guides/html/chovaat_hitatzbut.html':
    'מדריך לחובת התייצבות בלשכת שירות התעסוקה כתנאי לקבלת תוספת השלמת הכנסה בגיל זקנה.',
  'additional_guides/html/gamlay_zikna.html':
    'מדריך לגמלת זקנה מיוחדת לעולים חדשים ותושבים חוזרים שאינם זכאים לקצבת זקנה רגילה, כולל השוואה מול קצבה חלקית דרך אמנה.',
  'additional_guides/html/hagdarat_tluim.html':
    'ההגדרה המשפטית המדויקת (סעיף 238 לחוק) של "אלמנה", "אלמן" ו"ילד" לצורך זכאות לקצבת שאירים אחרי פטירת המבוטח/ת (תנאי נישואין, פרידה, מזונות), וכן שיעורי תוספת תלויים (8%/12.5% לבן/בת זוג, 5%/10% לילד). שים לב: זה שונה מהגדרת "בן/בת זוג" הכללית לצורך זכאות/מבחן הכנסה בקצבת זקנה עצמה - לכך ראו financial-tables-and-definitions.html.',
  'additional_guides/html/mekarim_meyuchadim.html':
    'סקירת מקרים מיוחדים וחריגים בגמלאות הביטוח הלאומי לאזרחים ותיקים.',
  'additional_guides/html/nechut_mul_shairim.html':
    'מדריך להשוואה בין קצבת נכות כללית לקצבת שאירים, כולל טבלת סכומים והבדלים מרכזיים.',
  'additional_guides/html/shaagat_haari.html':
    'דו"ח זכויות מבצע "שאגת הארי" - סיכום הזכויות והפיצויים למשרתים שהושפעו מהמבצע.',
  'additional_guides/html/takrut_hachnasa.html':
    'טבלת תקרות הכנסה לזכאות לקצבת אזרח ותיק חלקית לפי מבחן הכנסות.',
  'additional_guides/html/tkufat_achshara.html':
    'מדריך להגדרת תקופת אכשרה (תקופת הביטוח המינימלית) הנדרשת לזכאות לקצבת אזרח ותיק.',
  'additional_guides/html/yetzia_lachul.html':
    'מדריך להשפעת יציאה לחו"ל על המשך תשלום קצבת זקנה והשלמת הכנסה, כולל כללי ימי שהייה מותרים.',
  'new_immigrants/gimlat_zikna_meyuchedet.html':
    'מדריך לגמלת זיקנה מיוחדת לעולים חדשים ותושבים חוזרים שאינם זכאים לקצבת זקנה רגילה: תנאי זכאות וגובה הגמלה.',
  'new_immigrants/international_treaties.html':
    'מדריך לאמנות ביטחון סוציאלי בינלאומיות של ישראל: אילו מדינות חתומות, כיצד זה משפיע על צירוף תקופות ביטוח וזכאות לגמלה.',
  'senior_rights/financial-tables-and-definitions.html':
    'טבלאות מרוכזות של סכומים, תקרות הכנסה והגדרות מרכזיות בביטוח הלאומי לאזרחים ותיקים, מסודרות לפי נושא. כולל את הגדרת "בן/בת זוג" המדויקת לצורך זכאות/תוספת/מבחן הכנסה בקצבת זקנה עצמה (תנאי גיל, הכנסה, משך נישואין) - זה העמוד לשאלות "מה ההגדרה של בן/בת זוג" בהקשר קצבת זקנה (לא שאירים).',
  'senior_rights/imputed_income_guide.html':
    'מדריך לחישוב הכנסה רעיונית מנכסים פיננסיים לצורך בדיקת זכאות להשלמת הכנסה לגמלאי זקנה.',
  'senior_rights/nechut_vs_shairim.html':
    'מדריך השוואה בין קצבת נכות כללית לקצבת שאירים בביטוח הלאומי: הבדלי סכומים, יתרונות, סיכונים ואפשרות מעבר בין הקצבאות.',
  'senior_rights/nursing_home_guide.html':
    'מדריך מפורט לסיוע במימון בית אבות לאזרחים ותיקים: גופים מממנים, תנאי זכאות והליך הגשת בקשה.',
  'senior_rights/old_pension_income_test_full_guide.html':
    'מדריך מלא לחישוב זכאות וסכום קצבת זקנה חלקית לפי מבחן הכנסות (עבודה ונכסים), כולל דוגמאות חישוב ותקרות הכנסה מדויקות.',
  'senior_rights/senior_citizens_rights_2026.html':
    'מדריך מקיף לזכויות אזרחים ותיקים בישראל לשנת 2026: קצבת זקנה, השלמת הכנסה, סיעוד, נכות, מענקים וקישורים למקורות רשמיים.',
  'senior_rights/senior_rights_full.html':
    'מדריך מקיף לכל זכויות האזרח הוותיק בביטוח הלאומי: קצבת זקנה, השלמת הכנסה, שאירים, נכות, סיעוד וניצולי שואה במקום אחד.',
  'senior_rights/survivors_benefits_guide_2026.html':
    'מדריך מקיף לקצבת שאירים בביטוח הלאומי לשנת 2026: תנאי זכאות, סכומים, מבחן הכנסות ושאלות נפוצות.',
  'senior_rights/women_transition_benefit_guide.html':
    'מדריך למענק מעבר לנשים בגיל 62 שאינן זכאיות עדיין לקצבת זקנה: תנאי זכאות וסכום המענק.',
};

const SYSTEM_PREFIX = `אתה עוזר מידע בנושא ביטוח לאומי וזכויות אזרחים ותיקים בישראל, מבוסס על אתר yairron.com/btl.
ענה בעברית, בקצרה ובבהירות, אך ורק על סמך המידע שסופק לך (כולל אחרי שימוש בכלי get_page_content).
אם התשובה לא נמצאת במידע הזמין לך, אמור זאת בפירוש ואל תמציא ואל תנחש.

חשוב מאוד: יש כמה סוגי קצבאות שונים (זקנה, נכות כללית, שאירים, עולים חדשים ועוד),
ולעיתים יש להם תקרות הכנסה או סכומים דומים במספרים אך שונים במהות ובסוג הקצבה.
לפני שאתה עונה עם מספר, ודא בבירור שהמספר שייך בדיוק לסוג הקצבה שנשאלת עליו, ולא לקצבה
דומה/סמוכה. אם יש ספק לאיזו קצבה שייך מספר מסוים - ציין זאת במפורש בתשובה במקום לנחש.

בדומה לכך, מונחים כמו "הגדרת בן/בת זוג" או "הגדרת ילד" עשויים להופיע במספר עמודים בהקשרים שונים
לגמרי (למשל: הגדרת בן/בת זוג לצורך זכאות בקצבת זקנה עצמה, לעומת הגדרת אלמנה/אלמן לצורך זכאות
לקצבת שאירים אחרי פטירה - אלה שני נושאים שונים). ודא שהעמוד שבחרת תואם בדיוק לסוג הקצבה ולהקשר
שנשאלת עליו (למשל: "זקנה"/"אזרח ותיק" מול "שאירים"), ולא רק למונח דומה שמופיע בכותרת עמוד אחר.

חשוב לגבי עיצוב: אל תשתמש בסימני חץ (→ ← ⇒ וכדומה) בתשובה בעברית - בטקסט RTL הם
נוטים להיראות הפוכים כשמעורבבים עם מספרים. במקום חץ, כתוב מילים כמו "כלומר", "לכן",
"בהתאם לכך", או פסיק/מקף רגיל.

המידע באתר מחולק לעמודים נפרדים. למטה יש רשימה של כל העמודים הזמינים עם תקציר קצר של כל אחד.
כדי לענות על שאלה, **חובה** להשתמש בכלי get_page_content ולשלוף את התוכן המלא של עמוד רלוונטי אחד
או יותר מהרשימה - אסור לענות רק על סמך שם העמוד והתקציר הקצר, כי הם לא מכילים את הפרטים/המספרים
עצמם. אפשר לשלוף כמה עמודים אם השאלה נוגעת ליותר מנושא אחד.

חשוב מאוד לגבי אימות: אסור לך להציג מספר "מחושב" או "נגזר" (כפל, חיבור, נוסחה כלשהי)
שהגעת אליו מהזיכרון/ההיגיון שלך בלבד. אתה חייב לשלוף קודם את העמוד הרלוונטי עם
get_page_content ולוודא שהמספר או הנוסחה המדויקים מופיעים שם במפורש. אם אינך מוצא
בעמוד את הערך המבוקש בדיוק - אמור זאת בפירוש, אל "תשלים" אותו בעצמך מנוסחה שאתה
"משוכנע" שהיא נכונה.

אם המשתמש מבקש ממך לבדוק שוב, לחפש שוב באתר, או מביע ספק בתשובה שכבר נתת - זו הוראה
מפורשת לקרוא שוב לכלי get_page_content באותו רגע, גם אם כבר ענית קודם ואתה "בטוח"
בתשובה. אסור לחזור על תשובה קודמת או "לתקן" אותה מילולית בלי שליפה חדשה בפועל.

רשימת העמודים הזמינים:
`;

const GET_PAGE_TOOL = {
  name: 'get_page_content',
  description:
    'שולף את התוכן המלא של עמוד ספציפי מתוך רשימת העמודים הזמינה. יש להעביר את הנתיב המדויק כפי שהוא מופיע ברשימה.',
  input_schema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'הנתיב המדויק של העמוד כפי שמופיע ברשימת העמודים הזמינה, לדוגמה senior_rights/nechut_vs_shairim.html',
      },
    },
    required: ['path'],
  },
};

function isAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

// ai-summary.txt בנוי מסעיפים בהפרדת "===== path =====" (ראו build_ai_summary.py) -
// מפרקים לפי זה במקום לשלוח את כל הקובץ (328KB, ~253K טוקנים - מעל למגבלת ההקשר של המודל).
function parseSections(text) {
  const markerRe = /=====\s+(.+?)\s+=====/g;
  const markers = [];
  let match;
  while ((match = markerRe.exec(text)) !== null) {
    markers.push({ path: match[1].trim(), start: match.index, contentStart: match.index + match[0].length });
  }
  return markers.map((m, i) => {
    const end = i + 1 < markers.length ? markers[i + 1].start : text.length;
    return { path: m.path, content: text.slice(m.contentStart, end).trim() };
  });
}

function previewOf(content) {
  const line = content
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length >= 8 && /[א-ת]/.test(l));
  return (line || '').slice(0, PREVIEW_LENGTH);
}

async function callClaude(messages, systemPrompt, tools, toolChoice) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      // system prompt זהה (אינדקס העמודים) נשלח שוב בכל סבב tool-use ובכל שאלת המשך
      // עם ההיסטוריה - cache_control מוזיל קריאות חוזרות בכ-90%. חשוב: ל-Haiku 4.5 יש
      // סף מינימום 4096 טוקנים להפעלת המטמון - ראו לוג cache usage למטה אם זה בפועל מופעל.
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages,
      ...(tools ? { tools } : {}),
      ...(toolChoice ? { tool_choice: toolChoice } : {}),
    }),
  });
}

function logCacheUsage(label, data) {
  const u = data?.usage;
  if (!u) return;
  console.log(
    `[cache] ${label}: creation=${u.cache_creation_input_tokens ?? 0} read=${u.cache_read_input_tokens ?? 0} input=${u.input_tokens ?? 0}`
  );
}

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 529]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// עומס זמני/rate-limit בצד Anthropic קורה מדי פעם - ניסיון חוזר יחיד אחרי השהיה קצרה
// פותר את רוב המקרים בלי להוסיף מורכבות של backoff מלא.
async function callClaudeWithRetry(messages, systemPrompt, tools, toolChoice) {
  let res = await callClaude(messages, systemPrompt, tools, toolChoice);
  if (!res.ok && TRANSIENT_STATUSES.has(res.status)) {
    await sleep(800);
    res = await callClaude(messages, systemPrompt, tools, toolChoice);
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

  let question, history;
  try {
    ({ question, history } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'בקשה לא תקינה' }) };
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'לא התקבלה שאלה' }) };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return { statusCode: 400, body: JSON.stringify({ error: 'השאלה ארוכה מדי' }) };
  }

  if (history === undefined) {
    history = [];
  } else if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
    return { statusCode: 400, body: JSON.stringify({ error: 'היסטוריה לא תקינה' }) };
  } else {
    for (const item of history) {
      if (
        !item ||
        typeof item.question !== 'string' ||
        typeof item.answer !== 'string' ||
        item.question.length > MAX_QUESTION_LENGTH ||
        item.answer.length > MAX_HISTORY_ANSWER_LENGTH
      ) {
        return { statusCode: 400, body: JSON.stringify({ error: 'היסטוריה לא תקינה' }) };
      }
    }
  }

  let sections;
  try {
    const summaryRes = await fetch(SUMMARY_URL);
    if (!summaryRes.ok) throw new Error(`summary status ${summaryRes.status}`);
    sections = parseSections(await summaryRes.text());
    if (sections.length === 0) throw new Error('no sections parsed');
  } catch (err) {
    console.error('Failed to load site content:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'שגיאה בטעינת תוכן האתר' }) };
  }

  const sectionsByPath = new Map(sections.map((s) => [s.path, s.content]));
  const indexText = sections
    .map((s) => `- ${s.path}: ${PATH_DESCRIPTIONS[s.path] || previewOf(s.content)}`)
    .join('\n');

  const systemPrompt = SYSTEM_PREFIX + indexText;

  const messages = [];
  for (const item of history) {
    messages.push({ role: 'user', content: item.question });
    messages.push({ role: 'assistant', content: item.answer });
  }
  messages.push({ role: 'user', content: question });
  const MAX_TOOL_ROUNDS = 3;

  try {
    // מאלצים קריאה לכלי בסבב הראשון (tool_choice: any) - לא סומכים על ההנחיה בטקסט
    // בלבד, כי המודל עלול "לדלג" עליה ולענות ישר מהזיכרון (זה בדיוק מה שקרה בפועל).
    // אחרי שהוא רואה תוכן אמיתי הוא עדיין חופשי לומר "אין לי מידע" אם זה לא רלוונטי -
    // האילוץ הוא רק על עצם השליפה, לא על תוכן התשובה הסופית.
    let apiRes = await callClaudeWithRetry(messages, systemPrompt, [GET_PAGE_TOOL], { type: 'any' });
    if (!apiRes.ok) {
      console.error('Anthropic API error:', apiRes.status, await apiRes.text());
      return { statusCode: 502, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
    }
    let data = await apiRes.json();
    logCacheUsage('initial', data);
    let round = 0;

    // המודל עשוי לרצות לשלוף עוד עמוד גם אחרי סבב ראשון - חייבים להשאיר את הכלי
    // זמין בכל סבב (לא רק בראשון), אחרת הוא רק "מספר" בטקסט שהוא הולך לחפש
    // ולא באמת מבצע את זה, והשיחה נתקעת. מוגבל למספר סבבים כדי למנוע לולאה אינסופית.
    while (data.stop_reason === 'tool_use' && round < MAX_TOOL_ROUNDS) {
      round++;
      // המודל עשוי לבקש כמה עמודים במקביל (כמה בלוקי tool_use בתגובה אחת) -
      // Anthropic דורש tool_result תואם לכל אחד מהם, אחרת מתקבלת שגיאת 400.
      const toolUses = data.content.filter((b) => b.type === 'tool_use');

      const toolResults = toolUses.map((toolUse) => {
        const requestedPath = String(toolUse.input?.path || '').replace(/^\/+/, '');
        const content = sectionsByPath.get(requestedPath);
        const toolResultText = content !== undefined ? content : 'העמוד המבוקש אינו קיים ברשימת העמודים הידועה.';
        return { type: 'tool_result', tool_use_id: toolUse.id, content: toolResultText };
      });

      messages.push({ role: 'assistant', content: data.content });
      messages.push({ role: 'user', content: toolResults });

      const allowTool = round < MAX_TOOL_ROUNDS;
      apiRes = await callClaudeWithRetry(messages, systemPrompt, allowTool ? [GET_PAGE_TOOL] : null);
      if (!apiRes.ok) {
        console.error('Anthropic API error (follow-up):', apiRes.status, await apiRes.text());
        return { statusCode: 502, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
      }
      data = await apiRes.json();
      logCacheUsage(`round ${round}`, data);
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
