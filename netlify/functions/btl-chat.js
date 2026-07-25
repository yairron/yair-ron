const fs = require('fs');
const path = require('path');

const ALLOWED_ORIGINS = ['https://yairron.com'];
// ai-summary.html הפך ב-20.07.2026 לאינדקס קצר בלבד (התוכן המלא פוצל לקבצי
// נושא תחת ai-content/, אחרי שכלי fetch/grounding חיצוניים כמו ג'מיני דיווחו
// על חסימה בשליפת הקובץ המאוחד הקודם - כ-800KB). הפונקציה כאן לא צריכה
// לפרש את האינדקס - היא מכירה ישירות את רשימת קבצי הנושא (חייבת להישאר
// מסונכרנת ידנית עם TOPICS ב-build_ai_summary.py) ומאחדת אותם בזמן ריצה
// בחזרה לטקסט אחד, בדיוק כמו שהקובץ הישן היה - parseSections לא השתנה.
//
// עודכן 22.07.2026: קובצי .txt גולמיים הוחלפו ב-.html מינימלי (תוכן זהה
// עטוף ב-<pre>, בלי CSS/JS) - ג'מיני דיווח שכלי הגלישה שלו לא ניגש בכלל
// לקבצי .txt (רק ל-HTML). ראו extractPreText() למטה שמחלץ את הטקסט מתוך
// ה-<pre> ומבטל את ה-escaping (& < >) לפני שממשיכים ל-parseSections.
//
// עודכן 25.07.2026: נקרא מהדיסק המקומי (fs.readFileSync) במקום fetch() חי
// חזרה לאתר - הקבצים כבר יושבים באותו deploy, אז שליפה ברשת הייתה latency
// מיותר (7 round-trips בכל שאלה) שתרם לחריגות timeout. הקבצים חייבים
// להיכלל בפועל בחבילת הפונקציה - ראו included_files ב-netlify.toml.
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
const MODEL = 'claude-haiku-4-5-20251001';
const PREVIEW_LENGTH = 150;
const MAX_HISTORY_ITEMS = 3;
const MAX_HISTORY_ANSWER_LENGTH = 4000;

// תיאור קצר ואמין לכל עמוד (מבוסס על meta description האמיתי של כל דף) - משמש לאינדקס
// שהמודל רואה כדי לבחור עמוד רלוונטי. תחזוקה ידנית: כשמוסיפים עמוד חדש ל-ai-content
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

// כותרת קצרה וקריאה לכל עמוד, בדיוק כפי שהיא מופיעה בקישור האמיתי אליו במקום כלשהו
// באתר (בעיקר index.html ו-additional_guides_index.html) - משמשת כטקסט הקישור
// שמוצג למשתמש מתחת לתשובה בצ'אט (שדה sources). תחזוקה ידנית: כשמוסיפים עמוד חדש
// יש להוסיף שורה תואמת כאן, אחרת הקישור בתשובה יוצג עם נתיב הקובץ הגולמי (fallback).
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

אין לצרף קישורים או כתובות URL בגוף התשובה עצמו, ואין להזכיר שם קובץ גולמי (כמו
nechut_vs_shairim.html) - גם זה טכני ולא ידידותי למשתמש קצה. קישורי המקורות לעמודים
הרלוונטיים נוספים אוטומטית בסוף התשובה על ידי המערכת (ולא על ידך), בהתבסס על העמודים
שנשלפו בפועל. הוספת קישור או שם קובץ בגוף התשובה עלולה ליצור כפילות או מידע שגוי לצד
הקישור האמיתי שיתווסף - לכן יש להימנע מכך לחלוטין ולהסתפק בהפניה מילולית לעמוד (למשל
"כפי שמופיע בעמוד בנושא X"), ללא כתובת או שם קובץ בפועל.

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

