# הוראות לעבודה בפרויקט

## עדכוני ביטוח לאומי (NII)

אחרי כל שינוי ב-`BTL/senior_rights/data/nii-constants.json` — להריץ:

```
python BTL/support_files/senior_rights/scripts/update_nii_values.py
```

הסקריפט מעדכן ערכי fallback ב-`<span data-nii="...">` בכל קבצי ה-HTML תחת `BTL/senior_rights/`.

**חשוב:** הסקריפט הזה מזהה רק את התבנית הפשוטה `<span data-nii="KEY">` (בלי תכונות נוספות). הוא **לא** מעדכן:
- עמודים עם תוכן סטטי שהוטמע בשיטת "מנוע הליבה" (ראו הסעיף הבא) — 7 עמודים, ראו רשימה שם.
- עמודים מקבוצה ד׳ (ראו הסעיף שאחריו) — כולל גם מופעי `data-nii` עם תכונת `data-format` נלווית.

**לכן, אחרי כל עדכון של `nii-constants.json`, יש להריץ את כל שלושת התהליכים הבאים** (לא רק את זה): את הסקריפט הזה, את `bake_static_content.py` על כל עמודי "מנוע הליבה", ואת `sync_static_values.py` על כל עמודי קבוצה ד׳.

**קובץ ריכוז לכלי בינה מלאכותית:**
```
python BTL/support_files/senior_rights/scripts/build_ai_summary.py
```
בונה מחדש את `BTL/ai-summary.txt` — טקסט נקי (בלי HTML) מרוכז מכל העמודים שמסומנים כ-`"include"` בתוך `KNOWN_FILES` בסקריפט. הסקריפט סורק בפועל את `BTL/senior_rights`, `BTL/new_immigrants`, ו-`BTL/additional_guides/html`, ומדפיס אזהרה מפורשת אם נמצא קובץ חדש שלא מסווג ב-`KNOWN_FILES`, או קובץ ברשימה שנמחק מהדיסק — **יש להריץ אותו ולבדוק את הפלט בכל פעם שנוסף/מוסר עמוד**, לא רק אחרי עדכון `nii-constants.json`. הערה: `BTL/files/BTL_CLEANED` הישן הוא תוצר חד-פעמי וידני מלפני שהסקריפט הזה נבנה — לא מתעדכן אוטומטית ואין להסתמך עליו כמשקף את המצב הנוכחי.

**קובץ מפת אתר:**
```
python BTL/support_files/senior_rights/scripts/build_sitemap.py
```
בונה מחדש את `BTL/sitemap.xml` עם כתובת מלאה לכל עמוד HTML תחת `BTL/senior_rights`, `BTL/new_immigrants`, ו-`BTL/additional_guides/html` (כולל עמודים שלא ב-`ai-summary.txt` — מפת האתר היא לגילוי כללי, לא רק לתוכן שאומת). **יש להריץ מחדש בכל פעם שנוסף/מוסר עמוד.**

**חשוב — תוקן ב-12.07.2026 אחרי אימות ישיר מול השרת החי (curl, לא הנחה):** בניגוד למה שהיה מתועד כאן קודם, `https://yairron.com` **אינו** שורש הפרסום של `BTL` ישירות. הכתובת האמיתית דורשת תחילית `/btl/` (אותיות קטנות דווקא — יש הפניית 301 מ-`/BTL/` עם אותיות גדולות), ו-Netlify Pretty URLs מוריד אוטומטית את סיומת `.html` מכל כתובת (הכתובת עם הסיומת עדיין עובדת דרך הפניה, אבל הכתובת הקנונית שאין לה הפניה כלל היא בלי הסיומת). `build_sitemap.py` כבר בנוי לפי זה: `https://yairron.com/btl/<נתיב>` בלי `.html`, ועמוד הבית עצמו הוא `https://yairron.com/btl/` (לא `btl/index`). כל כתובת בקובץ `sitemap.xml` הנוכחי אומתה בפועל (200) מול השרת.

`/robots.txt` — קובץ קבוע בשורש הריפו (לא בתוך `BTL/`!) — לא סקריפט, לא צפוי להשתנות לעיתים קרובות. **חובה שישב בשורש הריפו דווקא**, כי זוחלים בודקים רק את `domain.com/robots.txt` בשורש האמיתי של הדומיין — קובץ בתוך `BTL/robots.txt` (שם היה יושב במקור) לעולם לא היה מתגלה, גם אם תוכנו נכון. מתיר סריקה כללית, חוסם את `/yr1/`, `/mda/`, ו-`/btl/support_files/`, ומפנה למפת האתר (`https://yairron.com/btl/sitemap.xml`) ולקובץ הריכוז (`https://yairron.com/btl/ai-summary.txt`).

