// search-widget.js — ווידג'ט חיפוש, נתונים מתפריט ההמבורגר

var SEARCH_BASE = (typeof SEARCH_BASE_PATH !== 'undefined') ? SEARCH_BASE_PATH : '';

// ── בניית SEARCH_CONCEPTS מעץ התפריט ────────────────────────────────────────
// סורק רקורסיבית את MENU מ-hamburger-nav.js.
// כל עלה (פריט עם href ללא children) הופך לפריט חיפוש.

function buildSearchConcepts(items, ancestors) {
  var result = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.children) {
      result = result.concat(
        buildSearchConcepts(item.children, ancestors.concat([item.text]))
      );
    } else if (item.href) {
      result.push({
        term: item.text,
        breadcrumb: ancestors.slice(),
        url: item.href,
        external: !!item.external
      });
    }
  }
  return result;
}

var SEARCH_CONCEPTS = (typeof window.HNAV_MENU !== 'undefined')
  ? buildSearchConcepts(window.HNAV_MENU, [])
  : [];

if (typeof window.SEARCH_EXTRA !== 'undefined') {
  SEARCH_CONCEPTS = SEARCH_CONCEPTS.concat(window.SEARCH_EXTRA);
}

// ── עיבוד שאילתה ─────────────────────────────────────────────────────────────

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

// ── ממשק החיפוש ──────────────────────────────────────────────────────────────

function filterConcepts(query) {
  var q = query.trim();
  var clearBtn = document.getElementById('searchClear');
  var results  = document.getElementById('searchResults');
  clearBtn.style.display = q ? 'block' : 'none';
  if (!q) { results.hidden = true; return; }

  var tokens = parseQuery(q);

  function itemFullText(c) {
    return c.term + ' ' + c.breadcrumb.join(' ') + (c.aliases ? ' ' + c.aliases : '');
  }

  var matches = SEARCH_CONCEPTS.filter(function(c) {
    return textMatchesTokens(itemFullText(c), tokens);
  });

  var html = '';
  if (matches.length) {
    html += '<div class="search-count">נמצאו ' + matches.length + ' תוצאות בתפריט</div>';
    matches.forEach(function(c) {
      var target = c.external ? ' target="_blank" rel="noopener"' : '';
      var breadcrumbHtml = c.breadcrumb.length
        ? ' <span class="link-ctx">' + c.breadcrumb.map(function(p) {
            return '&rsaquo; ' + highlight(p, q);
          }).join(' ') + '</span>'
        : '';
      html += '<div class="search-result-item">'
        + '<div class="search-result-links">'
        + '<a href="' + c.url + '"' + target + '>'
        + highlight(c.term, q) + breadcrumbHtml
        + '</a>'
        + '</div>'
        + '</div>';
    });
  }
  html += '<div id="contentResults"></div>';

  results.hidden = false;
  results.innerHTML = html;

  renderContentResults(q, tokens, matches);
}

// ── חיפוש מבוסס-תוכן (search-index.json, נבנה ע"י build_search_index.py) ───
//
// חיפוש בתוכן העמודים עצמו (לא רק בתוויות התפריט) - נטען עצלנית (רק
// בהקלדה ראשונה, לא בטעינת העמוד) כדי לא להכביד על כל עמוד עבור מי
// שלא משתמש בחיפוש. ראו BTL/claude_last_chat.md לדיון המלא.

var CONTENT_INDEX = null;
var CONTENT_INDEX_LOADING = false;
var CONTENT_INDEX_WAITERS = [];

