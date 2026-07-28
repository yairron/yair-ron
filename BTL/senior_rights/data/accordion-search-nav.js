// accordion-search-nav.js — אינדוקס תוכן אקורדיונים + ניווט "פתח לפי נתיב".
//
// קובץ משותף לשלוש משפחות התבנית באתר (פיילוט / config+embedded / additional_guides) —
// כולן חולקות את אותה מוסכמת מחלקות CSS ל-DOM (.accordion/.accordion-header/
// .accordion-title/.accordion-content/.accordion-body וכנ"ל ב-sub-accordion, עם
// data-level על תתי-אקורדיונים מקוננים), גם כשמנגנון הבנייה/הפתיחה שלהן שונה.
//
// חשוב: זהו המקור היחיד ל-normalizeTitle()/extractSearchEntries(). הפייתון
// (build_search_index.py) לא מממש גרסה מקבילה משלו בפייתון — הוא מזריק את
// הקובץ הזה בדיוק לתוך הדף דרך Playwright (page.add_script_tag) ומריץ בו את
// extractSearchEntries(). כך הבנייה (build-time) וההפעלה בדפדפן האמיתי
// (openFromPath, runtime) תמיד משתמשות באותה נורמליזציה מילה-במילה — אם הן
// היו משוכפלות בשתי שפות, כל סטייה קטנה הייתה גורמת להתאמות ליפול בשקט
// (בדיוק הסיכון שכבר זוהה מראש בתכנון התכונה הזו).
//
// לא נוגע בטיפול בקליקים (toggleAcc וכו') — זה נשאר בכל משפחה בנפרד (ראו
// accordion-widget.js עבור additional_guides בלבד), כדי לא ליצור התנגשות
// מאזיני-קליק כפולים מול הקוד הקיים במשפחות הפיילוט/config+embedded.

