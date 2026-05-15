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

  if (!matches.length) {
    results.hidden = false;
    results.innerHTML = '<div class="search-no-results">לא נמצאו תוצאות עבור "' + q + '"</div>';
    return;
  }

  var html = '<div class="search-count">נמצאו ' + matches.length + ' תוצאות</div>';
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
  results.hidden = false;
  results.innerHTML = html;
}

function clearSearch() {
  var inp = document.getElementById('conceptSearch');
  inp.value = '';
  inp.focus();
  filterConcepts('');
}
