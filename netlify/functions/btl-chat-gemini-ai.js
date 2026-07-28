const fs = require('fs');
const path = require('path');

// מימוש מקביל ל-btl-chat-claude-ai.js, מבוסס Google Gemini במקום Anthropic Claude.
// נוסף 28.07.2026 כחלק מארכיטקטורת "שני ספקים במקביל" - ראו CLAUDE.md, סעיף
// "עוזר AI (צ'אט) באתר". שני הקבצים אמורים להתקיים זה לצד זה ב-git בו-זמנית;
// ההחלפה בפועל נעשית במקום אחד ויחיד - היעד של השורה /api/btl-chat ב-_redirects.
// **בכוונה יש כאן כפילות קוד** מול btl-chat-claude-ai.js (במקום חילוץ למודול
// משותף) - הוחלט במפורש לא לגעת בקובץ הקלוד הקיים כדי לא לסכן אותו כלל, גם
// לא ברפקטור "בטוח" לכאורה.

const ALLOWED_ORIGINS = ['https://yairron.com'];
const CONTENT_DIR = path.join(__dirname, '..', '..', 'BTL', 'ai-content');
const CONTENT_FILES = [
  'btl-faq.html',
  'btl-pension-overview.html',
  'btl-income-test.html',
  'btl-survivors-disability.html',
  'btl-immigrants-treaties.html',
  'btl-care-transitions.html',
  'btl-special-cases.html',
];
const MAX_QUESTION_LENGTH = 500;
// gemini-2.5-flash-lite נבחר לפי עלות (הזול/המהיר במשפחת Gemini הנתמכת), מקביל
// לשיקול שהוביל לבחירת Haiku בגרסת הקלוד. **לוודא מול
// https://ai.google.dev/gemini-api/docs/models לפני/אחרי פריסה** - יש דגמים
// חדשים יותר (למשל בסדרת 3.x) שהמידע עליהם לא היה עקבי מספיק בין מקורות בזמן
// הכתיבה כדי לבחור בהם בביטחון; זה הדגם המתועד והיציב ביותר שנמצא.
const MODEL = 'gemini-2.5-flash-lite';
const PREVIEW_LENGTH = 150;
const MAX_HISTORY_ITEMS = 3;
const MAX_HISTORY_ANSWER_LENGTH = 4000;

