# קטלוג מופעים: "השלמת הכנסה" וסכומי מבחן הרכב

נוצר: 09.11.2026 · היקף: כל תיקיית `BTL` (ללא `node_modules`, קובצי PDF ו-`.gsheet`).

**מטרת הקטלוג:** שלב הכנה לתיקון. הסכום **46,138 ₪** (תקרת שווי רכב לגימלה מלאה, `vehicle_threshold_base`, NII-077) שגוי ואינו קיים יותר. בשלב זה רק מקטלגים — לא בוצע שום תיקון.

הקישורים בקובץ יחסיים לתיקייה `BTL/files/` שבה הוא יושב.

## 1. סיכום

### 1.1 מה מופיע בצילום המסך

הטבלה "מבחן נכסים ורכב" מתוך [financial-tables-and-definitions.html](../senior_rights/financial-tables-and-definitions.html) (עמוד "מנוע הליבה", תוכן מוטמע; הטבלה בנויה דינמית בשורות 1047–1057 מתוך `nii-constants.json` ומוטמעת סטטית בשורות 443–452). כל ערכי הטבלה הם תנאי הזכאות לרכב במסגרת השלמת הכנסה:

| שורה בטבלה | ערך | מפתח ב-`nii-constants.json` | מזהה |
|---|---|---|---|
| תקרת שווי רכב שוללת זכאות | 65,343 | `vehicle_threshold_extended` | NII-076 |
| קיזוז משווי רכב – עובד מעל סף ההכנסה | 19,610 | `vehicle_exempt_worker` | NII-078 |
| קיזוז משווי רכב – אינו עובד / מתחת לסף | 11,227 | `vehicle_exempt_non_worker` | NII-079 |
| סף הכנסה מעבודה – לפני גיל פרישה | 3,442 | `housing_allowance_worker_before_retirement` | NII-080 |
| סף הכנסה מעבודה – מגיל פרישה | 2,341 | `housing_allowance_worker_after_retirement` | NII-081 |
| שיעור חישוב שווי הרכב להפחתה | 3% | `vehicle_deduction_rate` | NII-082 |

### 1.1.1 הכלל העדכני לשווי רכב (אושר ע"י יאיר, 09.11.2026)

- **שווי רכב מעל 65,343 ₪** — אין זכאות להשלמת הכנסה.
- **שווי רכב עד סכום הקיזוז** (19,610 / 11,227 לפי עבודה והכנסה) — אין השפעה; קצבה מלאה, תלויה בהכנסות נוספות בלבד.
- **שווי רכב מעל סכום הקיזוז (ועד 65,343)** — (שווי הרכב − סכום הקיזוז) × 3% יורד מהקצבה **החודשית**.
- **46,138 ₪** — אינו קיים יותר, ואין סכום שמחליף אותו.
- **10,380 ₪** (מופיע בשאלון ובמחשבון) — תקרה בקצבת זקנה, לא חלק מתיקון זה. לא לגעת.
  **עדכון 10.11.2026:** התברר שבמחשבון הוא שימש בטעות כסכום קיזוז מרכב (לא עובד לפני גיל פרישה / עובד בהכנסה נמוכה). הוסר מחישוב הרכב בלבד — בהתאם לכלל: כל מי שאינו "נחשב כעובד" מקבל קיזוז 11,227.

### 1.1.2 סטטוס: בוצע (10.11.2026)

> רשימת המופעים בסעיפים 2–4 למטה משקפת את המצב **לפני** התיקון.

- `nii-constants.json`: הוסר `vehicle_threshold_base` (46,138); עודכנו התיאורים של NII-076/078/079.
- `questionnaire-engine.js`: פונקציה אחת `computeVehicleDeduction()` לשני המסלולים (ישיר / דרך שאלון הזכאות); שאלון הזכאות משתמש בתוצאה שחוזרת משאלון הרכב; נוסח קטגוריה "נחשב כעובד / כלא עובד"; שאלת גיל פרישה מוצגת למי שבחר "עד גיל 70" (מעל 70 — ממולא אוטומטית).
- שאלונים: הוסר `baseThreshold`; ב-`income-supplement-eligibility.json` נשארו רק `high_income_worker`/`other` + `niiMapping` לכל ערכי הרכב.
- טקסטים: `senior-citizens-rights-2026-data.js`, `senior_rights_full_data.js`, `faq-data.js` + `faq.html`, טבלת `financial-tables-and-definitions.html`, קישור ב-`index.html`.
- לא שונה: השאלה על קצבת שאירים/תלויים (אין לה עוד השפעה על חישוב הרכב — ממתין להחלטה); `search-widget_temp.js`; קובצי תיעוד/ארכיון.

> **הערה על שמות מפתחות מטעים:** `housing_allowance_worker_before_retirement` / `..._after_retirement` (3,442 / 2,341) מתוייגים ב-`nii-constants.json` כ"מדור לצורך השלמת הכנסה", אבל בפועל משמשים כספי ההכנסה מעבודה שקובעים איזה שווי רכב פטור חל (כך גם ב-`vehicle-income-supplement.json`: `vehicleRules.workIncomeThreshold`). כדאי לזכור בעת התיקון.

### 1.2 ספירות

- **"השלמת הכנסה" / "השלמת ההכנסה":** 2429 שורות ב-90 קבצים.
- **46,138:** 53 מופעים ב-17 קבצים.
- **65,343:** 33 מופעים ב-16 קבצים.
- **19,610:** 26 מופעים ב-13 קבצים.
- **11,227:** 25 מופעים ב-12 קבצים.
- **3,442:** 30 מופעים ב-11 קבצים.
- **2,341:** 29 מופעים ב-11 קבצים.
- **3% (שיעור הפחתת רכב):** 6 שורות.

מונחים קרובים שנמצאו ולא קוטלגו כאן לפרטים (לבחינה בשלב הבא אם רלוונטי): "הבטחת הכנסה" (~306 מופעים — גמלה נפרדת לגיל העבודה, אך לעיתים משמשת כשם הרשמי של אותה גמלה), ומזהים באנגלית בקוד: `income_supplement` (~192), `income-supplement` (~50), `incomeSupplement` (2).

## 2. ממצאי מפתח לתיקון 46,138

מופעים בקובצי מקור/עמודים (קטגוריות א׳+ב׳). סוג המנגנון קובע איך יתוקן:

