#!/usr/bin/env python3
"""replace_survivors.py - מחליף את survivors contentFn ב-senior_rights_full.js"""

import io, sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

DRY_RUN = "--dry-run" in sys.argv
REPO_ROOT = Path(__file__).parent
JS_PATH = REPO_ROOT / "BTL" / "senior_rights" / "data" / "senior_rights_full.js"

# ─── התוכן החדש ───────────────────────────────────────────────────────────────
NEW_BLOCK = """    // ─────────────────────────────────────────────────────────────────────
    // 5. קצבת שארים
    // ─────────────────────────────────────────────────────────────────────
    survivors: {
      contentFn: (NII) => `
        <p>קצבת שאירים היא קצבה חודשית המשולמת לשאירי תושב ישראל שנפטר — להבטחת אמצעי קיום מינימליים לאלמן/ה ויתומים.</p>
        <p><em>מעודכן לינואר 2026 | מבוסס על אתר ביטוח לאומי (btl.gov.il)</em></p>

        <h3>פרק א׳ — תנאי הזכאות המלאים</h3>
        <p>הקצבה מגיעה למי שעונה על כל חמשת התנאים הבאים במצטבר:</p>
        <ul>
          <li>הנפטר היה מבוטח בביטוח שאירים בעת פטירתו</li>
          <li>הנפטר השלים תקופת אכשרה (ביטוח) כנדרש</li>
          <li>מבקש הקצבה נמנה עם שאיריו של הנפטר (אלמן/ה, יתום, הורה נתמך)</li>
          <li>אין פיגור בתשלום דמי ביטוח לאומי של הנפטר</li>
        </ul>

        <h4>א.1 — מי הוא 'מבוטח בביטוח שאירים'?</h4>
        <p>מבוטח בביטוח שאירים הוא תושב ישראל מגיל 18 ומעלה — מי שמרכז חייו בישראל. הדבר נבחן לפי מקום מגורים קבוע, מקום שהות המשפחה, מקום חינוך הילדים, מקום עבודה עיקרי ומקום לימודים.</p>
        <p><strong>גיל העלייה הקובע לביטוח שאירים — לנולדים מחוץ לישראל</strong></p>
        <p>מי שלא נולד בישראל יהיה מבוטח רק אם עלה לפני הגיל הקובע. לגבר — 62. לאישה — לפי טבלה:</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">תאריך לידת האישה</th>
            <th style="padding:10px;border:1px solid #ddd;">גיל עלייה מקסימלי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">עד 6/1944</td><td style="padding:9px;border:1px solid #ddd;">60</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">7/1944 – 8/1944</td><td style="padding:9px;border:1px solid #ddd;">60 ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">9/1944 – 4/1945</td><td style="padding:9px;border:1px solid #ddd;">60 ו-8 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">5/1945 – 12/1945</td><td style="padding:9px;border:1px solid #ddd;">61</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1946 – 8/1946</td><td style="padding:9px;border:1px solid #ddd;">61 ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">9/1946 – 4/1947</td><td style="padding:9px;border:1px solid #ddd;">61 ו-8 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">5/1947 – 12/1959</td><td style="padding:9px;border:1px solid #ddd;">62</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1960 – 12/1960</td><td style="padding:9px;border:1px solid #ddd;">62 ו-4 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1961 – 12/1961</td><td style="padding:9px;border:1px solid #ddd;">62 ו-8 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1962 – 12/1962</td><td style="padding:9px;border:1px solid #ddd;">63</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1963 – 12/1963</td><td style="padding:9px;border:1px solid #ddd;">63 ו-3 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1964 – 12/1964</td><td style="padding:9px;border:1px solid #ddd;">63 ו-6 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1965 – 12/1965</td><td style="padding:9px;border:1px solid #ddd;">63 ו-9 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1966 – 12/1966</td><td style="padding:9px;border:1px solid #ddd;">64</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1967 – 12/1967</td><td style="padding:9px;border:1px solid #ddd;">64 ו-3 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1968 – 12/1968</td><td style="padding:9px;border:1px solid #ddd;">64 ו-6 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1969 – 12/1969</td><td style="padding:9px;border:1px solid #ddd;">64 ו-9 חודשים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">1/1970 ואילך</td><td style="padding:9px;border:1px solid #ddd;">65</td></tr>
          </tbody>
        </table>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> מי שעלה לאחר הגיל הקובע — אינו מבוטח. אלמנה ויתומים עשויים להיות זכאים לגמלת שאירים מיוחדת (פרק ב׳.6).
        </div>

        <h4>א.2 — תקופת אכשרה — חמישה מסלולים אפשריים</h4>
        <p>הנפטר צריך לעמוד באחד בלבד מהמסלולים הבאים:</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מסלול</th>
            <th style="padding:10px;border:1px solid #ddd;">דרישת הביטוח</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">מסלול 1</td><td style="padding:9px;border:1px solid #ddd;">12 חודשי ביטוח ב-12 החודשים שלפני יום הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מסלול 2</td><td style="padding:9px;border:1px solid #ddd;">24 חודשי ביטוח (רצופים או לא) ב-5 השנים שלפני הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מסלול 3</td><td style="padding:9px;border:1px solid #ddd;">60 חודשי ביטוח (רצופים או לא) ב-10 השנים שלפני הפטירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מסלול 4</td><td style="padding:9px;border:1px solid #ddd;">144 חודשי ביטוח (12 שנה) — בכל הזמנים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מסלול 5</td><td style="padding:9px;border:1px solid #ddd;">60 חודשי ביטוח מיום שנעשה תושב ישראל, ובתנאי שחודשי האי-ביטוח אינם עולים על חודשי הביטוח</td></tr>
          </tbody>
        </table>
        <p><strong>פטור מתקופת אכשרה — מקרים מיוחדים:</strong></p>
        <ul>
          <li>נפטר בתוך שנה מיום שנעשה תושב ישראל</li>
          <li>נפטר לפני גיל 19</li>
          <li>היה המפרנס העיקרי של בן הזוג או הילדים</li>
          <li>האישה נפטרה בתוך שנה מהתגרשות או התאלמנות</li>
        </ul>
        <div style="background:#ffebee;border-right:4px solid #c62828;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>❗ חשוב לדעת:</strong> אם האם נפטרה ולא השלימה תקופת אכשרה — רק הילדים יהיו זכאים, לא האב.
        </div>

        <h4>א.3 — תקופות ביטוח לאישה נשואה שנפטרה</h4>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מצב האישה</th>
            <th style="padding:10px;border:1px solid #ddd;">מה נחשב תקופת ביטוח?</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">נולדה בארץ ונישאה אחרי גיל 18</td><td style="padding:9px;border:1px solid #ddd;">תקופת הרווקות מגיל 18 עד הנישואים — גם ללא עבודה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">עלתה לפני גיל 18 ונישאה אחרי גיל 18</td><td style="padding:9px;border:1px solid #ddd;">תקופת הרווקות מגיל 18 עד הנישואים — גם ללא עבודה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">עלתה אחרי גיל 18 ונישאה אחרי גיל 18</td><td style="padding:9px;border:1px solid #ddd;">מיום העלייה עד הנישואים — גם ללא עבודה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">עבדה בתקופת הנישואים</td><td style="padding:9px;border:1px solid #ddd;">תקופות עבודה בהיותה נשואה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">הייתה גרושה לפני הנישואים</td><td style="padding:9px;border:1px solid #ddd;">מחודש אחרי הגירושים — כל זמן היותה גרושה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">הייתה אלמנה ולא קיבלה קצבת שאירים</td><td style="padding:9px;border:1px solid #ddd;">כל תקופת היותה אלמנה — גם ללא עבודה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">הייתה אלמנה וקיבלה קצבת שאירים</td><td style="padding:9px;border:1px solid #ddd;">תקופות עבודה בלבד</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קיבלה קצבת נכות כללית בהיותה נשואה</td><td style="padding:9px;border:1px solid #ddd;">כל תקופת קבלת הנכות — גם ללא עבודה</td></tr>
          </tbody>
        </table>

        <h4>א.4 — מיהי אלמנה זכאית?</h4>
        <ul>
          <li>הייתה נשואה לנפטר, או ידועה בציבור שלו וחיה עמו שנה לפחות (או חצי שנה אם הייתה בת 55+ ביום פטירתו)</li>
          <li>ילדה לנפטר ילד</li>
        </ul>
        <p><strong>אלמנה שחיה בנפרד מהנפטר</strong> — צריכה לענות גם על אחד מאלה:</p>
        <ul>
          <li>תקופת הפירוד קצרה מ-36 חודשים</li>
          <li>גרו יחד בשנה האחרונה לחייו או בחלקה</li>
          <li>הנפטר שילם לה מזונות או היה חייב בהם לפי פסק דין</li>
          <li>הנפטר קיבל עבורה תוספת בקצבת אזרח ותיק או נכות</li>
        </ul>
        <div style="background:#ffebee;border-right:4px solid #c62828;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>❗ חשוב לדעת:</strong> ידועים בציבור חייבים לדווח לביטוח לאומי. אי-דיווח עלול ליצור חובות החזר.
        </div>
        <p><strong>אלמן/ה ללא ילדים מתחת לגיל 40</strong> — זכאים למענק חד-פעמי בלבד, לא לקצבה חודשית.</p>

        <h4>א.5 — מיהו אלמן זכאי? — תנאי הכנסה</h4>
        <ul>
          <li>היה נשוי לנפטרת, או ידוע בציבור שלה (שנה לפחות, או חצי שנה אם היה בן 55+)</li>
          <li>הכנסותיו אינן עולות על <strong>₪${NII.survivors_income_test_no_dependents.value.toLocaleString('he-IL')} לחודש</strong> (מ-01.01.2026)</li>
        </ul>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> אם לאלמן יש ילד העונה על הגדרת יתום — לא תיערך בדיקת הכנסות כלל.
        </div>

        <h5>א.5.1 — אופן חישוב ההכנסות לאלמן</h5>
        <p>מהכנסה מעבודה (שכיר/עצמאי), פנסיה, קופת גמל — מופחתים <strong>₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</strong> לפני בדיקת הסף:</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">סוג ההכנסה</th>
            <th style="padding:10px;border:1px solid #ddd;">אופן חישוב</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">שכר עבודה כשכיר</td><td style="padding:9px;border:1px solid #ddd;">לאחר הפחתת ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">הכנסה מעצמאי</td><td style="padding:9px;border:1px solid #ddd;">לאחר הפחתת ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">פנסיה, קופת גמל, ביטוח חודשי</td><td style="padding:9px;border:1px solid #ddd;">לאחר הפחתת ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קצבת אזרח ותיק (כשאינו שכיר)</td><td style="padding:9px;border:1px solid #ddd;">במלואה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קצבת אזרח ותיק (כשהוא שכיר)</td><td style="padding:9px;border:1px solid #ddd;">לא נלקחת בחשבון</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">פנסיית שאירים של האישה (כשכיר)</td><td style="padding:9px;border:1px solid #ddd;">לאחר הפחתה מסוימת</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">פנסיית שאירים של האישה (כשאינו שכיר)</td><td style="padding:9px;border:1px solid #ddd;">במלואה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תגמול נפגע איבה / נכה רדיפות הנאצים (כשכיר)</td><td style="padding:9px;border:1px solid #ddd;">לא נלקח בחשבון</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תגמול נפגע איבה / נכה רדיפות הנאצים (אחר)</td><td style="padding:9px;border:1px solid #ddd;">במלואו</td></tr>
          </tbody>
        </table>

        <h5>א.5.2 — התקופה הנבדקת</h5>
        <p>נלקחות בחשבון הכנסות 12 החודשים שקדמו לחודש פטירת האישה (כולל חודש הפטירה), או הכנסות שנת המס שבה נפטרה. לאחר הפטירה — הכנסות שנת המס השוטפת.</p>

        <h4>א.6 — הגדרת 'יתום' — פירוט מלא</h4>
        <p>ילדו של הנפטר — כולל ילד חורג, מאומץ, ונכד שרק הנפטר פרנסו (לא כולל נישאים) — מוגדר יתום לפי הטבלה:</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">תנאי</th>
            <th style="padding:10px;border:1px solid #ddd;">גיל הזכאות</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">ילד שלא מלאו לו 18</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 18</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לומד על-יסודי / בגרות / לקות למידה במסגרת מוכרת</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 20</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מכינה קדם-צבאית</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 20</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לומד במוסד מאושר (ישיבה, אוניברסיטה, הכשרה) — 20+ שעות/שבוע</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 20</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מתנדב למטרה ציבורית (עד 12 חודשים) וגיוסו נדחה</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 21</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">שירות סדיר בצה"ל (עד 36 חודשי זכאות)</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 24</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">שירות לאומי בהתנדבות במסגרות מוכרות</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 24</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">לומד בעתודה וגיוסו נדחה עקב לימודים</td><td style="padding:9px;border:1px solid #ddd;">עד גיל 24</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">ילד בעל מוגבלות שאינו כשיר לעבוד</td><td style="padding:9px;border:1px solid #ddd;">ללא הגבלת גיל</td></tr>
          </tbody>
        </table>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> נכד שרק הנפטר פרנסו — נחשב כילד לצורך הקצבה (לא נישא). הרחבה חשובה לדור השלישי.
        </div>

        <h3>פרק ב׳ — סכומי הקצבה (החל מ-01.01.2026)</h3>

        <h4>ב.1 — קצבה לאלמן/ה</h4>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מקבל הקצבה</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה בגיל 40–50, ללא ילדים</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_widow_40_49.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה בגיל 50 ומעלה, ללא ילדים</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_widow_over50.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה בגיל 80 ומעלה</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_widow_over80.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה עם ילד אחד</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_spouse_1child.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה עם שני ילדים</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_spouse_2children.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">כל ילד נוסף (מהשלישי ואילך)</td><td style="padding:9px;border:1px solid #ddd;">+₪${NII.survivors_orphan.value.toLocaleString('he-IL')} לכל ילד</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אלמן/ה המקבל/ת גם קצבת זקנה (50% שאירים)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_spouse_half_with_pension.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> אין הגבלה במספר הילדים הזכאים — הסכום ממשיך לגדול עם כל ילד נוסף.
        </div>

        <h4>ב.2 — קצבה ליתומים בנסיבות מיוחדות</h4>
        <p>משולמת כאשר ההורה הנותר בחיים אינו זכאי לקצבה, או כשהילד התייתם משני הורים:</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">סוג קצבת יתום</th>
            <th style="padding:10px;border:1px solid #ddd;">סכום חודשי</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">יתום יחיד (הורה לא זכאי לקצבה)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.survivors_orphan_single.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">כשיש יותר מילד אחד — לכל ילד</td><td style="padding:9px;border:1px solid #ddd;">₪${NII.survivors_orphan.value.toLocaleString('he-IL')}</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">יתום משני הורים — לכל ילד (רק אם שני ההורים היו זכאים)</td><td style="padding:9px;border:1px solid #ddd;font-weight:bold;">₪${NII.orphan_both_parents_first.value.toLocaleString('he-IL')}</td></tr>
          </tbody>
        </table>

        <h4>ב.3 — תוספת ותק</h4>
        <p>מתווספת לקצבה הבסיסית לפי שנות הביטוח של הנפטר. חלה על אלמן/ה ויתומים. מקסימום — ${NII.seniority_bonus_max.value}%.</p>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">תקופה</th>
            <th style="padding:10px;border:1px solid #ddd;">אופן חישוב</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">עד דצמבר 2016</td><td style="padding:9px;border:1px solid #ddd;">2% על כל שנה מעל 10 שנות הביטוח הראשונות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">ינואר–דצמבר 2017</td><td style="padding:9px;border:1px solid #ddd;">2% על כל שנה מעל 9 שנות הביטוח הראשונות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מינואר 2018</td><td style="padding:9px;border:1px solid #ddd;">2% על כל שנה מעל 4 שנות הביטוח הראשונות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מינואר 2019 ואילך</td><td style="padding:9px;border:1px solid #ddd;">2% על כל שנת ביטוח — מהשנה הראשונה</td></tr>
          </tbody>
        </table>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> יתומים זכאים לתוספת ותק רק אם הנפטר היה מבוטח שנה לפחות. שנת ביטוח מלאה = 12 חודשי ביטוח.
        </div>

        <h4>ב.4 — תוספת דמי מחיה ליתומים</h4>
        <p>יתום שאינו מתגורר עם הורה המקבל קצבת שאירים — זכאי לתוספת דמי מחיה לכיסוי הוצאות מחיה שוטפות.</p>

        <h4>ב.5 — תוספת השלמת הכנסה</h4>
        <p>משולמת לפי חוק הבטחת הכנסה לאלמן/ה שהכנסתו/ה נמוכה. יש להגיש בקשה נפרדת.</p>

        <h4>ב.6 — גמלת שאירים מיוחדת — לנפטר שלא היה מבוטח</h4>
        <p>משולמת לאלמן/ה וליתומים של תושב שעלה לאחר הגיל הקובע ולא היה מבוטח. הסכומים זהים לקצבה הרגילה — אך ללא תוספת ותק.</p>

        <h3>פרק ג׳ — מענקים חד-פעמיים</h3>

        <h4>ג.1 — מענק שאירים</h4>
        <p>תשלום חד-פעמי ששווה ל-36 קצבאות חודשיות. ישולם במקרים הבאים:</p>
        <ul>
          <li>אלמן/ה מתחת לגיל 40 ללא ילדים — מענק במקום קצבה</li>
          <li>אלמן שקצבתו נפסקת כי הילד חדל להיות יתום וכנסותיו גבוהות מהסף</li>
          <li>אלמן ללא ילד שהכנסותיו עלו מעל הסף — קצבה נפסקת ומשולם מענק</li>
        </ul>
        <div style="background:#ffebee;border-right:4px solid #c62828;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ חשוב לדעת:</strong> אלמן שהיה נשוי לעקרת בית — אינו זכאי למענק שאירים כלל.
        </div>
        <p><strong>מענק ששולם וקצבה שחודשה:</strong> אם הכנסות האלמן ירדו לאחר קבלת המענק — המענק ינוכה ב-100% מהקצבות החודשיות.</p>

        <h4>ג.2 — מענק בר/בת מצווה</h4>
        <p>מענק חד-פעמי ליתום/ה בגיל 13 (בנים) / 12 (בנות). משולם על ידי משרד הרווחה.</p>

        <h4>ג.3 — מענק לימודים</h4>
        <p>מענק שנתי לכיסוי הוצאות שנת הלימודים — ציוד, ספרים, שכר לימוד. יש להגיש מדי שנה לפני תחילת הלימודים.</p>

        <h4>ג.4 — מענק נישואים</h4>
        <p>מענק חד-פעמי ליתום/ה שנישא/ת. הקצבה תפסק עם הנישואין. יש להגיש בסמוך לאחר הנישואים.</p>

        <h3>פרק ד׳ — תשלום הקצבה</h3>

        <h4>ד.1 — מועד תחילת תשלום</h4>
        <p>הקצבה משולמת מהחודש שלאחר הגשת התביעה. ניתן לקבל רטרואקטיבית עד 12 חודשים — בתנאי שהתביעה הוגשה תוך 12 חודשים מהפטירה.</p>
        <div style="background:#ffebee;border-right:4px solid #c62828;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>❗ חשוב לדעת:</strong> הגשה מאוחרת מ-12 חודשים — אובדן תשלומים רטרואקטיביים. הקצבה תחל רק ממועד הגשת התביעה.
        </div>

        <h4>ד.2 — אופן התשלום</h4>
        <ul>
          <li>העברה ישירה לחשבון הבנק של מקבל הקצבה</li>
          <li>מועד קבוע: ה-28 לכל חודש</li>
          <li>עדכון פרטי חשבון: btl.gov.il → שירות אישי</li>
        </ul>

        <h4>ד.3 — ניכויים מהקצבה</h4>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">סוג הניכוי</th>
            <th style="padding:10px;border:1px solid #ddd;">שיעור / פירוט</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">דמי ביטוח בריאות</td><td style="padding:9px;border:1px solid #ddd;">5% מהקצבה (עד תקרה)</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מס הכנסה</td><td style="padding:9px;border:1px solid #ddd;">רק אם הכנסה כוללת עולה על תקרת הפטור</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">חוב לביטוח לאומי</td><td style="padding:9px;border:1px solid #ddd;">קיזוז לפי הסכמה או צו</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מזונות לפי פסק דין</td><td style="padding:9px;border:1px solid #ddd;">אם נקבע בצו בית משפט</td></tr>
          </tbody>
        </table>

        <h3>פרק ה׳ — פקיעת הזכאות ומקרים מיוחדים</h3>

        <h4>ה.1 — מתי פוקעת הקצבה?</h4>
        <ul>
          <li>האלמן/ה נישאו מחדש — הקצבה פוקעת, ניתן מענק נישואים חד-פעמי</li>
          <li>האלמן/ה שהה בחוץ לארץ מעל 3 חודשים — הקצבה מושהית עד לחזרה</li>
          <li>הילד הגיע לגיל הסף — הקצבה בגינו פוקעת</li>
        </ul>

        <h4>ה.2 — קצבת שאירים וקצבת זקנה</h4>
        <p>אלמן/ה שהגיע/ה לגיל פרישה — בדרך כלל יקבל/ת את הגבוהה מבין השתיים. קיים מסלול: קצבת זקנה מלאה + מחצית קצבת שאירים (<strong>₪${NII.survivors_spouse_half_with_pension.value.toLocaleString('he-IL')} לחודש</strong>).</p>
        <div style="background:#fff8e1;border-right:4px solid #f9a825;padding:12px 16px;border-radius:8px;margin:12px 0;">
          <strong>⚠ הערה:</strong> בדיקת כדאיות בין המסלולים חיונית — מומלץ להתייעץ עם יועץ ביטוח לאומי לפני הגשת תביעת זקנה.
        </div>

        <h4>ה.3 — שוהה בחוץ לארץ</h4>
        <p>שהייה מעל 3 חודשים מפסיקה את הקצבה לתקופת השהייה. עם החזרה — הקצבה מתחדשת. יש לדווח לביטוח לאומי על שהייה ממושכת.</p>

        <h4>ה.4 — אפשרויות קצבה חלופיות</h4>
        <ul>
          <li>קצבת הבטחת הכנסה — אם אין הכנסות</li>
          <li>קצבת נכות כללית — אם יש מוגבלות</li>
          <li>קצבת אזרח ותיק — עם הגיעה לגיל הפרישה</li>
          <li>גמלת שאירים מיוחדת — לאלמן/ה שהנפטר לא היה מבוטח</li>
        </ul>

        <h3>פרק ו׳ — הכשרה מקצועית ושיקום</h3>
        <p>אלמן/ה זכאי/ת לשירותי שיקום מקצועי מהביטוח הלאומי:</p>
        <ul>
          <li>רכישת מקצוע חדש במסגרות הכשרה מוכרות</li>
          <li>מימון שכר לימוד, ציוד ואמצעי לימוד</li>
          <li>דמי מחיה בזמן ההכשרה (במקום קצבה)</li>
          <li>ליווי יועץ שיקום מקצועי מהביטוח הלאומי</li>
        </ul>

        <h3>פרק ז׳ — הגשת התביעה</h3>

        <h4>ז.1 — מסמכים נדרשים</h4>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">מסמך</th>
            <th style="padding:10px;border:1px solid #ddd;">פירוט</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">תעודת פטירה</td><td style="padding:9px;border:1px solid #ddd;">מקור או עותק מאושר</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תעודת זהות של האלמן/ה</td><td style="padding:9px;border:1px solid #ddd;">כולל ספח</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תעודות לידה של הילדים</td><td style="padding:9px;border:1px solid #ddd;">מקוריות</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">תעודת נישואים</td><td style="padding:9px;border:1px solid #ddd;">של הנפטר והאלמן/ה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אישורי ביטוח / תלושי שכר</td><td style="padding:9px;border:1px solid #ddd;">לבדיקת תקופות ביטוח של הנפטר</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">פרטי חשבון בנק</td><td style="padding:9px;border:1px solid #ddd;">לתשלום הקצבה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">אישורי לימוד לילדים מעל גיל 18</td><td style="padding:9px;border:1px solid #ddd;">אם רלוונטי</td></tr>
          </tbody>
        </table>

        <h4>ז.2 — דרכי הגשה</h4>
        <ul>
          <li>פנייה לסניף הביטוח הלאומי הקרוב</li>
          <li>הגשה אונליין: ps.btl.gov.il (שירות אישי)</li>
          <li>שליחת מסמכים בדואר לסניף המטפל</li>
          <li>דרך עובד סוציאלי (שירות אישי לעו"ס)</li>
        </ul>

        <h3>פרק ח׳ — זכויות נוספות בגופים אחרים</h3>
        <table style="width:100%;border-collapse:collapse;margin:15px 0;">
          <thead><tr style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;">
            <th style="padding:10px;border:1px solid #ddd;">גוף</th>
            <th style="padding:10px;border:1px solid #ddd;">זכות עיקרית</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:9px;border:1px solid #ddd;">משרד החינוך</td><td style="padding:9px;border:1px solid #ddd;">סיוע פסיכולוגי, פטור/הנחה בשכר לימוד</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">משרד השיכון</td><td style="padding:9px;border:1px solid #ddd;">הנחה בהלוואת זכאות לרכישת דירה</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">מינהל הסעד</td><td style="padding:9px;border:1px solid #ddd;">טיפול פסיכוסוציאלי, סיוע בדיור</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קרן פנסיה / קופת גמל</td><td style="padding:9px;border:1px solid #ddd;">קצבת שאירים פנסיונית — יש לבדוק</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">ביטוחי חיים פרטיים</td><td style="padding:9px;border:1px solid #ddd;">יש לבדוק אם לנפטר היה ביטוח חיים</td></tr>
            <tr><td style="padding:9px;border:1px solid #ddd;">קרן השתלמות / פיצויים</td><td style="padding:9px;border:1px solid #ddd;">המשפחה זכאית לפיצויים ולקרנות השתלמות</td></tr>
          </tbody>
        </table>

        <h3>פרק ט׳ — ערעור ונקודות לאנשי מקצוע</h3>

        <h4>ט.1 — ערעור על החלטת הביטוח הלאומי</h4>
        <ul>
          <li>שלב א׳ — ועדת עררים פנימית של הביטוח הלאומי (ללא עלות)</li>
          <li>שלב ב׳ — בית הדין לעבודה (ניתן להגיש תוך 12 חודשים)</li>
        </ul>

        <h4>ט.2 — נקודות בדיקה חיוניות לאנשי מקצוע</h4>
        <ul>
          <li>האם הנפטר עלה לישראל לפני הגיל הקובע? (ראה טבלה בפרק א׳.1)</li>
          <li>בדיקת 5 מסלולי האכשרה — מסלול 5 עשוי להכשיר עולים שאינם עומדים בשאר</li>
          <li>לאם שנפטרה — בדיקת 8 תקופות הביטוח המיוחדות (פרק א׳.3)</li>
          <li>לאלמן — סף הכנסות ₪${NII.survivors_income_test_no_dependents.value.toLocaleString('he-IL')} והפחתת ₪${NII.survivors_income_allowed_employed.value.toLocaleString('he-IL')} מהכנסה מעבודה/פנסיה</li>
          <li>לאלמן עם ילד — לא נבדקות הכנסות כלל</li>
          <li>גמלה מיוחדת כאשר הנפטר לא היה מבוטח</li>
          <li>נכד שרק הנפטר פרנסו — זכאות דור שלישי</li>
          <li>יתום בשירות צבאי/לאומי — זכאות אפשרית עד גיל 24</li>
          <li>המועד הקריטי — 12 חודשים לרטרואקטיביות</li>
          <li>כדאיות: קצבת זקנה מלאה + ₪${NII.survivors_spouse_half_with_pension.value.toLocaleString('he-IL')} מחצית שאירים, לעומת שאירים מלאה</li>
        </ul>

        <div style="background:#fff3e0;border-right:4px solid #ff9800;padding:14px 18px;border-radius:8px;margin:20px 0;">
          <strong>⚠ אזהרה:</strong> מסמך זה הוא סיכום מידעי בלבד על בסיס אתר ביטוח לאומי (btl.gov.il). אינו ייעוץ משפטי. לבדיקת זכאות אישית: *6050 | btl.gov.il | סניף ביטוח לאומי קרוב.
        </div>
      `
    },

"""