## עוזר AI (צ'אט) באתר

באתר קיים צ'אט AI חי — כפתור צף "🤖 AI" בפינה שמאלית תחתונה בכל עמודי BTL — שמאפשר למבקרים לשאול שאלות על זכויות אזרחים ותיקים וביטוח לאומי ולקבל תשובה מבוססת על תוכן האתר בפועל (לא מודל כללי בלי הקשר).

**חשוב — ארכיטקטורת "אינדקס + שליפה", לא דחיפת כל הקובץ:** `ai-summary.txt` הוא 328KB (~253K טוקנים), מעל מגבלת ההקשר של המודל (200K) — **אסור לשלוח את כל הקובץ ב-system prompt** (נוסה וגרם לשגיאת 400 "prompt is too long"). גם חיתוך שרירותי (נוסה קודם, 60000 תווים ראשונים) גרם לבאג אמיתי: המודל ראה רק את תחילת הקובץ וענה עם המספר הלא-נכון מקצבה אחרת (בלבל תקרת הכנסה של נכות כללית עם תקרת קצבת זקנה, כי רק הראשונה הייתה בטווח שנשלח). **הפתרון הנכון: אינדקס קצר + שליפה לפי דרישה**, מפורט למטה.

**רכיבים:**
- `netlify/functions/btl-chat.js` (בשורש הריפו, לא תחת `BTL/`) — Netlify Function שרצה בצד השרת. מקבלת שאלה מהדפדפן, שולפת בזמן אמת את `BTL/ai-summary.txt`, מפרקת אותו לסעיפים לפי המפריד `===== path =====` (ראו `build_ai_summary.py`), ובונה מהם **אינדקס קצר בלבד** (נתיב + תיאור קצר לכל עמוד) שנכנס ל-system prompt — לא את התוכן המלא. פונה למודל `claude-haiku-4-5-20251001` (נבחר לפי עלות — מתאים למשימת שאלות-תשובות מבוססת-טקסט כזו). מקבלת רק בקשות שמקורן בדומיין `yairron.com` (בדיקת Origin/Referer).
- **`PATH_DESCRIPTIONS`** (אובייקט קבוע בתוך `btl-chat.js`) — תיאור קצר ואמין לכל עמוד באינדקס, מבוסס בפועל על ה-`meta description` האמיתי של אותו עמוד. **תחזוקה ידנית חובה:** ניסיון קודם לחלץ תיאור אוטומטית מהשורה הראשונה בכל סעיף נכשל בפועל (רוב השורות הראשונות הן ניווט כמו "חזרה לדף ראשי", לא תיאור נושא) — **כשמוסיפים עמוד חדש ל-`ai-summary.txt`, יש להוסיף גם שורה מתאימה כאן**, אחרת האינדקס נופל בשקט ל-fallback אוטומטי פחות מדויק (`previewOf`) שעלול לפגוע בדיוק בחירת העמוד.
- **כלי `get_page_content`:** המודל **חייב** להשתמש בו (לפי ההנחיה ב-system prompt) כדי לשלוף את התוכן המלא של עמוד רלוונטי מתוך הסעיפים שכבר פורקו מ-`ai-summary.txt` (לא שליפת HTML חי מהאתר, ולא צריך `stripHtml` יותר) — האינדקס לבדו לא מכיל מספרים/פרטים, רק כותרות. יכול לבקש כמה עמודים במקביל (מספר בלוקי `tool_use` בתגובה אחת) ואף כמה סבבים ברצף (עד `MAX_TOOL_ROUNDS = 3`, ואז הסבב האחרון נשלח בלי הכלי כדי לאלץ תשובה סופית ולא להיתקע ב"אחפש עוד" בלי לבצע בפועל).
- `netlify.toml` (חדש, בשורש הריפו) — מצהיר רק על `netlify/functions` כתיקיית הפונקציות. לא נוגע בהגדרות build/publish קיימות של Netlify.
- `_redirects` (בשורש) — שורה נוספת שממפה `/api/btl-chat` ל-`/.netlify/functions/btl-chat`, מעל שורת ה-404 הקיימת.
- `BTL/senior_rights/data/btl-chat-widget.js` — קובץ JS משותף **יחיד** שמכיל את כל ה-CSS/HTML/JS של הווידג'ט (כפתור + חלון צ'אט). כולל צבעים קבועים (לא `var(--primary)` וכו') כי לא לכל עמודי האתר יש אותם משתני CSS מוגדרים. **אסור להעתיק את קוד הווידג'ט בתוך עמוד — כל עמוד רק טוען את הקובץ המשותף בתג `<script>` אחד**, בדיוק כמו העיקרון הנהוג במנגנון האקורדיונים (סעיף "הוספת עמוד מדריך חדש" למטה).
- מפתח `ANTHROPIC_API_KEY` מוגדר כמשתנה סביבה ב-Netlify (Site settings → Environment variables, מסומן Secret), לא בקוד. **אין rate-limiting מובנה בתוך הפונקציה עצמה** — הוחלט במפורש לא להוסיף מנגנון כזה (כמו Netlify Blobs) כדי לא להכניס תלות npm/build חדשה לאתר שהוא כרגע סטטי לגמרי בלי שום build step. ההגנה מפני עלות בלתי מבוקרת היא spend limit שהוגדר ידנית בקונסולת Anthropic (Settings → Spend limits).

**נתיב הטעינה של `btl-chat-widget.js` בכל עמוד, לפי עומק התיקייה (זהה לעיקרון של נתיב `nii-constants.json`):**
- `BTL/index.html`: `senior_rights/data/btl-chat-widget.js`
- `BTL/senior_rights/*.html`: `data/btl-chat-widget.js`
- `BTL/new_immigrants/*.html`: `../senior_rights/data/btl-chat-widget.js`
- `BTL/additional_guides/html/*.html`: `../../senior_rights/data/btl-chat-widget.js`

**חריג במכוון:** `BTL/additional_guides/html/index.html` לא קיבל את הווידג'ט — זהו עמוד הפניה מיידית (`meta http-equiv="refresh"`) בלי תוכן, אין למשתמש זמן לראות אותו.

## תיקיית BTL/additional_guides — סיכומי PDF שהועברו מ-YR1

תיקייה זו מכילה 10 עמודי סיכום (`amnot_binleumiot.html`, `chovaat_hitatzbut.html`, `gamlay_zikna.html`, `hagdarat_tluim.html`, `mekarim_meyuchadim.html`, `nechut_mul_shairim.html`, `shaagat_haari.html`, `takrut_hachnasa.html`, `tkufat_achshara.html`, `yetzia_lachul.html`) שהועברו מהתיקייה הפרטית `YR1/BTL` לפרסום הציבורי, בתוספת עמוד ניווט ל-PDF-ים (`additional_guides_index.html`, לשעבר `YR_MAIN.HTML`) וקובץ הפניה (`index.html`). כל 12 הקבצים כלולים כעת ב-`build_ai_summary.py` וב-`build_sitemap.py` (סעיף קודם), וקיבלו `meta description`.

**עודכן:** חמישה מהקבצים (`takrut_hachnasa.html`, `nechut_mul_shairim.html`, `gamlay_zikna.html`, `amnot_binleumiot.html`, `mekarim_meyuchadim.html`) קיבלו מנגנון JS לערכים חיים ותיוג מלא, לפי תבנית קבוצה ד׳ — ראו רשימתם בסעיף "עדכון קבוצה ד׳" למטה, שם יש להריץ עליהם את שני הכלים אחרי כל עדכון, בדיוק כמו 4 העמודים המקוריים.

**שני קבצים יוצאים מהכלל במכוון, ולא יקבלו מנגנון:**
- `shaagat_haari.html` — הסכומים בו החלטת ממשלה חד-פעמית, לא נגזרים מביטוח לאומי.
- `hagdarat_tluim.html` — האחוזים בו (12.5%/8%/10%/5%, תוספת תלויים) קבועים בחוק ולא נגזרים מ-`nii-constants.json` כלל (נבדק ואומת: לא תואם לאף חישוב אפשרי מהקבועים הקיימים). נשאר טקסט קבוע לחלוטין.

שאר 4 העמודים (`chovaat_hitatzbut.html`, `tkufat_achshara.html`, `yetzia_lachul.html`, וכן `additional_guides_index.html`/`index.html`) אינם מכילים נתונים כספיים הנגזרים מביטוח לאומי, ולכן אינם דורשים מנגנון.

## עדכון "מנוע הליבה" — עמודים שתוכנם הוטמע מריצת דפדפן אמיתי

```
python BTL/support_files/senior_rights/scripts/bake_static_content.py <page.html>
```

הסקריפט טוען את העמוד בדפדפן אמיתי מול הערכים החדשים, לוכד את התוכן הסופי, מטמיע אותו בקובץ, ומריץ אוטומטית את `verify_render_parity.py` כדי לוודא שלא נוצר שינוי בלתי-רצוי.

**7 עמודים ידועים עם תוכן מוטמע בשיטה הזו — יש להריץ על כולם אחרי כל עדכון:**
```
nechut_vs_shairim.html
senior_citizens_rights_2026.html
nursing_home_guide.html
senior_rights_full.html
financial-tables-and-definitions.html
new_immigrants/gimlat_zikna_meyuchedet.html
new_immigrants/international_treaties.html
```

## עדכון קבוצה ד׳ — עמודים סטטיים עם ערכים חיים מסומנים בתגים

עמודים אלה **כבר** מכילים את כל התוכן שלהם כטקסט קבוע (לא תיבת טעינה) — רק ערכים בודדים מסומנים בתגים ומתעדכנים חי בדפדפן. יש להם ארבע תבניות תיוג אפשריות, בלי מוסכמה אחידה באתר: `data-nii="KEY"` (עם או בלי `data-format="..."` נלווה), `data-nii-key="KEY" data-nii-format="..."`, `data-nii-calc="KEY"` (ערך מחושב), `data-nii-derived="KEY"` (ערך מחושב).

```
python BTL/support_files/senior_rights/scripts/sync_static_values.py <page.html>
```

טוען את העמוד בדפדפן אמיתי, נותן לקוד של העמוד עצמו לחשב את כל הערכים (כולל מחושבים), וכותב את הטקסט הסופי בחזרה כערך הקבוע החדש. לבדיקה בלבד בלי לכתוב: `--check-only`.

```
python BTL/support_files/senior_rights/scripts/check_nii_values_sync.py <page.html>
```

בדיקה **עצמאית** — מחשבת בעצמה, ישירות מ-`nii-constants.json`, מה הערך הצפוי, בלי להסתמך על קוד הסנכרון. חובה להריץ את שני הכלים (לא להסתפק ב-`--check-only` של הראשון כבדיקה).

**4 עמודים ידועים בקבוצה זו — יש להריץ את שני הכלים על כולם אחרי כל עדכון:**
```
imputed_income_guide.html
old_pension_income_test_full_guide.html
survivors_benefits_guide_2026.html
women_transition_benefit_guide.html
```

**5 עמודים נוספים תחת `BTL/additional_guides/html/` — אותה שיטה בדיוק, יש לציין את הנתיב המלא (לא רק שם הקובץ) בהרצה:**
```
additional_guides/html/amnot_binleumiot.html
additional_guides/html/gamlay_zikna.html
additional_guides/html/mekarim_meyuchadim.html
additional_guides/html/nechut_mul_shairim.html
additional_guides/html/takrut_hachnasa.html
```
המנוע ב-5 העמודים האלה בנוי לפי התבנית האחידה (`data-nii-key`/`data-nii-derived` + `data-nii-format="currency|percent|plain"`) מהיסוד - אין בהם שימוש בתבניות הישנות. נתיב `nii-constants.json` בהם הוא `../../senior_rights/data/nii-constants.json` (עומק תיקיות שונה מ-`senior_rights/*.html`).

**חשוב — אין מוסכמה כלל-אתרית לעיצוב ערכים מחושבים או ל-`data-format`.** כל קובץ עשוי לממש את זה אחרת בקוד ה-JS שלו (למשל: אחוז עם או בלי סימן `%` בתוך התג עצמו). לכן הנוסחאות וכללי העיצוב מתועדים בנפרד לכל קובץ בתוך `check_nii_values_sync.py` (ב-`FILE_SPECIFIC_FORMAT_RULES` ו-`FILE_SPECIFIC_CALC_RULES`/`FILE_SPECIFIC_DERIVED_RULES`), ולא כלל גורף. **אם מוסיפים תג `data-nii-calc`/`data-nii-derived` חדש, או `data-format` חדש, בעמוד קיים או חדש — יש לקרוא את קוד ה-JS בפועל של אותו עמוד ולהוסיף כלל חדש שם, לא להניח שכלל מקובץ אחר תקף.** בלי כלל מתועד, הכלי מדווח "לא ניתן לאמת" — לא מאשר ולא נכשל בטעות.

**הערת אזהרה:** `benefit-combinations.html` מכיל מופעי `data-nii` בקוד המקור, אבל אלה חלק ממחרוזת טקסט בתוך פונקציה (`formatResult`) שרצה רק אחרי בחירת המשתמש בכלי — לא תוכן קבוע בעמוד. הוא **לא** שייך לקבוצה ד׳ ולא לרשימה למעלה; הוא כלי אינטראקטיבי (מחשבון), ואין צורך/טעם להריץ עליו את הכלים האלה.

## הוספת עמוד חדש מקבוצה ד׳ (תוכן סטטי עם ערכים חיים מסומנים)

חמשת העמודים הקיימים בקבוצה ד׳ משתמשים בארבע תבניות תיוג שונות, בלי מוסכמה אחידה — זה גרם לבלבול בפועל וכמעט גרם לפספוס שקט של ערכים. **כדי שזה לא יקרה שוב, כל עמוד חדש מהסוג הזה חייב להשתמש בתבנית האחידה הבאה, ולא באחת הישנות:**

- **ערך שנשלף ישירות מ-`nii-constants.json`:**
  ```
  <span data-nii-key="KEY" data-nii-format="currency|percent|plain">ערך</span>
  ```
- **ערך מחושב (נוסחה המשלבת כמה מפתחות, לא לוקאפ ישיר):**
  ```
  <span data-nii-derived="KEY" data-nii-format="currency|percent|plain">ערך</span>
  ```
- **משמעות `data-nii-format`, קבועה ואחידה (חובה לממש בקוד ה-JS של העמוד בדיוק כך, לא כל וריאציה אחרת):**
  - `currency` — הערך עם פסיקי אלפים ועם `₪` בתוך התג עצמו (למשל `1,838 ₪`).
  - `percent` — הערך עם סימן `%` בתוך התג עצמו (למשל `4.17%`).
  - `plain` — הערך הגולמי, בלי שום סימן נלווה.

**אסור** להשתמש בעמוד חדש בתבניות הישנות: `data-nii="KEY"` (בלי `data-nii-format`), `data-nii="KEY" data-format="..."` (עם מקף בודד), `data-nii-key`+`data-nii-format` בלי שהפורמט הוא אחד משלושת הערכים למעלה, או `data-nii-calc` (הוחלף לגמרי ב-`data-nii-derived` — גם לנוסחה פשוטה). התבניות הישנות עדיין נתמכות בכלים רק בשביל חמשת העמודים הקיימים, לתאימות לאחור בלבד.

**עבור ערך מחושב חדש** — יש להוסיף לו נוסחה מתועדת ב-`FILE_SPECIFIC_DERIVED_RULES` בתוך `check_nii_values_sync.py`, מפתח לפי נתיב הקובץ החדש, אחרי קריאה בפועל של קוד ה-JS של אותו עמוד (בדיוק כמו שנעשה עבור ארבעת העמודים הקיימים) — לא להניח שנוסחה מקובץ אחר תקפה.

## כל עמוד חדש, מכל סוג — ארבעה דברים שאסור לשכוח

1. **תיאור קצר (`meta description`)** — חובה מהרגע הראשון. שורה אחת ברורה שמסבירה על מה העמוד, מיד אחרי תג ה-`viewport` ב-`<head>` (ראו כל עמוד קיים לדוגמה לפורמט).
2. **מפת האתר** — להריץ מחדש את `build_sitemap.py` (ראו הסעיף הקודם) כדי שהעמוד החדש ייכנס ל-`sitemap.xml`.
3. **קובץ הריכוז לבינה מלאכותית** — אם לעמוד יש תוכן קבוע אמיתי (לא מחשבון/טופס/תוכן תלוי-קלט), להוסיף אותו ל-`KNOWN_FILES` בתוך `build_ai_summary.py` עם `"include"` וסיבה קצרה, ואם לא — עם `"exclude"` וסיבה. בלי זה, `build_ai_summary.py` ידפיס עליו אזהרת "קובץ לא מסווג" בכל הרצה עד שיטופל. **אם הוספת ל-`"include"`** — יש להוסיף גם שורה תואמת ל-`PATH_DESCRIPTIONS` בתוך `netlify/functions/btl-chat.js` (ראו סעיף "עוזר AI (צ'אט) באתר" למעלה), אחרת בוט הצ'אט לא ידע מתי לבחור בעמוד החדש.
4. **כפתור צ'אט ה-AI** — להוסיף תג `<script src="...btl-chat-widget.js"></script>` מיד לפני `</body>`, עם הנתיב היחסי המתאים לעומק התיקייה (ראו טבלת הנתיבים בסעיף "עוזר AI (צ'אט) באתר" למעלה). לא להעתיק את קוד הווידג'ט עצמו — רק לטעון את הקובץ המשותף. חריג: עמודי הפניה מיידית בלי תוכן (כמו `additional_guides/html/index.html`) לא צריכים אותו.