(function (global) {
  'use strict';

  function normalizeTitle(text) {
    if (!text) return '';
    var t = String(text).replace(/\s+/g, ' ').trim();
    // מספור/אות מובילים בסגנון "1. " / "א. " / "12) "
    t = t.replace(/^[\dא-ת]{1,3}[.)]\s+/, '');
    // אימוג'י/סימנים מובילים (כל תו שאינו אות/ספרה לטיניים או עבריים)
    t = t.replace(/^[^\w֐-׿]+/, '');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  }

  function directTitleText(el, headerClass, titleClass) {
    var header = el.querySelector(':scope > .' + headerClass);
    if (!header) return '';
    var titleEl = header.querySelector('.' + titleClass);
    var raw = titleEl ? titleEl.textContent : header.textContent;
    return (raw || '').replace(/\s+/g, ' ').trim();
  }

  function classesFor(el) {
    var isTop = el.classList.contains('accordion');
    return {
      isTop: isTop,
      headerClass: isTop ? 'accordion-header' : 'sub-accordion-header',
      titleClass: isTop ? 'accordion-title' : 'sub-accordion-title',
      contentClass: isTop ? 'accordion-content' : 'sub-accordion-content',
      bodyClass: isTop ? 'accordion-body' : 'sub-accordion-body'
    };
  }

  function bodyOf(el) {
    var c = classesFor(el);
    return el.querySelector(':scope > .' + c.contentClass + ' > .' + c.bodyClass);
  }

  // ── חילוץ אינדקס חיפוש (משמש רק בזמן בנייה, דרך Playwright) ─────────────
  //
  // גרנולריות: כל אקורדיון/תת-אקורדיון (בכל עומק) הוא ערך אחד באינדקס —
  // לא ברמת li/p. הטקסט הנשמר לכל ערך הוא ה-textContent המלא של הגוף שלו,
  // וזה *כולל* בהכרח את הטקסט של כל תתי-האקורדיונים המקוננים בתוכו (כי הם
  // ילדים ממשיים ב-DOM) — כלומר אותו מונח שמופיע בעומק, יתאים גם לכל אקורדיון
  // אב בשרשרת שמעליו. זה מכוון: openFromPath (למטה) יכול לפתוח את השרשרת
  // המדויקת, ובזמן החיפוש (search-widget.js) יש לסנן ולהשאיר רק את האקורדיון
  // הגבוה ביותר בשרשרת שמכיל התאמה — לא נעשה כאן, זו אחריות קוד החיפוש.
  function extractSearchEntries() {
    var entries = [];

    function walk(el, rawPath, normPath) {
      var c = classesFor(el);
      var rawTitle = directTitleText(el, c.headerClass, c.titleClass);
      var normTitle = normalizeTitle(rawTitle);
      var newRawPath = rawPath.concat([rawTitle]);
      var newNormPath = normPath.concat([normTitle]);

      var body = bodyOf(el);
      var text = body ? (body.textContent || '').replace(/\s+/g, ' ').trim() : '';

      if (text && normTitle) {
        entries.push({ rawPath: newRawPath, normPath: newNormPath, text: text });
      }

      if (body) {
        body.querySelectorAll(':scope > .sub-accordion').forEach(function (child) {
          walk(child, newRawPath, newNormPath);
        });
      }
    }

    document.querySelectorAll('.accordion').forEach(function (top) {
      walk(top, [], []);
    });

    return entries;
  }

  // ── ניווט "פתח לפי נתיב" (פועל בדפדפן אמיתי, בזמן קליק על תוצאת חיפוש) ──
  //
  // קורא פרמטר ?openPath=כותרת1|||כותרת2|||כותרת3 (מקודדות, מנורמלות מראש
  // באינדקס עצמו). מוצא את האקורדיון הראשי שכותרתו (מנורמלת) תואמת לחלק
  // הראשון, פותח אותו, ואז יורד בהתאמה בתוך תתי-האקורדיונים שלו לפי שאר
  // החלקים — כמו openFromHash() הקיים במשפחת הפיילוט, אבל לפי טקסט כותרת
  // ולא לפי id (כי לרוב הכותרות באתר אין id יציב, ובוודאי לא במשפחת
  // additional_guides שאין לה בכלל מנגנון עוגנים היום).
  function closeAllActive() {
    document.querySelectorAll('.accordion.active, .sub-accordion.active').forEach(function (a) {
      a.classList.remove('active');
    });
  }

  function findMatchingChild(container, normTarget) {
    var candidates = container.querySelectorAll(':scope > .sub-accordion');
    for (var i = 0; i < candidates.length; i++) {
      var child = candidates[i];
      var c = classesFor(child);
      if (normalizeTitle(directTitleText(child, c.headerClass, c.titleClass)) === normTarget) {
        return child;
      }
    }
    return null;
  }

  function openFromPath() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return;
    }
    var raw = params.get('openPath');
    if (!raw) return;

    var segments = raw.split('|||')
      .map(function (s) { try { return normalizeTitle(decodeURIComponent(s)); } catch (e) { return ''; } })
      .filter(Boolean);
    if (!segments.length) return;

    var tops = document.querySelectorAll('.accordion');
    var current = null;
    for (var i = 0; i < tops.length; i++) {
      var c = classesFor(tops[i]);
      if (normalizeTitle(directTitleText(tops[i], c.headerClass, c.titleClass)) === segments[0]) {
        current = tops[i];
        break;
      }
    }
    if (!current) return;

    closeAllActive();
    current.classList.add('active');

    for (var s = 1; s < segments.length; s++) {
      var body = bodyOf(current);
      if (!body) break;
      var next = findMatchingChild(body, segments[s]);
      if (!next) break;
      next.classList.add('active');
      current = next;
    }

    var target = current;
    setTimeout(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 450);
  }

  global.normalizeTitle = normalizeTitle;
  global.extractSearchEntries = extractSearchEntries;
  global.openFromPath = openFromPath;

  // הפעלה עצמית: בעמודי additional_guides (תוכן סטטי, התג יושב ממש לפני
  // </body>) זה כל מה שצריך. בעמודי פיילוט/config+embedded (תוכן שנבנה
  // דינמית ב-JS אחרי fetch) קריאה כאן תמצא DOM ריק ותצא בלי אפקט בשקט —
  // יש להוסיף שם קריאה מפורשת ל-openFromPath() אחרי הבנייה, ליד openFromHash()
  // הקיים (ראו התיעוד בקובץ ה-HTML של כל עמוד ממשפחות אלה).
  openFromPath();
})(window);
