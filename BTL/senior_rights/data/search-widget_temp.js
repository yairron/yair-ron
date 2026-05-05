// search-widget.js — ווידג'ט חיפוש מושגים
//
// שימוש בכל דף:
//   1. הגדר base path לפני טעינת הקובץ:
//        <script>const SEARCH_BASE_PATH = '';</script>       ← בדפי BTL/ (שורש)
//        <script>const SEARCH_BASE_PATH = '../';</script>    ← בדפי BTL/senior_rights/ ו-BTL/new_immigrants/
//   2. טען את הקובץ:
//        <script src="senior_rights/data/search-widget.js"></script>   ← מ-BTL/ (שורש)
//        <script src="data/search-widget.js"></script>                  ← מ-BTL/senior_rights/
//   3. הוסף לדף את ה-HTML הבא (בין ה-header ל-links-container):
//      <div class="search-wrapper">
//        <div class="search-box">
//          <span class="search-icon">🔍</span>
//          <input type="text" id="conceptSearch" placeholder="חיפוש מושג..." autocomplete="off" oninput="filterConcepts(this.value)">
//          <button class="search-clear" id="searchClear" onclick="clearSearch()" aria-label="נקה חיפוש">✕</button>
//        </div>
//        <div class="search-hint">מספר מילים - רווח או פסיק בין המילים · <strong>"ביטוי מדויק"</strong> בגרשיים · <strong>*מילה</strong> לחיפוש חלקי (כולל קידומות)</div>
//        <div id="searchResults" class="search-results" hidden></div>
//      </div>
//   4. הוסף את ה-CSS מהסקשן "SEARCH WIDGET CSS" שב-index.html

var SEARCH_BASE = (typeof SEARCH_BASE_PATH !== 'undefined') ? SEARCH_BASE_PATH : '';