## הוספת עמוד מדריך חדש (מבוסס ערכי ביטוח לאומי, מוצג באקורדיונים)

באתר קיימות כרגע שלוש צורות בנייה שונות לעמודי מדריך (התגלה בבדיקת מבנה מפורטת). כדי לא להוסיף צורה רביעית בכל פעם, יש לפעול לפי הכללים הבאים:

1. **ברירת המחדל היא תבנית הפיילוט, תמיד.** עמוד חדש נבנה לפי המבנה של `BTL/senior_rights/nechut_vs_shairim.html` / `BTL/senior_rights/senior_citizens_rights_2026.html`, אלא אם יש סיבה טכנית מפורשת שלא (ראו סעיף 5).

2. **מבנה קובץ הנתונים:** קובץ נפרד `BTL/senior_rights/data/<שם-עמוד>-data.js` בצורה:
   ```
   const X_DATA = { lastUpdate: "...", sections: [ { id, icon, title, contentFn: function(nii) { return `...`; } } ] };
   ```
   ערכי ביטוח לאומי נקראים רק דרך `nii[key].value` (עם עזרי `v`/`c`/`p` הרגילים) — אף פעם לא מספר קשיח בתוך התוכן.

3. **שכבת המנגנון (אקורדיונים) מועתקת, לא נכתבת מחדש.** את הפונקציות `displayContent()`, `initAccordions()`, `convertHeadingsToSubAccordions()`, `processNestedHeadings()`, `openFromHash()` יש להעתיק מילה-במילה מקובץ קיים מאותה משפחה (`nechut_vs_shairim.html`), ולא לכתוב גרסה חדשה. רק שם הקבוע, הכותרות, והנתיב היחסי ל-`nii-constants.json` (`data/...` תחת `senior_rights/`, `../senior_rights/data/...` תחת `new_immigrants/`) משתנים.