// כל קובץ ai-content/*.html עטוף במעטפת HTML מינימלית סביב <pre> (ראו
// wrap_html() ב-build_ai_summary.py) - מחלצים את הטקסט הגולמי מתוכו ומבטלים
// את ה-escaping (& < >) שבוצע בזמן הכתיבה, לפני שממשיכים ל-parseSections.
function extractPreText(html) {
  const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
  const raw = match ? match[1] : html;
  return raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

// כל קובץ תוכן בנוי מסעיפים בהפרדת "===== path =====" (ראו build_ai_summary.py) -
// מפרקים לפי זה במקום לשלוח את כל התוכן המאוחד (מעל למגבלת ההקשר של המודל).
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
      // עם ההיסטוריה - cache_control מוזיל קריאות חוזרות בכ-90%. לכל מודל יש סף מינימום
      // טוקנים להפעלת המטמון (תלוי במודל) - ראו לוג cache usage למטה אם זה בפועל מופעל.
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

// כותרות קבועות לכל תשובה (הצלחה ושגיאה כאחד) - מונעות במפורש שכבת ה-cache של
// Netlify (edge/durable) מלשמור תגובה. בלעדי זה נצפה בפועל Age/Netlify-Vary: query
// על תגובות POST - כלומר תשובות נשמרות במטמון לפי ה-URL בלבד, בלי קשר לגוף הבקשה
// (השאלה עצמה), מה שעלול להחזיר למשתמש תשובה על שאלה של מישהו אחר לגמרי.
const NO_STORE_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

const CHAT_LOG_TIMEOUT_MS = 3000;

// שולח את השאלה ל-Google Apps Script לרישום בגיליון (ראו netlify/chat-log-apps-script.gs.js
// לקוד הצד השני ולהסבר המלא). מוגדר דרך משתני סביבה CHAT_LOG_WEBHOOK_URL/CHAT_LOG_SECRET
// ב-Netlify, לא בקוד - אם הם לא מוגדרים הפונקציה פשוט לא רושמת (התכונה אופציונלית).
// לעולם לא זורקת/חוסמת: אם הבקשה נכשלת או לוקחת יותר מ-CHAT_LOG_TIMEOUT_MS, מתעלמים
// בשקט - לוג שנכשל/נתקע אסור שישפיע על זמן התגובה או יגרום לכישלון של הצ'אט עצמו.
// נקראת מוקדם (בלי await מיידי) כדי לרוץ במקביל לקריאות ל-Claude שממילא לוקחות הרבה
// יותר זמן; ה-await בפועל קורה רק ממש לפני ההחזרה הסופית.
function logQuestion(question) {
  const url = process.env.CHAT_LOG_WEBHOOK_URL;
  const secret = process.env.CHAT_LOG_SECRET;
  if (!url || !secret) return Promise.resolve();

  const timeout = new Promise((resolve) => setTimeout(resolve, CHAT_LOG_TIMEOUT_MS));
  // Content-Type: text/plain ולא application/json בכוונה - ל-Apps Script יש באג מתועד
  // בפענוח UTF-8 רב-בייטי (עברית וכו') כשה-Content-Type הנכנס הוא application/json,
  // גם עם getDataAsString('UTF-8') בצד השני. הגוף עצמו עדיין JSON תקני - רק ה-header
  // משתנה, כדי לעקוף את הבאג. אומת בפועל: עברית חזרה כ-????? עד לשינוי הזה.
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
      return { statusCode: 502, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
    }
    let data = await apiRes.json();
    logCacheUsage('initial', data);
    let round = 0;
    // עמודים שבאמת נשלפו בהצלחה דרך get_page_content באיזשהו סבב - משמשים בסוף
    // לבניית קישורי "מקורות" בתשובה. Set ולא Array כי אותו עמוד עשוי להישלף כמה פעמים.
    const usedPaths = new Set();

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
        if (content !== undefined) usedPaths.add(requestedPath);
        return { type: 'tool_result', tool_use_id: toolUse.id, content: toolResultText };
      });

      messages.push({ role: 'assistant', content: data.content });
      messages.push({ role: 'user', content: toolResults });

      const allowTool = round < MAX_TOOL_ROUNDS;
      apiRes = await callClaudeWithRetry(messages, systemPrompt, allowTool ? [GET_PAGE_TOOL] : null);
      if (!apiRes.ok) {
        console.error('Anthropic API error (follow-up):', apiRes.status, await apiRes.text());
        return { statusCode: 502, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה בפנייה למערכת ה-AI' }) };
      }
      data = await apiRes.json();
      logCacheUsage(`round ${round}`, data);
    }

    const answer = data.content?.find((b) => b.type === 'text')?.text || 'לא הצלחתי לענות על השאלה.';

    // קישורי "מקורות" לעמודים שבפועל נשלפו - נבנים מהנתיבים עצמם (לא ממה שהמודל
    // "מצטט" בטקסט), כדי שלא יהיה תלוי בזיכרון/דיוק המודל. הכתובת הקנונית זהה
    // לזו שב-sitemap.xml (build_sitemap.py: to_canonical_url) - בלי סיומת .html.
    const sources = Array.from(usedPaths).map((path) => ({
      title: PATH_TITLES[path] || path,
      url: `https://yairron.com/btl/${path.replace(/\.html$/, '')}`,
    }));

    await logPromise;

    return {
      statusCode: 200,
      headers: NO_STORE_HEADERS,
      body: JSON.stringify({ answer, sources }),
    };
  } catch (err) {
    console.error('btl-chat function error:', err);
    return { statusCode: 500, headers: NO_STORE_HEADERS, body: JSON.stringify({ error: 'שגיאה כללית' }) };
  }
};
