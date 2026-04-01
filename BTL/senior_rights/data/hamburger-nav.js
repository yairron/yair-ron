(function () {
    'use strict';

    // ─── 1a: basePath detection ───────────────────────────────────────────────
    // All links in MENU are written relative to BTL/.
    // basePath is the prefix needed to reach BTL/ from the current file.
    function getBasePath() {
        const path = window.location.pathname.replace(/\\/g, '/');
        if (path.match(/\/senior_rights\/data\//)) return '../../';
        if (path.match(/\/senior_rights\//))       return '../';
        if (path.match(/\/new_immigrants\//))       return '../';
        if (path.match(/\/support_files\//))        return '../';
        return '';
    }
    const bp = getBasePath();

    // ─── Menu data (all links relative to BTL/) ───────────────────────────────
    const MENU = [
        { icon: '🏠', text: 'דף ראשי',                   href: bp + 'index.html' },
        { icon: '🌟', text: 'זכויות אזרחים ותיקים',    href: bp + 'senior_rights/senior_rights_full.html' },
        {
            icon: '🌍', text: 'זכויות עולים חדשים', children: [
                { icon: '🌍', text: 'זכויות עולים חדשים',      href: bp + 'new_immigrants/new_immigrants_full.html' },
                { icon: '👴', text: 'גמלת זיקנה מיוחדת',       href: bp + 'new_immigrants/gimlat_zikna_meyuchedet.html' },
            ]
        },
        { icon: '🔗', text: 'קישורים חשובים',           href: bp + 'senior_rights/important-links.html' },
        { icon: '📋', text: 'טפסי ביטוח לאומי',         href: bp + 'senior_rights/forms.html' },
        {
            icon: '📖', text: 'מדריכים מפורטים', children: [
                { icon: '📘', text: 'זכויות אזרחים ותיקים 2026',    href: bp + 'senior_rights/senior_citizens_rights_2026.html' },
                { icon: '👨‍👩‍👧', text: 'מדריך קצבת שאירים 2026',       href: bp + 'senior_rights/survivors_benefits_guide_2026.html' },
                { icon: '👩', text: 'מדריך מענק מעבר לנשים',         href: bp + 'senior_rights/women_transition_benefit_guide.html' },
                { icon: '🏥', text: 'מדריך מוסד אישפוז',             href: bp + 'senior_rights/nursing_home_guide.html' },
                { icon: '🕯️', text: 'מדריך ניצולי שואה',             href: bp + 'senior_rights/holocaust_survivors_rights.html' },
            ]
        },
        {
            icon: '🛠️', text: 'כלי עזר', children: [
                { icon: '🪪', text: 'בדיקת תעודת זהות',              href: bp + 'senior_rights/id-check.html' },
                { icon: '👩', text: 'מחשבון גיל פרישה לנשים',        href: bp + 'senior_rights/retirement-calculator.html' },
                { icon: '🔢', text: 'מחשבון האפשרות לקבל יותר מקצבה אחת', href: bp + 'support_files/benefit-combinations.html' },
                { icon: '📚', text: 'רשימת קצבאות ותשלומים',         href: bp + 'senior_rights/benefits-index.html' },
                { icon: '📄', text: 'מסמכי מקורות מידע',             href: bp + 'Information_Sources.html' },
                {
                    icon: '🧮', text: 'מחשבוני הביטוח הלאומי', children: [
                        { icon: '📋', text: 'רשימת מחשבונים',                href: 'https://www.btl.gov.il/Simulators/Pages/default.aspx', external: true },
                        { icon: '👴', text: 'מחשבון אזרח ותיק',             href: 'https://www.btl.gov.il/Simulators/ziknaCalc/Pages/default.aspx', external: true },
                        { icon: '👴', text: 'מחשבון תוספת ותק',             href: 'https://www.btl.gov.il/Simulators/ziknaCalc/Pages/vetek.aspx', external: true },
                        { icon: '🔍', text: 'בדיקת שתי קצבאות',             href: 'https://www.btl.gov.il/Simulators/Pages/bdikatZakauutLshteGimlaoot.aspx', external: true },
                        { icon: '💰', text: 'מחשבון השלמת הכנסה',           href: 'https://www.btl.gov.il/Simulators/Pages/IncomeSupportCalc.aspx', external: true },
                        { icon: '🏥', text: 'מחשבון סיעוד',                  href: 'https://www.btl.gov.il/Simulators/SiudCalculators/Pages/default.aspx', external: true },
                        { icon: '👨‍👩‍👧', text: 'מחשבון שאירים',                href: 'https://www.btl.gov.il/Simulators/Pages/SherimIndexCalc.aspx', external: true },
                        { icon: '♿', text: 'מחשבון נכות כללית',             href: 'https://www.btl.gov.il/Simulators/NehutIndex/Pages/default.aspx', external: true },
                        { icon: '🚗', text: 'מחשבון ניידות',                 href: 'https://www.btl.gov.il/Simulators/NayadutCalc/Pages/default.aspx', external: true },
                        { icon: '⚠️', text: 'מחשבון נפגעי עבודה',           href: 'https://www.btl.gov.il/Simulators/n_advoda/Pages/default.aspx', external: true },
                        { icon: '🛡️', text: 'מחשבון נפגעי פעולות איבה',     href: 'https://www.btl.gov.il/Simulators/peulotEiva/Pages/default.aspx', external: true },
                    ]
                },
                { icon: '💰', text: 'בדיקת זכאות להשלמת הכנסה',     href: bp + 'senior_rights/questionnaire.html?id=income-supplement-eligibility' },
                { icon: '👶', text: 'הגדרת ילד להשלמת הכנסה',        href: bp + 'senior_rights/questionnaire.html?id=child-definition&hideReturn=true' },
                { icon: '🚗', text: 'זכאות להשלמת הכנסה עם רכב',     href: bp + 'senior_rights/questionnaire.html?id=vehicle-income-supplement' },
                { icon: '🏠', text: 'חישוב הכנסה רעיונית מנכסים',    href: bp + 'senior_rights/questionnaire.html?id=imputed-income-calculator' },
                { icon: '📜', text: 'הגדרת תלויים בקצבת זיקנה',      href: bp + 'senior_rights/dependents_definition_old_age_survivors.html' },
                { icon: '📝', text: 'טופס פניה לייעוץ בל/4300',       href: bp + 'senior_rights/counseling_referral_form.html' },
            ]
        },
        {
            icon: '📊', text: 'עדכוני ביטוח לאומי 2026', children: [
                { icon: '✅', text: 'עדכון 01.2026 קצבאות זקנה ושאירים', href: bp + 'senior_rights/data/data_202601.html' },
            ]
        },
    ];

    // ─── 1b: CSS ──────────────────────────────────────────────────────────────
    function buildCSS() {
        return `
        /* ── Hamburger Nav shared styles ── */

        .hnav-hamburger-btn {
            position: fixed;
            right: 44px;
            top: 18px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 10px;
            color: white;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.4rem;
            z-index: 200;
            transition: background 0.2s;
            line-height: 1;
        }
        .hnav-hamburger-btn:hover { background: rgba(255,255,255,0.35); }

        .hnav-back-btn {
            position: fixed;
            left: 44px;
            top: 18px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: 10px;
            color: white;
            padding: 8px 14px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 700;
            font-family: inherit;
            z-index: 200;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
            line-height: 1;
        }
        .hnav-back-btn:hover { background: rgba(255,255,255,0.35); }

        .hnav-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9000;
        }
        .hnav-overlay.open { display: block; }

        .hnav-panel {
            position: fixed;
            top: 0;
            right: -360px;
            width: 340px;
            max-width: 90vw;
            height: 100vh;
            background: white;
            z-index: 9001;
            overflow-y: auto;
            transition: right 0.3s ease;
            box-shadow: -4px 0 24px rgba(0,0,0,0.2);
            direction: rtl;
            display: flex;
            flex-direction: column;
        }
        .hnav-panel.open { right: 0; }

        .hnav-panel-header {
            background: linear-gradient(135deg, #2E5B8A, #4A90B5);
            color: white;
            padding: 16px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .hnav-panel-title {
            font-size: 1.2rem;
            font-weight: 700;
        }
        .hnav-close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 34px;
            height: 34px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .hnav-close-btn:hover { background: rgba(255,255,255,0.35); }

        .hnav-menu { padding: 8px 0; flex: 1; }

        /* Direct link items */
        .hnav-item a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 18px;
            color: #2C3E50;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            transition: background 0.15s;
            border-right: 3px solid transparent;
        }
        .hnav-item a:hover {
            background: #e3f2fd;
            border-right-color: #4A90B5;
        }

        /* Section headers (depth 0) */
        .hnav-section-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px 6px;
            color: #2E5B8A;
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 0.4px;
            text-transform: uppercase;
            cursor: pointer;
            border-top: 1px solid #e0e8f0;
            margin-top: 4px;
            user-select: none;
        }
        .hnav-section-label:hover { background: #f5f9fc; }
        .hnav-section-label-inner { display: flex; align-items: center; gap: 8px; }

        /* Sub-section headers (depth 1+) */
        .hnav-sub-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 18px 7px 18px;
            color: #1565C0;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            background: #f0f7ff;
            user-select: none;
        }
        .hnav-sub-label:hover { background: #deeeff; }
        .hnav-sub-label-inner { display: flex; align-items: center; gap: 8px; }

        /* Collapse arrow */
        .hnav-arrow {
            font-size: 0.72rem;
            transition: transform 0.2s;
            color: #4A90B5;
            flex-shrink: 0;
        }
        .hnav-label-collapsed .hnav-arrow { transform: rotate(-90deg); }

        /* Collapsible wrappers */
        .hnav-children {
            overflow: hidden;
            transition: max-height 0.25s ease;
        }
        .hnav-children.expanded  { max-height: 2000px; }
        .hnav-children.collapsed { max-height: 0; }

        /* Sub-level items — slightly indented */
        .hnav-sub-items .hnav-item a {
            padding-right: 34px;
            font-size: 0.92rem;
            font-weight: 500;
        }
        .hnav-sub-sub-items .hnav-item a {
            padding-right: 48px;
            font-size: 0.85rem;
            font-weight: 400;
            color: #1565C0;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .hnav-panel { width: 88vw; }
            .hnav-hamburger-btn { width: 38px; height: 38px; font-size: 1.15rem; right: 8px; }
            .hnav-back-btn { left: 8px; font-size: 0.85rem; padding: 6px 10px; }
            .hnav-item a { font-size: 0.95rem; }
        }
        `;
    }

    // ─── 1c: Build HTML ───────────────────────────────────────────────────────
    function buildMenuHTML(items, depth) {
        let html = '';
        for (const item of items) {
            if (item.children) {
                const isTop   = depth === 0;
                const labelCls = isTop ? 'hnav-section-label' : 'hnav-sub-label';
                const innerCls = isTop ? 'hnav-section-label-inner' : 'hnav-sub-label-inner';
                // All sections start collapsed — click to expand
                const childState = 'collapsed';
                const arrowState = 'hnav-label-collapsed';
                const subItemsCls = isTop ? 'hnav-sub-items' : 'hnav-sub-sub-items';

                html += `
                <div>
                    <div class="${labelCls} ${arrowState}" onclick="hnavToggle(this)">
                        <span class="${innerCls}">${item.icon} ${item.text}</span>
                        <span class="hnav-arrow">▾</span>
                    </div>
                    <div class="hnav-children ${childState} ${subItemsCls}">
                        ${buildMenuHTML(item.children, depth + 1)}
                    </div>
                </div>`;
            } else {
                const target = item.external ? ' target="_blank" rel="noopener"' : '';
                html += `
                <div class="hnav-item">
                    <a href="${item.href}"${target}>${item.icon} ${item.text}</a>
                </div>`;
            }
        }
        return html;
    }

    function inject() {
        // Inject CSS
        const style = document.createElement('style');
        style.textContent = buildCSS();
        document.head.appendChild(style);

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'hnav-overlay';
        overlay.id = 'hnavOverlay';
        overlay.addEventListener('click', closeMenu);
        document.body.appendChild(overlay);

        // Side panel
        const panel = document.createElement('div');
        panel.className = 'hnav-panel';
        panel.id = 'hnavPanel';
        panel.innerHTML = `
            <div class="hnav-panel-header">
                <span class="hnav-panel-title">🏛️ ניווט מהיר</span>
                <button class="hnav-close-btn" onclick="hnavCloseMenu()" aria-label="סגור תפריט">✕</button>
            </div>
            <div class="hnav-menu">
                ${buildMenuHTML(MENU, 0)}
            </div>
        `;
        document.body.appendChild(panel);

        // Add buttons — appended to body (fixed-position, so parent doesn't matter)
        // Hamburger (right)
        const btn = document.createElement('button');
        btn.className = 'hnav-hamburger-btn';
        btn.setAttribute('aria-label', 'פתח תפריט ניווט');
        btn.innerHTML = '&#9776;';
        btn.addEventListener('click', openMenu);
        document.body.appendChild(btn);

        // Back arrow (left)
        const back = document.createElement('button');
        back.className = 'hnav-back-btn';
        back.setAttribute('aria-label', 'חזור לדף הקודם');
        back.innerHTML = '&#8592; חזור';
        back.addEventListener('click', function () { history.back(); });
        document.body.appendChild(back);
    }

    // ─── 1d: Open / close / toggle ───────────────────────────────────────────
    function openMenu() {
        document.getElementById('hnavPanel').classList.add('open');
        document.getElementById('hnavOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        document.getElementById('hnavPanel').classList.remove('open');
        document.getElementById('hnavOverlay').classList.remove('open');
        document.body.style.overflow = '';
    }

    // Exposed globals (called from inline onclick attributes)
    window.hnavCloseMenu = closeMenu;
    window.hnavOpenMenu  = openMenu;

    window.hnavToggle = function (labelEl) {
        const children = labelEl.nextElementSibling;
        const expanding = children.classList.contains('collapsed');
        if (expanding) {
            children.classList.replace('collapsed', 'expanded');
            labelEl.classList.remove('hnav-label-collapsed');
        } else {
            children.classList.replace('expanded', 'collapsed');
            labelEl.classList.add('hnav-label-collapsed');
        }
    };

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }

})();
