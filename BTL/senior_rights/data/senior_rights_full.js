// מדריך מקיף זכויות אזרחים ותיקים 2026
// כל הסכומים מעודכנים לינואר 2026
const RIGHTS_DATA = {
  lastUpdate: "2026-01-01T00:00:00.000Z",
  version: "2026.1-full",
  categories: {

    // ─────────────────────────────────────────────────────────────────────
    // 1. קצבת אזרח ותיק
    // ─────────────────────────────────────────────────────────────────────
    old_age_pension: {
      contentFn: (NII) => `
        <a href="https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%AA%D7%95%D7%9F_%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94" target="_blank" class="link-item">🔗 זכותון קצבת זיקנה — כל זכות</a>

        <h3>1.1 גילאי פרישה וזכאות</h3>
        <p><strong>גיל הפרישה לגברים:</strong> ${NII.retirement_age_male.value}</p>
        <p><strong>גיל הפרישה לנשים לפי שנת לידה:</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">שנת לידה</th>
            <th style="padding:10px;border:1px solid #ddd;">גיל פרישה</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">עד 1959</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">62</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1960</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">62 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1961</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">62 שנים ו-8 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1962</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">63</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1963</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">63 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1964</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">63 שנים ו-8 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1965</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">64</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1966</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">64 שנים ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;text-align:center;">1967 ואילך</td><td style="padding:9px;border:1px solid #ddd;text-align:center;font-weight:bold;color:#667eea;">65</td></tr>
          </tbody>
        </table>
        <div class="conditions-box">
          <p>📅 מדרגת גיל הפרישה לילידות 1962 הסתיימה ב-31/12/2025</p>
          <p>⏭️ מדרגת גיל הפרישה לילידות 1963 תחל ב-01/05/2026</p>
        </div>
        <p><strong>גיל הזכאות המוחלט: ${NII.retirement_age_unconditional.value}</strong> — החל מגיל ${NII.retirement_age_unconditional.value} הקצבה משולמת ללא כל מבחן הכנסות, גם למי שעובד ומרוויח.</p>

        <h3>1.2 תקופת אכשרה</h3>
        <p>
          <a href="https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/achshara/Pages/%D7%AA%D7%A7%D7%95%D7%A4%D7%AA%D7%90%D7%9B%D7%A9%D7%A8%D7%94%D7%9C%D7%92%D7%91%D7%A8.aspx" target="_blank" rel="noopener" style="color:#2E5B8A;font-weight:600;">🔗 תקופת אכשרה לגבר — BTL</a> |
          <a href="https://www.btl.gov.il/benefits/old_age/Conditions_of_eligibility/achshara/Pages/achsharaIsha.aspx" target="_blank" rel="noopener" style="color:#2E5B8A;font-weight:600;">🔗 תקופת אכשרה לאישה — BTL</a> |
          <a href="https://www.kolzchut.org.il/he/%D7%AA%D7%A7%D7%95%D7%A4%D7%AA_%D7%90%D7%9B%D7%A9%D7%A8%D7%94_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%90%D7%96%D7%A8%D7%97_%D7%95%D7%AA%D7%99%D7%A7" target="_blank" rel="noopener" style="color:#2E5B8A;font-weight:600;">🔗 כל זכות</a>
        </p>

        <h4>הגדרת "מבוטח" ותשלום דמי ביטוח</h4>
        <p>כדי לצבור תקופת אכשרה, על האדם להיות "מבוטח" בביטוח אזרח ותיק ולשלם דמי ביטוח כחוק.</p>
        <ul>
          <li><strong>כללי:</strong> מבוטח הוא תושב ישראל שמלאו לו 18 שנים, וטרם הגיע לגיל הפרישה.</li>
          <li><strong>עובד עצמאי/לא עובד:</strong> עליהם להסדיר את התשלום ישירות מול הביטוח הלאומי. תקופות שבהן קיים חוב בדמי הביטוח עלולות שלא להיספר כתקופת אכשרה.</li>
          <li><strong>עובד שכיר (דגש חשוב):</strong> לפי סעיף 365 לחוק, אם המעסיק לא שילם — <strong>התקופה עדיין תיחשב לעובד כתקופת אכשרה</strong>. זכויות העובד אינן נפגעות בשל מחדלי המעסיק, כל עוד ניתן להוכיח יחסי עובד-מעביד (תלושי שכר, טופס 106).</li>
        </ul>

        <h4>תקופות הנמנות כתקופת אכשרה</h4>
        <ul>
          <li>חודשי שירות חובה בצה"ל, שירות מילואים או שירות לאומי-אזרחי.</li>
          <li>חודשים שבעבורם שולמו דמי לידה, דמי אבטלה, דמי פגיעה בעבודה או דמי תאונה.</li>
          <li>חודשים שבהם קיבל המבוטח קצבת נכות כללית (בדרגת אי-כושר של 75% ומעלה).</li>
          <li>חודשי עבודה בחו"ל — בתנאי שהמבוטח המשיך לשלם דמי ביטוח כתושב ישראל, או שעבד במדינה שיש לה אמנה עם ישראל.</li>
          <li>תקופות שבהן המבוטח היה פטור מתשלום דמי ביטוח לפי החוק (למשל: תקופת מחלה ממושכת).</li>
        </ul>

        <h4>שלוש חלופות לצבירת אכשרה</h4>
        <ul>
          <li><strong>חלופה א':</strong> 144 חודשי ביטוח (12 שנים) בסך הכל, מיום שהפך המבוטח לתושב ישראל.</li>
          <li><strong>חלופה ב':</strong> 60 חודשי ביטוח (5 שנים) בתוך 10 השנים האחרונות שקדמו לגיל הפרישה.</li>
          <li><strong>חלופה ג' (עולים חדשים):</strong> מספר חודשי הביטוח הוא לפחות כמספר החודשים שבהם <strong>לא</strong> היה מבוטח. רלוונטי למי שהפך לתושב לאחר גיל 40 (גבר), ובתנאי שצבר לפחות 60 חודשי ביטוח.</li>
        </ul>

        <h4>פטור מתקופת אכשרה</h4>
        <p>האוכלוסיות הבאות פטורות לחלוטין:</p>
        <ul>
          <li><strong>גרושה</strong> שהתגרשה לאחר גיל 55.</li>
          <li><strong>אלמנה</strong> שאינה זכאית לקצבת שאירים.</li>
          <li><strong>עגונה</strong> שבעלה נעלם או נמצא בחו"ל מעל שנתיים.</li>
          <li><strong>אישה שבן זוגה אינו מבוטח</strong> (למשל עלה לארץ מעל גיל פרישה).</li>
          <li><strong>מי שקיבלה קצבת נכות</strong> בחודש שקדם להגיעה לגיל הפרישה.</li>
        </ul>

        <h4>סטטוס "עקרת בית"</h4>
        <ul>
          <li><strong>צבירת אכשרה:</strong> צוברת רק עבור תקופות עבודה כשכירה/עצמאית או תקופות לפני נישואיה.</li>
          <li><strong>הזכאות לקצבה:</strong> אם לא צברה אכשרה, תהיה זכאית לקצבה רק ב<strong>גיל ${NII.retirement_age_unconditional.value}</strong>.</li>
          <li><strong>המלצה:</strong> לבדוק "חלופת ה-144" לפני מעבר לסטטוס עקרת בית, כדי לשמור על זכאות בגיל הפרישה (62–65).</li>
        </ul>

        <h4>סטטוס רווקה / גרושה / אלמנה</h4>
        <ul>
          <li><strong>חובת תשלום:</strong> חייבות בתשלום דמי ביטוח (דרך השכר או באופן עצמאי).</li>
          <li><strong>צבירת ותק:</strong> כל חודשי הביטוח נספרים כתקופת אכשרה מלאה.</li>
          <li><strong>זכאות:</strong> לרוב קל להן לעמוד ב"חלופת ה-144" ולקבל קצבה מגיל הפרישה (62–65).</li>
        </ul>

        <h4>קצבה מיוחדת (למי שלא צבר אכשרה)</h4>
        <div class="conditions-box">
          <p>מי שהגיע לגיל הפרישה ואינו עומד באף חלופת אכשרה, עשוי להיות זכאי ל<strong>קצבת אזרח ותיק מיוחדת</strong>. קצבה זו מותנית במבחן הכנסות מחמיר ובתושבות ישראל.</p>
        </div>

        <h4>נקודות בדיקה חשובות לאכשרה</h4>
        <ul>
          <li><strong>מצב משפחתי:</strong> גירושין/אלמנות עשויים לתת פטור מאכשרה.</li>
          <li><strong>הוכחת עבודה:</strong> לשכירים — התקופה נספרת גם אם המעסיק חב לביטוח לאומי.</li>
          <li><strong>תקופות נכות:</strong> לבדוק קצבת נכות (75%+) שנספרת כאכשרה.</li>
          <li><strong>עקרות בית:</strong> לבדוק אם כדאי לשלם כ"לא עובדת" כדי לשמור זכאות לגיל פרישה מוקדם.</li>
        </ul>

        <h3>1.3 מבחן הכנסות (בין גיל הפרישה ל-${NII.retirement_age_unconditional.value})</h3>
        <div class="conditions-box">
          <p>📅 המבחן חל <strong>מגיל פרישה ועד גיל ${NII.retirement_age_unconditional.value}</strong> — מגיל ${NII.retirement_age_unconditional.value} הקצבה משולמת ללא מבחן הכנסות.</p>
          <p>📌 <strong>שיעור הפחתה:</strong> ${NII.income_test_deduction_rate.value}% מכל שקל שמעל תקרת הקצבה המלאה</p>
          <p>📌 קצבה חלקית מתחת ₪${Math.round(NII.pension_single_basic.value * 0.1).toLocaleString('he-IL')} (10% מהקצבה הבסיסית) שוללת זכאות לקצבת זיקנה</p>
          <p>📌 <strong>פנסיה פרטית</strong> (קרן פנסיה, ביטוח מנהלים, קרן השתלמות) — <strong>אינה נכללת</strong> במבחן</p>
          <p>📌 <strong>שכר ממוצע במשק (2026):</strong> ₪${NII.average_wage.value.toLocaleString('he-IL')}</p>
        </div>

        <h4>א. הכנסה רק מעבודה</h4>
        <p>הכנסה ממשכורת או מעסק עצמאי — ברוטו, לפני ניכויים.</p>

        <h5>1. יחיד (ללא בן/ת זוג, או ב"ז שאינו עונה על ההגדרה)</h5>
        <p>כולל: רווק/ה, גרוש/ה, אלמן/ה, ונשוי/ה שהכנסת ב"ז עולה על ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')}/חודש</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הכנסה חודשית מעבודה (ברוטו)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">מצב קצבה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">הערה</th>
          </tr></thead>
          <tbody>
            <tr style="background:#f8fff8;"><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.income_test_single_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">קצבה מלאה</td><td style="padding:9px;border:1px solid #ddd;">ללא קיצוץ</td></tr>
            <tr style="background:#fffef8;"><td style="padding:9px;border:1px solid #ddd;">₪${NII.income_test_single_full.value.toLocaleString('he-IL')} – ₪${NII.income_test_single_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#E65100;font-weight:bold;">קצבה חלקית</td><td style="padding:9px;border:1px solid #ddd;">מינוס ${NII.income_test_deduction_rate.value}% מהחריגה</td></tr>
            <tr style="background:#fff8f8;"><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.income_test_single_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">אין זכאות</td><td style="padding:9px;border:1px solid #ddd;">קצבה מושהית עד גיל ${NII.retirement_age_unconditional.value}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box">
          <p><strong>נוסחה:</strong> קצבה = קצבה מלאה − (${NII.income_test_deduction_rate.value}% × [הכנסה − ₪${NII.income_test_single_full.value.toLocaleString('he-IL')}])</p>
          <p><strong>דוגמה:</strong> הכנסה ₪11,000 → חריגה ₪${(11000 - NII.income_test_single_full.value).toLocaleString('he-IL')} → קיצוץ ₪${Math.round((11000 - NII.income_test_single_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')}</p>
          <p>⚠️ הקצבה החלקית לא תרד מ-10% מהקצבה הבסיסית (₪${Math.round(NII.pension_single_basic.value * 0.1).toLocaleString('he-IL')})</p>
        </div>

        <h5>2. נשוי/ה — בן/ת הזוג עונה על הגדרת "בן זוג" ואינו/ה מקבל/ת קצבה</h5>
        <p>תנאים: נשואים שנה לפחות, ב"ז בגיל 50–${NII.retirement_age_unconditional.value} (או מעל ${NII.retirement_age_unconditional.value} ואינו מקבל קצבה), והכנסת ב"ז אינה עולה על ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')}/חודש</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הכנסה חודשית מעבודה (ברוטו)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">מצב קצבה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">הערה</th>
          </tr></thead>
          <tbody>
            <tr style="background:#f8fff8;"><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.income_test_married_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">קצבה מלאה</td><td style="padding:9px;border:1px solid #ddd;">כולל תוספת בן/ת הזוג</td></tr>
            <tr style="background:#fffef8;"><td style="padding:9px;border:1px solid #ddd;">₪${NII.income_test_married_full.value.toLocaleString('he-IL')} – ₪${NII.income_test_married_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#E65100;font-weight:bold;">קצבה חלקית</td><td style="padding:9px;border:1px solid #ddd;">מינוס ${NII.income_test_deduction_rate.value}% מהחריגה</td></tr>
            <tr style="background:#fff8f8;"><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.income_test_married_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">אין זכאות</td><td style="padding:9px;border:1px solid #ddd;">קצבה מושהית עד גיל ${NII.retirement_age_unconditional.value}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box">
          <p><strong>נוסחה:</strong> קצבה = קצבה מלאה − (${NII.income_test_deduction_rate.value}% × [הכנסה − ₪${NII.income_test_married_full.value.toLocaleString('he-IL')}])</p>
          <p><strong>דוגמה:</strong> הכנסה ₪15,000 → חריגה ₪${(15000 - NII.income_test_married_full.value).toLocaleString('he-IL')} → קיצוץ ₪${Math.round((15000 - NII.income_test_married_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')}</p>
          <p>📌 הקצבה המשולמת כוללת תוספת עבור בן/ת הזוג כל עוד הכנסת ב"ז אינה עולה על ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')}</p>
        </div>

        <h5>3. שני בני הזוג זכאים לקצבה בזכות עצמם</h5>
        <p>כל אחד מהם עובר מבחן הכנסה <strong>עצמאי</strong> כ"יחיד" לצורכי חישוב קצבתו.</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">מבוטח/ת</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרה לקצבה מלאה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרה — אין זכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">כל אחד מבני הזוג</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;color:#2E7D32;">₪${NII.income_test_single_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;color:#C62828;">₪${NII.income_test_single_partial.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box">
          <p>📌 כל בן/ת זוג מגיש/ה תביעה נפרדת ומקבל/ת קצבה נפרדת לפי הכנסתו/ה האישית</p>
          <p>📌 הכנסת בן/ת הזוג אינה מצטרפת לחישוב הכנסת המבוטח/ת</p>
          <p>📌 כל אחד זכאי לתוספת ותק בהתאם לשנות ביטוחו/ה האישיות</p>
        </div>

        <h4>ב. הכנסה רק מנכסים</h4>
        <p>כולל: שכר דירה, ריבית, דיבידנד, רווחי הון (חודשי = שנתי÷12), הכנסה מהשכרת רכוש.</p>
        <div class="conditions-box" style="background:#fff3e0;">
          <p>⚠️ <strong>הבדל מהותי:</strong> תקרות הכנסה מנכסים גבוהות פי 3 מתקרות הכנסת עבודה</p>
          <p>⚠️ פנסיה מקרן פנסיה / ביטוח מנהלים / קרן השתלמות — אינה נכנסת לחישוב זה</p>
          <p>⚠️ <strong>אין תוספת דחייה</strong> בשל חריגה מהכנסה מנכסים</p>
        </div>

        <h5>1. יחיד — הכנסה מנכסים</h5>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הכנסה חודשית מנכסים (ברוטו)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">מצב קצבה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">הערה</th>
          </tr></thead>
          <tbody>
            <tr style="background:#f8fff8;"><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.income_test_single_asset_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">קצבה מלאה</td><td style="padding:9px;border:1px solid #ddd;">ללא קיצוץ</td></tr>
            <tr style="background:#fffef8;"><td style="padding:9px;border:1px solid #ddd;">₪${NII.income_test_single_asset_full.value.toLocaleString('he-IL')} – ₪${NII.income_test_single_asset_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#E65100;font-weight:bold;">קצבה חלקית</td><td style="padding:9px;border:1px solid #ddd;">מינוס ${NII.income_test_deduction_rate.value}% מהחריגה</td></tr>
            <tr style="background:#fff8f8;"><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.income_test_single_asset_partial.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">אין זכאות</td><td style="padding:9px;border:1px solid #ddd;">אין תוספת דחייה</td></tr>
          </tbody>
        </table>

        <h5>2א. נשוי/ה — ב"ז עונה להגדרה ואינו/ה מקבל/ת קצבה</h5>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הכנסה חודשית מנכסים (ברוטו)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">מצב קצבה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">הערה</th>
          </tr></thead>
          <tbody>
            <tr style="background:#f8fff8;"><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">קצבה מלאה</td><td style="padding:9px;border:1px solid #ddd;">ללא קיצוץ</td></tr>
            <tr style="background:#fffef8;"><td style="padding:9px;border:1px solid #ddd;">₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')} – ₪${NII.income_test_married_asset_partial_no_pension.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#E65100;font-weight:bold;">קצבה חלקית</td><td style="padding:9px;border:1px solid #ddd;">מינוס ${NII.income_test_deduction_rate.value}% מהחריגה</td></tr>
            <tr style="background:#fff8f8;"><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.income_test_married_asset_partial_no_pension.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">אין זכאות</td><td style="padding:9px;border:1px solid #ddd;">אין תוספת דחייה</td></tr>
          </tbody>
        </table>

        <h5>2ב. נשוי/ה — ב"ז עונה להגדרה ומקבל/ת קצבה מהביטוח הלאומי</h5>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הכנסה חודשית מנכסים (ברוטו)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">מצב קצבה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">הערה</th>
          </tr></thead>
          <tbody>
            <tr style="background:#f8fff8;"><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">קצבה מלאה</td><td style="padding:9px;border:1px solid #ddd;">ללא קיצוץ</td></tr>
            <tr style="background:#fffef8;"><td style="padding:9px;border:1px solid #ddd;">₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')} – ₪${NII.income_test_married_asset_partial_with_pension.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#E65100;font-weight:bold;">קצבה חלקית</td><td style="padding:9px;border:1px solid #ddd;">מינוס ${NII.income_test_deduction_rate.value}% מהחריגה</td></tr>
            <tr style="background:#fff8f8;"><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.income_test_married_asset_partial_with_pension.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">אין זכאות</td><td style="padding:9px;border:1px solid #ddd;">אין תוספת דחייה</td></tr>
          </tbody>
        </table>

        <h5>3. שני בני הזוג זכאים — הכנסה מנכסים</h5>
        <p>כל אחד נבחן בנפרד. הכנסה מנכסים משותפים מתחלקת לפי חלק בבעלות (בד"כ 50/50 לפי טאבו).</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">מבוטח/ת</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרת קצבה מלאה</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרת אין זכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">כל אחד מבני הזוג</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;color:#2E7D32;">₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;color:#C62828;">₪${NII.income_test_married_asset_partial_with_pension.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box" style="background:#e8f5e9;">
          <p><strong>דוגמה — שכר דירה ושני בני זוג זכאים:</strong></p>
          <ul style="margin:8px 0 0 20px;">
            <li>דירה משותפת (50/50) עם שכר דירה ₪84,000/חודש</li>
            <li>קצבה מלאה של כל אחד (כולל ותק ${NII.seniority_bonus_max.value}%): ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')}</li>
            <li>חלקו של כל אחד: ₪84,000 ÷ 2 = ₪42,000/חודש</li>
            <li>חריגה: ₪42,000 − ₪${NII.income_test_married_asset_full.value.toLocaleString('he-IL')} = ₪${(42000 - NII.income_test_married_asset_full.value).toLocaleString('he-IL')}</li>
            <li>קיצוץ: ${NII.income_test_deduction_rate.value}% × ₪${(42000 - NII.income_test_married_asset_full.value).toLocaleString('he-IL')} = ₪${Math.round((42000 - NII.income_test_married_asset_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')}</li>
            <li>▶ <strong>קצבה לכל אחד: ₪${(Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)) - Math.round((42000 - NII.income_test_married_asset_full.value) * NII.income_test_deduction_rate.value / 100)).toLocaleString('he-IL')}/חודש</strong></li>
          </ul>
          <p style="margin-top:8px;">⚠️ אם הדירה רשומה על שם אחד בלבד — כל ₪84,000 ייוחסו לו ויאבד זכאות (מעל ₪${NII.income_test_married_asset_partial_with_pension.value.toLocaleString('he-IL')})</p>
        </div>

        <h4>ג. הכנסה משולבת (גם מעבודה וגם מנכסים)</h4>
        <p>כאשר יש הכנסה הן מעבודה והן מנכסים — שתי ההכנסות <strong>נסכמות יחד</strong> לבדיקת התקרה.</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:9px 10px;border:1px solid #ddd;">הרכב משפחתי</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרת עבודה (לקצבה מלאה)</th>
            <th style="padding:9px 10px;border:1px solid #ddd;">תקרת נכסים (לקצבה מלאה)</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">יחיד</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_single_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_single_asset_combined.value.toLocaleString('he-IL')}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:9px;border:1px solid #ddd;">זוג (ב"ז לא מקבל קצבה)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_married_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_married_asset_combined.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">נשואים זכאים — כל אחד בנפרד</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_single_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.income_test_single_asset_combined.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box">
          <p>📌 תקרת נכסים-בלבד = תקרת עבודה × 3 | תקרת נכסים-במשולב = תקרת עבודה × 2</p>
          <p>📌 אין זכאות כאשר הקצבה המחושבת יורדת מ-₪${Math.round(NII.pension_single_basic.value * 0.1).toLocaleString('he-IL')}/חודש</p>
        </div>

        <h4>ד. מה נחשב / לא נחשב הכנסה</h4>

        <h5>✅ נחשב הכנסה</h5>
        <ul>
          <li>שכר עבודה (ברוטו), משכורת, הכנסה מעסק</li>
          <li>שכר דירה (לפני ניכוי הוצאות)</li>
          <li>ריבית מפיקדונות / אגרות חוב</li>
          <li>דיבידנד ממניות</li>
          <li>הכנסה מהשכרת נכס</li>
          <li>רווח הון מניירות ערך (מחושב כהכנסה חודשית = שנתי ÷ 12)</li>
        </ul>

        <h5>❌ לא נחשב הכנסה</h5>
        <ul>
          <li>קצבה מקרן פנסיה / ביטוח מנהלים / קרן השתלמות</li>
          <li>קצבת אזרח ותיק עצמה</li>
          <li>קצבת שאירים</li>
          <li>הכנסות פטורות ממס (לדוגמה: מכירת דירה יחידה)</li>
          <li>גמלאות ביטוח לאומי אחרות (נכות, סיעוד וכו')</li>
        </ul>

        <h4>ה. תוספת דחייה</h4>
        <p>מי שלא קיבל קצבה בגין הכנסה מעבודה שחרגה מהתקרה — זכאי ל-<strong>5% לכל שנה</strong> שבה נמנעה ממנו הקצבה.</p>
        <div class="conditions-box" style="background:#fff3e0;">
          <p>⚠️ תוספת דחייה ניתנת <strong>רק</strong> בשל חריגה מהכנסת עבודה — <strong>לא</strong> בשל הכנסה מנכסים</p>
          <p>⚠️ מי שוויתר מרצון על הקצבה (גם אם הגיע להכנסה נמוכה) לא יקבל תוספת דחייה</p>
        </div>

        <h4>ו. הגדרת בן/ת זוג לצורך התוספת</h4>
        <p>בן/ת זוג מוכר/ת לצורך תוספת הקצבה והגדלת תקרת ההכנסה — צריך/ה לעמוד בכל התנאים:</p>
        <ul>
          <li>נשואים (או ידועים בציבור) שנה לפחות</li>
          <li>בן/ת הזוג בגיל 50–${NII.retirement_age_unconditional.value}, ו/או מעל ${NII.retirement_age_unconditional.value} ואינו/ה מקבל/ת קצבה בזכות עצמו/ה</li>
          <li>הכנסת בן/ת הזוג מ<strong>כל המקורות</strong> (כולל פנסיה) אינה עולה על ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')}/חודש</li>
        </ul>

        <h3>1.4 סכומי הקצבה הבסיסית לשנת 2026</h3>
        <div class="conditions-box"><p>⬆️ קצבאות אזרח ותיק עלו ב-${NII.cpi_rate_2026.value}% בינואר 2026 (הצמדה למדד המחירים)</p></div>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מצב</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">יחיד/ה</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.pension_single_basic.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">יחיד/ה בגיל 80 ומעלה</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.pension_single_over80.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">יחיד עם בן/בת זוג שאינם מקבלים קצבה</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.pension_couple_basic.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">זוג שניהם מקבלים</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.pension_single_basic.value.toLocaleString('he-IL')} לכל אחד (₪${(NII.pension_single_basic.value * 2).toLocaleString('he-IL')} סה"כ)</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תוספת לבן/בת זוג</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.pension_spouse_supplement.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תוספת לכל ילד (עד 2 ילדים)</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.pension_child_supplement.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h3>1.5 תוספת ותק</h3>
        <ul>
          <li><strong>שיעור:</strong> ${NII.seniority_bonus_rate.value}% לכל שנת ביטוח מלאה (12 חודשים), החל מהשנה הראשונה.</li>
          <li><strong>תוספת מקסימלית:</strong> ${NII.seniority_bonus_max.value}% עבור 25 שנות ביטוח ומעלה.</li>
          <li><strong>חישוב:</strong> על הקצבה הבסיסית + תוספות בני משפחה.</li>
          <li><strong>דוגמה:</strong> 25 שנות ביטוח = +${NII.seniority_bonus_max.value}% = ₪${Math.round(NII.pension_single_basic.value * NII.seniority_bonus_max.value / 100).toLocaleString('he-IL')} (על ₪${NII.pension_single_basic.value.toLocaleString('he-IL')}).</li>
          <li><strong>סה"כ עם ותק מקסימלי ליחיד:</strong> ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')}.</li>
          <li><strong>מרבית מקבלי הקצבה</strong> זכאים לתוספת ותק של ${NII.seniority_bonus_max.value}%.</li>
        </ul>
        <a href="https://www.kolzchut.org.il/he/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA_%D7%95%D7%AA%D7%A7_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94" target="_blank" class="link-item">🔗 תוספת ותק — כל זכות</a>

        <h3>1.6 תוספת דחיית קצבה</h3>
        <ul>
          <li><strong>שיעור:</strong> ${NII.deferral_bonus_rate.value}% לכל שנת דחייה.</li>
          <li><strong>תנאי:</strong> דחייה בגלל הכנסות מעבודה שעוברות את התקרה לקצבה מלאה.</li>
          <li><strong>תקופת הדחייה:</strong> מגיל פרישה עד גיל ${NII.retirement_age_unconditional.value}.</li>
          <li><strong>תוספת מקסימלית לגבר:</strong> ${NII.deferral_bonus_max_male.value}% (3 שנות דחייה — מגיל ${NII.retirement_age_male.value} עד ${NII.retirement_age_unconditional.value}).</li>
          <li><strong>תוספת מקסימלית לאישה:</strong> עד ${NII.deferral_bonus_max_female.value}% (8 שנות דחייה — תלוי בגיל פרישה).</li>
          <li><strong>חשוב:</strong> תוספת הדחייה אינה משולמת בדיעבד — יש להגיש תביעה בזמן אמת.</li>
        </ul>

        <h3>1.7 דוגמאות חישוב מפורטות</h3>

        <h4>דוגמה 1: יחיד עם קצבה חלקית</h4>
        <div class="conditions-box">
          <p><strong>נתונים:</strong> דוד, בן ${NII.retirement_age_male.value}, יחיד, הכנסה מעבודה ₪11,500, ותק 25 שנים (${NII.seniority_bonus_max.value}%).</p>
          <ul>
            <li>קצבה בסיסית + ותק (${NII.seniority_bonus_max.value}%): ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_single_basic.value * NII.seniority_bonus_max.value / 100).toLocaleString('he-IL')} = <strong>₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')}</strong></li>
            <li>עודף הכנסה: ₪11,500 − ₪${NII.income_test_single_full.value.toLocaleString('he-IL')} = ₪${(11500 - NII.income_test_single_full.value).toLocaleString('he-IL')} → קיזוז ${NII.income_test_deduction_rate.value}%: ₪${Math.round((11500 - NII.income_test_single_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')}</li>
            <li>קצבה חלקית: ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')} − ₪${Math.round((11500 - NII.income_test_single_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')} = ₪${(Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)) - Math.round((11500 - NII.income_test_single_full.value) * NII.income_test_deduction_rate.value / 100)).toLocaleString('he-IL')}</li>
            <li>✅ <strong>לקבלה בפועל (אחרי ניכוי ביטוח בריאות ₪${NII.health_insurance_deduction_single.value.toLocaleString('he-IL')}): ₪${(Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)) - Math.round((11500 - NII.income_test_single_full.value) * NII.income_test_deduction_rate.value / 100) - NII.health_insurance_deduction_single.value).toLocaleString('he-IL')}</strong></li>
          </ul>
        </div>

        <h4>דוגמה 2: זוג שניהם זכאים</h4>
        <div class="conditions-box">
          <p><strong>נתונים:</strong> משה (68) הכנסה ₪8,000 ותק 20 שנים (40%); רחל (65) הכנסה ₪7,500 ותק 18 שנים (36%).</p>
          <div style="background:#e8f5e9;border-right:3px solid #43a047;padding:10px;margin:10px 0;border-radius:6px;">
            <p>📌 כל אחד נבחן בנפרד כ"יחיד" — הכנסת בן/בת הזוג אינה נכללת במבחן.</p>
          </div>
          <ul>
            <li>משה: ₪8,000 &lt; ₪${NII.income_test_single_full.value.toLocaleString('he-IL')} → קצבה מלאה | קצבה + ותק 40%: ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_single_basic.value * 0.4).toLocaleString('he-IL')} = <strong>₪${Math.round(NII.pension_single_basic.value * 1.4).toLocaleString('he-IL')}</strong></li>
            <li>רחל: ₪7,500 &lt; ₪${NII.income_test_single_full.value.toLocaleString('he-IL')} → קצבה מלאה | קצבה + ותק 36%: ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_single_basic.value * 0.36).toLocaleString('he-IL')} = <strong>₪${Math.round(NII.pension_single_basic.value * 1.36).toLocaleString('he-IL')}</strong></li>
            <li>✅ <strong>סה"כ: ₪${(Math.round(NII.pension_single_basic.value * 1.4) + Math.round(NII.pension_single_basic.value * 1.36)).toLocaleString('he-IL')} | אחרי ניכוי ₪${NII.health_insurance_deduction_single.value.toLocaleString('he-IL')} × 2 (ביטוח בריאות יחיד לכל אחד): ₪${(Math.round(NII.pension_single_basic.value * 1.4) + Math.round(NII.pension_single_basic.value * 1.36) - NII.health_insurance_deduction_single.value * 2).toLocaleString('he-IL')}</strong></li>
          </ul>
        </div>

        <h4>דוגמה 3: יחיד עם בן/בת זוג שאינם זכאים</h4>
        <div class="conditions-box">
          <p><strong>נתונים:</strong> יוסף (68), הכנסה ₪15,000, ותק 22 שנים (44%). אשתו (55) — אינה עובדת, הכנסתה ₪0.</p>
          <div style="background:#e8f5e9;border-right:3px solid #43a047;padding:10px;margin:10px 0;border-radius:6px;">
            <p>📌 הכנסת האשה ₪0 &lt; ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')} → מוכרת כ"בן זוג" → יוסף נבחן כנשוי.</p>
          </div>
          <div style="background:#fff3e0;border-right:3px solid #ff9800;padding:10px;margin:10px 0;border-radius:6px;">
            <p>⚠️ מעמד האשה לצורך ביטוח לאומי — אחד מאלה:</p>
            <ul style="margin:6px 0 0 20px;">
              <li><strong>עקרת בית</strong> — אינה משלמת דמי ביטוח לאומי כלל</li>
              <li><strong>"לא עובדת" (מבוטחת עצמאית)</strong> — משלמת ביטוח לאומי עצמאי מופחת</li>
            </ul>
          </div>
          <ul>
            <li>קצבה + תוספת בן/בת זוג + ותק 44%: ₪${NII.pension_couple_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_couple_basic.value * 0.44).toLocaleString('he-IL')} = ₪${Math.round(NII.pension_couple_basic.value * 1.44).toLocaleString('he-IL')}</li>
            <li>עודף: ₪15,000 − ₪${NII.income_test_married_full.value.toLocaleString('he-IL')} = ₪${(15000 - NII.income_test_married_full.value).toLocaleString('he-IL')} → קיזוז ${NII.income_test_deduction_rate.value}%: ₪${Math.round((15000 - NII.income_test_married_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')}</li>
            <li>קצבה חלקית: ₪${Math.round(NII.pension_couple_basic.value * 1.44).toLocaleString('he-IL')} − ₪${Math.round((15000 - NII.income_test_married_full.value) * NII.income_test_deduction_rate.value / 100).toLocaleString('he-IL')} = ₪${(Math.round(NII.pension_couple_basic.value * 1.44) - Math.round((15000 - NII.income_test_married_full.value) * NII.income_test_deduction_rate.value / 100)).toLocaleString('he-IL')}</li>
            <li>ניכוי ביטוח בריאות <strong>יחיד</strong> (של יוסף בלבד — האשה אינה מקבלת קצבה): ₪${NII.health_insurance_deduction_single.value.toLocaleString('he-IL')}</li>
            <li>✅ <strong>לקבלה: ₪${(Math.round(NII.pension_couple_basic.value * 1.44) - Math.round((15000 - NII.income_test_married_full.value) * NII.income_test_deduction_rate.value / 100) - NII.health_insurance_deduction_single.value).toLocaleString('he-IL')}</strong></li>
          </ul>
        </div>

        <h4>דוגמה 4: יחיד עם בן/בת זוג שעובד</h4>
        <div class="conditions-box">
          <p><strong>נתונים:</strong> אברהם (${NII.retirement_age_male.value}), הכנסה ₪10,000, ותק 25 שנים (${NII.seniority_bonus_max.value}%). אשתו (58) עובדת, מרוויחה ₪8,500.</p>
          <div style="background:#fff3e0;border-right:3px solid #ff9800;padding:10px;margin:10px 0;border-radius:6px;">
            <p>⚠️ הכנסת בת הזוג ₪8,500 &gt; ₪${NII.income_test_spouse_ceiling.value.toLocaleString('he-IL')} — בת הזוג אינה מוכרת כ"בן זוג" לצורך הקצבה. אברהם נבחן כ<strong>יחיד</strong>.</p>
          </div>
          <ul>
            <li>נבחנת הכנסת אברהם בלבד: ₪10,000 &lt; ₪${NII.income_test_single_full.value.toLocaleString('he-IL')} → <strong>קצבה מלאה</strong></li>
            <li>קצבת יחיד + ותק ${NII.seniority_bonus_max.value}%: ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_single_basic.value * NII.seniority_bonus_max.value / 100).toLocaleString('he-IL')} = ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')}</li>
            <li>✅ <strong>לקבלה: ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')} − ₪${NII.health_insurance_deduction_single.value.toLocaleString('he-IL')} (ביטוח בריאות) = ₪${(Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)) - NII.health_insurance_deduction_single.value).toLocaleString('he-IL')}</strong></li>
          </ul>
        </div>

        <h4>דוגמה 5: גבר עם ותק מקסימלי ודחיית קצבה</h4>
        <div class="conditions-box">
          <p><strong>נתונים:</strong> גבר בן ${NII.retirement_age_unconditional.value}, ותק 25 שנים, דחה קצבה 3 שנים בשל עבודה.</p>
          <ul>
            <li>קצבה + ותק ${NII.seniority_bonus_max.value}%: ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} + ₪${Math.round(NII.pension_single_basic.value * NII.seniority_bonus_max.value / 100).toLocaleString('he-IL')} = ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100)).toLocaleString('he-IL')}</li>
            <li>תוספת דחייה ${NII.deferral_bonus_max_male.value}%: +₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100) * NII.deferral_bonus_max_male.value / 100).toLocaleString('he-IL')}</li>
            <li>✅ <strong>סה"כ: ₪${Math.round(NII.pension_single_basic.value * (1 + NII.seniority_bonus_max.value / 100) * (1 + NII.deferral_bonus_max_male.value / 100)).toLocaleString('he-IL')} לחודש</strong></li>
          </ul>
        </div>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 2. גמלת השלמת הכנסה
    // ─────────────────────────────────────────────────────────────────────
    income_supplement: {
      contentFn: (NII) => {
        const c = key => NII[key] ? '₪' + NII[key].value.toLocaleString('he-IL') : '—';
        const v = key => NII[key] ? NII[key].value : 0;
        const fmt = num => Math.round(num).toLocaleString('he-IL');
        const p = key => NII[key] ? NII[key].value + '%' : '—';
        return `
        <p>השלמת הכנסה ניתנת למי שהכנסותיו נמוכות ומיועדת להבטיח רמת חיים מינימלית.</p>
        <a href="https://www.kolzchut.org.il/he/%D7%AA%D7%95%D7%A1%D7%A4%D7%AA_%D7%94%D7%A9%D7%9C%D7%9E%D7%AA_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%A7%D7%A6%D7%91%D7%AA_%D7%96%D7%99%D7%A7%D7%A0%D7%94#.D7.9E.D7.99_.D7.96.D7.9B.D7.90.D7.99.3F" target="_blank" class="link-item">🏛️  השלמת הכנסה - כל זכות. כל המידע על השלמת הכנסה</a>

           <h3>תנאי זכאות בסיסיים</h3>
                <p>כדי להיות זכאי להשלמת הכנסה מלאה, על המבקש לעמוד בארבעה תנאים מצטברים:</p>
                <ol>
                    <li><strong>קבלת קצבת אזרח ותיק:</strong> המבקש זכאי לקצבה מהביטוח הלאומי.</li>
                   <li><strong>תושבות:</strong> תושב ישראל ב-24 החודשים האחרונים.</li>
                    <li><strong>מבחן הכנסות:</strong> סך ההכנסות (מפנסיה, עבודה, נכסים וכו') אינו עולה על "ההכנסה המקסימלית" המזכה.</li>
                    <li><strong>מבחן נכסים ורכב:</strong> בבעלות המבקש אין נכסים (מלבד דירת מגורים שבה גר המבוטח) או רכב מעל שווי מסוים (${c('vehicle_threshold_base')}).</li>
                    <li><strong>הערה:</strong> הכנסות או נכסים מעל התקרה, יתכן ויאפשרו קבלת השלמת הכנסה חלקית.</li>

                    </ol>

                <h3>זכאות זוגית: שני תרחישים מרכזיים</h3>

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


        <h3>סכומים מירביים קצבת זיקנה + השלמת הכנסה 2026</h3>
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

        
        <h3>תקרות הכנסה וחישוב זכאות</h3>
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

        <h4>בעלות על רכב</h4>
                <p>בעלות על רכב עלולה לשלול זכאות, אלא אם מתקיים אחד מהתנאים הבאים:</p>
                <ul>
                    <li>שווי הרכב נמוך מ-${c('vehicle_threshold_base')} (והוא הרכב היחיד).</li>
                    <li>הרכב משמש לצרכים רפואיים (נכות של המבוטח או בן משפחה).</li>
                    <li>המבוטח עובד ומשתכר מעל סכום מסוים וזקוק לרכב כדי להגיע לעבודה.</li>
                </ul>
        <a href="questionnaire.html?id=vehicle-income-supplement" target="_blank" class="link-item" style="display:inline-block; margin-top:10px; font-size:1.1rem; font-weight:700; background: linear-gradient(135deg, #667eea, #764ba2); color:white; border-radius:12px; padding:12px 20px; text-decoration:none;">🚗 מחשבון להשפעת רכב על זכאות השלמת הכנסה</a>

        <h3>דוגמאות לחישוב השלמת הכנסה</h3>

        <div style="background: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>דוגמה 1 - יחיד:</h4>
          <ul>
            <li>קצבת זקנה: ${c('pension_single_basic')}</li>
            <li>פנסיה: ₪2,500</li>
            <li>חישוב: פנסיה עודפת = 2,500 - ${v('pension_income_exempt_single')} = ₪${fmt(2500 - v('pension_income_exempt_single'))}</li>
            <li>קיזוז: 100% × ${fmt(2500 - v('pension_income_exempt_single'))} = ₪${fmt(2500 - v('pension_income_exempt_single'))}</li>
            <li>השלמה: ${v('income_supplement_single_under70')} - ${v('pension_single_basic')} - ${fmt(2500 - v('pension_income_exempt_single'))} = ₪${fmt(v('income_supplement_single_under70') - v('pension_single_basic') - (2500 - v('pension_income_exempt_single')))}</li>
            <li><strong>סה"כ הכנסה: ₪${fmt(v('pension_single_basic') + 2500 + v('income_supplement_single_under70') - v('pension_single_basic') - (2500 - v('pension_income_exempt_single')))}</strong></li>
          </ul>
        </div>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>דוגמה 2 - זוג:</h4>
          <ul>
            <li>קצבת זקנה לכל אחד: ${c('pension_single_basic')} + ${p('seniority_bonus_max')} ותק = ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100))} (סה"כ ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2)})</li>
            <li>הכנסה מעבודה: ₪4,200</li>
            <li>חישוב: הכנסה עודפת = 4,200 - ${v('work_income_exempt_couple')} = ₪${fmt(4200 - v('work_income_exempt_couple'))}</li>
            <li>קיזוז: ${p('income_test_deduction_rate')} × ${fmt(4200 - v('work_income_exempt_couple'))} = ₪${fmt((4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</li>
            <li>השלמה: ${v('income_supplement_couple_under70')} - ${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2)} - ${fmt((4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)} = ₪${fmt(v('income_supplement_couple_under70') - v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2 - (4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</li>
            <li><strong>סה"כ הכנסה: ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2)} (קצבות) + ₪4,200 (עבודה) + ₪${fmt(v('income_supplement_couple_under70') - v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2 - (4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)} (השלמה) = ₪${fmt(v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2 + 4200 + v('income_supplement_couple_under70') - v('pension_single_basic') * (1 + v('seniority_bonus_max') / 100) * 2 - (4200 - v('work_income_exempt_couple')) * v('income_test_deduction_rate') / 100)}</strong></li>
          </ul>
        </div>

        <h3>🎁 הטבות נלוות להשלמת הכנסה</h3>
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
      }
    },

    // ─────────────────────────────────────────────────────────────────────
    // 3. גמלת סיעוד
    // ─────────────────────────────────────────────────────────────────────
    nursing: {
      contentFn: (NII) => `
        <a href="https://www.kolzchut.org.il/he/%D7%92%D7%9E%D7%9C%D7%AA_%D7%A1%D7%99%D7%A2%D7%95%D7%93" target="_blank" class="link-item">🔗 פורטל גמלת סיעוד — כל זכות</a>
        <p>גמלת סיעוד מיועדת לאזרחים ותיקים הזקוקים לעזרה בפעולות יומיומיות.</p>

        <h3>3.1 תנאי זכאות</h3>
        <ul>
          <li>אזרח ישראל ותושב ישראל.</li>
          <li>גיל: 65+ (נשים — לפי גיל פרישה; גברים — ${NII.retirement_age_male.value}), או 60+ במקרים מיוחדים של מחלות קשות.</li>
          <li>תלות בעזרת הזולת לפעולות יומיומיות (רחצה, אכילה, לבוש וכו').</li>
          <li>עמידה במבחן הכנסות (עבור גמלה מלאה לעומת חצי גמלה).</li>
        </ul>

        <h3>3.2 רמות גמלת הסיעוד 2026</h3>
        <div class="conditions-box"><p>⬆️ גמלאות סיעוד עלו ב-${NII.cpi_rate_2026.value}% בינואר 2026</p></div>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">רמה</th>
            <th style="padding:10px;border:1px solid #ddd;">נקודות תלות</th>
            <th style="padding:10px;border:1px solid #ddd;">שעות שבועיות</th>
            <th style="padding:10px;border:1px solid #ddd;">שווי בכסף</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">1 (קלה)</td><td style="padding:9px;border:1px solid #ddd;">2.5–3</td><td style="padding:9px;border:1px solid #ddd;">5.5</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_1_cash.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">2</td><td style="padding:9px;border:1px solid #ddd;">3.5–4.5</td><td style="padding:9px;border:1px solid #ddd;">10</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_2_cash.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">3</td><td style="padding:9px;border:1px solid #ddd;">5–6</td><td style="padding:9px;border:1px solid #ddd;">15</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_3_cash.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">4</td><td style="padding:9px;border:1px solid #ddd;">6.5–7.5</td><td style="padding:9px;border:1px solid #ddd;">21 (18 עם עובד זר)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_4_cash.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">5</td><td style="padding:9px;border:1px solid #ddd;">8–9</td><td style="padding:9px;border:1px solid #ddd;">26 (22 עם עובד זר)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_5_cash.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">6 (קשה)</td><td style="padding:9px;border:1px solid #ddd;">9.5+</td><td style="padding:9px;border:1px solid #ddd;">30 (26 עם עובד זר)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.nursing_level_6_cash.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <p><strong>חצי גמלה (עקב מבחן הכנסות):</strong> דרגה 1: ₪${Math.round(NII.nursing_level_1_cash.value / 2).toLocaleString('he-IL')} | דרגה 6: ₪${Math.round(NII.nursing_level_6_cash.value / 2).toLocaleString('he-IL')}</p>

        <h3>3.3 מבחן הכנסות לגמלת סיעוד</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מצב משפחתי</th>
            <th style="padding:10px;border:1px solid #ddd;">גמלה מלאה</th>
            <th style="padding:10px;border:1px solid #ddd;">גמלה בהיקף חצי</th>
            <th style="padding:10px;border:1px solid #ddd;">ללא זכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">יחיד/ה</td><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.nursing_income_test_full_single.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.nursing_income_test_full_single.value.toLocaleString('he-IL')}–₪${NII.nursing_income_test_half_single.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.nursing_income_test_half_single.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">זוג</td><td style="padding:9px;border:1px solid #ddd;">עד ₪${NII.nursing_income_test_full_couple.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.nursing_income_test_full_couple.value.toLocaleString('he-IL')}–₪${NII.nursing_income_test_half_couple.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">מעל ₪${NII.nursing_income_test_half_couple.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h3>3.4 אפשרויות מימוש הגמלה</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">אפשרות</th>
            <th style="padding:10px;border:1px solid #ddd;">תיאור</th>
            <th style="padding:10px;border:1px solid #ddd;">רמות זכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">מטפל/ת בבית</td><td style="padding:9px;border:1px solid #ddd;">שעות טיפול מטעם ספקי סיעוד מורשים</td><td style="padding:9px;border:1px solid #ddd;">כל הרמות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">גמלה בכסף</td><td style="padding:9px;border:1px solid #ddd;">תשלום ישיר לחשבון הבנק</td><td style="padding:9px;border:1px solid #ddd;">רמה 1 מלא, 2–3 חלקי</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">גמלה משולבת</td><td style="padding:9px;border:1px solid #ddd;">חלק שעות + חלק כסף</td><td style="padding:9px;border:1px solid #ddd;">רמות 2–3</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">עובד זר</td><td style="padding:9px;border:1px solid #ddd;">היתר להעסקת עובד זר + השתתפות כספית</td><td style="padding:9px;border:1px solid #ddd;">רמות 5–6</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מרכז יום</td><td style="padding:9px;border:1px solid #ddd;">ימי פעילות במרכז יום לקשישים</td><td style="padding:9px;border:1px solid #ddd;">כל הרמות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">דיור מוגן</td><td style="padding:9px;border:1px solid #ddd;">השתתפות בעלות דיור מוגן</td><td style="padding:9px;border:1px solid #ddd;">כל הרמות</td></tr>
          </tbody>
        </table>
        <div class="conditions-box"><p>גמלת סיעוד יכולה להינתן גם בשירותים: מטפל סיעודי, שירותי כביסה, לחצן מצוקה, מרכז יום ועוד.</p></div>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 4. גמלת נכות כללית וקצבת שירותים מיוחדים
    // ─────────────────────────────────────────────────────────────────────
    disability: {
      contentFn: (NII) => `
        <h3>4.1 גמלת נכות כללית</h3>
        <p>גמלת נכות כללית ניתנת למי שכושר השתכרותו נפגע עקב נכות רפואית.</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">דרגת אי-כושר</th>
            <th style="padding:10px;border:1px solid #ddd;">קצבה בסיסית</th>
            <th style="padding:10px;border:1px solid #ddd;">תוספת בן/זוג</th>
            <th style="padding:10px;border:1px solid #ddd;">תוספת ילד</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">מלאה (100% / 75%)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disability_full.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_spouse.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_child.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">חלקית 74%</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disability_74.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_spouse_74.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_child_74.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">חלקית 65%</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disability_65.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_spouse_65.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_child_65.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">חלקית 60%</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disability_60.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_spouse_60.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.disability_child_60.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <div class="conditions-box"><p>תוספת בן/בת זוג: בתנאי שהכנסותיו עד ₪${NII.disability_spouse_income_ceiling.value.toLocaleString('he-IL')} ברוטו בחודש ואינו מקבל קצבה אחרת.</p></div>

        <h3>4.2 מעבר מנכות כללית לקצבת זקנה</h3>
        <ul>
          <li>המעבר מתבצע <strong>באופן אוטומטי</strong> ללא צורך בהגשת תביעה.</li>
          <li>קצבת הזקנה לנכה לא תפחת מגמלת הנכות שקיבל לפני כן.</li>
          <li>אם גמלת הנכות הייתה גבוהה יותר — היא תישמר.</li>
          <li>יש לבדוק זכאות לתוספת ותק שעשויה להגדיל את הקצבה.</li>
          <li>תוספות בני משפחה ממשיכות על פי הזכאות.</li>
        </ul>

        <h3>4.3 קצבת שירותים מיוחדים (שר"מ)</h3>
        <p>ניתנת למי שזקוק לעזרת הזולת באופן משמעותי עקב נכות.</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">דרגה</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">50%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_50.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">65%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_65.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">75%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_75.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">100%</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.special_services_100.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">112%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_112.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">188%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_188.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">235%</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_235.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תוספת מונשם</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.special_services_ventilated.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">188% + תוספת 2 מטפלים</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.special_services_188_2caregivers.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h3>4.4 גמלת ילד נכה</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">סוג הגמלה</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי 2026</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">ילד עם נכות 100%</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disabled_child_100.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תוספת לילד נכה מונשם</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.disabled_child_ventilated.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h3>4.5 מעבר משר"מ לגמלת סיעוד</h3>
        <div style="background:#fff3e0;border-right:4px solid #ff9800;padding:15px;margin:15px 0;border-radius:8px;">
          <p>⚠️ <strong>חשוב מאוד!</strong> מקבלי קצבת שירותים מיוחדים שמגיעים לגיל הזכאות לגמלת סיעוד עוברים לגמלת סיעוד:</p>
        </div>
        <ul>
          <li><strong>גיל הזכאות לגמלת סיעוד:</strong> נשים 62–65 (לפי שנת לידה), גברים ${NII.retirement_age_male.value}.</li>
          <li><strong>המעבר דורש הגשת תביעה לגמלת סיעוד — לא אוטומטי!</strong></li>
          <li>יש להגיש תביעה <strong>3 חודשים לפני</strong> הגיע לגיל הזכאות.</li>
          <li>תיערך הערכה סיעודית חדשה (מבחן ADL).</li>
          <li>לרוב מקבלי שר"מ בדרגה גבוהה מקבלים רמות סיעוד גבוהות.</li>
        </ul>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 5. קצבת שארים
    // ─────────────────────────────────────────────────────────────────────
    survivors: {
      contentFn: (NII) => `
        <p>קצבת שארים היא קצבה חודשית המשולמת לשאירים של תושב ישראל שנפטר — להבטיח אמצעי קיום מינימליים לאלמנות, אלמנים ויתומים.</p>

        <h3>5.1 מי זכאי?</h3>
        <ul>
          <li><strong>אלמנה/אלמן</strong> — בן/בת זוג של הנפטר (כולל ידועים בציבור).</li>
          <li><strong>יתומים</strong> — ילדי הנפטר (כולל ילדים חורגים, מאומצים, נכדים שהנפטר פרנס).</li>
          <li><strong>הורים תלויים</strong> — במקרים מסוימים.</li>
        </ul>

        <h3>5.2 גיל זכאות ליתום</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">גיל עד</th>
            <th style="padding:10px;border:1px solid #ddd;">תנאי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">18</td><td style="padding:9px;border:1px solid #ddd;">לכל הילדים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">20</td><td style="padding:9px;border:1px solid #ddd;">לומד במוסד חינוך על-יסודי או בעל לקות למידה במסגרת מוכרת</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">21</td><td style="padding:9px;border:1px solid #ddd;">משרת בהתנדבות למטרה ציבורית (עד 12 חודשים)</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">24</td><td style="padding:9px;border:1px solid #ddd;">משרת בצה"ל, שירות לאומי או לומד בעתודה</td></tr>
          </tbody>
        </table>

        <h3>5.3 תנאי זכאות עיקריים</h3>

        <h4>1. הנפטר היה תושב ישראל בעת פטירתו</h4>
        <ul>
          <li><strong>נפטר שנולד בחו"ל:</strong> אם עלה לארץ לפני גיל 60–62 — מבוטח בביטוח שאירים. אם עלה לאחר גיל זה — אינו מבוטח, אך האלמנה עשויה להיות זכאית לגמלת שאירים מיוחדת.</li>
          <li><strong>נפטרת (אישה):</strong> תושבת ישראל שעלתה לפני גיל 60–62, ו-הייתה מבוטחת (עובדת / בעלה מבוטח / קצבת נכות / עגונה).</li>
        </ul>

        <h4>2. הנפטר השלים תקופת אכשרה</h4>
        <ul>
          <li>12 חודשים אחרונים לפני הפטירה, <strong>או</strong></li>
          <li>24 חודשים (רצופים או לא) ב-5 השנים האחרונות, <strong>או</strong></li>
          <li>60 חודשים ב-10 השנים האחרונות, <strong>או</strong></li>
          <li>144 חודשים (12 שנים) בכל תקופה, <strong>או</strong></li>
          <li>60 חודשים מיום שנעשה תושב ישראל.</li>
        </ul>
        <div class="conditions-box">
          <p><strong>חריגים שאינם מחייבים תקופת אכשרה:</strong> נפטר תוך שנה מיום שנעשה תושב ישראל, או היה מקבל קצבת זקנה/נכות בעת הפטירה.</p>
        </div>

        <h4>3. אין פיגור בתשלום דמי ביטוח</h4>
        <ul>
          <li>אם הנפטר פיגר — השאירים עלולים להפסיד הקצבה או לקבל קצבה מופחתת.</li>
          <li>אם <strong>המעסיק</strong> פיגר — קצבת השאירים לא נפגעת.</li>
        </ul>

        <h4>4. תנאים מיוחדים לאלמן (ללא ילדים)</h4>
        <p>אלמן ללא ילדים זכאי לקצבה <strong>רק אם</strong> הכנסותיו אינן עולות על <strong>₪${NII.survivors_income_test_no_dependents.value.toLocaleString('he-IL')} ברוטו לחודש</strong>.</p>

        <h3>5.4 מה נספר במבחן הכנסות לאלמן?</h3>

        <h4>הכנסות שנלקחות בחשבון</h4>
        <ul>
          <li>הכנסה מעבודה (שכיר/עצמאי) — עם הפחתה של ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</li>
          <li>פנסיה — עם הפחתה של ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</li>
          <li>קופת גמל (תשלום חודשי) — עם הפחתה של ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</li>
          <li>קצבת זקנה — נספרת במלואה</li>
          <li>השלמת הכנסה — נספרת במלואה</li>
          <li>הכנסות משכירות או ריבית — נספרות במלואה</li>
        </ul>

        <h4>הכנסות פטורות ממבחן</h4>
        <ul>
          <li>✅ קצבת סיעוד — פטורה לחלוטין</li>
          <li>✅ גמלת ניידות — פטורה</li>
          <li>✅ קצבת ילדים — פטורה</li>
          <li>✅ גמלת ילד נכה — פטורה</li>
          <li>✅ קצבת שירותים מיוחדים — פטורה</li>
          <li>✅ דמי מחיה לשאירים — פטורים</li>
          <li>✅ תגמולי ניידות ממשרד הביטחון — פטורים</li>
        </ul>

        <h3>5.5 סכומי קצבת שארים 2026</h3>
        <div class="conditions-box"><p>⬆️ קצבת שארים עלתה ב-${NII.cpi_rate_2026.value}% בינואר 2026</p></div>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מעמד</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">בסיסי</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_widow_over50.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">עם תוספת ותק (50%)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${Math.round(NII.survivors_widow_over50.value * 1.5).toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תוספת לכל ילד</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_orphan.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה ללא ילדים, גיל 40–50</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_widow_40_49.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה ללא ילדים, גיל 50+</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_widow_over50.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">יתום מאב או מאם</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_orphan.value.toLocaleString('he-IL')} לכל ילד</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">יתום משני הורים</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.orphan_both_parents_first.value.toLocaleString('he-IL')} לכל ילד</td></tr>
          </tbody>
        </table>

        <h3>5.6 דמי מחיה ליתומים</h3>
        <ul>
          <li>יתומים הלומדים לפחות 24 שעות שבועיות מכיתה ט' עד גיל 20 זכאים לדמי מחיה.</li>
          <li>אם להורה משולמת קצבת שאירים — דמי המחיה כלולים בקצבה.</li>
          <li>אם להורה לא משולמת קצבת שאירים — דמי מחיה: <strong>₪${NII.livelihood_allowance_9.value.toLocaleString('he-IL')}</strong>.</li>
        </ul>

        <h3>5.7 מענקים נוספים</h3>
        <ul>
          <li><strong>מענק פטירה:</strong> כשאין זכאות לקצבת שאירים — עשוי להינתן מענק חד-פעמי של 36 קצבאות חודשיות.</li>
          <li><strong>מענק בר/בת מצווה</strong> — ליתומים.</li>
        </ul>

        <h3>5.8 קצבאות סותרות ומצבים מיוחדים</h3>

        <h4>שילוב קצבת שאירים עם קצבת זקנה</h4>
        <ul>
          <li>אם צברו תקופת ביטוח כנדרש — זכאים ל<strong>קצבת זקנה מלאה + מחצית קצבת שאירים</strong>.</li>
          <li>אם לא צברו — יקבלו מלוא קצבת שאירים (אך לא קצבת זקנה).</li>
        </ul>

        <h4>אי אפשר לקבל שאירים + נכות כללית</h4>
        <div style="background:#fff3e0;border-right:4px solid #ff9800;padding:12px;margin:10px 0;border-radius:6px;">
          <p>⚠️ אי אפשר לקבל קצבת שאירים ביחד עם קצבת נכות כללית — יש לבחור. מומלץ להשתמש במחשבוני הביטוח הלאומי.</p>
        </div>

        <h4>נישואין מחדש</h4>
        <ul>
          <li>אלמנות/אלמנים שנישאו מחדש — <strong>לא זכאים</strong> יותר לקצבת שאירים.</li>
          <li><strong>מענק נישואין:</strong> 18 קצבאות לאחר הנישואין + 18 נוספות כעבור שנתיים.</li>
          <li><strong>חזרה לזכאות:</strong> אם הנישואין הסתיימו לפני תום 10 שנים — הקצבה חוזרת.</li>
        </ul>

        <h4>פטירה עקב תאונת עבודה / פעולות איבה / תאונת דרכים</h4>
        <ul>
          <li>❌ אין זכאות לקצבת שאירים מהביטוח הלאומי.</li>
          <li>✅ השאירים זכאים לפיצוי/קצבה מהגוף הרלוונטי.</li>
        </ul>

        <h3>5.9 הגשת תביעה</h3>
        <div style="background:#fff3e0;border-right:4px solid #ff9800;padding:12px;margin:10px 0;border-radius:6px;">
          <p>⏰ <strong>חובה להגיש תוך 12 חודשים מיום הפטירה!</strong> תביעה מאוחרת — ניתן לקבל רטרואקטיבית לתקופה של עד 12 חודשים.</p>
        </div>
        <ul>
          <li>מילוי <strong>טופס 410</strong> — תביעה לקצבת שאירים.</li>
          <li>מסמכים: תעודת פטירה, תעודות זהות, אישורי הכנסה.</li>
          <li>הגשה: אתר הביטוח הלאומי / דואר / תיבת שירות / סניף.</li>
        </ul>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מצב</th>
            <th style="padding:10px;border:1px solid #ddd;">מועד תחילת תשלום</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">הנפטר קיבל קצבת זקנה או נכות</td><td style="padding:9px;border:1px solid #ddd;">ה-1 בחודש שלאחר חודש הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לא קיבל קצבה; שאיריו זכאים להשלמת הכנסה</td><td style="padding:9px;border:1px solid #ddd;">ה-1 בחודש הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לא קיבל קצבה; פטירה עד ה-15 בחודש</td><td style="padding:9px;border:1px solid #ddd;">ה-1 בחודש הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לא קיבל קצבה; פטירה מה-16 ואילך</td><td style="padding:9px;border:1px solid #ddd;">ה-1 בחודש שלאחר הפטירה</td></tr>
          </tbody>
        </table>
        <p>הקצבה משולמת ב-<strong>28 בכל חודש</strong>.</p>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 6. מענק מעבר לנשים בגיל 62
    // ─────────────────────────────────────────────────────────────────────
    transition_grant: {
      contentFn: (NII) => `
        <p>בעקבות העלאת גיל הפרישה לנשים, נשים שנולדו בין ינואר 1960 לדצמבר 1966 עשויות להיות זכאיות למענק מעבר.</p>
        <p><strong>מטרת המענק:</strong> לסייע לנשים בפרק הזמן שבין גיל 62 ועד לקבלת קצבת אזרח ותיק.</p>

        <h3>6.1 משך התשלום</h3>
        <ul>
          <li>המענק משולם לתקופה של <strong>4 חודשים לכל היותר</strong>.</li>
          <li>התשלום מתחיל מהחודש שבו מלאו לאישה <strong>62 שנים</strong>.</li>
          <li>התנאים נבדקים בכל אחד מ-4 חודשי הזכאות.</li>
        </ul>

        <h3>6.2 תנאי זכאות למענק</h3>

        <h4>גיל ושנת לידה</h4>
        <p>נשים שנולדו בין ינואר 1960 לדצמבר 1966.</p>

        <h4>היעדר הכנסות מעבודה</h4>
        <p>אסור שיהיו הכנסות כשכירה או כעצמאית מגיל 62 ועד גיל 62 ו-4 חודשים.</p>

        <h4>מגבלה על הכנסות מפנסיה וקצבאות</h4>
        <p>הכנסה מפנסיה, תגמולים או קצבאות לא יכולה לעלות על <strong>₪${NII.transition_grant_income_allowed.value.toLocaleString('he-IL')} לחודש</strong>.</p>

        <h4>מגבלה על הכנסות שלא מעבודה</h4>
        <p>הכנסה שנתית שלא מעבודה (משכירות, ריבית, מענקי פרישה) לא יכולה לעלות על <strong>₪${NII.transition_grant_annual_income_limit.value.toLocaleString('he-IL')}</strong> בשנת המס שבה מלאו לאישה 61 שנים.</p>

        <h4>תקופת ביטוח — אחד מהתנאים</h4>
        <ul>
          <li>✅ 60 חודשי ביטוח (5 שנים) מגיל 52, <strong>או</strong></li>
          <li>✅ 144 חודשי ביטוח (12 שנים) מגיל 18.</li>
        </ul>

        <h4>אין קבלת קצבאות אחרות</h4>
        <ul>
          <li>❌ קצבת הבטחת הכנסה</li>
          <li>❌ דמי מזונות</li>
          <li>❌ קצבת נכות כללית</li>
          <li>❌ דמי אבטלה</li>
          <li>❌ דמי אבטלה מוגדלים (300 ימים)</li>
          <li>❌ שהות בחופשה ללא תשלום (חל"ת) מרצון</li>
        </ul>

        <h3>6.3 סכום המענק</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">שנת לידה</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום מקסימלי לחודש</th>
            <th style="padding:10px;border:1px solid #ddd;">סה"כ ל-4 חודשים</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">1960–1962</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.transition_grant_max.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${(NII.transition_grant_max.value * 4).toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1963</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.transition_grant_1963.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${(NII.transition_grant_1963.value * 4).toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1964</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.transition_grant_1964.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${(NII.transition_grant_1964.value * 4).toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1965</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.transition_grant_1965.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${(NII.transition_grant_1965.value * 4).toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1966</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.transition_grant_min.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;">₪${(NII.transition_grant_min.value * 4).toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h3>6.4 הגשת בקשה למענק</h3>
        <ul>
          <li><strong>מועד הגשה:</strong> ניתן להגיש את הבקשה עד גיל 64.</li>
          <li>✅ מילוי טופס בסניף מחלקת אזרח ותיק.</li>
          <li>✅ שליחת מסמכים דרך שירות שליחת מסמכים של הביטוח הלאומי.</li>
        </ul>
        <a href="https://www.btl.gov.il/benefits/old_age/MankMavrATR/Pages/BksaMankMavr.aspx" target="_blank" class="link-item">🔗 הגשת בקשה למענק מעבר — BTL</a>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 7. זכויות ניצולי שואה
    // ─────────────────────────────────────────────────────────────────────
    holocaust_survivors: {
      contentFn: (NII) => `
        <a href="https://www.btl.gov.il/benefits/Long_Term_Care/Pages/nitzoleShoaa.aspx" target="_blank" class="link-item">🔗 ניצולי שואה — תוספת שעות סיעוד — BTL</a>
        <a href="https://www.kolzchut.org.il/he/%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA_%D7%A0%D7%99%D7%A6%D7%95%D7%9C%D7%99_%D7%A9%D7%95%D7%90%D7%94" target="_blank" class="link-item">🔗 פורטל זכויות ניצולי השואה — כל זכות</a>

        <h3>7.1 מי נחשב ניצול שואה?</h3>
        <ul>
          <li>יהודי שהיה בגטו, במחנה ריכוז, במחבוא או בהסתתרות בתקופת השואה.</li>
          <li>יהודי שנמלט מאזור שהיה תחת שלטון נאצי.</li>
          <li>יהודי שהיה בברית המועצות בתקופת המלחמה.</li>
          <li>יהודי שהיה בארצות שסבלו מרדיפות נאציות (צפון אפריקה, עיראק וכו').</li>
        </ul>

        <h3>7.2 קצבאות ומענקים</h3>
        <ul>
          <li><strong>מענק שנתי:</strong> ₪${NII.holocaust_annual_grant.value.toLocaleString('he-IL')} (למי שלא מקבלים רנטה חודשית).</li>
          <li><strong>רנטה גרמנית (BEG):</strong> תשלום חודשי משתנה + תוספת 100–400 יורו.</li>
          <li><strong>קרן סעיף 2:</strong> כ-€2,000 לרבעון.</li>
          <li><strong>תשלום שנתי ועידת התביעות 2026:</strong> ₪${NII.holocaust_claims_conference_monthly.value.toLocaleString('he-IL')} (€${NII.holocaust_claims_conference_euro.value.toLocaleString('he-IL')}) — לזכאי קרן הסיוע.</li>
          <li><strong>יוצאי רומניה/בולגריה:</strong> זכאים לקצבה מיוחדת — לבירור פנה לרשות לזכויות ניצולי השואה: *5105.</li>
          <li><strong>תוספת חודשית לקצבת זקנה לניצולי שואה:</strong> כ-₪4,200 — משולמת אוטומטית למוכרים כניצולי שואה.</li>
          <li><strong>קצבת שארים מיוחדת:</strong> אלמן/ת של ניצול שואה זכאי/ת לקצבת שארים מוגדלת הכוללת את התוספת המיוחדת.</li>
        </ul>

        <h3>7.3 תוספת שעות סיעוד לניצולי שואה</h3>

        <h4>תנאי הזכאות לתוספת ${NII.holocaust_nursing_hours_count.value} שעות סיעוד שבועיות</h4>
        <ul>
          <li>הכרה כניצול שואה ע"י: הרשות לזכויות ניצולי השואה / ועידת התביעות / BEG.</li>
          <li>זכאות לגמלת סיעוד מלאה (לא מופחתת) מהביטוח הלאומי.</li>
          <li>רמה 3 עם 6 נקודות תלות ומעלה, או רמות 4–6 — בגמלה מלאה.</li>
          <li><strong>או:</strong> קצבת שר"מ בהיקף 112% ומעלה.</li>
          <li><strong>או:</strong> עזרה לזולת ממשרד הביטחון — 66 שעות חודשיות ומעלה.</li>
          <li><strong>גיל:</strong> 80 שנים ומעלה.</li>
          <li><strong>נקודות תלות:</strong> מינימום 2 נקודות במבחן ADL.</li>
        </ul>

        <h4>אופן קבלת התוספת</h4>
        <div class="conditions-box">
          <p><strong>מימוש אוטומטי — אין צורך להגיש בקשה!</strong> הביטוח הלאומי מעביר פרטי הזכאים לקרן מדי חודש, והקרן פונה לזכאי לתיאום השירות.</p>
        </div>
        <ul>
          <li><strong>שעות טיפול בבית:</strong> ${NII.holocaust_nursing_hours_count.value} שעות שבועיות מספק מורשה.</li>
          <li><strong>תשלום בכסף:</strong> ₪${NII.holocaust_nursing_hours_9_value.value.toLocaleString('he-IL')} לחודש (רק למי שמקבל גמלה בכסף מהביטוח הלאומי).</li>
        </ul>

        <h4>תוספת חלקית לניצולים עם פחות נקודות</h4>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">נקודות תלות</th>
            <th style="padding:10px;border:1px solid #ddd;">זכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">5–5.5 נקודות</td><td style="padding:9px;border:1px solid #ddd;">סיוע כספי ₪${NII.holocaust_nursing_partial_5_5.value.toLocaleString('he-IL')} לחודש</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">6 נקודות + גמלה מופחתת</td><td style="padding:9px;border:1px solid #ddd;">סיוע כספי ₪${NII.holocaust_nursing_reduced_income.value.toLocaleString('he-IL')} לחודש</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1.5–2 נקודות (לא זכאים לסיעוד)</td><td style="padding:9px;border:1px solid #ddd;">סיוע כספי ₪${NII.holocaust_nursing_1_5_2.value.toLocaleString('he-IL')} לחודש</td></tr>
          </tbody>
        </table>
        <div class="conditions-box"><p>שוויה של שעת סיעוד שבועית אחת הוא ₪${NII.holocaust_nursing_hour_rate.value.toLocaleString('he-IL')} בחודש.</p></div>

        <h3>7.4 סיוע סיעודי קצר מועד (סול"ם)</h3>
        <p>לניצולי שואה המתגוררים בקהילה, ללא חוק סיעוד, ונמצאים במצב חולי/משבר:</p>

        <h4>לאחר אשפוז</h4>
        <ul>
          <li>עד 50 שעות סיעוד למשך חודשיים.</li>
          <li>הגשת בקשה דרך עו"ס בבית החולים בלבד.</li>
          <li>תנאי: הכנסה עד ₪${NII.holocaust_solem_income_ceiling.value.toLocaleString('he-IL')} (לא כולל רנטות).</li>
        </ul>

        <h4>סול"ם בקהילה (ללא אשפוז)</h4>
        <ul>
          <li>עד 50 שעות למשך חודשיים.</li>
          <li>הגשת בקשה דרך עו"ס בקופת חולים.</li>
          <li>פעם אחת בשנה לכל ניצול.</li>
        </ul>

        <h3>7.5 הטבות נוספות לניצולי שואה</h3>
        <ul>
          <li>✅ תרופות ללא תשלום</li>
          <li>✅ טיפול פסיכולוגי ללא תשלום</li>
          <li>✅ פטור מתשלום דמי ביטוח בריאות</li>
          <li>✅ סל שירותים מורחב בקופות החולים</li>
          <li>✅ עדיפות בקבלת שירותי סיעוד</li>
          <li>✅ הנחות בארנונה (לפי החלטת הרשות המקומית)</li>
          <li>✅ הנחות בתחבורה ציבורית</li>
          <li>✅ סיוע בטיפולי שיניים</li>
          <li>✅ מענקים לציוד רפואי</li>
          <li>✅ השתתפות בטיולים ופעילויות תרבות</li>
          <li>✅ סיוע בתשלום שכר דירה</li>
        </ul>

        <h3>7.6 פרטי קשר — ניצולי שואה</h3>
        <ul>
          <li><strong>הקרן לרווחת נפגעי השואה:</strong> 03-6090866</li>
          <li><strong>ועידת התביעות (לגמלה בכסף):</strong> 03-5194401</li>
          <li><strong>הרשות לזכויות ניצולי השואה:</strong> *5105 או 03-5682651</li>
          <li><strong>ארגון נכי המלחמה בנאצים:</strong> 03-6838282 | דרך מנחם בגין 132, תל אביב</li>
        </ul>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 8. הטבות נוספות
    // ─────────────────────────────────────────────────────────────────────
    additional_benefits: {
      content: `
        <h3>8.1 הנחות בארנונה</h3>
        <ul>
          <li><strong>גיל 70+:</strong> הנחה של 25% (משתנה לפי רשות מקומית).</li>
          <li><strong>ניצולי שואה:</strong> הנחות נוספות.</li>
          <li><strong>מקבלי הבטחת הכנסה:</strong> פטור מלא או חלקי.</li>
          <li>יש לפנות למחלקת הגבייה ברשות המקומית.</li>
        </ul>

        <h3>8.2 הנחות במס הכנסה</h3>
        <ul>
          <li><strong>גיל 60+:</strong> 1 נקודת זיכוי נוספת.</li>
          <li><strong>ניצולי שואה:</strong> 3 נקודות זיכוי נוספות.</li>
          <li>פטור ממס על קצבת זקנה (עד תקרה מסוימת).</li>
        </ul>

        <h3>8.3 הנחות בתחבורה ציבורית</h3>
        <ul>
          <li><strong>גיל 75+:</strong> נסיעות חינם בתחבורה ציבורית.</li>
          <li><strong>גיל 62–74:</strong> הנחה של 50% ברכבת ישראל.</li>
          <li><strong>ניצולי שואה:</strong> נסיעות חינם בכל גיל.</li>
        </ul>

        <h3>8.4 הנחות בתרבות ונופש</h3>
        <ul>
          <li>כניסה חינם או במחיר מופחת למוזיאונים.</li>
          <li>הנחות בבריכות שחייה ומתקני ספורט.</li>
          <li>הנחות בקולנוע ותיאטרון.</li>
          <li>מלונות ובתי הבראה — מחירים מיוחד��ם לאזרחים ותיקים.</li>
        </ul>

        <h3>8.5 שירותי בריאות</h3>
        <ul>
          <li>פטור מתשלום השתתפות עצמית (למקבלי השלמת הכנסה).</li>
          <li>סל תרופות מורחב לאזרחים ותיקים.</li>
          <li>בדיקות גריאטריות תקופתיות.</li>
          <li>שירותי פיזיותרפיה ושיקום.</li>
        </ul>

        <h3>8.6 שירותים חברתיים</h3>
        <ul>
          <li>מועדוני אזרחים ותיקים.</li>
          <li>מרכזי יום.</li>
          <li>ארוחות חמות בבית.</li>
          <li>שירותי ליווי וקשר חברתי.</li>
        </ul>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 9. השפעות הדדיות בין הקצבאות
    // ─────────────────────────────────────────────────────────────────────
    interactions: {
      contentFn: (NII) => `
        <div style="background:#fff3e0;border-right:4px solid #ff9800;padding:15px;margin-bottom:20px;border-radius:8px;">
          <p>⚠️ חשוב להבין כיצד הקצבאות והגמלאות השונות משפיעות זו על זו.</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:15px 0;font-size:0.95em;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">סוג הטבה</th>
            <th style="padding:10px;border:1px solid #ddd;">סכומים 2026</th>
            <th style="padding:10px;border:1px solid #ddd;">נספר כהכנסה?</th>
            <th style="padding:10px;border:1px solid #ddd;">השפעה עיקרית</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">קצבת אזרח ותיק</td><td style="padding:9px;border:1px solid #ddd;">יחיד ₪${NII.pension_single_basic.value.toLocaleString('he-IL')} / +80 ₪${NII.pension_single_over80.value.toLocaleString('he-IL')} / זוג ₪${NII.pension_couple_basic.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">כן</td><td style="padding:9px;border:1px solid #ddd;">בסיס לזכאות להטבות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">השלמת הכנסה</td><td style="padding:9px;border:1px solid #ddd;">יחיד עד ₪${NII.income_supplement_single_under70.value.toLocaleString('he-IL')} / זוג עד ₪${NII.income_supplement_couple_under70.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">לא</td><td style="padding:9px;border:1px solid #ddd;">מזכה בהטבות נוספות רבות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">גמלת סיעוד</td><td style="padding:9px;border:1px solid #ddd;">רמה 1: ₪${NII.nursing_level_1_cash.value.toLocaleString('he-IL')} / רמה 6: ₪${NII.nursing_level_6_cash.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">לא</td><td style="padding:9px;border:1px solid #ddd;">ללא השפעה על הטבות אחרות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">ניצולי שואה — תוספת סיעוד</td><td style="padding:9px;border:1px solid #ddd;">${NII.holocaust_nursing_hours_count.value} שעות שבועיות או ₪${NII.holocaust_nursing_hours_9_value.value.toLocaleString('he-IL')}</td><td style="padding:9px;border:1px solid #ddd;color:#2E7D32;font-weight:bold;">לא</td><td style="padding:9px;border:1px solid #ddd;">בנוסף לגמלת סיעוד רגילה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">נכות כללית</td><td style="padding:9px;border:1px solid #ddd;">100%: ₪${NII.disability_full.value.toLocaleString('he-IL')} + תוספות משפחה</td><td style="padding:9px;border:1px solid #ddd;color:#C62828;font-weight:bold;">כן</td><td style="padding:9px;border:1px solid #ddd;">עוברת לקצבת זקנה בגיל פרישה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קצבת שאירים</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_widow_over50.value.toLocaleString('he-IL')}–₪${Math.round(NII.survivors_widow_over50.value * 1.5).toLocaleString('he-IL')} + ילדים</td><td style="padding:9px;border:1px solid #ddd;">לפי מעמד</td><td style="padding:9px;border:1px solid #ddd;">שילוב: זקנה מלאה + חצי שאירים</td></tr>
          </tbody>
        </table>

        <h3>כללי מפתח</h3>
        <ul>
          <li>✅ <strong>קצבת אזרח ותיק</strong> נספרת כהכנסה במבחן להשלמת הכנסה.</li>
          <li>✅ <strong>גמלת סיעוד</strong> אינה נספרת כהכנסה.</li>
          <li>✅ <strong>קצבת נכות</strong> עוברת אוטומטית לקצבת זקנה בגיל פרישה.</li>
          <li>✅ <strong>מקבלי השלמת הכנסה</strong> זכאים להטבות נוספות רבות.</li>
          <li>✅ <strong>אי אפשר לקבל קצבת שאירים יחד עם קצבת נכות כללית</strong> — יש לבחור.</li>
          <li>✅ <strong>שאיר של שני הורים</strong> — זכאי לשתי קצבאות נפרדות.</li>
          <li>✅ <strong>קצבת זקנה + שאירים</strong> — מלוא זקנה + חצי שאירים.</li>
        </ul>
      `
    },

    // ─────────────────────────────────────────────────────────────────────
    // 10. כתובות ויצירת קשר
    // ─────────────────────────────────────────────────────────────────────
    contact: {
      content: `
        <h3>10.1 המוסד לביטוח לאומי</h3>
        <ul>
          <li><strong>אתר אינטרנט:</strong> <a href="https://www.btl.gov.il" target="_blank" rel="noopener" style="color:#2E5B8A;">www.btl.gov.il</a></li>
          <li><strong>שירות אישי מקוון:</strong> <a href="https://ps.btl.gov.il" target="_blank" rel="noopener" style="color:#2E5B8A;">ps.btl.gov.il</a></li>
          <li><strong>טלפון:</strong> *6050 או 04-8812345</li>
          <li><strong>שעות פעילות:</strong> ראשון–חמישי 08:00–16:00</li>
        </ul>

        <h4>מוקדים ייעודיים</h4>
        <ul>
          <li><strong>מוקד קצבאות זקנה:</strong> *6050 שלוחה 3</li>
          <li><strong>מוקד השלמת הכנסה:</strong> *6050 שלוחה 4</li>
          <li><strong>מוקד סיעוד:</strong> *6050 שלוחה 5</li>
          <li><strong>מוקד ניצולי שואה:</strong> *6050 שלוחה 9</li>
        </ul>

        <h3>10.2 ארגונים נוספים</h3>
        <ul>
          <li><strong>קול זכות (מידע על זכויות):</strong> <a href="https://www.kolzchut.org.il" target="_blank" rel="noopener" style="color:#2E5B8A;">www.kolzchut.org.il</a></li>
          <li><strong>הרשות לזכויות ניצולי השואה:</strong> *5105 או 03-5682651</li>
          <li><strong>הקרן לרווחת נפגעי השואה:</strong> 03-6090866</li>
          <li><strong>ועידת התביעות:</strong> 03-5194401</li>
          <li><strong>ארגון נכי המלחמה בנאצים:</strong> 03-6838282 | דרך מנחם בגין 132, תל אביב</li>
          <li><strong>משרד הרווחה — מחלקה גריאטרית:</strong> 02-5085940</li>
          <li><strong>אשל — האיגוד הארצי לזקן:</strong> 03-6874714 | <a href="https://www.eshelnet.org.il" target="_blank" rel="noopener" style="color:#2E5B8A;">www.eshelnet.org.il</a></li>
        </ul>

        <h3>10.3 הערות חשובות</h3>
        <ul>
          <li>כל הסכומים מעודכנים לינואר 2026 ועשויים להשתנות במהלך השנה.</li>
          <li>מומלץ לבדוק את הזכאות האישית במחשבונים באתר הביטוח הלאומי.</li>
          <li>יש להגיש תביעות לקצבאות בזמן — חלק מהקצבאות אינן משולמות בדיעבד.</li>
          <li>שירותים רבים ניתנים באמצעות האתר, ללא צורך בהגעה פיזית לסניף.</li>
          <li>ניתן לקבל ייעוץ אישי בסניפי הביטוח הלאומי ובארגוני הסיוע השונים.</li>
          <li>זכאות לקצבאות עשויה להשתנות עקב שינויים בהכנסות, במצב המשפחתי או הבריאותי.</li>
        </ul>
      `
    }

  }
};