// תיאור קצר ואמין לכל עמוד (מבוסס על meta description האמיתי של כל דף) - משמש לאינדקס
// שהמודל רואה כדי לבחור עמוד רלוונטי. תחזוקה ידנית: כשמוסיפים עמוד חדש ל-ai-content
// יש להוסיף כאן שורה תואמת (וגם ל-PATH_DESCRIPTIONS/PATH_TITLES בקובץ הקלוד המקביל),
// אחרת ייפול ל-fallback האוטומטי (פחות מדויק).
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
  'additional_guides/html/nechut_klalit_mul_avoda.html':
    'מדריך השוואתי מפורט בין נכות כללית לנכות מעבודה: תנאי זכאות, אופן חישוב הקצבה, תקרות ומגבלות, תהליך הגשת תביעה, ואפשרות כפל קצבאות.',
  'additional_guides/html/shaagat_haari.html':
    'דו"ח זכויות מבצע "שאגת הארי" - סיכום הזכויות והפיצויים למשרתים שהושפעו מהמבצע.',
  'additional_guides/html/takrut_hachnasa.html':
    'טבלת תקרות הכנסה לזכאות לקצבת אזרח ותיק חלקית לפי מבחן הכנסות.',
  'additional_guides/html/tkufat_achshara.html':
    'מדריך להגדרת תקופת אכשרה (תקופת הביטוח המינימלית) הנדרשת לזכאות לקצבת אזרח ותיק.',
  'additional_guides/html/yetzia_lachul.html':
    'מדריך להשפעת יציאה לחו"ל על המשך תשלום קצבת זקנה והשלמת הכנסה, כולל כללי ימי שהייה מותרים.',
  'additional_guides/html/zchuyot_achrei_ishpuz.html':
    'מדריך מקיף לזכויות אזרחים ותיקים באשפוז ואחרי שחרור מבית החולים: גמלת סיעוד, שיקום רפואי, טיפול בית, ניצולי שואה, העסקת עובד זר, בני משפחה מטפלים, מוסדות טיפול ממושך, ומכשירי שיקום.',
  'additional_guides/html/yipuy_koach_mitmashech.html':
    'מדריך מקיף לעריכת ייפוי כוח מתמשך לאנשים מבוגרים: הגדרה, בחירת מיופה כוח, סמכויות רפואיות/אישיות/רכושיות, תהליך העריכה, עלויות, טעויות נפוצות, והשוואה לאפוטרופסות.',
  'additional_guides/html/oved_zar_bituach_leumi.html':
    'דוח מידע מקיף להעסקת מטפל זר לקשיש: תנאי זכאות, שני מסלולי היתר, השוואה בין העסקה ישירה למשולבת עם חברת סיעוד, תשלום ביטוח לאומי, יתרונות וחסרונות, ושלבים מעשיים למימוש.',
  'additional_guides/html/chanaya_shmura_ezrach_vatik.html':
    'מדריך לחניה שמורה ליד הבית לאזרח ותיק כאשר הרשות המקומית דורשת "תעודת נכה" - למה הדרישה שגויה עבור מי שכבר בגיל פרישה, ומה ניתן להציג במקומה (חוות דעת רפואית, תנאי חוק חניה לנכים, שלבי פעולה וערר).',
  'additional_guides/html/dmei_michya_leshairim.html':
    'מדריך לדמי מחיה לשאירים בביטוח לאומי: תוספת דמי מחיה ליתומים לומדים (תנאי זכאות, סכומים, טופס 2910), ודמי מחיה לאלמן/אלמנה בשיקום מקצועי - תנאים, סכומים, ואופן הגשת התביעה.',
  'new_immigrants/gimlat_zikna_meyuchedet.html':
    'מדריך לגמלת זיקנה מיוחדת לעולים חדשים ותושבים חוזרים שאינם זכאים לקצבת זקנה רגילה: תנאי זכאות וגובה הגמלה.',
  'new_immigrants/international_treaties.html':
    'מדריך לאמנות ביטחון סוציאלי בינלאומיות של ישראל: אילו מדינות חתומות, כיצד זה משפיע על צירוף תקופות ביטוח וזכאות לגמלה.',
  'senior_rights/faq.html':
    'שאלות ותשובות נפוצות בזכויות אזרחים ותיקים: קצבת זקנה, קצבת שאירים, סיעוד, קצבאות ותוספות, תהליכים וערעורים, והשלמת הכנסה - מאורגן כשאלה-תשובה קצרה לכל נושא.',
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