def main():
    text = JS_PATH.read_text(encoding="utf-8")

    marker5 = "// 5. קצבת שארים"
    marker6 = "// 6. מענק מעבר"

    idx5 = text.find(marker5)
    idx6 = text.find(marker6)

    if idx5 == -1 or idx6 == -1:
        print(f"שגיאה: סמן לא נמצא (5={idx5}, 6={idx6})", file=sys.stderr)
        sys.exit(1)

    # התחלה: תחילת שורת ה-dashes שלפני // 5.
    line_start5 = text.rfind("\n", 0, idx5) + 1
    prev_line_start5 = text.rfind("\n", 0, line_start5 - 1) + 1

    # סוף: תחילת שורת ה-dashes שלפני // 6.
    line_start6 = text.rfind("\n", 0, idx6) + 1
    prev_line_start6 = text.rfind("\n", 0, line_start6 - 1) + 1

    old_lines = text[prev_line_start5:prev_line_start6].count("\n")
    new_lines = NEW_BLOCK.count("\n")

    if DRY_RUN:
        print(f"dry-run: יוחלפו {old_lines} שורות ב-{new_lines} שורות")
        return

    new_text = text[:prev_line_start5] + NEW_BLOCK + text[prev_line_start6:]
    JS_PATH.write_text(new_text, encoding="utf-8")
    print(f"בוצע: {old_lines} שורות → {new_lines} שורות")


if __name__ == "__main__":
    main()