function ensureContentIndex(callback) {
  if (CONTENT_INDEX) { callback(); return; }
  CONTENT_INDEX_WAITERS.push(callback);
  if (CONTENT_INDEX_LOADING) return;
  CONTENT_INDEX_LOADING = true;
  fetch(SEARCH_BASE + 'senior_rights/data/search-index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) { CONTENT_INDEX = data; })
    .catch(function() { CONTENT_INDEX = []; })
    .then(function() {
      CONTENT_INDEX_LOADING = false;
      var waiters = CONTENT_INDEX_WAITERS;
      CONTENT_INDEX_WAITERS = [];
      waiters.forEach(function(fn) { fn(); });
    });
}

function buildSnippet(text, tokens, q) {
  var idx = -1;
  tokens.forEach(function(t) {
    var pos = text.indexOf(t.text);
    if (pos !== -1 && (idx === -1 || pos < idx)) idx = pos;
  });
  if (idx === -1) idx = 0;
  var start = Math.max(0, idx - 60);
  var end = Math.min(text.length, idx + 160);
  var snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  return highlight(snippet, q);
}

function isStrictAncestorPath(shorter, longer) {
  if (shorter.length >= longer.length) return false;
  for (var i = 0; i < shorter.length; i++) {
    if (shorter[i] !== longer[i]) return false;
  }
  return true;
}

// מפרקת רשימת ערכים תואמים (לעמוד אחד) ל"חזית" התוצאות הראויות להצגה.
//
// שרשרת יחידה (הורה→ילד→נכד, כל אחד תואם, אף אחד עם ענף אחר) - מוצגת
// רק ברמה הגבוהה ביותר (התוכן העמוק הוא בעיקרו אותה הרחבה של אותו נושא).
// אבל אקורדיון עם כמה ילדים תואמים *שונים* (למשל קטגוריית FAQ עם שתי
// שאלות נפרדות שכל אחת מכילה את מונח החיפוש) - לא מתכווץ לקטגוריה
// (הצגה כזו הייתה מסתירה שאלה שלמה ומחליפה אותה בקטע-טקסט אקראי מהשאלה
// האחרת) - במקום זה "מתפצל" ומציג כל ענף בנפרד (רקורסיבית, לפי אותו כלל).
function resolveMatchFrontier(matches) {
  function nearestAncestor(entry) {
    var best = null;
    matches.forEach(function(other) {
      if (other === entry) return;
      if (isStrictAncestorPath(other.normPath, entry.normPath)) {
        if (!best || other.normPath.length > best.normPath.length) best = other;
      }
    });
    return best;
  }

  var childrenOf = [];
  var childKeys = [];
  var roots = [];

  function childrenFor(entry) {
    var idx = childKeys.indexOf(entry);
    return idx === -1 ? [] : childrenOf[idx];
  }
  function addChild(parent, child) {
    var idx = childKeys.indexOf(parent);
    if (idx === -1) { childKeys.push(parent); childrenOf.push([child]); }
    else { childrenOf[idx].push(child); }
  }

  matches.forEach(function(entry) {
    var anc = nearestAncestor(entry);
    if (anc) addChild(anc, entry);
    else roots.push(entry);
  });

  function resolve(entry) {
    var children = childrenFor(entry);
    if (children.length <= 1) return [entry];
    var out = [];
    children.forEach(function(c) { out = out.concat(resolve(c)); });
    return out;
  }

  var result = [];
  roots.forEach(function(r) { result = result.concat(resolve(r)); });
  return result;
}

function renderContentResults(q, tokens, menuMatches) {
  var container = document.getElementById('contentResults');
  if (!container) return;

  if (!CONTENT_INDEX) {
    ensureContentIndex(function() {
      var inp = document.getElementById('conceptSearch');
      if (inp && inp.value.trim() === q) renderContentResults(q, tokens, menuMatches);
    });
    return;
  }

  var usedUrls = {};
  menuMatches.forEach(function(c) { usedUrls[c.url.split('#')[0].split('?')[0]] = true; });

  var pageMatches = {};
  CONTENT_INDEX.forEach(function(entry) {
    if (textMatchesTokens(entry.text, tokens)) {
      (pageMatches[entry.page] = pageMatches[entry.page] || []).push(entry);
    }
  });

  // דה-דופליקציה (ראו resolveMatchFrontier למעלה): מכווצת שרשרת הורים-ילדים
  // יחידה לאב הגבוה ביותר, אבל שומרת ענפים נפרדים כשיש כמה ילדים תואמים
  // שונים תחת אותו אב (כי הטקסט המאונדקס כולל תמיד את תוכן הצאצאים -
  // ראו accordion-search-nav.js - כך שאב עם כמה ילדים תואמים תמיד יתאים
  // בעצמו גם כן, בלי שזה אומר שהילדים כפולים זה של זה).
  var finalEntries = [];
  Object.keys(pageMatches).forEach(function(page) {
    finalEntries = finalEntries.concat(resolveMatchFrontier(pageMatches[page]));
  });

  finalEntries = finalEntries.filter(function(e) {
    return !usedUrls[SEARCH_BASE + e.page];
  });

  if (!finalEntries.length) {
    if (!menuMatches.length) {
      var results = document.getElementById('searchResults');
      if (results) results.innerHTML = '<div class="search-no-results">לא נמצאו תוצאות עבור "' + q + '"</div>';
    }
    return;
  }

  var html = '<div class="search-count">נמצאו ' + finalEntries.length + ' תוצאות מתוך תוכן העמודים</div>';
  finalEntries.forEach(function(entry) {
    var url = SEARCH_BASE + entry.page + '?openPath=' + entry.normPath.map(encodeURIComponent).join('|||');
    var title = entry.rawPath[entry.rawPath.length - 1];
    var breadcrumbHtml = entry.rawPath.length > 1
      ? '<div class="link-ctx">' + entry.rawPath.slice(0, -1).map(function(p) {
          return '&rsaquo; ' + p;
        }).join(' ') + '</div>'
      : '';
    html += '<div class="search-result-item">'
      + '<a class="search-content-link" href="' + url + '">'
      + '<div class="search-result-term">' + highlight(title, q) + '</div>'
      + breadcrumbHtml
      + '<div class="search-result-snippet">' + buildSnippet(entry.text, tokens, q) + '</div>'
      + '</a>'
      + '</div>';
  });
  container.innerHTML = html;
}

function clearSearch() {
  var inp = document.getElementById('conceptSearch');
  inp.value = '';
  inp.focus();
  filterConcepts('');
}