// כותרת קצרה וקריאה לכל עמוד - ראו הערה מקבילה בקובץ הקלוד. תחזוקה ידנית זהה.
const PATH_TITLES = {
  'additional_guides/html/additional_guides_index.html': '📚 סיכומים ומסמכי מידע מפורט',
  'additional_guides/html/amnot_binleumiot.html': '🌍 אמנות בינלאומיות לביטחון סוציאלי',
  'additional_guides/html/chovaat_hitatzbut.html': '💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה',
  'additional_guides/html/gamlay_zikna.html': '🏠 גמלת זיקנה מיוחדת לעולים ותושבים חוזרים',
  'additional_guides/html/hagdarat_tluim.html': '👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים',
  'additional_guides/html/mekarim_meyuchadim.html': '⚠️ מקרים מיוחדים בגמלאות ביטוח לאומי',
  'additional_guides/html/nechut_mul_shairim.html': '⚖️ בחירה בין קצבת נכות לקצבת שאירים',
  'additional_guides/html/nechut_klalit_mul_avoda.html': '🩼 נכות כללית מול נכות מעבודה',
  'additional_guides/html/shaagat_haari.html': '🦁 דו"ח זכויות — מבצע שאגת הארי',
  'additional_guides/html/takrut_hachnasa.html': '💰 תקרות הכנסה לקצבת אזרח ותיק חלקית',
  'additional_guides/html/tkufat_achshara.html': '📅 תקופת אכשרה לקצבת אזרח ותיק',
  'additional_guides/html/yetzia_lachul.html': '✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה',
  'additional_guides/html/zchuyot_achrei_ishpuz.html': '🏥 זכויות אזרחים ותיקים לאחר אישפוז',
  'additional_guides/html/yipuy_koach_mitmashech.html': '📜 ייפוי כוח מתמשך - מדריך מקיף',
  'additional_guides/html/oved_zar_bituach_leumi.html': '📋 מידע כללי על העסקת עובד זר',
  'additional_guides/html/chanaya_shmura_ezrach_vatik.html': '🅿️ חניה שמורה לאזרח ותיק ללא תעודת נכה',
  'additional_guides/html/dmei_michya_leshairim.html': '🎓 דמי מחיה לשאירים בביטוח לאומי',
  'new_immigrants/gimlat_zikna_meyuchedet.html': '📖 גמלת זיקנה מיוחדת לעולים ותושבים חוזרים',
  'new_immigrants/international_treaties.html': '📖 אמנות בינלאומיות לביטחון סוציאלי',
  'senior_rights/faq.html': '❓ שאלות נפוצות בזכויות אזרחים ותיקים',
  'senior_rights/financial-tables-and-definitions.html': '📊 סיכום קצבאות ותקרות',
  'senior_rights/imputed_income_guide.html': '📖 מדריך מפורט: חישוב הכנסה רעיונית מנכסים פיננסיים',
  'senior_rights/nechut_vs_shairim.html': '⚖️ מדריך מפורט לקצבת נכות כללית מול קצבת שאירים',
  'senior_rights/nursing_home_guide.html': '🏥 מדריך מפורט בנושא מוסד אישפוז',
  'senior_rights/old_pension_income_test_full_guide.html': '📊 מדריך לחישוב זכאות וסכום קצבת זיקנה חלקית',
  'senior_rights/senior_citizens_rights_2026.html': '📘 זכויות אזרחים ותיקים 2026 - מדריך מקיף',
  'senior_rights/senior_rights_full.html': '🌟 זכויות אזרחים ותיקים',
  'senior_rights/survivors_benefits_guide_2026.html': '👨‍👩‍👧 מדריך מקיף לקצבת שאירים 2026',
  'senior_rights/women_transition_benefit_guide.html': '👩 מדריך מפורט למענק מעבר לנשים',
};