| קובץ:שורה | מנגנון | הקשר (כותרת/שאלה) | קטע |
|---|---|---|---|
| [senior_rights/data/faq-data.js:1393](../senior_rights/data/faq-data.js#L1393) | קשיח (hard-coded) | איך זה עובד: | …: יש להבחין בין תקרת פטור זו לנכסים פיננסיים (41,528 ₪ ליחיד) לבין תקרת שווי הרכב הנפרדת (46,138 ₪) — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה". |
| [senior_rights/data/faq-data.js:1639](../senior_rights/data/faq-data.js#L1639) | קשיח (hard-coded) | תנאי זכאות בסיסיים להשלמת הכנסה | … (מכל המקורות) אינן עולות על תקרה מסוימת מבחן נכסים ורכב - לא בבעלותו רכב ששוויו עולה על ₪46,138 (תקרת שווי רכב, נכון ל-2026), ולא נכסים פיננסיים העולים על תקרת הפטור (ראו "האם חסכונות א… |
| [senior_rights/data/nii-constants.json:788](../senior_rights/data/nii-constants.json#L788) | מקור האמת (nii-constants) | שווי רכב בסיסי לשלילת זכאות להשלמת הכנסה | "value": 46138, |
| [senior_rights/faq.html:1886](../senior_rights/faq.html#L1886) | קשיח (hard-coded) | האם חסכונות או פיקדונות משפיעים על הזכאות? › איך זה עובד: | …: יש להבחין בין תקרת פטור זו לנכסים פיננסיים (41,528 ₪ ליחיד) לבין תקרת שווי הרכב הנפרדת (46,138 ₪) — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה". |
| [senior_rights/faq.html:2140](../senior_rights/faq.html#L2140) | קשיח (hard-coded) | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? › תנאי זכאות בסיסיים להשלמת הכנסה | … (מכל המקורות) אינן עולות על תקרה מסוימת מבחן נכסים ורכב - לא בבעלותו רכב ששוויו עולה על ₪46,138 (תקרת שווי רכב, נכון ל-2026), ולא נכסים פיננסיים העולים על תקרת הפטור (ראו "האם חסכונות א… |
| [senior_rights/financial-tables-and-definitions.html:443](../senior_rights/financial-tables-and-definitions.html#L443) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | תקרת שווי רכב לגימלה מלאה 46,138 |
| [senior_rights/questionnaire-engine.js:1653](../senior_rights/questionnaire-engine.js#L1653) | הערת קוד בלבד |  | * 1. Up to 46,138 ₪ = no deduction |
| [senior_rights/questionnaire-engine.js:1654](../senior_rights/questionnaire-engine.js#L1654) | הערת קוד בלבד |  | * 2. 46,138 to 65,343 ₪ = subtract deduction base (depends on work/retirement age), then 3% of remain… |
| [senior_rights/questionnaire-engine.js:1662](../senior_rights/questionnaire-engine.js#L1662) | הערת קוד בלבד |  | // Base threshold - no deduction up to 46,138 |
| [senior_rights/questionnaire-engine.js:1663](../senior_rights/questionnaire-engine.js#L1663) | קשיח (hard-coded) |  | const baseThreshold = vehicleRules.baseThreshold; // 46,138 |
| [senior_rights/questionnaires/income-supplement-eligibility.json:228](../senior_rights/questionnaires/income-supplement-eligibility.json#L228) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "baseThreshold": 46138, |
| [senior_rights/questionnaires/vehicle-income-supplement.json:216](../senior_rights/questionnaires/vehicle-income-supplement.json#L216) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "baseThreshold": 46138, |
| [senior_rights/senior_citizens_rights_2026.html:812](../senior_rights/senior_citizens_rights_2026.html#L812) | תוכן מוטמע (bake) – נגזר מ-data.js | 1. תנאי זכאות בסיסיים › גמלת השלמת הכנסה | …סים ורכב: בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (₪46,138). |
| [senior_rights/senior_citizens_rights_2026.html:904](../senior_rights/senior_citizens_rights_2026.html#L904) | תוכן מוטמע (bake) – נגזר מ-data.js | 6. בעלות על רכב | שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |
| [senior_rights/senior_rights_full.html:1024](../senior_rights/senior_rights_full.html#L1024) | תוכן מוטמע (bake) – נגזר מ-data.js | א. קצבת זיקנה (אזרח ותיק) › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | מבחן נכסים ורכב: בבעלות המבקש אין נכסים (מלבד דירת מגורים) או רכב מעל שווי (₪46,138). |
| [senior_rights/senior_rights_full.html:1029](../senior_rights/senior_rights_full.html#L1029) | תוכן מוטמע (bake) – נגזר מ-data.js | ב. גמלת שאירים › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | מבחן נכסים ורכב: אין נכסים (מלבד דירת מגורים) או רכב מעל שווי (₪46,138). |
| [senior_rights/senior_rights_full.html:1218](../senior_rights/senior_rights_full.html#L1218) | תוכן מוטמע (bake) – נגזר מ-data.js | בעלות על רכב | שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |

**תובנות:**

- **מקור האמת יחיד:** `nii-constants.json` שורה 788 (`vehicle_threshold_base`). שינוי שם + הרצת התהליכים לפי CLAUDE.md יעדכן את כל המופעים הדינמיים/המוטמעים.
- **מופעים דינמיים** (`${c('vehicle_threshold_base')}`) ב-`senior-citizens-rights-2026-data.js` ו-`senior_rights_full_data.js` ובטבלת `financial-tables-and-definitions.html` — יתעדכנו אוטומטית, והעותקים המוטמעים ב-HTML יתעדכנו בהרצת `bake_static_content.py`.
- **קשיח — דורש תיקון ידני:** `faq-data.js` (שאלות "האם חסכונות או פיקדונות משפיעים על הזכאות?" ו"איך יודעים אם כדאי להגיש גם השלמת הכנסה...") — הסכום כתוב כמספר קבוע, ומשתקף גם ב-`faq.html` (שאינו ברשימת עמודי ה-bake).
- **שאלונים:** `income-supplement-eligibility.json` ו-`vehicle-income-supplement.json` (`baseThreshold: 46138`) — ב-`vehicle-income-supplement.json` הערכים נדרסים בזמן ריצה מ-nii דרך `niiMapping` (שורות 229–235) — מספיק לעדכן ליתר ביטחון. **ב-`income-supplement-eligibility.json` ה-`niiMapping` (שורה 290) ממפה רק את `assetRules.baseRate` — כל ערכי הרכב שם (46,138 / 65,343 / 19,610 / 11,227 / 3,442 / 2,341) קשיחים ודורשים תיקון ידני** (או הוספת מיפוי). ב-`questionnaire-engine.js` המספר מופיע רק בהערות קוד; הלוגיקה עצמה קוראת `vehicleRules.baseThreshold`.
- **שאלה מהותית לשלב הבא:** האם בטבלה החדשה עדיין קיימות שתי תקרות (מלאה/חלקית)? אם תקרת "גימלה מלאה" בוטלה לגמרי (ולא רק שונה סכומה), הניסוח "רכב מעל שווי (46,138)" בעמודים צריך שכתוב, ולא רק החלפת מספר — וגם הלוגיקה ב-`questionnaire-engine.js` (שורות ~1653–1663: עד 46,138 אין הפחתה; 46,138–65,343 הפחתה) תצטרך שינוי.
- `files/data_mapping.md` מתעד אי-עקביות היסטורית (46,138 מול 46,317) — מקור נוסף לבדיקה.

## 3. כל מופעי הסכומים מצילום המסך

### 46,138 — תקרת שווי רכב לגימלה מלאה (`vehicle_threshold_base`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/faq.html:1886](../senior_rights/faq.html#L1886) | קשיח (hard-coded) | האם חסכונות או פיקדונות משפיעים על הזכאות? › איך זה עובד: | …: יש להבחין בין תקרת פטור זו לנכסים פיננסיים (41,528 ₪ ליחיד) לבין תקרת שווי הרכב הנפרדת (46,138 ₪) — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה". |
| A | [senior_rights/faq.html:2140](../senior_rights/faq.html#L2140) | קשיח (hard-coded) | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? › תנאי זכאות בסיסיים להשלמת הכנסה | … (מכל המקורות) אינן עולות על תקרה מסוימת מבחן נכסים ורכב - לא בבעלותו רכב ששוויו עולה על ₪46,138 (תקרת שווי רכב, נכון ל-2026), ולא נכסים פיננסיים העולים על תקרת הפטור (ראו "האם חסכונות א… |
| A | [senior_rights/financial-tables-and-definitions.html:443](../senior_rights/financial-tables-and-definitions.html#L443) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | תקרת שווי רכב לגימלה מלאה 46,138 |
| A | [senior_rights/senior_citizens_rights_2026.html:812](../senior_rights/senior_citizens_rights_2026.html#L812) | תוכן מוטמע (bake) – נגזר מ-data.js | 1. תנאי זכאות בסיסיים › גמלת השלמת הכנסה | …סים ורכב: בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (₪46,138). |
| A | [senior_rights/senior_citizens_rights_2026.html:904](../senior_rights/senior_citizens_rights_2026.html#L904) | תוכן מוטמע (bake) – נגזר מ-data.js | 6. בעלות על רכב | שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |
| A | [senior_rights/senior_rights_full.html:1024](../senior_rights/senior_rights_full.html#L1024) | תוכן מוטמע (bake) – נגזר מ-data.js | א. קצבת זיקנה (אזרח ותיק) › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | מבחן נכסים ורכב: בבעלות המבקש אין נכסים (מלבד דירת מגורים) או רכב מעל שווי (₪46,138). |
| A | [senior_rights/senior_rights_full.html:1029](../senior_rights/senior_rights_full.html#L1029) | תוכן מוטמע (bake) – נגזר מ-data.js | ב. גמלת שאירים › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | מבחן נכסים ורכב: אין נכסים (מלבד דירת מגורים) או רכב מעל שווי (₪46,138). |
| A | [senior_rights/senior_rights_full.html:1218](../senior_rights/senior_rights_full.html#L1218) | תוכן מוטמע (bake) – נגזר מ-data.js | בעלות על רכב | שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |
| B | [senior_rights/data/faq-data.js:1393](../senior_rights/data/faq-data.js#L1393) | קשיח (hard-coded) | איך זה עובד: | …: יש להבחין בין תקרת פטור זו לנכסים פיננסיים (41,528 ₪ ליחיד) לבין תקרת שווי הרכב הנפרדת (46,138 ₪) — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה". |
| B | [senior_rights/data/faq-data.js:1639](../senior_rights/data/faq-data.js#L1639) | קשיח (hard-coded) | תנאי זכאות בסיסיים להשלמת הכנסה | … (מכל המקורות) אינן עולות על תקרה מסוימת מבחן נכסים ורכב - לא בבעלותו רכב ששוויו עולה על ₪46,138 (תקרת שווי רכב, נכון ל-2026), ולא נכסים פיננסיים העולים על תקרת הפטור (ראו "האם חסכונות א… |
| B | [senior_rights/data/nii-constants.json:788](../senior_rights/data/nii-constants.json#L788) | מקור האמת (nii-constants) | שווי רכב בסיסי לשלילת זכאות להשלמת הכנסה | "value": 46138, |
| B | [senior_rights/questionnaire-engine.js:1653](../senior_rights/questionnaire-engine.js#L1653) | הערת קוד בלבד |  | * 1. Up to 46,138 ₪ = no deduction |
| B | [senior_rights/questionnaire-engine.js:1654](../senior_rights/questionnaire-engine.js#L1654) | הערת קוד בלבד |  | * 2. 46,138 to 65,343 ₪ = subtract deduction base (depends on work/retirement age), then 3% of remain… |
| B | [senior_rights/questionnaire-engine.js:1662](../senior_rights/questionnaire-engine.js#L1662) | הערת קוד בלבד |  | // Base threshold - no deduction up to 46,138 |
| B | [senior_rights/questionnaire-engine.js:1663](../senior_rights/questionnaire-engine.js#L1663) | קשיח (hard-coded) |  | const baseThreshold = vehicleRules.baseThreshold; // 46,138 |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:228](../senior_rights/questionnaires/income-supplement-eligibility.json#L228) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "baseThreshold": 46138, |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:216](../senior_rights/questionnaires/vehicle-income-supplement.json#L216) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "baseThreshold": 46138, |
| C | [files/branch_comparison_report.md:173](../files/branch_comparison_report.md#L173) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-077 ¦ `vehicle_threshold_base` ¦ שווי רכב בסיסי לשלילת זכאות ¦ 46,138 ¦ |
| C | [files/data_mapping.md:1102](../files/data_mapping.md#L1102) | תיעוד/ארכיון | תקרת שווי רכב בסיסית לשלילת זכאות | ¦ ערך (2026) ¦ 46,138 (ב-income-supplement-eligibility.json) ¦ |
| C | [files/data_mapping.md:1105](../files/data_mapping.md#L1105) | תיעוד/ארכיון | תקרת שווי רכב בסיסית לשלילת זכאות | ¦ הערה ¦ קיים אי-עקביות קלה בין הקבצים (46,138 מול 46,317) ¦ |
| C | [files/data_mapping.md:1106](../files/data_mapping.md#L1106) | תיעוד/ארכיון | תקרת שווי רכב בסיסית לשלילת זכאות | ¦ מופיע בקבצים ¦ `income-supplement-eligibility.json` (vehicleRules.baseThreshold: 46138) ¦ |
| C | [files/data_mapping.md:1747](../files/data_mapping.md#L1747) | תיעוד/ארכיון | סיכום אי-עקביות בין קבצים | 3. **שווי רכב לשלילת זכאות (בסיסי):** `income-supplement-eligibility.json` — 46,138 ₪; `Income_Supplement_Guide_and_Eligibility_2026.md` — 46,317 ₪. הפרש קטן, מצריך אימות. |
| C | [support_files/files/merged-senior-rights-2026.md:294](../support_files/files/merged-senior-rights-2026.md#L294) | תיעוד/ארכיון | 2.1 תנאי זכאות בסיסיים | …ם ורכב:** בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (₪46,138). |
| C | [support_files/files/merged-senior-rights-2026.md:379](../support_files/files/merged-senior-rights-2026.md#L379) | תיעוד/ארכיון | בעלות על רכב | - שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |
| C | [support_files/files/senior-citizens-rights-2026-data-js-converted.md:200](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L200) | תיעוד/ארכיון | 💵 גמלת השלמת הכנסה › 1. תנאי זכאות בסיסיים | …סים ורכב: בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (₪46,138). |
| C | [support_files/files/senior-citizens-rights-2026-data-js-converted.md:301](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L301) | תיעוד/ארכיון | 💵 גמלת השלמת הכנסה › בעלות על רכב | שווי הרכב נמוך מ-₪46,138 (והוא הרכב היחיד). |
| D | `ai-content/btl-faq.html` | תוצר אוטומטי | — | 2 מופעים |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 1 מופעים |
| D | `ai-content/btl-pension-overview.html` | תוצר אוטומטי | — | 5 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 19 מופעים |

### 65,343 — תקרת שווי רכב שוללת זכאות (`vehicle_threshold_extended`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:444](../senior_rights/financial-tables-and-definitions.html#L444) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | תקרת שווי רכב לגימלה חלקית 65,343 |
| A | [senior_rights/senior_rights_full.html:1445](../senior_rights/senior_rights_full.html#L1445) | תוכן מוטמע (bake) – נגזר מ-data.js | 📋 מה חייבים לדווח | רכישה, מכירה, שינוי שווי. שווי מעל ₪65,343 עשוי לפגוע בזכאות. |
| A | [senior_rights/senior_rights_full.html:1485](../senior_rights/senior_rights_full.html#L1485) | תוכן מוטמע (bake) – נגזר מ-data.js | 💰 בעת שינוי כלכלי | קניתם / מכרתם רכב → בדקו שווי. אם שווי חדש עוקף ₪65,343 — דיווח מיד. |
| B | [senior_rights/data/data_202601.html:995](../senior_rights/data/data_202601.html#L995) | קשיח (hard-coded) | 🚗 | ₪65,343 |
| B | [senior_rights/data/nii-constants.json:781](../senior_rights/data/nii-constants.json#L781) | מקור האמת (nii-constants) | שווי רכב השולל זכאות להשלמת הכנסה (תקרה מורחבת) | "value": 65343, |
| B | [senior_rights/questionnaire-engine.js:1654](../senior_rights/questionnaire-engine.js#L1654) | הערת קוד בלבד |  | * 2. 46,138 to 65,343 ₪ = subtract deduction base (depends on work/retirement age), then 3% of remainder |
| B | [senior_rights/questionnaire-engine.js:1655](../senior_rights/questionnaire-engine.js#L1655) | הערת קוד בלבד |  | * 3. Above 65,343 ₪ = no eligibility (special cases only) |
| B | [senior_rights/questionnaire-engine.js:1665](../senior_rights/questionnaire-engine.js#L1665) | הערת קוד בלבד |  | // Extended threshold - 65,343 |
| B | [senior_rights/questionnaire-engine.js:1666](../senior_rights/questionnaire-engine.js#L1666) | קשיח (hard-coded) |  | const extendedThreshold = vehicleRules.extendedThreshold; // 65,343 |
| B | [senior_rights/questionnaires/imputed-income-calculator.json:120](../senior_rights/questionnaires/imputed-income-calculator.json#L120) | קשיח בשאלון – ללא niiMapping | תוצאות החישוב | "extendedThreshold": 65343 |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:229](../senior_rights/questionnaires/income-supplement-eligibility.json#L229) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "extendedThreshold": 65343, |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:215](../senior_rights/questionnaires/vehicle-income-supplement.json#L215) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "extendedThreshold": 65343, |
| C | [files/branch_comparison_report.md:172](../files/branch_comparison_report.md#L172) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-076 ¦ `vehicle_threshold_extended` ¦ שווי רכב השולל זכאות — תקרה מורחבת ¦ 65,343 ¦ |
| C | [files/data_mapping.md:1022](../files/data_mapping.md#L1022) | תיעוד/ארכיון | שווי רכב שולל זכאות (תקרה) | ¦ ערך (2026) ¦ 65,343 ¦ |
| C | [files/data_mapping.md:1029](../files/data_mapping.md#L1029) | תיעוד/ארכיון | שווי רכב שולל זכאות (תקרה) | ¦ מופיע בקבצים ¦ `vehicle-income-supplement.json` (extendedThreshold: 65343), `imputed-income-calculator.json` (65,343₪) ¦ |
| C | [files/data_mapping.md:1029](../files/data_mapping.md#L1029) | תיעוד/ארכיון | שווי רכב שולל זכאות (תקרה) | ¦ מופיע בקבצים ¦ `vehicle-income-supplement.json` (extendedThreshold: 65343), `imputed-income-calculator.json` (65,343₪) ¦ |
| C | [files/data_mapping.md:1853](../files/data_mapping.md#L1853) | תיעוד/ארכיון | 3. תיקון הודעת אזהרה רכב — `calculateVehicleDeduction` | הסף `65,343 ₪` בהודעת אזהרה ("שווי הרכב גבוה מ-65,343 ₪") היה מחרוזת קשיחה. תוקן לקריאה דינמית: `exte… |
| C | [files/data_mapping.md:1853](../files/data_mapping.md#L1853) | תיעוד/ארכיון | 3. תיקון הודעת אזהרה רכב — `calculateVehicleDeduction` | הסף `65,343 ₪` בהודעת אזהרה ("שווי הרכב גבוה מ-65,343 ₪") היה מחרוזת קשיחה. תוקן לקריאה דינמית: `exte… |
| C | [support_files/files/Senior_Pensions_Survivors_01_2026.md:159](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L159) | תיעוד/ארכיון | ט. מוזיל רכב בהי"ה | ¦ שווי רכב שולל ¦ 60,000 ¦ 63,180 ¦ 63,180 ¦ 63,812 ¦ 65,343 ¦ |
| C | [support_files/files/השלמת הכנסה חובת דיווח.md:38](../support_files/files/השלמת הכנסה חובת דיווח.md#L38) | תיעוד/ארכיון | חובה לדווח על כל שינוי בנושאים הבאים (לכל אחד מבני הזוג) | ¦ **שינוי ברכב** ¦ רכישה, מכירה, שינוי שווי. שווי מעל 65,343 ₪ עשוי לפגוע בזכאות. ¦ |
| C | [support_files/files/השלמת הכנסה חובת דיווח.md:93](../support_files/files/השלמת הכנסה חובת דיווח.md#L93) | תיעוד/ארכיון | בעת שינוי כלכלי | - קניתם / מכרתם רכב → בדקו שווי. אם שווי חדש עוקף 65,343 ₪ --- דיווח |
| C | [support_files/senior_rights/data/data_012026_comparison.csv:52](../support_files/senior_rights/data/data_012026_comparison.csv#L52) | תיעוד/ארכיון |  | שווי רכב שללי,AVERAGE_WAGE,63812,65343,1531,2.40% |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 1 מופעים |
| D | `ai-content/btl-pension-overview.html` | תוצר אוטומטי | — | 2 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 8 מופעים |

### 19,610 — שווי רכב פטור – עובד מעל סף ההכנסה (`vehicle_exempt_worker`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:445](../senior_rights/financial-tables-and-definitions.html#L445) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד לפני גיל פרישה עם הכנסה חודשית מעל 3,442 ₪ 19,610 |
| A | [senior_rights/financial-tables-and-definitions.html:446](../senior_rights/financial-tables-and-definitions.html#L446) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד מגיל פרישה (אתה או בן/בת זוגך בגיל פרישה) עם הכנסה חודשית מעל 2,341 ₪ 19,610 |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | …עתם לגיל פרישה ואתה עובד ומשתכר יותר מ-2,341 ש"ח בחודש - יופחתו מערך הרכב סכום הזיכוי בסך 19,610 ש"ח. אם אינך עובד, או שאתה עובד ומשתכר בחודש פחות מ-3,442 ש"ח, ועדיין לא הגעת לגיל הפרישה… |
| A | [senior_rights/financial-tables-and-definitions.html:1056](../senior_rights/financial-tables-and-definitions.html#L1056) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | …עתם לגיל פרישה ואתה עובד ומשתכר יותר מ-2,341 ש"ח בחודש - יופחתו מערך הרכב סכום הזיכוי בסך 19,610 ש"ח. |
| B | [senior_rights/data/data_202601.html:1003](../senior_rights/data/data_202601.html#L1003) | קשיח (hard-coded) | 🚗 | ₪19,610 |
| B | [senior_rights/data/nii-constants.json:795](../senior_rights/data/nii-constants.json#L795) | מקור האמת (nii-constants) | שווי רכב פטור מחישוב הכנסה — עובד | "value": 19610, |
| B | [senior_rights/questionnaire-engine.js:1427](../senior_rights/questionnaire-engine.js#L1427) | קשיח (hard-coded) |  | deductionBase = rules.deductions?.high_income_worker ¦¦ 19610; |
| B | [senior_rights/questionnaire-engine.js:1692](../senior_rights/questionnaire-engine.js#L1692) | הערת קוד בלבד |  | // High income: 19,610 ₪ |
| B | [senior_rights/questionnaire-engine.js:1695](../senior_rights/questionnaire-engine.js#L1695) | קשיח (hard-coded) |  | deductionBase = vehicleRules.deductions.high_income_worker; // 19,610 |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:233](../senior_rights/questionnaires/income-supplement-eligibility.json#L233) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "high_income_worker": 19610, |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:219](../senior_rights/questionnaires/vehicle-income-supplement.json#L219) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "high_income_worker": 19610, |
| C | [files/branch_comparison_report.md:174](../files/branch_comparison_report.md#L174) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-078 ¦ `vehicle_exempt_worker` ¦ שווי רכב פטור — עובד ¦ 19,610 ¦ |
| C | [files/data_mapping.md:1038](../files/data_mapping.md#L1038) | תיעוד/ארכיון | שווי רכב לא נחשב לעובד | ¦ ערך (2026) ¦ 19,610 ¦ |
| C | [files/data_mapping.md:1045](../files/data_mapping.md#L1045) | תיעוד/ארכיון | שווי רכב לא נחשב לעובד | …קבצים ¦ `income-supplement-eligibility.json` (vehicleRules.deductions.high_income_worker: 19610) ¦ |
| C | [senior_rights/sampels_questions.json:1017](../senior_rights/sampels_questions.json#L1017) | תיעוד/ארכיון | דוגמה 3: זוג, שכר 10,000 ₪ + שכירות 6,000 ₪, שניהם 35 שנים | "result": "סה\"כ: 16,000 + 3,610 = 19,610 ₪" |
| C | [support_files/files/Senior_Pensions_Survivors_01_2026.md:160](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L160) | תיעוד/ארכיון | ט. מוזיל רכב בהי"ה | ¦ שווי רכב לא נחשב לעבד ¦ 18,006 ¦ 18,960 ¦ 18,960 ¦ 19,150 ¦ 19,610 ¦ |
| C | [support_files/senior_rights/data/data_012026_comparison.csv:53](../support_files/senior_rights/data/data_012026_comparison.csv#L53) | תיעוד/ארכיון |  | שווי רכב לא נחשב לעובד,MIN_WAGE_NOT_MARRIED,19150,19610,460,2.40% |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 3 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 6 מופעים |

### 11,227 — שווי רכב פטור – אינו עובד / מתחת לסף (`vehicle_exempt_non_worker`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:447](../senior_rights/financial-tables-and-definitions.html#L447) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לאינו עובד, או עובד לפני גיל פרישה עם הכנסה חודשית עד 3,442 ₪ 11,227 |
| A | [senior_rights/financial-tables-and-definitions.html:448](../senior_rights/financial-tables-and-definitions.html#L448) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד מגיל פרישה (אתה או בן/בת זוגך בגיל פרישה) עם הכנסה חודשית עד 2,341 ₪ 11,227 |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | … זוגך הגעתם לגיל פרישה ומשתכרים בחודש פחות מ-2,341 ש"ח - יופחתו מערך הרכב סכום הזיכוי בסך 11,227 ש"ח. |
| A | [senior_rights/financial-tables-and-definitions.html:1057](../senior_rights/financial-tables-and-definitions.html#L1057) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | … זוגך הגעתם לגיל פרישה ומשתכרים בחודש פחות מ-2,341 ש"ח - יופחתו מערך הרכב סכום הזיכוי בסך 11,227 ש"ח. |
| B | [senior_rights/data/data_202601.html:1011](../senior_rights/data/data_202601.html#L1011) | קשיח (hard-coded) | 🚗 | ₪11,227 |
| B | [senior_rights/data/nii-constants.json:802](../senior_rights/data/nii-constants.json#L802) | מקור האמת (nii-constants) | שווי רכב פטור מחישוב הכנסה — לא עובד | "value": 11227, |
| B | [senior_rights/questionnaire-engine.js:1434](../senior_rights/questionnaire-engine.js#L1434) | קשיח (hard-coded) |  | deductionBase = rules.deductions?.other ¦¦ 11227; |
| B | [senior_rights/questionnaire-engine.js:1704](../senior_rights/questionnaire-engine.js#L1704) | הערת קוד בלבד |  | // Retirement age / survivors benefit / work injury dependents: 11,227 ₪ |
| B | [senior_rights/questionnaire-engine.js:1705](../senior_rights/questionnaire-engine.js#L1705) | קשיח (hard-coded) |  | deductionBase = vehicleRules.deductions.non_worker_extended; // 11,227 |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:236](../senior_rights/questionnaires/income-supplement-eligibility.json#L236) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "non_worker_extended": 11227 |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:220](../senior_rights/questionnaires/vehicle-income-supplement.json#L220) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "other": 11227 |
| C | [files/branch_comparison_report.md:175](../files/branch_comparison_report.md#L175) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-079 ¦ `vehicle_exempt_non_worker` ¦ שווי רכב פטור — לא עובד ¦ 11,227 ¦ |
| C | [files/data_mapping.md:1054](../files/data_mapping.md#L1054) | תיעוד/ארכיון | שווי רכב לא נחשב — לא עובד | ¦ ערך (2026) ¦ 11,227 ¦ |
| C | [files/data_mapping.md:1061](../files/data_mapping.md#L1061) | תיעוד/ארכיון | שווי רכב לא נחשב — לא עובד | …בצים ¦ `income-supplement-eligibility.json` (vehicleRules.deductions.non_worker_extended: 11227) ¦ |
| C | [support_files/files/Senior_Pensions_Survivors_01_2026.md:161](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L161) | תיעוד/ארכיון | ט. מוזיל רכב בהי"ה | ¦ שווי רכב לא נחשב ללא עובד ¦ 10,309 ¦ 10,855 ¦ 10,855 ¦ 10,964 ¦ 11,227 ¦ |
| C | [support_files/senior_rights/data/data_012026_comparison.csv:54](../support_files/senior_rights/data/data_012026_comparison.csv#L54) | תיעוד/ארכיון |  | שווי רכב לא נחשב ללאו עובד,MIN_WAGE_NOT_MARRIED_2,10964,11227,263,2.40% |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 3 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 6 מופעים |

### 3,442 — סף הכנסה מעבודה – לפני גיל פרישה (`housing_allowance_worker_before_retirement`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:445](../senior_rights/financial-tables-and-definitions.html#L445) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד לפני גיל פרישה עם הכנסה חודשית מעל 3,442 ₪ 19,610 |
| A | [senior_rights/financial-tables-and-definitions.html:447](../senior_rights/financial-tables-and-definitions.html#L447) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לאינו עובד, או עובד לפני גיל פרישה עם הכנסה חודשית עד 3,442 ₪ 11,227 |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | אם אתה עובד ומשתכר בחודש יותר מ-3,442 ש"ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר… |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | אם אתה עובד ומשתכר בחודש יותר מ-3,442 ש"ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר… |
| A | [senior_rights/financial-tables-and-definitions.html:1056](../senior_rights/financial-tables-and-definitions.html#L1056) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | אם אתה עובד ומשתכר בחודש יותר מ-3,442 ש"ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר… |
| A | [senior_rights/financial-tables-and-definitions.html:1057](../senior_rights/financial-tables-and-definitions.html#L1057) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | אם אינך עובד, או שאתה עובד ומשתכר בחודש פחות מ-3,442 ש"ח, ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ומשתכרים בחודש פחות … |
| B | [senior_rights/data/data_202601.html:1019](../senior_rights/data/data_202601.html#L1019) | קשיח (hard-coded) | 🚗 | ₪3,442 |
| B | [senior_rights/data/nii-constants.json:809](../senior_rights/data/nii-constants.json#L809) | מקור האמת (nii-constants) | מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה (25% מהשכר הממוצע) | "value": 3442, |
| B | [senior_rights/questionnaire-engine.js:1406](../senior_rights/questionnaire-engine.js#L1406) | קשיח (hard-coded) |  | : (rules.workIncomeThreshold?.regular ¦¦ 3442); |
| B | [senior_rights/questionnaire-engine.js:1417](../senior_rights/questionnaire-engine.js#L1417) | קשיח (hard-coded) |  | effectiveWorkIncome = rules.workIncomeThreshold?.regular ¦¦ 3442; // 25% מהשכר הממוצע |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:239](../senior_rights/questionnaires/income-supplement-eligibility.json#L239) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "regular": 3442, |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:243](../senior_rights/questionnaires/income-supplement-eligibility.json#L243) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "high_income_worker": "עובד (שכיר/עצמאי) שהכנסתו מהעבודה עולה על 3,442 ₪/חודש (או 2,341 ₪ לעובד בגיל פרישה)", |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:244](../senior_rights/questionnaires/income-supplement-eligibility.json#L244) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "low_income_worker": "עובד שהכנסתו מהעבודה אינה עולה על 3,442 ₪/חודש (או 2,341 ₪ לעובד בגיל פרישה)", |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:223](../senior_rights/questionnaires/vehicle-income-supplement.json#L223) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "regular": 3442, |
| C | [files/branch_comparison_report.md:176](../files/branch_comparison_report.md#L176) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | …sing_allowance_worker_before_retirement` ¦ מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה ¦ 3,442 ¦ |
| C | [files/data_mapping.md:1070](../files/data_mapping.md#L1070) | תיעוד/ארכיון | מדור עובד לפני גיל פרישה (25%) | ¦ ערך (2026) ¦ 3,442 ¦ |
| C | [files/data_mapping.md:1077](../files/data_mapping.md#L1077) | תיעוד/ארכיון | מדור עובד לפני גיל פרישה (25%) | ¦ מופיע בקבצים ¦ `income-supplement-eligibility.json` (workIncomeThreshold.regular: 3442) ¦ |
| C | [support_files/files/Senior_Pensions_Survivors_01_2026.md:162](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L162) | תיעוד/ארכיון | ט. מוזיל רכב בהי"ה | ¦ מודד עובד לפני גיל פרישה 25% ¦ 2,638 ¦ 2,968 ¦ 3,134 ¦ 3,329 ¦ 3,442 ¦ |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 4 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 8 מופעים |

### 2,341 — סף הכנסה מעבודה – מגיל פרישה (`housing_allowance_worker_after_retirement`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:446](../senior_rights/financial-tables-and-definitions.html#L446) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד מגיל פרישה (אתה או בן/בת זוגך בגיל פרישה) עם הכנסה חודשית מעל 2,341 ₪ 19,610 |
| A | [senior_rights/financial-tables-and-definitions.html:448](../senior_rights/financial-tables-and-definitions.html#L448) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שווי רכב פטור לעובד מגיל פרישה (אתה או בן/בת זוגך בגיל פרישה) עם הכנסה חודשית עד 2,341 ₪ 11,227 |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | …ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר מ-2,341 ש"ח בחודש - יופחתו מערך הרכב סכום הזיכוי בסך 19,610 ש"ח. אם אינך עובד, או שאתה עובד ומשתכ… |
| A | [senior_rights/financial-tables-and-definitions.html:451](../senior_rights/financial-tables-and-definitions.html#L451) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | …ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר מ-2,341 ש"ח בחודש - יופחתו מערך הרכב סכום הזיכוי בסך 19,610 ש"ח. אם אינך עובד, או שאתה עובד ומשתכ… |
| A | [senior_rights/financial-tables-and-definitions.html:1056](../senior_rights/financial-tables-and-definitions.html#L1056) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | …ח ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ואתה עובד ומשתכר יותר מ-2,341 ש"ח בחודש - יופחתו מערך הרכב סכום הזיכוי בסך 19,610 ש"ח. |
| A | [senior_rights/financial-tables-and-definitions.html:1057](../senior_rights/financial-tables-and-definitions.html#L1057) | תוכן מוטמע (bake) – נגזר מ-data.js | תקרות הכנסה מעבודה › מבחן נכסים ורכב | …"ח, ועדיין לא הגעת לגיל הפרישה; או שאתה או בת זוגך הגעתם לגיל פרישה ומשתכרים בחודש פחות מ-2,341 ש"ח - יופחתו מערך הרכב סכום הזיכוי בסך 11,227 ש"ח. |
| B | [senior_rights/data/data_202601.html:1027](../senior_rights/data/data_202601.html#L1027) | קשיח (hard-coded) | 🚗 | ₪2,341 |
| B | [senior_rights/data/nii-constants.json:816](../senior_rights/data/nii-constants.json#L816) | מקור האמת (nii-constants) | מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה (17% מהשכר הממוצע) | "value": 2341, |
| B | [senior_rights/questionnaire-engine.js:1405](../senior_rights/questionnaire-engine.js#L1405) | קשיח (hard-coded) |  | ? (rules.workIncomeThreshold?.retirement ¦¦ 2341) |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:240](../senior_rights/questionnaires/income-supplement-eligibility.json#L240) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "retirement": 2341 |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:243](../senior_rights/questionnaires/income-supplement-eligibility.json#L243) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "high_income_worker": "עובד (שכיר/עצמאי) שהכנסתו מהעבודה עולה על 3,442 ₪/חודש (או 2,341 ₪ לעובד בגיל פרישה)", |
| B | [senior_rights/questionnaires/income-supplement-eligibility.json:244](../senior_rights/questionnaires/income-supplement-eligibility.json#L244) | קשיח בשאלון – ללא niiMapping | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "low_income_worker": "עובד שהכנסתו מהעבודה אינה עולה על 3,442 ₪/חודש (או 2,341 ₪ לעובד בגיל פרישה)", |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:224](../senior_rights/questionnaires/vehicle-income-supplement.json#L224) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "retirement": 2341 |
| C | [files/branch_comparison_report.md:177](../files/branch_comparison_report.md#L177) | תיעוד/ארכיון | 🆕 ערכים חדשים (לא קיימים ב-main) | …ousing_allowance_worker_after_retirement` ¦ מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה ¦ 2,341 ¦ |
| C | [files/data_mapping.md:1086](../files/data_mapping.md#L1086) | תיעוד/ארכיון | מדור עובד מעל גיל פרישה (17%) | ¦ ערך (2026) ¦ 2,341 ¦ |
| C | [files/data_mapping.md:1093](../files/data_mapping.md#L1093) | תיעוד/ארכיון | מדור עובד מעל גיל פרישה (17%) | ¦ מופיע בקבצים ¦ `income-supplement-eligibility.json` (workIncomeThreshold.retirement: 2341) ¦ |
| C | [support_files/files/Senior_Pensions_Survivors_01_2026.md:163](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L163) | תיעוד/ארכיון | ט. מוזיל רכב בהי"ה | ¦ מודד עובד מעל גיל פרישה 17% ¦ 1,794 ¦ 2,018 ¦ 2,131 ¦ 2,264 ¦ 2,341 ¦ |
| D | `ai-content/btl-income-test.html` | תוצר אוטומטי | — | 4 מופעים |
| D | `senior_rights/data/search-index.json` | תוצר אוטומטי | — | 8 מופעים |

### 3% — שיעור חישוב שווי הרכב להפחתה (`vehicle_deduction_rate`)

| קטגוריה | קובץ:שורה | מנגנון | הקשר | קטע |
|---|---|---|---|---|
| A | [senior_rights/financial-tables-and-definitions.html:449](../senior_rights/financial-tables-and-definitions.html#L449) | תוכן מוטמע (bake) – נגזר מ-data.js | מבחן נכסים ורכב | שיעור חישוב שווי הרכב להפחתה 3% |
| A | [senior_rights/financial-tables-and-definitions.html:1053](../senior_rights/financial-tables-and-definitions.html#L1053) | דינמי מ-nii-constants | תקרות הכנסה מעבודה › מבחן נכסים ורכב | שיעור חישוב שווי הרכב להפחתה ${g('vehicle_deduction_rate') * 100}% |
| B | [senior_rights/data/nii-constants.json:821](../senior_rights/data/nii-constants.json#L821) | מקור האמת (nii-constants) | שיעור חישוב שווי הרכב להפחתה מהשלמת הכנסה (3%) | "vehicle_deduction_rate": { |
| B | [senior_rights/data/nii-constants.json:825](../senior_rights/data/nii-constants.json#L825) | מקור האמת (nii-constants) | שיעור חישוב שווי הרכב להפחתה מהשלמת הכנסה (3%) | "label": "שיעור חישוב שווי הרכב להפחתה מהשלמת הכנסה (3%)", |
| B | [senior_rights/questionnaires/vehicle-income-supplement.json:235](../senior_rights/questionnaires/vehicle-income-supplement.json#L235) | fallback בשאלון – נדרס מ-nii (niiMapping) | חישוב השפעת הרכב על תוספת הבטחת הכנסה | "vehicleRules.deductionRate": "vehicle_deduction_rate" |
| D | [ai-content/btl-income-test.html:1428](../ai-content/btl-income-test.html#L1428) | תוצר אוטומטי |  | שיעור חישוב שווי הרכב להפחתה 3% |

## 4. קטלוג מופעי "השלמת הכנסה" לפי קובץ

לכל קובץ: מספר שורה, ההקשר (הכותרת/השאלה/האקורדיון הקרוב ביותר שמעל המופע), וקטע טקסט סביב המופע. בקטגוריה ד׳ (תוצרים אוטומטיים) מוצגת ספירה בלבד — הם נבנים מחדש מהמקורות שבקטגוריות א׳–ב׳.

### תוכן עניינים

- **א. עמודי אתר ציבוריים (HTML)** — 30 קבצים, 255 שורות
- **ב. קובצי נתונים / JS / שאלונים שמזינים את העמודים** — 13 קבצים, 310 שורות
- **ג. תיעוד, ארכיון וקבצי עבודה (לא מוצגים באתר)** — 39 קבצים, 303 שורות
- **ד. תוצרים שנבנים אוטומטית (ai-content, search-index) – מתעדכנים מהמקור** — 8 קבצים, 1561 שורות

### א. עמודי אתר ציבוריים (HTML)

| קובץ | מופעים | סוג |
|---|---|---|
| [additional_guides/html/additional_guides_index.html](../additional_guides/html/additional_guides_index.html) | 3 |  |
| [additional_guides/html/amnot_binleumiot.html](../additional_guides/html/amnot_binleumiot.html) | 5 | קבוצה ד׳ |
| [additional_guides/html/chanaya_shmura_ezrach_vatik.html](../additional_guides/html/chanaya_shmura_ezrach_vatik.html) | 1 |  |
| [additional_guides/html/chovaat_hitatzbut.html](../additional_guides/html/chovaat_hitatzbut.html) | 6 |  |
| [additional_guides/html/dmei_michya_leshairim.html](../additional_guides/html/dmei_michya_leshairim.html) | 1 |  |
| [additional_guides/html/gamlay_zikna.html](../additional_guides/html/gamlay_zikna.html) | 12 | קבוצה ד׳ |
| [additional_guides/html/hagdarat_tluim.html](../additional_guides/html/hagdarat_tluim.html) | 1 |  |
| [additional_guides/html/mekarim_meyuchadim.html](../additional_guides/html/mekarim_meyuchadim.html) | 7 | קבוצה ד׳ |
| [additional_guides/html/nechut_klalit_mul_avoda.html](../additional_guides/html/nechut_klalit_mul_avoda.html) | 1 |  |
| [additional_guides/html/nechut_mul_shairim.html](../additional_guides/html/nechut_mul_shairim.html) | 3 | קבוצה ד׳ |
| [additional_guides/html/oved_zar_bituach_leumi.html](../additional_guides/html/oved_zar_bituach_leumi.html) | 1 |  |
| [additional_guides/html/shaagat_haari.html](../additional_guides/html/shaagat_haari.html) | 1 |  |
| [additional_guides/html/takrut_hachnasa.html](../additional_guides/html/takrut_hachnasa.html) | 1 | קבוצה ד׳ |
| [additional_guides/html/tkufat_achshara.html](../additional_guides/html/tkufat_achshara.html) | 1 |  |
| [additional_guides/html/yetzia_lachul.html](../additional_guides/html/yetzia_lachul.html) | 11 |  |
| [additional_guides/html/yipuy_koach_mitmashech.html](../additional_guides/html/yipuy_koach_mitmashech.html) | 1 |  |
| [additional_guides/html/zchuyot_achrei_ishpuz.html](../additional_guides/html/zchuyot_achrei_ishpuz.html) | 2 |  |
| [index.html](../index.html) | 4 |  |
| [new_immigrants/gimlat_zikna_meyuchedet.html](../new_immigrants/gimlat_zikna_meyuchedet.html) | 16 | מנוע הליבה (bake) |
| [new_immigrants/international_treaties.html](../new_immigrants/international_treaties.html) | 13 | מנוע הליבה (bake) |
| [senior_rights/counseling_referral_form.html](../senior_rights/counseling_referral_form.html) | 2 |  |
| [senior_rights/faq.html](../senior_rights/faq.html) | 93 |  |
| [senior_rights/financial-tables-and-definitions.html](../senior_rights/financial-tables-and-definitions.html) | 10 | מנוע הליבה (bake) |
| [senior_rights/forms.html](../senior_rights/forms.html) | 2 |  |
| [senior_rights/imputed_income_guide.html](../senior_rights/imputed_income_guide.html) | 3 | קבוצה ד׳ |
| [senior_rights/nechut_vs_shairim.html](../senior_rights/nechut_vs_shairim.html) | 3 | מנוע הליבה (bake) |
| [senior_rights/senior_citizens_rights_2026.html](../senior_rights/senior_citizens_rights_2026.html) | 14 | מנוע הליבה (bake) |
| [senior_rights/senior_rights_full.html](../senior_rights/senior_rights_full.html) | 32 | מנוע הליבה (bake) |
| [senior_rights/sherutim_meiuchadim.html](../senior_rights/sherutim_meiuchadim.html) | 1 |  |
| [senior_rights/survivors_benefits_guide_2026.html](../senior_rights/survivors_benefits_guide_2026.html) | 4 | קבוצה ד׳ |

#### `additional_guides/html/additional_guides_index.html` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [72](../additional_guides/html/additional_guides_index.html#L72) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [156](../additional_guides/html/additional_guides_index.html#L156) | דמי מחיה לשאירים בביטוח לאומי | השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה |
| [167](../additional_guides/html/additional_guides_index.html#L167) | השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה | יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה |

#### `additional_guides/html/amnot_binleumiot.html` (5)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/amnot_binleumiot.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [85](../additional_guides/html/amnot_binleumiot.html#L85) | 🌍 אמנות בינלאומיות לביטחון סוציאלי | … אבטלה ❌ לא— כמעט בכלל לא נכלל סיעוד ❌ לא— אינו נכלל באמנות ניידות ❌ לא— אינו נכלל באמנות השלמת הכנסה ❌ לא— אינו נכלל באמנות • .תקופות ביטוח מישראל ומדינת האמנה מצטרפות לצורך השגת תקופת האכשר… |
| [85](../additional_guides/html/amnot_binleumiot.html#L85) | 🌍 אמנות בינלאומיות לביטחון סוציאלי | … .ישראלית, נוטריון מוכר, או רשות מקומית במדינה שבה מתגורר • חריג לשהות זמנית בחו"ל: מקבלי השלמת הכנסה רשאים לשהות בחו"ל עד72 ימים בשנה קלנדרית ולא יותר מ- 3 פעמים— .ותוספת ההשלמה תמשיך להישלח… |
| [85](../additional_guides/html/amnot_binleumiot.html#L85) | פרמטר )גמלה מיוחדת (משרד האוצר קצבה חלקית דרך אמנה › השוואה: גמל ת זיקנה מיוחדת לעומת קצבה רגילה דרך אמנה | …ייה ✅ )אפשרי (אמנה ✅ כן— מוטרת האמנה מבחן הכנסות עד70 מעבודה בלבד )רגיל (עבודה ולא מעבודה השלמת הכנסה ✅ זכאי ✅ )זכאי (אם תושב ישראל תוקף בחו"ל לא— תלוי תושבות לפי כללי האמנה נקודות מפתח ורשימ… |
| [85](../additional_guides/html/amnot_binleumiot.html#L85) | ⚠ טעות נפוצה: יועצים רבים מניחים שמי שעלה מאוחר 'לא מגיע לו כלום'. בפו › נקודות מפתח ורשימת בדיקה ליועץ | …וחר 'לא מגיע לו כלום'. בפועל— ייתכן שהוא זכאי לגמלה ▼ ! תוספת עבור בן/בת זוג. חובה לבדוק+ השלמת הכנסה+ קצבה חלקית מהמדינה הקודמת+ מיוחדת ▼ :מקורותbtl.gov.il — ¦ גמלת אזרח ותיק מיוחדת, אמנות ב… |

#### `additional_guides/html/chanaya_shmura_ezrach_vatik.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/chanaya_shmura_ezrach_vatik.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/chovaat_hitatzbut.html` (6)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../additional_guides/html/chovaat_hitatzbut.html#L6) |  | (בתוך תג/מאפיין) …ta name="description" content="מדריך לחובת התייצבות בלשכת שירות התעסוקה כתנאי לקבלת תוספת השלמת הכנסה בגיל זקנה."> |
| [9](../additional_guides/html/chovaat_hitatzbut.html#L9) |  | השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה |
| [76](../additional_guides/html/chovaat_hitatzbut.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [84](../additional_guides/html/chovaat_hitatzbut.html#L84) | 📂 מסמכים | 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה |
| [85](../additional_guides/html/chovaat_hitatzbut.html#L85) | חובת התייצבות בשירות התעסוקה— הכלל המרכזי | …גיל פרישה— חייב להתייצב בלשכת שירות התעסוקה על פי הכללים הנהוגים .בה הנימוק המשפטי: תוספת השלמת הכנסה בגיל זיקנה מבוססת על חוק הביטוח הלאומי, ומפנה לתנאי הזכאות של חוק הבטחת הכנסה . לפיכך, בן… |
| [85](../additional_guides/html/chovaat_hitatzbut.html#L85) | השלכות על בן/בת הזוג החייב/ת בהתייצבות | …ת הזוג שטרם הגיע/ה לגיל פרישה את החובה להשתלב בשוק העבודה .הסיבה: המדינה אינה מחויבת לממן השלמת הכנסה כאשר אחד מבני הזוג כשיר/ה לעבוד .מסמך זה נועד לייעוץ מקצועי בלבד. לבדיקת זכאות אישית יש ל… |

#### `additional_guides/html/dmei_michya_leshairim.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/dmei_michya_leshairim.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/gamlay_zikna.html` (12)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/gamlay_zikna.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | גיל הזכאות לקצבת אזרח ותיק. › חלק א׳— מבוא | …כאי מי שההכנסות שלא מעבודה שלו ושל בן או בת זוגו לא עולות על סכום קצבת אזרח ותיק עם תוספת השלמת ההכנסה שהוא זכאי לה לפי הרכב המשפחה ולפי גי .ל גובה הגמלה ▼ פריט מצב בגמלה המיוחדת ▼ קצבה בסיסית… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | פריט מצב בגמלה המיוחדת › חלק א׳— מבוא | …וג ✅ כן— בתנאי שבן/בת הזוג עומד/ת בהגדרה החוקית תוספת עבור ילדים ✅ כן— בהתאם לתנאים תוספת השלמת הכנסה ✅ כן— נבחנת ומשולמת לפי תנאי זכאות רגילים חיסכון בדמי ביטוח בריאות ✅ כן— שיעורים מיוחדים … |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | פרמטר פרטים › חלק א׳— מבוא | …יחת מסמכים באתר / דואר / פקס רטרואקטיבי בתנאים מסוימים— ניתן לקבל עבור תקופה שקדמה לתביעה השלמת הכנסה ( טופס נפרד430 ) מצורף לטופס4501 :מסמכים נדרשים ▼ • )תעודת עולה (ממשרד הקליטה— .להוכחת מע… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | ענף ביטוח ?נכלל ברוב האמנות הרחבות › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | … אבטלה ❌ לא— כמעט בכלל לא נכלל סיעוד ❌ לא— אינו נכלל באמנות ניידות ❌ לא— אינו נכלל באמנות השלמת הכנסה ❌ לא— אינו נכלל באמנות .ב4 — צירוף תקופות ביטוח— פירוט ▼ :א. לקצבת זיקנה ▼ • .תקופות ביטו… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | מצב ?מה קורה לקצבה הישראלית › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | …ור חיים— חתום ע"י קונסוליה .ישראלית, נוטריון מוכר, או רשות מקומית במדינה שבה מתגורר .ב6 — השלמת הכנסה ואמנות ▼ ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להשלמת הכנסה,… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | .ב6 — השלמת הכנסה ואמנות › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | …ור חיים— חתום ע"י קונסוליה .ישראלית, נוטריון מוכר, או רשות מקומית במדינה שבה מתגורר .ב6 — השלמת הכנסה ואמנות ▼ ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להשלמת הכנסה,… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | .ב6 — השלמת הכנסה ואמנות › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | …ור חיים— חתום ע"י קונסוליה .ישראלית, נוטריון מוכר, או רשות מקומית במדינה שבה מתגורר .ב6 — השלמת הכנסה ואמנות ▼ ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להשלמת הכנסה,… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להש › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | השלמת הכנסה ואמנות ▼ ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להשלמת הכנסה,… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | .גר במדינת אמנה. השלמת הכנסה ניתנת רק לתושבי ישראל › חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי | ccordion-header"> ⚠ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל— לא זכאי להשלמת הכנסה, גם אם ▼ .גר במדינת אמנה. השל… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | פרמטר )גמלה מיוחדת (משרד האוצר קצבה חלקית דרך אמנה › חלק ג׳ — השוואה: גמלה מיוחדת לעומת קצבה רגילה דרך אמנה | …יה ✅ )אפשרי (אמנה ✅ כן— מוטרת האמנה מבחן הכנסות עד 70 מעבודה בלבד )רגיל (עבודה ולא מעבודה השלמת הכנסה ✅ זכאי ✅ )זכאי (אם תושב ישראל תוקף בחו"ל לא— תלוי תושבות לפי כללי האמנה חלק ד׳— נקודות מפ… |
| [85](../additional_guides/html/gamlay_zikna.html#L85) | ⚠ טעות נפוצה: יועצים רבים מניחים שמי שעלה מאוחר 'לא מגיע לו כלום'. בפו › חלק ד׳— נקודות מפתח ורשימת בדיקה ליועץ | …וחר 'לא מגיע לו כלום'. בפועל— ייתכן שהוא זכאי לגמלה ▼ ! תוספת עבור בן/בת זוג. חובה לבדוק+ השלמת הכנסה+ קצבה חלקית מהמדינה הקודמת+ מיוחדת ▼ :מקורותbtl.gov.il — ¦ גמלת אזרח ותיק מיוחדת, אמנות ב… |

#### `additional_guides/html/hagdarat_tluim.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/hagdarat_tluim.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/mekarim_meyuchadim.html` (7)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/mekarim_meyuchadim.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | ⚠️ מקרים מיוחדים בגמלאות ביטוח לאומי | מדריך ליועצים— קצבת זיקנה, השלמת הכנסה, שאירים, נכות, ניידות :מקורותbtl.gov.il ¦ kolzchut.org.il ¦ עדכון: מרץ2026 )א. קצבת אזרח … |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | קצבת נכות מעבודה+ ג. קצבת זיקנה — ניגוד וברירה | …אומי עשוי להוון את קצבת הנכות (תשלום חד- )פעמי — ולאחר ההיוון תשולם קצבת .הזיקנה ד. תוספת השלמת הכנסה— מקרים מיוחדים וחריגים ▼ 1 . הכנסות שאינן נלקחות )בחשבון (אינן פוגעות בזכאות ▼ • קצבת ילד… |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | 3 . השכרת דירה— הסדר מיוחד › ד. תוספת השלמת הכנסה— מקרים מיוחדים וחריגים | …הכנסה מהשכרת דירתו שאינה עולה על דמי השכירות שהוא משלם (מ- 01.01.2019 .) 4 . שהייה בחו"ל— השלמת הכנסה ▼ • עד 3 יציאות לחו"ל בשנה קלנדרית וסה"כ עד 72 ימים— .ממשיך לקבל השלמת הכנסה בכל ימי השהו… |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | 4 . שהייה בחו"ל— השלמת הכנסה › ד. תוספת השלמת הכנסה— מקרים מיוחדים וחריגים | ינה עולה על דמי השכירות שהוא משלם (מ- 01.01.2019 .) 4 . שהייה בחו"ל— השלמת הכנסה ▼ • עד 3 יציאות לחו"ל בשנה קלנדרית וסה"כ עד 72 ימים— .ממשיך לקבל השלמת הכנסה בכל ימי השהו… |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | 5. מי שאינו זכאי לקצבת זיקנה כלל › ד. תוספת השלמת הכנסה— מקרים מיוחדים וחריגים | s" data-nii-format="plain">72 ימים— .ממשיך לקבל השלמת הכנסה בכל ימי השהות בחו"ל • )יציאה מסיבה מוצדקת (טיפול רפואי, אבל על קרוב ממדרגה ראשונה— .יש לפ… |
| [85](../additional_guides/html/mekarim_meyuchadim.html#L85) | ז. גמלת ניידות — מקרים מיוחדים | … גמלת ניידות — מקרים מיוחדים ▼ • .גמלת ניידות אינה נלקחת בחשבון כהכנסה לצורך מבחן הכנסות בהשלמת הכנסה • .גמלת ניידות פטורה מניכוי דמי ביטוח בריאות • מקבל שירותים מיוחדים עם הכרה בניידות מרבית… |

#### `additional_guides/html/nechut_klalit_mul_avoda.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/nechut_klalit_mul_avoda.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/nechut_mul_shairim.html` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/nechut_mul_shairim.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [85](../additional_guides/html/nechut_mul_shairim.html#L85) | ד. מענקים נוספים › 5 . יתרונות קצבת השאירים | … עם ילדים זכאים למענקים: מענק בר- .מצווה, מענק לימודים, מענק נישואין ודמי מחיה ליתומים ה. השלמת הכנסה ▼ לקצבת שאירים ניתן לקבל תוספת השלמת הכנסה אם ההכנסה הכוללת נמוכה מהסף הקבוע. זהו יתרון ל… |
| [85](../additional_guides/html/nechut_mul_shairim.html#L85) | ה. השלמת הכנסה › 5 . יתרונות קצבת השאירים | … עם ילדים זכאים למענקים: מענק בר- .מצווה, מענק לימודים, מענק נישואין ודמי מחיה ליתומים ה. השלמת הכנסה ▼ לקצבת שאירים ניתן לקבל תוספת השלמת הכנסה אם ההכנסה הכוללת נמוכה מהסף הקבוע. זהו יתרון ל… |

#### `additional_guides/html/oved_zar_bituach_leumi.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/oved_zar_bituach_leumi.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/shaagat_haari.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/shaagat_haari.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/takrut_hachnasa.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/takrut_hachnasa.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/tkufat_achshara.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/tkufat_achshara.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/yetzia_lachul.html` (11)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../additional_guides/html/yetzia_lachul.html#L6) |  | (בתוך תג/מאפיין)  <meta name="description" content="מדריך להשפעת יציאה לחו"ל על המשך תשלום קצבת זקנה והשלמת הכנסה, כולל כללי ימי שהייה מותרים."> |
| [9](../additional_guides/html/yetzia_lachul.html#L9) |  | יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה |
| [76](../additional_guides/html/yetzia_lachul.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [84](../additional_guides/html/yetzia_lachul.html#L84) | 📂 מסמכים | ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה | השלמת הכנסה מדריך מקיף למייעצים ולאזרחים ותיקים ( מבוסס על: ביטוח לאומיbtl.gov.il ( ) ¦ כל זכותkolzch… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | מעבר למדינה אחרת לאחר ארה"ב › פרק ג׳— קבלת קצבת זיקנה בארצות הברית | ….תיבדק זכאותו לקצבה בהתאם לכללים הנוגעים לאותה מדינה פרק ד׳— יציאה לחו"ל והשפעתה על תוספת השלמת הכנסה ▼ :מקור https://www.btl.gov.il/benefits/old_age/shehutBechul/Pages/emHashlamatHachnasa.as… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | ?מי חייב בכללים אלה › פרק ד׳— יציאה לחו"ל והשפעתה על תוספת השלמת הכנסה | …?מי חייב בכללים אלה ▼ מקבלי קצבת זיקנה ומקבלי קצבת שאירים שהגיעו לגיל פרישה וזכאים לתוספת השלמת הכנסה— ימשיכו לקבל את .התוספת כאשר הם יוצאים לחו"ל, בהתאם לתנאים המפורטים להלן חובת הודעה לביטו… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | �� מצב א׳— עד3 נסיעות וסה"כ עד72 יום › פרק ד׳— יציאה לחו"ל והשפעתה על תוספת השלמת הכנסה | …עות וסה"כ עד72 יום ▼ מי שיצא לחו"ל לא יותר מ- 3 פעמים וסה"כ שהה עד72 ימים — ימשיך לקבל את השלמת ההכנסה במהלך כל ימי .שהותו בחו"ל �� מצב ב׳— עד3 נסיעות, בין72 ל- 100 יום ▼ לא תשולם התוספת מה- 1… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | �� מצב ב׳— עד3 נסיעות, בין72 ל- 100 יום › פרק ד׳— יציאה לחו"ל והשפעתה על תוספת השלמת הכנסה | ion-body"> מי שיצא לחו"ל לא יותר מ- 3 פעמים וסה"כ שהה עד72 ימים — ימשיך לקבל את השלמת ההכנסה במהלך כל ימי .שהותו בחו"ל �� מצב ב׳— עד3 נסיעות, בין72 ל- 100 יום ▼ לא תשולם התוספת מה- 1… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | טבלת סיכום— תרחישים עיקריים › פרק ד׳— יציאה לחו"ל והשפעתה על תוספת השלמת הכנסה | …בת החזר כספים ששולמו טבלת סיכום— תרחישים עיקריים ▼ 'מס נסיעות ימי שהייה מצטברים ?מה קורה להשלמת הכנסה ▼ 1–3 עד72 ✅ משולמת בכל ימי השהות 1–3 73–100 � נפסקת מה- 1 בחודש שחצה72 יום; מחודש אחרי ה… |
| [85](../additional_guides/html/yetzia_lachul.html#L85) | בן זוג שנשאר בארץ › פרק ה׳— יציאה לחו"ל של מקבל קצבת אזרח ותיק מיוחדת | … עליו לפנות לסניף הביטוח הלאומי הקרוב .למקום מגוריו לבירור זכויותיו השוואה לקצבה רגילה עם השלמת הכנסה ▼ קצבת זיקנה רגילה עם השלמת ▼ הכנסה קצבת אזרח ותיק מיוחדת ▼ <div class="sub- |

#### `additional_guides/html/yipuy_koach_mitmashech.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/yipuy_koach_mitmashech.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |

#### `additional_guides/html/zchuyot_achrei_ishpuz.html` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../additional_guides/html/zchuyot_achrei_ishpuz.html#L76) | 📂 מסמכים | …ושבים חוזרים 👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים 🎓 דמי מחיה לשאירים בביטוח לאומי 💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה ✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה 📅 תקופת … |
| [85](../additional_guides/html/zchuyot_achrei_ishpuz.html#L85) | רמות מימון ורשימת ציוד › זכות 8: מכשירי שיקום וניידות | …ת • מכשירי ניידות (כיסאות גלגלים): השתתפות של 90% מהמחיר • מימון מלא: למקבלי קצבת זיקנה + השלמת הכנסה; קצבת שארים + השלמה; נכות מלאה; הכנסה נמוכה • ציוד זמין לפי צורך: כיסאות גלגלים ידניים וח… |

#### `index.html` (4)

| שורה | הקשר | קטע |
|---|---|---|
| [632](../index.html#L632) | כלי עזר | 💰 מחשבון הבטחת הכנסה (השלמת הכנסה) |
| [644](../index.html#L644) | כלי עזר | 💰 בדיקת זכאות להשלמת הכנסה |
| [646](../index.html#L646) | כלי עזר | 🚗 זכאות להשלמת הכנסה עם רכב מעל תקרת רכב |
| [647](../index.html#L647) | כלי עזר | 👶 כלי להגדרת ילד להשלמת הכנסה אזרח ותיק |

#### `new_immigrants/gimlat_zikna_meyuchedet.html` (16)

| שורה | הקשר | קטע |
|---|---|---|
| [589](../new_immigrants/gimlat_zikna_meyuchedet.html#L589) | הכנסות שאינן מעבודה › ⛔ חשוב | …י מי שהכנסותיו שלא מעבודה (שלו ושל בן/בת זוגו) אינן עולות על סכום קצבת אזרח ותיק עם תוספת השלמת ההכנסה שהוא זכאי לה לפי הרכב המשפחה וגיל. |
| [621](../new_immigrants/gimlat_zikna_meyuchedet.html#L621) | גובה הגמלה | תוספת השלמת הכנסה |
| [670](../new_immigrants/gimlat_zikna_meyuchedet.html#L670) | הגשת התביעה | השלמת הכנסה |
| [789](../new_immigrants/gimlat_zikna_meyuchedet.html#L789) | ב.3 — ענפי הביטוח הכלולים באמנות | השלמת הכנסה ❌ לא — אינו נכלל באמנות |
| [842](../new_immigrants/gimlat_zikna_meyuchedet.html#L842) | ℹ️ אישור חיים | ב.6 — השלמת הכנסה ואמנות |
| [843](../new_immigrants/gimlat_zikna_meyuchedet.html#L843) | ⚠️ חשוב מאוד | ⚠️ חשוב מאוד השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל — אינו זכאי להשלמת הכנסה, גם אם גר במדינת אמנה. השל… |
| [845](../new_immigrants/gimlat_zikna_meyuchedet.html#L845) | ⚠️ חשוב מאוד | חריג לשהות זמנית: מקבלי השלמת הכנסה רשאים לשהות בחו"ל עד 72 ימים בשנה קלנדרית ולא יותר מ-3 פעמים — ותוספת ההשלמה תמשיך להישלח… |
| [912](../new_immigrants/gimlat_zikna_meyuchedet.html#L912) | חלק ג׳ — השוואה: גמלה מיוחדת לעומת קצבה חלקית דרך אמנה | השלמת הכנסה |
| [1115](../new_immigrants/gimlat_zikna_meyuchedet.html#L1115) | 💡 מסקנה מעשית › הכנסות שאינן מעבודה | …י מי שהכנסותיו שלא מעבודה (שלו ושל בן/בת זוגו) אינן עולות על סכום קצבת אזרח ותיק עם תוספת השלמת ההכנסה שהוא זכאי לה לפי הרכב המשפחה וגיל. |
| [1136](../new_immigrants/gimlat_zikna_meyuchedet.html#L1136) | 💡 מסקנה מעשית › גובה הגמלה | תוספת השלמת הכנסה |
| [1185](../new_immigrants/gimlat_zikna_meyuchedet.html#L1185) | 💡 מסקנה מעשית › הגשת התביעה | השלמת הכנסה |
| [1301](../new_immigrants/gimlat_zikna_meyuchedet.html#L1301) | 💡 מסקנה מעשית › ב.3 — ענפי הביטוח הכלולים באמנות | השלמת הכנסה ❌ לא — אינו נכלל באמנות |
| [1352](../new_immigrants/gimlat_zikna_meyuchedet.html#L1352) | ℹ️ אישור חיים | ב.6 — השלמת הכנסה ואמנות |
| [1355](../new_immigrants/gimlat_zikna_meyuchedet.html#L1355) | ⚠️ חשוב מאוד | השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל — אינו זכאי להשלמת הכנסה, גם אם גר במדינת אמנה. השל… |
| [1357](../new_immigrants/gimlat_zikna_meyuchedet.html#L1357) | ⚠️ חשוב מאוד | חריג לשהות זמנית: מקבלי השלמת הכנסה רשאים לשהות בחו"ל עד 72 ימים בשנה קלנדרית ולא יותר מ-3 פעמים — ותוספת ההשלמה תמשיך להישלח… |
| [1418](../new_immigrants/gimlat_zikna_meyuchedet.html#L1418) | ב.8 — פטור מדמי ביטוח לאומי למי שמבוטח במדינת אמנה | השלמת הכנסה |

#### `new_immigrants/international_treaties.html` (13)

| שורה | הקשר | קטע |
|---|---|---|
| [627](../new_immigrants/international_treaties.html#L627) | ענפי הביטוח הכלולים באמנות | השלמת הכנסה ❌ לא — אינו נכלל באמנות |
| [701](../new_immigrants/international_treaties.html#L701) | ℹ️ אישור חיים שנתי › שהייה בחו"ל וקצבאות | השלמת הכנסה ואמנות |
| [702](../new_immigrants/international_treaties.html#L702) | השלמת הכנסה ואמנות › שהייה בחו"ל וקצבאות | ⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות מי שגר מחוץ לישראל — לא זכאי להשלמת הכנסה , גם אם גר במדינת אמנה. השלמת… |
| [704](../new_immigrants/international_treaties.html#L704) | ⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות › שהייה בחו"ל וקצבאות | חריג לשהות זמנית: מקבלי השלמת הכנסה רשאים לשהות בחו"ל עד 72 ימים בשנה קלנדרית ולא יותר מ- 3 פעמים — ותוספת ההשלמה תמשיך להישל… |
| [783](../new_immigrants/international_treaties.html#L783) | השוואה וטיפים | השלמת הכנסה |
| [808](../new_immigrants/international_treaties.html#L808) | שאלות הבהרה › ⚠️ טעות נפוצה | …חר "לא מגיע לו כלום". בפועל — ייתכן שהוא זכאי ל גמלה מיוחדת + קצבה חלקית מהמדינה הקודמת + השלמת הכנסה + תוספת עבור בן/בת זוג . חובה לבדוק! |
| [964](../new_immigrants/international_treaties.html#L964) | שאלות הבהרה › עיקרון 3 — המשך תשלום קצבאות בין המדינות | השלמת הכנסה ❌ לא — אינו נכלל באמנות |
| [1035](../new_immigrants/international_treaties.html#L1035) | שאלות הבהרה › ℹ️ אישור חיים שנתי | השלמת הכנסה ואמנות |
| [1037](../new_immigrants/international_treaties.html#L1037) | שאלות הבהרה › השלמת הכנסה ואמנות | ⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות |
| [1038](../new_immigrants/international_treaties.html#L1038) | שאלות הבהרה › ⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות | מי שגר מחוץ לישראל — לא זכאי להשלמת הכנסה , גם אם גר במדינת אמנה. השלמת הכנסה ניתנת רק לתושבי ישראל. |
| [1040](../new_immigrants/international_treaties.html#L1040) | שאלות הבהרה › ⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות | חריג לשהות זמנית: מקבלי השלמת הכנסה רשאים לשהות בחו"ל עד ${suppDays} ימים בשנה קלנדרית ולא יותר מ- ${suppTrips} פעמים — ותוספ… |
| [1106](../new_immigrants/international_treaties.html#L1106) | שאלות הבהרה › ℹ️ זמן טיפול בתביעה | השלמת הכנסה |
| [1134](../new_immigrants/international_treaties.html#L1134) | שאלות הבהרה › ⚠️ טעות נפוצה | …חר "לא מגיע לו כלום". בפועל — ייתכן שהוא זכאי ל גמלה מיוחדת + קצבה חלקית מהמדינה הקודמת + השלמת הכנסה + תוספת עבור בן/בת זוג . חובה לבדוק! |

#### `senior_rights/counseling_referral_form.html` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [1062](../senior_rights/counseling_referral_form.html#L1062) |  | מקבל השלמת הכנסה |
| [1179](../senior_rights/counseling_referral_form.html#L1179) |  | השלמת הכנסה |

#### `senior_rights/faq.html` (93)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../senior_rights/faq.html#L6) |  | (בתוך תג/מאפיין) …"שאלות ותשובות נפוצות בזכויות אזרחים ותיקים בביטוח הלאומי: קצבת זקנה, קצבת שאירים, סיעוד, השלמת הכנסה ותהליכים וערעורים."> |
| [475](../senior_rights/faq.html#L475) | ❓ שאלות נפוצות בזכויות אזרחים ותיקים | תשובות מהירות על השאלות הנפוצות בקצבת זקנה, שאירים, סיעוד, השלמת הכנסה ותהליכים מול הביטוח הלאומי |
| [489](../senior_rights/faq.html#L489) | מהי קצבת אזרח ותיק ומה מטרתה? › סכום הקצבה (2026): | …לפי שנות ביטוח (תוספת ותק) קצבה זו מהווה הכנסה בסיסית לגמלאים בישראל, ורבים מהם זכאים גם להשלמת הכנסה כדי להבטיח מינימום חיים. |
| [544](../senior_rights/faq.html#L544) | מהי גמלת אזרח ותיק מיוחדת ומתי היא ניתנת? › חשוב לציין | …הגמלה המיוחדת אינה כוללת תוספת ותק או תוספת דחיית קצבה (כי אין היסטוריית ביטוח), אך כוללת השלמת הכנסה, תוספות לבן/בת זוג וילדים. |
| [600](../senior_rights/faq.html#L600) | אילו מסמכים צריך לצרף לתביעה לקצבת אזרח ותיק? › מועד ההגשה | … תעודת זהות, אישורים על תשלומי דמי ביטוח לאומי לאורך השנים, ותלושי שכר רלוונטיים. מסמכים להשלמת הכנסה תוספת השלמת הכנסה ניתנת למי שאין להם הכנסות נוספות מלבד הקצבה, או שהכנסתם נמוכה מסכום מסו… |
| [604](../senior_rights/faq.html#L604) | אילו מסמכים צריך לצרף לתביעה לקצבת אזרח ותיק? › מסמכים להשלמת הכנסה | ניתן להגיש את תביעת השלמת ההכנסה יחד עם תביעת קצבת אזרח ותיק, או בכל שלב מאוחר יותר כשההכנסה יורדת מתחת לסף הזכאות. גם כאן… |
| [751](../senior_rights/faq.html#L751) | עולה חדש בן 68, בריא ויחיד - מה הזכויות שלו לקצבת אזרח ותיק? › 1. גמלת אזרח ותיק מיוחדת | …ד גיל 70, ו-30,339 ₪ מגיל 70 ואילך (פי 3). הכנסה שאינה מעבודה נבחנת מול סכום הקצבה בתוספת השלמת הכנסה שהיה זכאי להם. |
| [753](../senior_rights/faq.html#L753) | עולה חדש בן 68, בריא ויחיד - מה הזכויות שלו לקצבת אזרח ותיק? › 1. גמלת אזרח ותיק מיוחדת | עם אפשרות לתוספת השלמת הכנסה, הנבחנת לפי תנאי הזכאות הרגילים של השלמת הכנסה |
| [792](../senior_rights/faq.html#L792) | מה ההבדל בין קצבת שאירים לקצבת זקנה? › מבחן הכנסות | …וי) וגם מנכסים קצבת שאירים : אלמנה אינה כפופה למבחן הכנסה על הקצבה עצמה (אך עשויה להיבדק להשלמת הכנסה); אלמן כפוף למבחן הכנסות אם אין לו ילדים תלות במצב בריאותי קצבת זקנה : לא תלויה בבדיקות ר… |
| [858](../senior_rights/faq.html#L858) | איך מחושב סכום קצבת השאירים? › הגורמים המרכזיים בחישוב: | …ית: 1,838 ₪ תוספת ותק (40%): 735 ₪ סה"כ: 2,573 ₪ 3. תוספות נוספות (בתנאים מסוימים): תוספת השלמת הכנסה (אם הכנסות נמוכות) מענק חימום שנתי (במקרים מסוימים) הסכומים מעודכנים לשנת 2026 עם הצמדה ל… |
| [1184](../senior_rights/faq.html#L1184) | אילו קצבאות קשורות לאזרחים ותיקים מעבר לקצבת הזקנה? › קצבאות ותוספות | …צבת הזקנה? קצבאות וגמלות נוספות לאזרחים ותיקים מעבר לקצבת הזקנה (קצבת אזרח ותיק): 1. גמלת השלמת הכנסה מטרתה: להבטיח הכנסה מינימלית לקיום בכבוד למי שקצבת הזקנה והכנסותיו אינן מספיקות. 2. גמלת … |
| [1202](../senior_rights/faq.html#L1202) | מהן קצבאות נגזרות מהזכאות לקשיש? › קצבאות ותוספות | מהן קצבאות נגזרות מהזכאות לקשיש? 1. גמלת השלמת הכנסה משולמת למקבלי קצבת אזרח ותיק שהכנסותיהם (מעבודה, פנסיה, נכסים) אינן מספיקות לרמת מחיה מינ… |
| [1224](../senior_rights/faq.html#L1224) | האם יש תוספת עבור בן/בת זוג שאינם עובדים? › התנאים להכרה כ"בן/בת זוג תלוי": | האם יש השלמת הכנסה לאזרחים ותיקים? כן, קיימת השלמת הכנסה לאזרחים ותיקים . זוהי גמלה נוספת המשולמת לתושבי ישר… |
| [1234](../senior_rights/faq.html#L1234) | האם יש השלמת הכנסה לאזרחים ותיקים? › התנאים להכרה כ"בן/בת זוג תלוי": | מי זכאי לתוספת השלמת הכנסה? זכאות בסיסית לתוספת (השלמה): מקבלי קצבת זיקנה (אזרח ותיק) שהכנסתם נמוכה מהסכום הקובע מקב… |
| [1243](../senior_rights/faq.html#L1243) | מי זכאי לתוספת השלמת הכנסה? › התנאים להכרה כ"בן/בת זוג תלוי": | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? כן, יש הבדל משמעותי בין השניים: קצבת זקנה בסיסית לעומת קצבה עם השלמת הכנסה קצבת זקנה בסי… |
| [1244](../senior_rights/faq.html#L1244) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | סכום מינימלי מובטח : השלמת הכנסה מבטיחה סכום כולל גבוה יותר, בהתאם למצב משפחתי וגיל. לדוגמה: |
| [1247](../senior_rights/faq.html#L1247) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | מבחן הכנסה : קצבה בסיסית כפופה למבחן הכנסות משלה כדי לקבוע קצבה חלקית או מלאה. השלמת הכנסה יש לה מבחן הכנסות משלה, שונה ונוסף. |
| [1248](../senior_rights/faq.html#L1248) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | הטבות נלוות : קבלת השלמת הכנסה מעניקה אוטומטית הטבות כגון הנחה בחשמל, ארנונה, מים וברכישת תרופות. |
| [1249](../senior_rights/faq.html#L1249) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | מבחן נכסים : קבלת השלמת הכנסה כוללת גם בדיקה של נכסים ובעלות על רכב, שעלולה להשפיע על הזכאות. |
| [1250](../senior_rights/faq.html#L1250) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | בקיצור, קצבה בסיסית היא בסיס, והשלמת הכנסה היא תוספת לאלה שהכנסתם נמוכה מדי. |
| [1259](../senior_rights/faq.html#L1259) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? › ההבדלים העיקריים: | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? כן, קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד. אלמן/ה שהכנסתם נ… |
| [1266](../senior_rights/faq.html#L1266) | האם גמלת סיעוד משפיעה על קצבת זקנה? › ההבדלים העיקריים: | …בדקת לפי קריטריונים משלה. חשוב לדעת : גמלת סיעוד כן משפיעה על הכנסות לצורך מבחן הכנסות של השלמת הכנסה (התוספת המבטיחה הכנסה מינימלית), אך לא על קצבת הזקנה עצמה. |
| [1273](../senior_rights/faq.html#L1273) | האם הכנסות מהשכרת דירה משפיעות על קצבת זקנה? › ההבדלים העיקריים: | …קצבת זקנה . שכר דירה נחשב "הכנסה מנכסים" , ונבדק לצורך קביעת גובה קצבת זקנה חלקית וזכאות להשלמת הכנסה — לפי אותן תקרות המפורטות בשאלה "מה קורה אם יש הכנסות מעבודה או מקצבאות אחרות" בקובץ קצבת… |
| [1279](../senior_rights/faq.html#L1279) | האם פנסיה מהעבודה משפיעה על הזכאות לקצבת זיקנה? › ההבדלים העיקריים: | …בת זיקנה? התשובה הקצרה: לא. פנסיה לא משפיעה על הזכאות לקצבת זיקנה. פנסיה כן נחשבת בזכאות להשלמת הכנסה. פנסיה מקרן פנסיה, ביטוח מנהלים או קרן השתלמות — אינה נחשבת הכנסה למטרת מבחן הכנסות בקצבת… |
| [1307](../senior_rights/faq.html#L1307) | האם קצבאות מחו"ל משפיעות על הזכאות? › חשוב: | השלמת הכנסה — קצבה מחו"ל נבדקת כחלק מההכנסה הנבחנת, וגם כאן עשויה להוביל לצמצום ההשלמה. |
| [1378](../senior_rights/faq.html#L1378) | איפה מוצאים את כל הזכויות של אזרחים ותיקים? › מדריכים מרכזיים: | קצבת אזרח ותיק (זקנה) השלמת הכנסה גמלת סיעוד גמלת נכות כללית וקצבת שירותים מיוחדים קצבת שאירים ומענק פטירה זכויות ניצולי שו… |
| [1381](../senior_rights/faq.html#L1381) | איפה מוצאים את כל הזכויות של אזרחים ותיקים? › מדריכים מרכזיים: | מדריך לגמלת סיעוד מדריך לקצבת שאירים מדריך להשלמת הכנסה מדריך לזכויות ניצולי שואה |
| [1397](../senior_rights/faq.html#L1397) | איך בודקים אם יש חובה להגיש תביעה או שזה מתבצע אוטומטית? › תביעות שיש חובה להגישן באופן יזום (לא אוטומטיות) | השלמת הכנסה |
| [1398](../senior_rights/faq.html#L1398) | איך בודקים אם יש חובה להגיש תביעה או שזה מתבצע אוטומטית? › תביעות שיש חובה להגישן באופן יזום (לא אוטומטיות) | יש להגיש בקשה נפרדת להשלמת הכנסה — היא אינה משולמת באופן אוטומטי, אלא רק לאחר הגשת בקשה. |
| [1446](../senior_rights/faq.html#L1446) | איך מגישים השגה או ערעור על החלטה? › חובת דיווח על שינויים (30 יום) | ערעור על זכאות או סכום קצבה (למשל קצבת זקנה, שאירים, השלמת הכנסה) — ניתן לערער ישירות לבית הדין האזורי לעבודה , בתוך 12 חודשים מיום קבלת ההחלטה. |
| [1486](../senior_rights/faq.html#L1486) | האם יש חובת התייצבות או בדיקה רפואית לקצבת זקנה? › חובת התייצבות בשירות התעסוקה | …רות התעסוקה חובת התייצבות קיימת , אך היא רלוונטית למקרה מסוים בלבד: כשמבקש/ת קצבת זקנה עם השלמת הכנסה , אם בן/בת הזוג טרם הגיע/ה לגיל פרישה (בעוד המבוטח עצמו כבר הגיע), הוא/היא חייב/ת להתייצב… |
| [1500](../senior_rights/faq.html#L1500) | האם יש התייצבות או בדיקה תפקודית לסיעוד? › בדיקה רפואית | זה שונה מהשלמת הכנסה בקצבת זקנה , שם קיימת חובת התייצבות בשירות התעסוקה עבור בן/בת זוג צעיר/ה שטרם הגיע/ה לגיל… |
| [1505](../senior_rights/faq.html#L1505) | האם אפשר לבדוק זכאות לפני הגשת התביעה? › בדיקה רפואית | …זכאות, לפני הגשת תביעה רשמית: מחשבון אזרח ותיק - בדיקה ראשונית של זכאות לקצבת זקנה מחשבון השלמת הכנסה - הערכת זכאות להשלמת הכנסה מחשבונים נוספים לקצבאות שונות חשוב לדעת: הזכאות הסופית והסכום … |
| [1512](../senior_rights/faq.html#L1512) | מה קורה אם הזכאות נפסקת או משתנה? › 1. קצבת אזרח ותיק (זקנה) | …וי בהכנסות (מעבודה, פנסיה, נכסים) — הקצבה עלולה להיות חלקית או להיפסק יציאה לחו"ל — תוספת השלמת הכנסה נפסקת לפי כללים מחמירים שינוי במצב משפחתי (נישואין, גירושין, פטירת בן זוג) — משנה את הסכו… |
| [1512](../senior_rights/faq.html#L1512) | מה קורה אם הזכאות נפסקת או משתנה? › 1. קצבת אזרח ותיק (זקנה) | …וי בהכנסות (מעבודה, פנסיה, נכסים) — הקצבה עלולה להיות חלקית או להיפסק יציאה לחו"ל — תוספת השלמת הכנסה נפסקת לפי כללים מחמירים שינוי במצב משפחתי (נישואין, גירושין, פטירת בן זוג) — משנה את הסכו… |
| [1558](../senior_rights/faq.html#L1558) | האם מעבר לחו"ל מבטל את כל הזכויות? › קצבת זקנה (אזרח ותיק) | …שבת ישראל בחמש השנים שקדמו ליציאה ישבת בישראל לפחות 25 שנה או סיימת 144 חודשי ביטוח תוספת השלמת הכנסה תוספת זו מופסקת בהתאם לימי השהייה בחו"ל : עד 72 יום בשלוש נסיעות ראשונות - משולמת בכל הימ… |
| [1571](../senior_rights/faq.html#L1571) | האם תושבות בישראל היא תנאי הכרחי לכל הקצבאות? › קצבאות שבהן תושבות היא תנאי הכרחי: | …י לכל הקצבאות , אך היא תנאי חשוב בקצבאות מסוימות: קצבאות שבהן תושבות היא תנאי הכרחי: גמלת השלמת הכנסה - דורשת תושבות ישראל ב-24 החודשים האחרונים גמלת סיעוד - דורשת אזרח ישראל ותושב ישראל קצבא… |
| [1614](../senior_rights/faq.html#L1614) | מהן השאלות החשובות לפני הגשת תביעה ראשונה? › 2. סוג הקצבה המתאים | … (זקנה) קצבת שאירים (אם אתה אלמן/ה) גמלת סיעוד (אם אתה זקוק לעזרה בפעולות יומיומיות) גמלת השלמת הכנסה (אם הכנסותיך נמוכות) 3. מבחן הכנסות הכנסתך מעבודה : האם עולה על ₪10,113 ליחיד או ₪13,484 … |
| [1614](../senior_rights/faq.html#L1614) | מהן השאלות החשובות לפני הגשת תביעה ראשונה? › 3. מבחן הכנסות | … (זקנה) קצבת שאירים (אם אתה אלמן/ה) גמלת סיעוד (אם אתה זקוק לעזרה בפעולות יומיומיות) גמלת השלמת הכנסה (אם הכנסותיך נמוכות) 3. מבחן הכנסות הכנסתך מעבודה : האם עולה על ₪10,113 ליחיד או ₪13,484 … |
| [1685](../senior_rights/faq.html#L1685) | איפה מרוכז המידע הרשמי המעודכן ביותר על כל הזכויות האלה? › סיכום מעשי | אתר הביטוח הלאומי : www.btl.gov.il — כולל את כל הזכויות: קצבת זקנה, השלמת הכנסה, סיעוד, נכות, שאירים, ניצולי שואה, והטבות נוספות, עם מחשבונים ודוגמאות חישוב |
| [1804](../senior_rights/faq.html#L1804) | סכומי תקרה, יציאה לעבודה וקיזוזי קצבה ("חוק לרארון") | השלמת הכנסה |
| [1810](../senior_rights/faq.html#L1810) | השלמת הכנסה | מהי השלמת הכנסה לקצבת זקנה? השלמת הכנסה לקצבת זקנה היא תוספת כספית שנועדה להבטיח רמת הכנסה מינימלית לקיום… |
| [1822](../senior_rights/faq.html#L1822) | מהי השלמת הכנסה לקצבת זקנה? › הטבות נוספות | מי זכאי להשלמת הכנסה בנוסף לקצבת זקנה? תנאים בסיסיים קצבת זקנה בזכות עצמו/ה - עם זכאות מלאה או חלקית בגיל פריש… |
| [1834](../senior_rights/faq.html#L1834) | מי זכאי להשלמת הכנסה בנוסף לקצבת זקנה? › תקרות הכנסה לזכאות להשלמה (נכון ל-01/2026) | האם אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה? כן, אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה - זה חלק ממערכת … |
| [1844](../senior_rights/faq.html#L1844) | האם אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה? › איך זה עובד בפרקטיקה: | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? קצבת זקנה (אזרח ותיק) בלבד: זהו סכום הקצבה הבסיסי שמקבל אזרח ותיק בגיל הפרישה. לשנת 2026… |
| [1852](../senior_rights/faq.html#L1852) | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? › איך זה עובד בפרקטיקה: | אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה? הכנסות שנחשבות: שכר עבודה (ברוטו) , משכורת, הכנסה מעסק עצמאי שכר דירה (לפני ניכוי הוצאות… |
| [1861](../senior_rights/faq.html#L1861) | אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | האם הכנסה מעבודה שוללת השלמת הכנסה? לא, הכנסה מעבודה לא שוללת השלמת הכנסה , אך היא משפיעה על גובה ההשלמה. כללי בסיסיים: הכנס… |
| [1869](../senior_rights/faq.html#L1869) | האם הכנסה מעבודה שוללת השלמת הכנסה? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? כן — פנסיה חודשית (מקרן פנסיה, ביטוח מנהלים או קרן השתלמות) נחשבת הכנסה לצורך השלמת הכנס… |
| [1871](../senior_rights/faq.html#L1871) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | מבחן ההכנסות להשלמת הכנסה (התוספת): פנסיה כן נחשבת הכנסה , אך עם פטור חלקי לשנת 2026: 1,790 ₪ לחודש ליחיד , 2,823 ₪… |
| [1872](../senior_rights/faq.html#L1872) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | …ד עם פנסיה של 2,500 ₪ לחודש — הסכום שמעל הפטור (2,500 - 1,790 = 710 ₪) יקוזז במלואו מסכום השלמת ההכנסה שהיה מגיע לו אחרת. מקור: תוספת השלמת הכנסה לקצבת זיקנה — כל-זכות. |
| [1879](../senior_rights/faq.html#L1879) | האם הכנסה משכר דירה נחשבת בחישוב? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | האם הכנסה משכר דירה נחשבת בחישוב? כן, הכנסה משכר דירה נחשבת בחישוב של השלמת הכנסה לקצבת אזרח ותיק (זקנה). שכר דירה נחשב הכנסה מנכסים ונכנס לבדיקת זכאות להשלמת הכנסה — זהו … |
| [1886](../senior_rights/faq.html#L1886) | האם חסכונות או פיקדונות משפיעים על הזכאות? › הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | האם חסכונות או פיקדונות משפיעים על הזכאות? כן, חסכונות ופיקדונות משפיעים על הזכאות להשלמת הכנסה, אך לא ישירות על קצבת זקנה עצמה. ההבחנה המרכזית: קצבת זקנה בסיסית : חל עליה מבחן הכנסות מ… |
| [1899](../senior_rights/faq.html#L1899) | האם חסכונות או פיקדונות משפיעים על הזכאות? › איך זה עובד: | האם קצבה מחו"ל משפיעה על השלמת הכנסה? התשובה תלויה בסוג הקצבה מחו"ל, ויש להבחין בין שני מצבים: קצבת ביטוח לאומי / סוציאל ביטחו… |
| [1908](../senior_rights/faq.html#L1908) | האם קצבה מחו"ל משפיעה על השלמת הכנסה? › פנסיה תעסוקתית מחו"ל (מעבודה או מקרן פנסיה זרה) | האם בן/בת זוג משפיעים על הזכאות להשלמת הכנסה? כן, בן/בת זוג משפיעים משמעותית על הזכאות להשלמת הכנסה . הגדרת בן/בת זוג בן/בת זוג מוכר/ת… |
| [1919](../senior_rights/faq.html#L1919) | האם בן/בת זוג משפיעים על הזכאות להשלמת הכנסה? › מבחן הכנסות | איך מחשבים את סכום השלמת ההכנסה? הנוסחה הבסיסית השלמת הכנסה = הסכום המירבי הקובע פחות ההכנסה בפועל השלבים בחישוב: בדוק זכ… |
| [1927](../senior_rights/faq.html#L1927) | איך מחשבים את סכום השלמת ההכנסה? › דוגמה: | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? כן, יש תקרת הכנסה לזכאות להשלמת הכנסה. תקרת הגמלה נקבעת לפי גיל ומצב משפחתי — זהו "הסכום… |
| [1936](../senior_rights/faq.html#L1936) | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? › דוגמה: | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? השלמת הכנסה אינה ניתנת אוטומטית . על האדם להגיש בקשה … |
| [1942](../senior_rights/faq.html#L1942) | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? › דוגמה: | אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה? לבקשה להשלמת הכנסה (טופס 430) יש לצרף בדרך כלל: |
| [1954](../senior_rights/faq.html#L1954) | אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה? › דוגמה: | איך מגישים בקשה להשלמת הכנסה? דרכי הגשת בקשה להשלמת הכנסה |
| [1967](../senior_rights/faq.html#L1967) | איך מגישים בקשה להשלמת הכנסה? › דרכי הגשת בקשה להשלמת הכנסה | חשוב להדגיש: אתם חייבים לקבל תחילה קצבת אזרח ותיק (בקצבה מלאה או חלקית) כדי להיות זכאים להשלמת הכנסה הגישו בזמן — הגשה מאוחרת מדי עלולה לגרום לאובדן קצבאות רטרואקטיביות כדאי להשתמש במחשבון ה… |
| [1973](../senior_rights/faq.html#L1973) | האם אפשר להגיש את הבקשה באופן מקוון? › דרכי הגשת בקשה להשלמת הכנסה | האם אפשר להגיש את הבקשה באופן מקוון? כן — כפי שמפורט בשאלה "איך מגישים בקשה להשלמת הכנסה", ניתן להגיש את הבקשה (טופס 430) באופן מקוון דרך האזור האישי באתר הביטוח הלאומי ( ps.btl.… |
| [1976](../senior_rights/faq.html#L1976) | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? › דרכי הגשת בקשה להשלמת הכנסה | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? הזכאות לתשלום השלמת הכנסה מתחילה בדרך כלל מחודש הגשת התביעה (ולא רטרואקטיבית לתקופה שקדמה להגשה, מלבד המקרים המפורט… |
| [1981](../senior_rights/faq.html#L1981) | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? › דרכי הגשת בקשה להשלמת הכנסה | האם השלמת הכנסה משולמת רטרואקטיבית? כן, השלמת הכנסה יכולה להיות משולמת רטרואקטיבית , אך בתנאים מסוימים: ת… |
| [1989](../senior_rights/faq.html#L1989) | מה קורה אם ההכנסה משתנה אחרי שכבר אושרה השלמה? › מה קורה אם לא דיווחו בזמן | …הכנסה עלתה ולא דיווחתם, אתם עלולים להיות חייבים להחזיר כספים שקיבלתם ביתר. דוגמה: אם קצבת השלמת הכנסה אושרה על בסיס הכנסה של ₪2,000/חודש, והכנסתך עלתה ל-₪3,500/חודש, יש לדווח על כך תוך 30 יום… |
| [2016](../senior_rights/faq.html#L2016) | האם יש חובת דיווח על שינוי במצב משפחתי? › על מה אין צורך לדווח | האם מעבר דירה משפיע על השלמת הכנסה? מעבר דירה כשלעצמו (שינוי כתובת מגורים בישראל) אינו משפיע ישירות על זכאות או סכום השלמת ה… |
| [2020](../senior_rights/faq.html#L2020) | האם קבלת ירושה משפיעה על הזכאות? › על מה אין צורך לדווח | האם קבלת ירושה משפיעה על הזכאות? ירושה עצמה אינה מופיעה כהכנסה בחישוב זכאות להשלמת הכנסה (ראו הרשימה בשאלה "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה"). עם זאת, אם הירושה כוללת… |
| [2025](../senior_rights/faq.html#L2025) | האם מתנות או סיוע מקרובי משפחה משפיעים על ההשלמה? › על מה אין צורך לדווח | … משפיעים על ההשלמה? מתנות וסיוע כספי מקרובי משפחה אינם נחשבים הכנסה לצורך מבחן ההכנסות של השלמת הכנסה או קצבת זקנה (ראו הרשימה בשאלה "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה"). עם זאת, אם… |
| [2029](../senior_rights/faq.html#L2029) | האם מתנות או סיוע מקרובי משפחה משפיעים על ההשלמה? › על מה אין צורך לדווח | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? כן, אפשר לקבל השלמת הכנסה וגם גמלת סיעוד בו-זמנית. שתי הגמלאות הן בעלות ת… |
| [2038](../senior_rights/faq.html#L2038) | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? › על מה אין צורך לדווח | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות נלוות: חש… |
| [2043](../senior_rights/faq.html#L2043) | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? › על מה אין צורך לדווח | האם יש הבדל בין השלמת הכנסה ליחיד לבין זוג? כן, יש הבדל משמעותי בין השלמת הכנסה ליחיד לבין זוג . תקרות השלמת הכנסה (ה… |
| [2053](../senior_rights/faq.html#L2053) | מה קורה אם אחד מבני הזוג נפטר? › חשוב: מעבר אפשרי לקצבת שאירים | …בת הזוג הנותר/ת עלול/ה להיות זכאי/ת גם לקצבת שאירים (כאלמן/ה), בתנאים מסוימים. במקרה כזה, השלמת הכנסה נבדקת לגבי קצבת השאירים בנפרד, בתקרות שונות מאלה של קצבת זיקנה. סיכום : יש להודיע מיידית … |
| [2063](../senior_rights/faq.html#L2063) | מה קורה אם אחד מבני הזוג נפטר? › חשוב: מעבר אפשרי לקצבת שאירים | האם אלמן או אלמנה יכולים לקבל השלמת הכנסה בתנאים מיוחדים? 1. אלמן/אלמנה המקבלים קצבת זיקנה (אזרח ותיק) כן, הם יכולים להיות זכאים לה… |
| [2072](../senior_rights/faq.html#L2072) | האם אלמן או אלמנה יכולים לקבל השלמת הכנסה בתנאים מיוחדים? › 2. אלמן/אלמנה המקבלים קצבת שאירים | האם השלמת הכנסה ניתנת גם למי שגר בדיור מוגן? השלמת הכנסה ניתנת לתושבי ישראל המתגוררים בישראל בפועל, ללא ה… |
| [2077](../senior_rights/faq.html#L2077) | האם השלמת הכנסה ניתנת גם למי שגר בדיור מוגן? › 2. אלמן/אלמנה המקבלים קצבת שאירים | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? סיוע כספי מרצון מבני משפחה אינו נחשב הכנסה ואינו שול… |
| [2082](../senior_rights/faq.html#L2082) | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? › 2. אלמן/אלמנה המקבלים קצבת שאירים | האם אפשר לערער על החלטה שלא לאשר השלמת הכנסה? כן, אפשר לערער על החלטה שלא אושרה השלמת הכנסה. שלבי ערעור על החלטת הביטוח הלאומי שלב א׳ … |
| [2093](../senior_rights/faq.html#L2093) | איך בודקים את סכום הזכאות המדויק באתר? › 4. נתונים שנבדקים: | … שווי רכב (אם יש לך, בכפוף לתקרת שווי הרכב הנפרדת — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה") כלים באתר האתר מציע מחשבון זכאות להשלמת הכנסה שיעזור לך לחשב את סכום הזכאות המשוער. יש … |
| [2108](../senior_rights/faq.html#L2108) | האם יש מדרגות הכנסה שונות לפי גיל? › כלים באתר | האם יש מדרגות הכנסה שונות לפי גיל? כן, בהשלמת הכנסה יש מדרגות שונות לפי גיל. תקרות הגמלה משתנות ב-3 מדרגות גיל: עד גיל 70: יחיד/ה: 4,375 ₪ זו… |
| [2118](../senior_rights/faq.html#L2118) | האם יש מדרגות הכנסה שונות לפי גיל? › כלים באתר | האם קצבת שאירים נחשבת כהכנסה לעניין השלמת הכנסה? לא, קצבת שאירים אינה נחשבת הכנסה לעניין בדיקת זכאות להשלמת הכנסה בקצבת זקנה — ראו הרשימה… |
| [2121](../senior_rights/faq.html#L2121) | האם קצבת נכות או קצבאות אחרות נחשבות כהכנסה? › כלים באתר | …צבת נכות וקצבאות אחרות של הביטוח הלאומי (סיעוד וכו') אינן נחשבות הכנסה לצורך בדיקת זכאות להשלמת הכנסה, בדיוק כמו קצבת שאירים ופנסיה ממקורות פנסיוניים — ראו הרשימה המלאה בשאלה "אילו הכנסות נבד… |
| [2124](../senior_rights/faq.html#L2124) | האם ריבית מחשבון בנק נחשבת בחישוב? › כלים באתר | האם ריבית מחשבון בנק נחשבת בחישוב? כן, ריבית מחשבון בנק נחשבת בחישוב השלמת הכנסה , כחלק מהחישוב הכולל של "הכנסה רעיונית" מנכסים פיננסיים — ראו הנוסחה המלאה בשאלה "האם חסכ… |
| [2127](../senior_rights/faq.html#L2127) | מה קורה אם יש יותר מחשבון בנק אחד? › כלים באתר | מה קורה אם יש יותר מחשבון בנק אחד? בהשלמת הכנסה, יש לדווח על כל חשבונות הבנק, הפיקדונות והחסכונות שברשותך — לא רק על אחד. כל הנכסים הפיננ… |
| [2132](../senior_rights/faq.html#L2132) | מה קורה אם יש יותר מחשבון בנק אחד? › כלים באתר | האם ניתן לקבל סיוע ממוקד בהגשת בקשה להשלמת הכנסה? כן. מעבר למחשבון הזכאות באתר הביטוח הלאומי, ניתן לקבל סיוע אישי במספר דרכים: |
| [2140](../senior_rights/faq.html#L2140) | האם ניתן לקבל סיוע ממוקד בהגשת בקשה להשלמת הכנסה? › כלים באתר | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? תנאי זכאות בסיסיים להשלמת הכנסה כדי להיות זכאי לתוספת זו, על המבקש לעמו… |
| [2154](../senior_rights/faq.html#L2154) | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? › המלצה | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? לא, לא נדרשים מסמכים רפואיים כדי להגיש בקשה להשלמת הכנסה. בדיקת הזכאות להשלמת הכנסה מבוס… |
| [2160](../senior_rights/faq.html#L2160) | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? › המלצה | האם יש בדיקה בבית לצורך השלמת הכנסה? אין בדיקה בבית לצורך השלמת הכנסה — בשונה מגמלת סיעוד, שם נערך ביקור בית להערכה תפקודית (… |
| [2166](../senior_rights/faq.html#L2166) | האם יש בדיקה בבית לצורך השלמת הכנסה? › המלצה | האם יש הבחנה בין תביעה חדשה לבין עדכון זכאות להשלמת הכנסה? תביעה חדשה תביעה חדשה להשלמת הכנסה מוגשת כאשר המבוטח: לא היה זכאי בעבר להשלמת הכנסה, או … |
| [2175](../senior_rights/faq.html#L2175) | האם אפשר לקבל תשלום זמני עד בדיקת הזכאות? › ההבדל המעשי | …אם אפשר לקבל תשלום זמני עד בדיקת הזכאות? כן — הביטוח הלאומי עשוי לאשר תשלום זמני על חשבון השלמת הכנסה (הבטחת הכנסה) , כאשר בדיקת הזכאות המלאה מתעכבת בשל חוסר במסמכים או צורך בבירור מעמיק, וזא… |
| [2181](../senior_rights/faq.html#L2181) | האם אפשר לקבל תשלום זמני עד בדיקת הזכאות? › ההבדל המעשי | מה עושים אם הבקשה להשלמת הכנסה נדחתה? |
| [2183](../senior_rights/faq.html#L2183) | מה עושים אם הבקשה להשלמת הכנסה נדחתה? › ההבדל המעשי | הגש ערעור — ראו התהליך המלא בשאלה "האם אפשר לערער על החלטה שלא לאשר השלמת הכנסה" (ועדת עררים פנימית תוך 30 יום, ולאחר מכן בית דין לעבודה תוך 12 חודשים) |
| [2189](../senior_rights/faq.html#L2189) | האם אפשר להגיש בקשה חוזרת לאחר דחייה? › ההבדל המעשי | האם אפשר להגיש בקשה חוזרת לאחר דחייה? כן. ניתן להגיש בקשה חדשה להשלמת הכנסה בכל עת שבה חל שינוי רלוונטי בנסיבות — למשל ירידה בהכנסה, שינוי במצב המשפחתי, או השלמת מסמ… |
| [2192](../senior_rights/faq.html#L2192) | האם אפשר להגיש בקשה חוזרת לאחר דחייה? › ההבדל המעשי | מהו המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי? המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי… |
| [2197](../senior_rights/faq.html#L2197) | האם יש שינוי בזכאות כשמגיעים לגיל זכאות לקצבת אזרח ותיק ללא תנאי הכנסה › ההבדל המעשי | …י בזכאות כשמגיעים לגיל זכאות לקצבת אזרח ותיק ללא תנאי הכנסה? כן, יש שינוי משמעותי בזכאות להשלמת הכנסה כשמגיעים לגיל 70. בגיל 70 ומעלה — קצבת אזרח ותיק משולמת ללא כל מבחן הכנסות , גם למי שעובד… |
| [2204](../senior_rights/faq.html#L2204) | האם יש שינוי בזכאות כשמגיעים לגיל זכאות לקצבת אזרח ותיק ללא תנאי הכנסה › ההבדל המעשי | איפה מוצאים את המידע הרשמי המעודכן על השלמת הכנסה לקצבת זקנה? 1. אתר הביטוח הלאומי (המקור הרשמי) אתר: www.btl.gov.il טלפון: מוקד אזרחים ותי… |

#### `senior_rights/financial-tables-and-definitions.html` (10)

| שורה | הקשר | קטע |
|---|---|---|
| [369](../senior_rights/financial-tables-and-definitions.html#L369) | הכנסה מנכסים | השלמת הכנסה |
| [374](../senior_rights/financial-tables-and-definitions.html#L374) | השלמת הכנסה | פירוט על השלמת הכנסה |
| [459](../senior_rights/financial-tables-and-definitions.html#L459) | תשלומים נלווים | דמי כיס למאושפזים — עם השלמת הכנסה 607 |
| [460](../senior_rights/financial-tables-and-definitions.html#L460) | תשלומים נלווים | דמי כיס למאושפזים — ללא השלמת הכנסה 662 |
| [818](../senior_rights/financial-tables-and-definitions.html#L818) | הגדרות › עולים חדשים | כוללת: תוספת בן/ת זוג, ילדים תלויים, השלמת הכנסה בתנאים הרגילים. |
| [880](../senior_rights/financial-tables-and-definitions.html#L880) | תקרות הכנסה מעבודה › שימו לב | income_supplement: { title: 'השלמת הכנסה', icon: '💰' }, |
| [977](../senior_rights/financial-tables-and-definitions.html#L977) | תקרות הכנסה מעבודה › הכנסה מנכסים | פירוט על השלמת הכנסה |
| [1063](../senior_rights/financial-tables-and-definitions.html#L1063) | תקרות הכנסה מעבודה › תשלומים נלווים | דמי כיס למאושפזים — עם השלמת הכנסה ${fmt(g('pocket_money_with_supplement'))} |
| [1064](../senior_rights/financial-tables-and-definitions.html#L1064) | תקרות הכנסה מעבודה › תשלומים נלווים | דמי כיס למאושפזים — ללא השלמת הכנסה ${fmt(g('pocket_money_without_supplement'))} |
| [1380](../senior_rights/financial-tables-and-definitions.html#L1380) | הגדרות | כוללת: תוספת בן/ת זוג, ילדים תלויים, השלמת הכנסה בתנאים הרגילים. |

#### `senior_rights/forms.html` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [455](../senior_rights/forms.html#L455) | 📝 טפסים לאזרח ותיק (קצבת זקנה) | תביעה להשלמת הכנסה |
| [456](../senior_rights/forms.html#L456) | 📝 טפסים לאזרח ותיק (קצבת זקנה) | תביעה להשלמת הכנסה למקבל קצבאות אזרח ותיק וקצבת שאירים |

#### `senior_rights/imputed_income_guide.html` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../senior_rights/imputed_income_guide.html#L6) |  | (בתוך תג/מאפיין) …name="description" content="מדריך לחישוב הכנסה רעיונית מנכסים פיננסיים לצורך בדיקת זכאות להשלמת הכנסה לגמלאי זקנה."> |
| [389](../senior_rights/imputed_income_guide.html#L389) | 📊 מה זה הכנסה רעיונית מנכסים? | כאשר נבדקת זכאות להשלמת הכנסה לגמלאי זקנה, ביטוח לאומי בודק לא רק את ההכנסות בפועל, אלא גם מחשב |
| [597](../senior_rights/imputed_income_guide.html#L597) | ⚠️ נקודות חשובות לזכור | הכנסה רעיונית זו תקוזז מסכום השלמת ההכנסה המגיע, ועלולה להשפיע על הזכאות. |

#### `senior_rights/nechut_vs_shairim.html` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [626](../senior_rights/nechut_vs_shairim.html#L626) | השוואת סכומים ותקרות › תקרות הכנסה ומבחני הכנסה | אלמנה ללא ילדים אינה כפופה למבחן הכנסות לקצבת השאירים עצמה, אך עשויה להיבדק לעניין השלמת הכנסה. |
| [688](../senior_rights/nechut_vs_shairim.html#L688) | השוואת יתרונות › ד. מענקים נלווים | ה. השלמת הכנסה |
| [689](../senior_rights/nechut_vs_shairim.html#L689) | השוואת יתרונות › ה. השלמת הכנסה | ניתן לבחון תוספת השלמת הכנסה כאשר ההכנסה הכוללת נמוכה מהספים הקבועים. |

#### `senior_rights/senior_citizens_rights_2026.html` (14)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../senior_rights/senior_citizens_rights_2026.html#L6) |  | (בתוך תג/מאפיין) …name="description" content="מדריך מקיף לזכויות אזרחים ותיקים בישראל לשנת 2026: קצבת זקנה, השלמת הכנסה, סיעוד, נכות, מענקים וקישורים למקורות רשמיים."> |
| [721](../senior_rights/senior_citizens_rights_2026.html#L721) | מסמכים נדרשים לתביעה | … תעודת זהות, אישורים על תשלומי דמי ביטוח לאומי לאורך השנים, ותלושי שכר רלוונטיים. מסמכים להשלמת הכנסה תוספת השלמת הכנסה ניתנת למי שאין להם הכנסות נוספות מלבד הקצבה, או שהכנסתם נמוכה מסכום מסו… |
| [725](../senior_rights/senior_citizens_rights_2026.html#L725) | מסמכים להשלמת הכנסה | ניתן להגיש את תביעת השלמת ההכנסה יחד עם תביעת קצבת אזרח ותיק, או בכל שלב מאוחר יותר כשההכנסה יורדת מתחת לסף הזכאות. גם כאן… |
| [726](../senior_rights/senior_citizens_rights_2026.html#L726) | מסמכים להשלמת הכנסה | 💡 טיפ: ניתן להעלות את כל המסמכים הנ"ל - הן לתביעה הראשית והן לתביעת השלמת ההכנסה - דרך שירות שליחת המסמכים באתר האישי, במקום פקס או דואר, גם לאחר הגשת התביעה עצמה, כדי לא… |
| [798](../senior_rights/senior_citizens_rights_2026.html#L798) | בדיקת זכאות אישית באתר | גמלת השלמת הכנסה |
| [804](../senior_rights/senior_citizens_rights_2026.html#L804) | גמלת השלמת הכנסה | חוברת זו מרכזת את המידע העדכני ביותר (נכון לשנת 2026) בנושא תוספת השלמת הכנסה לקצבת אזרח ותיק. התוספת נועדה להבטיח הכנסה מינימלית לקיום בכבוד עבור מי שקצבת הזקנה שלו ו… |
| [808](../senior_rights/senior_citizens_rights_2026.html#L808) | 1. תנאי זכאות בסיסיים › גמלת השלמת הכנסה | 1. תנאי זכאות בסיסיים כדי להיות זכאי להשלמת הכנסה, על המבקש לעמוד בארבעה תנאים מצטברים: |
| [813](../senior_rights/senior_citizens_rights_2026.html#L813) | 1. תנאי זכאות בסיסיים › גמלת השלמת הכנסה | הערה: הכנסות או נכסים מעל התקרה, יתכן ויאפשרו קבלת השלמת הכנסה חלקית. |
| [818](../senior_rights/senior_citizens_rights_2026.html#L818) | א. שני בני הזוג זכאים לקצבת אזרח ותיק › גמלת השלמת הכנסה | …י הזוג זכאים לקצבת אזרח ותיק כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה. |
| [824](../senior_rights/senior_citizens_rights_2026.html#L824) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") › גמלת השלמת הכנסה | השלמת הכנסה: הזכאות תחושב לפי תעריף של זוג . |
| [835](../senior_rights/senior_citizens_rights_2026.html#L835) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") › גמלת השלמת הכנסה | 3. סכומי הקצבה (קצבת אזרח ותיק + השלמת הכנסה) הסכומים להלן הם הסכומים הכוללים שהמבוטח יקבל (הקצבה הבסיסית + התוספת): |
| [922](../senior_rights/senior_citizens_rights_2026.html#L922) | 8. הטבות נלוות לזכאים | 8. הטבות נלוות לזכאים קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות: |
| [1134](../senior_rights/senior_citizens_rights_2026.html#L1134) | שירותי בריאות › הטבות נוספות | פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה) |
| [1168](../senior_rights/senior_citizens_rights_2026.html#L1168) | מוקדים ייעודיים › כתובות ומידע ליצירת קשר | מוקד השלמת הכנסה: *6050 שלוחה 4 |

#### `senior_rights/senior_rights_full.html` (32)

| שורה | הקשר | קטע |
|---|---|---|
| [6](../senior_rights/senior_rights_full.html#L6) |  | (בתוך תג/מאפיין) … name="description" content="מדריך מקיף לכל זכויות האזרח הוותיק בביטוח הלאומי: קצבת זקנה, השלמת הכנסה, שאירים, נכות, סיעוד וניצולי שואה במקום אחד."> |
| [1011](../senior_rights/senior_rights_full.html#L1011) | דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה | 💰 גמלת השלמת הכנסה — זיקנה ושאירים |
| [1016](../senior_rights/senior_rights_full.html#L1016) | 💰 גמלת השלמת הכנסה — זיקנה ושאירים | השלמת הכנסה ניתנת למי שהכנסותיו נמוכות ומיועדת להבטיח רמת חיים מינימלית — הן למקבלי קצבת זיקנה והן למ… |
| [1017](../senior_rights/senior_rights_full.html#L1017) | 💰 גמלת השלמת הכנסה — זיקנה ושאירים | 🏛️ השלמת הכנסה לקצבת זיקנה — כל זכות |
| [1018](../senior_rights/senior_rights_full.html#L1018) | 💰 גמלת השלמת הכנסה — זיקנה ושאירים | 🏛️ השלמת הכנסה לגמלת שאירים — כל זכות |
| [1025](../senior_rights/senior_rights_full.html#L1025) | א. קצבת זיקנה (אזרח ותיק) › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | ⚠️ הכנסות או נכסים מעל התקרה עשויים לאפשר השלמת הכנסה חלקית. ב. גמלת שאירים |
| [1032](../senior_rights/senior_rights_full.html#L1032) | ב. גמלת שאירים › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | ⚠️ הכנסות או נכסים מעל התקרה עשויים לאפשר השלמת הכנסה חלקית. |
| [1042](../senior_rights/senior_rights_full.html#L1042) | א. שני בני הזוג זכאים לקצבת אזרח ותיק › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | …י הזוג זכאים לקצבת אזרח ותיק כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה. |
| [1048](../senior_rights/senior_rights_full.html#L1048) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | השלמת הכנסה: הזכאות תחושב לפי תעריף של זוג . |
| [1051](../senior_rights/senior_rights_full.html#L1051) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | השלמת הכנסה לגמלת שאירים מחושבת תמיד לפי מדרג יחיד/ה בלבד. אין תקרה מיוחדת לזוג בגמלת שאירים — גם כשי… |
| [1065](../senior_rights/senior_rights_full.html#L1065) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") › 💰 גמלת השלמת הכנסה — זיקנה ושאירים | סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026 הסכומים להלן הם התקרות לקצבת זיקנה + השלמת ההכנסה (הקצבה הבסיסית + תוספת מקסימלית): |
| [1117](../senior_rights/senior_rights_full.html#L1117) | סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026 | סכומים מירביים גמלת שאירים + השלמת הכנסה 2026 לגמלת שאירים אין קטגוריית "זוג" — התקרה נקבעת לפי מצב יחיד/ה ומספר ילדים בלבד: |
| [1169](../senior_rights/senior_rights_full.html#L1169) | תקרות הכנסה וחישוב זכאות | 🧮 מחשבון זכאות להשלמת הכנסה |
| [1213](../senior_rights/senior_rights_full.html#L1213) | 🧮 מחשבון זכאות להשלמת הכנסה | יש סעיפי הכנסות נוספים שמשפיעים על השלמת הכנסה (הכנסה רעיונית מנכסים, שכר דירה ועוד). |
| [1221](../senior_rights/senior_rights_full.html#L1221) | בעלות על רכב | 🚗 מחשבון להשפעת רכב על זכאות השלמת הכנסה |
| [1236](../senior_rights/senior_rights_full.html#L1236) | בעלות על רכב | דוגמאות לחישוב השלמת הכנסה |
| [1263](../senior_rights/senior_rights_full.html#L1263) | דוגמה 3 — גמלת שאירים (אלמנה, גיל 55, ילד אחד): | השלמת הכנסה משוערת: ₪4,605 |
| [1275](../senior_rights/senior_rights_full.html#L1275) | דוגמה 3 — גמלת שאירים (אלמנה, גיל 55, ילד אחד): | ✈️ השלמת הכנסה ויציאה לחו"ל |
| [1301](../senior_rights/senior_rights_full.html#L1301) | 📊 סיכום תקופות שהייה מותרת בחו"ל | השלמת הכנסה |
| [1342](../senior_rights/senior_rights_full.html#L1342) | 📊 סיכום תקופות שהייה מותרת בחו"ל | 🏥 מקרים מיוחדים שמאפשרים המשך קבלת השלמת הכנסה |
| [1355](../senior_rights/senior_rights_full.html#L1355) | 👫 בני זוג | 🏠 הגדרת "תושב" לצורך השלמת הכנסה הביטוח הלאומי מכיר בתושבות ישראלית במשך 5 השנים הראשונות לאחר עזיבת הארץ. לאחר מכן — נשלל… |
| [1465](../senior_rights/senior_rights_full.html#L1465) | 📋 מה חייבים לדווח | כל יציאה — ראו תת-אקורדיון "השלמת הכנסה ויציאה לחו"ל". |
| [1526](../senior_rights/senior_rights_full.html#L1526) | 📩 קיבלתם דרישת החזר מהביטוח הלאומי? | 🎁 הטבות נלוות להשלמת הכנסה מקבלי השלמת הכנסה זכאים להטבות נוספות: |
| [2319](../senior_rights/senior_rights_full.html#L2319) | ב.4 — תוספת דמי מחיה ליתומים | …ר עם הורה המקבל קצבת שאירים — זכאי לתוספת דמי מחיה לכיסוי הוצאות מחיה שוטפות. ב.5 — תוספת השלמת הכנסה משולמת לפי חוק הבטחת הכנסה לאלמן/ה שהכנסתו/ה נמוכה. יש להגיש בקשה נפרדת. ב.6 — גמלת שאירי… |
| [2485](../senior_rights/senior_rights_full.html#L2485) | א. קצבאות המזכות במענק | הבטחת הכנסה / השלמת הכנסה |
| [2511](../senior_rights/senior_rights_full.html#L2511) | א. פטירת שני בני זוג בהפרש זמן קצר | ⚠️ במקרה זה המענק אינו משולם אוטומטית – יש להגיש תביעה. ב. קצבת זיקנה עם השלמת הכנסה מקבל קצבת זיקנה עם השלמת הכנסה שבן/בת זוגו נפטר/ה, זכאי גם הוא/היא למענק פטירה. 5. אופן ק… |
| [2816](../senior_rights/senior_rights_full.html#L2816) | 8.5 שירותי בריאות › 🌟 הטבות נוספות | פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה). |
| [2860](../senior_rights/senior_rights_full.html#L2860) | מוקדים ייעודיים › 📞 כתובות ויצירת קשר | מוקד השלמת הכנסה: *6050 שלוחה 4 |
| [2923](../senior_rights/senior_rights_full.html#L2923) | 10.3 הערות חשובות › הערה חשובה | income_supplement: { title: '💰 גמלת השלמת הכנסה — זיקנה ושאירים', icon: '💰' }, |
| [3150](../senior_rights/senior_rights_full.html#L3150) | 10.3 הערות חשובות | // מחשבון זכאות להשלמת הכנסה |
| [3199](../senior_rights/senior_rights_full.html#L3199) | 10.3 הערות חשובות | ❌ על סמך הנתונים שהזנת — אין זכאות להשלמת הכנסה |
| [3260](../senior_rights/senior_rights_full.html#L3260) | 10.3 הערות חשובות | השלמת הכנסה משוערת |

#### `senior_rights/sherutim_meiuchadim.html` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [647](../senior_rights/sherutim_meiuchadim.html#L647) | 6. השפעת קצבת שירותים מיוחדים על הבטחת הכנסה | …סה (חוק הבטחת הכנסה). לעומת זאת, יש להיזהר מבלבול מול תוכניות אחרות (כגון קצבת אזרח ותיק והשלמת הכנסה לגיל השלישי) — שם כללי ההכנסה עשויים להיות שונים, ומומלץ לבדוק לגופו של כל מקרה. |

#### `senior_rights/survivors_benefits_guide_2026.html` (4)

| שורה | הקשר | קטע |
|---|---|---|
| [1106](../senior_rights/survivors_benefits_guide_2026.html#L1106) | תוספת ותק | תוספת השלמת הכנסה ומענק חימום |
| [1111](../senior_rights/survivors_benefits_guide_2026.html#L1111) | תוספת השלמת הכנסה ומענק חימום | אלמן/ה שהכנסתם נמוכה עשויים לקבל תוספת השלמת הכנסה על פי חוק הבטחת הכנסה, שנועדה להבטיח הכנסה מינימלית. |
| [1113](../senior_rights/survivors_benefits_guide_2026.html#L1113) | תוספת השלמת הכנסה ומענק חימום | אלמן/ה שיש עמם ילד עד גיל 20 הלומד במוסד חינוכי – אינם זכאים לתוספת השלמת הכנסה בעד אותו ילד. |
| [1126](../senior_rights/survivors_benefits_guide_2026.html#L1126) | תוספת השלמת הכנסה ומענק חימום | מקבל תוספת השלמת הכנסה לקצבה באחד החודשים: אוקטובר, נובמבר או דצמבר |

### ב. קובצי נתונים / JS / שאלונים שמזינים את העמודים

| קובץ | מופעים | סוג |
|---|---|---|
| [senior_rights/data/benefits-index.json](../senior_rights/data/benefits-index.json) | 3 |  |
| [senior_rights/data/data_202601.html](../senior_rights/data/data_202601.html) | 8 |  |
| [senior_rights/data/faq-data.js](../senior_rights/data/faq-data.js) | 174 |  |
| [senior_rights/data/hamburger-nav.js](../senior_rights/data/hamburger-nav.js) | 21 |  |
| [senior_rights/data/important-links.json](../senior_rights/data/important-links.json) | 1 |  |
| [senior_rights/data/nechut-vs-shairim-data.js](../senior_rights/data/nechut-vs-shairim-data.js) | 3 |  |
| [senior_rights/data/nii-constants.json](../senior_rights/data/nii-constants.json) | 35 |  |
| [senior_rights/data/senior-citizens-rights-2026-data.js](../senior_rights/data/senior-citizens-rights-2026-data.js) | 14 |  |
| [senior_rights/data/senior_rights_full_data.js](../senior_rights/data/senior_rights_full_data.js) | 33 |  |
| [senior_rights/questionnaire-engine.js](../senior_rights/questionnaire-engine.js) | 3 |  |
| [senior_rights/questionnaires/child-definition.json](../senior_rights/questionnaires/child-definition.json) | 4 |  |
| [senior_rights/questionnaires/imputed-income-calculator.json](../senior_rights/questionnaires/imputed-income-calculator.json) | 2 |  |
| [senior_rights/questionnaires/income-supplement-eligibility.json](../senior_rights/questionnaires/income-supplement-eligibility.json) | 9 |  |

#### `senior_rights/data/benefits-index.json` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [61](../senior_rights/data/benefits-index.json#L61) | א. אזרחים ותיקים ושאירים | "name": "השלמת הכנסה לאזרח ותיק", |
| [93](../senior_rights/data/benefits-index.json#L93) | א. אזרחים ותיקים ושאירים | "name": "השלמת הכנסה לשאירים", |
| [300](../senior_rights/data/benefits-index.json#L300) | ד. הכנסה, עבודה ואבטלה | "name": "השלמת הכנסה (למי שעובד)", |

#### `senior_rights/data/data_202601.html` (8)

| שורה | הקשר | קטע |
|---|---|---|
| [512](../senior_rights/data/data_202601.html#L512) | 💵 | (בתוך תג/מאפיין)  <!-- ה. השלמת הכנסה ליתומים משני הורים או לילד נטוש --> |
| [515](../senior_rights/data/data_202601.html#L515) | 👶 | 👶 ה. השלמת הכנסה ליתומים משני הורים או לילד נטוש |
| [560](../senior_rights/data/data_202601.html#L560) | 👶 | (בתוך תג/מאפיין)  <!-- ו. השלמת הכנסה - מבוטחים בגילאי פרישה --> |
| [563](../senior_rights/data/data_202601.html#L563) | 💵 | 💵 ו. השלמת הכנסה - מבוטחים בגילאי פרישה |
| [825](../senior_rights/data/data_202601.html#L825) | 🏥 | (בתוך תג/מאפיין)  <!-- ח. מדדי זכאות להשלמת הכנסה --> |
| [828](../senior_rights/data/data_202601.html#L828) | 📈 | 📈 ח. מדדי זכאות להשלמת הכנסה |
| [891](../senior_rights/data/data_202601.html#L891) | 📈 | (בתוך תג/מאפיין)  <!-- ט. הסכום הקובע לעניין השלמת הכנסה --> |
| [894](../senior_rights/data/data_202601.html#L894) | 📋 | 📋 ט. הסכום הקובע לעניין השלמת הכנסה |

#### `senior_rights/data/faq-data.js` (174)

| שורה | הקשר | קטע |
|---|---|---|
| [24](../senior_rights/data/faq-data.js#L24) | סכום הקצבה (2026): | קצבה זו מהווה הכנסה בסיסית לגמלאים בישראל, ורבים מהם זכאים גם להשלמת הכנסה כדי להבטיח מינימום חיים. |
| [77](../senior_rights/data/faq-data.js#L77) | חשוב לציין | הגמלה המיוחדת אינה כוללת תוספת ותק או תוספת דחיית קצבה (כי אין היסטוריית ביטוח), אך כוללת השלמת הכנסה, תוספות לבן/בת זוג וילדים. |
| [125](../senior_rights/data/faq-data.js#L125) | אילו מסמכים צריך לצרף לתביעה לקצבת אזרח ותיק? | מסמכים להשלמת הכנסה |
| [126](../senior_rights/data/faq-data.js#L126) | מסמכים להשלמת הכנסה | תוספת השלמת הכנסה ניתנת למי שאין להם הכנסות נוספות מלבד הקצבה, או שהכנסתם נמוכה מסכום מסוים. יש למלא טופס ת… |
| [132](../senior_rights/data/faq-data.js#L132) | מסמכים להשלמת הכנסה | ניתן להגיש את תביעת השלמת ההכנסה יחד עם תביעת קצבת אזרח ותיק, או בכל שלב מאוחר יותר כשההכנסה יורדת מתחת לסף הזכאות. גם כאן… |
| [133](../senior_rights/data/faq-data.js#L133) | מסמכים להשלמת הכנסה | 💡 טיפ: ניתן להעלות את כל המסמכים - הן לתביעה הראשית והן לתביעת השלמת ההכנסה - דרך שירות שליחת המסמכים באתר האישי, במקום פקס או דואר, גם לאחר הגשת התביעה עצמה. |
| [276](../senior_rights/data/faq-data.js#L276) | 1. גמלת אזרח ותיק מיוחדת | …ד גיל 70, ו-30,339 ₪ מגיל 70 ואילך (פי 3). הכנסה שאינה מעבודה נבחנת מול סכום הקצבה בתוספת השלמת הכנסה שהיה זכאי להם. |
| [278](../senior_rights/data/faq-data.js#L278) | 1. גמלת אזרח ותיק מיוחדת | עם אפשרות לתוספת השלמת הכנסה, הנבחנת לפי תנאי הזכאות הרגילים של השלמת הכנסה |
| [317](../senior_rights/data/faq-data.js#L317) | מבחן הכנסות | …וי) וגם מנכסים קצבת שאירים : אלמנה אינה כפופה למבחן הכנסה על הקצבה עצמה (אך עשויה להיבדק להשלמת הכנסה); אלמן כפוף למבחן הכנסות אם אין לו ילדים |
| [384](../senior_rights/data/faq-data.js#L384) | הגורמים המרכזיים בחישוב: | תוספת השלמת הכנסה (אם הכנסות נמוכות) מענק חימום שנתי (במקרים מסוימים) |
| [692](../senior_rights/data/faq-data.js#L692) | אילו קצבאות קשורות לאזרחים ותיקים מעבר לקצבת הזקנה? | 1. גמלת השלמת הכנסה |
| [709](../senior_rights/data/faq-data.js#L709) | מהן קצבאות נגזרות מהזכאות לקשיש? | 1. גמלת השלמת הכנסה |
| [714](../senior_rights/data/faq-data.js#L714) | 3. הטבות ייחודיות | קבלת השלמת הכנסה מקנה זכאות אוטומטית להטבות כמו הנחות בחשמל, ארנונה, מים, תרופות ועוד. |
| [730](../senior_rights/data/faq-data.js#L730) | התנאים להכרה כ"בן/בת זוג תלוי": | האם יש השלמת הכנסה לאזרחים ותיקים? |
| [731](../senior_rights/data/faq-data.js#L731) | האם יש השלמת הכנסה לאזרחים ותיקים? | כן, קיימת השלמת הכנסה לאזרחים ותיקים . |
| [737](../senior_rights/data/faq-data.js#L737) | האם יש השלמת הכנסה לאזרחים ותיקים? | הטבות נלוות: קבלת השלמת הכנסה מקנה זכאות אוטומטית להנחות בחשמל, ארנונה, מים, תרופות, ועוד. |
| [740](../senior_rights/data/faq-data.js#L740) | האם יש השלמת הכנסה לאזרחים ותיקים? | מי זכאי לתוספת השלמת הכנסה? |
| [749](../senior_rights/data/faq-data.js#L749) | מי זכאי לתוספת השלמת הכנסה? | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? |
| [751](../senior_rights/data/faq-data.js#L751) | האם יש הבדל בין קצבת זקנה בסיסית לבין קצבת זקנה עם השלמת הכנסה? | קצבת זקנה בסיסית לעומת קצבה עם השלמת הכנסה |
| [753](../senior_rights/data/faq-data.js#L753) | קצבת זקנה בסיסית לעומת קצבה עם השלמת הכנסה | גמלת השלמת הכנסה היא תוספת נוספת המשולמת לאלה שהקצבה הבסיסית שלהם, בתוספת הכנסותיהם האחרות (מעבודה, נכסים … |
| [756](../senior_rights/data/faq-data.js#L756) | ההבדלים העיקריים: | סכום מינימלי מובטח : השלמת הכנסה מבטיחה סכום כולל גבוה יותר, בהתאם למצב משפחתי וגיל. לדוגמה: |
| [759](../senior_rights/data/faq-data.js#L759) | ההבדלים העיקריים: | מבחן הכנסה : קצבה בסיסית כפופה למבחן הכנסות משלה כדי לקבוע קצבה חלקית או מלאה. השלמת הכנסה יש לה מבחן הכנסות משלה, שונה ונוסף. |
| [760](../senior_rights/data/faq-data.js#L760) | ההבדלים העיקריים: | הטבות נלוות : קבלת השלמת הכנסה מעניקה אוטומטית הטבות כגון הנחה בחשמל, ארנונה, מים וברכישת תרופות. |
| [761](../senior_rights/data/faq-data.js#L761) | ההבדלים העיקריים: | מבחן נכסים : קבלת השלמת הכנסה כוללת גם בדיקה של נכסים ובעלות על רכב, שעלולה להשפיע על הזכאות. |
| [763](../senior_rights/data/faq-data.js#L763) | ההבדלים העיקריים: | בקיצור, קצבה בסיסית היא בסיס, והשלמת הכנסה היא תוספת לאלה שהכנסתם נמוכה מדי. |
| [765](../senior_rights/data/faq-data.js#L765) | ההבדלים העיקריים: | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? |
| [766](../senior_rights/data/faq-data.js#L766) | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? | כן, קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד. |
| [767](../senior_rights/data/faq-data.js#L767) | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? | אלמן/ה שהכנסתם נמוכה עשויים לקבל תוספת השלמת הכנסה על פי חוק הבטחת הכנסה, שנועדה להבטיח הכנסה מינימלית — בנוסף לקצבת השאירים עצמה. |
| [769](../senior_rights/data/faq-data.js#L769) | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? | אלמן/ה שיש עמו ילד עד גיל 20 הלומד במוסד חינוכי, אינם זכאים לתוספת השלמת הכנסה בעד אותו ילד. |
| [770](../senior_rights/data/faq-data.js#L770) | האם קצבת שאירים ותוספת השלמת הכנסה יכולות להינתן יחד? | כלומר, הם מקבלים תוספת משפחה במסגרת קצבת השאירים בעבור הילד, אך לא תוספת השלמת הכנסה נפרדת בעבור אותו ילד באותו הגיל. |
| [777](../senior_rights/data/faq-data.js#L777) | האם גמלת סיעוד משפיעה על קצבת זקנה? | חשוב לדעת : גמלת סיעוד כן משפיעה על הכנסות לצורך מבחן הכנסות של השלמת הכנסה (התוספת המבטיחה הכנסה מינימלית), אך לא על קצבת הזקנה עצמה. |
| [780](../senior_rights/data/faq-data.js#L780) | האם הכנסות מהשכרת דירה משפיעות על קצבת זקנה? | …קצבת זקנה . שכר דירה נחשב "הכנסה מנכסים" , ונבדק לצורך קביעת גובה קצבת זקנה חלקית וזכאות להשלמת הכנסה — לפי אותן תקרות המפורטות בשאלה "מה קורה אם יש הכנסות מעבודה או מקצבאות אחרות" בקובץ קצבת… |
| [787](../senior_rights/data/faq-data.js#L787) | האם פנסיה מהעבודה משפיעה על הזכאות לקצבת זיקנה? | לא. פנסיה לא משפיעה על הזכאות לקצבת זיקנה. פנסיה כן נחשבת בזכאות להשלמת הכנסה. |
| [792](../senior_rights/data/faq-data.js#L792) | האם פנסיה מהעבודה משפיעה על הזכאות לקצבת זיקנה? | סכום ההכנסה הפטור לפנסיה בבדיקת הזכאות להשלמת הכנסה: |
| [794](../senior_rights/data/faq-data.js#L794) | האם פנסיה מהעבודה משפיעה על הזכאות לקצבת זיקנה? | בנוסף, קיים פטור נפרד (ונמוך יותר) להכנסה מעבודה (לא מפנסיה) בבדיקת הזכאות להשלמת הכנסה: ₪3,236/חודש ליחיד, ₪3,786/חודש לאלמן/ה עם ילד. |
| [795](../senior_rights/data/faq-data.js#L795) | האם פנסיה מהעבודה משפיעה על הזכאות לקצבת זיקנה? | …ונה מהכנסת עבודה (שם מקוזזים רק 60% מהחריגה), הסכום שמעבר לפטור הפנסיה מקוזז במלואו מסכום השלמת ההכנסה. לדוגמה: יחיד עם פנסיה של 2,500 ₪ — הסכום שמעל הפטור (2,500 − 1,790 = 710 ₪) יקוזז במלואו… |
| [816](../senior_rights/data/faq-data.js#L816) | האם קצבאות מחו"ל משפיעות על הזכאות? | השלמת הכנסה — קצבה מחו"ל נבדקת כחלק מההכנסה הנבחנת, וגם כאן עשויה להוביל לצמצום ההשלמה. |
| [882](../senior_rights/data/faq-data.js#L882) | מדריכים מרכזיים: | קצבת אזרח ותיק (זקנה) השלמת הכנסה גמלת סיעוד גמלת נכות כללית וקצבת שירותים מיוחדים קצבת שאירים ומענק פטירה זכויות ניצולי שו… |
| [885](../senior_rights/data/faq-data.js#L885) | מדריכים מרכזיים: | מדריך לגמלת סיעוד מדריך לקצבת שאירים מדריך להשלמת הכנסה מדריך לזכויות ניצולי שואה |
| [900](../senior_rights/data/faq-data.js#L900) | תביעות שיש חובה להגישן באופן יזום (לא אוטומטיות) | השלמת הכנסה |
| [901](../senior_rights/data/faq-data.js#L901) | תביעות שיש חובה להגישן באופן יזום (לא אוטומטיות) | יש להגיש בקשה נפרדת להשלמת הכנסה — היא אינה משולמת באופן אוטומטי, אלא רק לאחר הגשת בקשה. |
| [949](../senior_rights/data/faq-data.js#L949) | איך מגישים השגה או ערעור על החלטה? | ערעור על זכאות או סכום קצבה (למשל קצבת זקנה, שאירים, השלמת הכנסה) — ניתן לערער ישירות לבית הדין האזורי לעבודה , בתוך 12 חודשים מיום קבלת ההחלטה. |
| [990](../senior_rights/data/faq-data.js#L990) | חובת התייצבות בשירות התעסוקה | כשמבקש/ת קצבת זקנה עם השלמת הכנסה , אם בן/בת הזוג טרם הגיע/ה לגיל פרישה (בעוד המבוטח עצמו כבר הגיע), הוא/היא חייב/ת להתייצב… |
| [993](../senior_rights/data/faq-data.js#L993) | חובת התייצבות בשירות התעסוקה | הסיבה: בן/בת הזוג הצעיר/ה צריך/ה להשתלב בשוק העבודה, ולא רק להסתמך על השלמת הכנסה. |
| [1004](../senior_rights/data/faq-data.js#L1004) | האם יש התייצבות או בדיקה תפקודית לסיעוד? | זה שונה מהשלמת הכנסה בקצבת זקנה , שם קיימת חובת התייצבות בשירות התעסוקה עבור בן/בת זוג צעיר/ה שטרם הגיע/ה לגיל… |
| [1008](../senior_rights/data/faq-data.js#L1008) | האם אפשר לבדוק זכאות לפני הגשת התביעה? | מחשבון אזרח ותיק - בדיקה ראשונית של זכאות לקצבת זקנה מחשבון השלמת הכנסה - הערכת זכאות להשלמת הכנסה מחשבונים נוספים לקצבאות שונות |
| [1017](../senior_rights/data/faq-data.js#L1017) | 1. קצבת אזרח ותיק (זקנה) | …וי בהכנסות (מעבודה, פנסיה, נכסים) — הקצבה עלולה להיות חלקית או להיפסק יציאה לחו"ל — תוספת השלמת הכנסה נפסקת לפי כללים מחמירים שינוי במצב משפחתי (נישואין, גירושין, פטירת בן זוג) — משנה את הסכו… |
| [1019](../senior_rights/data/faq-data.js#L1019) | 1. קצבת אזרח ותיק (זקנה) | 2. השלמת הכנסה |
| [1067](../senior_rights/data/faq-data.js#L1067) | קצבת זקנה (אזרח ותיק) | תוספת השלמת הכנסה |
| [1075](../senior_rights/data/faq-data.js#L1075) | קצבאות שבהן תושבות היא תנאי הכרחי: | גמלת השלמת הכנסה - דורשת תושבות ישראל ב-24 החודשים האחרונים גמלת סיעוד - דורשת אזרח ישראל ותושב ישראל |
| [1119](../senior_rights/data/faq-data.js#L1119) | 2. סוג הקצבה המתאים | … (זקנה) קצבת שאירים (אם אתה אלמן/ה) גמלת סיעוד (אם אתה זקוק לעזרה בפעולות יומיומיות) גמלת השלמת הכנסה (אם הכנסותיך נמוכות) |
| [1121](../senior_rights/data/faq-data.js#L1121) | 3. מבחן הכנסות | …הכנסה מנכסים : (שכר דירה, ריבית וכו') הכנסה מפנסיה : (זו לא משפיעה על קצבת זקנה, אך כן על השלמת הכנסה) |
| [1188](../senior_rights/data/faq-data.js#L1188) | איפה מרוכז המידע הרשמי המעודכן ביותר על כל הזכויות האלה? | אתר הביטוח הלאומי : www.btl.gov.il — כולל את כל הזכויות: קצבת זקנה, השלמת הכנסה, סיעוד, נכות, שאירים, ניצולי שואה, והטבות נוספות, עם מחשבונים ודוגמאות חישוב |
| [1303](../senior_rights/data/faq-data.js#L1303) | סכומי תקרה, יציאה לעבודה וקיזוזי קצבה ("חוק לרארון") | title: "השלמת הכנסה", |
| [1306](../senior_rights/data/faq-data.js#L1306) | סכומי תקרה, יציאה לעבודה וקיזוזי קצבה ("חוק לרארון") | מהי השלמת הכנסה לקצבת זקנה? |
| [1307](../senior_rights/data/faq-data.js#L1307) | מהי השלמת הכנסה לקצבת זקנה? | השלמת הכנסה לקצבת זקנה היא תוספת כספית שנועדה להבטיח רמת הכנסה מינימלית לקיום בכבוד לאזרחים ותיקים שק… |
| [1316](../senior_rights/data/faq-data.js#L1316) | הטבות נוספות | קבלת השלמת הכנסה מקנה זכאות אוטומטית להטבות בתעריפים מוזלים: חשמל, ארנונה, מים, תרופות, וסיוע בדיור. |
| [1318](../senior_rights/data/faq-data.js#L1318) | הטבות נוספות | מי זכאי להשלמת הכנסה בנוסף לקצבת זקנה? |
| [1330](../senior_rights/data/faq-data.js#L1330) | תקרות הכנסה לזכאות להשלמה (נכון ל-01/2026) | האם אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה? |
| [1331](../senior_rights/data/faq-data.js#L1331) | האם אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה? | כן, אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה - זה חלק ממערכת הסיוע המתוכננת לאזרחים ותיקים. |
| [1332](../senior_rights/data/faq-data.js#L1332) | האם אפשר לקבל השלמת הכנסה יחד עם קצבת זקנה רגילה? | התנאים הבסיסיים לזכאות להשלמת הכנסה: |
| [1335](../senior_rights/data/faq-data.js#L1335) | איך זה עובד בפרקטיקה: | השלמת הכנסה מוסיפה לקצבה שלך עד לסכום מינימלי מובטח: |
| [1338](../senior_rights/data/faq-data.js#L1338) | איך זה עובד בפרקטיקה: | …מבחן ההכנסות לקצבת הזקנה עצמה, פנסיה מקרן פנסיה או ביטוח מנהלים כן נחשבת הכנסה לצורך מבחן השלמת הכנסה, מעבר לפטור חלקי (1,790 ₪ ליחיד) — ראו פירוט בשאלה "האם פנסיה חודשית משפיעה על הזכאות להש… |
| [1340](../senior_rights/data/faq-data.js#L1340) | איך זה עובד בפרקטיקה: | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? |
| [1342](../senior_rights/data/faq-data.js#L1342) | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? | קצבת זקנה עם השלמת הכנסה: זו קצבה משופרת המשלבת את קצבת הזקנה הבסיסית פלוס תוספת "השלמת הכנסה", שנועדה להבטיח הכנס… |
| [1344](../senior_rights/data/faq-data.js#L1344) | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? | התנאי לקבלת השלמת הכנסה: |
| [1346](../senior_rights/data/faq-data.js#L1346) | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? | כלומר, השלמת הכנסה היא לא קצבה נפרדת , אלא תוספת לקצבת זקנה שמגיעה למי שהכנסתו נמוכה. |
| [1348](../senior_rights/data/faq-data.js#L1348) | מה ההבדל בין קצבת זקנה לבין קצבת זקנה עם השלמת הכנסה? | אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה? |
| [1352](../senior_rights/data/faq-data.js#L1352) | הכנסה מפנסיה — דין מיוחד: | …נחשבת הכנסה לצורך הזכאות לקצבת הזקנה עצמה (בין גיל הפרישה ל-70) — אך כן נחשבת הכנסה לצורך השלמת הכנסה , מעבר לפטור חלקי: 1,790 ₪ ליחיד / 2,823 ₪ לאלמן/ה עם ילד (2026). הסכום העודף על הפטור מק… |
| [1353](../senior_rights/data/faq-data.js#L1353) | הכנסה מפנסיה — דין מיוחד: | הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): |
| [1355](../senior_rights/data/faq-data.js#L1355) | הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | …נות בהתאם להרכב המשפחתי וסוג ההכנסה (מעבודה או מנכסים) — ראו פירוט התקרות בשאלה "מי זכאי להשלמת הכנסה בנוסף לקצבת זקנה". |
| [1357](../senior_rights/data/faq-data.js#L1357) | הכנסות שלא נחשבות (גם להשלמת הכנסה וגם לקצבה עצמה): | האם הכנסה מעבודה שוללת השלמת הכנסה? |
| [1358](../senior_rights/data/faq-data.js#L1358) | האם הכנסה מעבודה שוללת השלמת הכנסה? | לא, הכנסה מעבודה לא שוללת השלמת הכנסה , אך היא משפיעה על גובה ההשלמה. |
| [1363](../senior_rights/data/faq-data.js#L1363) | האם הכנסה מעבודה שוללת השלמת הכנסה? | …מעבודה שלעיל, ובכפוף לפטור משלה — ראו פירוט מלא בשאלה "האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה". |
| [1365](../senior_rights/data/faq-data.js#L1365) | האם הכנסה מעבודה שוללת השלמת הכנסה? | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? |
| [1366](../senior_rights/data/faq-data.js#L1366) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? | כן — פנסיה חודשית (מקרן פנסיה, ביטוח מנהלים או קרן השתלמות) נחשבת הכנסה לצורך השלמת הכנסה, מעבר לפטור חלקי. |
| [1370](../senior_rights/data/faq-data.js#L1370) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? | מבחן ההכנסות להשלמת הכנסה (התוספת): פנסיה כן נחשבת הכנסה , אך עם פטור חלקי לשנת 2026: 1,790 ₪ לחודש ליחיד , 2,823 ₪… |
| [1372](../senior_rights/data/faq-data.js#L1372) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? | …ד עם פנסיה של 2,500 ₪ לחודש — הסכום שמעל הפטור (2,500 - 1,790 = 710 ₪) יקוזז במלואו מסכום השלמת ההכנסה שהיה מגיע לו אחרת. |
| [1373](../senior_rights/data/faq-data.js#L1373) | האם פנסיה חודשית משפיעה על הזכאות להשלמת הכנסה? | מקור: תוספת השלמת הכנסה לקצבת זיקנה — כל-זכות. |
| [1376](../senior_rights/data/faq-data.js#L1376) | האם הכנסה משכר דירה נחשבת בחישוב? | כן, הכנסה משכר דירה נחשבת בחישוב של השלמת הכנסה לקצבת אזרח ותיק (זקנה). |
| [1377](../senior_rights/data/faq-data.js#L1377) | האם הכנסה משכר דירה נחשבת בחישוב? | שכר דירה נחשב הכנסה מנכסים ונכנס לבדיקת זכאות להשלמת הכנסה — זהו אחד ממקורות ההכנסה שהביטוח הלאומי בוחן כדי לקבוע אם אתה זכאי לתשלום תוספת השלמת הכנ… |
| [1383](../senior_rights/data/faq-data.js#L1383) | האם חסכונות או פיקדונות משפיעים על הזכאות? | כן, חסכונות ופיקדונות משפיעים על הזכאות להשלמת הכנסה, אך לא ישירות על קצבת זקנה עצמה. |
| [1386](../senior_rights/data/faq-data.js#L1386) | ההבחנה המרכזית: | השלמת הכנסה (גמלה נוספת): כאן, חסכונות ופיקדונות כן משפיעים דרך חישוב "הכנסה רעיונית". |
| [1392](../senior_rights/data/faq-data.js#L1392) | איך זה עובד: | לכן : אם יש לך חסכונות או פיקדונות מעבר לסכומי הפטור, זה עשוי להפחית או לשלול את הזכאות להשלמת הכנסה, גם אם קצבת הזקנה עצמה משולמת מלאה. |
| [1393](../senior_rights/data/faq-data.js#L1393) | איך זה עובד: | …28 ₪ ליחיד) לבין תקרת שווי הרכב הנפרדת (46,138 ₪) — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה". |
| [1395](../senior_rights/data/faq-data.js#L1395) | איך זה עובד: | האם קצבה מחו"ל משפיעה על השלמת הכנסה? |
| [1398](../senior_rights/data/faq-data.js#L1398) | קצבת ביטוח לאומי / סוציאל ביטחון ממדינה זרה (מקבילה לקצבת זקנה/שאירים) | אינה נחשבת הכנסה — לא לצורך קצבת הזקנה עצמה ולא לצורך השלמת הכנסה — בדיוק כמו קצבת אזרח ותיק או קצבת שאירים ישראלית. |
| [1401](../senior_rights/data/faq-data.js#L1401) | פנסיה תעסוקתית מחו"ל (מעבודה או מקרן פנסיה זרה) | לגבי השלמת הכנסה (התוספת): פנסיית עבודה מחו"ל כן נחשבת הכנסה , באותו אופן כמו פנסיה ישראלית — כלומר מעבר ל… |
| [1404](../senior_rights/data/faq-data.js#L1404) | פנסיה תעסוקתית מחו"ל (מעבודה או מקרן פנסיה זרה) | האם בן/בת זוג משפיעים על הזכאות להשלמת הכנסה? |
| [1405](../senior_rights/data/faq-data.js#L1405) | האם בן/בת זוג משפיעים על הזכאות להשלמת הכנסה? | כן, בן/בת זוג משפיעים משמעותית על הזכאות להשלמת הכנסה . |
| [1407](../senior_rights/data/faq-data.js#L1407) | הגדרת בן/בת זוג | בן/בת זוג מוכר/ת לצורך השלמת הכנסה צריך/ה לעמוד בתנאים הבאים: |
| [1410](../senior_rights/data/faq-data.js#L1410) | השפעת בן/בת זוג על תקרות גמלה | תקרות השלמת הכנסה גבוהות יותר כאשר יש בן/בת זוג תלוי: |
| [1415](../senior_rights/data/faq-data.js#L1415) | מבחן הכנסות | איך מחשבים את סכום השלמת ההכנסה? |
| [1417](../senior_rights/data/faq-data.js#L1417) | הנוסחה הבסיסית | השלמת הכנסה = הסכום המירבי הקובע פחות ההכנסה בפועל |
| [1421](../senior_rights/data/faq-data.js#L1421) | דוגמה: | אם הסכום הקובע (עבור יחיד) הוא 4,375 ₪ וההכנסה הנספרת שלך היא 2,000 ₪ בפועל, השלמת הכנסה = 4,375 פחות 2,000 = 2,375 ₪ |
| [1423](../senior_rights/data/faq-data.js#L1423) | דוגמה: | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? |
| [1424](../senior_rights/data/faq-data.js#L1424) | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? | כן, יש תקרת הכנסה לזכאות להשלמת הכנסה. |
| [1430](../senior_rights/data/faq-data.js#L1430) | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? | פטורים בהכנסה מעבודה (סכומים מסוימים של הכנסה שלא נספרים — ראו "האם הכנסה מעבודה שוללת השלמת הכנסה") מבחן נכסים (רכב ונכסים פיננסיים מעל תקרה מסוימת עלולים להפחית את הזכאות) מגבלות שהייה ב… |
| [1432](../senior_rights/data/faq-data.js#L1432) | האם יש תקרת הכנסה לזכאות להשלמת הכנסה? | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? |
| [1433](../senior_rights/data/faq-data.js#L1433) | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? | השלמת הכנסה אינה ניתנת אוטומטית . על האדם להגיש בקשה (טופס 430) כדי לקבל את הזכאות. |
| [1436](../senior_rights/data/faq-data.js#L1436) | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? | ראו פירוט מלא על אופן ההגשה בשאלה "איך מגישים בקשה להשלמת הכנסה". |
| [1438](../senior_rights/data/faq-data.js#L1438) | האם השלמת הכנסה ניתנת אוטומטית או שצריך להגיש בקשה? | אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה? |
| [1439](../senior_rights/data/faq-data.js#L1439) | אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה? | לבקשה להשלמת הכנסה (טופס 430) יש לצרף בדרך כלל: |
| [1450](../senior_rights/data/faq-data.js#L1450) | אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה? | איך מגישים בקשה להשלמת הכנסה? |
| [1451](../senior_rights/data/faq-data.js#L1451) | איך מגישים בקשה להשלמת הכנסה? | דרכי הגשת בקשה להשלמת הכנסה |
| [1467](../senior_rights/data/faq-data.js#L1467) | דרכי הגשת בקשה להשלמת הכנסה | אתם חייבים לקבל תחילה קצבת אזרח ותיק (בקצבה מלאה או חלקית) כדי להיות זכאים להשלמת הכנסה הגישו בזמן — הגשה מאוחרת מדי עלולה לגרום לאובדן קצבאות רטרואקטיביות כדאי להשתמש במחשבון ה… |
| [1470](../senior_rights/data/faq-data.js#L1470) | האם אפשר להגיש את הבקשה באופן מקוון? | כן — כפי שמפורט בשאלה "איך מגישים בקשה להשלמת הכנסה", ניתן להגיש את הבקשה (טופס 430) באופן מקוון דרך האזור האישי באתר הביטוח הלאומי ( ps.btl.… |
| [1473](../senior_rights/data/faq-data.js#L1473) | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? | הזכאות לתשלום השלמת הכנסה מתחילה בדרך כלל מחודש הגשת התביעה (ולא רטרואקטיבית לתקופה שקדמה להגשה, מלבד המקרים המפורט… |
| [1474](../senior_rights/data/faq-data.js#L1474) | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? | קצבאות הביטוח הלאומי, כולל השלמת הכנסה, משולמות בדרך כלל לקראת סוף החודש (ה-28 בחודש לקצבת אזרח ותיק) ישירות לחשבון הבנק. מועד ה… |
| [1477](../senior_rights/data/faq-data.js#L1477) | מתי מתחילים לקבל את התשלום לאחר אישור הזכאות? | האם השלמת הכנסה משולמת רטרואקטיבית? |
| [1478](../senior_rights/data/faq-data.js#L1478) | האם השלמת הכנסה משולמת רטרואקטיבית? | כן, השלמת הכנסה יכולה להיות משולמת רטרואקטיבית , אך בתנאים מסוימים: |
| [1479](../senior_rights/data/faq-data.js#L1479) | האם השלמת הכנסה משולמת רטרואקטיבית? | תשלום רטרואקטיבי של השלמת הכנסה |
| [1480](../senior_rights/data/faq-data.js#L1480) | תשלום רטרואקטיבי של השלמת הכנסה | אם מגישים בקשה להשלמת הכנסה לאחר שהגיעו לגיל הפרישה , אפשר לקבל קצבה רטרואקטיבית עבור עד 12 חודשים מיום הגשת התביעה. |
| [1491](../senior_rights/data/faq-data.js#L1491) | מה קורה אם לא דיווחו בזמן | דוגמה: אם קצבת השלמת הכנסה אושרה על בסיס הכנסה של ₪2,000/חודש, והכנסתך עלתה ל-₪3,500/חודש, יש לדווח על כך תוך 30 יום… |
| [1512](../senior_rights/data/faq-data.js#L1512) | האם יש חובת דיווח על שינוי במצב משפחתי? | האם מעבר דירה משפיע על השלמת הכנסה? |
| [1513](../senior_rights/data/faq-data.js#L1513) | האם מעבר דירה משפיע על השלמת הכנסה? | מעבר דירה כשלעצמו (שינוי כתובת מגורים בישראל) אינו משפיע ישירות על זכאות או סכום השלמת הכנסה. |
| [1514](../senior_rights/data/faq-data.js#L1514) | האם מעבר דירה משפיע על השלמת הכנסה? | …ה שכר דירה שונה, אם אתה משכיר נכס), זה כן יכול להשפיע על חישוב ההכנסה מנכסים ובכך על סכום השלמת הכנסה — ראו שאלה "האם הכנסה משכר דירה נחשבת בחישוב". יש לדווח לביטוח הלאומי על כל שינוי כתובת, … |
| [1517](../senior_rights/data/faq-data.js#L1517) | האם קבלת ירושה משפיעה על הזכאות? | ירושה עצמה אינה מופיעה כהכנסה בחישוב זכאות להשלמת הכנסה (ראו הרשימה בשאלה "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה"). |
| [1522](../senior_rights/data/faq-data.js#L1522) | האם מתנות או סיוע מקרובי משפחה משפיעים על ההשלמה? | מתנות וסיוע כספי מקרובי משפחה אינם נחשבים הכנסה לצורך מבחן ההכנסות של השלמת הכנסה או קצבת זקנה (ראו הרשימה בשאלה "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה"). |
| [1525](../senior_rights/data/faq-data.js#L1525) | האם מתנות או סיוע מקרובי משפחה משפיעים על ההשלמה? | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? |
| [1526](../senior_rights/data/faq-data.js#L1526) | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? | כן, אפשר לקבל השלמת הכנסה וגם גמלת סיעוד בו-זמנית. |
| [1528](../senior_rights/data/faq-data.js#L1528) | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? | השלמת הכנסה: |
| [1531](../senior_rights/data/faq-data.js#L1531) | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? | …(או 60+ במקרים מיוחדים) תלות בעזרת הזולת בפעולות יומיומיות מבחן הכנסות משלה (תקרות שונות מהשלמת ההכנסה) |
| [1534](../senior_rights/data/faq-data.js#L1534) | האם אפשר לקבל השלמת הכנסה וגם גמלת סיעוד? | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? |
| [1535](../senior_rights/data/faq-data.js#L1535) | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? | קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות נלוות: |
| [1537](../senior_rights/data/faq-data.js#L1537) | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? | כלומר, מי שזכאי להשלמת הכנסה מקבל אוטומטית גם מגוון הטבות נוספות מעבר לגמלה הכספית עצמה. |
| [1539](../senior_rights/data/faq-data.js#L1539) | האם השלמת הכנסה משפיעה על זכאות להטבות נלוות? | האם יש הבדל בין השלמת הכנסה ליחיד לבין זוג? |
| [1540](../senior_rights/data/faq-data.js#L1540) | האם יש הבדל בין השלמת הכנסה ליחיד לבין זוג? | כן, יש הבדל משמעותי בין השלמת הכנסה ליחיד לבין זוג . תקרות השלמת הכנסה (הסכום המירבי הקובע) שונות בהתאם למצב המשפחתי: |
| [1556](../senior_rights/data/faq-data.js#L1556) | חשוב: מעבר אפשרי לקצבת שאירים | …בת הזוג הנותר/ת עלול/ה להיות זכאי/ת גם לקצבת שאירים (כאלמן/ה), בתנאים מסוימים. במקרה כזה, השלמת הכנסה נבדקת לגבי קצבת השאירים בנפרד, בתקרות שונות מאלה של קצבת זיקנה. |
| [1559](../senior_rights/data/faq-data.js#L1559) | חשוב: מעבר אפשרי לקצבת שאירים | האם אלמן או אלמנה יכולים לקבל השלמת הכנסה בתנאים מיוחדים? |
| [1561](../senior_rights/data/faq-data.js#L1561) | 1. אלמן/אלמנה המקבלים קצבת זיקנה (אזרח ותיק) | כן, הם יכולים להיות זכאים להשלמת הכנסה בתנאים הרגילים של קצבת זיקנה: קבלת קצבת אזרח ותיק, תושבות בישראל (24 החודשים האחרונים), מ… |
| [1563](../senior_rights/data/faq-data.js#L1563) | 2. אלמן/אלמנה המקבלים קצבת שאירים | אלמנה זכאית להשלמת הכנסה אם עומדת בתנאים הסטנדרטיים (תושבות, מבחן הכנסות ונכסים). |
| [1568](../senior_rights/data/faq-data.js#L1568) | 2. אלמן/אלמנה המקבלים קצבת שאירים | האם השלמת הכנסה ניתנת גם למי שגר בדיור מוגן? |
| [1569](../senior_rights/data/faq-data.js#L1569) | האם השלמת הכנסה ניתנת גם למי שגר בדיור מוגן? | השלמת הכנסה ניתנת לתושבי ישראל המתגוררים בישראל בפועל, ללא הבחנה מפורשת לפי "דיור מוגן" כתנאי בפני עצ… |
| [1573](../senior_rights/data/faq-data.js#L1573) | האם השלמת הכנסה ניתנת גם למי שגר בדיור מוגן? | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? |
| [1574](../senior_rights/data/faq-data.js#L1574) | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? | סיוע כספי מרצון מבני משפחה אינו נחשב הכנסה ואינו שולל זכאות להשלמת הכנסה (ראו "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה"). |
| [1575](../senior_rights/data/faq-data.js#L1575) | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? | …אות כאלה שייכות למערכת נפרדת (משרד הרווחה, לא הביטוח הלאומי), ואינן קשורות ישירות לזכאות להשלמת הכנסה מהביטוח הלאומי. |
| [1576](../senior_rights/data/faq-data.js#L1576) | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? | תנאי הזכאות הבסיסיים להשלמת הכנסה נותרים: קבלת קצבת אזרח ותיק (או קצבת שאירים), תושבות בישראל, מבחן הכנסות ומבחן נכסים. |
| [1578](../senior_rights/data/faq-data.js#L1578) | האם השלמת הכנסה ניתנת גם למי שמקבל סיוע משפחתי קבוע? | האם אפשר לערער על החלטה שלא לאשר השלמת הכנסה? |
| [1579](../senior_rights/data/faq-data.js#L1579) | האם אפשר לערער על החלטה שלא לאשר השלמת הכנסה? | כן, אפשר לערער על החלטה שלא אושרה השלמת הכנסה. |
| [1599](../senior_rights/data/faq-data.js#L1599) | 4. נתונים שנבדקים: | … שווי רכב (אם יש לך, בכפוף לתקרת שווי הרכב הנפרדת — ראו שאלה "איך יודעים אם כדאי להגיש גם השלמת הכנסה") |
| [1601](../senior_rights/data/faq-data.js#L1601) | כלים באתר | האתר מציע מחשבון זכאות להשלמת הכנסה שיעזור לך לחשב את סכום הזכאות המשוער. יש להזין את הנתונים האישיים והמחשבון יחזיר הערכה. |
| [1605](../senior_rights/data/faq-data.js#L1605) | האם יש מדרגות הכנסה שונות לפי גיל? | כן, בהשלמת הכנסה יש מדרגות שונות לפי גיל. תקרות הגמלה משתנות ב-3 מדרגות גיל: |
| [1614](../senior_rights/data/faq-data.js#L1614) | האם יש מדרגות הכנסה שונות לפי גיל? | האם קצבת שאירים נחשבת כהכנסה לעניין השלמת הכנסה? |
| [1615](../senior_rights/data/faq-data.js#L1615) | האם קצבת שאירים נחשבת כהכנסה לעניין השלמת הכנסה? | לא, קצבת שאירים אינה נחשבת הכנסה לעניין בדיקת זכאות להשלמת הכנסה בקצבת זקנה — ראו הרשימה המלאה בשאלה "אילו הכנסות נבדקות לצורך זכאות להשלמת הכנסה". כך שמי… |
| [1618](../senior_rights/data/faq-data.js#L1618) | האם קצבת נכות או קצבאות אחרות נחשבות כהכנסה? | …צבת נכות וקצבאות אחרות של הביטוח הלאומי (סיעוד וכו') אינן נחשבות הכנסה לצורך בדיקת זכאות להשלמת הכנסה, בדיוק כמו קצבת שאירים ופנסיה ממקורות פנסיוניים — ראו הרשימה המלאה בשאלה "אילו הכנסות נבד… |
| [1621](../senior_rights/data/faq-data.js#L1621) | האם ריבית מחשבון בנק נחשבת בחישוב? | כן, ריבית מחשבון בנק נחשבת בחישוב השלמת הכנסה , כחלק מהחישוב הכולל של "הכנסה רעיונית" מנכסים פיננסיים — ראו הנוסחה המלאה בשאלה "האם חסכ… |
| [1624](../senior_rights/data/faq-data.js#L1624) | מה קורה אם יש יותר מחשבון בנק אחד? | בהשלמת הכנסה, יש לדווח על כל חשבונות הבנק, הפיקדונות והחסכונות שברשותך — לא רק על אחד. כל הנכסים הפיננ… |
| [1625](../senior_rights/data/faq-data.js#L1625) | מה קורה אם יש יותר מחשבון בנק אחד? | …ים יחד מחושבת הכנסה רעיונית על הסכום הכולל שמעבר לתקרת הפטור ההכנסה הרעיונית מקוזזת מסכום השלמת ההכנסה המגיע לך, ועלולה להפחית או לשלול את הזכאות |
| [1628](../senior_rights/data/faq-data.js#L1628) | מה קורה אם יש יותר מחשבון בנק אחד? | האם ניתן לקבל סיוע ממוקד בהגשת בקשה להשלמת הכנסה? |
| [1636](../senior_rights/data/faq-data.js#L1636) | האם ניתן לקבל סיוע ממוקד בהגשת בקשה להשלמת הכנסה? | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? |
| [1637](../senior_rights/data/faq-data.js#L1637) | איך יודעים אם כדאי להגיש גם השלמת הכנסה ולא רק קצבת זקנה? | תנאי זכאות בסיסיים להשלמת הכנסה |
| [1641](../senior_rights/data/faq-data.js#L1641) | מתי כדאי להגיש? | כדאי להגיש בקשה גם להשלמת הכנסה אם: |
| [1648](../senior_rights/data/faq-data.js#L1648) | המלצה | כדאי להגיש בקשה להשלמת הכנסה גם אם כבר מקבלים את קצבת הזקנה — היא עשויה לשפר משמעותית את המצב הכלכלי, בתנאי שההכנסות א… |
| [1650](../senior_rights/data/faq-data.js#L1650) | המלצה | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? |
| [1651](../senior_rights/data/faq-data.js#L1651) | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? | לא, לא נדרשים מסמכים רפואיים כדי להגיש בקשה להשלמת הכנסה. |
| [1652](../senior_rights/data/faq-data.js#L1652) | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? | בדיקת הזכאות להשלמת הכנסה מבוססת על: |
| [1654](../senior_rights/data/faq-data.js#L1654) | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? | …ר הכנסות, מסמכי בעלות על נכסים וכו') — ראו רשימה מלאה בשאלה "אילו מסמכים צריך לצרף לבקשה להשלמת הכנסה". |
| [1656](../senior_rights/data/faq-data.js#L1656) | האם יש מסמכים רפואיים שצריך לצרף להשלמת הכנסה? | האם יש בדיקה בבית לצורך השלמת הכנסה? |
| [1657](../senior_rights/data/faq-data.js#L1657) | האם יש בדיקה בבית לצורך השלמת הכנסה? | אין בדיקה בבית לצורך השלמת הכנסה — בשונה מגמלת סיעוד, שם נערך ביקור בית להערכה תפקודית (ראו קובץ גמלת סיעוד). |
| [1658](../senior_rights/data/faq-data.js#L1658) | האם יש בדיקה בבית לצורך השלמת הכנסה? | תנאי הזכאות להשלמת הכנסה הם: |
| [1662](../senior_rights/data/faq-data.js#L1662) | האם יש בדיקה בבית לצורך השלמת הכנסה? | האם יש הבחנה בין תביעה חדשה לבין עדכון זכאות להשלמת הכנסה? |
| [1664](../senior_rights/data/faq-data.js#L1664) | תביעה חדשה | תביעה חדשה להשלמת הכנסה מוגשת כאשר המבוטח: |
| [1665](../senior_rights/data/faq-data.js#L1665) | תביעה חדשה | לא היה זכאי בעבר להשלמת הכנסה, או מגיש תביעה בפעם הראשונה לאחר שעמד בתנאי הזכאות |
| [1667](../senior_rights/data/faq-data.js#L1667) | עדכון זכאות קיימת | עדכון של זכאות קיימת מתרחש כאשר המבוטח כבר מקבל השלמת הכנסה, אך משתנים תנאים בהכנסות שלו (עלייה או ירידה), בהרכב המשפחתי או בנכסים, וצריך לעדכן את סכ… |
| [1672](../senior_rights/data/faq-data.js#L1672) | האם אפשר לקבל תשלום זמני עד בדיקת הזכאות? | כן — הביטוח הלאומי עשוי לאשר תשלום זמני על חשבון השלמת הכנסה (הבטחת הכנסה) , כאשר בדיקת הזכאות המלאה מתעכבת בשל חוסר במסמכים או צורך בבירור מעמיק, וזא… |
| [1677](../senior_rights/data/faq-data.js#L1677) | האם אפשר לקבל תשלום זמני עד בדיקת הזכאות? | מה עושים אם הבקשה להשלמת הכנסה נדחתה? |
| [1680](../senior_rights/data/faq-data.js#L1680) | מה עושים אם הבקשה להשלמת הכנסה נדחתה? | הגש ערעור — ראו התהליך המלא בשאלה "האם אפשר לערער על החלטה שלא לאשר השלמת הכנסה" (ועדת עררים פנימית תוך 30 יום, ולאחר מכן בית דין לעבודה תוך 12 חודשים) |
| [1686](../senior_rights/data/faq-data.js#L1686) | האם אפשר להגיש בקשה חוזרת לאחר דחייה? | כן. ניתן להגיש בקשה חדשה להשלמת הכנסה בכל עת שבה חל שינוי רלוונטי בנסיבות — למשל ירידה בהכנסה, שינוי במצב המשפחתי, או השלמת מסמ… |
| [1688](../senior_rights/data/faq-data.js#L1688) | האם אפשר להגיש בקשה חוזרת לאחר דחייה? | מהו המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי? |
| [1689](../senior_rights/data/faq-data.js#L1689) | מהו המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי? | המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי הוא עד 12 חודשים מיום הגשת התביעה (לפי התנאי הבסיסי). |
| [1690](../senior_rights/data/faq-data.js#L1690) | מהו המועד האחרון להגשת בקשה להשלמת הכנסה כדי לקבל תשלום רטרואקטיבי? | …ת המוחלט), ניתן לקבל רטרואקטיביות של עד 48 חודשים מיום הגשת התביעה — ראו פירוט בשאלה "האם השלמת הכנסה משולמת רטרואקטיבית". |
| [1694](../senior_rights/data/faq-data.js#L1694) | האם יש שינוי בזכאות כשמגיעים לגיל זכאות לקצבת אזרח ותיק ללא תנאי הכנסה | כן, יש שינוי משמעותי בזכאות להשלמת הכנסה כשמגיעים לגיל 70. |
| [1700](../senior_rights/data/faq-data.js#L1700) | האם יש שינוי בזכאות כשמגיעים לגיל זכאות לקצבת אזרח ותיק ללא תנאי הכנסה | איפה מוצאים את המידע הרשמי המעודכן על השלמת הכנסה לקצבת זקנה? |

#### `senior_rights/data/hamburger-nav.js` (21)

| שורה | הקשר | קטע |
|---|---|---|
| [66](../senior_rights/data/hamburger-nav.js#L66) |  | { text: '💰 גמלת השלמת הכנסה', children: [ |
| [75](../senior_rights/data/hamburger-nav.js#L75) |  | { text: 'סכומים מירביים קצבת זיקנה + השלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#is-max-oldage' }, |
| [76](../senior_rights/data/hamburger-nav.js#L76) |  | { text: 'סכומים מירביים גמלת שאירים + השלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#is-max-survivors' }, |
| [78](../senior_rights/data/hamburger-nav.js#L78) |  | { text: '🧮 מחשבון זכאות להשלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#is-calculator' }, |
| [82](../senior_rights/data/hamburger-nav.js#L82) |  | { text: 'דוגמאות לחישוב השלמת הכנסה', children: [ |
| [87](../senior_rights/data/hamburger-nav.js#L87) |  | { text: '✈️ השלמת הכנסה ויציאה לחו"ל', children: [ |
| [104](../senior_rights/data/hamburger-nav.js#L104) |  | { text: '🎁 הטבות נלוות להשלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#is-benefits' }, |
| [139](../senior_rights/data/hamburger-nav.js#L139) |  | { text: 'ב.5 — תוספת השלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#su-b5' }, |
| [178](../senior_rights/data/hamburger-nav.js#L178) |  | { text: 'ב. קצבת זיקנה עם השלמת הכנסה', href: bp + 'senior_rights/senior_rights_full.html#su-i4b' }, |
| [255](../senior_rights/data/hamburger-nav.js#L255) |  | { text: 'השלמת הכנסה', href: bp + 'senior_rights/financial-tables-and-definitions.html#income_supplement' }, |
| [275](../senior_rights/data/hamburger-nav.js#L275) |  | { text: 'גמלת השלמת הכנסה', children: [ |
| [432](../senior_rights/data/hamburger-nav.js#L432) |  | { icon: '💰', text: 'בדיקת זכאות להשלמת הכנסה', href: bp + 'senior_rights/questionnaire.html?id=income-supplement-eligibility' }, |
| [433](../senior_rights/data/hamburger-nav.js#L433) |  | { icon: '👶', text: 'הגדרת ילד להשלמת הכנסה', href: bp + 'senior_rights/questionnaire.html?id=child-definition&hideReturn=true' }, |
| [434](../senior_rights/data/hamburger-nav.js#L434) |  | { icon: '🚗', text: 'זכאות להשלמת הכנסה עם רכב', href: bp + 'senior_rights/questionnaire.html?id=vehicle-income-supplement' }, |
| [454](../senior_rights/data/hamburger-nav.js#L454) |  | { icon: '💰', text: 'מחשבון השלמת הכנסה', href: 'https://www.btl.gov.il/Simulators/Pages/IncomeSupportCalc.aspx', external: true … |
| [488](../senior_rights/data/hamburger-nav.js#L488) |  | { text: '💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה', href: bp + 'additional_guides/html/additional_guides_ind… |
| [489](../senior_rights/data/hamburger-nav.js#L489) |  | { text: '✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה', href: bp + 'additional_guides/html/additional_guides_index.html#yetzia_lachul' }, |
| [509](../senior_rights/data/hamburger-nav.js#L509) |  | { text: 'ה. השלמת הכנסה ליתומים', href: bp + 'senior_rights/data/data_202601.html#data-he' }, |
| [510](../senior_rights/data/hamburger-nav.js#L510) |  | { text: 'ו. השלמת הכנסה — גילאי פרישה', href: bp + 'senior_rights/data/data_202601.html#data-vav' }, |
| [512](../senior_rights/data/hamburger-nav.js#L512) |  | { text: 'ח. מדדי זכאות להשלמת הכנסה', href: bp + 'senior_rights/data/data_202601.html#data-het' }, |
| [513](../senior_rights/data/hamburger-nav.js#L513) |  | { text: 'ט. הסכום הקובע להשלמת הכנסה', href: bp + 'senior_rights/data/data_202601.html#data-tet' }, |

#### `senior_rights/data/important-links.json` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [36](../senior_rights/data/important-links.json#L36) | ביטוח לאומי | "name": "תוספת השלמת הכנסה", |

#### `senior_rights/data/nechut-vs-shairim-data.js` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [109](../senior_rights/data/nechut-vs-shairim-data.js#L109) | תקרות הכנסה ומבחני הכנסה | אלמנה ללא ילדים אינה כפופה למבחן הכנסות לקצבת השאירים עצמה, אך עשויה להיבדק לעניין השלמת הכנסה. |
| [168](../senior_rights/data/nechut-vs-shairim-data.js#L168) | ד. מענקים נלווים | ה. השלמת הכנסה |
| [169](../senior_rights/data/nechut-vs-shairim-data.js#L169) | ה. השלמת הכנסה | ניתן לבחון תוספת השלמת הכנסה כאשר ההכנסה הכוללת נמוכה מהספים הקבועים. |

#### `senior_rights/data/nii-constants.json` (35)

| שורה | הקשר | קטע |
|---|---|---|
| [194](../senior_rights/data/nii-constants.json#L194) | תקרת השלמת הכנסה — יחיד עד גיל 70 | "label": "תקרת השלמת הכנסה — יחיד עד גיל 70", |
| [201](../senior_rights/data/nii-constants.json#L201) | תקרת השלמת הכנסה — זוג עד גיל 70 | "label": "תקרת השלמת הכנסה — זוג עד גיל 70", |
| [208](../senior_rights/data/nii-constants.json#L208) | תקרת השלמת הכנסה — זוג + ילד אחד עד גיל 70 | "label": "תקרת השלמת הכנסה — זוג + ילד אחד עד גיל 70", |
| [215](../senior_rights/data/nii-constants.json#L215) | תקרת השלמת הכנסה — זוג + 2 ילדים עד גיל 70 | "label": "תקרת השלמת הכנסה — זוג + 2 ילדים עד גיל 70", |
| [222](../senior_rights/data/nii-constants.json#L222) | תקרת השלמת הכנסה — יחיד + ילד אחד עד גיל 70 | "label": "תקרת השלמת הכנסה — יחיד + ילד אחד עד גיל 70", |
| [229](../senior_rights/data/nii-constants.json#L229) | תקרת השלמת הכנסה — יחיד + 2 ילדים עד גיל 70 | "label": "תקרת השלמת הכנסה — יחיד + 2 ילדים עד גיל 70", |
| [236](../senior_rights/data/nii-constants.json#L236) | תקרת השלמת הכנסה — יחיד בגיל 70–80 | "label": "תקרת השלמת הכנסה — יחיד בגיל 70–80", |
| [243](../senior_rights/data/nii-constants.json#L243) | תקרת השלמת הכנסה — זוג בגיל 70–80 | "label": "תקרת השלמת הכנסה — זוג בגיל 70–80", |
| [250](../senior_rights/data/nii-constants.json#L250) | תקרת השלמת הכנסה — יחיד + ילד אחד, גיל 70–80 | "label": "תקרת השלמת הכנסה — יחיד + ילד אחד, גיל 70–80", |
| [257](../senior_rights/data/nii-constants.json#L257) | תקרת השלמת הכנסה — יחיד + 2 ילדים, גיל 70–80 | "label": "תקרת השלמת הכנסה — יחיד + 2 ילדים, גיל 70–80", |
| [264](../senior_rights/data/nii-constants.json#L264) | תקרת השלמת הכנסה — זוג + ילד אחד, גיל 70–80 | "label": "תקרת השלמת הכנסה — זוג + ילד אחד, גיל 70–80", |
| [271](../senior_rights/data/nii-constants.json#L271) | תקרת השלמת הכנסה — זוג + 2 ילדים, גיל 70–80 | "label": "תקרת השלמת הכנסה — זוג + 2 ילדים, גיל 70–80", |
| [278](../senior_rights/data/nii-constants.json#L278) | תקרת השלמת הכנסה — יחיד מגיל 80 ומעלה | "label": "תקרת השלמת הכנסה — יחיד מגיל 80 ומעלה", |
| [285](../senior_rights/data/nii-constants.json#L285) | תקרת השלמת הכנסה — זוג מגיל 80 ומעלה | "label": "תקרת השלמת הכנסה — זוג מגיל 80 ומעלה", |
| [292](../senior_rights/data/nii-constants.json#L292) | תקרת השלמת הכנסה — יחיד + ילד אחד, גיל 80+ | "label": "תקרת השלמת הכנסה — יחיד + ילד אחד, גיל 80+", |
| [299](../senior_rights/data/nii-constants.json#L299) | תקרת השלמת הכנסה — יחיד + 2 ילדים, גיל 80+ | "label": "תקרת השלמת הכנסה — יחיד + 2 ילדים, גיל 80+", |
| [306](../senior_rights/data/nii-constants.json#L306) | תקרת השלמת הכנסה — זוג + ילד אחד, גיל 80+ | "label": "תקרת השלמת הכנסה — זוג + ילד אחד, גיל 80+", |
| [313](../senior_rights/data/nii-constants.json#L313) | תקרת השלמת הכנסה — זוג + 2 ילדים, גיל 80+ | "label": "תקרת השלמת הכנסה — זוג + 2 ילדים, גיל 80+", |
| [320](../senior_rights/data/nii-constants.json#L320) | הסכום הקובע להשלמת הכנסה — אלמן/ה ללא ילדים עד גיל פרישה | "label": "הסכום הקובע להשלמת הכנסה — אלמן/ה ללא ילדים עד גיל פרישה", |
| [539](../senior_rights/data/nii-constants.json#L539) | השלמת הכנסה — ימי שהייה בחו\ | "label": "השלמת הכנסה — ימי שהייה בחו\"ל מקסימליים בשנה קלנדרית מבלי לאבד זכאות", |
| [546](../senior_rights/data/nii-constants.json#L546) | השלמת הכנסה — מספר יציאות מקסימלי לחו\ | "label": "השלמת הכנסה — מספר יציאות מקסימלי לחו\"ל בשנה קלנדרית", |
| [553](../senior_rights/data/nii-constants.json#L553) | השלמת הכנסה — ימי שהייה בחו\ | "label": "השלמת הכנסה — ימי שהייה בחו\"ל הגוררים שלילה רטרואקטיבית על כל השנה (מ-101 יום ומעלה)", |
| [560](../senior_rights/data/nii-constants.json#L560) | השלמת הכנסה — שהייה מקסימלית בחו\ | "label": "השלמת הכנסה — שהייה מקסימלית בחו\"ל לצורך טיפול רפואי (חודשים)", |
| [567](../senior_rights/data/nii-constants.json#L567) | השלמת הכנסה — שהייה מקסימלית בחו\ | "label": "השלמת הכנסה — שהייה מקסימלית בחו\"ל לצורך אבל על קרוב משפחה מדרגה ראשונה (שבועות)", |
| [574](../senior_rights/data/nii-constants.json#L574) | השלמת הכנסה — שהייה מקסימלית לחאג' ראשון בחיים ללא פגיעה בגמלה (ימים) | "label": "השלמת הכנסה — שהייה מקסימלית לחאג' ראשון בחיים ללא פגיעה בגמלה (ימים)", |
| [588](../senior_rights/data/nii-constants.json#L588) | השלמת הכנסה — מספר ימים לדיווח על שינוי שעשוי להשפיע על הזכאות | "label": "השלמת הכנסה — מספר ימים לדיווח על שינוי שעשוי להשפיע על הזכאות", |
| [633](../senior_rights/data/nii-constants.json#L633) | ניכוי ביטוח בריאות מקצבה — עם השלמת הכנסה | "label": "ניכוי ביטוח בריאות מקצבה — עם השלמת הכנסה", |
| [783](../senior_rights/data/nii-constants.json#L783) | שווי רכב השולל זכאות להשלמת הכנסה (תקרה מורחבת) | "label": "שווי רכב השולל זכאות להשלמת הכנסה (תקרה מורחבת)", |
| [790](../senior_rights/data/nii-constants.json#L790) | שווי רכב בסיסי לשלילת זכאות להשלמת הכנסה | "label": "שווי רכב בסיסי לשלילת זכאות להשלמת הכנסה", |
| [811](../senior_rights/data/nii-constants.json#L811) | מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה (25% מהשכר הממוצע) | "label": "מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה (25% מהשכר הממוצע)", |
| [818](../senior_rights/data/nii-constants.json#L818) | מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה (17% מהשכר הממוצע) | "label": "מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה (17% מהשכר הממוצע)", |
| [825](../senior_rights/data/nii-constants.json#L825) | שיעור חישוב שווי הרכב להפחתה מהשלמת הכנסה (3%) | "label": "שיעור חישוב שווי הרכב להפחתה מהשלמת הכנסה (3%)", |
| [863](../senior_rights/data/nii-constants.json#L863) | דמי כיס למאושפזים — עם השלמת הכנסה (20% מקצבת יחיד) | "label": "דמי כיס למאושפזים — עם השלמת הכנסה (20% מקצבת יחיד)", |
| [870](../senior_rights/data/nii-constants.json#L870) | דמי כיס למאושפזים — ללא השלמת הכנסה (36% מקצבה בסיסית) | "label": "דמי כיס למאושפזים — ללא השלמת הכנסה (36% מקצבה בסיסית)", |
| [878](../senior_rights/data/nii-constants.json#L878) | מענק חימום שנתי לאזרחים ותיקים עם השלמת הכנסה | "label": "מענק חימום שנתי לאזרחים ותיקים עם השלמת הכנסה", |

#### `senior_rights/data/senior-citizens-rights-2026-data.js` (14)

| שורה | הקשר | קטע |
|---|---|---|
| [226](../senior_rights/data/senior-citizens-rights-2026-data.js#L226) | מסמכים נדרשים לתביעה | מסמכים להשלמת הכנסה |
| [227](../senior_rights/data/senior-citizens-rights-2026-data.js#L227) | מסמכים להשלמת הכנסה | תוספת השלמת הכנסה ניתנת למי שאין להם הכנסות נוספות מלבד הקצבה, או שהכנסתם נמוכה מסכום מסוים. יש למלא טופס ת… |
| [233](../senior_rights/data/senior-citizens-rights-2026-data.js#L233) | מסמכים להשלמת הכנסה | ניתן להגיש את תביעת השלמת ההכנסה יחד עם תביעת קצבת אזרח ותיק, או בכל שלב מאוחר יותר כשההכנסה יורדת מתחת לסף הזכאות. גם כאן… |
| [235](../senior_rights/data/senior-citizens-rights-2026-data.js#L235) | מסמכים להשלמת הכנסה | 💡 טיפ: ניתן להעלות את כל המסמכים הנ"ל - הן לתביעה הראשית והן לתביעת השלמת ההכנסה - דרך שירות שליחת המסמכים באתר האישי, במקום פקס או דואר, גם לאחר הגשת התביעה עצמה, כדי לא… |
| [286](../senior_rights/data/senior-citizens-rights-2026-data.js#L286) | בדיקת זכאות אישית באתר | title: "גמלת השלמת הכנסה", |
| [292](../senior_rights/data/senior-citizens-rights-2026-data.js#L292) | בדיקת זכאות אישית באתר | חוברת זו מרכזת את המידע העדכני ביותר (נכון לשנת 2026) בנושא תוספת השלמת הכנסה לקצבת אזרח ותיק. התוספת נועדה להבטיח הכנסה מינימלית לקיום בכבוד עבור מי שקצבת הזקנה שלו ו… |
| [297](../senior_rights/data/senior-citizens-rights-2026-data.js#L297) | 1. תנאי זכאות בסיסיים | כדי להיות זכאי להשלמת הכנסה, על המבקש לעמוד בארבעה תנאים מצטברים: |
| [303](../senior_rights/data/senior-citizens-rights-2026-data.js#L303) | 1. תנאי זכאות בסיסיים | הערה: הכנסות או נכסים מעל התקרה, יתכן ויאפשרו קבלת השלמת הכנסה חלקית. |
| [309](../senior_rights/data/senior-citizens-rights-2026-data.js#L309) | א. שני בני הזוג זכאים לקצבת אזרח ותיק | כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה. |
| [320](../senior_rights/data/senior-citizens-rights-2026-data.js#L320) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | השלמת הכנסה: הזכאות תחושב לפי תעריף של זוג . |
| [323](../senior_rights/data/senior-citizens-rights-2026-data.js#L323) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | 3. סכומי הקצבה (קצבת אזרח ותיק + השלמת הכנסה) |
| [411](../senior_rights/data/senior-citizens-rights-2026-data.js#L411) | 8. הטבות נלוות לזכאים | קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות: |
| [607](../senior_rights/data/senior-citizens-rights-2026-data.js#L607) | שירותי בריאות | פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה) |
| [637](../senior_rights/data/senior-citizens-rights-2026-data.js#L637) | מוקדים ייעודיים | מוקד השלמת הכנסה: *6050 שלוחה 4 |

#### `senior_rights/data/senior_rights_full_data.js` (33)

| שורה | הקשר | קטע |
|---|---|---|
| [445](../senior_rights/data/senior_rights_full_data.js#L445) | דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה | // 2. גמלת השלמת הכנסה |
| [454](../senior_rights/data/senior_rights_full_data.js#L454) | דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה | השלמת הכנסה ניתנת למי שהכנסותיו נמוכות ומיועדת להבטיח רמת חיים מינימלית — הן למקבלי קצבת זיקנה והן למ… |
| [455](../senior_rights/data/senior_rights_full_data.js#L455) | דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה | 🏛️ השלמת הכנסה לקצבת זיקנה — כל זכות |
| [456](../senior_rights/data/senior_rights_full_data.js#L456) | דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה | 🏛️ השלמת הכנסה לגמלת שאירים — כל זכות |
| [467](../senior_rights/data/senior_rights_full_data.js#L467) | א. קצבת זיקנה (אזרח ותיק) | ⚠️ הכנסות או נכסים מעל התקרה עשויים לאפשר השלמת הכנסה חלקית. |
| [478](../senior_rights/data/senior_rights_full_data.js#L478) | ב. גמלת שאירים | ⚠️ הכנסות או נכסים מעל התקרה עשויים לאפשר השלמת הכנסה חלקית. |
| [483](../senior_rights/data/senior_rights_full_data.js#L483) | א. שני בני הזוג זכאים לקצבת אזרח ותיק | כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה. |
| [494](../senior_rights/data/senior_rights_full_data.js#L494) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | השלמת הכנסה: הזכאות תחושב לפי תעריף של זוג . |
| [499](../senior_rights/data/senior_rights_full_data.js#L499) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | השלמת הכנסה לגמלת שאירים מחושבת תמיד לפי מדרג יחיד/ה בלבד. אין תקרה מיוחדת לזוג בגמלת שאירים — גם כשי… |
| [503](../senior_rights/data/senior_rights_full_data.js#L503) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026 |
| [504](../senior_rights/data/senior_rights_full_data.js#L504) | סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026 | הסכומים להלן הם התקרות לקצבת זיקנה + השלמת ההכנסה (הקצבה הבסיסית + תוספת מקסימלית): |
| [555](../senior_rights/data/senior_rights_full_data.js#L555) | סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026 | סכומים מירביים גמלת שאירים + השלמת הכנסה 2026 |
| [610](../senior_rights/data/senior_rights_full_data.js#L610) | תקרות הכנסה וחישוב זכאות | 🧮 מחשבון זכאות להשלמת הכנסה |
| [655](../senior_rights/data/senior_rights_full_data.js#L655) | 🧮 מחשבון זכאות להשלמת הכנסה | יש סעיפי הכנסות נוספים שמשפיעים על השלמת הכנסה (הכנסה רעיונית מנכסים, שכר דירה ועוד). |
| [672](../senior_rights/data/senior_rights_full_data.js#L672) | בעלות על רכב | 🚗 מחשבון להשפעת רכב על זכאות השלמת הכנסה |
| [674](../senior_rights/data/senior_rights_full_data.js#L674) | בעלות על רכב | דוגמאות לחישוב השלמת הכנסה |
| [708](../senior_rights/data/senior_rights_full_data.js#L708) | דוגמה 3 — גמלת שאירים (אלמנה, גיל 55, ילד אחד): | השלמת הכנסה משוערת: ₪${fmt(v('income_supplement_single_1child_under70') - v('survivors_widow_over50')… |
| [713](../senior_rights/data/senior_rights_full_data.js#L713) | דוגמה 3 — גמלת שאירים (אלמנה, גיל 55, ילד אחד): | ✈️ השלמת הכנסה ויציאה לחו"ל |
| [760](../senior_rights/data/senior_rights_full_data.js#L760) | 📊 סיכום תקופות שהייה מותרת בחו"ל | השלמת הכנסה |
| [803](../senior_rights/data/senior_rights_full_data.js#L803) | 📊 סיכום תקופות שהייה מותרת בחו"ל | 🏥 מקרים מיוחדים שמאפשרים המשך קבלת השלמת הכנסה |
| [828](../senior_rights/data/senior_rights_full_data.js#L828) | 👫 בני זוג | 🏠 הגדרת "תושב" לצורך השלמת הכנסה |
| [911](../senior_rights/data/senior_rights_full_data.js#L911) | 📋 מה חייבים לדווח | כל יציאה — ראו תת-אקורדיון "השלמת הכנסה ויציאה לחו"ל". |
| [964](../senior_rights/data/senior_rights_full_data.js#L964) | 📩 קיבלתם דרישת החזר מהביטוח הלאומי? | 🎁 הטבות נלוות להשלמת הכנסה |
| [965](../senior_rights/data/senior_rights_full_data.js#L965) | 🎁 הטבות נלוות להשלמת הכנסה | מקבלי השלמת הכנסה זכאים להטבות נוספות: |
| [1419](../senior_rights/data/senior_rights_full_data.js#L1419) | ב.4 — תוספת דמי מחיה ליתומים | ב.5 — תוספת השלמת הכנסה |
| [1582](../senior_rights/data/senior_rights_full_data.js#L1582) | א. קצבאות המזכות במענק | הבטחת הכנסה / השלמת הכנסה |
| [1620](../senior_rights/data/senior_rights_full_data.js#L1620) | א. פטירת שני בני זוג בהפרש זמן קצר | ב. קצבת זיקנה עם השלמת הכנסה |
| [1621](../senior_rights/data/senior_rights_full_data.js#L1621) | ב. קצבת זיקנה עם השלמת הכנסה | מקבל קצבת זיקנה עם השלמת הכנסה שבן/בת זוגו נפטר/ה, זכאי גם הוא/היא למענק פטירה. |
| [1913](../senior_rights/data/senior_rights_full_data.js#L1913) | 8.5 שירותי בריאות | פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה). |
| [1947](../senior_rights/data/senior_rights_full_data.js#L1947) | 8.6 שירותים חברתיים | השלמת הכנסה יחיד עד ₪${NII.income_supplement_single_under70.value.toLocaleString('he-IL')} / זוג עד ₪… |
| [1957](../senior_rights/data/senior_rights_full_data.js#L1957) | כללי מפתח | ✅ קצבת אזרח ותיק נספרת כהכנסה במבחן להשלמת הכנסה. |
| [1960](../senior_rights/data/senior_rights_full_data.js#L1960) | כללי מפתח | ✅ מקבלי השלמת הכנסה זכאים להטבות נוספות רבות. |
| [1984](../senior_rights/data/senior_rights_full_data.js#L1984) | מוקדים ייעודיים | מוקד השלמת הכנסה: *6050 שלוחה 4 |

#### `senior_rights/questionnaire-engine.js` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [898](../senior_rights/questionnaire-engine.js#L898) | 📊 פירוט החישוב | שימו לב: הכנסה זו מתווספת להכנסותיכם האחרות בבדיקת הזכאות להשלמת הכנסה. |
| [1279](../senior_rights/questionnaire-engine.js#L1279) |  | ✓ ייתכן שאת/ה זכאי/ת להשלמת הכנסה |
| [1286](../senior_rights/questionnaire-engine.js#L1286) | ✓ ייתכן שאת/ה זכאי/ת להשלמת הכנסה | ✗ לא זכאי/ת להשלמת הכנסה |

#### `senior_rights/questionnaires/child-definition.json` (4)

| שורה | הקשר | קטע |
|---|---|---|
| [3](../senior_rights/questionnaires/child-definition.json#L3) |  | "title": "כלי להגדרת ילד להשלמת הכנסה אזרח ותיק", |
| [4](../senior_rights/questionnaires/child-definition.json#L4) | כלי להגדרת ילד להשלמת הכנסה אזרח ותיק | "description": "שאלון לבדיקה האם ילד עונה להגדרת 'ילד' לצורך השלמת הכנסה בקצבת אזרח ותיק", |
| [91](../senior_rights/questionnaires/child-definition.json#L91) | עונה להגדרת ילד | "text": "חזור לשאלון בדיקת זכאות להשלמת הכנסה" |
| [100](../senior_rights/questionnaires/child-definition.json#L100) | לא עונה להגדרת ילד | "text": "חזור לשאלון בדיקת זכאות להשלמת הכנסה" |

#### `senior_rights/questionnaires/imputed-income-calculator.json` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [4](../senior_rights/questionnaires/imputed-income-calculator.json#L4) | חישוב הכנסה רעיונית מנכסים | "description": "חישוב הכנסה רעיונית מנכסים לצורך בדיקת זכאות להשלמת הכנסה (01.2026)", |
| [8](../senior_rights/questionnaires/imputed-income-calculator.json#L8) | מהי הכנסה רעיונית מנכסים? | "content": " בבדיקת הזכאות לתוספת השלמת הכנסה, הביטוח הלאומי מחשב הכנסה רעיונית מנכסים שבבעלותך - גם אם אינך מקבל מהם הכנסה בפועל. אילו… |

#### `senior_rights/questionnaires/income-supplement-eligibility.json` (9)

| שורה | הקשר | קטע |
|---|---|---|
| [3](../senior_rights/questionnaires/income-supplement-eligibility.json#L3) |  | "title": "בדיקת זכאות להשלמת הכנסה", |
| [4](../senior_rights/questionnaires/income-supplement-eligibility.json#L4) | בדיקת זכאות להשלמת הכנסה | "description": "בדיקת זכאות לקצבת השלמת הכנסה לאזרחים ותיקים עם חישוב משוער של סכום ההשלמה (01.2026)", |
| [7](../senior_rights/questionnaires/income-supplement-eligibility.json#L7) | בדיקת זכאות להשלמת הכנסה | "title": "בדיקת זכאות להשלמת הכנסה", |
| [8](../senior_rights/questionnaires/income-supplement-eligibility.json#L8) | בדיקת זכאות להשלמת הכנסה | "content": " שאלון זה בודק אם אתה זכאי/אי להשלמת הכנסה (קצבה משלימה לקצבת זיקנה). השלמת הכנסה היא קצבה שמשלם הביטוח הלאומי כאשר סך כל ההכנסות של… |
| [25](../senior_rights/questionnaires/income-supplement-eligibility.json#L25) | כן | "description": "חברות בקיבוץ או במושב שיתופי מונעת זכאות לתוספת השלמת הכנסה.", |
| [172](../senior_rights/questionnaires/income-supplement-eligibility.json#L172) | תוצאות בדיקת הזכאות | "title": "לא זכאי/ת להשלמת הכנסה", |
| [173](../senior_rights/questionnaires/income-supplement-eligibility.json#L173) | לא זכאי/ת להשלמת הכנסה | "message": "השלמת הכנסה משולמת רק לתושבי ישראל. אם חזרת להתגורר בישראל, יש לעדכן את הכתובת בביטוח הלאומי." |
| [177](../senior_rights/questionnaires/income-supplement-eligibility.json#L177) | לא זכאי/ת להשלמת הכנסה | "title": "יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה", |
| [178](../senior_rights/questionnaires/income-supplement-eligibility.json#L178) | יתכן ולחברים בקיבוץ/מושב שיתופי זכאות להשלמת הכנסה | "message": "יתכן ולחבר קיבוץ/מושב שיתופי יש זכאות להשלמת הכנסה בתנאים מסוימים. לפרטים נוספים, אנא צרו קשר עם סניף הביטוח הלאומי או פנו למוקד הטלפוני *60… |

### ג. תיעוד, ארכיון וקבצי עבודה (לא מוצגים באתר)

| קובץ | מופעים | סוג |
|---|---|---|
| [benefits_january_2025.txt](../benefits_january_2025.txt) | 2 |  |
| [files/branch_comparison_report.md](../files/branch_comparison_report.md) | 29 |  |
| [files/data_mapping.md](../files/data_mapping.md) | 33 |  |
| [senior_rights/data/search-widget_temp.js](../senior_rights/data/search-widget_temp.js) | 16 |  |
| [senior_rights/sampels.html](../senior_rights/sampels.html) | 2 |  |
| [senior_rights/sampels_questions.json](../senior_rights/sampels_questions.json) | 20 |  |
| [support_files/files/Income_Supplement_Eligibility_Assessment_Questionnaire.md](../support_files/files/Income_Supplement_Eligibility_Assessment_Questionnaire.md) | 2 |  |
| [support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md) | 7 |  |
| [support_files/files/NII_Benefits_Eligibility_Criteria.md](../support_files/files/NII_Benefits_Eligibility_Criteria.md) | 3 |  |
| [support_files/files/Senior_Pensions_Survivors_01_2026.md](../support_files/files/Senior_Pensions_Survivors_01_2026.md) | 3 |  |
| [support_files/files/gimlat_zikna_meyuchedet.md](../support_files/files/gimlat_zikna_meyuchedet.md) | 9 |  |
| [support_files/files/hamburger_accordion_improvment_documentation.md](../support_files/files/hamburger_accordion_improvment_documentation.md) | 23 |  |
| [support_files/files/international_treaties.md](../support_files/files/international_treaties.md) | 6 |  |
| [support_files/files/merged-senior-rights-2026.md](../support_files/files/merged-senior-rights-2026.md) | 18 |  |
| [support_files/files/nechut_vs_shairim_2026.md](../support_files/files/nechut_vs_shairim_2026.md) | 3 |  |
| [support_files/files/rights-data-js-converted.md](../support_files/files/rights-data-js-converted.md) | 14 |  |
| [support_files/files/senior-citizens-rights-2026-data-js-converted.md](../support_files/files/senior-citizens-rights-2026-data-js-converted.md) | 14 |  |
| [support_files/files/survivors_benefits_comprehensive_guide_2026.md](../support_files/files/survivors_benefits_comprehensive_guide_2026.md) | 5 |  |
| [support_files/files/השלמת הכנסה חובת דיווח.md](../support_files/files/השלמת הכנסה חובת דיווח.md) | 5 |  |
| [support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md](../support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md) | 4 |  |
| [support_files/files/כלי אבחון - 2.md](../support_files/files/כלי אבחון - 2.md) | 2 |  |
| [support_files/files/כלי_אבחון_ראשוני.md](../support_files/files/כלי_אבחון_ראשוני.md) | 8 |  |
| [support_files/files/מחשבון קצבת אזרח ותיק חלקית/classify_pension_spec.md](../support_files/files/מחשבון קצבת אזרח ותיק חלקית/classify_pension_spec.md) | 1 |  |
| [support_files/files/מענק_פטירה_סיכום_2026.md](../support_files/files/מענק_פטירה_סיכום_2026.md) | 3 |  |
| [support_files/files/קצבת שאירים-מדריך מלא.md](../support_files/files/קצבת שאירים-מדריך מלא.md) | 2 |  |
| [support_files/json/btl_benefit_combinations_results.json](../support_files/json/btl_benefit_combinations_results.json) | 18 |  |
| [support_files/moved_files.md](../support_files/moved_files.md) | 2 |  |
| [support_files/senior_rights/CHANGELOG.md](../support_files/senior_rights/CHANGELOG.md) | 2 |  |
| [support_files/senior_rights/TESTING_CHECKLIST.md](../support_files/senior_rights/TESTING_CHECKLIST.md) | 1 |  |
| [support_files/senior_rights/data/data_012026_comparison.csv](../support_files/senior_rights/data/data_012026_comparison.csv) | 18 |  |
| [support_files/senior_rights/data/dynamic-values-report.txt](../support_files/senior_rights/data/dynamic-values-report.txt) | 2 |  |
| [support_files/senior_rights/data/dynamic-values.json](../support_files/senior_rights/data/dynamic-values.json) | 6 |  |
| [support_files/senior_rights/data/pension-amounts-2025.json](../support_files/senior_rights/data/pension-amounts-2025.json) | 6 |  |
| [support_files/senior_rights/data/rights-data.json](../support_files/senior_rights/data/rights-data.json) | 3 |  |
| [support_files/senior_rights/intake_questionnaire.html](../support_files/senior_rights/intake_questionnaire.html) | 4 |  |
| [support_files/senior_rights/intake_questions.json](../support_files/senior_rights/intake_questions.json) | 2 |  |
| [support_files/senior_rights/intake_questions_export.txt](../support_files/senior_rights/intake_questions_export.txt) | 2 |  |
| [support_files/senior_rights/scripts/generate_counseling_form_pdf.py](../support_files/senior_rights/scripts/generate_counseling_form_pdf.py) | 2 |  |
| [support_files/senior_rights/scripts/update-data.js](../support_files/senior_rights/scripts/update-data.js) | 1 |  |

#### `benefits_january_2025.txt` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [22](../benefits_january_2025.txt#L22) |  | תוספת השלמת הכנסה: |
| [24](../benefits_january_2025.txt#L24) |  | זכאות לתוספת השלמת הכנסה עבור מי שהכנסתו לא עולה על: |

#### `files/branch_comparison_report.md` (29)

| שורה | הקשר | קטע |
|---|---|---|
| [31](../files/branch_comparison_report.md#L31) | ⚠️ ערכים שונים — דורשים בדיקה | ¦ NII-026 ¦ `income_supplement_single_under70` ¦ תקרת השלמת הכנסה — יחיד עד 70 ¦ 4,273 ¦ 4,375 ¦ +102 ¦ |
| [32](../files/branch_comparison_report.md#L32) | ⚠️ ערכים שונים — דורשים בדיקה | ¦ NII-027 ¦ `income_supplement_couple_under70` ¦ תקרת השלמת הכנסה — זוג עד 70 ¦ 6,751 ¦ 6,912 ¦ +161 ¦ |
| [76](../files/branch_comparison_report.md#L76) | ✅ ערכים זהים | ¦ NII-026 ¦ `income_supplement_single_under70` ¦ תקרת השלמת הכנסה — יחיד עד 70 ¦ 4,375 ¦ |
| [77](../files/branch_comparison_report.md#L77) | ✅ ערכים זהים | ¦ NII-027 ¦ `income_supplement_couple_under70` ¦ תקרת השלמת הכנסה — זוג עד 70 ¦ 6,912 ¦ |
| [78](../files/branch_comparison_report.md#L78) | ✅ ערכים זהים | ¦ NII-028 ¦ `income_supplement_couple_1child_under70` ¦ תקרת השלמת הכנסה — זוג + ילד אחד עד 70 ¦ 8,035 ¦ |
| [79](../files/branch_comparison_report.md#L79) | ✅ ערכים זהים | ¦ NII-029 ¦ `income_supplement_couple_2children_under70` ¦ תקרת השלמת הכנסה — זוג + 2 ילדים עד 70 ¦ 9,156 ¦ |
| [80](../files/branch_comparison_report.md#L80) | ✅ ערכים זהים | ¦ NII-030 ¦ `income_supplement_single_1child_under70` ¦ תקרת השלמת הכנסה — יחיד + ילד אחד עד 70 ¦ 7,305 ¦ |
| [81](../files/branch_comparison_report.md#L81) | ✅ ערכים זהים | ¦ NII-031 ¦ `income_supplement_single_2children_under70` ¦ תקרת השלמת הכנסה — יחיד + 2 ילדים עד 70 ¦ 8,426 ¦ |
| [82](../files/branch_comparison_report.md#L82) | ✅ ערכים זהים | ¦ NII-032 ¦ `income_supplement_single_70_80` ¦ תקרת השלמת הכנסה — יחיד בגיל 70–80 ¦ 4,418 ¦ |
| [83](../files/branch_comparison_report.md#L83) | ✅ ערכים זהים | ¦ NII-033 ¦ `income_supplement_couple_70_80` ¦ תקרת השלמת הכנסה — זוג בגיל 70–80 ¦ 6,981 ¦ |
| [84](../files/branch_comparison_report.md#L84) | ✅ ערכים זהים | ¦ NII-034 ¦ `income_supplement_single_1child_70_80` ¦ תקרת השלמת הכנסה — יחיד + ילד אחד, 70–80 ¦ 7,374 ¦ |
| [85](../files/branch_comparison_report.md#L85) | ✅ ערכים זהים | ¦ NII-035 ¦ `income_supplement_single_2children_70_80` ¦ תקרת השלמת הכנסה — יחיד + 2 ילדים, 70–80 ¦ 8,496 ¦ |
| [86](../files/branch_comparison_report.md#L86) | ✅ ערכים זהים | ¦ NII-036 ¦ `income_supplement_couple_1child_70_80` ¦ תקרת השלמת הכנסה — זוג + ילד אחד, 70–80 ¦ 8,102 ¦ |
| [87](../files/branch_comparison_report.md#L87) | ✅ ערכים זהים | ¦ NII-037 ¦ `income_supplement_couple_2children_70_80` ¦ תקרת השלמת הכנסה — זוג + 2 ילדים, 70–80 ¦ 9,226 ¦ |
| [88](../files/branch_comparison_report.md#L88) | ✅ ערכים זהים | ¦ NII-038 ¦ `income_supplement_single_over80` ¦ תקרת השלמת הכנסה — יחיד מגיל 80+ ¦ 4,460 ¦ |
| [89](../files/branch_comparison_report.md#L89) | ✅ ערכים זהים | ¦ NII-039 ¦ `income_supplement_couple_over80` ¦ תקרת השלמת הכנסה — זוג מגיל 80+ ¦ 7,048 ¦ |
| [90](../files/branch_comparison_report.md#L90) | ✅ ערכים זהים | ¦ NII-040 ¦ `income_supplement_single_1child_over80` ¦ תקרת השלמת הכנסה — יחיד + ילד אחד, 80+ ¦ 7,442 ¦ |
| [91](../files/branch_comparison_report.md#L91) | ✅ ערכים זהים | ¦ NII-041 ¦ `income_supplement_single_2children_over80` ¦ תקרת השלמת הכנסה — יחיד + 2 ילדים, 80+ ¦ 8,563 ¦ |
| [92](../files/branch_comparison_report.md#L92) | ✅ ערכים זהים | ¦ NII-042 ¦ `income_supplement_couple_1child_over80` ¦ תקרת השלמת הכנסה — זוג + ילד אחד, 80+ ¦ 8,171 ¦ |
| [93](../files/branch_comparison_report.md#L93) | ✅ ערכים זהים | ¦ NII-043 ¦ `income_supplement_couple_2children_over80` ¦ תקרת השלמת הכנסה — זוג + 2 ילדים, 80+ ¦ 9,292 ¦ |
| [127](../files/branch_comparison_report.md#L127) | ✅ ערכים זהים | ¦ NII-054 ¦ `health_deduction_with_supplement` ¦ ניכוי ביטוח בריאות — עם השלמת הכנסה ¦ 123 ¦ |
| [128](../files/branch_comparison_report.md#L128) | ✅ ערכים זהים | ¦ NII-055 ¦ `health_deduction_without_supplement` ¦ ניכוי ביטוח בריאות — ללא השלמת הכנסה (יחיד) ¦ 237 ¦ |
| [129](../files/branch_comparison_report.md#L129) | ✅ ערכים זהים | ¦ NII-056 ¦ `health_deduction_couple_without_supplement` ¦ ניכוי ביטוח בריאות — זוג ללא השלמת הכנסה ¦ 340 ¦ |
| [153](../files/branch_comparison_report.md#L153) | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-044 ¦ `income_supplement_widow_no_children` ¦ הסכום הקובע להשלמת הכנסה — אלמן/ה ללא ילדים ¦ 5,232 ¦ |
| [176](../files/branch_comparison_report.md#L176) | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-080 ¦ `housing_allowance_worker_before_retirement` ¦ מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה ¦ 3,442 ¦ |
| [177](../files/branch_comparison_report.md#L177) | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-081 ¦ `housing_allowance_worker_after_retirement` ¦ מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה ¦ 2,341 ¦ |
| [179](../files/branch_comparison_report.md#L179) | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-086 ¦ `pocket_money_with_supplement` ¦ דמי כיס למאושפזים — עם השלמת הכנסה ¦ 607 ¦ |
| [180](../files/branch_comparison_report.md#L180) | 🆕 ערכים חדשים (לא קיימים ב-main) | ¦ NII-087 ¦ `pocket_money_without_supplement` ¦ דמי כיס למאושפזים — ללא השלמת הכנסה ¦ 662 ¦ |
| [235](../files/branch_comparison_report.md#L235) | 1. `BTL/senior_rights/data/rights-data.js` — נמצא ✅ | - **ממצא:** הערכים העיקריים (קצבאות זקנה, השלמת הכנסה, שר"מ, סיעוד) תואמים ל-nii-constants.json |

#### `files/data_mapping.md` (33)

| שורה | הקשר | קטע |
|---|---|---|
| [12](../files/data_mapping.md#L12) | רשימת קבצים שנסרקו | - `BTL/senior_rights/questionnaires/income-supplement-eligibility.json` — שאלון השלמת הכנסה 2026 |
| [14](../files/data_mapping.md#L14) | רשימת קבצים שנסרקו | - `BTL/senior_rights/questionnaires/vehicle-income-supplement.json` — שאלון רכב+השלמת הכנסה 2026 |
| [450](../files/data_mapping.md#L450) | ו. | ### ו. השלמת הכנסה — סכומים מרביים לפי קבוצות גיל |
| [452](../files/data_mapping.md#L452) | ו. השלמת הכנסה — סכומים מרביים לפי קבוצות גיל | **הסכומים הם הקצבה הכוללת המובטחת (קצבת זקנה + השלמת הכנסה)** |
| [464](../files/data_mapping.md#L464) | גיל פרישה עד 70 — יחיד | ¦ תיאור ¦ תקרת השלמת הכנסה — יחיד עד גיל 70 ¦ |
| [480](../files/data_mapping.md#L480) | גיל פרישה עד 70 — זוג | ¦ תיאור ¦ תקרת השלמת הכנסה — זוג עד גיל 70 ¦ |
| [496](../files/data_mapping.md#L496) | גיל פרישה עד 70 — זוג + ילד | ¦ תיאור ¦ תקרת השלמת הכנסה — זוג + ילד אחד עד גיל 70 ¦ |
| [513](../files/data_mapping.md#L513) | גיל פרישה עד 70 — זוג + 2 ילדים | ¦ תיאור ¦ תקרת השלמת הכנסה — זוג + 2 ילדים עד גיל 70 ¦ |
| [529](../files/data_mapping.md#L529) | גיל פרישה עד 70 — יחיד + ילד | ¦ תיאור ¦ תקרת השלמת הכנסה — יחיד + ילד אחד עד גיל 70 ¦ |
| [545](../files/data_mapping.md#L545) | גיל פרישה עד 70 — יחיד + 2 ילדים (תוספת החיה) | ¦ תיאור ¦ תקרת השלמת הכנסה — יחיד + 2 ילדים עד גיל 70 ¦ |
| [561](../files/data_mapping.md#L561) | גיל 70–80 — יחיד | ¦ תיאור ¦ תקרת השלמת הכנסה — יחיד בגיל 70–80 ¦ |
| [577](../files/data_mapping.md#L577) | גיל 70–80 — זוג | ¦ תיאור ¦ תקרת השלמת הכנסה — זוג בגיל 70–80 ¦ |
| [606](../files/data_mapping.md#L606) | גיל 80+ — יחיד | ¦ תיאור ¦ תקרת השלמת הכנסה — יחיד מגיל 80 ומעלה ¦ |
| [622](../files/data_mapping.md#L622) | גיל 80+ — זוג | ¦ תיאור ¦ תקרת השלמת הכנסה — זוג מגיל 80 ומעלה ¦ |
| [651](../files/data_mapping.md#L651) | הסכום הקובע לאלמן/ה ללא ילדים עד גיל פרישה | ¦ תיאור ¦ הסכום הקובע לעניין השלמת הכנסה לאלמן/ה ללא ילדים עד גיל פרישה ¦ |
| [802](../files/data_mapping.md#L802) | ניכוי ביטוח בריאות — יחיד עם | #### ניכוי ביטוח בריאות — יחיד עם השלמת הכנסה |
| [812](../files/data_mapping.md#L812) | ניכוי ביטוח בריאות — יחיד עם השלמת הכנסה | ¦ תיאור ¦ ניכוי ביטוח בריאות מקצבה — אזרח ותיק/שאירים עם השלמת הכנסה ¦ |
| [818](../files/data_mapping.md#L818) | ניכוי ביטוח בריאות — יחיד ללא | #### ניכוי ביטוח בריאות — יחיד ללא השלמת הכנסה |
| [828](../files/data_mapping.md#L828) | ניכוי ביטוח בריאות — יחיד ללא השלמת הכנסה | ¦ תיאור ¦ ניכוי ביטוח בריאות — אזרח ותיק/שאירים ללא השלמת הכנסה ¦ |
| [834](../files/data_mapping.md#L834) | ניכוי ביטוח בריאות — זוג ללא | #### ניכוי ביטוח בריאות — זוג ללא השלמת הכנסה |
| [844](../files/data_mapping.md#L844) | ניכוי ביטוח בריאות — זוג ללא השלמת הכנסה | ¦ תיאור ¦ ניכוי ביטוח בריאות — זוג ללא השלמת הכנסה (תוספת החיה) ¦ |
| [850](../files/data_mapping.md#L850) | י. הכנסות מותרות לצורך | ### י. הכנסות מותרות לצורך השלמת הכנסה |
| [1016](../files/data_mapping.md#L1016) | יב. שווי רכב ומדורים לצורך | ### יב. שווי רכב ומדורים לצורך השלמת הכנסה |
| [1028](../files/data_mapping.md#L1028) | שווי רכב שולל זכאות (תקרה) | ¦ תיאור ¦ שווי רכב מעל סכום זה שולל זכאות להשלמת הכנסה (אלא אם מתקיימות חריגות) ¦ |
| [1076](../files/data_mapping.md#L1076) | מדור עובד לפני גיל פרישה (25%) | ¦ תיאור ¦ מדור לצורך השלמת הכנסה — עובד לפני גיל פרישה (25% מהשכר הממוצע) ¦ |
| [1092](../files/data_mapping.md#L1092) | מדור עובד מעל גיל פרישה (17%) | ¦ תיאור ¦ מדור לצורך השלמת הכנסה — עובד מעל גיל פרישה (17% מהשכר הממוצע) ¦ |
| [1104](../files/data_mapping.md#L1104) | תקרת שווי רכב בסיסית לשלילת זכאות | ¦ תיאור ¦ שווי רכב מתחתיו — אינו שולל זכאות להשלמת הכנסה ¦ |
| [1176](../files/data_mapping.md#L1176) | דמי כיס כולל | #### דמי כיס כולל השלמת הכנסה — 20% מקצבת יחיד מלאה |
| [1186](../files/data_mapping.md#L1186) | דמי כיס כולל השלמת הכנסה — 20% מקצבת יחיד מלאה | ¦ תיאור ¦ דמי כיס למאושפזים (כולל השלמת הכנסה), 20% מקצבת יחיד מלאה ¦ |
| [1192](../files/data_mapping.md#L1192) | דמי כיס ללא | #### דמי כיס ללא השלמת הכנסה — 36% מקצבה בסיסית |
| [1202](../files/data_mapping.md#L1202) | דמי כיס ללא השלמת הכנסה — 36% מקצבה בסיסית | ¦ תיאור ¦ דמי כיס למאושפזים ללא השלמת הכנסה (בזקנה), 36% מקצבה בסיסית ¦ |
| [1216](../files/data_mapping.md#L1216) | טז. מענק חימום | ¦ תיאור ¦ מענק חימום שנתי לאזרחים ותיקים עם השלמת הכנסה (משולם באוקטובר) ¦ |
| [1857](../files/data_mapping.md#L1857) | שינויים בשאלון | ### שינויים בשאלון השלמת הכנסה (`income-supplement-eligibility.json`) |

#### `senior_rights/data/search-widget_temp.js` (16)

| שורה | הקשר | קטע |
|---|---|---|
| [65](../senior_rights/data/search-widget_temp.js#L65) |  | { term: 'השלמת הכנסה', links: [ |
| [66](../senior_rights/data/search-widget_temp.js#L66) |  | { label: 'מדריך מקיף זכויות ותיקים', ctx: 'גמלת השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' }, |
| [69](../senior_rights/data/search-widget_temp.js#L69) |  | { label: 'טבלאות סכומים והגדרות', ctx: 'השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' }, |
| [133](../senior_rights/data/search-widget_temp.js#L133) |  | { label: 'טבלאות סכומים והגדרות', ctx: 'השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' }, |
| [134](../senior_rights/data/search-widget_temp.js#L134) |  | { label: 'מדריך מקיף זכויות ותיקים', ctx: 'גמלת השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' }, |
| [270](../senior_rights/data/search-widget_temp.js#L270) |  | { label: 'מדריך מקיף זכויות ותיקים', ctx: 'גמלת השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' }, |
| [399](../senior_rights/data/search-widget_temp.js#L399) |  | { label: 'מדריך מקיף זכויות ותיקים', ctx: 'גמלת השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' }, |
| [407](../senior_rights/data/search-widget_temp.js#L407) |  | { term: 'תקרות השלמת הכנסה', links: [ |
| [409](../senior_rights/data/search-widget_temp.js#L409) |  | { label: 'מדריך מקיף זכויות ותיקים', ctx: 'גמלת השלמת הכנסה', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' }, |
| [598](../senior_rights/data/search-widget_temp.js#L598) |  | { term: 'שאלון זכאות להשלמת הכנסה', links: [ |
| [599](../senior_rights/data/search-widget_temp.js#L599) |  | { label: 'שאלון בדיקת זכאות להשלמת הכנסה', ctx: '', url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=income-supplement-elig… |
| [606](../senior_rights/data/search-widget_temp.js#L606) |  | { term: 'השלמת הכנסה עם רכב', links: [ |
| [607](../senior_rights/data/search-widget_temp.js#L607) |  | { label: 'שאלון זכאות להשלמת הכנסה עם רכב', ctx: 'בעלי רכב מעל תקרת רכב', url: SEARCH_BASE + 'senior_rights/questionnaire.ht… |
| [610](../senior_rights/data/search-widget_temp.js#L610) |  | { term: 'הגדרת ילד להשלמת הכנסה', links: [ |
| [611](../senior_rights/data/search-widget_temp.js#L611) |  | { label: 'שאלון הגדרת ילד לצורך השלמת הכנסה', ctx: 'קצבת אזרח ותיק', url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=child-de… |
| [810](../senior_rights/data/search-widget_temp.js#L810) |  | 'השלמת הכנסה': 'income_supplement', |

#### `senior_rights/sampels.html` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [10](../senior_rights/sampels.html#L10) |  | דוגמאות - קצבת זיקנה והשלמת הכנסה |
| [159](../senior_rights/sampels.html#L159) | 📚 דוגמאות חישוב | קצבת אזרח ותיק והשלמת הכנסה |

#### `senior_rights/sampels_questions.json` (20)

| שורה | הקשר | קטע |
|---|---|---|
| [286](../senior_rights/sampels_questions.json#L286) | דוגמה 3: בעל: 40 שנים, אישה: 8 שנים (ותק חלקי) | "questionText": "איך תוספת הותק משפיעה על השלמת הכנסה?", |
| [287](../senior_rights/sampels_questions.json#L287) | דוגמה 3: בעל: 40 שנים, אישה: 8 שנים (ותק חלקי) | "answer": "תוספת הותק נחשבת כחלק מקצבת אזרח ותיק ולכן משפיעה על חישוב השלמת ההכנסה.", |
| [289](../senior_rights/sampels_questions.json#L289) | דוגמה 3: בעל: 40 שנים, אישה: 8 שנים (ותק חלקי) | "השלמת הכנסה = הכנסה מינימלית - (קצבה + ותק + הכנסות אחרות)" |
| [291](../senior_rights/sampels_questions.json#L291) | דוגמה 3: בעל: 40 שנים, אישה: 8 שנים (ותק חלקי) | "additionalInfo": "סכומי קצבאות והשלמת הכנסה", |
| [304](../senior_rights/sampels_questions.json#L304) | דוגמה 1: יחיד עם 15 שנות ביטוח, ללא הכנסות נוספות | "השלמת הכנסה: 4,400 - 1,975 = 2,425 ₪" |
| [318](../senior_rights/sampels_questions.json#L318) | דוגמה 2: יחיד עם 35 שנות ביטוח, ללא הכנסות נוספות | "השלמת הכנסה: 4,400 - 2,693 = 1,707 ₪" |
| [323](../senior_rights/sampels_questions.json#L323) | דוגמה 2: יחיד עם 35 שנות ביטוח, ללא הכנסות נוספות | "conclusion": "מסקנה: ככל שיש יותר שנות ביטוח ותוספת ותק (גבוהה יותר), השלמת ההכנסה תהיה נמוכה יותר." |
| [524](../senior_rights/sampels_questions.json#L524) | דוגמה 3: אישה דחתה מ-62 ל-64, ותק חלקי (8 שנים) | "questionText": "איך ותק חלקי משפיע על תקרות ההכנסה להשלמת הכנסה בקצבת זקנה?", |
| [575](../senior_rights/sampels_questions.json#L575) | דוגמה 3: יחיד עם 7 שנים, שכר 14,000 ₪ | "questionText": "כמה מותר להרוויח מבלי לפגוע בהשלמת הכנסה?", |
| [576](../senior_rights/sampels_questions.json#L576) | דוגמה 3: יחיד עם 7 שנים, שכר 14,000 ₪ | "answer": "השלמת הכנסה רגישה הרבה יותר להכנסות מעבודה מאשר קצבת הזקנה.", |
| [578](../senior_rights/sampels_questions.json#L578) | דוגמה 3: יחיד עם 7 שנים, שכר 14,000 ₪ | "השלמת הכנסה = הכנסה מינימלית - (קצבה + שכר + הכנסות אחרות)" |
| [581](../senior_rights/sampels_questions.json#L581) | דוגמה 3: יחיד עם 7 שנים, שכר 14,000 ₪ | "סכומי הקצבה המירבית עם השלמת הכנסה:", |
| [592](../senior_rights/sampels_questions.json#L592) | דוגמה 3: יחיד עם 7 שנים, שכר 14,000 ₪ | "additionalInfo": "תנאי זכאות להשלמת הכנסה", |
| [604](../senior_rights/sampels_questions.json#L604) | דוגמה 1: יחיד בן 69 עם קצבה 2,000 ₪, פנסיה 1,500 ₪ | "השלמת הכנסה: 4,273 - 3,500 = 773 ₪" |
| [629](../senior_rights/sampels_questions.json#L629) | דוגמה 2: יחיד בן 72 עם קצבה 2,000 ₪, פנסיה 3,000 ₪ | "questionText": "מה הן הכנסות שנספרות במבחן ההכנסה להשלמת הכנסה בקצבת זקנה?", |
| [674](../senior_rights/sampels_questions.json#L674) | פרק 3: הכנסות שלא מעבודה | "answer": "כן, הכנסות משכירות דירה נספרות כהכנסה שלא מעבודה ומשפיעות על הזכאות לקצבה ולהשלמת הכנסה.", |
| [756](../senior_rights/sampels_questions.json#L756) | דוגמה 3: זוג, שכירות 10,000 ₪, בעל: 35 שנים, אישה: 8 שנים | "2. שווי החסכונות (להשלמת הכנסה):", |
| [761](../senior_rights/sampels_questions.json#L761) | דוגמה 3: זוג, שכירות 10,000 ₪, בעל: 35 שנים, אישה: 8 שנים | "additionalInfo": "נכסים והשלמת הכנסה", |
| [790](../senior_rights/sampels_questions.json#L790) | דוגמה 2: יחיד, חסכונות 100,000 ₪, ללא ריבית, 15 שנים + דחייה שנתיים | "עודף חסכונות: (מתייחס להשלמת הכנסה) 100,000 - 40,556 = 59,444 ₪", |
| [791](../senior_rights/sampels_questions.json#L791) | דוגמה 2: יחיד, חסכונות 100,000 ₪, ללא ריבית, 15 שנים + דחייה שנתיים | "הכנסה תיאורטית: (מתייחס להשלמת הכנסה) 59,444 × 4.30% ÷ 12 = 213 ₪/חודש", |

#### `support_files/files/Income_Supplement_Eligibility_Assessment_Questionnaire.md` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [1](../support_files/files/Income_Supplement_Eligibility_Assessment_Questionnaire.md#L1) | שאלון בדיקת זכאות ל | # שאלון בדיקת זכאות להשלמת הכנסה |
| [7](../support_files/files/Income_Supplement_Eligibility_Assessment_Questionnaire.md#L7) | 1. פרטים אישיים והרכב משפחתי | > **בדיקת סף:** אם אינך מקבל קצבת אזרח ותיק מהביטוח הלאומי, לא ניתן להגיש בקשה לתוספת השלמת הכנסה במסלול זה. |

#### `support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md` (7)

| שורה | הקשר | קטע |
|---|---|---|
| [4](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L4) | מדריך מפורט: | # מדריך מפורט: השלמת הכנסה לקצבת אזרח ותיק (מעודכן לינואר 2026) |
| [6](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L6) | מדריך מפורט: השלמת הכנסה לקצבת אזרח ותיק (מעודכן לינואר 2026) | חוברת זו מרכזת את המידע העדכני ביותר על תוספת השלמת הכנסה, המבוסס על נתוני המוסד לביטוח לאומי המעודכנים לינואר 2026. |
| [20](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L20) | 2. סכומי הזכאות הכוללים (קצבה + השלמה) - ינואר 2026 | הסכומים להלן מייצגים את סך הקצבה המובטחת (קצבת אזרח ותיק בתוספת השלמת הכנסה) לפי קבוצות גיל והרכב משפחתי: |
| [31](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L31) | 3. הכנסות שאינן נלקחות בחשבון (הסכום הפטור) - 2026 | אלו סכומי ההכנסה המקסימליים שניתן לקבל מבלי שהם יפחיתו את סכום השלמת ההכנסה: |
| [60](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L60) | 5. השפעת תוספת ותק | …וספת ותק (2% לכל שנה מעל 10 שנות ביטוח) מתווספת לתקרות המופיעות בסעיף 2. היא אינה מקוזזת מהשלמת ההכנסה, ובכך מגדילה את הקצבה הכוללת עבור מי שעבד וצבר ותק ביטוחי. |
| [67](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L67) | 6. השפעת בעלות על רכב (כללים והחרגות 2026) | ככלל, בעלות על רכב (אחד או יותר) עלולה לשלול את הזכאות להשלמת הכנסה, אך ישנם תנאים המאפשרים להחזיק רכב ועדיין לקבל את הקצבה. |
| [96](../support_files/files/Income_Supplement_Guide_and_Eligibility_2026.md#L96) | 7. הטבות נלוות לזכאים | קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות: |

#### `support_files/files/NII_Benefits_Eligibility_Criteria.md` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [71](../support_files/files/NII_Benefits_Eligibility_Criteria.md#L71) | 5. | ### 5. השלמת הכנסה לאזרח ותיק |
| [112](../support_files/files/NII_Benefits_Eligibility_Criteria.md#L112) | 7. | ### 7. השלמת הכנסה לשאירים |
| [347](../support_files/files/NII_Benefits_Eligibility_Criteria.md#L347) | 20. | ### 20. השלמת הכנסה (למי שעובד) |

#### `support_files/files/Senior_Pensions_Survivors_01_2026.md` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [70](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L70) | ה. | ## ה. השלמת הכנסה (לפי חוק הבטחת הכנסה) – למבוטחים בגילאי פרישה ומקבלי שאירים |
| [129](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L129) | ז. מדדי זכאות ל | ### ז. מדדי זכאות להשלמת הכנסה |
| [145](../support_files/files/Senior_Pensions_Survivors_01_2026.md#L145) | ח. הסכום הקובע לעניין | ### ח. הסכום הקובע לעניין השלמת הכנסה |

#### `support_files/files/gimlat_zikna_meyuchedet.md` (9)

| שורה | הקשר | קטע |
|---|---|---|
| [76](../support_files/files/gimlat_zikna_meyuchedet.md#L76) | [תנאי זכאות מצטברים]{dir="rtl"} | …כאי מי שההכנסות שלא מעבודה שלו ושל בן או בת זוגו לא עולות על סכום קצבת אזרח ותיק עם תוספת השלמת ההכנסה שהוא זכאי לה לפי הרכב המשפחה ולפי גיל.]{dir="rtl"} |
| [93](../support_files/files/gimlat_zikna_meyuchedet.md#L93) | [גובה הגמלה]{dir="rtl"} | [תוספת השלמת הכנסה]{dir="rtl"} [✅ כן --- נבחנת ומשולמת לפי תנאי זכאות רגילים]{dir="rtl"} |
| [141](../support_files/files/gimlat_zikna_meyuchedet.md#L141) | [הגשת התביעה]{dir="rtl"} | [השלמת הכנסה]{dir="rtl"} [טופס נפרד (430) מצורף לטופס 4501]{dir="rtl"} |
| [277](../support_files/files/gimlat_zikna_meyuchedet.md#L277) | [ב.3 --- ענפי הביטוח הכלולים באמנות]{dir="rtl"} | [השלמת הכנסה]{dir="rtl"} [❌ לא --- אינו נכלל באמנות]{dir="rtl"} |
| [336](../support_files/files/gimlat_zikna_meyuchedet.md#L336) | [ב.6 --- | ## [ב.6 --- השלמת הכנסה ואמנות]{dir="rtl"} |
| [339](../support_files/files/gimlat_zikna_meyuchedet.md#L339) | [ב.6 --- השלמת הכנסה ואמנות]{dir="rtl"} | **[⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל --- לא זכאי להשלמת הכנסה, גם אם גר במדינת אמנה. השל… |
| [343](../support_files/files/gimlat_zikna_meyuchedet.md#L343) | [ב.6 --- השלמת הכנסה ואמנות]{dir="rtl"} | - [חריג לשהות זמנית בחו\"ל: מקבלי השלמת הכנסה רשאים לשהות בחו\"ל עד 72 ימים בשנה קלנדרית ולא יותר מ-3 פעמים --- ותוספת ההשלמה תמשיך להי… |
| [395](../support_files/files/gimlat_zikna_meyuchedet.md#L395) | [חלק ג׳ --- השוואה: גמלה מיוחדת לעומת קצבה רגילה דרך אמנה]{dir="rtl"} | [השלמת הכנסה]{dir="rtl"} [✅ זכאי]{dir="rtl"} [✅ זכאי (אם תושב ישראל)]{dir="rtl"} |
| [421](../support_files/files/gimlat_zikna_meyuchedet.md#L421) | [שאלות שחובה לשאול כל לקוח עולה / תושב חוזר:]{dir="rtl"} | …\'לא מגיע לו כלום\'. בפועל --- ייתכן שהוא זכאי לגמלה מיוחדת + קצבה חלקית מהמדינה הקודמת + השלמת הכנסה + תוספת עבור בן/בת זוג. חובה לבדוק!]{dir="rtl"}** |

#### `support_files/files/hamburger_accordion_improvment_documentation.md` (23)

| שורה | הקשר | קטע |
|---|---|---|
| [30](../support_files/files/hamburger_accordion_improvment_documentation.md#L30) | רשימת קבצי HTML באתר BTL שמופיעים בתפריט המבורגר | ¦ דוגמאות - קצבת זיקנה והשלמת הכנסה ¦ senior_rights/sampels.html ¦ |
| [110](../support_files/files/hamburger_accordion_improvment_documentation.md#L110) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | ▸ 💰 גמלת השלמת הכנסה |
| [117](../support_files/files/hamburger_accordion_improvment_documentation.md#L117) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ ▸ סכומים מירביים קצבת זיקנה + השלמת הכנסה [is-max-oldage] |
| [118](../support_files/files/hamburger_accordion_improvment_documentation.md#L118) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ ▸ סכומים מירביים גמלת שאירים + השלמת הכנסה [is-max-survivors] |
| [120](../support_files/files/hamburger_accordion_improvment_documentation.md#L120) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ │ ▸ מחשבון זכאות להשלמת הכנסה [is-calculator] |
| [123](../support_files/files/hamburger_accordion_improvment_documentation.md#L123) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ ▸ דוגמאות לחישוב השלמת הכנסה |
| [127](../support_files/files/hamburger_accordion_improvment_documentation.md#L127) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ ▸ השלמת הכנסה ויציאה לחו"ל |
| [142](../support_files/files/hamburger_accordion_improvment_documentation.md#L142) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ ▸ הטבות נלוות להשלמת הכנסה [is-benefits] |
| [166](../support_files/files/hamburger_accordion_improvment_documentation.md#L166) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ │ ▸ ב.5 — תוספת השלמת הכנסה [su-b5] |
| [198](../support_files/files/hamburger_accordion_improvment_documentation.md#L198) | עץ אקורדיונים: `senior_rights/senior_rights_full.html` | │ │ │ ▸ ב. קצבת זיקנה עם השלמת הכנסה [su-i4b] |
| [280](../support_files/files/hamburger_accordion_improvment_documentation.md#L280) | עץ אקורדיונים: `senior_rights/survivors_benefits_guide_2026.html` | │ ▸ תוספת השלמת הכנסה ומענק חימום |
| [432](../support_files/files/hamburger_accordion_improvment_documentation.md#L432) | עץ אקורדיונים: `senior_rights/data/data_202601.html` | ▸ ה. השלמת הכנסה ליתומים משני הורים או לילד נטוש [עלה] |
| [433](../support_files/files/hamburger_accordion_improvment_documentation.md#L433) | עץ אקורדיונים: `senior_rights/data/data_202601.html` | ▸ ו. השלמת הכנסה — מבוטחים בגילאי פרישה [עלה] |
| [435](../support_files/files/hamburger_accordion_improvment_documentation.md#L435) | עץ אקורדיונים: `senior_rights/data/data_202601.html` | ▸ ח. מדדי זכאות להשלמת הכנסה [עלה] |
| [436](../support_files/files/hamburger_accordion_improvment_documentation.md#L436) | עץ אקורדיונים: `senior_rights/data/data_202601.html` | ▸ ט. הסכום הקובע לעניין השלמת הכנסה [עלה] |
| [460](../support_files/files/hamburger_accordion_improvment_documentation.md#L460) | סוג 2 — אקורדיונים נטענים דינמית מ-JS (אין ID סטטי ב-HTML) | ¦ דוגמאות - קצבת זיקנה והשלמת הכנסה ¦ senior_rights/sampels.html ¦ sampels_app.js + sampels_questions.json ¦ |
| [516](../support_files/files/hamburger_accordion_improvment_documentation.md#L516) | 1. `senior_rights_full_data.js` — הוספת ~80 מזהי `id` לכותרות עלים | ¦ גמלת השלמת הכנסה ¦ `is-` ¦ is-cond-a, is-cond-b, is-couple-a, is-couple-b, is-max-oldage, is-max-survivors… |
| [1138](../support_files/files/hamburger_accordion_improvment_documentation.md#L1138) | 3. `survivors_benefits_guide_2026.html` — 4 אקורדיונים ראשיים | ¦ סכומי הקצבה 2026 ¦ `children: [ קצבה לאלמן/ה, קצבה ליתומים, תוספת ותק, תוספת השלמת הכנסה ]` ¦ `href: ...#sv-amounts` ¦ |
| [1324](../support_files/files/hamburger_accordion_improvment_documentation.md#L1324) | 1. `financial-tables-and-definitions.html` | income_supplement: { title: 'השלמת הכנסה', icon: '💰' }, |
| [1368](../support_files/files/hamburger_accordion_improvment_documentation.md#L1368) | 1. `financial-tables-and-definitions.html` | { text: 'השלמת הכנסה', href: bp + 'senior_rights/financial-tables-and-definitions.html#income_supplement' }, |
| [1663](../support_files/files/hamburger_accordion_improvment_documentation.md#L1663) | 8א — הוספת אקורדיון "מחשבונים וכלים" | ¦ בדיקת זכאות להשלמת הכנסה ¦ `questionnaire.html?id=income-supplement-eligibility` ¦ |
| [1664](../support_files/files/hamburger_accordion_improvment_documentation.md#L1664) | 8א — הוספת אקורדיון "מחשבונים וכלים" | ¦ הגדרת ילד להשלמת הכנסה ¦ `questionnaire.html?id=child-definition&hideReturn=true` ¦ |
| [1665](../support_files/files/hamburger_accordion_improvment_documentation.md#L1665) | 8א — הוספת אקורדיון "מחשבונים וכלים" | ¦ זכאות להשלמת הכנסה עם רכב ¦ `questionnaire.html?id=vehicle-income-supplement` ¦ |

#### `support_files/files/international_treaties.md` (6)

| שורה | הקשר | קטע |
|---|---|---|
| [120](../support_files/files/international_treaties.md#L120) | [ב.3 --- ענפי הביטוח הכלולים באמנות]{dir="rtl"} | [השלמת הכנסה]{dir="rtl"} [❌ לא --- אינו נכלל באמנות]{dir="rtl"} |
| [179](../support_files/files/international_treaties.md#L179) | [ | ## [השלמת הכנסה ואמנות]{dir="rtl"} |
| [182](../support_files/files/international_treaties.md#L182) | [השלמת הכנסה ואמנות]{dir="rtl"} | **[⚠️ חשוב: השלמת הכנסה אינה נכללת באמנות! מי שגר מחוץ לישראל --- לא זכאי להשלמת הכנסה, גם אם גר במדינת אמנה. השל… |
| [186](../support_files/files/international_treaties.md#L186) | [השלמת הכנסה ואמנות]{dir="rtl"} | - [חריג לשהות זמנית בחו\"ל: מקבלי השלמת הכנסה רשאים לשהות בחו\"ל עד 72 ימים בשנה קלנדרית ולא יותר מ-3 פעמים --- ותוספת ההשלמה תמשיך להי… |
| [238](../support_files/files/international_treaties.md#L238) | [השוואה: גמלה מיוחדת לעומת קצבה רגילה דרך אמנה]{dir="rtl"} | [השלמת הכנסה]{dir="rtl"} [✅ זכאי]{dir="rtl"} [✅ זכאי (אם תושב ישראל)]{dir="rtl"} |
| [264](../support_files/files/international_treaties.md#L264) | [שאלות שחובה לשאול כל עולה / תושב חוזר:]{dir="rtl"} | …\'לא מגיע לו כלום\'. בפועל --- ייתכן שהוא זכאי לגמלה מיוחדת + קצבה חלקית מהמדינה הקודמת + השלמת הכנסה + תוספת עבור בן/בת זוג. חובה לבדוק!]{dir="rtl"}** |

#### `support_files/files/merged-senior-rights-2026.md` (18)

| שורה | הקשר | קטע |
|---|---|---|
| [12](../support_files/files/merged-senior-rights-2026.md#L12) | תוכן עניינים | 2. [גמלת השלמת הכנסה](#2-גמלת-השלמת-הכנסה) |
| [281](../support_files/files/merged-senior-rights-2026.md#L281) | 2. גמלת | ## 2. גמלת השלמת הכנסה |
| [283](../support_files/files/merged-senior-rights-2026.md#L283) | 2. גמלת השלמת הכנסה | 🔗 [השלמת הכנסה — כל זכות](https://www.kolzchut.org.il/he/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA_%D7%94%D7%A9%D7%… |
| [289](../support_files/files/merged-senior-rights-2026.md#L289) | 2.1 תנאי זכאות בסיסיים | כדי להיות זכאי להשלמת הכנסה, על המבקש לעמוד בארבעה תנאים מצטברים: |
| [307](../support_files/files/merged-senior-rights-2026.md#L307) | ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק | - **השלמת הכנסה:** הזכאות תחושב לפי תעריף של **זוג**. |
| [310](../support_files/files/merged-senior-rights-2026.md#L310) | 2.3 סכומי קצבה מקסימליים (קצבת אזרח ותיק + | ### 2.3 סכומי קצבה מקסימליים (קצבת אזרח ותיק + השלמת הכנסה) |
| [349](../support_files/files/merged-senior-rights-2026.md#L349) | הכנסה מפנסיה (הכנסה שאינה מעבודה) | כל שקל שמתקבל מפנסיה (או הכנסה שאינה מעבודה כגון שכירות) מקוזז בשלמותו (100%) מסכום השלמת ההכנסה. |
| [351](../support_files/files/merged-senior-rights-2026.md#L351) | הכנסה מפנסיה (הכנסה שאינה מעבודה) | > **דוגמה:** אם יחיד זכאי להשלמת הכנסה בסך ₪2,000 ויש לו פנסיה של ₪1,000, הוא יקבל רק ₪1,000 השלמת הכנסה. |
| [365](../support_files/files/merged-senior-rights-2026.md#L365) | הכנסה מעבודה (שכר) | על כל שקל שמעבר לסכום הפטור, מופחתים 60% מסכום השלמת ההכנסה. |
| [391](../support_files/files/merged-senior-rights-2026.md#L391) | 2.6 דוגמאות לחישוב | ### 2.6 דוגמאות לחישוב השלמת הכנסה |
| [411](../support_files/files/merged-senior-rights-2026.md#L411) | 2.7 הטבות נלוות לזכאים | קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות: |
| [602](../support_files/files/merged-senior-rights-2026.md#L602) | 5.4 מבחן הכנסות לאלמן — מה נספר ומה לא? | - **השלמת הכנסה** — נספרת במלואה |
| [729](../support_files/files/merged-senior-rights-2026.md#L729) | 5.11 הגשת תביעה לקצבת שאירים | ¦ הנפטר לא קיבל קצבה; שאיריו זכאים להשלמת הכנסה ¦ מה-1 בחודש הפטירה ¦ |
| [933](../support_files/files/merged-senior-rights-2026.md#L933) | 8.5 שירותי בריאות | - פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה). |
| [954](../support_files/files/merged-senior-rights-2026.md#L954) | 9. השפעות הדדיות בין הקצבאות | ¦ השלמת הכנסה ¦ הכנסות נמוכות + קצבת זקנה ¦ יחיד עד ₪4,375 / זוג עד ₪6,912 ¦ **לא** ¦ מזכה בהטבות נוספו… |
| [961](../support_files/files/merged-senior-rights-2026.md#L961) | 9. השפעות הדדיות בין הקצבאות | - ✅ **קצבת אזרח ותיק** נספרת כהכנסה במבחן להשלמת הכנסה. |
| [964](../support_files/files/merged-senior-rights-2026.md#L964) | 9. השפעות הדדיות בין הקצבאות | - ✅ **מקבלי השלמת הכנסה** זכאים להטבות נוספות רבות. |
| [982](../support_files/files/merged-senior-rights-2026.md#L982) | 10.1 המוסד לביטוח לאומי | - מוקד השלמת הכנסה: *6050 שלוחה 4 |

#### `support_files/files/nechut_vs_shairim_2026.md` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [132](../support_files/files/nechut_vs_shairim_2026.md#L132) | 5. יתרונות קצבת השאירים | **ה. השלמת הכנסה** |
| [134](../support_files/files/nechut_vs_shairim_2026.md#L134) | 5. יתרונות קצבת השאירים | לקצבת שאירים ניתן לקבל תוספת השלמת הכנסה אם ההכנסה הכוללת נמוכה מהסף הקבוע. זהו יתרון לבעלי הכנסות נמוכות. |
| [172](../support_files/files/nechut_vs_shairim_2026.md#L172) | שאירים – מבחן הכנסה לאלמן (ללא ילדים) | אלמנה ללא ילדים – אינה כפופה למבחן הכנסות לקצבת שאירים עצמה (אך כפופה לבדיקה לצורך תוספת השלמת הכנסה). |

#### `support_files/files/rights-data-js-converted.md` (14)

| שורה | הקשר | קטע |
|---|---|---|
| [258](../support_files/files/rights-data-js-converted.md#L258) | קצבאות זקנה וזכויות ביטוח לאומי › 📊 דוגמה מקיפה לחישוב קצבה | 💸 תוספת השלמת הכנסה |
| [259](../support_files/files/rights-data-js-converted.md#L259) | קצבאות זקנה וזכויות ביטוח לאומי › 💸 תוספת השלמת הכנסה | השלמת הכנסה ניתנת למי שהכנסותיו נמוכות ומיועדת להבטיח רמת חיים מינימלית. |
| [260](../support_files/files/rights-data-js-converted.md#L260) | קצבאות זקנה וזכויות ביטוח לאומי › 💸 תוספת השלמת הכנסה | 🏛️ השלמת הכנסה - כל זכות. כל המידע על השלמת הכנסה |
| [262](../support_files/files/rights-data-js-converted.md#L262) | קצבאות זקנה וזכויות ביטוח לאומי › 💸 תוספת השלמת הכנסה | סכומי השלמת הכנסה מקסימליים 2026 |
| [335](../support_files/files/rights-data-js-converted.md#L335) | קצבאות זקנה וזכויות ביטוח לאומי › 💰 חישוב הכנסה רעיונית מנכסים פיננסיים | דוגמאות לחישוב השלמת הכנסה |
| [361](../support_files/files/rights-data-js-converted.md#L361) | קצבאות זקנה וזכויות ביטוח לאומי › דוגמה 2 - זוג: | 🎁 הטבות נלוות להשלמת הכנסה |
| [362](../support_files/files/rights-data-js-converted.md#L362) | קצבאות זקנה וזכויות ביטוח לאומי › 🎁 הטבות נלוות להשלמת הכנסה | מקבלי השלמת הכנסה זכאים להטבות נוספות: |
| [707](../support_files/files/rights-data-js-converted.md#L707) | תקציר - השפעות הדדיות בין ההטבות › ⚠️ חשוב להבין כיצד הקצבאות והגמלאות השונות משפיעות זו על זו: | ✅ קצבת אזרח ותיק נספרת כהכנסה במבחן להשלמת הכנסה |
| [710](../support_files/files/rights-data-js-converted.md#L710) | תקציר - השפעות הדדיות בין ההטבות › ⚠️ חשוב להבין כיצד הקצבאות והגמלאות השונות משפיעות זו על זו: | ✅ מקבלי השלמת הכנסה זכאים להטבות נוספות רבות |
| [734](../support_files/files/rights-data-js-converted.md#L734) | תקציר - השפעות הדדיות בין ההטבות › 📋 טבלת סיכום - כל ההטבות במקום אחד | השלמת הכנסה |
| [870](../support_files/files/rights-data-js-converted.md#L870) | מענקים ותשלומים מיוחדים › הכנסות שנלקחות בחשבון במבחן: | השלמת הכנסה - נספרת במלואה |
| [925](../support_files/files/rights-data-js-converted.md#L925) | מענקים ותשלומים מיוחדים › קצבת יתומים: | השלמת הכנסה ליתומים משני הורים: ₪2,434 לכל ילד (נכון ל-1.1.2026) |
| [1040](../support_files/files/rights-data-js-converted.md#L1040) | מענקים ותשלומים מיוחדים › 📅 מועד תחילת תשלום הקצבה | ושאיריו זכאים להשלמת הכנסה: מה- 1 בחודש הפטירה |
| [1041](../support_files/files/rights-data-js-converted.md#L1041) | מענקים ותשלומים מיוחדים › 📅 מועד תחילת תשלום הקצבה | ושאיריו אינם זכאים להשלמת הכנסה: |

#### `support_files/files/senior-citizens-rights-2026-data-js-converted.md` (14)

| שורה | הקשר | קטע |
|---|---|---|
| [188](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L188) | 💵 גמלת › דוגמה מקיפה לחישוב קצבה | # 💵 גמלת השלמת הכנסה |
| [189](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L189) | 💵 גמלת השלמת הכנסה › דוגמה מקיפה לחישוב קצבה | מדריך מפורט: השלמת הכנסה לקצבת אזרח ותיק (מעודכן לשנת 2026) |
| [190](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L190) | 💵 גמלת השלמת הכנסה › מדריך מפורט: השלמת הכנסה לקצבת אזרח ותיק (מעודכן לשנת 2026) | חוברת זו מרכזת את המידע העדכני ביותר (נכון לשנת 2026) בנושא תוספת השלמת הכנסה לקצבת אזרח ותיק. התוספת נועדה להבטיח הכנסה מינימלית לקיום בכבוד עבור מי שקצבת הזקנה שלו ו… |
| [195](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L195) | 💵 גמלת השלמת הכנסה › 1. תנאי זכאות בסיסיים | כדי להיות זכאי להשלמת הכנסה, על המבקש לעמוד בארבעה תנאים מצטברים: |
| [206](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L206) | 💵 גמלת השלמת הכנסה › א. שני בני הזוג זכאים לקצבת אזרח ותיק | כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה. |
| [217](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L217) | 💵 גמלת השלמת הכנסה › ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | השלמת הכנסה: הזכאות תחושב לפי תעריף של זוג . |
| [221](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L221) | 💵 גמלת השלמת הכנסה › ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג") | 3. סכומי הקצבה (קצבת אזרח ותיק + השלמת הכנסה) |
| [262](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L262) | 💵 גמלת השלמת הכנסה › 4. תקרת ההכנסה המזכה | כדי לקבל השלמת הכנסה, הכנסותיך ברוטו (שאינן מעבודה) חייבות להיות נמוכות מהסכומים הבאים: |
| [271](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L271) | 💵 גמלת השלמת הכנסה › הכנסה מפנסיה (קצבה חודשית) | כל שקל שמתקבל מפנסיה (או הכנסה שאינה מעבודה כגון שכירות) מקוזז בשלמותו (100%) מסכום השלמת ההכנסה. |
| [273](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L273) | 💵 גמלת השלמת הכנסה › הכנסה מפנסיה (קצבה חודשית) | דוגמה: אם יחיד זכאי להשלמת הכנסה בסך 2,000 ₪ ויש לו פנסיה של 1,000 ₪, הוא יקבל רק 1,000 ₪ השלמת הכנסה. |
| [285](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L285) | 💵 גמלת השלמת הכנסה › הכנסה מעבודה (שכר) | אופן החישוב: על כל שקל שמעבר לסכום הפטור, מופחתים 60% מסכום השלמת ההכנסה. |
| [318](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L318) | 💵 גמלת השלמת הכנסה › 8. הטבות נלוות לזכאים | קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות: |
| [482](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L482) | 🎁 הטבות נוספות › שירותי בריאות | פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה) |
| [507](../support_files/files/senior-citizens-rights-2026-data-js-converted.md#L507) | 📞 כתובות ומידע ליצירת קשר › מוקדים ייעודיים | מוקד השלמת הכנסה: *6050 שלוחה 4 |

#### `support_files/files/survivors_benefits_comprehensive_guide_2026.md` (5)

| שורה | הקשר | קטע |
|---|---|---|
| [25](../support_files/files/survivors_benefits_comprehensive_guide_2026.md#L25) | תוכן עניינים | - [תוספת השלמת הכנסה](#84-תוספת-השלמת-הכנסה) |
| [311](../support_files/files/survivors_benefits_comprehensive_guide_2026.md#L311) | 8.4 תוספת | ### 8.4 תוספת השלמת הכנסה |
| [314](../support_files/files/survivors_benefits_comprehensive_guide_2026.md#L314) | 8.4 תוספת השלמת הכנסה | אלמן/ה שהכנסתם נמוכה עשויים לקבל **תוספת השלמת הכנסה** על פי חוק הבטחת הכנסה, שנועדה להבטיח הכנסה מינימלית. |
| [316](../support_files/files/survivors_benefits_comprehensive_guide_2026.md#L316) | 8.4 תוספת השלמת הכנסה | …לומד במוסד חינוכי (ישיבה גבוהה, אוניברסיטה, מכללה, הכשרה מקצועית) – **אינם** זכאים לתוספת השלמת הכנסה בעד אותו ילד. |
| [321](../support_files/files/survivors_benefits_comprehensive_guide_2026.md#L321) | 8.4 תוספת השלמת הכנסה | 2. מקבל תוספת השלמת הכנסה לקצבה באחד החודשים: אוקטובר, נובמבר או דצמבר באותה שנה |

#### `support_files/files/השלמת הכנסה חובת דיווח.md` (5)

| שורה | הקשר | קטע |
|---|---|---|
| [1](../support_files/files/השלמת הכנסה חובת דיווח.md#L1) |  | # השלמת הכנסה - חובת דיווח לביטוח הלאומי |
| [3](../support_files/files/השלמת הכנסה חובת דיווח.md#L3) | השלמת הכנסה - חובת דיווח לביטוח הלאומי | המידע המפורט , כללי התנהלות למקבלי השלמת הכנסה בהתאם להנחיות הביטוח |
| [9](../support_files/files/השלמת הכנסה חובת דיווח.md#L9) | השלמת הכנסה - חובת דיווח לביטוח הלאומי | > מסמך זה מפרט, כללי התנהלות למקבלי השלמת הכנסה בהתאם להנחיות הביטוח הלאומי. |
| [15](../support_files/files/השלמת הכנסה חובת דיווח.md#L15) | השלמת הכנסה - חובת דיווח לביטוח הלאומי | ## השלמת הכנסה -- חובת דיווח |
| [19](../support_files/files/השלמת הכנסה חובת דיווח.md#L19) | השלמת הכנסה -- חובת דיווח | אם אתה מקבל קצבת זיקנה ועליה תוספת השלמת הכנסה --- להלן כל מה שאתה חייב |

#### `support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md` (4)

| שורה | הקשר | קטע |
|---|---|---|
| [2](../support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md#L2) |  | **השלמת הכנסה - יציאה לחו"ל** |
| [8](../support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md#L8) |  | מקבל תוספת השלמת הכנסה חייב להודיע לסניף הביטוח הלאומי על כל יציאה |
| [51](../support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md#L51) | סיכום תקופות שהייה מותרת בחו"ל | ¦ מס׳ יציאות בשנה ¦ סה״כ ימים בחו״ל ¦ השלמת הכנסה ¦ הערות ¦ |
| [60](../support_files/files/יציאה_לחול_השלמת_הכנסה_עמוד4.md#L60) | מקרים מיוחדים שמאפשרים המשך קבלת | # מקרים מיוחדים שמאפשרים המשך קבלת השלמת הכנסה |

#### `support_files/files/כלי אבחון - 2.md` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [31](../support_files/files/כלי אבחון - 2.md#L31) | ג. תעסוקה, פרישה והכנסות | - [ ] **16. האם לבן/בת הזוג יש הכנסות מעבודה או פנסיה?** (לחישוב תוספת תלויים והשלמת הכנסה). |
| [35](../support_files/files/כלי אבחון - 2.md#L35) | ד. נכסים ורכב (לבדיקת | ## ד. נכסים ורכב (לבדיקת השלמת הכנסה) |

#### `support_files/files/כלי_אבחון_ראשוני.md` (8)

| שורה | הקשר | קטע |
|---|---|---|
| [58](../support_files/files/כלי_אבחון_ראשוני.md#L58) | שאלה 2: קצבאות קיימות מביטוח לאומי | - ☐ השלמת הכנסה - ממתי: _____ כמה: _____ ש״ח |
| [93](../support_files/files/כלי_אבחון_ראשוני.md#L93) | שאלה 3: הכנסות והשתכרות | > **הערה:** רלוונטי לבדיקת זכאות להבטחת הכנסה ולחישוב השלמת הכנסה |
| [166](../support_files/files/כלי_אבחון_ראשוני.md#L166) | 🔍 זכויות רלוונטיות: | - ☐ השלמת הכנסה לשאירים (סעיף 7) |
| [320](../support_files/files/כלי_אבחון_ראשוני.md#L320) | חלק ח: בירור זכאות - הבטחת הכנסה | > אם הפונה כבר מקבל השלמת הכנסה (שאלה 2) - דלג על חלק זה |
| [332](../support_files/files/כלי_אבחון_ראשוני.md#L332) | 🔍 זכויות רלוונטיות: | - ☐ השלמת הכנסה (אם עובד, סעיף 20) |
| [452](../support_files/files/כלי_אבחון_ראשוני.md#L452) | 5. | ## 5. השלמת הכנסה לאזרח ותיק |
| [493](../support_files/files/כלי_אבחון_ראשוני.md#L493) | 7. | ## 7. השלמת הכנסה לשאירים |
| [734](../support_files/files/כלי_אבחון_ראשוני.md#L734) | 20. | ## 20. השלמת הכנסה (למי שעובד) |

#### `support_files/files/מחשבון קצבת אזרח ותיק חלקית/classify_pension_spec.md` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [204](../support_files/files/מחשבון קצבת אזרח ותיק חלקית/classify_pension_spec.md#L204) | מה הפונקציה לא עושה | - זכאות לגמלה מיוחדת / השלמת הכנסה |

#### `support_files/files/מענק_פטירה_סיכום_2026.md` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [36](../support_files/files/מענק_פטירה_סיכום_2026.md#L36) | א. קצבאות המזכות במענק | ¦ הבטחת הכנסה / השלמת הכנסה ¦ ¦ |
| [78](../support_files/files/מענק_פטירה_סיכום_2026.md#L78) | ב. קצבת זיקנה עם | ### ב. קצבת זיקנה עם השלמת הכנסה |
| [80](../support_files/files/מענק_פטירה_סיכום_2026.md#L80) | ב. קצבת זיקנה עם השלמת הכנסה | מקבל קצבת זיקנה עם השלמת הכנסה שבן/בת זוגו נפטר/ה, זכאי גם הוא/היא למענק פטירה. |

#### `support_files/files/קצבת שאירים-מדריך מלא.md` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [212](../support_files/files/קצבת שאירים-מדריך מלא.md#L212) | ב.5 — תוספת | ### ב.5 — תוספת השלמת הכנסה |
| [214](../support_files/files/קצבת שאירים-מדריך מלא.md#L214) | ב.5 — תוספת השלמת הכנסה | תוספת השלמת הכנסה משולמת על פי חוק הבטחת הכנסה, להבטחת הכנסה מינימלית לאלמן/ה שהכנסתו/ה נמוכה. יש להגיש בקש… |

#### `support_files/json/btl_benefit_combinations_results.json` (18)

| שורה | הקשר | קטע |
|---|---|---|
| [84](../support_files/json/btl_benefit_combinations_results.json#L84) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל דמי אבטלה עם תוספת השלמת הכנסה. \nאולם דמי האבטלה יילקחו בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לך." |
| [175](../support_files/json/btl_benefit_combinations_results.json#L175) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבל השלמת הכנסה בקצבת השאירים - דמי האבטלה יילקחו בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לו." |
| [210](../support_files/json/btl_benefit_combinations_results.json#L210) |  | … את שתי הקצבאות.\nקצבת אזרח ותיק נלקחת בחשבון לצורך חישוב התט\"ר. תט\"ר נחשב הכנסה לחישוב השלמת הכנסה." |
| [266](../support_files/json/btl_benefit_combinations_results.json#L266) |  | …קצבאות ויש לבחור באחת מהן. כאשר הנכות זמנית אין בחירה ותשולם לך הקצבה הגובהה. אם אתה מקבל השלמת הכנסה בקצבת אזרח ותיק תוכל לבחור בין הקצבאות מאחר וישנן הטבות נלוות שיכולות להיפגע.\nאם תבחר בק… |
| [273](../support_files/json/btl_benefit_combinations_results.json#L273) |  | …קצבאות ויש לבחור באחת מהן. כאשר הנכות זמנית אין בחירה ותשולם לך הקצבה הגובהה. אם אתה מקבל השלמת הכנסה בקצבת אזרח ותיק תוכל לבחור בין הקצבאות מאחר וישנן הטבות נלוות שיכולות להיפגע.\nאם תבחר בק… |
| [777](../support_files/json/btl_benefit_combinations_results.json#L777) |  | …תי הקצבאות.\n\nקצבת אזרח ותיק נלקחת בחשבון לצורך חישוב התט\"ר.\n\nתט\"ר נחשב הכנסה לחישוב השלמת הכנסה." |
| [945](../support_files/json/btl_benefit_combinations_results.json#L945) |  | …קחת בחשבון לצורך חישוב התט\"\"ר.\nתט\"\"ר נחשב הכנסה לעניין הגדרת \"\"אלמן\"\" וכן לחישוב השלמת הכנסה." |
| [1449](../support_files/json/btl_benefit_combinations_results.json#L1449) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבלת השלמת הכנסה בקצבת שאירים - דמי הלידה יילקחו בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לה." |
| [2044](../support_files/json/btl_benefit_combinations_results.json#L2044) |  | "result": "על פי הנתונים שהוזנו,\nסכום תוספת השלמת ההכנסה יהיה ההפרש שבין קצבת הבטחת הכנסה (לפי הרכב המשפחה שלך) לסכום הקצבה שאתה מקבל\nאולם דמי הא… |
| [2142](../support_files/json/btl_benefit_combinations_results.json#L2142) |  | …י הנתונים שהוזנו,\nאם מגיעה לך קצבה בסכום נמוך מקצבת הבטחת הכנסה - אתה עשוי לקבל גם תוספת השלמת הכנסה.\nסכום תוספת השלמת ההכנסה יהיה ההפרש שבין קצבת הבטחת הכנסה (לפי הרכב המשפחה שלך) לסכום הק… |
| [2779](../support_files/json/btl_benefit_combinations_results.json#L2779) |  | …י הנתונים שהוזנו,\nאם מגיעה לך קצבה בסכום נמוך מקצבת הבטחת הכנסה - אתה עשוי לקבל גם תוספת השלמת הכנסה.\nסכום תוספת השלמת ההכנסה יהיה ההפרש שבין קצבת הבטחת הכנסה (לפי הרכב המשפחה שלך) לסכום הק… |
| [2912](../support_files/json/btl_benefit_combinations_results.json#L2912) |  | …קצבאות ויש לבחור באחת מהן. כאשר הנכות זמנית אין בחירה ותשולם לך הקצבה הגובהה. אם אתה מקבל השלמת הכנסה בקצבת אזרח ותיק תוכל לבחור בין הקצבאות מאחר וישנן הטבות נלוות שיכולות להיפגע.\nאם תבחר בק… |
| [3087](../support_files/json/btl_benefit_combinations_results.json#L3087) |  | …קצבאות ויש לבחור באחת מהן. כאשר הנכות זמנית אין בחירה ותשולם לך הקצבה הגובהה. אם אתה מקבל השלמת הכנסה בקצבת אזרח ותיק תוכל לבחור בין הקצבאות מאחר וישנן הטבות נלוות שיכולות להיפגע.\nאם תבחר בק… |
| [3738](../support_files/json/btl_benefit_combinations_results.json#L3738) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבל השלמת הכנסה בקצבת השאירים - דמי האבטלה יילקחו בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לו." |
| [3766](../support_files/json/btl_benefit_combinations_results.json#L3766) |  | …קחת בחשבון לצורך חישוב התט\"\"ר.\nתט\"\"ר נחשב הכנסה לעניין הגדרת \"\"אלמן\"\" וכן לחישוב השלמת הכנסה." |
| [3794](../support_files/json/btl_benefit_combinations_results.json#L3794) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבלת השלמת הכנסה בקצבת שאירים - דמי הלידה יילקחו בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לה." |
| [3906](../support_files/json/btl_benefit_combinations_results.json#L3906) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבלת השלמת הכנסה בקצבת השאירים - הקצבה לשמירת היריון תילקח בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לה.… |
| [4305](../support_files/json/btl_benefit_combinations_results.json#L4305) |  | "result": "על פי הנתונים שהוזנו,\nאפשר לקבל את שתי הקצבאות.\nאולם מי שמקבלת השלמת הכנסה בקצבת השאירים - הקצבה לשמירת היריון תילקח בחשבון לצורך חישוב סכום השלמת ההכנסה המגיעה לה.… |

#### `support_files/moved_files.md` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [14](../support_files/moved_files.md#L14) | BTL/files/ ← support_files/files/ | …es/Income_Supplement_Eligibility_Assessment_Questionnaire.md` ¦ מסמך ¦ שאלון הערכת זכאות להשלמת הכנסה ¦ |
| [15](../support_files/moved_files.md#L15) | BTL/files/ ← support_files/files/ | ¦ `BTL/files/Income_Supplement_Guide_and_Eligibility_2026.md` ¦ מסמך ¦ מדריך השלמת הכנסה 2026 ¦ |

#### `support_files/senior_rights/CHANGELOG.md` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [1](../support_files/senior_rights/CHANGELOG.md#L1) | סיכום שינויים - שאלון בדיקת זכאות ל | # סיכום שינויים - שאלון בדיקת זכאות להשלמת הכנסה (ינואר 2026) |
| [5](../support_files/senior_rights/CHANGELOG.md#L5) | 📝 סכום כללי | שאלון בדיקת זכאות להשלמת הכנסה עבר עדכון קיצוני המטמיע חישוב הזכאות המדויק לפי חוקי הביטוח הלאומי בישראל. |

#### `support_files/senior_rights/TESTING_CHECKLIST.md` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [1](../support_files/senior_rights/TESTING_CHECKLIST.md#L1) | בדיקות ואימות - שאלון בדיקת זכאות ל | # בדיקות ואימות - שאלון בדיקת זכאות להשלמת הכנסה |

#### `support_files/senior_rights/data/data_012026_comparison.csv` (18)

| שורה | הקשר | קטע |
|---|---|---|
| [18](../support_files/senior_rights/data/data_012026_comparison.csv#L18) |  | השלמת הכנסה עד גיל 70 - יחיד,INCOME_SUPPLEMENT_SINGLE_UNDER70,4273,4375,102,2.39% |
| [19](../support_files/senior_rights/data/data_012026_comparison.csv#L19) |  | השלמת הכנסה עד גיל 70 - זוג,INCOME_SUPPLEMENT_COUPLE_UNDER70,6751,6912,161,2.38% |
| [20](../support_files/senior_rights/data/data_012026_comparison.csv#L20) |  | השלמת הכנסה עד גיל 70 - יחיד + ילד,INCOME_SUPPLEMENT_SINGLE_1_CHILD_UNDER70,,7305,חדש,חדש |
| [21](../support_files/senior_rights/data/data_012026_comparison.csv#L21) |  | השלמת הכנסה עד גיל 70 - יחיד + 2 ילדים,INCOME_SUPPLEMENT_SINGLE_2_CHILDREN_UNDER70,,8426,חדש,חדש |
| [22](../support_files/senior_rights/data/data_012026_comparison.csv#L22) |  | השלמת הכנסה עד גיל 70 - זוג + ילד,INCOME_SUPPLEMENT_COUPLE_1_CHILD_UNDER70,,8035,חדש,חדש |
| [23](../support_files/senior_rights/data/data_012026_comparison.csv#L23) |  | השלמת הכנסה עד גיל 70 - זוג + 2 ילדים,INCOME_SUPPLEMENT_COUPLE_2_CHILDREN_UNDER70,,9156,חדש,חדש |
| [24](../support_files/senior_rights/data/data_012026_comparison.csv#L24) |  | השלמת הכנסה גיל 70-80 - יחיד,INCOME_SUPPLEMENT_SINGLE_70_80,,4418,חדש,חדש |
| [25](../support_files/senior_rights/data/data_012026_comparison.csv#L25) |  | השלמת הכנסה גיל 70-80 - זוג,INCOME_SUPPLEMENT_COUPLE_70_80,,6981,חדש,חדש |
| [26](../support_files/senior_rights/data/data_012026_comparison.csv#L26) |  | השלמת הכנסה גיל 70-80 - יחיד + ילד,INCOME_SUPPLEMENT_SINGLE_1_CHILD_70_80,,7374,חדש,חדש |
| [27](../support_files/senior_rights/data/data_012026_comparison.csv#L27) |  | השלמת הכנסה גיל 70-80 - יחיד + 2 ילדים,INCOME_SUPPLEMENT_SINGLE_2_CHILDREN_70_80,,8496,חדש,חדש |
| [28](../support_files/senior_rights/data/data_012026_comparison.csv#L28) |  | השלמת הכנסה גיל 70-80 - זוג + ילד,INCOME_SUPPLEMENT_COUPLE_1_CHILD_70_80,,8102,חדש,חדש |
| [29](../support_files/senior_rights/data/data_012026_comparison.csv#L29) |  | השלמת הכנסה גיל 70-80 - זוג + 2 ילדים,INCOME_SUPPLEMENT_COUPLE_2_CHILDREN_70_80,,9226,חדש,חדש |
| [30](../support_files/senior_rights/data/data_012026_comparison.csv#L30) |  | השלמת הכנסה מגיל 80 - יחיד,INCOME_SUPPLEMENT_SINGLE_80,,4460,חדש,חדש |
| [31](../support_files/senior_rights/data/data_012026_comparison.csv#L31) |  | השלמת הכנסה מגיל 80 - זוג,INCOME_SUPPLEMENT_COUPLE_80,,7048,חדש,חדש |
| [32](../support_files/senior_rights/data/data_012026_comparison.csv#L32) |  | השלמת הכנסה מגיל 80 - יחיד + ילד,INCOME_SUPPLEMENT_SINGLE_1_CHILD_80,,7442,חדש,חדש |
| [33](../support_files/senior_rights/data/data_012026_comparison.csv#L33) |  | השלמת הכנסה מגיל 80 - יחיד + 2 ילדים,INCOME_SUPPLEMENT_SINGLE_2_CHILDREN_80,,8563,חדש,חדש |
| [34](../support_files/senior_rights/data/data_012026_comparison.csv#L34) |  | השלמת הכנסה מגיל 80 - זוג + ילד,INCOME_SUPPLEMENT_COUPLE_1_CHILD_80,,8171,חדש,חדש |
| [35](../support_files/senior_rights/data/data_012026_comparison.csv#L35) |  | השלמת הכנסה מגיל 80 - זוג + 2 ילדים,INCOME_SUPPLEMENT_COUPLE_2_CHILDREN_80,,9292,חדש,חדש |

#### `support_files/senior_rights/data/dynamic-values-report.txt` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [87](../support_files/senior_rights/data/dynamic-values-report.txt#L87) |  | השלמת הכנסה מקסימלית - יחיד (INCOME_SUPPLEMENT_SINGLE): |
| [93](../support_files/senior_rights/data/dynamic-values-report.txt#L93) |  | השלמת הכנסה מקסימלית - זוג (INCOME_SUPPLEMENT_COUPLE): |

#### `support_files/senior_rights/data/dynamic-values.json` (6)

| שורה | הקשר | קטע |
|---|---|---|
| [168](../support_files/senior_rights/data/dynamic-values.json#L168) |  | "fieldName": "השלמת הכנסה מקסימלית - יחיד", |
| [172](../support_files/senior_rights/data/dynamic-values.json#L172) |  | "explanation": "סכום השלמת הכנסה מקסימלי ליחיד", |
| [174](../support_files/senior_rights/data/dynamic-values.json#L174) |  | "תוספת השלמת הכנסה" |
| [179](../support_files/senior_rights/data/dynamic-values.json#L179) |  | "fieldName": "השלמת הכנסה מקסימלית - זוג", |
| [183](../support_files/senior_rights/data/dynamic-values.json#L183) |  | "explanation": "סכום השלמת הכנסה מקסימלי לזוג", |
| [185](../support_files/senior_rights/data/dynamic-values.json#L185) |  | "תוספת השלמת הכנסה" |

#### `support_files/senior_rights/data/pension-amounts-2025.json` (6)

| שורה | הקשר | קטע |
|---|---|---|
| [206](../support_files/senior_rights/data/pension-amounts-2025.json#L206) |  | "fieldName": "תוספת השלמת הכנסה", |
| [210](../support_files/senior_rights/data/pension-amounts-2025.json#L210) |  | "fieldName": "השלמת הכנסה מקסימלית - יחיד", |
| [213](../support_files/senior_rights/data/pension-amounts-2025.json#L213) |  | "explanation": "סכום חודשי מקסימלי להשלמת הכנסה ליחיד" |
| [216](../support_files/senior_rights/data/pension-amounts-2025.json#L216) |  | "fieldName": "השלמת הכנסה מקסימלית - זוג", |
| [219](../support_files/senior_rights/data/pension-amounts-2025.json#L219) |  | "explanation": "סכום חודשי מקסימלי להשלמת הכנסה לזוג" |
| [264](../support_files/senior_rights/data/pension-amounts-2025.json#L264) |  | "fieldName": "הטבות נלוות להשלמת הכנסה", |

#### `support_files/senior_rights/data/rights-data.json` (3)

| שורה | הקשר | קטע |
|---|---|---|
| [7](../support_files/senior_rights/data/rights-data.json#L7) | קצבאות זקנה וזכויות ביטוח לאומי › סכומי קצבת זקנה (נכון לינואר 2024) | … (תוספת גיל) \n 1,947 ₪ \n \n \n קצבה מלאה (40 שנות ביטוח) \n עד 2,124 ₪ \n \n \n\n תוספת השלמת הכנסה \n מטרה: להבטיח הכנסה מינימלית לאזרחים ותיקים \n \n יחיד: השלמה לרמת הכנסה של 3,028 ₪ \n … |
| [7](../support_files/senior_rights/data/rights-data.json#L7) | קצבאות זקנה וזכויות ביטוח לאומי › זכויות במים ובחשמל | …ם לחודש \n חשמל: זכאות להנחה בחשבון החשמל לבעלי הכנסה נמוכה \n הגז: הנחות מיוחדות לזכאים להשלמת הכנסה \n יש להגיש בקשה לחברות הסופקות \n \n\n זכויות בריאות נוספות \n \n תרופות: הנחה על משתתפו… |
| [12](../support_files/senior_rights/data/rights-data.json#L12) | הטבות מס, נקודות זיכוי, והנחות ארנונה לאזרחים ותיקים › טיפים חשובים | …ת כוללת של מעל ל-200 מיליון ₪. המענק משולם לאזרחים ותיקים שהגיעו לגיל פרישה ומקבלים תוספת השלמת הכנסה בנוסף לקצבת שאירים, קצבת נכות או לקצבת אזרח ותיק\n \n \nגובה מענק חימום הוא בשיעור של 6.4… |

#### `support_files/senior_rights/intake_questionnaire.html` (4)

| שורה | הקשר | קטע |
|---|---|---|
| [1306](../support_files/senior_rights/intake_questionnaire.html#L1306) |  | // השלמת הכנסה - מגיל פרישה עד 70 |
| [1314](../support_files/senior_rights/intake_questionnaire.html#L1314) |  | // השלמת הכנסה - גיל 70-80 |
| [1322](../support_files/senior_rights/intake_questionnaire.html#L1322) |  | // השלמת הכנסה - גיל 80 ומעלה |
| [2244](../support_files/senior_rights/intake_questionnaire.html#L2244) |  | // חישוב זכאות להשלמת הכנסה |

#### `support_files/senior_rights/intake_questions.json` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [267](../support_files/senior_rights/intake_questions.json#L267) | השלמת הכנסה | {"value": "השלמת הכנסה", "label": "השלמת הכנסה"}, |
| [286](../support_files/senior_rights/intake_questions.json#L286) | השלמת הכנסה | {"value": "השלמת הכנסה", "label": "השלמת הכנסה"}, |

#### `support_files/senior_rights/intake_questions_export.txt` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [12](../support_files/senior_rights/intake_questions_export.txt#L12) |  | - סך הכנסה חודשית משוערת (ברוטו) — תקרת השלמת הכנסה משוערת: יחיד ~3,700 ₪, זוג ~5,900 ₪ (2026, יש לאמת מול ביטוח לאומי) |
| [58](../support_files/senior_rights/intake_questions_export.txt#L58) |  | - האם הכנסתך החודשית נמוכה מהמינימום הנדרש (תקרת הבטחת/השלמת הכנסה)? |

#### `support_files/senior_rights/scripts/generate_counseling_form_pdf.py` (2)

| שורה | הקשר | קטע |
|---|---|---|
| [364](../support_files/senior_rights/scripts/generate_counseling_form_pdf.py#L364) | ══════════════════════════════════════════════════════════════════ | ('cb_hachnasat', 'מקבל השלמת הכנסה'), |
| [508](../support_files/senior_rights/scripts/generate_counseling_form_pdf.py#L508) | ══════════════════════════════════════════════════════════════════ | ('cb_n_hachnasa','השלמת הכנסה'), |

#### `support_files/senior_rights/scripts/update-data.js` (1)

| שורה | הקשר | קטע |
|---|---|---|
| [81](../support_files/senior_rights/scripts/update-data.js#L81) |  | - תוספת השלמת הכנסה - תנאים וסכומים |

### ד. תוצרים שנבנים אוטומטית (ai-content, search-index) – מתעדכנים מהמקור

| קובץ | מופעים |
|---|---|
| `ai-content/btl-care-transitions.html` | 106 |
| `ai-content/btl-faq.html` | 196 |
| `ai-content/btl-immigrants-treaties.html` | 75 |
| `ai-content/btl-income-test.html` | 72 |
| `ai-content/btl-pension-overview.html` | 86 |
| `ai-content/btl-special-cases.html` | 18 |
| `ai-content/btl-survivors-disability.html` | 81 |
| `senior_rights/data/search-index.json` | 927 |
