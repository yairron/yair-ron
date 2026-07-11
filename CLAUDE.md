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
בונה מחדש את `BTL/ai-summary.txt` — טקסט נקי (בלי HTML) מרוכז מכל העמודים שמסומנים כ-`"include"` בתוך `KNOWN_FILES` בסקריפט. הסקריפט סורק בפועל את `BTL/senior_rights` ו-`BTL/new_immigrants`, ומדפיס אזהרה מפורשת אם נמצא קובץ חדש שלא מסווג ב-`KNOWN_FILES`, או קובץ ברשימה שנמחק מהדיסק — **יש להריץ אותו ולבדוק את הפלט בכל פעם שנוסף/מוסר עמוד**, לא רק אחרי עדכון `nii-constants.json`. הערה: `BTL/files/BTL_CLEANED` הישן הוא תוצר חד-פעמי וידני מלפני שהסקריפט הזה נבנה — לא מתעדכן אוטומטית ואין להסתמך עליו כמשקף את המצב הנוכחי.

**קובץ מפת אתר:**
```
python BTL/support_files/senior_rights/scripts/build_sitemap.py
```
בונה מחדש את `BTL/sitemap.xml` עם כתובת מלאה לכל עמוד HTML תחת `BTL/senior_rights` ו-`BTL/new_immigrants` (כולל עמודים שלא ב-`ai-summary.txt` — מפת האתר היא לגילוי כללי, לא רק לתוכן שאומת). **יש להריץ מחדש בכל פעם שנוסף/מוסר עמוד.** הדומיין `https://yairron.com` הוא שורש הפרסום של `BTL` (בלי תחילית `/BTL/` בכתובת) — מאושר על ידי המשתמש: `BTL` היא התיקייה הראשית המתפרסמת לציבור (בנפרד מ-`YR1`, שהיא פרטית לשימוש אישי בלבד).

`BTL/robots.txt` — קובץ קבוע (לא סקריפט; לא צפוי להשתנות לעיתים קרובות) שמתיר סריקה כללית, חוסם את `support_files/`, ומפנה למפת האתר ולקובץ הריכוז.

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

## כל עמוד חדש, מכל סוג — שלושה דברים שאסור לשכוח

1. **תיאור קצר (`meta description`)** — חובה מהרגע הראשון. שורה אחת ברורה שמסבירה על מה העמוד, מיד אחרי תג ה-`viewport` ב-`<head>` (ראו כל עמוד קיים לדוגמה לפורמט).
2. **מפת האתר** — להריץ מחדש את `build_sitemap.py` (ראו הסעיף הקודם) כדי שהעמוד החדש ייכנס ל-`sitemap.xml`.
3. **קובץ הריכוז לבינה מלאכותית** — אם לעמוד יש תוכן קבוע אמיתי (לא מחשבון/טופס/תוכן תלוי-קלט), להוסיף אותו ל-`KNOWN_FILES` בתוך `build_ai_summary.py` עם `"include"` וסיבה קצרה, ואם לא — עם `"exclude"` וסיבה. בלי זה, `build_ai_summary.py` ידפיס עליו אזהרת "קובץ לא מסווג" בכל הרצה עד שיטופל.

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
