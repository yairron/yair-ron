// search-extra.js — ערכי חיפוש נוספים שאינם עלי-עץ בתפריט ההמבורגר.
// נטען לפני search-widget.js; search-widget.js ממזג window.SEARCH_EXTRA לתוך SEARCH_CONCEPTS.

var SEARCH_BASE = (typeof SEARCH_BASE_PATH !== 'undefined') ? SEARCH_BASE_PATH : '';

var _nvs = 'senior_rights/nechut_vs_shairim.html';
var _bc_choose  = ['נכות כללית מול שאירים 2026', 'חובה לבחור בין הקצבאות'];
var _bc_amounts = ['נכות כללית מול שאירים 2026', 'השוואת סכומים ותקרות'];
var _bc_adv     = ['נכות כללית מול שאירים 2026', 'השוואת יתרונות'];
var _bc_risks   = ['נכות כללית מול שאירים 2026', 'השוואת סיכונים'];
var _bc_switch  = ['נכות כללית מול שאירים 2026', 'האם ניתן לעבור בין הקצבאות?'];
var _bc_add     = ['נכות כללית מול שאירים 2026', 'נקודות נוספות מהותיות'];
var _bc_gzm     = ['גמלת זיקנה מיוחדת', 'חלק א׳ — מבוא, זכאות וגובה הגמלה'];
var _bc_intl    = ['אמנות בינלאומיות לביטחון סוציאלי', 'השוואה וטיפים'];
var _gzm = 'new_immigrants/gimlat_zikna_meyuchedet.html';
var _intl = 'new_immigrants/international_treaties.html';

window.SEARCH_EXTRA = [
  // nvs-choose
  { term: 'העיקרון המשפטי',               breadcrumb: _bc_choose,  url: SEARCH_BASE + _nvs + '#nvs-choose-principle', aliases: 'עיקרון עקרון העקרון משפטי מישפטי המישפטי' },
  { term: 'חשוב לדעת',                    breadcrumb: _bc_choose,  url: SEARCH_BASE + _nvs + '#nvs-choose-note' },

  // nvs-amounts
  { term: 'קצבת נכות כללית',              breadcrumb: _bc_amounts, url: SEARCH_BASE + _nvs + '#nvs-amounts-disability' },
  { term: 'קצבת שאירים (אלמן/אלמנה)',     breadcrumb: _bc_amounts, url: SEARCH_BASE + _nvs + '#nvs-amounts-survivors',  aliases: 'שארים' },

  // nvs-advantages
  { term: 'קצבת נכות כללית',              breadcrumb: _bc_adv,     url: SEARCH_BASE + _nvs + '#nvs-adv-disability' },
  { term: 'קצבת השאירים',                 breadcrumb: _bc_adv,     url: SEARCH_BASE + _nvs + '#nvs-adv-survivors',     aliases: 'שאירים שארים' },

  // nvs-risks
  { term: 'קצבת נכות',                    breadcrumb: _bc_risks,   url: SEARCH_BASE + _nvs + '#nvs-risks-disability' },
  { term: 'קצבת שאירים',                  breadcrumb: _bc_risks,   url: SEARCH_BASE + _nvs + '#nvs-risks-survivors',   aliases: 'שארים' },

  // nvs-switch
  { term: 'בחר בנכות – מה קורה לשאירים?',  breadcrumb: _bc_switch,  url: SEARCH_BASE + _nvs + '#nvs-switch-to-disability', aliases: 'שארים' },
  { term: 'בחר בשאירים – מה קורה לנכות?',  breadcrumb: _bc_switch,  url: SEARCH_BASE + _nvs + '#nvs-switch-to-survivors',  aliases: 'שארים' },

  // nvs-additional
  { term: 'א. מה קורה בגיל הפרישה?',               breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-a', aliases: 'פרישה' },
  { term: 'ב. נכות פחות מ-90 יום לפני גיל הפרישה', breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-b', aliases: 'פרישה' },
  { term: 'ג. שאירים + שירותים מיוחדים (שר"מ)',     breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-c', aliases: 'שארים שרותים שרמ' },
  { term: 'ד. ביטוח פנסיוני משלים',                 breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-d', aliases: 'בטוח' },
  { term: 'ה. אלמן (לא אלמנה) – הבדלים חשובים',    breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-e' },
  { term: 'ו. יציבות הזכות בהיעדר ביטוח שאירים',   breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-f', aliases: 'שארים בטוח' },
  { term: 'ז. השפעת נישואין חוזרים',                breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-g', aliases: 'נישואים' },
  { term: 'ח. הכנסות מנכסים ומשכר מול בחירת קצבה', breadcrumb: _bc_add, url: SEARCH_BASE + _nvs + '#nvs-add-h' },

  // gimlat_zikna_meyuchedet — חלק א׳
  { term: '⚖️ הבסיס החוקי',  breadcrumb: _bc_gzm,  url: SEARCH_BASE + _gzm + '#gzm-legal-basis',     aliases: 'הבסיס החוקי בסיס חוקי' },
  { term: '⛔ חשוב',          breadcrumb: _bc_gzm,  url: SEARCH_BASE + _gzm + '#gzm-important' },

  // international_treaties — השוואה וטיפים
  { term: '💡 מסקנה מעשית',  breadcrumb: _bc_intl, url: SEARCH_BASE + _intl + '#intl-conclusion',    aliases: 'מסקנה מעשית' },
  { term: '⚠️ טעות נפוצה',   breadcrumb: _bc_intl, url: SEARCH_BASE + _intl + '#intl-common-mistake', aliases: 'טעות נפוצה' }
];
