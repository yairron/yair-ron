const SENIOR_RIGHTS_2026_DATA = {
    lastUpdate: "2026-04-14",
    sections: [
        {
            icon: "⚖️",
            id: "nvs-choose",
            title: "חובה לבחור בין קצבת נכות לבין קצבת שאירים",
            contentFn: function(nii) {
                return `
                <h3 class="no-accordion" id="nvs-choose-principle">העיקרון המשפטי</h3>
                <p>לפי סעיף 323(א) לחוק הביטוח הלאומי, מי שזכאי לקצבת שאירים וגם לקצבת נכות כללית אינו יכול לקבל את שתיהן בו-זמנית, ועליו לבחור אחת מהן.</p>

                <h3 class="no-accordion" id="nvs-choose-note">חשוב לדעת</h3>
                <div style="background:#FFF3E0;border:1px solid #FFCC80;border-radius:12px;padding:14px 16px;margin:12px 0;">
                    <p style="margin:0;font-weight:700;color:#E65100;">⚠ הבחירה בין הקצבאות עשויה להשפיע משמעותית על ההכנסה לטווח ארוך.</p>
                    <p style="margin:8px 0 0 0;">מומלץ לבחון את כלל השיקולים לפני החלטה ולהתייעץ עם הביטוח הלאומי בטלפון <span dir="ltr">*9696</span>.</p>
                </div>
                `;
            }
        },
        {
            icon: "💰",
            id: "nvs-amounts",
            title: "השוואת סכומים ותקרות",
            contentFn: function(nii) {
                const v = key => (nii && nii[key]) ? nii[key].value : 0;
                const c = key => (nii && nii[key]) ? v(key).toLocaleString('he-IL') : '—';
                const p = key => (nii && nii[key]) ? `${v(key)}%` : '—';
                const disabilityWithSpouse = v('disability_full') + v('disability_spouse');
                const disabilityWithChild = v('disability_full') + v('disability_child');
                const maxSenioritySurvivors = Math.round(v('survivors_widow_over50') * (1 + (v('seniority_bonus_max') / 100)));
                return `
                <div style="display:flex;flex-direction:column;gap:24px;margin:12px 0;">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:stretch;">
                    <div style="border:1px solid #D7E3F0;background:#F8FBFE;border-radius:16px;padding:18px 20px;height:100%;display:flex;flex-direction:column;">
                        <h3 class="no-accordion" id="nvs-amounts-disability" style="margin:0 0 10px 0;">קצבת נכות כללית</h3>
                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">סכומי הקצבה</h4>
                        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
                            <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">
                                <th style="padding:10px;border:1px solid #ddd;">מצב / דרגת אי-כושר</th>
                                <th style="padding:10px;border:1px solid #ddd;">קצבה חודשית</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה מלאה 75% או 100% - יחיד</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${c('disability_full')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה מלאה + בן/בת זוג (שאינם מקבלים קצבה)</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${disabilityWithSpouse.toLocaleString('he-IL')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה מלאה + ילד אחד</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${disabilityWithChild.toLocaleString('he-IL')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה חלקית 74%</td><td style="padding:9px;border:1px solid #ddd;">${c('disability_74')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה חלקית 65%</td><td style="padding:9px;border:1px solid #ddd;">${c('disability_65')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">דרגה חלקית 60%</td><td style="padding:9px;border:1px solid #ddd;">${c('disability_60')} ₪</td></tr>
                            </tbody>
                        </table>

                        <div style="position:relative;margin:24px 0 14px;padding:22px 12px 12px;background:#F7FAFC;border:2px solid #546E7A;border-radius:16px;margin-top:auto;">
                            <h4 class="no-accordion" style="position:absolute;top:-14px;right:14px;margin:0;padding:0 12px;background:#fff;color:#546E7A;font-weight:800;">הצמדה</h4>
                            <p style="margin:0;">מוצמדת לשכר הממוצע במשק<br>עלתה 3.4% בינואר 2026<br>עלתה ~480 ₪ בשנתיים האחרונות<br>צומחת מהר יחסית עם השכר</p>
                        </div>
                    </div>

                    <div style="border:1px solid #DDE8E0;background:#FAFCFA;border-radius:16px;padding:18px 20px;height:100%;display:flex;flex-direction:column;">
                        <h3 class="no-accordion" id="nvs-amounts-survivors" style="margin:0 0 10px 0;">קצבת שאירים (אלמן/אלמנה)</h3>
                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">סכומי הקצבה</h4>
                        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
                            <thead><tr style="background:linear-gradient(135deg,#26A69A,#00897B);color:#fff;">
                                <th style="padding:10px;border:1px solid #ddd;">מצב</th>
                                <th style="padding:10px;border:1px solid #ddd;">קצבה בסיסית<br>חודשית</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה גיל 40-50, ללא ילדים</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_widow_40_49')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה גיל 50 ומעלה, ללא ילדים</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_widow_over50')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה גיל 80 ומעלה</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_widow_over80')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה עם ילד אחד</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_spouse_1child')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה עם שני ילדים</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_spouse_2children')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">לכל ילד נוסף</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_orphan')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">לכל ילד (יתום) בנפרד</td><td style="padding:9px;border:1px solid #ddd;">${c('orphan_both_parents_first')} ₪</td></tr>
                            </tbody>
                        </table>
                        <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:14px 16px;margin:10px 0 14px 0;">
                            <p style="margin:0 0 8px 0;"><strong>תוספת ותק:</strong> ${p('seniority_bonus_rate')} לכל שנת ביטוח מלאה, עד תקרה של ${p('seniority_bonus_max')}.</p>
                            <p style="margin:0;">דוגמה: תוספת מקסימלית על קצבת אלמנה גיל 50+ ללא ילדים: <strong>${maxSenioritySurvivors.toLocaleString('he-IL')} ₪</strong>.</p>
                        </div>

                        <div style="position:relative;margin:24px 0 14px;padding:22px 12px 12px;background:#F7FAFC;border:2px solid #546E7A;border-radius:16px;margin-top:auto;">
                            <h4 class="no-accordion" style="position:absolute;top:-14px;right:14px;margin:0;padding:0 12px;background:#fff;color:#546E7A;font-weight:800;">הצמדה</h4>
                            <p style="margin:0;">מוצמדת למדד המחירים לצרכן<br>עלתה רק 2.4% בינואר 2026<br>עלתה עשרות שקלים בלבד<br>נשחקת בערך ריאלי לאורך זמן</p>
                        </div>
                    </div>
                </div>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:start;">
                    <div style="border:1px solid #D7E3F0;background:#F8FBFE;border-radius:16px;padding:18px 20px;">
                        <h4 class="no-accordion" style="margin:0 0 6px 0;">תקרות הכנסה ומבחני הכנסה</h4>
                        <table style="width:100%;border-collapse:collapse;margin:12px 0 0 0;">
                            <thead><tr style="background:linear-gradient(135deg,#5C6BC0,#3949AB);color:#fff;">
                                <th style="padding:10px;border:1px solid #ddd;">קריטריון</th>
                                <th style="padding:10px;border:1px solid #ddd;">ערך חודשי</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:9px;border:1px solid #ddd;">תקרת זכאות לתחילת קצבה</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${c('disability_work_start_ceiling')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">סף ללא הפחתה לבעלי 100% אי-כושר</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${c('disability_work_no_reduction_ceiling')} ₪</td></tr>
                                <tr><td style="padding:9px;border:1px solid #ddd;">תקרת ביטול קצבה לבעלי 100%</td><td style="padding:9px;border:1px solid #ddd;font-weight:700;">${c('disability_work_cancellation_ceiling')} ₪</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="border:1px solid #DDE8E0;background:#FAFCFA;border-radius:16px;padding:18px 20px;">
                        <h4 class="no-accordion" style="margin:0 0 6px 0;">תקרות הכנסה ומבחני הכנסה</h4>
                        <div style="background:#F3E5F5;border:1px solid #CE93D8;border-radius:12px;padding:14px 16px;margin:12px 0 0 0;">
                            <p style="margin:0 0 8px 0;">הסף מתוך לוח י': <strong>${c('survivors_income_test_no_dependents')} ₪</strong>.</p>
                            <p style="margin:0;">אלמנה ללא ילדים אינה כפופה למבחן הכנסות לקצבת השאירים עצמה, אך עשויה להיבדק לעניין השלמת הכנסה.</p>
                        </div>
                    </div>
                </div>
                </div>
                `;
            }
        },
        {
            icon: "✅",
            id: "nvs-advantages",
            title: "השוואת יתרונות",
            contentFn: function(nii) {
                const v = key => (nii && nii[key]) ? nii[key].value : 0;
                const c = key => (nii && nii[key]) ? v(key).toLocaleString('he-IL') : '—';
                return `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:start;">
                    <div style="border:1px solid #D7E3F0;background:#F8FBFE;border-radius:16px;padding:18px 20px;">
                        <h3 class="no-accordion" id="nvs-adv-disability" style="margin:0 0 10px 0;">קצבת נכות כללית</h3>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">א. סכום גבוה יותר</h4>
                        <p style="margin:0 0 10px 0;">בדרגה מלאה, קצבת הנכות עומדת על <strong>${c('disability_full')} ₪</strong>, ולרוב גבוהה משמעותית מקצבת שאירים בסיסית ללא ילדים.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ב. הצמדה לשכר הממוצע</h4>
                        <p style="margin:0 0 10px 0;">קצבת הנכות מוצמדת לשכר הממוצע במשק, ולכן נשחקת פחות לאורך זמן ביחס לקצבה המוצמדת למדד בלבד.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ג. זכויות נלוות משמעותיות</h4>
                        <ul style="margin:0 0 10px 0;">
                            <li>פטור מדמי ביטוח לאומי ודמי ביטוח בריאות (במקרים מסוימים).</li>
                            <li>סיוע בשכר דירה מהמשרד לשיכון.</li>
                            <li>שיקום מקצועי ומימון לימודים/הכשרה.</li>
                            <li>שר"מ וניידות בנוסף לקצבה בתנאים הקבועים בחוק.</li>
                        </ul>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ד. גמישות בעבודה</h4>
                        <div style="background:#E3F2FD;border:1px solid #90CAF9;border-radius:12px;padding:14px 16px;margin:10px 0;">
                            <p style="margin:0 0 8px 0;">עד הכנסה של <strong>${c('disability_work_no_reduction_ceiling')} ₪</strong> ברוטו, הקצבה המלאה נשמרת.</p>
                            <p style="margin:0;">מעל הסכום - יש הפחתה הדרגתית, אך תקרת תחילת הזכאות לקצבה היא <strong>${c('disability_work_start_ceiling')} ₪</strong>.</p>
                        </div>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ה. ביטחון בהפסקת עבודה</h4>
                        <p style="margin:0;">אם ההכנסה יורדת, ניתן לשוב לקבלת קצבה בהתאם לכללי הזכאות ולדרגת אי-הכושר התקפה.</p>
                    </div>

                    <div style="border:1px solid #DDE8E0;background:#FAFCFA;border-radius:16px;padding:18px 20px;">
                        <h3 class="no-accordion" id="nvs-adv-survivors" style="margin:0 0 10px 0;">קצבת השאירים</h3>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">א. ללא מבחן הכנסה בסיסי לאלמנה</h4>
                        <p style="margin:0 0 10px 0;">קצבת שאירים לאלמנה משולמת ללא מבחן הכנסה לקצבה עצמה.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ב. אין תלות במצב בריאותי</h4>
                        <p style="margin:0 0 10px 0;">בניגוד לנכות, הזכאות לשאירים אינה תלויה בוועדות רפואיות חוזרות.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ג. יציבות במקרה של שיפור בריאותי</h4>
                        <p style="margin:0 0 10px 0;">שיפור במצב הרפואי אינו גורר הפחתה אוטומטית בקצבת שאירים.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ד. מענקים נלווים</h4>
                        <p style="margin:0 0 10px 0;">למשפחות עם ילדים עשויים להיות מענקים נוספים (כגון בר/בת מצווה, לימודים ונישואין) לפי תנאי הזכאות.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ה. השלמת הכנסה</h4>
                        <p style="margin:0;">ניתן לבחון תוספת השלמת הכנסה כאשר ההכנסה הכוללת נמוכה מהספים הקבועים.</p>
                    </div>
                </div>
                `;
            }
        },
        {
            icon: "⚠️",
            id: "nvs-risks",
            title: "השוואת סיכונים בוויתור על קצבה",
            contentFn: function(nii) {
                const v = key => (nii && nii[key]) ? nii[key].value : 0;
                const c = key => (nii && nii[key]) ? v(key).toLocaleString('he-IL') : '—';
                const lowLoss = v('disability_full') - v('survivors_spouse_1child');
                const highLoss = v('disability_full') - v('survivors_widow_40_49');
                return `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;align-items:start;">
                    <div style="border:1px solid #F0D8D8;background:#FFF8F8;border-radius:16px;padding:18px 20px;">
                        <h3 class="no-accordion" id="nvs-risks-disability" style="margin:0 0 10px 0;">קצבת נכות</h3>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">א. אובדן הכנסה גבוהה יותר</h4>
                        <p style="margin:0 0 10px 0;">ויתור על קצבת נכות בדרגה מלאה (<strong>${c('disability_full')} ₪</strong>) לטובת שאירים בסיסית עשוי לגרום לפער חודשי גבוה.</p>
                        <p style="margin:0 0 10px 0;">טווח פער לפי הסכומים הבסיסיים: <strong>${lowLoss.toLocaleString('he-IL')}–${highLoss.toLocaleString('he-IL')} ₪</strong> בחודש.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ב. אובדן זכויות נלוות</h4>
                        <p style="margin:0 0 10px 0;">הטבות כמו שר"מ, שיקום מקצועי ופטורים מסוימים אינן ניתנות אוטומטית ללא קצבת נכות פעילה.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ג. הצמדה למדד</h4>
                        <p style="margin:0 0 10px 0;">מוצמדת לשכר הממוצע במשק<br>עלתה 3.4% בינואר 2026<br>עלתה ~480 ₪ בשנתיים האחרונות<br>צומחת מהר יחסית עם השכר</p>

                        <div style="background:#FFEBEE;border:1px solid #EF9A9A;border-radius:12px;padding:14px 16px;margin:10px 0 0 0;">
                            <p style="margin:0;font-weight:700;color:#B71C1C;">! שים לב:</p>
                            <p style="margin:6px 0 0 0;color:#B71C1C;">אם הנכות היא זמנית – ויתור עליה עלול להיות בלתי-הפיך. חשוב לוודא שהנכות קבועה וצפויה להימשך לפני שמוותרים.</p>
                        </div>
                    </div>

                    <div style="border:1px solid #E3E0F2;background:#FAF9FE;border-radius:16px;padding:18px 20px;">
                        <h3 class="no-accordion" id="nvs-risks-survivors" style="margin:0 0 10px 0;">קצבת שאירים</h3>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">א. אובדן זכות במצבים מסוימים</h4>
                        <p style="margin:0 0 10px 0;">סיום קצבת נכות עשוי להשפיע אחרת על חידוש שאירים בהתאם לנסיבות (למשל נישואין).</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ב. ילדים - הגנה מיוחדת</h4>
                        <p style="margin:0 0 10px 0;">כאשר קיימים ילדים, יש מנגנוני הגנה שמבטיחים תשלום לפי הקצבה הגבוהה מבין האפשרויות לילדים.</p>

                        <h4 class="no-accordion" style="margin:10px 0 6px 0;">ג. הצמדה למדד</h4>
                        <p style="margin:0;">מוצמדת למדד המחירים לצרכן<br>עלתה רק 2.4% בינואר 2026<br>עלתה עשרות שקלים בלבד<br>נשחקת בערך ריאלי לאורך זמן</p>
                    </div>
                </div>
                `;
            }
        },
        {
            icon: "🔄",
            id: "nvs-switch",
            title: "האם ניתן לעבור בין הקצבאות?",
            contentFn: function(nii) {
                const age = key => (nii && nii[key]) ? nii[key].value : '—';
                return `
                <div style="background:#F8FBFE;border:1px solid #D7E3F0;border-radius:16px;padding:18px 20px;">
                    <div style="background:#F5F9FC;border-right:4px solid #4A90B5;border-radius:12px;padding:14px 16px;margin:0 0 14px 0;">
                        <p style="margin:0;"><strong>הכלל:</strong> הבחירה הראשונית אינה בהכרח סופית לעולם. ישנם מצבים שבהם הזכות לקצבה הנוספת מתחדשת, אך לא תמיד.</p>
                    </div>

                    <h3 class="no-accordion" id="nvs-switch-to-disability" style="margin:0 0 8px 0;">בחר בנכות – מה קורה לשאירים?</h3>
                    <ul style="margin:0 0 14px 0;">
                        <li>הזכות לשאירים מושהית אך לא נמחקת.</li>
                        <li>הזכות לשאירים מתחדשת בגיל הפרישה (${age('retirement_age_male')} לגבר, 62–65 לאישה).</li>
                        <li>הזכות לשאירים מתחדשת גם כאשר קצבת הנכות פוקעת – בתנאי שלא פקעה עקב נישואין.</li>
                        <li>ילדים – ממשיכים לקבל שאירים (הגבוה מבין השתיים) גם כאשר ההורה בוחר בנכות.</li>
                    </ul>

                    <h3 class="no-accordion" id="nvs-switch-to-survivors" style="margin:10px 0 8px 0;">בחר בשאירים – מה קורה לנכות?</h3>
                    <ul style="margin:0;">
                        <li>קצבת הנכות מופסקת.</li>
                        <li>לצורך חידוש נכות – יש לפנות מחדש לביטוח הלאומי ולעבור ועדה רפואית מחדש (אם הנכות לא הוכרה לתמיד).</li>
                        <li>זכויות נלוות לנכות (שר"מ, ניידות, שיקום) עלולות להיפסק.</li>
                    </ul>

                    <div style="background:#FFF3E0;border:1px solid #FFCC80;border-radius:12px;padding:14px 16px;margin:14px 0 0 0;">
                        <p style="margin:0;font-weight:700;color:#E65100;">⚠ אזהרה:</p>
                        <p style="margin:6px 0 0 0;">אם קצבת הנכות פוקעת עקב נישואין חוזרים – לא ניתן לחדש את קצבת השאירים. נישואין מבטלים את קצבת השאירים ממילא.</p>
                    </div>
                </div>
                `;
            }
        },
        {
            icon: "🧮",
            id: "nvs-comparison",
            title: "נקודות מפתח להשוואה",
            contentFn: function(nii) {
                const v = key => (nii && nii[key]) ? nii[key].value : 0;
                const c = key => (nii && nii[key]) ? v(key).toLocaleString('he-IL') : '—';
                return `
                <table style="width:100%;border-collapse:collapse;margin:12px 0;">
                    <thead><tr style="background:linear-gradient(135deg,#546E7A,#37474F);color:#fff;">
                        <th style="padding:10px;border:1px solid #ddd;">קריטריון</th>
                        <th style="padding:10px;border:1px solid #ddd;">נכות כללית</th>
                        <th style="padding:10px;border:1px solid #ddd;">שאירים</th>
                    </tr></thead>
                    <tbody>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>סכום בסיסי (דרגה מלאה / גיל 50+)</strong></td><td style="padding:9px;border:1px solid #ddd;">${c('disability_full')} ₪</td><td style="padding:9px;border:1px solid #ddd;">${c('survivors_widow_over50')}–${c('survivors_spouse_1child')} ₪</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>הצמדה</strong></td><td style="padding:9px;border:1px solid #ddd;">שכר ממוצע (גבוהה)</td><td style="padding:9px;border:1px solid #ddd;">מדד בלבד (נמוכה)</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>מבחן הכנסה מעבודה</strong></td><td style="padding:9px;border:1px solid #ddd;">כן – עד ${c('disability_work_start_ceiling')} ₪</td><td style="padding:9px;border:1px solid #ddd;">אלמנה: לא; אלמן: כן</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>תלות במצב בריאותי</strong></td><td style="padding:9px;border:1px solid #ddd;">כן – ועדות רפואיות</td><td style="padding:9px;border:1px solid #ddd;">לא</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>זכויות נלוות (שר"מ, ניידות)</strong></td><td style="padding:9px;border:1px solid #ddd;">כן – מגוון רחב</td><td style="padding:9px;border:1px solid #ddd;">מוגבל</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>שיקום מקצועי</strong></td><td style="padding:9px;border:1px solid #ddd;">כן</td><td style="padding:9px;border:1px solid #ddd;">מוגבל</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>מענקים לילדים</strong></td><td style="padding:9px;border:1px solid #ddd;">לא</td><td style="padding:9px;border:1px solid #ddd;">כן (בר-מצווה, לימודים)</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>ילדים ממשיכים לקבל</strong></td><td style="padding:9px;border:1px solid #ddd;">שאירים לילדים נמשכת</td><td style="padding:9px;border:1px solid #ddd;">שאירים לילדים</td></tr>
                        <tr><td style="padding:9px;border:1px solid #ddd;"><strong>גיל הפרישה</strong></td><td style="padding:9px;border:1px solid #ddd;">עובר לנכות זקנה (לא פחות)</td><td style="padding:9px;border:1px solid #ddd;">שאירים + מחצית זקנה</td></tr>
                    </tbody>
                </table>
                `;
            }
        },
        {
            icon: "📌",
            id: "nvs-additional",
            title: "נקודות נוספות מהותיות",
            contentFn: function(nii) {
                const c = key => (nii && nii[key]) ? nii[key].value.toLocaleString('he-IL') : '—';
                return `
                <h3 class="no-accordion" id="nvs-add-a">א. מה קורה בגיל הפרישה?</h3>
                <p>לאדם שקיבל קצבת נכות עד גיל הפרישה – עוברת הקצבה אוטומטית לקצבת זקנה לנכה, לא פחות מקצבת הנכות שקיבל קודם. בגיל הפרישה יכול גם לקבל קצבת שאירים במקביל לזקנה (מחצית שאירים + זקנה מלאה, או שאירים מלאה + מחצית זקנה).</p>

                <h3 class="no-accordion" id="nvs-add-b">ב. נכות פחות מ-90 יום לפני גיל הפרישה</h3>
                <p>מי שהוכר כנכה <strong>פחות מ-90 יום</strong> לפני גיל הפרישה – <strong>אינו זכאי לקצבת נכות כלל</strong>. לפיכך, לא תתעורר שאלת הבחירה, וקצבת השאירים תישאר הברירה היחידה.</p>

                <h3 class="no-accordion" id="nvs-add-c">ג. שאירים + שירותים מיוחדים (שר"מ)</h3>
                <p>מי שבוחר בשאירים ועונה על קריטריוני שר"מ (נכות 60% ומעלה) – עדיין יכול לבקש שר"מ בנפרד. שר"מ אינה תלויה בבחירת קצבת הנכות הכללית ואינה כפופה למבחן הכנסה.</p>

                <h3 class="no-accordion" id="nvs-add-d">ד. ביטוח פנסיוני משלים</h3>
                <p>אם לנפטר היה ביטוח מנהלים, קרן פנסיה או ביטוח חיים – שאיריו עשויים לקבל גם קצבת שאירים מהגוף המנהל, בנוסף לקצבת הביטוח הלאומי. זהו שיקול כלכלי נוסף שאינו קשור לבחירה בין הקצבאות.</p>

                <h3 class="no-accordion" id="nvs-add-e">ה. אלמן (לא אלמנה) – הבדלים חשובים</h3>
                <ul>
                    <li>אלמן ללא ילדים כפוף למבחן הכנסה לקצבת שאירים.</li>
                    <li>אלמנה פטורה מרישום בלשכת התעסוקה לצורך קצבת שאירים; אלמן (בן-זוג של אישה שנפטרה) – עשוי להידרש להירשם.</li>
                    <li>הבחירה בין נכות לשאירים חלה באותו אופן גם על אלמן.</li>
                </ul>

                <h3 class="no-accordion" id="nvs-add-f">ו. יציבות הזכות בהיעדר ביטוח שאירים</h3>
                <p>אם הנפטר עלה לארץ מעל גיל 62 (גבר) ולא היה מבוטח בביטוח שאירים – אין זכאות לקצבת שאירים רגילה, אלא לגמלה מיוחדת בלבד (בסכומים זהים אך ללא תוספת ותק). במצב כזה, הבחירה בין נכות לשאירים עשויה להיות ברורה יותר.</p>

                <h3 class="no-accordion" id="nvs-add-g">ז. השפעת נישואין חוזרים</h3>
                <p>נישואין חוזרים של האלמן/ה מבטלים את קצבת השאירים. לפיכך, מי שמתכנן נישואין חוזרים – שיקול השאירים מאבד מחשיבותו. מנגד, קצבת הנכות אינה נפגעת מנישואין.</p>

                <h3 class="no-accordion" id="nvs-add-h">ח. הכנסות מנכסים ומשכר מול בחירת קצבה</h3>
                <p>קצבת נכות כפופה לתקרת הכנסה מעבודה אך לא להכנסות מנכסים. קצבת שאירים בסיסית לאלמנה אינה מבחן הכנסה, אך תוספת ההשלמה כן. לאדם שהכנסתו מעבודה גבוהה מ-${c('disability_work_start_ceiling')} ₪ – ממילא לא יקבל קצבת נכות, ואז שאירים הופך לרלוונטי יותר.</p>
                `;
            }
        },
        {
            icon: "🧭",
            id: "nvs-guide",
            title: "מדריך קצר לקבלת ההחלטה",
            contentFn: function(nii) {
                const c = key => (nii && nii[key]) ? nii[key].value.toLocaleString('he-IL') : '—';
                return `
                <div style="background:#F5F9FC;border-right:4px solid #4A90B5;border-radius:12px;padding:14px 16px;margin:0 0 14px 0;">
                    <p style="margin:0;"><strong>שאלות מנחות:</strong></p>
                </div>
                <ol>
                    <li>מה דרגת אי-הכושר שנקבעה לך? דרגה מלאה (75%–100%) מובילה לקצבה גבוהה בהרבה.</li>
                    <li>האם הנכות קבועה (לצמיתות) או זמנית? זמנית – זהירות בוויתור.</li>
                    <li>מה גיל המקבל? ככל שהמקבל צעיר יותר, ניצול שיקום מקצועי ויתרונות נכות ארוכים יותר.</li>
                    <li>האם יש ילדים? ילדים ממשיכים לקבל שאירים ממילא.</li>
                    <li>מה ההכנסה מעבודה? מעל ${c('disability_work_start_ceiling')} ₪ – נכות ממילא לא אפשרית.</li>
                    <li>האם יש זכאות לשר"מ? שר"מ ניתנת ללא תלות בבחירת נכות/שאירים.</li>
                    <li>האם תיתכן נישואין חוזרים? שאירים יבוטל בנישואין חוזרים.</li>
                    <li>מה חשיבות הוודאות לעומת הסכום? שאירים – יציב, נכות – גבוהה יותר אך תלוית ועדות.</li>
                </ol>
                `;
            }
        },
        {
            icon: "👣",
            id: "nvs-steps",
            title: "צעדים מעשיים",
            contentFn: function() {
                return `
                <ul>
                    <li>פנה ל-<span dir="ltr">*9696</span> – שירות הייעוץ לאזרח הוותיק מטעם הביטוח הלאומי (חינם).</li>
                    <li>השתמש במחשבון זכאות לשתי גמלאות באתר btl.gov.il</li>
                    <li>פנה לסניף הביטוח הלאומי הקרוב לקבלת תחשיב אישי.</li>
                    <li>ניתן לבדוק את הזכאות לשר"מ ולניידות בנפרד – ללא קשר לבחירת הקצבה.</li>
                    <li>הקפד לבדוק את תוספת הוותק לשאירים – עשויה להגדיל משמעותית את קצבת השאירים.</li>
                </ul>

                <div style="background:#FAFAFA;border:1px solid #E0E0E0;border-radius:12px;padding:14px 16px;margin:14px 0 0 0;">
                    <p style="margin:0 0 6px 0;"><strong>הבהרה משפטית</strong></p>
                    <p style="margin:0;">מסמך זה מיועד לצרכי ייעוץ ומידע בלבד ואינו מהווה ייעוץ משפטי מחייב. המידע מבוסס על אתר btl.gov.il ו-kolzchut.org.il, נכון לינואר 2026. לבדיקה אישית ומחייבת יש לפנות לביטוח הלאומי ישירות.</p>
                </div>
                `;
            }
        }
    ]
};