// זהה מילה-במילה ל-SYSTEM_PREFIX בקובץ הקלוד - ההנחיות עצמן לא תלויות-ספק,
// רק אופן שליחתן ל-API (systemInstruction נפרד, לא מחרוזת system).
const SYSTEM_PREFIX = `אתה עוזר מידע בנושא ביטוח לאומי וזכויות אזרחים ותיקים בישראל, מבוסס על אתר yairron.com/btl.
ענה בעברית, בקצרה ובבהירות, אך ורק על סמך המידע שסופק לך (כולל אחרי שימוש בכלי get_page_content).
אם התשובה לא נמצאת במידע הזמין לך, אמור זאת בפירוש ואל תמציא ואל תנחש.

יש כמה סוגי קצבאות שונים (זקנה, נכות כללית, שאירים, עולים חדשים ועוד), ולעיתים יש להם
תקרות הכנסה, סכומים או מונחים (כמו "הגדרת בן/בת זוג") דומים במספר/במילה אך שונים במהות
ובסוג הקצבה - למשל הגדרת בן/בת זוג לצורך קצבת זקנה עצמה לעומת הגדרת אלמנה/אלמן לצורך
קצבת שאירים, או מבחן ההכנסות בקצבת אזרח ותיק הרגילה (נגמר בגיל 70) לעומת גמלת אזרח ותיק
המיוחדת לעולים חדשים/תושבים חוזרים (מבחן ההכנסות בה ממשיך גם אחרי גיל 70, ללא הגבלת גיל
עליון - זו טעות נפוצה להניח שהכלל של הקצבה הרגילה חל גם עליה). לפני שאתה עונה עם מספר
או קביעה, ודא בבירור שהיא שייכת בדיוק לסוג הקצבה שנשאלת עליו ולא לקצבה דומה/סמוכה - שים
לב במיוחד לביטויים כמו "בשונה מ..." או "⚠️" בתוך התוכן שנשלף, שמסמנים במפורש נקודות
כאלה. אם יש ספק - ציין זאת במפורש בתשובה במקום לנחש.

לגבי עיצוב: אל תשתמש בסימני חץ (→ ← ⇒ וכדומה) בתשובה בעברית - בטקסט RTL הם
נוטים להיראות הפוכים כשמעורבבים עם מספרים. במקום חץ, כתוב מילים כמו "כלומר", "לכן",
"בהתאם לכך", או פסיק/מקף רגיל.

המידע באתר מחולק לעמודים נפרדים. למטה יש רשימה של כל העמודים הזמינים עם תקציר קצר של כל אחד.
כדי לענות על שאלה, **חובה** להשתמש בכלי get_page_content ולשלוף את התוכן המלא של עמוד רלוונטי אחד
או יותר מהרשימה - אסור לענות רק על סמך שם העמוד והתקציר הקצר, כי הם לא מכילים את הפרטים/המספרים
עצמם. אפשר לשלוף כמה עמודים אם השאלה נוגעת ליותר מנושא אחד.

לגבי התמדה בחיפוש: אם העמוד/העמודים הראשונים שבחרת לא מכילים תשובה ברורה
ומלאה לשאלה - אסור לך לעצור ולהמליץ למשתמש לפנות לביטוח לאומי אחרי עמוד אחד או שניים
בלבד. במקום זאת, חזור לרשימת העמודים ובדוק אם יש עמוד נוסף, גם כזה שנראה פחות מובהק
במבט ראשון, שעשוי להכיל את התשובה - ושלוף אותו. המשך כך עד שתמצא תשובה טובה, או עד
שבדקת את כל העמודים שיש להם סיכוי סביר להכיל אותה. רק אחרי שבדקת בפועל את העמודים
הסבירים ולא מצאת - מותר לומר שאין לך את המידע ולהמליץ על פנייה חיצונית.

לגבי אימות: אסור לך להציג מספר, נוסחה, או קביעה עובדתית (כמו תנאי זכאות) שהגעת אליהם
מהזיכרון/הנחה כללית בלבד, בלי לוודא מול העמוד שנשלף - כולל במשפט תמציתי בתחילת התשובה,
לא רק בפירוט המדויק שבהמשכה. ודא שאותה עובדה מופיעה **באופן זהה** בכל מקום בתשובה -
משפט פתיחה תמציתי אסור שיסתור פירוט מדויק יותר שמופיע אחר כך (טעות שכבר קרתה בפועל:
"ללא מבחן הכנסות" בתחילת תשובה מול "מבחן הכנסות ממשיך" בהמשכה, על אותה גמלה בדיוק).
אם אינך מוצא בעמוד את הערך המבוקש בדיוק - אמור זאת בפירוש, אל "תשלים" אותו בעצמך
מנוסחה או הנחה שאתה "משוכנע" שהיא נכונה.

אם המשתמש מבקש ממך לבדוק שוב, לחפש שוב באתר, או מביע ספק בתשובה שכבר נתת - זו הוראה
מפורשת לקרוא שוב לכלי get_page_content באותו רגע, גם אם כבר ענית קודם ואתה "בטוח"
בתשובה. אסור לחזור על תשובה קודמת או "לתקן" אותה מילולית בלי שליפה חדשה בפועל.

אסור לפתוח את התשובה במשפט/ביטוי גנרי שמציין את מקור המידע, כמו "הנה הקישורים
הרלוונטיים ל...", "על סמך המדריך:", "על פי המידע שמצאתי", "לפי מה שמצאתי", "בהתאם
למדריך" וכדומה.

במקום זאת, כל תשובה חייבת לפתוח במשפט קצר שמנסח מחדש בתמציתיות את השאלה עצמה,
בסגנון "הנה התשובה לשאלה [ניסוח קצר של השאלה]:" או "לשאלתך [ניסוח קצר של השאלה],
התשובה היא:" - ורק אז להמשיך לתוכן התשובה עצמו. משפט הפתיחה צריך להיות קצר ותמציתי,
לא חזרה מילה-במילה על כל השאלה המקורית.

אל תפתח תשובה במונחים דרמטיים על מה שהמשתמש (או האדם שנשאל עליו) אינו זכאי לו - כמו
"הסכנה הראשונה", "זה לא סוף הסיפור" וכדומה - וגם אל תציג חוסר-זכאות כברירת מחדל של
התשובה, אלא אם נשאלת עליו במפורש. כשהשאלה כללית (למשל "הסבר את הזכויות שלו"), התמקד
ישירות במה שכן מגיע, בטון ענייני. אם יש רקע חשוב לתנאי הזכאות (למשל שקצבה מסוימת לא
רלוונטית ולכן צריך מסלול אחר), ציין זאת בקצרה ובלי דרמטיזציה, כחלק טבעי מהתשובה ולא
כפתיחה שלילית.

אין לצרף קישורים או כתובות URL בגוף התשובה עצמו, ואין להזכיר שם קובץ גולמי או נתיב פנימי
(כמו nechut_vs_shairim.html או senior_rights/faq.html) - גם זה טכני ולא ידידותי למשתמש קצה.
**האיסור הזה חל גם אם המשתמש מבקש זאת במפורש** (למשל "תן לי את שמות/נתיבי הקבצים", "שים
את הקישורים לקבצים") - גם אז אסור לחשוף את הנתיב הגולמי בשום צורה, אלא לסמוך על מנגנון
המקורות בלבד. קישורי המקורות לעמודים הרלוונטיים נוספים אוטומטית בסוף התשובה על ידי
המערכת (ולא על ידך), בהתבסס על העמודים שנשלפו בפועל. הוספת קישור או שם קובץ בגוף התשובה
עלולה ליצור כפילות או מידע שגוי לצד הקישור האמיתי שיתווסף - לכן יש להימנע מכך לחלוטין
ולהסתפק בהפניה מילולית לעמוד (למשל "כפי שמופיע בעמוד בנושא X"), ללא כתובת או שם קובץ
בפועל. אם הבקשה היא במפורש רק לקישורים/מקורות ולא להסבר (למשל "שים קישורים", "ללא
הסבר") - תן משפט קצר אחד בלבד וסמוך על מנגנון המקורות למטה, בלי להחליף זאת בהסבר מפורט
שלא התבקש.

רשימת העמודים הזמינים:
`;

