// accordion-widget.js — מנגנון האקורדיונים (toggleAcc + תתי-אקורדיונים + תפריט צד)
// עבור משפחת BTL/additional_guides/html/*.html בלבד.
//
// עד עכשיו כל אחד מ-16 עמודי המשפחה הזו הכיל עותק מודבק בנפרד (byte-identical)
// של הבלוק הזה. חולץ לכאן ב-28.07.2026 כדי שלא יהיה עוד צורך לסנכרן ידנית
// 16 עותקים בכל שינוי — ראו ההחלטה בעניין תכונת החיפוש מבוסס-תוכן ב-
// BTL/claude_last_chat.md ("סעיף 4 - JS משותף").
//
// לוגיקת הפתיחה/סגירה כאן נשארה מילה-במילה זהה למה שהיה מודבק בכל עמוד —
// זה לא שינוי התנהגות, רק חילוץ. לא נטען במשפחות התבנית האחרות (פיילוט /
// config+embedded) כדי לא ליצור התנגשות מול מנגנון הקליקים הקיים שלהן
// (initAccordions() שם כבר מצרפת מאזין קליק לכל כותרת בנפרד — טעינה כפולה
// של מאזין-קליק גלובלי נוסף על תתי-אקורדיונים הייתה גורמת לטריגר כפול/פתיחה-
// וסגירה-מיידית בלחיצה אחת).

function toggleAcc(header) {
  var acc = header.closest('.accordion');
  var wasActive = acc.classList.contains('active');
  var container = acc.parentElement;
  container.querySelectorAll(':scope>.accordion.active').forEach(function (a) { if (a !== acc) a.classList.remove('active'); });
  acc.classList.toggle('active', !wasActive);
  if (!wasActive) { setTimeout(function () { acc.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }
}
document.addEventListener('click', function (e) {
  var h = e.target.closest('.sub-accordion-header');
  if (!h) return;
  e.stopPropagation();
  var sa = h.closest('.sub-accordion');
  var wasActive = sa.classList.contains('active');
  var parent = sa.parentElement;
  parent.querySelectorAll(':scope>.sub-accordion.active').forEach(function (a) { if (a !== sa) a.classList.remove('active'); });
  sa.classList.toggle('active', !wasActive);
});
function openMenu() { document.getElementById('sideMenu').classList.add('open'); document.getElementById('menuOverlay').classList.add('open'); }
function closeMenu() { document.getElementById('sideMenu').classList.remove('open'); document.getElementById('menuOverlay').classList.remove('open'); }
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('menuOverlay');
  if (overlay) overlay.addEventListener('click', closeMenu);
});
