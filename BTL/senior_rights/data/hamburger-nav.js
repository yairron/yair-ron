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
        {
            icon: '🌟', text: 'זכויות אזרחים ותיקים', children: [
                { text: '👴 קצבת אזרח ותיק', children: [
                    { text: '1.1 גילאי פרישה וזכאות',                              href: bp + 'senior_rights/senior_rights_full.html#op-11' },
                    { text: '1.2 תקופת אכשרה', children: [
                        { text: 'הגדרת "מבוטח" ותשלום דמי ביטוח',                href: bp + 'senior_rights/senior_rights_full.html#op-12a' },
                        { text: 'תקופות הנמנות כתקופת אכשרה',                    href: bp + 'senior_rights/senior_rights_full.html#op-12b' },
                        { text: 'שלוש חלופות לצבירת אכשרה',                      href: bp + 'senior_rights/senior_rights_full.html#op-12c' },
                        { text: 'פטור מתקופת אכשרה',                             href: bp + 'senior_rights/senior_rights_full.html#op-12d' },
                        { text: 'סטטוס עקרת בית',                                href: bp + 'senior_rights/senior_rights_full.html#op-12e' },
                        { text: 'סטטוס רווקה / גרושה / אלמנה',                   href: bp + 'senior_rights/senior_rights_full.html#op-12f' },
                        { text: 'קצבה מיוחדת (למי שלא צבר אכשרה)',               href: bp + 'senior_rights/senior_rights_full.html#op-12g' },
                        { text: 'נקודות בדיקה חשובות לאכשרה',                    href: bp + 'senior_rights/senior_rights_full.html#op-12h' },
                    ]},
                    { text: '1.3 מבחן הכנסות', children: [
                        { text: 'א. הכנסה רק מעבודה', children: [
                            { text: '1. יחיד',                                    href: bp + 'senior_rights/senior_rights_full.html#op-13a1' },
                            { text: '2. נשוי/ה — ב"ז עונה ואינו/ה מקבל/ת קצבה', href: bp + 'senior_rights/senior_rights_full.html#op-13a2' },
                            { text: '3. שני בני הזוג זכאים לקצבה',              href: bp + 'senior_rights/senior_rights_full.html#op-13a3' },
                        ]},
                        { text: 'ב. הכנסה רק מנכסים', children: [
                            { text: '1. יחיד — הכנסה מנכסים',                    href: bp + 'senior_rights/senior_rights_full.html#op-13b1' },
                            { text: '2א. נשוי/ה — ב"ז ואינו/ה מקבל/ת קצבה',     href: bp + 'senior_rights/senior_rights_full.html#op-13b2a' },
                            { text: '2ב. נשוי/ה — ב"ז ומקבל/ת קצבה',             href: bp + 'senior_rights/senior_rights_full.html#op-13b2b' },
                            { text: '3. שני בני הזוג זכאים — מנכסים',            href: bp + 'senior_rights/senior_rights_full.html#op-13b3' },
                        ]},
                        { text: 'ג. הכנסה משולבת (עבודה + נכסים)',                href: bp + 'senior_rights/senior_rights_full.html#op-13c' },
                        { text: 'ד. מה נחשב / לא נחשב הכנסה', children: [
                            { text: '✅ נחשב הכנסה',                              href: bp + 'senior_rights/senior_rights_full.html#op-13d1' },
                            { text: '❌ לא נחשב הכנסה',                           href: bp + 'senior_rights/senior_rights_full.html#op-13d2' },
                        ]},
                        { text: 'ה. תוספת דחייה',                                 href: bp + 'senior_rights/senior_rights_full.html#op-13e' },
                        { text: 'ו. הגדרת בן/ת זוג לצורך התוספת',                href: bp + 'senior_rights/senior_rights_full.html#op-13f' },
                    ]},
                    { text: '1.4 סכומי הקצבה הבסיסית 2026',                       href: bp + 'senior_rights/senior_rights_full.html#op-14' },
                    { text: '1.5 תוספת ותק',                                      href: bp + 'senior_rights/senior_rights_full.html#op-15' },
                    { text: '1.6 תוספת דחיית קצבה',                               href: bp + 'senior_rights/senior_rights_full.html#op-16' },
                    { text: '1.7 תשלום רטרואקטיבי',                               href: bp + 'senior_rights/senior_rights_full.html#op-17' },
                    { text: '1.8 דוגמאות חישוב', children: [
                        { text: 'דוגמה 1: יחיד עם קצבה חלקית',                   href: bp + 'senior_rights/senior_rights_full.html#op-18a' },
                        { text: 'דוגמה 2: זוג שניהם זכאים',                      href: bp + 'senior_rights/senior_rights_full.html#op-18b' },
                        { text: 'דוגמה 3: יחיד עם בן/בת זוג שאינם זכאים',       href: bp + 'senior_rights/senior_rights_full.html#op-18c' },
                        { text: 'דוגמה 4: יחיד עם בן/בת זוג שעובד',             href: bp + 'senior_rights/senior_rights_full.html#op-18d' },
                        { text: 'דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה',     href: bp + 'senior_rights/senior_rights_full.html#op-18e' },
                    ]},
                ]},
                { text: '💰 גמלת השלמת הכנסה', children: [
                    { text: 'תנאי זכאות בסיסיים', children: [
                        { text: 'א. קצבת זיקנה (אזרח ותיק)',                     href: bp + 'senior_rights/senior_rights_full.html#is-cond-a' },
                        { text: 'ב. גמלת שאירים',                                 href: bp + 'senior_rights/senior_rights_full.html#is-cond-b' },
                    ]},
                    { text: 'זכאות זוגית — קצבת זיקנה בלבד', children: [
                        { text: 'א. שני בני הזוג זכאים',                          href: bp + 'senior_rights/senior_rights_full.html#is-couple-a' },
                        { text: 'ב. רק אחד מבני הזוג זכאי',                      href: bp + 'senior_rights/senior_rights_full.html#is-couple-b' },
                    ]},
                    { text: 'סכומים מירביים קצבת זיקנה + השלמת הכנסה',           href: bp + 'senior_rights/senior_rights_full.html#is-max-oldage' },
                    { text: 'סכומים מירביים גמלת שאירים + השלמת הכנסה',         href: bp + 'senior_rights/senior_rights_full.html#is-max-survivors' },
                    { text: 'תקרות הכנסה וחישוב זכאות', children: [
                        { text: '🧮 מחשבון זכאות להשלמת הכנסה',                 href: bp + 'senior_rights/senior_rights_full.html#is-calculator' },
                        { text: '💰 חישוב הכנסה רעיונית מנכסים פיננסיים',       href: bp + 'senior_rights/senior_rights_full.html#is-imputed' },
                        { text: 'בעלות על רכב',                                  href: bp + 'senior_rights/senior_rights_full.html#is-vehicle' },
                    ]},
                    { text: 'דוגמאות לחישוב השלמת הכנסה', children: [
                        { text: 'דוגמה 1 — קצבת זיקנה, יחיד',                    href: bp + 'senior_rights/senior_rights_full.html#is-ex1' },
                        { text: 'דוגמה 2 — קצבת זיקנה, זוג',                     href: bp + 'senior_rights/senior_rights_full.html#is-ex2' },
                        { text: 'דוגמה 3 — גמלת שאירים',                         href: bp + 'senior_rights/senior_rights_full.html#is-ex3' },
                    ]},
                    { text: '✈️ השלמת הכנסה ויציאה לחו"ל', children: [
                        { text: '📋 פירוט מגבלות יציאה לחו"ל',                  href: bp + 'senior_rights/senior_rights_full.html#is-abroad-details' },
                        { text: '📊 סיכום תקופות שהייה בחו"ל',                  href: bp + 'senior_rights/senior_rights_full.html#is-abroad-summary' },
                        { text: '🏥 מקרים מיוחדים בחו"ל',                       href: bp + 'senior_rights/senior_rights_full.html#is-abroad-special' },
                        { text: '👫 בני זוג',                                     href: bp + 'senior_rights/senior_rights_full.html#is-abroad-couple' },
                        { text: '🏠 הגדרת "תושב"',                               href: bp + 'senior_rights/senior_rights_full.html#is-abroad-resident' },
                        { text: '✅ רשימת פעולות לפני יציאה לחו"ל',             href: bp + 'senior_rights/senior_rights_full.html#is-abroad-checklist' },
                        { text: '📩 דרישת החזר — יציאה לחו"ל',                  href: bp + 'senior_rights/senior_rights_full.html#is-abroad-repayment' },
                    ]},
                    { text: '📋 חובת דיווח על שינויים', children: [
                        { text: '⏱ חובת הדיווח — הכלל הבסיסי',                  href: bp + 'senior_rights/senior_rights_full.html#is-report-rule' },
                        { text: '📋 מה חייבים לדווח',                            href: bp + 'senior_rights/senior_rights_full.html#is-report-what' },
                        { text: '🚫 נושאים שאין צורך לדווח',                     href: bp + 'senior_rights/senior_rights_full.html#is-report-exempt' },
                        { text: '💰 בעת שינוי כלכלי',                            href: bp + 'senior_rights/senior_rights_full.html#is-report-financial' },
                        { text: '👨‍👩‍👧 בעת שינוי אישי/משפחתי',                      href: bp + 'senior_rights/senior_rights_full.html#is-report-personal' },
                        { text: '📩 דרישת החזר — חובת דיווח',                    href: bp + 'senior_rights/senior_rights_full.html#is-report-repayment' },
                    ]},
                    { text: '🎁 הטבות נלוות להשלמת הכנסה',                        href: bp + 'senior_rights/senior_rights_full.html#is-benefits' },
                ]},
                { text: '❤️ גמלת סיעוד', children: [
                    { text: '3.1 תנאי זכאות',                                     href: bp + 'senior_rights/senior_rights_full.html#nu-31' },
                    { text: '3.2 רמות גמלת הסיעוד 2026',                          href: bp + 'senior_rights/senior_rights_full.html#nu-32' },
                    { text: '3.3 מבחן הכנסות לגמלת סיעוד',                        href: bp + 'senior_rights/senior_rights_full.html#nu-33' },
                    { text: '3.4 אפשרויות מימוש הגמלה',                           href: bp + 'senior_rights/senior_rights_full.html#nu-34' },
                ]},
                { text: '♿ גמלת נכות כללית ושר"מ', children: [
                    { text: '4.1 גמלת נכות כללית',                                href: bp + 'senior_rights/senior_rights_full.html#di-41' },
                    { text: '4.2 מעבר מנכות לקצבת זקנה',                          href: bp + 'senior_rights/senior_rights_full.html#di-42' },
                    { text: '4.3 קצבת שירותים מיוחדים (שר"מ)',                     href: bp + 'senior_rights/senior_rights_full.html#di-43' },
                    { text: '4.4 גמלת ילד נכה',                                   href: bp + 'senior_rights/senior_rights_full.html#di-44' },
                    { text: '4.5 מעבר משר"מ לגמלת סיעוד',                         href: bp + 'senior_rights/senior_rights_full.html#di-45' },
                    { text: '4.6 תקרות הכנסה לבעלי 100% נכות', children: [
                        { text: 'סכום הקצבה בחישוב סופי',                          href: bp + 'senior_rights/senior_rights_full.html#di-46-amount' },
                    ]},
                ]},
                { text: '🕊️ קצבת שאירים ומענק פטירה', children: [
                    { text: 'פרק א׳ — תנאי הזכאות המלאים', children: [
                        { text: 'א.1 — מי הוא מבוטח בביטוח שאירים?',              href: bp + 'senior_rights/senior_rights_full.html#su-a1' },
                        { text: 'א.2 — תקופת אכשרה',                               href: bp + 'senior_rights/senior_rights_full.html#su-a2' },
                        { text: 'א.3 — תקופות ביטוח לאישה נשואה שנפטרה',          href: bp + 'senior_rights/senior_rights_full.html#su-a3' },
                        { text: 'א.4 — מיהי אלמנה זכאית?',                        href: bp + 'senior_rights/senior_rights_full.html#su-a4' },
                        { text: 'א.5 — מיהו אלמן זכאי?', children: [
                            { text: 'א.5.1 — חישוב ההכנסות לאלמן',                href: bp + 'senior_rights/senior_rights_full.html#su-a5-1' },
                            { text: 'א.5.2 — התקופה הנבדקת',                      href: bp + 'senior_rights/senior_rights_full.html#su-a5-2' },
                        ]},
                        { text: 'א.6 — הגדרת יתום',                                href: bp + 'senior_rights/senior_rights_full.html#su-a6' },
                    ]},
                    { text: 'פרק ב׳ — סכומי הקצבה', children: [
                        { text: 'ב.1 — קצבה לאלמן/ה',                              href: bp + 'senior_rights/senior_rights_full.html#su-b1' },
                        { text: 'ב.2 — קצבה ליתומים בנסיבות מיוחדות',              href: bp + 'senior_rights/senior_rights_full.html#su-b2' },
                        { text: 'ב.3 — תוספת ותק',                                 href: bp + 'senior_rights/senior_rights_full.html#su-b3' },
                        { text: 'ב.4 — תוספת דמי מחיה ליתומים',                    href: bp + 'senior_rights/senior_rights_full.html#su-b4' },
                        { text: 'ב.5 — תוספת השלמת הכנסה',                         href: bp + 'senior_rights/senior_rights_full.html#su-b5' },
                        { text: 'ב.6 — גמלת שאירים מיוחדת',                        href: bp + 'senior_rights/senior_rights_full.html#su-b6' },
                    ]},
                    { text: 'פרק ג׳ — מענקים חד-פעמיים', children: [
                        { text: 'ג.1 — מענק שאירים',                               href: bp + 'senior_rights/senior_rights_full.html#su-c1' },
                        { text: 'ג.2 — מענק בר/בת מצווה',                          href: bp + 'senior_rights/senior_rights_full.html#su-c2' },
                        { text: 'ג.3 — מענק לימודים',                              href: bp + 'senior_rights/senior_rights_full.html#su-c3' },
                        { text: 'ג.4 — מענק נישואים',                              href: bp + 'senior_rights/senior_rights_full.html#su-c4' },
                    ]},
                    { text: 'פרק ד׳ — תשלום הקצבה', children: [
                        { text: 'ד.1 — מועד תחילת תשלום',                           href: bp + 'senior_rights/senior_rights_full.html#su-d1' },
                        { text: 'ד.2 — אופן התשלום',                                href: bp + 'senior_rights/senior_rights_full.html#su-d2' },
                        { text: 'ד.3 — ניכויים מהקצבה',                             href: bp + 'senior_rights/senior_rights_full.html#su-d3' },
                    ]},
                    { text: 'פרק ה׳ — פקיעת הזכאות', children: [
                        { text: 'ה.1 — מתי פוקעת הקצבה?',                           href: bp + 'senior_rights/senior_rights_full.html#su-e1' },
                        { text: 'ה.2 — קצבת שאירים וקצבת זקנה',                    href: bp + 'senior_rights/senior_rights_full.html#su-e2' },
                        { text: 'ה.3 — שוהה בחוץ לארץ',                             href: bp + 'senior_rights/senior_rights_full.html#su-e3' },
                        { text: 'ה.4 — אפשרויות קצבה חלופיות',                     href: bp + 'senior_rights/senior_rights_full.html#su-e4' },
                    ]},
                    { text: 'פרק ו׳ — הכשרה מקצועית ושיקום',                       href: bp + 'senior_rights/senior_rights_full.html#su-f' },
                    { text: 'פרק ז׳ — הגשת התביעה', children: [
                        { text: 'ז.1 — מסמכים נדרשים',                              href: bp + 'senior_rights/senior_rights_full.html#su-g1' },
                        { text: 'ז.2 — דרכי הגשה',                                 href: bp + 'senior_rights/senior_rights_full.html#su-g2' },
                    ]},
                    { text: 'פרק ח׳ — זכויות נוספות בגופים אחרים',                 href: bp + 'senior_rights/senior_rights_full.html#su-h' },
                    { text: 'פרק ט׳ — מענק פטירה', children: [
                        { text: '1. מהו מענק פטירה?',                               href: bp + 'senior_rights/senior_rights_full.html#su-i1' },
                        { text: '2. סכום המענק', children: [
                            { text: 'מענק רגיל',                                    href: bp + 'senior_rights/senior_rights_full.html#su-i2a' },
                            { text: 'מענק מוגדל – נפגעי עבודה',                    href: bp + 'senior_rights/senior_rights_full.html#su-i2b' },
                        ]},
                        { text: '3. מי זכאי?', children: [
                            { text: 'א. קצבאות המזכות במענק',                       href: bp + 'senior_rights/senior_rights_full.html#su-i3a' },
                            { text: 'ב. סדר עדיפויות בתשלום',                      href: bp + 'senior_rights/senior_rights_full.html#su-i3b' },
                            { text: 'ג. הגדרת ילד לפי חוק הביטוח הלאומי',         href: bp + 'senior_rights/senior_rights_full.html#su-i3c' },
                        ]},
                        { text: '4. מקרים מיוחדים', children: [
                            { text: 'א. פטירת שני בני זוג בהפרש זמן קצר',           href: bp + 'senior_rights/senior_rights_full.html#su-i4a' },
                            { text: 'ב. קצבת זיקנה עם השלמת הכנסה',                href: bp + 'senior_rights/senior_rights_full.html#su-i4b' },
                        ]},
                        { text: '5. אופן קבלת המענק', children: [
                            { text: 'א. תשלום אוטומטי',                              href: bp + 'senior_rights/senior_rights_full.html#su-i5a' },
                            { text: 'ב. כאשר נדרשת הגשת תביעה',                    href: bp + 'senior_rights/senior_rights_full.html#su-i5b' },
                        ]},
                        { text: '6. מגבלות והיעדר זכאות',                           href: bp + 'senior_rights/senior_rights_full.html#su-i6' },
                        { text: '7. מה עוד כדאי לדעת?',                             href: bp + 'senior_rights/senior_rights_full.html#su-i7' },
                    ]},
                    { text: 'פרק י׳ — ערעור ואנשי מקצוע', children: [
                        { text: 'י.1 — ערעור על החלטת הביטוח הלאומי',               href: bp + 'senior_rights/senior_rights_full.html#su-j1' },
                        { text: 'י.2 — נקודות בדיקה לאנשי מקצוע',                  href: bp + 'senior_rights/senior_rights_full.html#su-j2' },
                    ]},
                ]},
                { text: '🎁 מענק מעבר לנשים בגיל 62', children: [
                    { text: '6.1 משך התשלום',                                      href: bp + 'senior_rights/senior_rights_full.html#tg-61' },
                    { text: '6.2 תנאי זכאות למענק',                                href: bp + 'senior_rights/senior_rights_full.html#tg-62' },
                    { text: '6.3 תנאים לשלילת זכאות',                              href: bp + 'senior_rights/senior_rights_full.html#tg-63' },
                    { text: '6.4 סכום המענק',                                      href: bp + 'senior_rights/senior_rights_full.html#tg-64' },
                    { text: '6.5 הגשת בקשה למענק',                                href: bp + 'senior_rights/senior_rights_full.html#tg-65' },
                ]},
                { text: '🕯️ זכויות ניצולי שואה', children: [
                    { text: '7.1 מי נחשב ניצול שואה?',                             href: bp + 'senior_rights/senior_rights_full.html#hs-71' },
                    { text: '7.2 קצבאות ומענקים',                                 href: bp + 'senior_rights/senior_rights_full.html#hs-72' },
                    { text: '7.3 תוספת שעות סיעוד', children: [
                        { text: 'תנאי הזכאות לתוספת שעות סיעוד',                 href: bp + 'senior_rights/senior_rights_full.html#hs-73a' },
                        { text: 'אופן קבלת התוספת',                               href: bp + 'senior_rights/senior_rights_full.html#hs-73b' },
                        { text: 'תוספת חלקית לניצולים עם פחות נקודות',           href: bp + 'senior_rights/senior_rights_full.html#hs-73c' },
                    ]},
                    { text: '7.4 סיוע סיעודי קצר מועד (סול"ם)', children: [
                        { text: 'לאחר אשפוז',                                     href: bp + 'senior_rights/senior_rights_full.html#hs-74a' },
                        { text: 'סול"ם בקהילה',                                   href: bp + 'senior_rights/senior_rights_full.html#hs-74b' },
                    ]},
                    { text: '7.5 הטבות נוספות לניצולי שואה',                      href: bp + 'senior_rights/senior_rights_full.html#hs-75' },
                    { text: '7.6 פרטי קשר — ניצולי שואה',                         href: bp + 'senior_rights/senior_rights_full.html#hs-76' },
                ]},
                { text: '🌟 הטבות נוספות', children: [
                    { text: '8.1 הנחות בארנונה',                                   href: bp + 'senior_rights/senior_rights_full.html#ab-81' },
                    { text: '8.2 הנחות במס הכנסה',                                 href: bp + 'senior_rights/senior_rights_full.html#ab-82' },
                    { text: '8.3 הנחות בתחבורה ציבורית',                            href: bp + 'senior_rights/senior_rights_full.html#ab-83' },
                    { text: '8.4 הנחות בתרבות ונופש',                               href: bp + 'senior_rights/senior_rights_full.html#ab-84' },
                    { text: '8.5 שירותי בריאות',                                   href: bp + 'senior_rights/senior_rights_full.html#ab-85' },
                    { text: '8.6 שירותים חברתיים',                                 href: bp + 'senior_rights/senior_rights_full.html#ab-86' },
                ]},
                { text: '📊 השפעות הדדיות בין הקצבאות', children: [
                    { text: 'כללי מפתח',                                            href: bp + 'senior_rights/senior_rights_full.html#in-key' },
                ]},
                { text: '📞 כתובות ויצירת קשר', children: [
                    { text: '10.2 ארגונים נוספים',                                 href: bp + 'senior_rights/senior_rights_full.html#co-102' },
                    { text: '10.3 הערות חשובות',                                   href: bp + 'senior_rights/senior_rights_full.html#co-103' },
                ]},
            ]
        },
        {
            icon: '🌍', text: 'זכויות עולים חדשים', children: [
                { icon: '🌍', text: 'זכויות עולים חדשים', teal: true, children: [
                    { text: 'גמלת זיקנה מיוחדת', href: bp + 'new_immigrants/new_immigrants_full.html#ni-special-pension' },
                    { text: 'אמנות בינלאומיות',   href: bp + 'new_immigrants/new_immigrants_full.html#ni-treaties' },
                ]},
                { icon: '👴', text: 'גמלת זיקנה מיוחדת', children: [
                    { text: 'חלק א׳ — מבוא, זכאות וגובה הגמלה',           href: bp + 'new_immigrants/gimlat_zikna_meyuchedet.html#part_a' },
                    { text: 'חלק ב׳ — אמנות בינלאומיות לביטחון סוציאלי', href: bp + 'new_immigrants/gimlat_zikna_meyuchedet.html#part_b' },
                    { text: 'חלק ג׳ — השוואה: גמלה מיוחדת לעומת אמנה',   href: bp + 'new_immigrants/gimlat_zikna_meyuchedet.html#part_c' },
                ]},
                { icon: '🤝', text: 'אמנות בינלאומיות לביטחון סוציאלי', children: [
                    { text: 'מדינות האמנה — רשימה מלאה',     href: bp + 'new_immigrants/international_treaties.html#part_a' },
                    { text: 'שלושת עקרונות האמנות',           href: bp + 'new_immigrants/international_treaties.html#part_b' },
                    { text: 'ענפי הביטוח הכלולים באמנות',     href: bp + 'new_immigrants/international_treaties.html#part_b2' },
                    { text: 'צירוף תקופות ביטוח — פירוט',     href: bp + 'new_immigrants/international_treaties.html#part_c' },
                    { text: 'שהייה בחו"ל וקצבאות',            href: bp + 'new_immigrants/international_treaties.html#part_d' },
                    { text: 'הגשת תביעה לקצבה ממדינת אמנה',   href: bp + 'new_immigrants/international_treaties.html#part_e' },
                    { text: 'השוואה וטיפים',                   href: bp + 'new_immigrants/international_treaties.html#part_f' },
                ]},
            ]
        },
        { icon: '📊', text: 'סיכום קצבאות ותקרות', teal: true, children: [
            { text: 'קצבת אזרח ותיק',         href: bp + 'senior_rights/financial-tables-and-definitions.html#old_age' },
            { text: 'השלמת הכנסה',             href: bp + 'senior_rights/financial-tables-and-definitions.html#income_supplement' },
            { text: 'גמלת סיעוד',              href: bp + 'senior_rights/financial-tables-and-definitions.html#nursing' },
            { text: 'נכות וקצבת שר"מ',         href: bp + 'senior_rights/financial-tables-and-definitions.html#disability' },
            { text: 'מענק שאירים',             href: bp + 'senior_rights/financial-tables-and-definitions.html#survivors' },
            { text: 'מענק מעבר לנשים בגיל 62', href: bp + 'senior_rights/financial-tables-and-definitions.html#transition_grant' },
            { text: 'ניצולי שואה',             href: bp + 'senior_rights/financial-tables-and-definitions.html#holocaust' },
            { text: 'עולים חדשים',             href: bp + 'senior_rights/financial-tables-and-definitions.html#immigrants' },
        ]},
        {
            icon: '📖', text: 'מדריכים מפורטים', children: [
                { icon: '📘', text: 'זכויות אזרחים ותיקים 2026', children: [
                    { text: 'קצבת אזרח ותיק', children: [
                        { text: 'גילאי פרישה וזכאות',                  href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-ages' },
                        { text: 'תקופת אכשרה',                         href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-achshara' },
                        { text: 'מבחן הכנסות',                         href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-income-test' },
                        { text: 'סכומי הקצבה הבסיסית 2026',            href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-amounts' },
                        { text: 'תוספת ותק',                           href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-seniority' },
                        { text: 'תוספת דחיית קצבה',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-deferral' },
                        { text: 'תשלום רטרואקטיבי',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-p-retro' },
                    ]},
                    { text: 'גמלת השלמת הכנסה', children: [
                        { text: 'תנאי זכאות בסיסיים',                  href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-conditions' },
                        { text: 'זכאות זוגית', children: [
                            { text: 'שני בני הזוג זכאים לקצבה',        href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-couple-both' },
                            { text: 'רק אחד מבני הזוג זכאי',           href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-couple-one' },
                        ]},
                        { text: 'סכומי הקצבה (טבלה)',                  href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-amounts' },
                        { text: 'תקרות הכנסה וחישוב זכאות', children: [
                            { text: 'חישוב הכנסה רעיונית מנכסים',      href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-imputed' },
                        ]},
                        { text: 'בעלות על רכב',                        href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-vehicle' },
                        { text: 'צורת חישוב — סיכום השלבים',           href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-calc' },
                        { text: 'הטבות נלוות לזכאים',                  href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-is-benefits' },
                    ]},
                    { text: 'גמלת סיעוד', children: [
                        { text: 'תנאי זכאות',                          href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-nu-conditions' },
                        { text: 'סכומי גמלת סיעוד 2026', children: [
                            { text: 'גמלה מלאה — שווי כספי',           href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-nu-full' },
                            { text: 'חצי גמלה',                        href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-nu-half' },
                        ]},
                        { text: 'מבחן הכנסות',                        href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-nu-income-test' },
                    ]},
                    { text: 'זכויות מיוחדות לניצולי שואה', children: [
                        { text: 'מי נחשב ניצול שואה?',                 href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-ho-who' },
                        { text: 'קצבאות מיוחדות', children: [
                            { text: 'תוספת לניצולי שואה לקצבת זקנה',   href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-ho-supplement' },
                            { text: 'רנטה מגרמניה',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-ho-rente' },
                            { text: 'קצבת שארים מיוחדת',               href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-ho-survivors' },
                        ]},
                        { text: 'הטבות נוספות',                       href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-ho-benefits' },
                    ]},
                    { text: 'קצבת שארים', children: [
                        { text: 'זכאים לקצבה',                        href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-su-eligible' },
                        { text: 'סכומי קצבת שארים 2026', children: [
                            { text: 'אלמן/אלמנה',                      href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-su-widow' },
                            { text: 'יתום',                            href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-su-orphan' },
                            { text: 'תוספת למשפחה',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-su-family' },
                        ]},
                    ]},
                    { text: 'הטבות נוספות', children: [
                        { text: 'הנחות בארנונה',                      href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-arnona' },
                        { text: 'הנחות במס הכנסה',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-tax' },
                        { text: 'הנחות בתחבורה ציבורית',              href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-transport' },
                        { text: 'הנחות בתרבות ונופש',                 href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-culture' },
                        { text: 'שירותי בריאות',                      href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-health' },
                        { text: 'שירותים חברתיים',                    href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-be-social' },
                    ]},
                    { text: 'כתובות ומידע ליצירת קשר', children: [
                        { text: 'המוסד לביטוח לאומי', children: [
                            { text: 'מוקדים ייעודיים',                 href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-co-hotlines' },
                            { text: 'סניפי ביטוח לאומי',              href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-co-branches' },
                        ]},
                        { text: 'ארגונים נוספים',                     href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-co-orgs' },
                        { text: 'סיכום והערות חשובות',                href: bp + 'senior_rights/senior_citizens_rights_2026.html#sc-co-summary' },
                    ]},
                ]},
                { icon: '⚖️', text: 'נכות כללית מול שאירים 2026', children: [
                    { text: 'חובה לבחור בין הקצבאות',            href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-choose' },
                    { text: 'השוואת סכומים ותקרות',               href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-amounts' },
                    { text: 'השוואת יתרונות',                     href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-advantages' },
                    { text: 'השוואת סיכונים',                     href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-risks' },
                    { text: 'האם ניתן לעבור בין הקצבאות?',        href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-switch' },
                    { text: 'נקודות מפתח להשוואה',                href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-comparison' },
                    { text: 'נקודות נוספות מהותיות',               href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-additional' },
                    { text: 'מדריך קצר לקבלת ההחלטה',             href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-guide' },
                    { text: 'צעדים מעשיים',                       href: bp + 'senior_rights/nechut_vs_shairim.html#nvs-steps' },
                ]},
                { icon: '📊', text: 'מדריך לחישוב זכאות וסכום קצבת זיקנה חלקית', children: [
                    { text: 'מבוא',                                   href: bp + 'senior_rights/old_pension_income_test_full_guide.html#intro' },
                    { text: 'חלק א — דרך חישוב הזכאות',               href: bp + 'senior_rights/old_pension_income_test_full_guide.html#algorithm' },
                    { text: 'חלק ב — הכנסה מעבודה',                    href: bp + 'senior_rights/old_pension_income_test_full_guide.html#op-work' },
                    { text: 'חלק ג — הכנסה מנכסים',                    href: bp + 'senior_rights/old_pension_income_test_full_guide.html#op-assets' },
                    { text: 'חלק ד — הכנסה משולבת',                    href: bp + 'senior_rights/old_pension_income_test_full_guide.html#combined' },
                    { text: 'סיכום — טבלת תקרות',                        href: bp + 'senior_rights/old_pension_income_test_full_guide.html#op-summary' },
                    { text: 'הבהרות מעשיות',                             href: bp + 'senior_rights/old_pension_income_test_full_guide.html#op-clarifications' },
                    { text: 'דוגמאות',                                   href: bp + 'senior_rights/old_pension_income_test_full_guide.html#op-examples' },
                ]},
                { icon: '👨‍👩‍👧', text: 'מדריך קצבת שאירים 2026', children: [
                    { text: 'מהי קצבת שאירים',                         href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-what' },
                    { text: 'מי הם שאירים',                            href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-who' },
                    { text: 'תנאי הזכאות',                             href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-conditions' },
                    { text: 'סכומי הקצבה 2026',                        href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-amounts' },
                    { text: 'תוספת דמי מחיה ליתומים',                  href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-livelihood' },
                    { text: 'מבחן הכנסות לאלמן',                       href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-income-test' },
                    { text: 'תקופות ביטוח לאישה נשואה',                href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-special-periods' },
                    { text: 'גמלה מיוחדת לעולים',                       href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-olim' },
                    { text: 'שילוב קצבאות',                            href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-combination' },
                    { text: 'מענק שאירים חד-פעמי',                      href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-grant' },
                    { text: 'הגשת תביעה',                               href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-claim' },
                    { text: 'ערעור',                                    href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-appeal' },
                    { text: 'שאלות נפוצות',                             href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-faq' },
                    { text: 'נספח: טבלת סיכום',                         href: bp + 'senior_rights/survivors_benefits_guide_2026.html#sv-appendix' },
                ]},
                { icon: '👩', text: 'מדריך מענק מעבר לנשים', children: [
                    { text: 'רקע ומהות הזכות',                          href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-background' },
                    { text: 'מי זכאית',                                href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-eligible' },
                    { text: 'תנאי הזכאות',                             href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-conditions' },
                    { text: 'מי אינה זכאית',                           href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-disqualified' },
                    { text: 'תקופת התשלום',                             href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-period' },
                    { text: 'סכום המענק',                               href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-amount' },
                    { text: 'הגשת הבקשה',                               href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-submit' },
                    { text: 'קישורים שימושיים',                          href: bp + 'senior_rights/women_transition_benefit_guide.html#wt-links' },
                ]},
                { icon: '🏥', text: 'מדריך מוסד אישפוז', children: [
                    { text: 'סקירה כללית',                        href: bp + 'senior_rights/nursing_home_guide.html#overview' },
                    { text: 'חלוקה לפי סוגי אוכלוסייה',           href: bp + 'senior_rights/nursing_home_guide.html#population_types' },
                    { text: 'מסלול משרד הבריאות',                  href: bp + 'senior_rights/nursing_home_guide.html#ministry_health' },
                    { text: 'מסלול משרד הרווחה',                   href: bp + 'senior_rights/nursing_home_guide.html#ministry_welfare' },
                    { text: 'טבלאות השוואה',                       href: bp + 'senior_rights/nursing_home_guide.html#comparison' },
                    { text: 'עצות זהב',                            href: bp + 'senior_rights/nursing_home_guide.html#tips' },
                    { text: 'שאלות נפוצות',                        href: bp + 'senior_rights/nursing_home_guide.html#faq' },
                    { text: 'גורמי עזר ומידע',                     href: bp + 'senior_rights/nursing_home_guide.html#resources' },
                ]},
                { icon: '🕯️', text: 'מדריך ניצולי שואה', teal: true, children: [
                    { text: 'מידע כללי',              href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-info' },
                    { text: 'סוגי קצבאות',            href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-pensions' },
                    { text: 'סיעוד וטיפול',           href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-nursing' },
                    { text: 'הטבות לניצולי שואה',     href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-benefits' },
                    { text: 'הגשת בקשות',             href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-apply' },
                    { text: 'ערעורים והחמרות',        href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-appeals' },
                    { text: 'ארגוני סיוע',            href: bp + 'senior_rights/holocaust_survivors_rights.html#hsr-orgs' },
                ]},
            ]
        },
        {
            icon: '🛠️', text: 'כלי עזר', children: [
                // --- אקורדיונים ---
                { icon: '🔧', text: 'מחשבונים וכלים', children: [
                    { icon: '🪪', text: 'בדיקת תעודת זהות',                          href: bp + 'senior_rights/id-check.html' },
                    { icon: '👩', text: 'מחשבון גיל פרישה לנשים',                    href: bp + 'senior_rights/retirement-calculator.html' },
                    { icon: '🔢', text: 'מחשבון האפשרות לקבל יותר מקצבה אחת',       href: bp + 'senior_rights/benefit-combinations.html' },
                    { icon: '🧾', text: 'מחשבון הערכת זכאות לקצבת זיקנה',           href: bp + 'senior_rights/age_pension_eligibility_calculator.html' },
                    { icon: '💰', text: 'בדיקת זכאות להשלמת הכנסה',                 href: bp + 'senior_rights/questionnaire.html?id=income-supplement-eligibility' },
                    { icon: '👶', text: 'הגדרת ילד להשלמת הכנסה',                   href: bp + 'senior_rights/questionnaire.html?id=child-definition&hideReturn=true' },
                    { icon: '🚗', text: 'זכאות להשלמת הכנסה עם רכב',                href: bp + 'senior_rights/questionnaire.html?id=vehicle-income-supplement' },
                    { icon: '🏠', text: 'חישוב הכנסה רעיונית מנכסים',               href: bp + 'senior_rights/questionnaire.html?id=imputed-income-calculator' },
                ]},
                { icon: '📚', text: 'רשימת קצבאות ותשלומים', teal: true, children: [
                    { text: 'א. אזרחים ותיקים ושאירים',    href: bp + 'senior_rights/benefits-index.html#seniors' },
                    { text: 'ב. נכות, סיעוד ותפקוד',       href: bp + 'senior_rights/benefits-index.html#disability' },
                    { text: 'ג. ניידות',                   href: bp + 'senior_rights/benefits-index.html#mobility' },
                    { text: 'ד. הכנסה, עבודה ואבטלה',      href: bp + 'senior_rights/benefits-index.html#income' },
                    { text: 'ה. נפגעי עבודה ותאונות',      href: bp + 'senior_rights/benefits-index.html#work-injury' },
                    { text: 'ו. ילדים, הורות ומשפחה',      href: bp + 'senior_rights/benefits-index.html#family' },
                    { text: 'ז. ילדים עם מוגבלות',         href: bp + 'senior_rights/benefits-index.html#disabled-children' },
                    { text: 'ח. אוכלוסיות מיוחדות',        href: bp + 'senior_rights/benefits-index.html#special' },
                    { text: 'ט. מענקים ותשלומים מיוחדים',  href: bp + 'senior_rights/benefits-index.html#grants' },
                ]},
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
                { icon: '📜', text: 'הגדרת תלויים בקצבת זיקנה', children: [
                    { text: 'הגדרת "אלמנה"',   href: bp + 'senior_rights/dependents_definition_old_age_survivors.html#dep-widow' },
                    { text: 'הגדרת "אלמן"',    href: bp + 'senior_rights/dependents_definition_old_age_survivors.html#dep-widower' },
                    { text: 'הגדרת "ילד"',      href: bp + 'senior_rights/dependents_definition_old_age_survivors.html#dep-child' },
                    { text: 'הגדרות נוספות',    href: bp + 'senior_rights/dependents_definition_old_age_survivors.html#dep-definitions' },
                ]},
                { icon: '📚', text: 'דוגמאות וסימולציות', children: [
                    { text: 'פרק 1 — גובה הקצבה, תוספת ותק ודחיית קצבה', href: bp + 'senior_rights/sampels.html#ch-1' },
                    { text: 'פרק 2 — הכנסות מעבודה ומבחן ההכנסה',         href: bp + 'senior_rights/sampels.html#ch-2' },
                    { text: 'פרק 3 — הכנסות שלא מעבודה',                  href: bp + 'senior_rights/sampels.html#ch-3' },
                ]},
                // --- עלים ישירים ---
                { icon: '📄', text: 'מסמכי מקורות מידע',                        href: bp + 'senior_rights/Information_Sources.html', teal: true },
                { icon: '🏦', text: 'מדריך הכנסה רעיונית מנכסים פיננסיים',     href: bp + 'senior_rights/imputed_income_guide.html' },
                { icon: '📝', text: 'טופס פניה לייעוץ בל/4300',                 href: bp + 'senior_rights/counseling_referral_form.html' },
            ]
        },
        {
            icon: '📚', text: 'סיכומים ומסמכי מידע מפורט', children: [
                { text: '🦁 דו"ח זכויות — מבצע שאגת הארי',                    href: bp + 'additional_guides/html/shaagat_haari.html' },
                { text: '⚠️ מקרים מיוחדים בגמלאות ביטוח לאומי',              href: bp + 'additional_guides/html/mekarim_meyuchadim.html' },
                { text: '🌍 אמנות בינלאומיות לביטחון סוציאלי',                href: bp + 'additional_guides/html/amnot_binleumiot.html' },
                { text: '🏠 גמלת זיקנה מיוחדת לעולים ותושבים חוזרים',        href: bp + 'additional_guides/html/gamlay_zikna.html' },
                { text: '👨‍👩‍👧 הגדרת תלויים בקצבת זקנה וקצבת שאירים',           href: bp + 'additional_guides/html/hagdarat_tluim.html' },
                { text: '🎓 דמי מחיה לשאירים בביטוח לאומי',                    href: bp + 'additional_guides/html/dmei_michya_leshairim.html' },
                { text: '💼 השלמת הכנסה וחובת ההתייצבות בשירות התעסוקה',     href: bp + 'additional_guides/html/chovaat_hitatzbut.html' },
                { text: '✈️ יציאה לחו"ל והשפעתה על קצבת זיקנה והשלמת הכנסה', href: bp + 'additional_guides/html/yetzia_lachul.html' },
                { text: '📅 תקופת אכשרה לקצבת אזרח ותיק',                     href: bp + 'additional_guides/html/tkufat_achshara.html' },
                { text: '⚖️ בחירה בין קצבת נכות לקצבת שאירים',                href: bp + 'additional_guides/html/nechut_mul_shairim.html' },
                { text: '💰 תקרות הכנסה לקצבת אזרח ותיק חלקית',               href: bp + 'additional_guides/html/takrut_hachnasa.html' },
                { text: '🏥 זכויות אזרחים ותיקים לאחר אישפוז',                href: bp + 'additional_guides/html/zchuyot_achrei_ishpuz.html' },
                { text: '📜 ייפוי כוח מתמשך - מדריך מקיף',                    href: bp + 'additional_guides/html/yipuy_koach_mitmashech.html' },
                { text: '🩼 נכות כללית מול נכות מעבודה',                      href: bp + 'additional_guides/html/nechut_klalit_mul_avoda.html' },
                { text: '🅿️ חניה שמורה לאזרח ותיק ללא תעודת נכה',             href: bp + 'additional_guides/html/chanaya_shmura_ezrach_vatik.html' },
                { text: '📋 מידע כללי על העסקת עובד זר',                      href: bp + 'additional_guides/html/oved_zar_bituach_leumi.html' },
            ]
        },
        {
            icon: '📊', text: 'עדכוני ביטוח לאומי 2026', children: [
                { icon: '✅', text: 'עדכון 01.2026 קצבאות זקנה ושאירים', children: [
                    { text: 'א. קצבת אזרח ותיק בסיסית',               href: bp + 'senior_rights/data/data_202601.html#data-alef' },
                    { text: 'ב. קצבת שאירים בסיסית',                   href: bp + 'senior_rights/data/data_202601.html#data-bet' },
                    { text: 'ג. דמי מחיה ליתומים',                     href: bp + 'senior_rights/data/data_202601.html#data-gimel' },
                    { text: 'ד. הכנסה מותרת לדמי מחיה',               href: bp + 'senior_rights/data/data_202601.html#data-dalet' },
                    { text: 'ה. השלמת הכנסה ליתומים',                  href: bp + 'senior_rights/data/data_202601.html#data-he' },
                    { text: 'ו. השלמת הכנסה — גילאי פרישה',            href: bp + 'senior_rights/data/data_202601.html#data-vav' },
                    { text: 'ז. ניכויים לביטוח בריאות',                href: bp + 'senior_rights/data/data_202601.html#data-zayin' },
                    { text: 'ח. מדדי זכאות להשלמת הכנסה',              href: bp + 'senior_rights/data/data_202601.html#data-het' },
                    { text: 'ט. הסכום הקובע להשלמת הכנסה',             href: bp + 'senior_rights/data/data_202601.html#data-tet' },
                    { text: 'י. הכנסה מרבית לקצבת אזרח ותיק',          href: bp + 'senior_rights/data/data_202601.html#data-yod' },
                    { text: 'יא. מודד רכב בה"ה',                       href: bp + 'senior_rights/data/data_202601.html#data-ya' },
                    { text: 'יב. הכנסה מרבית לתלויים ושארים',          href: bp + 'senior_rights/data/data_202601.html#data-yb' },
                    { text: 'יג. תעריף רכיבי נכות',                    href: bp + 'senior_rights/data/data_202601.html#data-yg' },
                    { text: 'יד. מענק בר מצווה',                       href: bp + 'senior_rights/data/data_202601.html#data-yd' },
                    { text: 'טו. מענק פטירה',                          href: bp + 'senior_rights/data/data_202601.html#data-tv' },
                    { text: 'טז. דמי כיס למאושפזים',                   href: bp + 'senior_rights/data/data_202601.html#data-tz' },
                    { text: 'יז. מענק חימום',                          href: bp + 'senior_rights/data/data_202601.html#data-yz' },
                    { text: 'יח. הכנסה מותרת למענק מעבר',              href: bp + 'senior_rights/data/data_202601.html#data-yh' },
                    { text: 'יט. מענק מעבר לנשים',                     href: bp + 'senior_rights/data/data_202601.html#data-yt' },
                ]},
            ]
        },
        { icon: '❓', text: 'שאלות נפוצות',      href: bp + 'senior_rights/faq.html', teal: true },
        { icon: '🔗', text: 'קישורים חשובים',   href: bp + 'senior_rights/important-links.html', teal: true },
        { icon: '📋', text: 'טפסי ביטוח לאומי', href: bp + 'senior_rights/forms.html', teal: true },
    ];

    window.HNAV_MENU = MENU;

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

        .hnav-collapse-all-btn {
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.4);
            color: white;
            height: 34px;
            padding: 0 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            font-family: inherit;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .hnav-collapse-all-btn:hover { background: rgba(255,255,255,0.3); }

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
        .hnav-item-teal a {
            color: #0097a7;
            border-right-color: #0097a7;
        }
        .hnav-item-teal a:hover {
            background: #e0f7fa;
            border-right-color: #0097a7;
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

                const iconHtml = item.icon ? item.icon + ' ' : '';
                html += `
                <div>
                    <div class="${labelCls} ${arrowState}" onclick="hnavToggle(this)">
                        <span class="${innerCls}">${iconHtml}${item.text}</span>
                        <span class="hnav-arrow">▾</span>
                    </div>
                    <div class="hnav-children ${childState} ${subItemsCls}">
                        ${buildMenuHTML(item.children, depth + 1)}
                    </div>
                </div>`;
            } else {
                const target = item.external ? ' target="_blank" rel="noopener"' : '';
                const tealCls = item.teal ? ' hnav-item-teal' : '';
                const iconHtml = item.icon ? item.icon + ' ' : '';
                html += `
                <div class="hnav-item${tealCls}">
                    <a href="${item.href}"${target} onclick="hnavCloseMenu()">${iconHtml}${item.text}</a>
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
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="hnav-collapse-all-btn" onclick="hnavCollapseAll()" aria-label="סגור הכל">סגור הכל</button>
                    <button class="hnav-close-btn" onclick="hnavCloseMenu()" aria-label="סגור תפריט">✕</button>
                </div>
            </div>
            <div class="hnav-menu">
                ${buildMenuHTML(MENU, 0)}
            </div>
            <div style="text-align:center;padding:12px 0;">
                <a href="${bp}ai-summary.html" style="font-size:0.75rem;opacity:0.55;color:inherit;text-decoration:underline;font-weight:400">מידע לכלי בינה מלאכותית</a>
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

    window.hnavCollapseAll = function () {
        document.querySelectorAll('.hnav-children.expanded').forEach(function (el) {
            el.classList.replace('expanded', 'collapsed');
            var label = el.previousElementSibling;
            if (label) label.classList.add('hnav-label-collapsed');
        });
    };

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
