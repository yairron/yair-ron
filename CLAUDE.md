# הוראות לעבודה בפרויקט

## עדכוני ביטוח לאומי (NII)

אחרי כל שינוי ב-`BTL/senior_rights/data/nii-constants.json` — להריץ:

```
python BTL/support_files/senior_rights/scripts/update_nii_values.py
```

הסקריפט מעדכן ערכי fallback ב-`<span data-nii="...">` בכל קבצי ה-HTML תחת `BTL/senior_rights/`.

**חשוב:** הסקריפט הזה מזהה רק את התבנית `<span data-nii="KEY">`. הוא **לא** מעדכן:
- עמודים עם תוכן סטטי שהוטמע בשיטת "מנוע הליבה" (ראו סעיף הבא) — למשל `nechut_vs_shairim.html`.
- עמודים עם התבנית החלופית `<span data-nii-key="KEY" data-nii-format="...">` (למשל `imputed_income_guide.html`).

לכן אחרי עדכון `nii-constants.json` יש גם להריץ מחדש עבור כל עמוד כזה:

```
python BTL/support_files/senior_rights/scripts/bake_static_content.py <page.html>
```

הסקריפט טוען את העמוד בדפדפן אמיתי מול הערכים החדשים, לוכד את התוכן הסופי, מטמיע אותו בקובץ, ומריץ אוטומטית את `verify_render_parity.py` כדי לוודא שלא נוצר שינוי בלתי-רצוי. עמודים ידועים עם תוכן מוטמע: `nechut_vs_shairim.html`, `senior_citizens_rights_2026.html`.

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
