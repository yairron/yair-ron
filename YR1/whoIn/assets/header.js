// כותרת + ניווט משותפים לכל דפי "מי נמצא". בדיוק כמו hamburger-nav.js
// ב-BTL: קובץ JS משותף יחיד שמזריק HTML/CSS, כל דף רק טוען אותו ב-<script>
// ולא מעתיק את הקוד. יש לקרוא ל-renderHeader(activePage) אחרי requireAuth()
// בכל דף (activePage אחד מ-'home' | 'groups' | 'archive' | 'admin' | null).

async function renderHeader(activePage) {
  const container = document.getElementById('app-header');
  if (!container) return;

  container.innerHTML = `
    <div class="app-header">
      <div class="app-header-top">
        <h1 class="app-title">מי נמצא</h1>
        <button type="button" id="logout-btn" class="btn btn-ghost">התנתקות</button>
      </div>
      <nav class="app-nav">
        <a href="index.html" data-page="home" class="nav-btn">בית</a>
        <a href="groups.html" data-page="groups" class="nav-btn">קבוצות</a>
        <a href="archive.html" data-page="archive" class="nav-btn">ארכיון</a>
        <a href="admin.html" data-page="admin" class="nav-btn nav-admin-only" hidden>מנהל מערכת</a>
      </nav>
    </div>
  `;

  container.querySelectorAll('.nav-btn').forEach((el) => {
    if (el.dataset.page === activePage) el.classList.add('active');
  });

  document.getElementById('logout-btn').addEventListener('click', signOut);

  const profile = await getMyProfile();
  if (profile && profile.is_admin) {
    container.querySelectorAll('.nav-admin-only').forEach((el) => {
      el.hidden = false;
    });
  }

  return profile;
}