// Gemini דורש עטיפת functionDeclarations בתוך tools (בשונה מ-Anthropic, ששם
// name/description/input_schema ישירות על אובייקט הכלי). ה-name/description/
// required זהים במהות; רק שם השדה parameters (לא input_schema).
const GET_PAGE_TOOL = {
  functionDeclarations: [
    {
      name: 'get_page_content',
      description:
        'שולף את התוכן המלא של עמוד ספציפי מתוך רשימת העמודים הזמינה. יש להעביר את הנתיב המדויק כפי שהוא מופיע ברשימה.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'הנתיב המדויק של העמוד כפי שמופיע ברשימת העמודים הזמינה, לדוגמה senior_rights/nechut_vs_shairim.html',
          },
        },
        required: ['path'],
      },
    },
  ],
};

function isAllowedOrigin(event) {
  const origin = event.headers.origin || event.headers.referer || '';
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

// זהה לחלוטין לגרסת הקלוד - חילוץ הטקסט מתוך ai-content/*.html לא תלוי-ספק.
function extractPreText(html) {
  const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
  const raw = match ? match[1] : html;
  return raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

// זהה לחלוטין לגרסת הקלוד.
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

// mode: 'ANY' מאלץ קריאה לכלי (מקביל ל-tool_choice:{type:'any'} של Anthropic),
// 'AUTO' משאיר למודל להחליט (קריאה נוספת לכלי, או תשובת טקסט סופית), ו-undefined
// (בלי toolConfig בכלל, וגם בלי tools) מכבה שימוש בכלי לגמרי - לסבב האחרון,
// כדי לאלץ תשובה סופית ולא להיתקע ב"אחפש עוד" בלי לבצע בפועל.
async function callGemini(contents, systemPrompt, tools, mode) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      ...(tools ? { tools: [tools] } : {}),
      ...(mode ? { toolConfig: { functionCallingConfig: { mode } } } : {}),
      generationConfig: { maxOutputTokens: 2000 },
    }),
  });
}