4. **שום עמוד לא "גמור" בלי הטמעה ובדיקה:**
   - להריץ `python BTL/support_files/senior_rights/scripts/bake_static_content.py <page.html>` כדי להטמיע תוכן סטטי אמיתי בתוך `#content` — אסור להשאיר קובץ עם תיבת טעינה בלבד. הסקריפט מריץ בעצמו בסיום גם את בדיקת הזהות (הסעיף הבא), ועוצר אם נמצא הבדל.
   - אם רוצים רק לבדוק בלי להטמיע: `python BTL/support_files/senior_rights/scripts/verify_render_parity.py <page.html>` — התאמה מלאה (או הפרש שמאומת כרעש רינדור גרידא) נדרשת לפני שהעבודה נחשבת גמורה.
   - אחרי כל עדכון עתידי של `nii-constants.json`, יש להריץ מחדש את `bake_static_content.py` לכל עמוד שכבר יש בו תוכן סטטי מוטמע (לא רק לעמוד החדש) — ראו רשימה בסעיף הקודם.

5. **אם באמת אין ברירה וצריך מבנה שונה** — קודם לבדוק אם זה מתאים לאחת משתי הצורות האחרות הקיימות (עץ מקונן ללא `contentFn` כמו `nursing_home_guide.html`, או קונפיג+פונקציות מוטמעות כמו `senior_rights_full.html`/`new_immigrants`). אם שום דפוס קיים לא מתאים — לעצור ולבקש אישור לפני יצירת מבנה רביעי, ואם אושר לתעד אותו כאן.
