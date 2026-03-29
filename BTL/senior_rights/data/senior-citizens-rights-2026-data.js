const SENIOR_RIGHTS_2026_DATA = {
    lastUpdate: "2026-01-15",
    sections: [
        {
            icon: "💰",
            title: "קצבת אזרח ותיק (קצבת זקנה)",
            contentFn: function(nii) {
                const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = num => Math.round(num).toLocaleString('he-IL');
                const p = key => nii[key] ? nii[key].value + '%' : '—';
                const age = key => nii[key] ? nii[key].value : '—';
                return `
                <h2>גילאי פרישה וזכאות</h2>

                <p><strong>גיל הפרישה לגברים:</strong> ${age('retirement_age_male')}</p>

                <h3>גיל הפרישה לנשים לפי שנת לידה</h3>
                <div style="background: #E3F2FD; border: 1px solid #BBDEFB; border-radius: 12px; padding: 18px 20px; margin: 12px 0 16px 0;">
                    <p style="color: #1A3A52; margin-bottom: 6px; font-size: 0.95rem;"><strong>📅 מדרגת גיל הפרישה לילידות 1962 הסתיימה ב-31/12/2025</strong></p>
                    <p style="color: #1A3A52; margin-bottom: 14px; font-size: 0.95rem;"><strong>⏭️ מדרגת גיל הפרישה לילידות 1963 תחל ב-01/05/2026</strong></p>
                    <p style="font-weight: 700; color: #1A3A52; margin-bottom: 14px; font-size: 1.05rem;">🧮 מחשבון תאריך פרישה</p>
                    <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <label style="font-weight: 600; color: #2C3E50; white-space: nowrap;">תאריך לידה:</label>
                            <input type="text" id="woman-birth-date" placeholder="DD/MM/YYYY" maxlength="10"
                                   style="padding: 8px 12px; border: 2px solid #90CAF9; border-radius: 8px; font-size: 1rem; font-family: inherit; width: 140px; direction: ltr; text-align: center;"
                                   oninput="calcWomanRetirement(this)">
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <label style="font-weight: 600; color: #2C3E50; white-space: nowrap;">תאריך פרישה:</label>
                            <input type="text" id="retirement-date-result" placeholder="DD/MM/YYYY" readonly
                                   style="padding: 8px 12px; border: 2px solid #A5D6A7; border-radius: 8px; font-size: 1rem; font-family: inherit; width: 140px; direction: ltr; text-align: center; background: #F1F8E9; font-weight: 700; color: #2E7D32; cursor: default;">
                        </div>
                    </div>
                    <p id="retirement-age-label" style="color: #546E7A; font-size: 0.9rem; margin: 10px 0 0 0; min-height: 1.2em;"></p>
                </div>
                <ul>
                    <li>נשים שנולדו עד 31.12.1959: גיל 62</li>
                    <li>נשים שנולדו מ-1.1.1960 עד 31.12.1960: 62 + 4 חודשים</li>
                    <li>נשים שנולדו מ-1.1.1961 עד 31.12.1961: 62 + 8 חודשים</li>
                    <li>נשים שנולדו מ-1.1.1962 עד 31.12.1962: 63</li>
                    <li>נשים שנולדו מ-1.1.1963 עד 31.12.1963: 63 + 4 חודשים</li>
                    <li>נשים שנולדו מ-1.1.1964 עד 31.12.1964: 63 + 8 חודשים</li>
                    <li>נשים שנולדו מ-1.1.1965 עד 31.12.1965: 64</li>
                    <li>נשים שנולדו מ-1.1.1966 עד 31.12.1966: 64 + 4 חודשים</li>
                    <li>נשים שנולדו מ-1.1.1967 ואילך: 65</li>
                </ul>

                <h3>גיל הזכאות המוחלט</h3>
                <p><strong>${age('retirement_age_unconditional')} - ללא מבחן הכנסות</strong></p>
                <p>החל מגיל ${age('retirement_age_unconditional')}, הקצבה משולמת ללא כל מבחן הכנסות, גם למי שעובד ומרוויח.</p>

                <h2>תקופת אכשרה לנשים ולגברים</h2>

                <div style="background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 10px; padding: 12px 16px; margin: 10px 0 16px 0; font-size: 0.95rem;">
                    <strong>📋 מקורות רשמיים:</strong>
                    <a href="https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/achshara/Pages/%D7%AA%D7%A7%D7%95%D7%A4%D7%AA%D7%90%D7%9B%D7%A9%D7%A8%D7%94%D7%9C%D7%92%D7%91%D7%A8.aspx" target="_blank" style="color: var(--secondary); margin: 0 4px;">ביטוח לאומי – תקופת אכשרה לגבר</a> |
                    <a href="https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/achshara/Pages/achsharaIsha.aspx" target="_blank" style="color: var(--secondary); margin: 0 4px;">ביטוח לאומי – תקופת אכשרה לאישה</a> |
                    <a href="https://www.kolzchut.org.il/he/%D7%AA%D7%A7%D7%95%D7%A4%D7%AA_%D7%90%D7%9B%D7%A9%D7%A8%D7%94_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%90%D7%96%D7%A8%D7%97_%D7%95%D7%AA%D7%99%D7%A7_(%D7%A7%D7%A6%D7%91%D7%AA_%D7%92%D7%99%D7%9C_%D7%94%D7%A4%D7%A8%D7%99%D7%A9%D7%94)" target="_blank" style="color: var(--secondary); margin: 0 4px;">כל זכות – תקופת אכשרה</a>
                </div>

                <h3>הגדרת "מבוטח" ותשלום דמי ביטוח</h3>
                <p>כדי לצבור תקופת אכשרה, על האדם להיות "מבוטח" בביטוח אזרח ותיק ולשלם דמי ביטוח כחוק.</p>
                <ul>
                    <li><strong>כללי:</strong> מבוטח הוא תושב ישראל שמלאו לו 18 שנים, וטרם הגיע לגיל הפרישה.</li>
                    <li><strong>עובד עצמאי/לא עובד:</strong> עליהם להסדיר את התשלום ישירות מול הביטוח הלאומי. תקופות שבהן קיים חוב בדמי הביטוח עלולות שלא להיספר כתקופת אכשרה.</li>
                    <li><strong>עובד שכיר (דגש חשוב):</strong> לפי סעיף 365 לחוק, אם המעסיק לא שילם את דמי הביטוח עבור העובד, <strong>התקופה עדיין תיחשב לעובד כתקופת אכשרה</strong>. זכויות העובד אינן נפגעות בשל מחדלי המעסיק, כל עוד העובד יכול להוכיח כי התקיימו יחסי עובד-מעביד (באמצעות תלושי שכר, טופס 106 וכו').</li>
                </ul>

                <h3>תקופות הנמנות כתקופת אכשרה</h3>
                <p>מעבר לחודשי עבודה בפועל בהם שולמו דמי ביטוח, התקופות הבאות נספרות במניין חודשי האכשרה:</p>
                <ul>
                    <li>חודשי שירות חובה בצה"ל, שירות מילואים או שירות לאומי-אזרחי.</li>
                    <li>חודשים שבעבורם שולמו דמי לידה, דמי אבטלה, דמי פגיעה בעבודה או דמי תאונה.</li>
                    <li>חודשים שבהם קיבל המבוטח קצבת נכות כללית (בדרגת אי-כושר של 75% ומעלה).</li>
                    <li>חודשי עבודה בחו"ל בתנאי שהמבוטח המשיך לשלם דמי ביטוח כתושב ישראל, או שעבד במדינה שיש לה אמנה עם ישראל.</li>
                    <li>תקופות שבהן המבוטח היה פטור מתשלום דמי ביטוח לפי החוק (למשל: תקופת מחלה ממושכת).</li>
                </ul>

                <h3>התנאים לצבירת אכשרה (החלופות)</h3>
                <p>יש לעמוד באחת משלוש החלופות הבאות כדי להיות זכאי לקצבה בגיל הפרישה:</p>
                <ul>
                    <li><strong>חלופה א':</strong> 144 חודשי ביטוח (12 שנים) בסך הכל, מיום שהפך המבוטח לתושב ישראל.</li>
                    <li><strong>חלופה ב':</strong> 60 חודשי ביטוח (5 שנים) בתוך 10 השנים האחרונות שקדמו לגיל הפרישה.</li>
                    <li><strong>חלופה ג' (עולים חדשים):</strong> מספר חודשי הביטוח שנצברו הוא לפחות כמספר החודשים שבהם <strong>לא</strong> היה מבוטח. רלוונטי למי שהפך לתושב לאחר גיל 40 (גבר) או גיל שנקבע בחוק (אישה), ובתנאי שצבר לפחות 60 חודשי ביטוח.</li>
                </ul>

                <h3>פטור מתקופת אכשרה</h3>
                <p>האוכלוסיות הבאות פטורות לחלוטין מצבירת תקופת אכשרה:</p>
                <ol>
                    <li><strong>גרושה:</strong> שהתגרשה לאחר גיל 55.</li>
                    <li><strong>אלמנה:</strong> שאינה זכאית לקצבת שאירים.</li>
                    <li><strong>עגונה:</strong> שבעלה נעלם או נמצא בחו"ל מעל שנתיים.</li>
                    <li><strong>אישה שבן זוגה אינו מבוטח:</strong> (למשל עלה לארץ מעל גיל פרישה).</li>
                    <li><strong>מי שקיבלה קצבת נכות:</strong> בחודש שקדם להגיעה לגיל הפרישה.</li>
                </ol>

                <h3>סטטוס "עקרת בית"</h3>
                <p>אישה המוגדרת כ"עקרת בית" נהנית מפטור מתשלום דמי ביטוח:</p>
                <ul>
                    <li><strong>צבירת אכשרה:</strong> צוברת רק עבור תקופות עבודה כשכירה/עצמאית או תקופות לפני נישואיה.</li>
                    <li><strong>הזכאות לקצבה:</strong> אם לא צברה אכשרה, תהיה זכאית לקצבה רק ב<strong>גיל הזכאות המוחלט (70)</strong>.</li>
                    <li><strong>הערה חשובה:</strong> מומלץ לבדוק את "חלופת ה-144" לפני מעבר לסטטוס עקרת בית כדי להקדים את הקצבה לגיל הפרישה (62–65).</li>
                </ul>

                <h3>סטטוס רווקה / גרושה / אלמנה</h3>
                <p>בניגוד לעקרת בית נשואה, נשים במעמדות אלו נחשבות למבוטחות חובה:</p>
                <ul>
                    <li><strong>חובת תשלום:</strong> הן חייבות בתשלום דמי ביטוח (בין אם דרך השכר ובין אם באופן עצמאי כלא עובדות).</li>
                    <li><strong>צבירת ותק:</strong> כל חודשי הביטוח במעמדות אלו נספרים כתקופת אכשרה מלאה לקבלת הקצבה.</li>
                    <li><strong>זכאות בגיל הפרישה:</strong> בזכות צבירת חודשים אלו, לרוב קל להן יותר לעמוד ב"חלופת ה-144" ולהיות זכאיות לקצבה כבר בגיל הפרישה (62–65) ולא להמתין לגיל 70.</li>
                </ul>

                <h3>קצבה מיוחדת (למי שלא צבר אכשרה)</h3>
                <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: 10px; padding: 14px 18px; margin: 10px 0;">
                    <p><strong>לתשומת לבכם:</strong> מי שהגיע לגיל הפרישה ואינו עומד באף חלופת אכשרה, עשוי להיות זכאי ל<strong>קצבת אזרח ותיק מיוחדת</strong>. קצבה זו מותנית ב<strong>מבחן הכנסות מחמיר</strong> ובתושבות ישראל.</p>
                </div>

                <h3>גיל הפרישה וגיל הזכאות לקצבה</h3>
                <p>הזכאות לקצבה תלויה בשני מועדים:</p>
                <ol>
                    <li><strong>גיל הפרישה:</strong> גברים - 67, נשים - 62 עד 65 (לפי שנת לידה). מותנה ב<strong>מבחן הכנסות</strong>.</li>
                    <li><strong>גיל הזכאות המוחלט:</strong> גיל 70. אינו מותנה בהכנסות (בתנאי שנצברה אכשרה).</li>
                </ol>

                <h3>נקודות בדיקה חשובות</h3>
                <ol>
                    <li><strong>מצב משפחתי:</strong> גירושין/אלמנות עשויים לתת פטור.</li>
                    <li><strong>הוכחת עבודה:</strong> לשכירים – התקופה נספרת גם אם המעסיק חב לביטוח לאומי.</li>
                    <li><strong>תקופות נכות:</strong> לבדוק קצבת נכות (75% ומעלה) שנספרת כאכשרה.</li>
                    <li><strong>עקרות בית:</strong> לבדוק אם כדאי לשלם כ"לא עובדת" כדי לשמור זכאות לגיל פרישה מוקדם.</li>
                </ol>

                <h2>מבחן הכנסות</h2>
                <p>בין גיל הפרישה לגיל ${age('retirement_age_unconditional')}: קיים מבחן הכנסות מעבודה</p>

                <h3>תקרות הכנסה לשנת 2026</h3>
                <p><strong>יחיד:</strong> זכאות מלאה עד ${c('income_test_single_full')}, זכאות חלקית עד ${c('income_test_single_partial')}, אין זכאות מעל ${c('income_test_single_partial')}</p>
                <p><strong>נשוי:</strong> זכאות מלאה עד ${c('income_test_married_full')}, זכאות חלקית עד ${c('income_test_married_partial')}, אין זכאות מעל ${c('income_test_married_partial')}</p>
                <p><strong>הפחתה:</strong> ${p('income_test_deduction_rate')} מההכנסה העודפת מעל התקרה מופחתת מסכום הקצבה</p>

                <p><strong>** חשוב מאוד:</strong> הכנסה מפנסיה (קרן פנסיה, ביטוח מנהלים) אינה נכללת במבחן ההכנסות!</p>
                <p>רק הכנסות מעבודה (שכיר או עצמאי) והכנסות מנכסים (השכרה, ריבית) נחשבות.</p>

                <h2>סכומי הקצבה הבסיסית לשנת 2026</h2>
                <p><strong>עדכון:</strong> קצבאות אזרח ותיק עלו ב-2.4% בינואר 2026 (הצמדה למדד המחירים)</p>

                <ul>
                    <li><strong>יחיד/ה:</strong> ${c('pension_single_basic')} לחודש (עליה של 43 ₪ לעומת 2025)</li>
                    <li><strong>יחיד/ה בגיל 80 ומעלה:</strong> ${c('pension_single_over80')} לחודש (תוספת 103 ₪)</li>
                    <li><strong>יחיד עם בן זוג שאינו מקבל קצבה:</strong> ${c('pension_couple_basic')} לחודש (עליה של 65 ₪)</li>
                    <li><strong>זוג שניהם מקבלים:</strong> ${c('pension_single_basic')} לכל אחד (₪${fmt(v('pension_single_basic') * 2)} סה"כ)</li>
                    <li><strong>תוספת לבן/בת זוג:</strong> ${c('pension_spouse_supplement')}</li>
                    <li><strong>תוספת לכל ילד (עד 2 ילדים):</strong> ${c('pension_child_supplement')}</li>
                </ul>

                <h2>תוספת ותק</h2>
                <p>תוספת ותק היא תוספת לקצבה בהתאם למספר שנות הביטוח במוסד לביטוח לאומי.</p>
                <ul>
                    <li><strong>שיעור:</strong> ${p('seniority_bonus_rate')} לכל שנת ביטוח מלאה (12 חודשים), החל מהשנה הראשונה</li>
                    <li><strong>תוספת מקסימלית:</strong> ${p('seniority_bonus_max')} (עבור <strong>25 שנות ביטוח ומעלה</strong>)</li>
                    <li><strong>חישוב:</strong> על הקצבה הבסיסית + תוספות בני משפחה</li>
                    <li><strong>דוגמה:</strong> 25 שנות ביטוח = ${p('seniority_bonus_max')} תוספת = ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)} (על ${c('pension_single_basic')})</li>
                    <li><strong>סה"כ עם ותק מקסימלי:</strong> ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))} ליחיד</li>
                </ul>
                <p><strong>** מרבית מקבלי הקצבה זכאים לתוספת ותק של ${p('seniority_bonus_max')} (אחרי 25 שנות ביטוח)</strong></p>
                <p><a href="https://www.kolzchut.org.il/he/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA_%D7%95%D7%AA%D7%A7_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94" target="_blank">תוספת ותק באתר כל זכות</a></p>

                <h2>תוספת דחיית קצבה</h2>
                <p>מי שדוחה את קבלת הקצבה בשל הכנסות מעבודה שעוברות את תקרת הזכאות לקצבת זקנה מלאה, זכאי לתוספת נוספת:</p>
                <ul>
                    <li><strong>שיעור:</strong> ${p('deferral_bonus_rate')} לכל שנת דחייה</li>
                    <li><strong>תנאי:</strong> דחייה בגלל הכנסות מעבודה בלבד (לא הכנסות אחרות)</li>
                    <li><strong>תקופת הדחייה:</strong> מגיל פרישה עד גיל ${age('retirement_age_unconditional')}</li>
                    <li><strong>תוספת מקסימלית לגבר:</strong> ${p('deferral_bonus_max_male')} (3 שנות דחייה - מגיל ${age('retirement_age_male')} עד ${age('retirement_age_unconditional')})</li>
                    <li><strong>תוספת מקסימלית לאישה:</strong> עד ${p('deferral_bonus_max_female')} (8 שנות דחייה - תלוי בגיל פרישה)</li>
                    <li><strong>חישוב:</strong> על הקצבה הבסיסית + תוספת ותק</li>
                </ul>
                <p><strong>** חשוב:</strong> תוספת הדחייה אינה משולמת בדיעבד - יש להגיש תביעה לקצבה בזמן אמת</p>

                <h2>תשלום רטרואקטיבי</h2>
                <p style="padding-right:1.6em;text-indent:-1.6em;">✅ אם מגישים את התביעה לאחר גיל הפרישה - אפשר לקבל קצבה רטרואקטיבית עבור 12 חודשים לכל היותר מיום הגשת התביעה.</p>
                <p style="padding-right:1.6em;text-indent:-1.6em;">✅ אם מגישים את התביעה לאחר גיל הזכאות לקצבת אזרח ותיק - אפשר לקבל קצבה רטרואקטיבית עבור 48 חודשים לכל היותר מיום הגשת התביעה. מתוך תקופה זו, שנה אחת יכולה להיות גם לפני גיל הזכאות, והקצבה עבורה תינתן בהתאם למבחן הכנסות.</p>
                <p style="padding-right:1.6em;text-indent:-1.6em;">✅ שימו לב, מקבלי קצבאות אחרות מהביטוח הלאומי צריכים להגיש תביעה לקצבת אזרח ותיק כאשר הם מגיעים לגיל הפרישה. ראו כאן מידע על מעבר מקצבאות אחרות לקצבת אזרח ותיק.</p>

                <h3>דוגמה מקיפה לחישוב קצבה</h3>
                <p>גבר בן ${age('retirement_age_unconditional')}, היה מבוטח 25 שנים, דחה קצבה 3 שנים בשל עבודה:</p>
                <ul>
                    <li>1. קצבה בסיסית: ${c('pension_single_basic')}</li>
                    <li>2. תוספת ותק (${p('seniority_bonus_max')} - מקסימום): ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)}</li>
                    <li>3. קצבה אחרי ותק: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))}</li>
                    <li>4. תוספת דחייה (${p('deferral_bonus_max_male')} על ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))}): ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * v('deferral_bonus_max_male') / 100)}</li>
                    <li>5. <strong>סה"כ קצבה חודשית: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * (1 + v('deferral_bonus_max_male') / 100))}</strong></li>
                </ul>
            `;
            }
        },
        {
            icon: "💵",
            title: "גמלת השלמת הכנסה",
            contentFn: function(nii) {
                const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
                const v = key => nii[key] ? nii[key].value : 0;
                const p = key => nii[key] ? nii[key].value + '%' : '—';
                return `
                <p>חוברת זו מרכזת את המידע העדכני ביותר (נכון לשנת 2026) בנושא תוספת השלמת הכנסה לקצבת אזרח ותיק. התוספת נועדה להבטיח הכנסה מינימלית לקיום בכבוד עבור מי שקצבת הזקנה שלו והכנסותיו האחרות אינן מספיקות.</p>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <h3>1. תנאי זכאות בסיסיים</h3>
                <p>כדי להיות זכאי להשלמת הכנסה, על המבקש לעמוד בארבעה תנאים מצטברים:</p>
                <ol>
                    <li><strong>קבלת קצבת אזרח ותיק:</strong> המבקש זכאי לקצבה מהביטוח הלאומי.</li>
                   <li><strong>תושבות:</strong> תושב ישראל ב-24 החודשים האחרונים.</li>
                    <li><strong>מבחן הכנסות:</strong> סך ההכנסות (מפנסיה, עבודה, נכסים וכו') אינו עולה על "ההכנסה המקסימלית" המזכה.</li>
                    <li><strong>מבחן נכסים ורכב:</strong> בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (${c('vehicle_threshold_base')}).</li>
                    <li><strong>הערה:</strong> הכנסות או נכסים מעל התקרה, יתכן ויאפשרו קבלת השלמת הכנסה חלקית.</li>
                </ol>

                <h3>2. זכאות זוגית: שני תרחישים מרכזיים</h3>

                <h4>א. שני בני הזוג זכאים לקצבת אזרח ותיק</h4>
                <p>כאשר שני בני הזוג מקבלים קצבה אישית, הם נחשבים כ"זוג" לעניין השלמת ההכנסה.</p>
                <ul>
                    <li><strong>החישוב:</strong> בודקים את סך ההכנסות המשותפות של שניהם. אם הסכום נמוך מתקרת ה"זוג" (בתוספת הוותק של שניהם), הם יקבלו השלמה מלאה. אם הסכום מעל תקרת "זוג". תבדק הזכאות שלהם להשלמה חלקית..</li>
                    <li><strong>תוספת ותק:</strong> הוותק של כל אחד מבני הזוג נשמר ומתווסף לתקרה המשותפת.</li>
                    <li><strong>חלוקה:</strong> התוספת משולמת בדרך כלל לאחד מבני הזוג (לרוב זה שזכאי לקצבה הגבוהה יותר).</li>
                </ul>

                <h4>ב. רק אחד מבני הזוג זכאי לקצבת אזרח ותיק (והשני "בן זוג")</h4>
                <p>מצב זה קורה כשאחד מבני הזוג הגיע לגיל פרישה והשני טרם הגיע לגיל, אך עונה על הגדרת "בן זוג" (מתגורר עמו ואין לו הכנסות גבוהות).</p>
                <ul>
                    <li><strong>תוספת בן זוג:</strong> המבוטח יקבל בקצבת הזקנה שלו "תוספת עבור בן זוג".</li>
                    <li><strong>השלמת הכנסה:</strong> הזכאות תחושב לפי תעריף של <strong>זוג</strong>.</li>
                </ul>

                <h3>3. סכומי הקצבה (קצבת אזרח ותיק + השלמת הכנסה)</h3>
                <p>הסכומים להלן הם הסכומים הכוללים שהמבוטח יקבל (הקצבה הבסיסית + התוספת):</p>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                      <th style="padding: 12px; border: 1px solid #ddd;">סוג המשפחה</th>
                      <th style="padding: 12px; border: 1px solid #ddd;">גיל פרישה עד 70</th>
                      <th style="padding: 12px; border: 1px solid #ddd;">גיל 70 עד 80</th>
                      <th style="padding: 12px; border: 1px solid #ddd;">גיל 80 ומעלה</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>יחיד</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_over80')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>זוג</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_over80')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>יחיד + ילד</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_1child_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_1child_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_1child_over80')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>זוג + ילד</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_1child_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_1child_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_1child_over80')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>יחיד + 2 ילדים</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_2children_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_2children_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_single_2children_over80')}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>זוג + 2 ילדים</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_2children_under70')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_2children_70_80')}</td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${c('income_supplement_couple_2children_over80')}</td>
                    </tr>
                  </tbody>
                </table>

                <h3>4. תקרות הכנסה וחישוב זכאות</h3>
                    <ol>
                    <li>קובעים את הסכום המקסימלי להשלמה (${c('income_supplement_single_under70')} יחיד / ${c('income_supplement_couple_under70')} זוג)</li>
                    <li>בודקים הכנסות קיימות:
                        <ul>
                        <li>קצבת זקנה - מותרת עד התקרה המלאה</li>
                        <li>הכנסה מעבודה - מותרת: יחיד ${c('work_income_exempt_single')}, זוג ${c('work_income_exempt_couple')} — ${p('income_test_deduction_rate')} מהכנסה עודפת מקוזז מההשלמה</li>
                        <li>קצבת פנסיה - מותרת: יחיד ${c('pension_income_exempt_single')}, זוג ${c('pension_income_exempt_couple')} — כל שקל מפנסיה עודפת מקוזז מההשלמה</li>
                        </ul>
                    </li>
                    </ol>
                        <h4>💰 חישוב הכנסה רעיונית מנכסים פיננסיים</h4>
                        <p>למי שיש פיקדונות, חסכונות או השקעות, עשוי להיות חישוב של "הכנסה רעיונית" מנכסים אלה. הכנסה זו מופחתת מסכום ההשלמה.</p>
                        <p><a href="imputed_income_guide.html" target="_blank" style="color: #9c27b0; text-decoration: none; font-weight: 600;">📖 מדריך מפורט: חישוב הכנסה רעיונית מנכסים פיננסיים</a></p>


                <h3>6. בעלות על רכב</h3>
                <p>בעלות על רכב עלולה לשלול זכאות, אלא אם מתקיים אחד מהתנאים הבאים:</p>
                <ul>
                    <li>שווי הרכב נמוך מ-${c('vehicle_threshold_base')} (והוא הרכב היחיד).</li>
                    <li>הרכב משמש לצרכים רפואיים (נכות של המבוטח או בן משפחה).</li>
                    <li>המבוטח עובד ומשתכר מעל סכום מסוים וזקוק לרכב כדי להגיע לעבודה.</li>
                </ul>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <h3>7. צורת חישוב הזכאות - סיכום השלבים</h3>
                <ol>
                    <li><strong>קביעת הקצבה המקסימלית:</strong> בדקו בטבלה (סעיף 3) מהו הסכום המגיע לכם לפי הרכב משפחתי וגיל.</li>
                    <li><strong>חישוב הכנסות לא מעבודה:</strong> חברו פנסיה + הכנסה מנכסים (מעבר לפטור).</li>
                    <li><strong>חישוב הכנסות מעבודה:</strong> (השכר ברוטו פחות הסכום הפטור) כפול 0.6.</li>
                    <li><strong>הפחתה מהקצבה:</strong> קחו את הקצבה המקסימלית והחסירו ממנה את התוצאות משלבים 2 ו-3.</li>
                    <li><strong>התוצאה:</strong> זהו סכום הקצבה שתקבלו בפועל.</li>
                </ol>

                <h3>8. הטבות נלוות לזכאים</h3>
                <p>קבלת השלמת הכנסה מקנה זכאות אוטומטית למגוון הטבות:</p>
                <ul>
                    <li><strong>חשמל:</strong> הנחה משמעותית בחשבון החשמל.</li>
                    <li><strong>ארנונה:</strong> הנחה בארנונה (בכפוף לרשות המקומית).</li>
                    <li><strong>מים:</strong> הטבה בתעריפי המים.</li>
                    <li><strong>בריאות:</strong> הנחה ברכישת תרופות.</li>
                    <li><strong>דיור:</strong> סיוע בשכר דירה ממשרד הבינוי והשיכון.</li>
                </ul>
            `;
            }
        },
        {
            icon: "🏥",
            title: "גמלת סיעוד",
            contentFn: function(nii) {
                const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = num => Math.round(num).toLocaleString('he-IL');
                return `
                <h2>גמלת סיעוד</h2>
                <p>גמלת סיעוד מיועדת לאזרחים ותיקים הזקוקים לעזרה בפעולות יומיומיות.</p>

                <h3>תנאי זכאות</h3>
                <ul>
                    <li>אזרח ישראל ותושב ישראל</li>
                    <li>גיל: 65+ (או 60+ במקרים מיוחדים של מחלות קשות)</li>
                    <li>תלות בעזרת הזולת לפעולות יומיומיות (רחצה, אכילה, לבוש וכו')</li>
                    <li>עמידה במבחן הכנסות (עבור חצי גמלה)</li>
                </ul>

                <h3>סכומי גמלת סיעוד 2026</h3>
                <p><strong>עדכון:</strong> גמלאות סיעוד עלו ב-2.4% בינואר 2026</p>

                <h4>גמלה מלאה — שווי כספי</h4>
                <ul>
                    <li><strong>דרגה 1 (קלה):</strong> ${c('nursing_level_1_cash')}</li>
                    <li><strong>דרגה 2:</strong> ${c('nursing_level_2_cash')}</li>
                    <li><strong>דרגה 3:</strong> ${c('nursing_level_3_cash')}</li>
                    <li><strong>דרגה 4:</strong> ${c('nursing_level_4_cash')}</li>
                    <li><strong>דרגה 5:</strong> ${c('nursing_level_5_cash')}</li>
                    <li><strong>דרגה 6 (קשה):</strong> ${c('nursing_level_6_cash')}</li>
                </ul>

                <h4>חצי גמלה (עקב מבחן הכנסות)</h4>
                <ul>
                    <li><strong>דרגה 1:</strong> ₪${fmt(v('nursing_level_1_cash') / 2)}</li>
                    <li><strong>דרגה 6:</strong> ₪${fmt(v('nursing_level_6_cash') / 2)}</li>
                </ul>

                <p><strong>** גמלת סיעוד יכולה להינתן גם בשירותים:</strong> מטפל סיעודי, שירותי כביסה, לחצן מצוקה, מרכז יום ועוד</p>

                <h3>מבחן הכנסות</h3>
                <p>תקרת הכנסות לקבלת גמלה מלאה:</p>
                <ul>
                    <li><strong>יחיד:</strong> עד ${c('nursing_income_test_full_single')} הכנסה חודשית</li>
                    <li><strong>זוג:</strong> עד ${c('nursing_income_test_full_couple')} הכנסה חודשית</li>
                </ul>
                <p>תקרת הכנסות לקבלת חצי גמלה:</p>
                <ul>
                    <li><strong>יחיד:</strong> עד ${c('nursing_income_test_half_single')} הכנסה חודשית</li>
                    <li><strong>זוג:</strong> עד ${c('nursing_income_test_half_couple')} הכנסה חודשית</li>
                </ul>
                <p><strong>** מעל תקרות אלה — אין זכאות לגמלת סיעוד</strong></p>
            `;
            }
        },
        {
            icon: "🕯️",
            title: "זכויות מיוחדות לניצולי שואה",
            content: `
                <h2>מי נחשב ניצול שואה?</h2>
                <p>לפי חוק, ניצול שואה הוא:</p>
                <ul>
                    <li>יהודי שהיה בגטו, במחנה ריכוז, במחבוא או בהסתתרות בתקופת השואה</li>
                    <li>יהודי שנמלט מאזור שהיה תחת שלטון נאצי</li>
                    <li>יהודי שהיה בברית המועצות בתקופת המלחמה</li>
                    <li>יהודי שהיה בארצות שסבלו מרדיפות נאציות (צפון אפריקה, עיראק וכו')</li>
                </ul>

                <h3>קצבאות מיוחדות</h3>

                <h4>תוספת לניצולי שואה לקצבת זקנה</h4>
                <ul>
                    <li><strong>תוספת חודשית:</strong> כ-4,200 ₪ (הסכום המדויק משתנה)</li>
                    <li>התוספת משולמת באופן אוטומטי למוכרים כניצולי שואה</li>
                </ul>

                <h4>רנטה מגרמניה</h4>
                <ul>
                    <li>ניצולי שואה זכאים לרנטה חודשית מגרמניה</li>
                    <li>הסכום משתנה לפי תקופת הרדיפה ומצב הבריאות</li>
                    <li>הרנטה אינה פוגעת בזכאות לקצבאות מביטוח לאומי</li>
                </ul>

                <h4>קצבת שארים מיוחדת</h4>
                <ul>
                    <li>אלמן/ת של ניצול שואה זכאי/ת לקצבת שארים מוגדלת</li>
                    <li>הקצבה כוללת את התוספת המיוחדת לניצולי שואה</li>
                </ul>

                <h3>הטבות נוספות</h3>
                <ul>
                    <li>פטור מתשלום דמי ביטוח בריאות</li>
                    <li>הנחות בארנונה (לפי החלטת הרשות המקומית)</li>
                    <li>סל שירותים מורחב בקופות החולים</li>
                    <li>עדיפות בקבלת שירותי סיעוד</li>
                    <li>זכאות להשתתפות בטיולים ובפעילויות תרבות</li>
                    <li>סיוע בתשלום שכר דירה (למי שגר בדירה שכורה)</li>
                    <li>הנחות בתחבורה ציבורית</li>
                </ul>
            `
        },
        {
            icon: "👥",
            title: "קצבת שארים",
            contentFn: function(nii) {
                const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = num => Math.round(num).toLocaleString('he-IL');
                const pct = key => nii[key] ? nii[key].value : 0;
                return `
                <h2>קצבת שארים</h2>
                <p>קצבת שארים משולמת לבני משפחה של אדם שנפטר והיה מבוטח בביטוח לאומי.</p>

                <h3>זכאים לקצבה</h3>
                <ul>
                    <li>אלמן/אלמנה</li>
                    <li>יתומים (עד גיל 18, או עד 22 אם לומדים, או עד 24 אם בשירות צבאי)</li>
                    <li>הורים תלויים (במקרים מסוימים)</li>
                </ul>

                <h3>סכומי קצבת שארים 2026</h3>
                <p><strong>עדכון:</strong> קצבת שארים עלתה ב-2.4% בינואר 2026</p>

                <h4>אלמן/אלמנה</h4>
                <ul>
                    <li><strong>בסיסי:</strong> ${c('survivors_widow_over50')}</li>
                    <li><strong>עם תוספת ותק (${pct('seniority_bonus_max')}%):</strong> ₪${fmt(v('survivors_widow_over50') * (1 + pct('seniority_bonus_max') / 100))}</li>
                    <li><strong>תוספת לכל ילד:</strong> ${c('survivors_orphan')}</li>
                </ul>

                <h4>יתום (לכל ילד)</h4>
                <ul>
                    <li><strong>יתום מאב או מאם:</strong> ${c('survivors_orphan')}</li>
                    <li><strong>יתום משני הורים (אם שני ההורים היו זכאים לקצבה):</strong> ${c('orphan_both_parents_first')}</li>
                </ul>

                <h4>תוספת למשפחה</h4>
                <ul>
                    <li><strong>אלמנה + יתום אחד:</strong> ₪${fmt(v('survivors_widow_over50') * (1 + pct('seniority_bonus_max') / 100))} + ${c('survivors_orphan')} = ₪${fmt(v('survivors_widow_over50') * (1 + pct('seniority_bonus_max') / 100) + v('survivors_orphan'))}</li>
                    <li><strong>אלמנה + 2 יתומים:</strong> ₪${fmt(v('survivors_widow_over50') * (1 + pct('seniority_bonus_max') / 100))} + ₪${fmt(v('survivors_orphan') * 2)} = ₪${fmt(v('survivors_widow_over50') * (1 + pct('seniority_bonus_max') / 100) + v('survivors_orphan') * 2)}</li>
                </ul>
            `;
            }
        },
        {
            icon: "🎁",
            title: "הטבות נוספות",
            content: `
                <h2>הנחות בארנונה</h2>
                <ul>
                    <li><strong>גיל 70+:</strong> הנחה של 25% (בדרך כלל - משתנה לפי רשות מקומית)</li>
                    <li><strong>ניצולי שואה:</strong> הנחות נוספות</li>
                    <li><strong>מקבלי הבטחת הכנסה:</strong> פטור מלא או חלקי</li>
                    <li>יש לפנות למחלקת הגבייה ברשות המקומית</li>
                </ul>

                <h2>הנחות במס הכנסה</h2>
                <h3>נקודות זיכוי נוספות</h3>
                <ul>
                    <li><strong>גיל 60+:</strong> 1 נקודת זיכוי נוספת</li>
                    <li><strong>ניצולי שואה:</strong> 3 נקודות זיכוי נוספות</li>
                    <li>פטור ממס על קצבת זקנה (עד תקרה מסוימת)</li>
                </ul>

                <h2>הנחות בתחבורה ציבורית</h2>
                <ul>
                    <li><strong>גיל 75+:</strong> נסיעות חינם בתחבורה ציבורית</li>
                    <li><strong>גיל 62-74:</strong> הנחה של 50% ברכבת ישראל</li>
                    <li><strong>ניצולי שואה:</strong> נסיעות חינם בכל גיל</li>
                </ul>

                <h2>הנחות בתרבות ונופש</h2>
                <ul>
                    <li>כניסה חינם או במחיר מופחת למוזיאונים</li>
                    <li>הנחות בבריכות שחייה ומתקני ספורט</li>
                    <li>הנחות בקולנוע ותיאטרון</li>
                    <li>מלונות ובתי הבראה - מחירים מיוחדים לאזרחים ותיקים</li>
                </ul>

                <h2>שירותי בריאות</h2>
                <ul>
                    <li>פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה)</li>
                    <li>סל תרופות מורחב לאזרחים ותיקים</li>
                    <li>בדיקות גריאטריות תקופתיות</li>
                    <li>שירותי פיזיותרפיה ושיקום</li>
                </ul>

                <h2>שירותים חברתיים</h2>
                <ul>
                    <li>מועדוני אזרחים ותיקים</li>
                    <li>מרכזי יום</li>
                    <li>ארוחות חמות בבית</li>
                    <li>שירותי ליווי וקשר חברתי</li>
                </ul>
            `
        },
        {
            icon: "📞",
            title: "כתובות ומידע ליצירת קשר",
            content: `
                <h2>המוסד לביטוח לאומי</h2>
                <ul>
                    <li><strong>אתר אינטרנט:</strong> www.btl.gov.il</li>
                    <li><strong>טלפון:</strong> *6050 (מוקד טלפוני)</li>
                    <li><strong>שעות פעילות:</strong> ראשון-חמישי 08:00-16:00</li>
                </ul>

                <h3>מוקדים ייעודיים</h3>
                <ul>
                    <li><strong>מוקד קצבאות זקנה:</strong> *6050 שלוחה 3</li>
                    <li><strong>מוקד השלמת הכנסה:</strong> *6050 שלוחה 4</li>
                    <li><strong>מוקד סיעוד:</strong> *6050 שלוחה 5</li>
                    <li><strong>מוקד ניצולי שואה:</strong> *6050 שלוחה 9</li>
                </ul>

                <h3>סניפי ביטוח לאומי</h3>
                <p>ניתן למצוא את הסניף הקרוב באתר הביטוח הלאומי.</p>
                <p>מומלץ לתאם פגישה מראש דרך האתר או בטלפון.</p>

                <h2>ארגונים נוספים</h2>

                <h3>ארגון נכי המלחמה בנאצים</h3>
                <ul>
                    <li><strong>טלפון:</strong> 03-6838282</li>
                    <li><strong>כתובת:</strong> דרך מנחם בגין 132, תל אביב</li>
                </ul>

                <h3>קול זכות (מידע על זכויות)</h3>
                <ul>
                    <li><strong>טלפון:</strong> *6050</li>
                    <li><strong>אתר:</strong> www.kolzchut.org.il</li>
                </ul>

                <h3>משרד הרווחה - מחלקה גריאטרית</h3>
                <ul>
                    <li><strong>טלפון:</strong> 02-5085940</li>
                </ul>

                <h3>אשל - האיגוד הארצי לתכנון ולפיתוח שירותים לזקן בישראל</h3>
                <ul>
                    <li><strong>טלפון:</strong> 03-6874714</li>
                    <li><strong>אתר:</strong> www.eshelnet.org.il</li>
                </ul>

                <h2>סיכום והערות חשובות</h2>
                <ul>
                    <li>1. כל הסכומים במסמך זה מעודכנים לינואר 2026 ועשויים להשתנות במהלך השנה</li>
                    <li>2. מומלץ לבדוק את הזכאות האישית במחשבונים באתר הביטוח הלאומי</li>
                    <li>3. יש להגיש תביעות לקצבאות בזמן - חלק מהקצבאות אינן משולמות בדיעבד</li>
                    <li>4. שירותים רבים ניתנים באמצעות האתר, ללא צורך בהגעה פיזית לסניף</li>
                    <li>5. ניתן לקבל ייעוץ אישי בסניפי הביטוח הלאומי ובארגוני הסיוע השונים</li>
                    <li>6. למקבלי קצבאות מומלץ לעדכן את פרטיהם (כתובת, חשבון בנק וכו') בזמן</li>
                    <li>7. זכאות לקצבאות עשויה להשתנות עקב שינויים בהכנסות, במצב המשפחתי או במצב הבריאותי</li>
                </ul>

                <p><strong>מסמך זה הוכן כמדריך כללי ואינו מהווה ייעוץ משפטי או פיננסי.</strong></p>
                <p><strong>לשאלות ספציפיות יש לפנות למוסד לביטוח לאומי או לגורם מקצועי מתאים.</strong></p>

                <p style="text-align: center; margin-top: 30px;"><strong>עודכן לאחרונה: ינואר 2026</strong></p>
            `
        }
    ]
};