// אין כאן מקביל ל-cache_control של Anthropic - Gemini משתמש במנגנון context
// caching נפרד (cachedContent, endpoint משלו ליצירת cache מראש), שלא מומש כאן
// בשלב הראשון (יקר יותר בלי caching, אבל פשוט יותר להתחיל). רק לוג שימוש טוקנים.
function logTokenUsage(label, data) {
  const u = data?.usageMetadata;
  if (!u) return;
  console.log(
    `[gemini-usage] ${label}: prompt=${u.promptTokenCount ?? 0} candidates=${u.candidatesTokenCount ?? 0} total=${u.totalTokenCount ?? 0}`
  );
}

// לא כולל 529 (זה קוד ספציפי ל"עומס" אצל Anthropic) - 429/500/503 הם הקודים
// המתועדים אצל Gemini לחריגת מכסה/עומס זמני.
const TRANSIENT_STATUSES = new Set([429, 500, 503]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(contents, systemPrompt, tools, mode) {
  let res = await callGemini(contents, systemPrompt, tools, mode);
  if (!res.ok && TRANSIENT_STATUSES.has(res.status)) {
    await sleep(800);
    res = await callGemini(contents, systemPrompt, tools, mode);
  }
  return res;
}

const NO_STORE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

const CHAT_LOG_TIMEOUT_MS = 3000;

// זהה לחלוטין לגרסת הקלוד - רישום השאלה לא תלוי-ספק כלל.
function logQuestion(question) {
  const url = process.env.CHAT_LOG_WEBHOOK_URL;
  const secret = process.env.CHAT_LOG_SECRET;
  if (!url || !secret) return Promise.resolve();

  const timeout = new Promise((resolve) => setTimeout(resolve, CHAT_LOG_TIMEOUT_MS));
  const send = fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret, question, timestamp: new Date().toISOString() }),
  }).catch(() => {});

  return Promise.race([send, timeout]);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!isAllowedOrigin(event)) {
    return { statusCode: 403, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'מקור לא מורשה' }) };
  }

  let question, history;
  try {
    ({ question, history } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'בקשה לא תקינה' }) };
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return { statusCode: 400, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'לא התקבלה שאלה' }) };
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return { statusCode: 400, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'השאלה ארוכה מדי' }) };
  }

  const logPromise = logQuestion(question);

  if (history === undefined) {
    history = [];
  } else if (!Array.isArray(history) || history.length > MAX_HISTORY_ITEMS) {
    return { statusCode: 400, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'היסטוריה לא תקינה' }) };
  } else {
    for (const item of history) {
      if (
        !item ||
        typeof item.question !== 'string' ||
        typeof item.answer !== 'string' ||
        item.question.length > MAX_QUESTION_LENGTH ||
        item.answer.length > MAX_HISTORY_ANSWER_LENGTH
      ) {
        return { statusCode: 400, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'היסטוריה לא תקינה' }) };
      }
    }
  }

  let sections;
  try {
    const texts = CONTENT_FILES.map((file) =>
      extractPreText(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'))
    );
    sections = parseSections(texts.join('\n'));
    if (sections.length === 0) throw new Error('no sections parsed');
  } catch (err) {
    console.error('Failed to load site content:', err);
    return { statusCode: 500, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה בטעינת תוכן האתר' }) };
  }

  const sectionsByPath = new Map(sections.map((s) => [s.path, s.content]));
  const indexText = sections
    .map((s) => `- ${s.path}: ${PATH_DESCRIPTIONS[s.path] || previewOf(s.content)}`)
    .join('\n');

  const systemPrompt = SYSTEM_PREFIX + indexText;

  // Gemini: role 'model' (לא 'assistant' כמו ב-Anthropic), וכל תוכן עטוף ב-parts.
  const contents = [];
  for (const item of history) {
    contents.push({ role: 'user', parts: [{ text: item.question }] });
    contents.push({ role: 'model', parts: [{ text: item.answer }] });
  }
  contents.push({ role: 'user', parts: [{ text: question }] });
  const MAX_TOOL_ROUNDS = 3;

  try {
    // מאלצים קריאה לכלי בסבב הראשון (mode: 'ANY') - אותו שיקול בדיוק כמו בגרסת
    // הקלוד: לא סומכים על ההנחיה בטקסט בלבד, כי המודל עלול "לדלג" עליה.
    let apiRes = await callGeminiWithRetry(contents, systemPrompt, GET_PAGE_TOOL, 'ANY');
    if (!apiRes.ok) {
      console.error('Gemini API error:', apiRes.status, await apiRes.text());
      return { statusCode: 502, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
    }
    let data = await apiRes.json();
    logTokenUsage('initial', data);
    let round = 0;
    const usedPaths = new Set();

    // בשונה מ-Anthropic (ששולח stop_reason:'tool_use' מפורש), Gemini לא מסמן
    // סיבת עצירה ייעודית לקריאת-כלי - הבדיקה היא אם יש בכלל חלק functionCall
    // בתגובה. אם יש כמה - Gemini תומך בקריאות מקבילות כמו Anthropic.
    let parts = data.candidates?.[0]?.content?.parts || [];
    let functionCalls = parts.filter((p) => p.functionCall);

    while (functionCalls.length > 0 && round < MAX_TOOL_ROUNDS) {
      round++;

      const functionResponseParts = functionCalls.map((fc) => {
        const requestedPath = String(fc.functionCall.args?.path || '').replace(/^\/+/, '');
        const content = sectionsByPath.get(requestedPath);
        const resultText = content !== undefined ? content : 'העמוד המבוקש אינו קיים ברשימת העמודים הידועה.';
        if (content !== undefined) usedPaths.add(requestedPath);
        return {
          functionResponse: {
            name: fc.functionCall.name,
            response: { content: resultText },
          },
        };
      });

      // תור המודל עצמו (עם ה-functionCall) חוזר בדיוק כמו שהתקבל, ואז תגובת
      // הכלים - שתיהן בתפקיד 'user'/'model' בלבד (Gemini לא מכיר role 'function').
      contents.push({ role: 'model', parts });
      contents.push({ role: 'user', parts: functionResponseParts });

      const allowTool = round < MAX_TOOL_ROUNDS;
      // מהסבב השני ואילך לא מאלצים יותר (mode: 'AUTO') - אחרת המודל לעולם לא
      // יוכל לענות בטקסט, רק לקרוא לכלי שוב ושוב.
      apiRes = await callGeminiWithRetry(contents, systemPrompt, allowTool ? GET_PAGE_TOOL : null, allowTool ? 'AUTO' : null);
      if (!apiRes.ok) {
        console.error('Gemini API error (follow-up):', apiRes.status, await apiRes.text());
        return { statusCode: 502, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
      }
      data = await apiRes.json();
      logTokenUsage(`round ${round}`, data);
      parts = data.candidates?.[0]?.content?.parts || [];
      functionCalls = parts.filter((p) => p.functionCall);
    }

    const answer = parts.find((p) => p.text)?.text || 'לא הצלחתי לענות על השאלה.';

    // זהה לחלוטין לגרסת הקלוד - בניית קישורי המקורות לא תלויה בספק.
    const sources = Array.from(usedPaths).map((p) => ({
      title: PATH_TITLES[p] || p,
      url: `https://yairron.com/btl/${p.replace(/\.html$/, '')}`,
    }));

    await logPromise;

    return {
      statusCode: 200,
      headers: NO_STORE_HEADERS,
      body: JSON.stringify({ answer, sources }),
    };
  } catch (err) {
    console.error('btl-chat-gemini function error:', err);
    return { statusCode: 500, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה כללית' }) };
  }
};
