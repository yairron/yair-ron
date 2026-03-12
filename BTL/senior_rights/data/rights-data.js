// נתוני זכויות אזרחים ותיקים - עודכן מקובץ PDF מקיף
// עדכון אחרון: ינואר 2026
const RIGHTS_DATA = {
  "lastUpdate": "2026-01-16T00:00:00.000Z",
  "version": "2026.1",
  "categories": {
    "social_security": {
      "title": "קצבאות זקנה וזכויות ביטוח לאומי",
      "contentFn": function(nii) {
        const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
        const v = key => nii[key] ? nii[key].value : 0;
        const fmt = num => Math.round(num).toLocaleString('he-IL');
        const p = key => nii[key] ? nii[key].value + '%' : '—';
        const age = key => nii[key] ? nii[key].value : '—';
        return `
       <a href="https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%AA%D7%95%D7%9F_%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94" target="_blank" class="link-item">🏛️  זכותון קצבת זיקנה - כל זכות. כל המידע על קצבת זיקנה במקום אחד</a>
        <h2 class="no-accordion">📋 קצבת אזרח ותיק (קצבת זקנה) - מדריך מלא 2026</h2>

        <h3>🎂 גילאי פרישה וזכאות</h3>

        <div class="conditions-box">
          <h4>⏰ גילאי הפרישה</h4>
          <ul>
            <li><strong>גברים:</strong> ${age('retirement_age_male')} שנים</li>
            <li><strong>נשים:</strong> משתנה לפי שנת לידה (ראה טבלה להלן)</li>
            <li><strong>גיל הזכאות המוחלט:</strong> ${age('retirement_age_unconditional')} שנים - ללא מבחן הכנסות</li>
          </ul>
        </div>

        <h3>👩 גיל הפרישה לנשים לפי שנת לידה</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">שנת לידה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">גיל פרישה</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">עד 1959</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">62</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1960</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">62 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1961</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">62 שנים ו-8 חודשים</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1962</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">63</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1963</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">63 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1964</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">63 שנים ו-8 חודשים</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1965</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">64</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1966</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">64 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">1967 ואילך</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">65</td></tr>
          </tbody>
        </table>

        <h3>💰 סכומי הקצבה הבסיסית לשנת 2026</h3>
        <ul>
          <li><strong>יחיד/ה:</strong> ${c('pension_single_basic')} לחודש</li>
          <li><strong>יחיד/ה בגיל 80 ומעלה:</strong> ${c('pension_single_over80')} לחודש</li>
          <li><strong>יחיד עם בן זוג שאינו מקבל קצבה:</strong> ${c('pension_couple_basic')} לחודש</li>
          <li><strong>זוג שניהם מקבלים:</strong> ${c('pension_single_basic')} לכל אחד (₪${fmt(v('pension_single_basic') * 2)} סה"כ)</li>
          <li><strong>תוספת לבן/בת זוג:</strong> ${c('pension_spouse_supplement')}</li>
          <li><strong>תוספת לכל ילד (עד 2 ילדים):</strong> ${c('pension_child_supplement')}</li>
        </ul>

        <h3>💵 מבחן הכנסות (בין גיל פרישה לגיל 70)</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">סטטוס</th>
              <th style="padding: 12px; border: 1px solid #ddd;">זכאות מלאה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">זכאות חלקית</th>
              <th style="padding: 12px; border: 1px solid #ddd;">אין זכאות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">יחיד</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">עד ${c('income_test_single_full')}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('income_test_single_full')}-${c('income_test_single_partial')}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">מעל ${c('income_test_single_partial')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">נשוי</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">עד ${c('income_test_married_full')}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('income_test_married_full')}-${c('income_test_married_partial')}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">מעל ${c('income_test_married_partial')}</td>
            </tr>
          </tbody>
        </table>
        <p><strong>הפחתה:</strong> ${p('income_test_deduction_rate')} מההכנסה העודפת מעל התקרה מופחתת מסכום הקצבה</p>

        <h4 >📐 נוסחת חישוב הקצבה החלקית</h4>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-right: 4px solid #4caf50; margin: 20px 0;">
          <h5 class="no-accordion">📊 הנוסחה לחישוב קצבה חלקית:</h5>
          <p style="font-size: 1.2em; font-weight: bold; text-align: center; background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            קצבה חלקית = קצבה מלאה - [${p('income_test_deduction_rate')} × (הכנסה ברוטו - תקרת קצבה מלאה)]
          </p>
        </div>

        <h5 class="no-accordion">📋 נתונים בסיסיים לחישוב (2026):</h5>
        <ul>
          <li><strong>קצבה בסיסית:</strong> ${c('pension_single_basic')} (מגיל פרישה עד גיל 80)</li>
          <li><strong>קצבה בסיסית:</strong> ${c('pension_single_over80')} (מגיל 80 ומעלה)</li>
          <li><strong>תוספת בן/בת זוג:</strong> ${c('pension_spouse_supplement')}</li>
          <li><strong>תוספת ותק:</strong> ${p('seniority_bonus_rate')} לכל שנת ביטוח (מקסימום ${p('seniority_bonus_max')})</li>
        </ul>

        <h4>💡 דוגמאות חישוב מפורטות</h4>

        <h5>דוגמה 1: יחיד שזכאי לקצבת זקנה חלקית</h5>
        <div style="background: #fff8e1; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h5 class="no-accordion">📋 נתוני המקרה:</h5>
          <ul>
            <li>דוד, בן ${age('retirement_age_male')}, יחיד</li>
            <li>הכנסה מעבודה: ₪11,500 ברוטו</li>
            <li>ותק ביטוח: 25 שנים (תוספת ותק מקסימלית ${p('seniority_bonus_max')})</li>
            <li><strong>מצב:</strong> הכנסה בטווח הזכאות לקצבה חלקית (${c('income_test_single_full')} - ${c('income_test_single_partial')})</li>
          </ul>

          <h5 class="no-accordion">💡 חישוב:</h5>
          <p><strong>שלב 1: חישוב קצבה בסיסית עם ותק</strong></p>
          <ul>
            <li>קצבה בסיסית: ${c('pension_single_basic')}</li>
            <li>תוספת ותק (${p('seniority_bonus_max')}): ${c('pension_single_basic')} × ${p('seniority_bonus_max')} = ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)}</li>
            <li><strong>קצבה מלאה עם ותק: ${c('pension_single_basic')} + ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)} = ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))}</strong></li>
          </ul>

          <p><strong>שלב 2: חישוב עודף הכנסה</strong></p>
          <ul>
            <li>עודף הכנסה: ₪11,500 - ${c('income_test_single_full')} = ₪${fmt(11500 - v('income_test_single_full'))}</li>
            <li>קיזוז (${p('income_test_deduction_rate')} מהעודף): ₪${fmt(11500 - v('income_test_single_full'))} × ${p('income_test_deduction_rate')} = ₪${fmt((11500 - v('income_test_single_full')) * v('income_test_deduction_rate') / 100)}</li>
          </ul>

          <p><strong>שלב 3: חישוב קצבה חלקית</strong></p>
          <ul>
            <li>קצבה חלקית: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))} - ₪${fmt((11500 - v('income_test_single_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) - (11500 - v('income_test_single_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li>ניכוי ביטוח בריאות: ${c('health_insurance_deduction_single')}</li>
            <li style="font-size: 1.2em; font-weight: bold; color: #2e7d32;">✅ סה״כ לקבלה בפועל: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) - (11500 - v('income_test_single_full')) * v('income_test_deduction_rate') / 100)} - ${c('health_insurance_deduction_single')} = ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) - (11500 - v('income_test_single_full')) * v('income_test_deduction_rate') / 100 - v('health_insurance_deduction_single'))}</li>
          </ul>
        </div>

        <h5>דוגמה 2: שני בני זוג שזכאים לקצבת זקנה חלקית</h5>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h5 class="no-accordion">📋 נתוני המקרה:</h5>
          <ul>
            <li>משה (68) ורחל (65), נשואים</li>
            <li>משה: הכנסה ₪8,000, ותק 20 שנים (תוספת 40%)</li>
            <li>רחל: הכנסה ₪7,500, ותק 18 שנים (תוספת 36%)</li>
            <li><strong>הכנסה משפחתית כוללת: ₪15,500</strong> (בטווח ${c('income_test_married_full')}-${c('income_test_married_partial')})</li>
          </ul>

          <h5 class="no-accordion">💡 חישוב עבור משה:</h5>
          <ul>
            <li>קצבה בסיסית: ${c('pension_single_basic')}</li>
            <li>תוספת ותק (40%): ${c('pension_single_basic')} × 40% = ₪${fmt(v('pension_single_basic') * 0.4)}</li>
            <li>קצבה מלאה: ${c('pension_single_basic')} + ₪${fmt(v('pension_single_basic') * 0.4)} = ₪${fmt(v('pension_single_basic') * 1.4)}</li>
            <li><em>⚠ משה מתחת לתקרת קצבה מלאה ליחיד (${c('income_test_single_full')}), אך נבדק לפי הכנסה משפחתית</em></li>
            <li>עודף משפחתי: ₪15,500 - ${c('income_test_married_full')} = ₪${fmt(15500 - v('income_test_married_full'))}</li>
            <li>קיזוז (${p('income_test_deduction_rate')}): ₪${fmt(15500 - v('income_test_married_full'))} × ${p('income_test_deduction_rate')} = ₪${fmt((15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li><strong>קצבה חלקית למשה: ₪${fmt(v('pension_single_basic') * 1.4)} - ₪${fmt((15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_single_basic') * 1.4 - (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</strong></li>
          </ul>

          <h5 class="no-accordion">💡 חישוב עבור רחל:</h5>
          <ul>
            <li>קצבה בסיסית: ${c('pension_single_basic')}</li>
            <li>תוספת ותק (36%): ${c('pension_single_basic')} × 36% = ₪${fmt(v('pension_single_basic') * 0.36)}</li>
            <li>קצבה מלאה: ${c('pension_single_basic')} + ₪${fmt(v('pension_single_basic') * 0.36)} = ₪${fmt(v('pension_single_basic') * 1.36)}</li>
            <li>קיזוז זהה: ₪${fmt((15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li><strong>קצבה חלקית לרחל: ₪${fmt(v('pension_single_basic') * 1.36)} - ₪${fmt((15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_single_basic') * 1.36 - (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</strong></li>
          </ul>

          <p style="font-size: 1.1em; font-weight: bold; color: #1565c0; margin-top: 15px;">
            ✅ סה״כ קצבאות למשפחה: ₪${fmt(v('pension_single_basic') * 1.4 - (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} + ₪${fmt(v('pension_single_basic') * 1.36 - (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_single_basic') * 2.76 - 2 * (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}<br>
            לאחר ניכוי ביטוח בריאות (${c('health_insurance_deduction_couple')}): ₪${fmt(v('pension_single_basic') * 2.76 - 2 * (15500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100 - v('health_insurance_deduction_couple'))}
          </p>
        </div>

        <h5>דוגמה 3: יחיד עם בן/בת זוג שזכאים לקצבה חלקית</h5>
        <div style="background: #f3e5f5; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h5 class="no-accordion">📋 נתוני המקרה:</h5>
          <ul>
            <li>יוסף, בן 68, נשוי</li>
            <li>הכנסה מעבודה: ₪15,000</li>
            <li>ותק: 22 שנים (תוספת 44%)</li>
            <li>אשתו לא הגיעה לגיל פרישה ואין לה הכנסה</li>
          </ul>

          <h5 class="no-accordion">💡 חישוב:</h5>
          <ul>
            <li>קצבה בסיסית ליחיד: ${c('pension_single_basic')}</li>
            <li>תוספת בן/בת זוג: ${c('pension_spouse_supplement')}</li>
            <li>קצבה בסיסית כוללת: ${c('pension_single_basic')} + ${c('pension_spouse_supplement')} = ${c('pension_couple_basic')}</li>
            <li>תוספת ותק (44%): ${c('pension_couple_basic')} × 44% = ₪${fmt(v('pension_couple_basic') * 0.44)}</li>
            <li>קצבה מלאה עם ותק: ${c('pension_couple_basic')} + ₪${fmt(v('pension_couple_basic') * 0.44)} = ₪${fmt(v('pension_couple_basic') * 1.44)}</li>
            <li>עודף הכנסה: ₪15,000 - ${c('income_test_married_full')} = ₪${fmt(15000 - v('income_test_married_full'))}</li>
            <li>קיזוז (${p('income_test_deduction_rate')}): ₪${fmt(15000 - v('income_test_married_full'))} × ${p('income_test_deduction_rate')} = ₪${fmt((15000 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li>קצבה חלקית: ₪${fmt(v('pension_couple_basic') * 1.44)} - ₪${fmt((15000 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_couple_basic') * 1.44 - (15000 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li style="font-size: 1.2em; font-weight: bold; color: #6a1b9a;">✅ סה״כ לקבלה בפועל: ₪${fmt(v('pension_couple_basic') * 1.44 - (15000 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} - ${c('health_insurance_deduction_single')} = ₪${fmt(v('pension_couple_basic') * 1.44 - (15000 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100 - v('health_insurance_deduction_single'))}</li>
          </ul>
        </div>

        <h5>דוגמה 4: יחיד עם בן/בת זוג שעובד</h5>
        <div style="background: #fce4ec; padding: 20px; border-radius: 10px; margin: 15px 0;">
          <h5 class="no-accordion">📋 נתוני המקרה:</h5>
          <ul>
            <li>אברהם, בן ${age('retirement_age_male')}, נשוי</li>
            <li>הכנסה מעבודה: ₪10,000</li>
            <li>ותק: 25 שנים (תוספת ${p('seniority_bonus_max')})</li>
            <li>אשתו בת 58, עובדת ומרוויחה ₪8,500 (לא הגיעה לגיל פרישה)</li>
            <li><strong>הכנסה כוללת של המשפחה: ₪18,500</strong></li>
          </ul>

          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-right: 4px solid #ff9800; margin: 15px 0;">
            <p><strong>⚠ שימו לב:</strong> במקרה זה, הכנסת בן/בת הזוג שטרם הגיע לגיל פרישה נכללת במבחן ההכנסות. מכיוון שההכנסה המשפחתית (₪18,500) נמוכה מהתקרה המבטלת זכאות (${c('income_test_married_partial')}), אברהם זכאי לקצבה חלקית.</p>
          </div>

          <h5 class="no-accordion">💡 חישוב:</h5>
          <ul>
            <li>קצבה בסיסית ליחיד: ${c('pension_single_basic')}</li>
            <li>תוספת בן/בת זוג: ${c('pension_spouse_supplement')}</li>
            <li>קצבה בסיסית כוללת: ${c('pension_couple_basic')}</li>
            <li>תוספת ותק (${p('seniority_bonus_max')}): ${c('pension_couple_basic')} × ${p('seniority_bonus_max')} = ₪${fmt(v('pension_couple_basic') * v('seniority_bonus_max') / 100)}</li>
            <li>קצבה מלאה: ${c('pension_couple_basic')} + ₪${fmt(v('pension_couple_basic') * v('seniority_bonus_max') / 100)} = ₪${fmt(v('pension_couple_basic') * (1 + v('seniority_bonus_max') / 100))}</li>
            <li>עודף הכנסה משפחתי: ₪18,500 - ${c('income_test_married_full')} = ₪${fmt(18500 - v('income_test_married_full'))}</li>
            <li>קיזוז (${p('income_test_deduction_rate')}): ₪${fmt(18500 - v('income_test_married_full'))} × ${p('income_test_deduction_rate')} = ₪${fmt((18500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li>קצבה חלקית: ₪${fmt(v('pension_couple_basic') * (1 + v('seniority_bonus_max') / 100))} - ₪${fmt((18500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('pension_couple_basic') * (1 + v('seniority_bonus_max') / 100) - (18500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)}</li>
            <li style="font-size: 1.2em; font-weight: bold; color: #c62828;">✅ סה״כ לקבלה בפועל: ₪${fmt(v('pension_couple_basic') * (1 + v('seniority_bonus_max') / 100) - (18500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100)} - ${c('health_insurance_deduction_single')} = ₪${fmt(v('pension_couple_basic') * (1 + v('seniority_bonus_max') / 100) - (18500 - v('income_test_married_full')) * v('income_test_deduction_rate') / 100 - v('health_insurance_deduction_single'))}</li>
          </ul>
        </div>

        <h3>⏱️ תוספת ותק</h3>
        <div class="conditions-box">
          <h4 class="no-accordion">💎 פרטי תוספת הוותק</h4>
          <ul>
            <li><strong>שיעור:</strong> ${p('seniority_bonus_rate')} לכל שנת ביטוח מלאה (12 חודשים)</li>
            <li><strong>תוספת מקסימלית:</strong> ${p('seniority_bonus_max')} (עבור 25 שנות ביטוח ומעלה)</li>
            <li><strong>חישוב:</strong> על הקצבה הבסיסית + תוספות בני משפחה</li>
            <li><strong>דוגמה:</strong> 25 שנות ביטוח = ${p('seniority_bonus_max')} תוספת = ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)} (על ${c('pension_single_basic')})</li>
            <li><strong>סה"כ עם וותק מקסימלי:</strong> ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))} ליחיד</li>
          </ul>
        </div>

        <h3>⏳ תוספת דחיית קצבה</h3>
        <p>מי שדוחה את קבלת הקצבה בשל הכנסות מעבודה זכאי לתוספת נוספת:</p>
        <ul>
          <li><strong>שיעור:</strong> ${p('deferral_bonus_rate')} לכל שנת דחייה</li>
          <li><strong>תנאי:</strong> דחייה בגלל הכנסות מעבודה בלבד</li>
          <li><strong>תנאי:</strong> גובה ההכנסות מעבודה עוברות את התקרה לקבלת קצבה מלאה</li>
          <li><strong>תקופת הדחייה:</strong> מגיל פרישה (${age('retirement_age_male')}/62-65) עד גיל ${age('retirement_age_unconditional')}</li>
          <li><strong>תוספת מקסימלית לגבר:</strong> ${p('deferral_bonus_max_male')} (3 שנות דחייה)</li>
          <li><strong>תוספת מקסימלית לאישה:</strong> עד ${p('deferral_bonus_max_female')} (8 שנות דחייה)</li>
          <li><strong>חישוב:</strong> על הקצבה הבסיסית + תוספת ותק</li>
        </ul>

        <h3>📊 דוגמה מקיפה לחישוב קצבה</h3>
        <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; border-right: 4px solid #667eea;">
          <p><strong>גבר בן 70, היה מבוטח 35 שנים, דחה קצבה 3 שנים בשל עבודה:</strong></p>
          <ul>
            <li>קצבה בסיסית (בגיל ${age('retirement_age_unconditional')}): ${c('pension_single_basic')}</li>
            <li>תוספת ותק מקסימלית (${p('seniority_bonus_max')}): ₪${fmt(v('pension_single_basic') * v('seniority_bonus_max') / 100)}</li>
            <li>ביניים: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))}</li>
            <li>תוספת דחייה (${p('deferral_bonus_max_male')}): ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * v('deferral_bonus_max_male') / 100)}</li>
            <li><strong>סה"כ קצבה: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * (1 + v('deferral_bonus_max_male') / 100))} לחודש</strong></li>
          </ul>
          <p style="margin-top: 15px;"><em>בגיל 80: הקצבה הבסיסית תעלה ל-${c('pension_single_over80')} והקצבה הכוללת תהיה גבוהה יותר</em></p>
        </div>

        <h3>💸 תוספת השלמת הכנסה</h3>
        <p>השלמת הכנסה ניתנת למי שהכנסותיו נמוכות ומיועדת להבטיח רמת חיים מינימלית.</p>
        <a href="https://www.kolzchut.org.il/he/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA_%D7%94%D7%A9%D7%9C%D7%9E%D7%AA_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94#.D7.9E.D7.99_.D7.96.D7.9B.D7.90.D7.99.3F" target="_blank" class="link-item">🏛️  השלמת הכנסה - כל זכות. כל המידע על השלמת הכנסה</a>

        <h4>סכומי השלמת הכנסה מקסימליים 2026</h4>

        <h5>עד גיל 70:</h5>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">הרכב המשפחה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום הקצבה</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_under70')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_under70')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_1child_under70')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_2children_under70')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_1child_under70')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_2children_under70')}</td></tr>
          </tbody>
        </table>

        <h5>מגיל 70 עד גיל 80:</h5>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">הרכב המשפחה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום הקצבה</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_70_80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_70_80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_1child_70_80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_2children_70_80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_1child_70_80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_2children_70_80')}</td></tr>
          </tbody>
        </table>

        <h5>מגיל 80 ומעלה:</h5>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">הרכב המשפחה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום הקצבה</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_over80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_over80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_1child_over80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">יחיד/ה + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_single_2children_over80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + ילד</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_1child_over80')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">זוג + 2 ילדים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${c('income_supplement_couple_2children_over80')}</td></tr>
          </tbody>
        </table>

        <h4>נוסחת החישוב</h4>
        <ol>
          <li>קובעים את הסכום המקסימלי להשלמה (${c('income_supplement_single_under70')} יחיד / ${c('income_supplement_couple_under70')} זוג)</li>
          <li>בודקים הכנסות קיימות:
            <ul>
              <li>קצבת זקנה - מותרת עד התקרה המלאה</li>
              <li>הכנסה מעבודה - מותרת: יחיד ${c('work_income_exempt_single')}, זוג ${c('work_income_exempt_couple')}</li>
              <li>קצבת פנסיה - מותרת: יחיד ${c('pension_income_exempt_single')}, זוג ${c('pension_income_exempt_couple')}</li>
            </ul>
          </li>
          <li>הכנסה עודפת מעל המותר: ${p('income_test_deduction_rate')} ממנה מקוזזת מההשלמה</li>
        </ol>

        <h5>💰 חישוב הכנסה רעיונית מנכסים פיננסיים</h5>
        <p>למי שיש פיקדונות, חסכונות או השקעות, עשוי להיות חישוב של "הכנסה רעיונית" מנכסים אלה. הכנסה זו מופחתת מסכום ההשלמה.</p>
        <p><a href="imputed_income_guide.html" target="_blank" style="color: #9c27b0; text-decoration: none; font-weight: 600;">📖 מדריך מפורט: חישוב הכנסה רעיונית מנכסים פיננסיים</a></p>

        <h4>דוגמאות לחישוב השלמת הכנסה</h4>

        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>דוגמה 1 - יחיד:</h5>
          <ul>
            <li>קצבת זקנה: ${c('pension_single_basic')}</li>
            <li>פנסיה: ₪2,500</li>
            <li>חישוב: פנסיה עודפת = 2,500 - ${v('pension_income_exempt_single')} = ₪${fmt(2500 - v('pension_income_exempt_single'))}</li>
            <li>קיזוז: ${p('income_test_deduction_rate')} × ${fmt(2500 - v('pension_income_exempt_single'))} = ₪${fmt((2500 - v('pension_income_exempt_single')) * v('income_test_deduction_rate') / 100)}</li>
            <li>השלמה: ${v('income_supplement_single_under70')} - ${v('pension_single_basic')} - ${fmt((2500 - v('pension_income_exempt_single')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('income_supplement_single_under70') - v('pension_single_basic') - (2500 - v('pension_income_exempt_single')) * v('income_test_deduction_rate') / 100)}</li>
            <li><strong>סה"כ הכנסה: ₪${fmt(v('pension_single_basic') + 2500 + v('income_supplement_single_under70') - v('pension_single_basic') - (2500 - v('pension_income_exempt_single')) * v('income_test_deduction_rate') / 100)}</strong></li>
          </ul>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>דוגמה 2 - זוג:</h5>
          <ul>
            <li>קצבת זקנה לכל אחד: ${c('pension_single_basic')} (סה"כ ₪${fmt(v('pension_single_basic') * 2)})</li>
            <li>הכנסה מעבודה: ₪4,200</li>
            <li>חישוב: הכנסה עודפת = 4,200 - ${v('work_income_exempt_couple')} = ₪${fmt(4200 - v('work_income_exempt_couple'))}</li>
            <li>קיזוז: ${p('income_test_deduction_rate')} × ${fmt(4200 - v('work_income_exempt_couple'))} = ₪${fmt((4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</li>
            <li>השלמה: ${v('income_supplement_couple_under70')} - ${fmt(v('pension_single_basic') * 2)} - ${fmt((4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('income_supplement_couple_under70') - v('pension_single_basic') * 2 - (4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</li>
            <li><strong>סה"כ הכנסה: ₪${fmt(v('pension_single_basic') * 2 + 4200 + v('income_supplement_couple_under70') - v('pension_single_basic') * 2 - (4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</strong></li>
          </ul>
        </div>

        <h4>🎁 הטבות נלוות להשלמת הכנסה</h4>
        <p>מקבלי השלמת הכנסה זכאים להטבות נוספות:</p>
        <ul>
          <li>✅ הנחה בחשמל</li>
          <li>✅ הנחה בארנונה (עד 100%)</li>
          <li>✅ הנחה בתשלומי בזק</li>
          <li>✅ הטבה בחשבון המים</li>
          <li>✅ סיוע בשכר דירה</li>
          <li>✅ דיור בבתי גיל הזהב (לחסרי דירה)</li>
          <li>✅ השתתפות בהחזרי משכנתא</li>
          <li>✅ פטור מתשלום לקופת חולים</li>
          <li>✅ הנחה בתרופות בקופות החולים</li>
          <li>✅ מענק חימום</li>
          <li>✅ פטור מהשתתפות עצמית בקבלת מימון למכשירי השיקום והניידות (רפורמה בציוד השיקומי)</li>         
        </ul>
      `;
      },
      "updatedAt": "2026-01-16T00:00:00.000Z"
    },

    "disability": {
      "title": "גמלת נכות כללית וקצבת שירותים מיוחדים",
      "contentFn": function(nii) {
        const c = key => nii[key] ? '₪' + nii[key].value.toLocaleString('he-IL') : '—';
        return `
        <h2 class="no-accordion">♿ גמלת נכות כללית וקצבת שירותים מיוחדים</h2>

        <h3>🏥 גמלת נכות כללית</h3>
        <p>גמלת נכות כללית ניתנת למי שכושר השתכרותו נפגע עקב נכות רפואית.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">דרגת אי-כושר</th>
              <th style="padding: 12px; border: 1px solid #ddd;">קצבה בסיסית</th>
              <th style="padding: 12px; border: 1px solid #ddd;">תוספת בן/זוג</th>
              <th style="padding: 12px; border: 1px solid #ddd;">תוספת ילד</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">מלאה (100% / 75%)</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('disability_full')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_spouse')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_child')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">חלקית 74%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('disability_74')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_spouse_74')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_child_74')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">חלקית 65%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('disability_65')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_spouse_65')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_child_65')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">חלקית 60%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('disability_60')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_spouse_60')}</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${c('disability_child_60')}</td></tr>
          </tbody>
        </table>
        <p><small>תוספת בן/בת זוג: בתנאי שהכנסותיו עד ₪7,848 ברוטו בחודש ואינו מקבל קצבה אחרת</small></p>

        <h3>🔄 מעבר מנכות כללית לקצבת זקנה</h3>
        <div class="conditions-box">
          <h4 class="no-accordion">⚠️ חשוב לדעת</h4>
          <ul>
            <li>המעבר מתבצע באופן אוטומטי ללא צורך בהגשת תביעה</li>
            <li>קצבת הזקנה לנכה לא תפחת מגמלת הנכות שקיבל לפני כן</li>
            <li>אם גמלת הנכות הייתה גבוהה יותר - היא תישמר</li>
            <li>יש לבדוק זכאות לתוספת ותק שעשויה להגדיל את הקצבה</li>
            <li>תוספות בני משפחה ממשיכות על פי הזכאות</li>
          </ul>
        </div>

        <h3>🛟 קצבת שירותים מיוחדים (שר"מ)</h3>
        <p>קצבת שירותים מיוחדים ניתנת למי שזקוק לעזרת הזולת באופן משמעותי עקב נכות.</p>

        <h4 class="no-accordion">דרגות שר"מ (נכון ל-2026):</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">דרגה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום חודשי</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">50%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_50')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">65%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_65')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">75%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_75')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">100%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_100')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">112%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_112')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">188%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_188')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">235%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_235')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">תוספת מונשם</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_ventilated')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">188% + תוספת 2 מטפלים</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_188_2caregivers')}</td></tr>
          </tbody>
        </table>

        <h3>👶 גמלת ילד נכה</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">סוג הגמלה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום חודשי 2026</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">ילד עם נכות 100%</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('disabled_child_100')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;">תוספת לילד נכה מונשם</td><td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${c('special_services_ventilated')}</td></tr>
          </tbody>
        </table>

        <h3>🔄 מעבר משר"מ לגמלת סיעוד</h3>
        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828;">
          <h4 class="no-accordion">⚠️ חשוב מאוד!</h4>
          <p>מקבלי קצבת שירותים מיוחדים שמגיעים לגיל הזכאות לגמלת סיעוד עוברים לגמלת סיעוד:</p>
          <ul>
            <li><strong>גיל הזכאות לגמלת סיעוד:</strong> נשים 62-65 (לפי שנת לידה), גברים 67</li>
            <li><strong>המעבר דורש הגשת תביעה לגמלת סיעוד - לא אוטומטי!</strong></li>
            <li>יש להגיש תביעה 3 חודשים לפני הגיע לגיל הזכאות</li>
            <li>תיערך הערכה סיעודית חדשה (מבחן ADL)</li>
            <li>הרמה בגמלת סיעוד תלויה במספר נקודות התלות</li>
            <li>לרוב מקבלי שר"מ בדרגה גבוהה מקבלים רמות סיעוד גבוהות</li>
          </ul>
        </div>
      `;
      },
      "updatedAt": "2026-01-16T00:00:00.000Z"
    },

    "nursing": {
      "title": "זכויות סיעוד",
      "content": `
        <a href="https://www.kolzchut.org.il/he/%D7%92%D7%9E%D7%9C%D7%AA_%D7%A1%D7%99%D7%A2%D7%95%D7%93" target="_blank" class="link-item">🏛️  פורטל גמלת סיעוד - כל זכות. כל המידע ודרכי המימוש לגמלת סיעוד, הניתנת למי שהגיעו לגיל פרישה, מתגוררים בקהילה.</a>
      <h2 class="no-accordion">❤️ גמלת סיעוד - מדריך מקיף</h2>

        <h3>📊 רמות גמלת הסיעוד 2026 - טבלה מפורטת</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">רמה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">נקודות תלות</th>
              <th style="padding: 12px; border: 1px solid #ddd;">שעות שבועיות</th>
              <th style="padding: 12px; border: 1px solid #ddd;">שווי בכסף</th>
              <th style="padding: 12px; border: 1px solid #ddd;">הערות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">2.5-3</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">5.5 שעות</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪1,659</td>
              <td style="padding: 10px; border: 1px solid #ddd;">ניתן לקבל בכסף מלא</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">2</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">3.5-4.5</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">10 שעות</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪2,410</td>
              <td style="padding: 10px; border: 1px solid #ddd;">המרה חלקית עד ₪965 (4 יח"ש)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">3</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">5-6</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">15 שעות</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪4,097</td>
              <td style="padding: 10px; border: 1px solid #ddd;">המרה חלקית עד ₪1,350 (6 יח"ש)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">4</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">6.5-7.5</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">21 (18 עם זר)</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪5,061</td>
              <td style="padding: 10px; border: 1px solid #ddd;">המרה חלקית עד ₪1,434 (7 יח"ש)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">5</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">8-9</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">26 (22 עם זר)</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪6,266</td>
              <td style="padding: 10px; border: 1px solid #ddd;">המרה חלקית עד ₪1,884 (9 יח"ש)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">6</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">9.5+</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">30 (26 עם זר)</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">₪7,230</td>
              <td style="padding: 10px; border: 1px solid #ddd;">המרה חלקית עד ₪2,249 (10 יח"ש)</td>
            </tr>
          </tbody>
        </table>

        <h3>💵 מבחן הכנסות לגמלת סיעוד (נכון לינואר 2026 - יתעדכן באפריל 2026)</h3>
        <ul>
          <li><strong>גמלה מלאה:</strong> הכנסה עד ₪12,796 לחודש</li>
          <li><strong>גמלה בהיקף חצי:</strong> הכנסה ₪12,796-₪19,194 לחודש</li>
          <li><strong>אין זכאות:</strong> הכנסה מעל ₪19,194 לחודש</li>
        </ul>

        <h3>🎯 אפשרויות מימוש הגמלה</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">אפשרות</th>
              <th style="padding: 12px; border: 1px solid #ddd;">תיאור</th>
              <th style="padding: 12px; border: 1px solid #ddd;">רמות זכאות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">מטפל/ת בבית</td>
              <td style="padding: 10px; border: 1px solid #ddd;">שעות טיפול מטעם ספקי סיעוד מורשים</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">כל הרמות</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">גמלה בכסף</td>
              <td style="padding: 10px; border: 1px solid #ddd;">תשלום ישיר לחשבון הבנק</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">רמה 1 מלא, 2-3 חלקי</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">גמלה משולבת</td>
              <td style="padding: 10px; border: 1px solid #ddd;">חלק שעות + חלק כסף</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">רמות 2-3</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">עובד זר</td>
              <td style="padding: 10px; border: 1px solid #ddd;">היתר להעסקת עובד זר + השתתפות כספית</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">רמות 5-6</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">מרכז יום</td>
              <td style="padding: 10px; border: 1px solid #ddd;">ימי פעילות במרכז יום לקשישים</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">כל הרמות</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">דיור מוגן</td>
              <td style="padding: 10px; border: 1px solid #ddd;">השתתפות בעלות דיור מוגן</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">כל הרמות</td>
            </tr>
          </tbody>
        </table>
      `,
      "updatedAt": "2026-01-16T00:00:00.000Z"
    },

    "holocaust_survivors": {
      "title": "זכויות ניצולי שואה",
      "content": `
      <a href="https://www.btl.gov.il/benefits/Long_Term_Care/Pages/nitzoleShoaa.aspx" target="_blank" class="link-item">🏛️  ניצולי שואה – זכאות לתוספת שעות סיעוד - הביטוח הלאומי </a>
      <a href="https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA_%D7%A0%D7%99%D7%A6%D7%95%D7%9C%D7%99_%D7%A9%D7%95%D7%90%D7%94#.D7.A7.D7.A6.D7.91.D7.90.D7.95.D7.AA_.D7.95.D7.A4.D7.95.D7.A8.D7.98.D7.9C.D7.99_.D7.9E.D7.99.D7.93.D7.A2_.D7.9E.D7.A8.D7.9B.D7.96.D7.99.D7.99.D7.9D" target="_blank" class="link-item">🔦 פורטל המידע הלאומי לזכויות ניצולי השואה בישראל - כל זכות</a>  
      <h2 class="no-accordion">🕯️ זכויות ניצולי שואה - מדריך מקיף 2026</h2>

        <h3>💰 קצבאות ומענקים</h3>
        <ul>
          <li><strong>מענק שנתי:</strong> ₪7,502 (למי שלא מקבלים רנטה חודשית)</li>
          <li><strong>רנטה גרמנית (BEG):</strong> תשלום חודשי משתנה + תוספת 100-400 יורו</li>
          <li><strong>קרן סעיף 2:</strong> כ-€2,000 לרבעון</li>
          <li><strong>יוצאי רומניה/בולגריה:</strong> מינימום ₪2,860 לחודש</li>
          <li><strong>תשלום שנתי ועידת התביעות 2026:</strong> ₪5,457 (1,350€) - לזכאי קרן הסיוע</li>
        </ul>

        <h3>🏥 תוספת שעות סיעוד לניצולי שואה</h3>
        <p>ניצולי שואה הזכאים לגמלת סיעוד יכולים לקבל תוספת שעות סיעוד מהקרן לרווחת נפגעי השואה.</p>

        <h4>תנאי הזכאות לתוספת 9 שעות סיעוד שבועיות</h4>
        <div class="conditions-box">
          <h4>✅ תנאים</h4>
          <ul>
            <li>הכרה כניצול שואה על ידי: הרשות לזכויות ניצולי השואה, ועידת התביעות, או BEG</li>
            <li>זכאות לגמלת סיעוד מלאה (לא מופחתת) מהביטוח הלאומי</li>
            <li>רמה 3 עם 6 נקודות תלות ומעלה, או רמה 4, 5, 6 - בגמלה מלאה</li>
            <li><strong>או:</strong> קצבת שירותים מיוחדים (שר"מ) בהיקף 112% ומעלה</li>
            <li><strong>או:</strong> עזרה לזולת ממשרד הביטחון - 66 שעות חודשיות ומעלה</li>
            <li><strong>גיל:</strong> 80 שנים ומעלה</li>
            <li><strong>נקודות תלות:</strong> מינימום 2 נקודות במבחן ADL</li>
          </ul>
        </div>

        <h4>אופן קבלת התוספת</h4>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h5>🔄 מימוש אוטומטי:</h5>
          <ul>
            <li><strong>הזכאות ניתנת אוטומטית - אין צורך להגיש בקשה!</strong></li>
            <li>הביטוח הלאומי מעביר את פרטי הזכאים לקרן לרווחה אחת לחודש</li>
            <li>הקרן פונה אל הזכאי לתיאום השירות</li>
          </ul>

          <h5>💎 אפשרויות מימוש:</h5>
          <ul>
            <li><strong>שעות טיפול בבית:</strong> 9 שעות שבועיות בפועל מספק מורשה</li>
            <li><strong>תשלום בכסף:</strong> ₪2,025 לחודש (רק למי שמקבל גמלה בכסף מהביטוח הלאומי)</li>
          </ul>
        </div>

        <h4>תוספת חלקית לניצולים עם פחות נקודות (2025 - לאימות בשנת 2026)</h4>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">נקודות תלות</th>
              <th style="padding: 12px; border: 1px solid #ddd;">זכאות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">5-5.5 נקודות</td>
              <td style="padding: 10px; border: 1px solid #ddd;">סיוע כספי ₪1,200</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">6 נקודות + גמלה מופחתת</td>
              <td style="padding: 10px; border: 1px solid #ddd;">4.5 שעות (כ-₪970 בכסף)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">1.5-2 נקודות (לא זכאים לסיעוד)</td>
              <td style="padding: 10px; border: 1px solid #ddd;">2 שעות (כ-₪430 בכסף)</td>
            </tr>
          </tbody>
        </table>

        <h3>🏥 סיוע סיעודי קצר מועד (סול"ם)</h3>
        <p><strong>לניצולי שואה שאינם זכאים לגמלת סיעוד</strong></p>
        <p>במסגרת התכנית, ניצולי שואה המתגוררים בקהילה, ללא חוק סיעוד ונמצאים במצב חולי או משבר חדש, או ניצולי שואה המתגוררים בקהילה ועומדים לקראת שחרור מאשפוז בבית חולים, העומדים בקריטריונים המפורטים מטה, עשויים להיות זכאים לקבל עד 50 שעות סיעוד בביתם למשך חודשיים.</p>
        <h4>לאחר אשפוז:</h4>
        <ul>
          <li>עד 50 שעות סיעוד למשך חודשיים</li>
          <li>הגשת בקשה דרך עו"ס בבית החולים בלבד</li>
          <li><strong>תנאי:</strong> הכנסה עד ₪10,733 (לא כולל רנטות)</li>
        </ul>

        <h4>סול"ם בקהילה:</h4>
        <ul>
          <li>למצבי חולי או משבר ללא אשפוז</li>
          <li>עד 50 שעות למשך חודשיים</li>
          <li>הגשת בקשה דרך עו"ס בקופת חולים</li>
          <li>פעם אחת בשנה לכל ניצול</li>
        </ul>

        <h3>📞 פרטי קשר</h3>
        <ul>
          <li><strong>הקרן לרווחת נפגעי השואה:</strong> 03-6090866</li>
          <li><strong>ועידת התביעות (לגמלה בכסף):</strong> 03-5194401</li>
          <li><strong>הרשות לזכויות ניצולי השואה:</strong> *5105 או 03-5682651</li>
        </ul>

        <h3>🎁 זכויות נוספות</h3>
        <ul>
          <li>✅ תרופות ללא תשלום</li>
          <li>✅ טיפול פסיכולוגי ללא תשלום</li>
          <li>✅ הנחות עירוניות</li>
          <li>✅ סיוע בטיפולי שיניים</li>
          <li>✅ מענקים לציוד רפואי</li>
        </ul>
      `,
      "updatedAt": "2026-01-16T00:00:00.000Z"
    },

    "summary": {
      "title": "תקציר - השפעות הדדיות בין ההטבות",
      "content": `
        <h2 class="no-accordion">📊 תקציר - השפעות הדדיות בין ההטבות</h2>

        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; border-right: 4px solid #ff9800; margin: 20px 0;">
          <h3>⚠️ חשוב להבין כיצד הקצבאות והגמלאות השונות משפיעות זו על זו:</h3>
          <ul>
            <li>✅ <strong>קצבת אזרח ותיק</strong> נספרת כהכנסה במבחן להשלמת הכנסה</li>
            <li>✅ <strong>גמלת סיעוד</strong> אינה נספרת כהכנסה</li>
            <li>✅ <strong>קצבת נכות</strong> עוברת לקצבת זקנה בגיל פרישה</li>
            <li>✅ <strong>מקבלי השלמת הכנסה</strong> זכאים להטבות נוספות רבות</li>
          </ul>
        </div>

        <h3>📋 טבלת סיכום - כל ההטבות במקום אחד</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">סוג הטבה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">תנאי זכאות</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכומים 2026</th>
              <th style="padding: 12px; border: 1px solid #ddd;">נספר כהכנסה?</th>
              <th style="padding: 12px; border: 1px solid #ddd;">השפעה</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">קצבת אזרח ותיק</td>
              <td style="padding: 10px; border: 1px solid #ddd;">גיל פרישה + מבחן הכנסה או גיל 70</td>
              <td style="padding: 10px; border: 1px solid #ddd;">יחיד: ₪1,838<br>+80: ₪1,941<br>עם בן זוג: ₪2,762<br>ותק: עד 50%<br>דחייה: עד 15-40%</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">כן</td>
              <td style="padding: 10px; border: 1px solid #ddd;">בסיס לזכאות להטבות</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">השלמת הכנסה</td>
              <td style="padding: 10px; border: 1px solid #ddd;">הכנסות נמוכות + קצבת זקנה</td>
              <td style="padding: 10px; border: 1px solid #ddd;">יחיד: עד ₪4,375<br>זוג: עד ₪6,912</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">לא</td>
              <td style="padding: 10px; border: 1px solid #ddd;">מזכה בהטבות נוספות</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">גמלת סיעוד</td>
              <td style="padding: 10px; border: 1px solid #ddd;">גיל פרישה + תלות בזולת</td>
              <td style="padding: 10px; border: 1px solid #ddd;">רמה 1: ₪1,659<br>רמה 6: ₪7,230<br>או שעות טיפול</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">לא</td>
              <td style="padding: 10px; border: 1px solid #ddd;">ללא השפעה על הטבות אחרות</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">ניצולי שואה - תוספת סיעוד</td>
              <td style="padding: 10px; border: 1px solid #ddd;">ניצול שואה + גמלת סיעוד רמה 3-6</td>
              <td style="padding: 10px; border: 1px solid #ddd;">9 שעות שבועיות או ₪2,025</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">לא</td>
              <td style="padding: 10px; border: 1px solid #ddd;">בנוסף לגמלת סיעוד רגילה</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">נכות כללית</td>
              <td style="padding: 10px; border: 1px solid #ddd;">נכות רפואית לפני גיל פרישה</td>
              <td style="padding: 10px; border: 1px solid #ddd;">100%: ₪4,771<br>+ תוספת בן זוג</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">כן</td>
              <td style="padding: 10px; border: 1px solid #ddd;">עוברת לקצבת זקנה בגיל פרישה</td>
            </tr>
          </tbody>
        </table>

        <h3>📞 מידע ליצירת קשר</h3>
        <ul>
          <li><strong>המוסד לביטוח לאומי:</strong> *6050</li>
          <li><strong>אתר ביטוח לאומי:</strong> www.btl.gov.il</li>
          <li><strong>הרשות לזכויות ניצולי השואה:</strong> *5105</li>
          <li><strong>קרן לרווחת נפגעי השואה:</strong> 03-6090866</li>
        </ul>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h3>💡 הערות חשובות</h3>
          <ul>
            <li>כל הסכומים נכונים לינואר 2026 ועשויים להתעדכן במהלך השנה</li>
            <li>מומלץ לבדוק זכאות אישית באתר ביטוח לאומי או בפנייה טלפונית</li>
            <li>יש להגיש תביעות בזמן - זכויות רטרואקטיביות מוגבלות</li>
            <li>שמירה על מסמכים רפואיים ותעסוקתיים חשובה לתביעות</li>
          </ul>
        </div>
      `,
      "updatedAt": "2026-01-16T00:00:00.000Z"
    },

    "special_grants": {
      "title": "מענקים ותשלומים מיוחדים",
      "content": `
        <h2 class="no-accordion">💰 מענקים ותשלומים מיוחדים</h2>

        <h3>💔 קצבת שאירים - מדריך מקיף</h3>

        <h4>📋 מהי קצבת שאירים?</h4>
        <p>קצבת שאירים היא קצבה חודשית המשולמת על ידי המוסד לביטוח לאומי לשאירים של תושב ישראל שנפטר. מטרת הקצבה היא להבטיח אמצעי קיום מינימליים לאלמנות, אלמנים ויתומים של המבוטח שנפטר.</p>

        <h4>👥 מי זכאי לקצבת שאירים?</h4>

        <div class="conditions-box">
          <h5 class="no-accordion">שאירים זכאים:</h5>
          <ul>
            <li><strong>אלמנה/אלמן</strong> - בת/בן זוג של הנפטר (כולל ידועים בציבור)</li>
            <li><strong>יתומים</strong> - ילדי הנפטר (כולל ילדים חורגים, מאומצים או נכדים שהנפטר פרנס)</li>
          </ul>
        </div>

        <h4>👶 הגדרת יתום לפי גיל ומעמד</h4>
        <p>קצבת שאירים משולמת ליתום עד:</p>
        <ul>
          <li><strong>גיל 18</strong> - לכל הילדים</li>
          <li><strong>גיל 20</strong> - אם הילד מסיים לימודים במוסד חינוך על-יסודי או בעל לקות למידה במסגרת מוכרת</li>
          <li><strong>גיל 21</strong> - אם משרת בהתנדבות למטרה ציבורית (עד 12 חודשים)</li>
          <li><strong>גיל 24</strong> - אם משרת בצה"ל, שירות לאומי או לומד בעתודה</li>
        </ul>

        <h4>✅ תנאי זכאות עיקריים</h4>
        <p><strong>על מנת שהשאירים יהיו זכאים לקצבה, כל התנאים הבאים חייבים להתקיים:</strong></p>

        <div class="conditions-box">
          <h5>1️⃣ הנפטר היה תושב ישראל בעת פטירתו</h5>
          <p><strong>לגבי נפטר שנולד בחו"ל:</strong></p>
          <ul>
            <li>אם עלה לארץ לפני גיל 60-62 (בהתאם לתאריך הלידה) - מבוטח בביטוח שאירים</li>
            <li>אם עלה לאחר גילאים אלו - אינו מבוטח, אך אלמנתו עשויה להיות זכאית לגמלת שאירים מיוחדת</li>
          </ul>
          <p><strong>לגבי נפטרת (אישה):</strong></p>
          <ul>
            <li>תושבת ישראל שעלתה לארץ לפני גיל 60-62</li>
            <li>הייתה מבוטחת: עובדת, או בעלה מבוטח, או מקבלת קצבת נכות כללית, או עגונה</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5>2️⃣ הנפטר השלים תקופת אכשרה (ביטוח)</h5>
          <p>תקופת האכשרה יכולה להיות <strong>אחד</strong> מהבאים:</p>
          <ul>
            <li><strong>12 חודשים</strong> אחרונים לפני הפטירה</li>
            <li><strong>24 חודשים</strong> (רצופים או לא) ב-5 השנים האחרונות לפני הפטירה</li>
            <li><strong>60 חודשים</strong> (רצופים או לא) ב-10 השנים האחרונות לפני הפטירה</li>
            <li><strong>144 חודשים</strong> (12 שנים) רצופים או לא רצופים בכל תקופה</li>
            <li><strong>60 חודשים</strong> מיום שנעשה תושב ישראל (בתנאי שמספר חודשי אי-ביטוח לא עולה על מספר חודשי הביטוח)</li>
          </ul>
          <p><strong>חריגים שאינם מחייבים תקופת אכשרה:</strong></p>
          <ul>
            <li>נפטר תוך שנה מיום שנעשה תושב ישראל</li>
            <li>היה מקבל קצבת זקנה או נכות כללית בעת הפטירה</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5>3️⃣ אין פיגור בתשלום דמי ביטוח</h5>
          <ul>
            <li>אם הנפטר פיגר בתשלום דמי הביטוח - השאירים עלולים להפסיד את הקצבה או לקבל קצבה מופחתת</li>
            <li>במקרה כזה תיבדק זכאות להענקה מטעמי צדק (ללא צורך בהגשת תביעה)</li>
            <li><strong>חשוב:</strong> אם <strong>מעסיק</strong> הנפטר פיגר בתשלום - קצבת השאירים <strong>לא</strong> נפגעת</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5>4️⃣ תנאים מיוחדים לאלמן (ללא ילדים)</h5>
          <p>אלמן ללא ילדים זכאי לקצבה <strong>רק אם</strong>:</p>
          <ul>
            <li>הכנסותיו החודשיות הברוטו אינן עולות על <strong>₪7,848</strong> (נכון ל-1.1.2026)</li>
          </ul>
        </div>

        <h5>💰 מבחן הכנסות לאלמן - מה נספר ומה לא?</h5>

        <div style="background: #fff8e1; padding: 20px; border-radius: 10px; border-right: 4px solid #ff9800; margin: 20px 0;">
          <h6>הכנסות שנלקחות בחשבון במבחן:</h6>
          <p><strong>כל ההכנסות הבאות נספרות:</strong></p>
          <ul>
            <li><strong>הכנסה מעבודה</strong> - כשכיר או עצמאי (עם הפחתה של ₪1,905)</li>
            <li><strong>פנסיה</strong> - מכל מקור (עם הפחתה של ₪1,905)</li>
            <li><strong>קופת גמל</strong> - תשלום חודשי (עם הפחתה של ₪1,905)</li>
            <li><strong>קצבת זקנה (אזרח ותיק)</strong> - נספרת במלואה</li>
            <li><strong>השלמת הכנסה</strong> - נספרת במלואה</li>
            <li><strong>הכנסות משכירות או ריבית</strong> - נספרות במלואה</li>
            <li><strong>פנסיית שאירים מקרן פנסיה</strong> - תלוי במעמד: שכיר (נספרת עם הפחתה), עצמאי או לא עובד (נספרת במלואה)</li>
          </ul>
        </div>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-right: 4px solid #4caf50; margin: 20px 0;">
          <h6>הכנסות שלא נלקחות בחשבון (פטורות):</h6>
          <ul>
            <li>✅ <strong>קצבת סיעוד</strong> - פטורה לחלוטין</li>
            <li>✅ <strong>גמלת ניידות</strong> - פטורה</li>
            <li>✅ <strong>קצבת ילדים</strong> - פטורה</li>
            <li>✅ <strong>גמלת ילד נכה</strong> - פטורה</li>
            <li>✅ <strong>קצבת שירותים מיוחדים</strong> - פטורה</li>
            <li>✅ <strong>דמי מחיה לשאירים</strong> - פטורים</li>
            <li>✅ <strong>תשלומים לנפגעי עבודה</strong> - פטורים</li>
            <li>✅ <strong>תגמולי ניידות ממשרד הביטחון</strong> - פטורים</li>
            <li><strong>תגמולים לנפגעי פעולות איבה/נכי צה"ל</strong> - תלוי במעמד:
              <ul>
                <li>אם עובד כשכיר: פטור לחלוטין</li>
                <li>אם עצמאי או לא עובד: נספר במלואו</li>
              </ul>
            </li>
          </ul>
        </div>       

        <h4>💵 סכומי קצבאות לשנת 2026</h4>

        <h5>קצבת אלמן/ה (נכון לינואר 2026)</h5>
        <p>הסכומים משתנים לפי גיל ומספר ילדים:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">מעמד</th>
              <th style="padding: 12px; border: 1px solid #ddd;">גיל</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום חודשי</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">אלמן/ה ללא ילדים</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">גיל 40-50</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">₪1,381</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">אלמן/ה ללא ילדים</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">גיל 50 ומעלה</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">₪1,838</td>
            </tr>
          </tbody>
        </table>

        <h5>קצבת יתומים:</h5>
        <ul>
          <li><strong>₪2,434</strong> לכל ילד (נכון ל-1.1.2026)</li>
          <li><strong>יתום משני הוריו</strong> זכאי לקצבה מכוח כל הורה בנפרד</li>
        </ul>

        <h5>תוספת ותק</h5>
        <p>השאירים זכאים לתוספת ותק בהתאם לשנות הביטוח של הנפטר:</p>
        <ul>
          <li><strong>2%</strong> מסכום הקצבה על כל שנת ביטוח מלאה (12 חודשים)</li>
          <li>התוספת המרבית: <strong>50%</strong> מהקצבה (כלומר עד 25 שנות ביטוח)</li>
        </ul>

        <h5>דמי מחיה ליתומים</h5>
        <p>יתומים הלומדים לפחות 24 שעות שבועיות מכיתה ט' עד גיל 20 זכאים לדמי מחיה:</p>
        <ul>
          <li>אם להורה משולמת קצבת שאירים - דמי המחיה כלולים בקצבה</li>
          <li>אם להורה לא משולמת קצבת שאירים - דמי מחיה: <strong>₪822</strong></li>
          <li>יתום משני הורים המקבל שתי קצבאות - זכאי לדמי מחיה כפולים</li>
        </ul>

        <h4>🎁 מענקים נוספים</h4>

        <h5>מענק פטירה</h5>
        <p>במקרים שבהם אין זכאות לקצבת שאירים, עשוי להינתן <strong>מענק שאירים חד-פעמי</strong> בשיעור של 36 קצבאות שאירים חודשיות.</p>

        <h5>מענקים מיוחדים</h5>
        <ul>
          <li><strong>מענק בר/בת מצווה</strong> - ליתומים</li>
          <li>במקרים מסוימים: תהיה זכאות לכפל מענק</li>
        </ul>

        <h4>⚖️ קצבאות סותרות ומצבים מיוחדים</h4>

        <h5>שילוב קצבת שאירים עם קצבת זקנה</h5>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>אלמן/ה בגיל קצבת אזרח ותיק:</strong></p>
          <ul>
            <li>אם צברו תקופת ביטוח כנדרש - זכאים ל<strong>קצבת זקנה מלאה + מחצית קצבת שאירים</strong></li>
            <li>אם לא צברו תקופת ביטוח כנדרש אך מבוטחים בביטוח זקנה - יקבלו <strong>מלוא קצבת שאירים</strong> (אך לא קצבת זקנה)</li>
          </ul>
        </div>

        <h5>שילוב עם קצבאות אחרות</h5>
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-right: 4px solid #ff9800; margin: 20px 0;">
          <p><strong>⚠️ חשוב לדעת:</strong></p>
          <ul>
            <li>אי אפשר לקבל קצבת שאירים ביחד עם קצבת נכות כללית - יש לבחור</li>
            <li>מומלץ להשתמש במחשבוני הביטוח הלאומי לבדיקת הזכאות לקבל יותר מקצבה אחת</li>
          </ul>
        </div>

        <h5>אלמנים/ות שנישאו מחדש או חיים כידועים בציבור</h5>
        <div class="conditions-box">
          <h5>כללי</h5>
          <p>אלמנות ואלמנים שנישאו מחדש או חיים כידועים בציבור <strong>לא זכאים</strong> יותר לקצבת שאירים.</p>

          <h5>מענק נישואין:</h5>
          <p>במקרה של נישואין מחדש, האלמן/ה זכאים למענק בשני שיעורים:</p>
          <ul>
            <li><strong>שיעור ראשון:</strong> לאחר הנישואין - 18 קצבאות חודשיות</li>
            <li><strong>שיעור שני:</strong> כעבור שנתיים - 18 קצבאות חודשיות נוספות</li>
          </ul>

          <h5>חזרה לזכאות:</h5>
          <p>אם האלמן/ה חדלו להיות נשואים <strong>לפני תום 10 שנים</strong> מהנישואין המחודשים, או שהחלו הליכי גירושין בתוך תקופה זו - <strong>הזכאות לקצבה תחזור</strong>.</p>
        </div>

        <h5>פטירה עקב תאונת עבודה, פעולות איבה או תאונת דרכים</h5>
        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828; margin: 20px 0;">
          <p>במקרים אלו:</p>
          <ul>
            <li>❌ <strong>אין</strong> זכאות לקצבת שאירים מהביטוח הלאומי</li>
            <li>✅ השאירים יהיו זכאים לפיצוי/קצבה מהגוף הרלוונטי (ביטוח לאומי - נפגעי עבודה/איבה, משרד הביטחון, או חברת ביטוח)</li>
          </ul>
        </div>

        <h4>📝 הגשת תביעה לקצבת שאירים</h4>

        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828; margin: 20px 0;">
          <h5>⏰ מתי להגיש?</h5>
          <p><strong>חובה להגיש תוך 12 חודשים מיום הפטירה!</strong></p>
          <ul>
            <li>אם תוגש תביעה <strong>לאחר 12 חודשים</strong> - ניתן לקבל את הקצבה רטרואקטיבית לתקופה שאינה עולה על <strong>12 חודשים</strong></li>
          </ul>
        </div>

        <h5>📮 איך מגישים?</h5>
        <ol>
          <li>מילוי <strong>טופס תביעה לקצבת שאירים</strong> (טופס 410)</li>
          <li>צירוף מסמכים:
            <ul>
              <li>תעודת פטירה</li>
              <li>תעודות זהות</li>
              <li>אישורי הכנסה</li>
              <li>אישורים נוספים לפי הנדרש בטופס</li>
            </ul>
          </li>
          <li>הגשה:
            <ul>
              <li>באמצעות אתר האינטרנט של ביטוח לאומי</li>
              <li>בדואר</li>
              <li>בתיבת השירות של הסניף</li>
              <li>בסניף ביטוח לאומי</li>
            </ul>
          </li>
        </ol>

        <h5>📅 מועד תחילת תשלום הקצבה</h5>
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-right: 4px solid #4caf50; margin: 20px 0;">
          <p><strong>אם הנפטר קיבל קצבת זקנה או נכות:</strong></p>
          <ul>
            <li>הקצבה תשולם מה-<strong>1 בחודש שלאחר חודש הפטירה</strong></li>
          </ul>

          <p><strong>אם הנפטר לא קיבל קצבת זקנה או נכות:</strong></p>
          <ul>
            <li>ושאיריו זכאים להשלמת הכנסה: מה-<strong>1 בחודש הפטירה</strong></li>
            <li>ושאיריו אינם זכאים להשלמת הכנסה:
              <ul>
                <li>פטירה עד ה-<strong>15 בחודש</strong>: מה-1 בחודש הפטירה</li>
                <li>פטירה מה-<strong>16 ואילך</strong>: מה-1 בחודש שלאחר הפטירה</li>
              </ul>
            </li>
          </ul>
        </div>

        <h5>💳 מועד תשלום חודשי</h5>
        <p>הקצבה משולמת ב-<strong>28 בכל חודש</strong> עבור אותו חודש.</p>

        <h4>🎓 זכויות והטבות נוספות</h4>

        <h5>זכויות לאלמנים/ות עם ילדים</h5>
        <p>אלמן/ה עם ילדים המקבלים קצבת שאירים זכאים ל:</p>
        <ul>
          <li>הטבות לפי חוק סיוע למשפחות חד-הוריות</li>
          <li>הטבות לפי חוק משפחות שבראשן הורה עצמאי</li>
        </ul>

        <h5>שיקום מקצועי</h5>
        <div class="conditions-box">
          <p>אלמן/ה המקבלים קצבת שאירים עשויים להיות זכאים ל<strong>שיקום מקצועי</strong>:</p>

          <h5>תנאי זכאות:</h5>
          <ul>
            <li>חסרי מקצוע או שאינם יכולים להתפרנס ממקצועם</li>
            <li>זקוקים להסבה מקצועית עקב ההתאלמנות</li>
            <li>מתאימים להכשרה מבחינת השכלה ומצב בריאותי</li>
          </ul>

          <h5>במהלך ההכשרה:</h5>
          <ul>
            <li>משולמים <strong>דמי מחיה</strong> (עד 50% מהשכר הממוצע במשק)</li>
            <li><strong>הוצאות נלוות</strong> - בהתאם לסוג ההכשרה</li>
          </ul>
        </div>

        <h5>קצבת שאירים מקרן פנסיה/ביטוח</h5>
        <p>אם הנפטר היה מבוטח ב:</p>
        <ul>
          <li>קרן פנסיה</li>
          <li>ביטוח מנהלים</li>
          <li>ביטוח חיים</li>
        </ul>
        <p>שאיריו עשויים להיות זכאים ל<strong>קצבת שאירים נוספת</strong> מעבר לזו של הביטוח הלאומי.</p>

        <h4>✈️ שהייה בחו"ל</h4>

        <h5>אלמנים/ות הגרים בחו"ל</h5>
        <p>זכאות לקבלת הקצבה בחו"ל תלויה ב:</p>
        <ul>
          <li>התקופה שהיו תושבי ישראל ומבוטחים</li>
          <li>המדינה שבה הם שוהים</li>
        </ul>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>שהייה קצרה (עד 3 חודשים):</strong></p>
          <ul>
            <li>הקצבה תשולם לחשבון הבנק בישראל</li>
          </ul>

          <p><strong>שהייה ארוכה:</strong></p>
          <ul>
            <li>חובת המצאת <strong>טופס אישור חיים</strong> פעם בשנה</li>
          </ul>

          <p><strong>שהייה בארה"ב:</strong></p>
          <p>שאירים שמתגוררים בארה"ב עשויים לקבל קצבה אם:</p>
          <ul>
            <li>הנפטרים היו תושבי ישראל בעת הפטירה</li>
            <li>השאירים קיבלו קצבה <strong>לפני</strong> שיצאו לארה"ב</li>
          </ul>
        </div>

        <h4>⚖️ ערעור על החלטות הביטוח הלאומי</h4>
        <p>אם החלטת הביטוח הלאומי נדחתה או שהסכום נראה שגוי:</p>
        <ol>
          <li><strong>הגשת ערעור</strong> לבית הדין האזורי לעבודה</li>
          <li><strong>מועד הגשה:</strong> תוך <strong>12 חודשים</strong> ממועד קבלת החלטת המוסד</li>
          <li><strong>מומלץ:</strong> להיוועץ עם עורך דין מומחה בביטוח לאומי</li>
        </ol>

        <h4>📞 פרטי יצירת קשר</h4>
        <ul>
          <li><strong>מוקד טלפוני ארצי:</strong> *6050 או 04-8812345</li>
          <li><strong>אתר האינטרנט:</strong> <a href="https://www.btl.gov.il" target="_blank" style="color: #667eea; text-decoration: underline;">www.btl.gov.il</a></li>
          <li><strong>שירות אישי מקוון:</strong> <a href="https://ps.btl.gov.il" target="_blank" style="color: #667eea; text-decoration: underline;">ps.btl.gov.il</a></li>
          <li><strong>לבדיקת זכאות:</strong> מחשבון קצבת שאירים באתר הביטוח הלאומי</li>
        </ul>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-right: 4px solid #4caf50; margin-top: 20px;">
          <h5>✅ לסיכום - נקודות חשובות לזכור</h5>
          <ul>
            <li>✅ הגש תביעה תוך 12 חודשים מיום הפטירה</li>
            <li>✅ בדוק זכאות במחשבוני הביטוח הלאומי</li>
            <li>✅ תוספת ותק - 2% לכל שנת ביטוח (עד 50%)</li>
            <li>✅ אלמנים ללא ילדים - תלוי במבחן הכנסות</li>
            <li>✅ נישואין מחדש או ידועים בציבור - פוגע בזכאות</li>
            <li>✅ פיגור בתשלום ע"י מעסיק - לא פוגע בזכאות</li>
            <li>✅ שאיר של שני הורים - זכאי לשתי קצבאות נפרדות</li>
            <li>✅ קצבת זקנה + שאירים - מלוא זקנה + חצי שאירים</li>
            <li>✅ שהייה בחו"ל - דורש אישור חיים שנתי</li>
          </ul>
        </div>

        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828; margin-top: 20px;">
          <p style="font-style: italic; margin: 0;">*המידע במסמך זה עודכן לינואר 2026 ומהווה מדריך כללי בלבד. לפרטים מדויקים ומעודכנים יש לפנות למוסד לביטוח לאומי.*</p>
        </div>

        <h3>👩 מענק מעבר לנשים בגיל 62</h3>

        <h4>📋 מהו מענק המעבר?</h4>
        <p>בעקבות העלאת גיל הפרישה לנשים ודחיית מועד זכאותן לקצבת אזרח ותיק, נשים שנולדו בין ינואר 1960 לדצמבר 1966 עשויות להיות זכאיות למענק מעבר.</p>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-right: 4px solid #4caf50; margin: 20px 0;">
          <h5 class="no-accordion">🎯 מטרת המענק</h5>
          <p>לסייע לנשים בפרק הזמן שבין גיל 62 ועד לקבלת קצבת אזרח ותיק.</p>
        </div>

        <h4>⏱️ משך התשלום</h4>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; border-right: 4px solid #2196f3; margin: 20px 0;">
          <ul>
            <li>המענק משולם לתקופה של <strong>4 חודשים לכל היותר</strong></li>
            <li>התשלום מתחיל מהחודש שבו מלאו לאישה <strong>62 שנים</strong></li>
            <li>התנאים נבדקים בכל חודש מ-4 חודשי הזכאות</li>
          </ul>
        </div>

        <h4>✅ תנאי זכאות למענק</h4>
        <p><strong>כדי להיות זכאית למענק, יש לעמוד בכל התנאים המצטברים הבאים:</strong></p>

        <div class="conditions-box">
          <h5 class="no-accordion">1️⃣ גיל ושנת לידה</h5>
          <ul>
            <li>נשים שנולדו בין ינואר 1960 לדצמבר 1966</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5 class="no-accordion">2️⃣ היעדר הכנסות מעבודה</h5>
          <ul>
            <li>אסור שיהיו הכנסות כשכירה או כעצמאית מגיל 62 ועד גיל 62 ו-4 חודשים</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5 class="no-accordion">3️⃣ מגבלה על הכנסות מפנסיה וקצבאות</h5>
          <ul>
            <li>הכנסה מפנסיה, תגמולים או קצבאות אינה יכולה לעלות על <strong>₪10,120 לחודש</strong> (נכון לינואר 2026)</li>
          </ul>
        </div>

        <div class="conditions-box">
          <h5 class="no-accordion">4️⃣ מגבלה על הכנסות שלא מעבודה</h5>
          <ul>
            <li>הכנסה שנתית שלא מעבודה (משכירות, ריבית על השקעות, מענקי פרישה וכו') לא יכולה לעלות על <strong>₪60,000</strong> בשנת המס שבה מלאו לך 61 שנים</li>
          </ul>
        </div>

        <h4>📅 תקופת ביטוח</h4>
        <div style="background: #f3e5f5; padding: 20px; border-radius: 10px; border-right: 4px solid #9c27b0; margin: 20px 0;">
          <p><strong>חובה לעמוד באחד מהתנאים הבאים:</strong></p>
          <ul>
            <li>✅ <strong>60 חודשי ביטוח</strong> (5 שנים) מגיל 52</li>
            <li>✅ <strong>144 חודשי ביטוח</strong> (12 שנים) מגיל 18</li>
          </ul>
          <p style="margin-top: 10px; font-size: 0.9em; color: #666;">תקופת ביטוח כוללת תקופות עבודה בהן שולמו דמי ביטוח לאומי</p>
        </div>

        <h4>🚫 אין קבלת קצבאות אחרות</h4>
        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828; margin: 20px 0;">
          <p><strong>אין זכאות למענק במקרים הבאים:</strong></p>
          <ul>
            <li>❌ קבלת קצבת הבטחת הכנסה</li>
            <li>❌ קבלת דמי מזונות</li>
            <li>❌ קבלת קצבת נכות כללית</li>
            <li>❌ קבלת דמי אבטלה</li>
            <li>❌ קבלת דמי אבטלה מוגדלים (300 ימים)</li>
            <li>❌ שהות בחופשה ללא תשלום (חל"ת) מרצון</li>
          </ul>
        </div>

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-right: 4px solid #ff9800; margin: 20px 0;">
          <p><strong>⚠️ שימי לב:</strong> התנאים נבדקים בכל חודש מ-4 חודשי הזכאות.</p>
        </div>

        <h4>💵 סכום המענק</h4>
        <p>הסכום המקסימלי של המענק משתנה לפי שנת הלידה:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">שנת לידה</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סכום מקסימלי</th>
              <th style="padding: 12px; border: 1px solid #ddd;">סה"כ ל-4 חודשים</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1960-1962</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #667eea; font-weight: bold;">₪4,000</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">₪16,000</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1963</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #667eea; font-weight: bold;">₪3,750</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">₪15,000</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1964</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #667eea; font-weight: bold;">₪3,500</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">₪14,000</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1965</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #667eea; font-weight: bold;">₪3,250</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">₪13,000</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">1966</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #667eea; font-weight: bold;">₪3,000</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">₪12,000</td>
            </tr>
          </tbody>
        </table>

        <h4>📝 הגשת בקשה למענק</h4>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h5 class="no-accordion">📅 מועד הגשה</h5>
          <p>ניתן להגיש את הבקשה עד גיל 64.</p>

          <h5 class="no-accordion" >📮 דרכי הגשה</h5>
          <ul>
            <li>✅ <a href="https://www.btl.gov.il/benefits/old_age/MankMavrATR/Pages/BksaMankMavr.aspx" target="_blank" style="color: #667eea; text-decoration: underline;">מילוי טופס והגשתו</a> במחלקת אזרח ותיק בסניף הביטוח הלאומי הקרוב למקום מגוריך</li>
            <li>✅ שליחת מסמכים דרך שירות שליחת מסמכים של הביטוח הלאומי</li>
          </ul>
        </div>

        <h4>📞 יצירת קשר</h4>
        <ul>
          <li><strong>מוקד הביטוח הלאומי:</strong> *6050 או 04-8812345</li>
          <li><strong>אתר הביטוח הלאומי:</strong> www.btl.gov.il</li>
          <li><strong>שירות אישי:</strong> ps.btl.gov.il</li>
        </ul>

        <div style="background: #ffebee; padding: 20px; border-radius: 10px; border-right: 4px solid #c62828; margin-top: 20px;">
          <h5 class="no-accordion">⚠️ הערה חשובה</h5>
          <p>המידע במסמך זה הוא כללי ונועד לספק מידע ראשוני. לקבלת מידע מדויק ועדכני ולבדיקת זכאות אישית, יש לפנות ישירות למוסד לביטוח לאומי.</p>
          <p style="margin-top: 10px;"><em>מסמך זה הוכן בתאריך ינואר 2026</em></p>
        </div>
      `,
      "updatedAt": "2026-01-16T00:00:00.000Z"
    }
  }
};

// ייצוא לשימוש בדפדפן
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RIGHTS_DATA;
}