var SEARCH_CONCEPTS = [

  // ── קצבאות עיקריות ───────────────────────────────────────────────────────

  { term: 'קצבת אזרח ותיק', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
  ]},

  { term: 'קצבת שאירים', links: [
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת שאירים ומענק פטירה', path: ['פרק א׳ — תנאי הזכאות המלאים'], url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#survivors' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'נכות כללית מול שאירים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/nechut_vs_shairim.html' },
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'קצבת נכות כללית', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'נכות כללית מול שאירים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/nechut_vs_shairim.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'נכות וקצבת שר"מ',         url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'גמלת סיעוד', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#nursing' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מוסד אישפוז',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/nursing_home_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'גמלת זיקנה מיוחדת', links: [
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'עולים חדשים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'השלמת הכנסה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת השלמת הכנסה',         url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'השלמת הכנסה',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'מענק פטירה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת שאירים ומענק פטירה', path: ['פרק ט׳ — מענק פטירה'],        url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#survivors' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'מענק מעבר לנשים', links: [
    { label: 'מדריך מפורט למענק מעבר לנשים',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/women_transition_benefit_guide.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'מענק מעבר לנשים בגיל 62', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#transition_grant' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק מעבר לנשים בגיל 62', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  // ── גיל ותקופות ──────────────────────────────────────────────────────────

  { term: 'גיל פרישה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מענק מעבר לנשים',                  ctx: 'רקע',                       url: SEARCH_BASE + 'senior_rights/women_transition_benefit_guide.html#reka' },
  ]},

  { term: 'גיל זכאות מוחלטת', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק א — דרך חישוב הזכאות ליחיד', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#algorithm' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקופת אכשרה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'מדריך קצבת שאירים',                ctx: 'תנאי 2: הנפטר השלים תקופת אכשרה', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#eligibility' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
  ]},

  { term: 'תוספת ותק', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'תוספת דחיית קצבה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  // ── מבחנים ותקרות ────────────────────────────────────────────────────────

  { term: 'מבחן הכנסות', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקרות הכנסה', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'סיכום — טבלת תקרות לפי הרכב משפחתי', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#summary' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'מבחן נכסים', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'השלמת הכנסה',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת השלמת הכנסה',         url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
  ]},

  { term: 'הכנסה רעיונית מנכסים', links: [
    { label: 'חישוב הכנסה רעיונית מנכסים פיננסיים', ctx: '',                      url: SEARCH_BASE + 'senior_rights/imputed_income_guide.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ג — הכנסה מנכסים',    url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#assets' },
  ]},

  // ── הגדרות אישים תלויים ──────────────────────────────────────────────────

  { term: 'הגדרת אלמנה', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: 'הגדרת "אלמנה"',           url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html#almana' },
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק?', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'הגדרת אלמן', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: 'הגדרת "אלמן"',            url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html#alman' },
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק?', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'הגדרת אלמנה בת קצבה', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
  ]},

  { term: 'הגדרת בן זוג', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק?', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
  ]},

  { term: 'הגדרת בת זוג', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק › הגדרות', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html#old_age||הגדרות' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'הגדרת עקרת בית', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק › הגדרות', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html#old_age||הגדרות' },
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'הגדרת רווקה / גרושה / אלמנה', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק › הגדרות', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html#old_age||הגדרות' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'הגדרת ילד תלוי', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: 'הגדרת "ילד"',               url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html#yeled' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק › הגדרות', url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html#old_age||הגדרות' },
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
  ]},

  { term: 'הגדרת ילד שאיר', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: 'הגדרת "ילד"',     url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html#yeled' },
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק?', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
  ]},

  { term: 'הגדרת יתום', links: [
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק? › הגדרת יתום', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
    { label: 'מדריך קצבת שאירים',                ctx: 'תנאי הזכאות › הגדרת יתום מפורטת',        url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#eligibility' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים › הגדרות › הגדרת יתום',           url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html#survivors||הגדרות' },
  ]},

  // ── נכות ─────────────────────────────────────────────────────────────────

  { term: 'דרגות נכות', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'נכות וקצבת שר"מ',         url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  // ── אוכלוסיות מיוחדות ────────────────────────────────────────────────────

  { term: 'ניצולי שואה', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'זכויות ניצולי שואה',       url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#holocaust_survivors' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'ניצולי שואה',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'עולים חדשים', links: [
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: '',                          url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'עולים חדשים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'אמנות בינלאומיות', links: [
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: '',                          url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
  ]},

  // ── גמלאות ותשלומים נוספים ───────────────────────────────────────────────

  { term: 'קצבת שירותים מיוחדים (שר"מ)', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  { term: 'גמלת ילד נכה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  { term: 'גמלת השלמה לנכה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  { term: 'גמלת תלויים לנפגע עבודה שנפטר', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'קצבת ילדים', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'קצבת ניידות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'קצבת נכות מעבודה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'קצבת נפגעי פעולות איבה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'נפגעי פעולות איבה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'הבטחת הכנסה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת השלמת הכנסה',         url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' },
  ]},

  { term: 'דמי אבטלה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'דמי לידה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'דמי פגיעה בעבודה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'דמי שמירת היריון', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מענק הסתגלות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מענק לידה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מענק נכות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מזונות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'הלוואה עומדת לרכב', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'השתתפות בהוצאות רכב', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'קצבה מיוחדת', links: [
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
    { label: 'זכויות עולים חדשים',               ctx: 'גמלת זיקנה מיוחדת',        url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  // ── תוספות לקצבה ────────────────────────────────────────────────────────

  { term: 'תוספת בן זוג', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
  ]},

  { term: 'תוספת ילדים', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תוספת גיל 80 ומעלה', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תוספת תלויים', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'רמות סיעוד', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#nursing' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'מדריך מוסד אישפוז',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/nursing_home_guide.html' },
  ]},

  // ── הכנסות, מבחנים ותקרות ────────────────────────────────────────────────

  { term: 'הכנסה מותרת מעבודה', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ב — הכנסה מעבודה',    url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#work' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'הכנסה מותרת מפנסיה', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מענק מעבר לנשים',                  ctx: 'תנאי הזכאות',               url: SEARCH_BASE + 'senior_rights/women_transition_benefit_guide.html#reka' },
  ]},

  { term: 'זכאות חלקית', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק א — דרך חישוב הזכאות ליחיד', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'שיעור הפחתה', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק א, ב, ג',              url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקופת אי-זכאות מינימלית', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק א — דרך חישוב הזכאות ליחיד', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'סכום בסיסי — קצבת אזרח ותיק', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'סכומי קצבת שאירים', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'מענק שאירים',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'שכר ממוצע במשק', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'צמדה למדד', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'קיזוז דמי ביטוח בריאות', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת השלמת הכנסה',         url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' },
  ]},

  { term: 'שיעור דחייה', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'תקרות השלמת הכנסה', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת השלמת הכנסה',         url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#income_supplement' },
  ]},

  { term: 'תקרת דחייה מקסימלית', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקרת הכנסה לקצבה מלאה — זוג', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'סיכום — טבלת תקרות לפי הרכב משפחתי', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקרת הכנסה לקצבה מלאה — יחיד', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק א — דרך חישוב הזכאות ליחיד', url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקרת הכנסה מנכסים', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ג — הכנסה מנכסים',    url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'חישוב הכנסה רעיונית מנכסים פיננסיים', ctx: '',                      url: SEARCH_BASE + 'senior_rights/imputed_income_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תקרת נכסים פטורה', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
  ]},

  { term: 'תקרת רכב', links: [
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תשלום רטרואקטיבי', links: [
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  // ── נכות ─────────────────────────────────────────────────────────────────

  { term: 'אובדן כושר השתכרות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'נכות כללית מול שאירים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/nechut_vs_shairim.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  { term: 'אחוז נכות', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'נכות כללית מול שאירים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/nechut_vs_shairim.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת נכות כללית וקצבת שירותים מיוחדים', url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#disability' },
  ]},

  { term: 'שיעור ומספר ליקויים', links: [
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'נכות כללית מול שאירים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/nechut_vs_shairim.html' },
  ]},

  { term: 'אנשים עם נכות 75% ומעלה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  // ── סטטוסים ומצבים משפחתיים ─────────────────────────────────────────────

  { term: 'אישה גרושה מעל גיל 55', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'אישה נשואה', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: 'הגדרת "עקרת בית"',         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'אלמנה שאינה זכאית לקצבת שאירים', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'מדריך קצבת שאירים',                ctx: 'מי הם "שאירים" לפי החוק?', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#sharim' },
  ]},

  { term: 'עגונה', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'שירותניקים', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'תושבות ישראל', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
  ]},

  { term: 'זכויות עולים', links: [
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
    { label: 'גמלת זיקנה מיוחדת לעולים',         ctx: '',                          url: SEARCH_BASE + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: '',                          url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
  ]},

  { term: 'עבודה בחו"ל', links: [
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: '',                          url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'קצבת אזרח ותיק',          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#old_age_pension' },
  ]},

  { term: 'עובדים עצמאיים', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ב — הכנסה מעבודה',    url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#work' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'עובדים שכירים', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ב — הכנסה מעבודה',    url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#work' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  // ── תביעות וזכויות ─────────────────────────────────────────────────────

  { term: 'הגשת תביעה', links: [
    { label: 'מדריך קצבת שאירים',                ctx: 'תנאי הזכאות',               url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#eligibility' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מבוטח פעיל', links: [
    { label: 'מדריך קצבת שאירים',                ctx: 'ביטוח בפרק הזמן לפני הפטירה', url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html#eligibility' },
  ]},

  { term: 'בית דין לעבודה', links: [
    { label: 'מדריך קצבת שאירים',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/survivors_benefits_guide_2026.html' },
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  { term: 'חוק שירות ביטחון', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
  ]},

  { term: 'פקיד מוסמך', links: [
    { label: 'הגדרת תלויים בקצבת זיקנה ושאירים', ctx: '',                         url: SEARCH_BASE + 'senior_rights/dependents_definition_old_age_survivors.html' },
  ]},

  // ── קישורים ומוקדי מידע ──────────────────────────────────────────────────

  { term: 'מוקד טלפוני *6050', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
    { label: 'דף ראשי',                          ctx: '',                          url: SEARCH_BASE + 'index.html' },
  ]},

  { term: 'סניף ביטוח לאומי', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  { term: 'תעודת אזרח ותיק', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  { term: 'יד שרה', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  { term: 'עזר מציון', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  { term: 'כל זכות', links: [
    { label: 'קישורים חשובים',                   ctx: '',                          url: SEARCH_BASE + 'senior_rights/important-links.html' },
  ]},

  // ── כלים ומחשבונים ───────────────────────────────────────────────────────

  { term: 'מחשבון זכאות לקצבה', links: [
    { label: 'מחשבון הערכת זכאות לקצבת זיקנה',  ctx: '',                          url: SEARCH_BASE + 'senior_rights/age_pension_eligibility_calculator.html' },
  ]},

  { term: 'מחשבון גיל פרישה', links: [
    { label: 'מחשבון גיל פרישה לנשים',           ctx: '',                          url: SEARCH_BASE + 'senior_rights/retirement-calculator.html' },
  ]},

  { term: 'בדיקת תעודת זהות', links: [
    { label: 'חישוב ובדיקת מספר תעודת זהות',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/id-check.html' },
  ]},

  { term: 'טופס הפניה לייעוץ', links: [
    { label: 'פניה לייעוץ – בל/4300',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/counseling_referral_form.html' },
  ]},


  { term: 'שאלון זכאות להשלמת הכנסה', links: [
    { label: 'שאלון בדיקת זכאות להשלמת הכנסה',  ctx: '',                          url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=income-supplement-eligibility' },
  ]},

  { term: 'חישוב הכנסה רעיונית', links: [
    { label: 'שאלון חישוב הכנסה רעיונית מנכסים', ctx: '',                          url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=imputed-income-calculator' },
  ]},

  { term: 'השלמת הכנסה עם רכב', links: [
    { label: 'שאלון זכאות להשלמת הכנסה עם רכב',  ctx: 'בעלי רכב מעל תקרת רכב',    url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=vehicle-income-supplement' },
  ]},

  { term: 'הגדרת ילד להשלמת הכנסה', links: [
    { label: 'שאלון הגדרת ילד לצורך השלמת הכנסה', ctx: 'קצבת אזרח ותיק',           url: SEARCH_BASE + 'senior_rights/questionnaire.html?id=child-definition' },
  ]},

  { term: 'מקורות מידע', links: [
    { label: 'מסמכי מקורות מידע',                ctx: '',                          url: SEARCH_BASE + 'senior_rights/Information_Sources.html' },
  ]},

  { term: 'זכויות אזרחים ותיקים 2026', links: [
    { label: 'זכויות אזרחים ותיקים 2026',        ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_citizens_rights_2026.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
  ]},

  // ── שילוב גמלאות וצבירה ──────────────────────────────────────────────────

  { term: 'שילוב גמלאות', links: [
    { label: 'שילוב של יותר מקצבה אחת',          ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefit-combinations.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/senior_rights_full.html' },
  ]},

  { term: 'מגבלת צבירה', links: [
    { label: 'שילוב של יותר מקצבה אחת',          ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefit-combinations.html' },
  ]},

  { term: 'צבירת גמלאות', links: [
    { label: 'שילוב של יותר מקצבה אחת',          ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefit-combinations.html' },
  ]},

  // ── הכנסה והגדרות ────────────────────────────────────────────────────────

  { term: 'הכנסה פטורה', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: '',                          url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'הכנסה משולבת', links: [
    { label: 'מבחן הכנסות לקצבת אזרח ותיק',     ctx: 'חלק ד - הכנסה משולבת',     url: SEARCH_BASE + 'senior_rights/old_pension_income_test_full_guide.html#combined' },
    { label: 'טבלאות סכומים והגדרות',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  // ── אמנות בינלאומיות ─────────────────────────────────────────────────────

  { term: 'מדינות אמנה', links: [
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: '',                          url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
  ]},

  { term: 'צירוף תקופות ביטוח', links: [
    { label: 'אמנות בינלאומיות לביטחון סוציאלי', ctx: 'צירוף תקופות ביטוח',       url: SEARCH_BASE + 'new_immigrants/international_treaties.html' },
    { label: 'זכויות עולים חדשים',               ctx: '',                          url: SEARCH_BASE + 'new_immigrants/new_immigrants_full.html' },
  ]},

  // ── ניצולי שואה — פירוט ──────────────────────────────────────────────────

  { term: 'תגמולי רדיפות הנאצים', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'זכויות ניצולי שואה',       url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#holocaust_survivors' },
  ]},

  { term: 'תשלומי ועידת התביעות', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: 'ועידת התביעות',             url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'זכויות ניצולי שואה',       url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#holocaust_survivors' },
  ]},

  { term: 'דמי מחיה', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'טבלאות סכומים והגדרות',            ctx: 'ניצולי שואה',              url: SEARCH_BASE + 'senior_rights/financial-tables-and-definitions.html' },
  ]},

  { term: 'מענק שנתי', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מענקי הבראה', links: [
    { label: 'זכויות ניצולי שואה בישראל',         ctx: '',                          url: SEARCH_BASE + 'senior_rights/holocaust_survivors_rights.html' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'תוספת מונשם', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#nursing' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  // ── סיעוד — פירוט ────────────────────────────────────────────────────────

  { term: 'נקודות תלות', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#nursing' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

  { term: 'מבחן תפקוד', links: [
    { label: 'מדריך מקיף זכויות ותיקים',         ctx: 'גמלת סיעוד',               url: SEARCH_BASE + 'senior_rights/senior_rights_full.html#nursing' },
    { label: 'ריכוז קצבאות ותשלומים',            ctx: '',                          url: SEARCH_BASE + 'senior_rights/benefits-index.html' },
  ]},

];

// ── פונקציות ─────────────────────────────────────────────────────────────────

function parseQuery(raw) {
  // Returns array of token objects: { text, anyPrefix }
  // Exact phrases (in quotes) and plain words. Prefix a word with * to match as substring.
  var tokens = [];
  var rest = raw.trim();
  var phraseRe = /"([^"]+)"/g;
  var m;
  var stripped = rest;
  while ((m = phraseRe.exec(rest)) !== null) {
    if (m[1].trim()) tokens.push({ text: m[1].trim(), anyPrefix: false });
    stripped = stripped.replace(m[0], ' ');
  }
  stripped.split(/[\s,]+/).forEach(function(w) {
    w = w.trim();
    if (!w) return;
    if (w.charAt(0) === '*') {
      var t = w.slice(1);
      if (t) tokens.push({ text: t, anyPrefix: true });
    } else {
      tokens.push({ text: w, anyPrefix: false });
    }
  });
  return tokens.filter(function(t) { return t.text.length > 0; });
}

function tokenMatchesText(text, token) {
  // anyPrefix=true  → substring match anywhere (e.g. *רכב matches הרכב)
  // anyPrefix=false → word-start match: token must not be preceded by a Hebrew letter
  var t = token.text;
  if (token.anyPrefix) return text.includes(t);
  var idx = 0;
  while (true) {
    var pos = text.indexOf(t, idx);
    if (pos === -1) return false;
    if (pos === 0 || !/[א-ת]/.test(text[pos - 1])) return true;
    idx = pos + 1;
  }
}

function textMatchesTokens(text, tokens) {
  return tokens.every(function(t) { return tokenMatchesText(text, t); });
}

function highlight(text, query) {
  if (!query) return text;
  var tokens = parseQuery(query);
  if (!tokens.length) return text;
  var pattern = tokens
    .map(function(t) { return t.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); })
    .join('|');
  var re = new RegExp('(' + pattern + ')', 'g');
  return text.replace(re, '<mark>$1</mark>');
}

function getLinkPathParts(concept, link) {
  var parts = [link.label || ''];

  if (Array.isArray(link.path) && link.path.length) {
    link.path.forEach(function(p) {
      if (typeof p === 'string' && p.trim()) parts.push(p.trim());
    });
  } else if (typeof link.ctx === 'string' && link.ctx.trim()) {
    link.ctx.split(/\s*[>›]\s*/).forEach(function(p) {
      if (p.trim()) parts.push(p.trim());
    });
  }

  return parts;
}

function renderLinkBreadcrumb(parts, query) {
  if (!parts.length) return '';
  return parts.map(function(part, idx) {
    if (idx === 0) return highlight(part, query);
    return ' <span class="link-ctx">&rsaquo; ' + highlight(part, query) + '</span>';
  }).join('');
}

function buildDeepLinkUrl(concept, link) {
  var url = link.url || '';
  var pathParts = getLinkPathParts(concept, link).slice(1); // without label

  if (url.includes('senior_rights/senior_rights_full.html#')) {
    var hashParts = url.split('#');
    if (hashParts.length < 2) return url;

    var base = hashParts[0];
    var category = hashParts[1].split('?')[0];
    if (!pathParts.length) return url;

    var deepParts = [category].concat(pathParts).map(function(p) {
      return encodeURIComponent(p);
    });
    return base + '#' + deepParts.join('||');
  }

  // financial-tables supports hash in format #category||part1||part2.
  if (url.includes('senior_rights/financial-tables-and-definitions.html') && !url.includes('#')) {
    var categoryMap = {
      'קצבת אזרח ותיק': 'old_age',
      'השלמת הכנסה': 'income_supplement',
      'גמלת סיעוד': 'nursing',
      'נכות וקצבת שר"מ': 'disability',
      'מענק שאירים': 'survivors',
      'מענק מעבר לנשים בגיל 62': 'transition_grant',
      'ניצולי שואה': 'holocaust',
      'עולים חדשים': 'immigrants'
    };

    if (!pathParts.length) return url;
    var categoryKey = categoryMap[pathParts[0]];
    if (!categoryKey) return url;

    var deep = [categoryKey].concat(pathParts.slice(1)).map(function(p) {
      return encodeURIComponent(p);
    });
    return url + '#' + deep.join('||');
  }

  return url;
}

function filterConcepts(query) {
  var q = query.trim();
  var clearBtn = document.getElementById('searchClear');
  var results  = document.getElementById('searchResults');
  clearBtn.style.display = q ? 'block' : 'none';
  if (!q) { results.hidden = true; return; }

  var tokens = parseQuery(q);

  function conceptText(c, l) {
    var pathText = Array.isArray(l.path) ? l.path.join(' ') : '';
    var ctxText  = typeof l.ctx === 'string' ? l.ctx : '';
    return c.term + ' ' + l.label + ' ' + ctxText + ' ' + pathText;
  }

  var matches = SEARCH_CONCEPTS.filter(function(c) {
    return textMatchesTokens(c.term, tokens) || c.links.some(function(l) {
      return textMatchesTokens(conceptText(c, l), tokens);
    });
  });

  if (!matches.length) {
    results.hidden = false;
    results.innerHTML = '<div class="search-no-results">לא נמצאו תוצאות עבור "' + q + '"</div>';
    return;
  }

  var html = '<div class="search-count">נמצאו ' + matches.length + ' מושגים</div>';
  matches.forEach(function(c) {
    var termMatches = textMatchesTokens(c.term, tokens);
    var visibleLinks = termMatches ? c.links : c.links.filter(function(l) {
      return textMatchesTokens(conceptText(c, l), tokens);
    });
    var linksHtml = visibleLinks.map(function(l) {
      var pathParts = getLinkPathParts(c, l);
      var resolvedUrl = buildDeepLinkUrl(c, l);
      return '<a href="' + resolvedUrl + '">' + renderLinkBreadcrumb(pathParts, q) + '</a>';
    }).join('');
    html += '<div class="search-result-item">'
      + '<div class="search-result-term">' + highlight(c.term, q) + '</div>'
      + '<div class="search-result-links">' + linksHtml + '</div>'
      + '</div>';
  });
  results.hidden = false;
  results.innerHTML = html;
}

function clearSearch() {
  var inp = document.getElementById('conceptSearch');
  inp.value = '';
  inp.focus();
  filterConcepts('');
}
