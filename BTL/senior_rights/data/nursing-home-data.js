const NURSING_HOME_DATA = {
  "title": "מדריך מקיף לסיוע במימון בית אבות לאזרחים ותיקים",
  "subtitle": "עבור יועצים ומשפחות",
  "lastUpdate": "2026-01-26T00:00:00Z",
  "sections": [
    {
      "id": "overview",
      "title": "סקירה כללית",
      "icon": "📋",
      "subsections": [
        {
          "title": "מהי הזכאות?",
          "content": "אזרחים ותיקים שהגיעו לגיל פרישה (67 לגברים, 62-65 לנשים) והזקוקים למעבר לבית אבות, זכאים לסיוע ממשלתי במימון האשפוז. הזכאות והגוף המממן תלויים בסוג התפקוד של האזרח הוותיק."
        },
        {
          "title": "חלוקה לפי גופים מממנים",
          "subsections": [
            {
              "title": "משרד הבריאות",
              "content": "<p><strong>אוכלוסיית יעד:</strong> קשישים סיעודיים או תשושי נפש</p><p><strong>מנגנון:</strong> \"קוד אשפוז סיעודי\" או \"קוד משרד הבריאות\"</p><p><strong>סוג בתי אבות:</strong> בתי אבות ברישיון משרד הבריאות ובהסכם עם המשרד</p>"
            },
            {
              "title": "משרד הרווחה",
              "content": "<p><strong>אוכלוסיית יעד:</strong> קשישים עצמאיים או תשושים (תשושי גוף)</p><p><strong>מנגנון:</strong> סיוע במימון דרך לשכת הרווחה המקומית</p><p><strong>סוג בתי אבות:</strong> בתי אבות ברישיון משרד הרווחה</p>"
            },
            {
              "title": "קופות החולים",
              "content": "<p><strong>אוכלוסיית יעד:</strong> חולים סיעודיים מורכבים</p><p><strong>סוג מסגרות:</strong> בתי חולים שיקומיים, הוספיסים</p>"
            }
          ]
        }
      ]
    },
    {
      "id": "population_types",
      "title": "חלוקה לפי סוגי אוכלוסייה",
      "icon": "👥",
      "subsections": [
        {
          "title": "הגדרות תפקודיות",
          "subsections": [
            {
              "title": "עצמאי",
              "content": "<p>אדם שאינו זקוק לסיוע מיוחד</p><p>לא תלוי בעזרת הזולת לביצוע פעולות יומיומיות בסיסיות</p><p><strong>גוף מממן:</strong> משרד הרווחה</p>"
            },
            {
              "title": "תשוש / תשוש גוף",
              "content": "<p>אדם הזקוק לעזרה <strong>חלקית</strong> בביצוע פעולות יומיומיות</p><p>זקוק לסיוע בחלק משעות היום (לא 24 שעות)</p><p><strong>גוף מממן:</strong> משרד הרווחה</p>"
            },
            {
              "title": "סיעודי",
              "content": "<p>אדם הסובל מפגיעה קשה בתפקודי היום-יום</p><p>זקוק לעזרה <strong>מלאה</strong> ורציפה ב-24 שעות ביממה</p><p>מתקשה בביצוע רחצה, אכילה, הלבשה, ניידות</p><p><strong>גוף מממן:</strong> משרד הבריאות</p>"
            },
            {
              "title": "תשוש נפש",
              "content": "<p>אדם עם ירידה קוגניטיבית משמעותית</p><p>פגיעה בזיכרון, שיפוט, תובנה, התמצאות במקום ובזמן</p><p>כולל: דמנציה, אלצהיימר</p><p><strong>גוף מממן:</strong> משרד הבריאות</p>"
            },
            {
              "title": "סיעודי מורכב",
              "content": "<p>חולה סיעודי עם <strong>מחלות נלוות מורכבות</strong> או מצב רפואי קשה</p><p>דוגמאות: סוכרת, מחלות לב, סרטן, מונשם</p><p>זקוק ל<strong>טיפול רפואי מתקדם</strong> ופיקוח רפואי קבוע</p><p>עשוי להידרוש מעקב רפואי יום-יומי וטיפולים מורכבים</p><p><strong>גוף מממן:</strong> קופת חולים</p>"
            }
          ]
        }
      ]
    },
    {
      "id": "ministry_health",
      "title": "מסלול משרד הבריאות",
      "icon": "🏥",
      "subsections": [
        {
          "title": "למי מיועד?",
          "content": "<ul><li>אזרחים ותיקים במצב <strong>סיעודי</strong> או <strong>תשוש נפש</strong></li><li>מעל גיל פרישה</li><li>הזקוקים לטיפול והשגחה 24 שעות ביממה</li></ul>"
        },
        {
          "title": "התהליך המלא - שלב אחר שלב",
          "subsections": [
            {
              "title": "שלב 1: הכנה ראשונית",
              "content": "<h4>מה צריך לעשות?</h4><ol><li>פנייה ללשכת הבריאות המחוזית (לפי כתובת מגורים בספח ת.ז)</li><li>קבלת מידע וטפסים ראשוניים</li><li>בחירת בית אבות מתאים מרשימת בתי האבות המוכרים</li></ol><h4>מי מגיש את הבקשה?</h4><ul><li>בן/בת המשפחה (בדרך כלל)</li><li>העובד הסוציאלי מטעם בית החולים/קהילה</li><li>הקשיש עצמו (אם כשיר)</li></ul>"
            },
            {
              "title": "שלב 2: הגשת מסמכים רפואיים",
              "content": "<h4>מטרה:</h4><p>קביעת הסיווג הרפואי (האם הקשיש אכן סיעודי/תשוש נפש)</p><h4>המסמכים הנדרשים:</h4><ul><li>בקשה לסידור מוסדי - טופס בקשה רשמי חתום</li><li>צילום תעודת זהות - כולל ספח כתובת עדכני</li><li>טופס מידע רפואי-סיעודי-תפקודי - הערכה מקיפה של מצב תפקודי (בחודש האחרון)</li><li>סיכום רפואי מפורט - תיאור בעיות רפואיות, טיפולים, בדיקות</li><li>סיכומי אשפוזים - מכתבי שחרור מבתי חולים (שנה אחרונה)</li><li>דו\"ח פסיכו-סוציאלי - הערכה סוציאלית ונפשית</li><li>בדיקות דם - תוצאות בדיקות מעבדה</li><li>מסמכי אפוטרופסות/ייפוי כוח - במקרה של פגיעה בכושר השיפוט</li></ul><h4>מסמכים לפגיעה בכושר שיפוט (אם רלוונטי):</h4><ul><li>צו מינוי אפוטרופוס</li><li>בקשה למינוי אפוטרופוס שהוגשה לבית משפט</li><li>ייפוי כוח מתמשך</li><li>ייפוי כוח לטיפול רפואי</li><li>מינוי תומך החלטות</li></ul><h4>לאן מגישים?</h4><ul><li>ישירות ללשכת הבריאות המחוזית (בשעות קבלת קהל)</li><li>בפקס</li><li>בדואר אלקטרוני</li><li>בדואר רגיל</li></ul><h4>זמן טיפול:</h4><p>תוך 14 ימי עבודה תתואם פגישה/ביקור בית</p>"
            },
            {
              "title": "שלב 3: ביקור בית והערכה",
              "content": "<h4>מה קורה?</h4><ul><li>תוך 14 ימים מהגשת כל המסמכים</li><li>ביקור של אחות ו/או עובדת סוציאלית מלשכת הבריאות</li><li>הערכה של המצב התפקודי והסביבתי</li><li>שיחה עם המשפחה על החלופות</li></ul><h4>תוצאה:</h4><p>העברת החומר לוועדת סיווג גריאטרית</p>"
            },
            {
              "title": "שלב 4: וועדת הסיווג",
              "content": "<h4>מטרה:</h4><p>קביעה רשמית - האם הקשיש מוגדר כסיעודי או תשוש נפש</p><h4>זמן החלטה:</h4><p>עד 10 ימי עבודה מהביקור</p><h4>תוצאות אפשריות:</h4><ul><li>✅ <strong>אושר</strong> - מעבר לשלב הכלכלי</li><li>❌ <strong>נדחה</strong> - אין הגדרה סיעודית/תשוש נפש</li><li>🔄 <strong>נדרש מידע נוסף</strong> - צורך במסמכים נוספים</li></ul><h4>חשוב:</h4><p>ניתן לערער על החלטת הוועדה אם לא מסכימים</p>"
            },
            {
              "title": "שלב 5: הגשת מסמכים כלכליים",
              "content": "<h4>מי צריך להגיש?</h4><ul><li>המועמד/ת לאשפוז</li><li>בן/בת זוג</li><li><strong>כל הילדים הבגירים</strong> מעל גיל 21 המתגוררים בישראל</li></ul><h4>⚠️ חשוב מאוד:</h4><p>אם אחד הילדים מסרב לחשוף הכנסות או להשתתף - <strong>לא ניתן לקבל קוד!</strong></p><h4>המסמכים הנדרשים עבור המועמד/ת ובן/בת הזוג:</h4><ul><li>שאלון הצהרה חתום <strong>בפני עורך דין</strong></li><li>צילום תעודת זהות (שני הצדדים)</li><li>אישורי הכנסה מ-3 חודשים אחרונים: פנסיה, תגמולים, קצבאות ביטוח לאומי, כל הכנסה אחרת</li><li>מסמכי נכסי מקרקעין: נסח טאבו (אם יש דירה בבעלות), חוזה שכירות (אם שוכר), אישור שאין נכסים ממינהל מקרקעי ישראל</li><li>מסמכי נכסים כספיים: פרטי חשבונות בנק (בארץ ובחו\"ל), תדפיסים של 3 חודשים אחרונים, ריכוז חסכונות ופיקדונות, פרטי כספות</li><li>אישורי הוצאות: תשלומי משכנתא או הלוואות, מיסי עירייה, ביטוח בריאות משלים</li><li>אישור על ביטוח סיעודי פרטי (אם יש)</li></ul><h4>המסמכים הנדרשים עבור כל אחד מהילדים:</h4><ul><li>שאלון הצהרה חתום <strong>בפני עורך דין</strong></li><li>צילום תעודת זהות</li><li>אישורי הכנסה: לשכירים - 3 תלושי משכורת אחרונים, לעצמאים - שומת מס מרואה חשבון, לנתמכי ביטוח לאומי - אישור הכנסה 3 חודשים אחרונים</li><li>פרטי ילדים מתחת לגיל 18</li><li>הוצאות מיוחדות (ילד נכה, משכנתא וכו')</li></ul>"
            },
            {
              "title": "שלב 6: חישוב ההשתתפות העצמית",
              contentFn: (nii) => {
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = n => Math.round(n).toLocaleString('he-IL');
                return `<h4>מי מחשב?</h4><p>ועדה כלכלית של משרד הבריאות</p><h4>זמן תשובה:</h4><p>עד 13 ימי עבודה מקבלת כל המסמכים</p><h4>אופן החישוב (בסדר יורד - cascade):</h4><ol><li><strong>הכנסות שוטפות</strong> של המועמד/ת ובן/בת זוג - קצבאות, פנסיה, גמלאות</li><li><strong>הכנסות מנכסי מקרקעין</strong> של המועמד/ת ובן/בת זוג - שכר דירה (אם משכירים את הדירה)</li><li><strong>נכסים כספיים</strong> של המועמד/ת ובן/בת זוג - חסכונות מעל ${fmt(v('nursing_home_savings_threshold'))} ₪</li><li><strong>הכנסות שוטפות של הילדים</strong> (מעל גיל 21, המתגוררים בישראל)</li></ol><h4>עקרונות חישוב:</h4><ul><li>הגביה מתבצעת <strong>בסדר יורד</strong> - רק אם אין מספיק מהשלב הקודם</li><li>קיימת הפחתה של ${fmt(v('nursing_home_children_deduction'))} ₪ מההשתתפות של כל ילד (מאז 2019)</li><li>טווח ההשתתפות: בין 37% מקצבת זקנה ועד לכיסוי מלא</li></ul><h4>⚠️ נקודות חשובות:</h4><ul><li>קשיש יחיד עם דירה - <strong>חייב להשכיר</strong> את הדירה ולהעביר את השכר למשרד</li><li>חסכונות מעל ${fmt(v('nursing_home_savings_threshold'))} ₪ - עלולים לדחות את הקוד עד שהחסכונות יירדו</li></ul><h4>🧮 כלי עזר:</h4><p>קיים <a href='https://me.health.gov.il/older-adult/services-rights/hospitalization/nursing-hospitalization/nursing-code-calculator/' target='_blank' style='color:#4A90B5;font-weight:600;'>מחשבון קוד סיעודי מקוון</a> באתר משרד הבריאות לסימולציה ראשונית</p>`;
              }
            },
            {
              "title": "שלב 7: חתימה על התחייבויות",
              "content": "<h4>מה צריך לעשות?</h4><ul><li>כל המשתתפים בתשלום נקראים ללשכת הבריאות</li><li>חתימה על <strong>טופס התחייבות</strong> לתשלום חודשי</li><li>חתימה על <strong>הוראת קבע</strong> לחיוב חשבון</li></ul><h4>זהו האישור הסופי לקבלת הקוד!</h4><h4>דמי כניסה:</h4><p>תשלום ראשוני בגובה שני חודשי השתתפות (ללא החלק שמשולם מקצבאות)</p>"
            },
            {
              "title": "שלב 8: קבלת הקוד והכניסה לבית האבות",
              "content": "<h4>תוקף הקוד:</h4><p>3 חודשים מיום קבלתו</p><ul><li>יש לממש את הקוד ולהיכנס לבית אבות תוך 3 חודשים</li><li>בחירת בית אבות מרשימת המוסדות המאושרים</li></ul><h4>🔍 חיפוש מוסדות:</h4><p>ניתן לחפש מוסדות סיעודיים מאושרים דרך <a href='https://me.health.gov.il/older-adult/services-rights/hospitalization/nursing-hospitalization/nursing-facility-finder/' target='_blank' style='color:#4A90B5;font-weight:600;'>כלי חיפוש המוסדות</a> של משרד הבריאות</p><h4>חשוב לדעת:</h4><ul><li>אם המטופל שהה בבית אבות פרטי לפני הקוד - <strong>אסור למוסד לגבות הפרשי תשלום</strong></li><li>המעבר מפרטי לקוד לא מצדיק תשלומים נוספים</li></ul>"
            }
          ]
        },
        {
          "title": "זמנים",
          "content": "<table style='width:100%;border-collapse:collapse;'><tr style='background:#f0f0f0;'><th style='border:1px solid #ddd;padding:10px;text-align:right;'>שלב</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>זמן משוער</th></tr><tr><td style='border:1px solid #ddd;padding:10px;'>הגשת מסמכים רפואיים → ביקור בית</td><td style='border:1px solid #ddd;padding:10px;'>14 ימי עבודה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>ביקור בית → החלטת וועדת סיווג</td><td style='border:1px solid #ddd;padding:10px;'>10 ימי עבודה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>הגשת מסמכים כלכליים → חישוב השתתפות</td><td style='border:1px solid #ddd;padding:10px;'>13 ימי עבודה</td></tr><tr style='background:#f0f0f0;font-weight:bold;'><td style='border:1px solid #ddd;padding:10px;'><strong>סה\"כ תהליך</strong></td><td style='border:1px solid #ddd;padding:10px;'><strong>1-3 חודשים</strong></td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>תוקף הקוד למימוש</td><td style='border:1px solid #ddd;padding:10px;'>3 חודשים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>תוקף בדיקה כלכלית</td><td style='border:1px solid #ddd;padding:10px;'>כ-6 חודשים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>תוקף מסמכים רפואיים</td><td style='border:1px solid #ddd;padding:10px;'>3 חודשים</td></tr></table>"
        },
        {
          "title": "סכומים ומימון",
          contentFn: (nii) => {
            const v = key => nii[key] ? nii[key].value : 0;
            const fmt = n => Math.round(n).toLocaleString('he-IL');
            return `<h4>מימון משרד הבריאות:</h4><p>עד <strong>${fmt(v('nursing_home_health_ministry_max'))} ₪</strong> לחודש למוסד</p><h4>עלויות בית אבות סיעודי:</h4><p>בדרך כלל בין <strong>${fmt(v('nursing_home_cost_min'))}-${fmt(v('nursing_home_cost_max'))}+ ₪</strong> לחודש</p><h4>ההשתתפות העצמית:</h4><p>ההפרש בין המימון לעלות המלאה</p><h4>מה כולל המימון?</h4><ul><li>✅ טיפול סיעודי והשגחה רפואית 24/7</li><li>✅ דיור, ארוחות, חשמל, מים</li><li>✅ תרופות וטיפולים רפואיים</li><li>✅ פיזיותרפיה, ריפוי בעיסוק</li><li>✅ מוצרי ספיגה, מתקני עזר</li><li>✅ פעילויות חברתיות ותרבותיות</li><li>✅ שירותי כביסה וניקיון</li></ul><h4>⚠️ חשוב:</h4><p>התשלום למוסד הוא <strong>יחיד</strong> - אסור למוסד לגבות תשלומים נוספים!</p>`;
          }
        },
        {
          "title": "\"טרום קוד\" - פתרון זמני",
          "content": "<h4>מהו?</h4><p>אפשרות לשהות בבית אבות <strong>לפני</strong> קבלת הקוד הרשמי</p><p>במקרים דחופים שבהם לא ניתן לחכות 2-3 חודשים</p><h4>תנאים:</h4><ul><li>לא כל בתי האבות מציעים זאת</li><li>תשלום מופחת או סמלי לפי יכולת</li><li>התחייבות לשהות בבית האבות לפחות <strong>שנה</strong> לאחר קבלת הקוד</li></ul><h4>יתרון:</h4><p>הקשיש מתחיל להסתגל למקום החדש תוך כדי תהליך הבירוקרטיה</p>"
        },
        {
          "title": "ערעור והתנגדות",
          "content": "<h4>ניתן לערער על:</h4><ol><li><strong>החלטת וועדת הסיווג</strong> - אם נקבע שהקשיש אינו סיעודי/תשוש נפש</li><li><strong>גובה ההשתתפות העצמית</strong> - אם החישוב נראה לא נכון</li></ol><h4>איך מגישים ערעור?</h4><ul><li>פנייה בכתב לעובד הסוציאלי בלשכת הבריאות</li><li>צירוף מכתב מנומק ומסמכים רלוונטיים</li><li>הערר מועבר לוועדת ערר (מחוזית או ארצית)</li></ul><h4>⚠️ חשוב:</h4><p>ניתן להגיש ערר גם <strong>שנים לאחר</strong> קביעת ההשתתפות!</p><h4>חישוב מחדש:</h4><p>כל שנתיים או בכל שינוי במצב כלכלי/משפחתי</p>"
        }
      ]
    },
    {
      "id": "ministry_welfare",
      "title": "מסלול משרד הרווחה",
      "icon": "🤝",
      "subsections": [
        {
          "title": "למי מיועד?",
          "content": "<ul><li>אזרחים ותיקים <strong>עצמאיים</strong> או <strong>תשושים</strong> (תשושי גוף)</li><li>שאינם זקוקים לטיפול סיעודי 24 שעות</li><li>לא יכולים לממן בית אבות באופן עצמאי</li></ul>"
        },
        {
          "title": "התהליך המלא - שלב אחר שלב",
          "subsections": [
            {
              "title": "שלב 1: פנייה ראשונית",
              "content": "<h4>לאן פונים?</h4><p>עובד/ת סוציאלי/ת במחלקה לשירותים חברתיים באזור מגורי הקשיש</p><h4>מה קורה בפגישה הראשונית?</h4><ul><li>שיחה על המצב הכללי והצורך בבית אבות</li><li>הערכת מצב תפקודי וסוציאלי</li><li>הסבר על התהליך והזכויות</li><li>קבלת רשימת בתי אבות מתאימים</li></ul>"
            },
            {
              "title": "שלב 2: הגשת מסמכים",
              "content": "<h4>מסמכים נדרשים מהקשיש ובן/בת הזוג:</h4><ul><li>אישורי הכנסה מ-3 חודשים אחרונים (קצבת זקנה/שאירים, פנסיה, גמלאות ביטוח לאומי, כל הכנסה אחרת)</li><li>תנועות בחשבון הבנק (מספר חודשים אחורה)</li><li>פרטי חסכונות ופיקדונות</li><li>מסמכי נכסי מקרקעין (נסח טאבו אם יש דירה, חוזה שכירות אם שוכר)</li></ul><h4>מסמכים נדרשים מהילדים:</h4><ul><li>כל הילדים הבגירים <strong>חייבים</strong> לחשוף הכנסות</li><li>אישורי הכנסה (תלושים/שומה)</li><li>פרטי הוצאות (משכנתא, ילדים וכו')</li></ul><h4>⚠️ חשוב:</h4><p>אם ילד מסרב לחשוף הכנסות - <strong>לא ניתן להגיש בקשה!</strong></p>"
            },
            {
              "title": "שלב 3: ביקור בית",
              "content": "<ul><li>העובדת הסוציאלית עורכת ביקור בבית הקשיש</li><li>הערכת התנאים והסביבה</li><li>שיחה עם הקשיש ובני המשפחה</li></ul>"
            },
            {
              "title": "שלב 4: מבחן הכנסות וקביעת השתתפות",
              "content": "<h4>איך מחושב?</h4><p><strong>הכנסה ממוצעת לנפש</strong> = (סך הכנסות של 3 חודשים) / מספר נפשות במשפחה / 3</p><h4>מי נכלל בהגדרת \"משפחה\"?</h4><ul><li>הורים</li><li>ילדים עד גיל 18</li><li>ילדים בשירות חובה (צה\"ל/שירות לאומי)</li></ul><h4>החישוב נקבע על פי:</h4><ul><li>הכנסות שוטפות של הקשיש ובן/בת הזוג</li><li>נכסי מקרקעין (דירה בבעלות → ניתן לדרוש השכרה)</li><li>חסכונות (יכול להשפיע על דחיית הסיוע)</li><li>הכנסות הילדים</li></ul>"
            },
            {
              "title": "שלב 5: קביעת ההשתתפות העצמית",
              contentFn: (nii) => {
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = n => Math.round(n).toLocaleString('he-IL');
                return `<h4>הקשיש ובן/בת הזוג:</h4><ul><li>העברת <strong>80%</strong> מקצבת הזקנה למימון בית אבות</li><li>אם יש פנסיה: העברת <strong>כל הפנסיה</strong> + <strong>65%</strong> מקצבת הזקנה</li><li>השארת כ-<strong>${fmt(v('nursing_home_pocket_money'))} ₪</strong> "דמי כיס" לקשיש</li></ul><h4>הילדים:</h4><ul><li>השתתפות נוספת בהתאם להכנסותיהם</li><li>קיימת מדרגיות: ככל שההכנסה גבוהה יותר - ההשתתפות גבוהה יותר</li><li>ילד שכבר משלם עבור הורה אחר - לא ישלם פעמיים</li><li>התחשבות בהוצאות מיוחדות (ילדים, משכנתא, ילד נכה)</li></ul><h4>מימון משרד הרווחה:</h4><p>ההפרש בין עלות בית האבות לבין ההשתתפויות</p>`;
              }
            },
            {
              "title": "שלב 6: ועדת הצבה",
              "content": "<h4>מטרה:</h4><p>קביעת בית האבות המתאים</p><h4>משתתפים בוועדה:</h4><ul><li>העובד/ת הסוציאלי/ת המטפל/ת</li><li>רכז אזורי</li><li>רכז סידור מוסדי מטעם הרווחה</li></ul><h4>בחינה:</h4><ul><li>רמת התפקוד של הקשיש</li><li>התאמה למוסד ספציפי</li><li>העדפות הקשיש (מיקום, סוג מוסד)</li></ul><h4>זכות הקשיש:</h4><p>להביע דעתו על מיקום וסוג בית האבות</p>"
            },
            {
              "title": "שלב 7: חתימה על מסמכים",
              "content": "<h4>מה חותמים?</h4><ul><li><strong>טופס ויתור</strong> על הפנסיה</li><li><strong>טופס ויתור</strong> על קצבת ביטוח לאומי</li><li><strong>התחייבויות</strong> לתשלום ההשתתפות העצמית</li><li><strong>הוראות קבע</strong> לחיוב חשבון</li></ul>"
            }
          ]
        },
        {
          "title": "זמנים",
          "content": "<table style='width:100%;border-collapse:collapse;'><tr style='background:#f0f0f0;'><th style='border:1px solid #ddd;padding:10px;text-align:right;'>שלב</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>זמן משוער</th></tr><tr><td style='border:1px solid #ddd;padding:10px;'>פנייה ראשונית → קבלת כל המסמכים</td><td style='border:1px solid #ddd;padding:10px;'>משתנה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'>בדיקת זכאות וחישוב</td><td style='border:1px solid #ddd;padding:10px;'>25 ימי עבודה מקבלת כל המסמכים</td></tr><tr style='background:#f0f0f0;font-weight:bold;'><td style='border:1px solid #ddd;padding:10px;'><strong>סה\"כ תהליך</strong></td><td style='border:1px solid #ddd;padding:10px;'><strong>כ-2-3 חודשים</strong></td></tr></table>"
        },
        {
          "title": "סכומים ומימון",
          contentFn: (nii) => {
            const v = key => nii[key] ? nii[key].value : 0;
            const fmt = n => Math.round(n).toLocaleString('he-IL');
            return `<h4>עלויות בית אבות לעצמאיים/תשושים:</h4><p>בדרך כלל <strong>${fmt(v('nursing_home_independent_min'))}-${fmt(v('nursing_home_independent_max'))} ₪</strong> לחודש</p><h4>מה כולל?</h4><ul><li>✅ דיור וארוחות (3 עיקריות + ביניים)</li><li>✅ חשמל ומים</li><li>✅ שירותי ניקיון</li><li>✅ טיפול רפואי שוטף</li><li>✅ פעילויות חברתיות ותרבותיות</li><li>✅ חוגים והעשרה</li></ul><h4>מה לא כלול?</h4><ul><li>❌ תרופות</li><li>❌ שירותי אמבולנס</li><li>❌ כבלים וטלפון</li></ul>`;
          }
        },
        {
          "title": "ערעור והתנגדות",
          "content": "<h4>ניתן לערער על:</h4><ul><li>סכום ההשתתפות העצמית</li><li>בית האבות שנבחר</li><li>דחיית הבקשה</li></ul><h4>איך מגישים ערעור?</h4><ul><li>דרך העובד/ת הסוציאלי/ת בלבד</li><li>הגשת מסמכים תומכים על מצב כלכלי קשה</li><li>פנייה לוועדת ערר במשרד הרווחה</li></ul>"
        }
      ]
    },
    {
      "id": "comparison",
      "title": "טבלאות השוואה",
      "icon": "📊",
      "subsections": [
        {
          "title": "השוואה: משרד הבריאות vs משרד הרווחה",
          contentFn: (nii) => {
            const v = key => nii[key] ? nii[key].value : 0;
            const fmt = n => Math.round(n).toLocaleString('he-IL');
            return `<table style='width:100%;border-collapse:collapse;'><tr style='background:#f0f0f0;'><th style='border:1px solid #ddd;padding:10px;text-align:right;'>קריטריון</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>משרד הבריאות</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>משרד הרווחה</th></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>אוכלוסיית יעד</strong></td><td style='border:1px solid #ddd;padding:10px;'>סיעודיים, תשושי נפש</td><td style='border:1px solid #ddd;padding:10px;'>עצמאיים, תשושי גוף</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>רמת טיפול</strong></td><td style='border:1px solid #ddd;padding:10px;'>24 שעות ביממה</td><td style='border:1px solid #ddd;padding:10px;'>חלקי, לא מסביב לשעון</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>לאן פונים?</strong></td><td style='border:1px solid #ddd;padding:10px;'>לשכת הבריאות המחוזית</td><td style='border:1px solid #ddd;padding:10px;'>מחלקה לשירותים חברתיים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>סוג בתי אבות</strong></td><td style='border:1px solid #ddd;padding:10px;'>ברישיון משרד הבריאות</td><td style='border:1px solid #ddd;padding:10px;'>ברישיון משרד הרווחה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>משך תהליך</strong></td><td style='border:1px solid #ddd;padding:10px;'>1-3 חודשים</td><td style='border:1px solid #ddd;padding:10px;'>2-3 חודשים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>מימון ממשלתי</strong></td><td style='border:1px solid #ddd;padding:10px;'>עד ${fmt(v('nursing_home_health_ministry_max'))} ₪ לחודש</td><td style='border:1px solid #ddd;padding:10px;'>משתנה - ההפרש בין עלות להשתתפות</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>עלות בית אבות</strong></td><td style='border:1px solid #ddd;padding:10px;'>${fmt(v('nursing_home_cost_min'))}-${fmt(v('nursing_home_cost_max'))}+ ₪</td><td style='border:1px solid #ddd;padding:10px;'>${fmt(v('nursing_home_independent_min'))}-${fmt(v('nursing_home_independent_max'))} ₪</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>מה כלול?</strong></td><td style='border:1px solid #ddd;padding:10px;'>כולל תרופות וטיפולים</td><td style='border:1px solid #ddd;padding:10px;'>לא כולל תרופות</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>השתתפות מהקשיש</strong></td><td style='border:1px solid #ddd;padding:10px;'>לפי חישוב מורכב</td><td style='border:1px solid #ddd;padding:10px;'>80% קצבה או 100% פנסיה + 65% קצבה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>השתתפות הילדים</strong></td><td style='border:1px solid #ddd;padding:10px;'>לפי הכנסה - מדורג</td><td style='border:1px solid #ddd;padding:10px;'>לפי הכנסה - מדורג</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>תוקף אישור</strong></td><td style='border:1px solid #ddd;padding:10px;'>3 חודשים למימוש</td><td style='border:1px solid #ddd;padding:10px;'>ללא הגבלת זמן</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>אפשרות "טרום קוד"</strong></td><td style='border:1px solid #ddd;padding:10px;'>כן, בחלק מהמקומות</td><td style='border:1px solid #ddd;padding:10px;'>לא</td></tr></table>`;
          }
        },
        {
          "title": "מסמכים נדרשים - סיכום משווה",
          "content": "<table style='width:100%;border-collapse:collapse;'><tr style='background:#f0f0f0;'><th style='border:1px solid #ddd;padding:10px;text-align:right;'>סוג מסמך</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>משרד הבריאות</th><th style='border:1px solid #ddd;padding:10px;text-align:right;'>משרד הרווחה</th></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>טפסים רשמיים</strong></td><td style='border:1px solid #ddd;padding:10px;'>בקשה לסידור מוסדי</td><td style='border:1px solid #ddd;padding:10px;'>בקשה למימון</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>תעודת זהות</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ + ספח</td><td style='border:1px solid #ddd;padding:10px;'>✅ + ספח</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>מסמכים רפואיים</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ טופס רפואי מיוחד, סיכומים, בדיקות</td><td style='border:1px solid #ddd;padding:10px;'>❌ לא נדרש</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>דו\"ח סוציאלי</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ מפורט</td><td style='border:1px solid #ddd;padding:10px;'>✅ מעובדת הרווחה</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>אישורי הכנסה</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ 3 חודשים</td><td style='border:1px solid #ddd;padding:10px;'>✅ 3 חודשים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>תנועות בנק</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ 3 חודשים</td><td style='border:1px solid #ddd;padding:10px;'>✅ כמה חודשים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>נכסי מקרקעין</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ נסח טאבו/חוזה שכירות</td><td style='border:1px solid #ddd;padding:10px;'>✅ נסח טאבו/חוזה שכירות</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>חסכונות ופיקדונות</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ ריכוז מפורט</td><td style='border:1px solid #ddd;padding:10px;'>✅ פרטים כלליים</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>שאלונים חתומים</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ בפני עורך דין</td><td style='border:1px solid #ddd;padding:10px;'>❌ לא נדרש</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>אפוטרופסות/ייפוי כוח</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ אם יש פגיעה בשיפוט</td><td style='border:1px solid #ddd;padding:10px;'>❌ בד\"כ לא נדרש</td></tr><tr><td style='border:1px solid #ddd;padding:10px;'><strong>מסמכי הילדים</strong></td><td style='border:1px solid #ddd;padding:10px;'>✅ שאלונים מנותרים + אישורים</td><td style='border:1px solid #ddd;padding:10px;'>✅ אישורי הכנסה</td></tr></table>"
        }
      ]
    },
    {
      "id": "tips",
      "title": "עצות זהב",
      "icon": "💡",
      "subsections": [
        {
          "title": "לפני תחילת התהליך",
          "subsections": [
            {
              "title": "שיחה משפחתית פתוחה",
              "content": "<ul><li>דיון על הצורך והאפשרויות</li><li>וידוא שכל הילדים מוכנים לשתף פעולה</li><li>חלוקת אחריות על הטיפול בתהליך</li></ul>"
            },
            {
              "title": "ביקורים בבתי אבות",
              "content": "<ul><li>סיור בלפחות 3-4 מוסדות</li><li>בדיקה שהם עובדים עם משרד הבריאות/רווחה</li><li>שיחה עם דיירים ומשפחות</li></ul>"
            },
            {
              "title": "בדיקת זכאות ראשונית",
              "content": "<ul><li>פנייה לעובדת סוציאלית לשיחה ראשונית</li><li>שימוש במחשבון המקוון (משרד הבריאות)</li><li>הבנת ההשתתפות הצפויה</li></ul>"
            }
          ]
        },
        {
          "title": "במהלך התהליך",
          "subsections": [
            {
              "title": "ארגון המסמכים",
              "content": "<ul><li>תיקייה מסודרת עם כל המסמכים</li><li>צילומים + מקור</li><li>מעקב אחר תוקף המסמכים</li></ul>"
            },
            {
              "title": "תקשורת שוטפת",
              "content": "<ul><li>מעקב אחרי התקדמות התהליך</li><li>שמירה על קשר עם העובדת הסוציאלית</li><li>תיעוד כל שיחה/פגישה</li></ul>"
            },
            {
              "title": "גמישות",
              "content": "<ul><li>נכונות להגיש מסמכים נוספים</li><li>היענות לבקשות והבהרות</li><li>התאמת ציפיות לזמנים הריאליים</li></ul>"
            }
          ]
        },
        {
          "title": "אחרי קבלת האישור",
          "subsections": [
            {
              "title": "מעקב אחר התשלומים",
              "content": "<ul><li>בדיקה שהתשלומים מתבצעים כסדרם</li><li>שמירת אישורים</li></ul>"
            },
            {
              "title": "ליווי ההסתגלות",
              "content": "<ul><li>ביקורים תכופים בתקופה הראשונה</li><li>קשר עם הצוות המטפל</li><li>תמיכה רגשית</li></ul>"
            },
            {
              "title": "עדכונים שוטפים",
              "content": "<ul><li>דיווח על שינויים במצב הבריאותי</li><li>עדכון שינויים כלכליים</li><li>בקשה לחישוב מחדש במידת הצורך</li></ul>"
            }
          ]
        }
      ]
    },
    {
      "id": "faq",
      "title": "שאלות נפוצות",
      "icon": "❓",
      "subsections": [
        {
          "title": "מקרים דחופים ⚡",
          "subsections": [
            {
              "title": "ההורה צריך להשתחרר מבית החולים למוסד - מה עושים? למי פונים?",
              "content": "<p><strong>מיידי:</strong> פנייה לעובדת סוציאלית של בית החולים - היא תסייע בכל התהליך. היא יכולה לזרז הליך קבלת קוד ולמצוא מקום זמין.</p><p><strong>טרום קוד:</strong> רוב המוסדות מאפשרים כניסה מיידית עם הנחה עד לקבלת קוד רשמי.</p>"
            },
            {
              "title": "איך אפשר להעביר מבית החולים למוסד עד שעושים התאמה בדירה?",
              "content": "<p><strong>פתרון זמני:</strong> אפשרות של \"טרום קוד\" או \"אשפוז ביניים\" - כניסה מיידית למוסד בהנחה מיוחדת עד להשלמת התהליך הרשמי. לפנות דרך עובדת סוציאלית של בית החולים שתמצא מקום זמין.</p>"
            },
            {
              "title": "בית החולים לוחץ לפנות את המיטה - אין זמן לחכות לקוד, מה עושים?",
              "content": "<p><strong>אפשרויות:</strong></p><ul><li><strong>טרום קוד:</strong> כניסה מיידית עם הנחה של 50-70% עד קבלת הקוד</li><li><strong>מימון פרטי זמני:</strong> תשלום מלא לחודש-חודשיים עד לאישור הקוד, אח\"כ החזר יחסי</li><li><strong>יחידת המשך טיפול:</strong> חלק מבתי החולים מציעים יחידות ביניים</li><li><strong>דחיית שחרור:</strong> בתנאים מסוימים אפשר לדרוש ארכה של מספר ימים</li></ul>"
            },
            {
              "title": "אירוע חריף (שבץ/נפילה/שבר) - ההורה פתאום סיעודי, איך ממשיכים?",
              "content": "<p><strong>מסלול מהיר:</strong></p><ol><li>דיבור עם העובדת הסוציאלית בבית החולים עוד במהלך האשפוז</li><li>הכנת מסמכים רפואיים במקביל לאשפוז (הצוות הרפואי יסייע)</li><li>פנייה מיידית ללשכת הבריאות - במקרי חירום יש מסלול מזורז</li><li>בדיקת טרום קוד במספר מוסדות קרובים שיש בהם מקום פנוי</li><li>אם אין ברירה - שיקום בבית עם סיוע מרוכז עד להסדרה סופית</li></ol>"
            },
            {
              "title": "ההורה השני נפטר - הנותר לבד במצב קשה ולא בטוח, צריך פתרון מיידי!",
              "content": "<p><strong>מסלול חירום:</strong></p><ul><li><strong>שעות-ימים:</strong> מטפלת צמודת לילה דרך ביטוח לאומי (זכאות מיידית לאחר פטירה)</li><li><strong>שבוע-שבועיים:</strong> דיור זמני אצל בני משפחה או שירות \"מנוחה קצרה\" (Respite Care) במוסדות מסוימים</li><li><strong>קבוע:</strong> הגשה דחופה לקוד מהיר - באובדן בן/בת זוג + החמרה במצב יש טיפול מזורז</li><li><strong>חלופה:</strong> יש מוסדות שמקבלים באופן פרטי מיידית ואח\"כ עוברים לקוד</li></ul><p class='tip-box' style='background:#FFF3CD;border-right:4px solid #FFC107;padding:15px;margin-top:15px;'><strong>💡 טיפ חשוב:</strong> במקרי חירום תמיד להתחיל עם העובדת הסוציאלית של בית החולים או לשכת הבריאות - הן יודעות את המסלולים המהירים והפתרונות הזמינים!</p>"
            }
          ]
        },
        {
          "title": "הכרעה ותזמון",
          "subsections": [
            {
              "title": "מתי כדאי לשקול מעבר לבית אבות?",
              "content": "<p>כאשר יש החמרה במצב הבריאותי, נפילות חוזרות, אשפוזים תכופים, בדידות קשה, או כשהמשפחה לא מצליחה לתת מענה הולם. עדיף לשקול מעבר כשעדיין יש כוחות ולא בעקבות משבר.</p>"
            },
            {
              "title": "איך יודעים שהגיע הזמן לעבור למוסד?",
              "content": "<p><strong>סימנים:</strong></p><ul><li>קושי בפעולות יומיומיות (אכילה, רחצה, הלבשה)</li><li>ירידה בשמירה על ניקיון אישי וסביבתי</li><li>בלבול, שכחת תרופות</li><li>פחד מנפילות</li><li>מצב שמסכן את החיים</li></ul>"
            },
            {
              "title": "האם צריך לחכות עד שיהיה ממש לא אפשר בבית?",
              "content": "<p><strong>לא.</strong> מעבר מתוכנן כשעדיין יש כוחות מאפשר הסתגלות טובה יותר. מעבר דחוף ממשבר רפואי קשה הרבה יותר רגשית ופיזית.</p>"
            },
            {
              "title": "האם מעבר מוקדם יותר עדיף על מעבר דחוף?",
              "content": "<p><strong>כן.</strong> מעבר מתוכנן מאפשר לבחור מוסד איכותי, להכין את ההורה נפשית, ולמנוע מעבר ישירות מבית החולים למחלקה סיעודית כשהמצב התדרדר.</p>"
            }
          ]
        },
        {
          "title": "סוגי מוסדות",
          "subsections": [
            {
              "title": "מה ההבדל בין בית אבות לדיור מוגן?",
              "content": "<p><strong>דיור מוגן:</strong> דירות פרטיות לעצמאיים עם שירותים נלווים, מימון פרטי.</p><p><strong>בית אבות:</strong> טיפול סיעודי 24/7, אפשרות לסיוע ממשלתי, אין עצמאות מלאה.</p>"
            },
            {
              "title": "מה זה בית אבות סיעודי?",
              "content": "<p>מוסד לקשישים שזקוקים לעזרה בכל פעולות החיים: אכילה, רחצה, הלבשה, ניידות. כולל טיפול רפואי וסיעודי 24 שעות ביממה.</p>"
            },
            {
              "title": "מה זה תשוש נפש ואיך יודעים אם ההורה צריך מחלקה כזו?",
              "content": "<p><strong>תשוש נפש =</strong> דמנציה, אלצהיימר, או ירידה קוגניטיבית קשה.</p><p><strong>סימנים:</strong> בלבול, שכחה חמורה, נדודים, אובדן שליטה, צורך בהשגחה 24/7. צריך אבחון רפואי.</p>"
            },
            {
              "title": "איך יודעים איזה סוג מוסד מתאים להורה שלי?",
              "content": "<p><strong>לפי הערכת תפקוד (ADL):</strong></p><ul><li><strong>עצמאי</strong> → דיור מוגן</li><li><strong>תשוש</strong> → בית אבות רגיל</li><li><strong>סיעודי</strong> → בית אבות סיעודי</li><li><strong>דמנציה</strong> → מחלקת תשושי נפש</li></ul><p>יש להתייעץ עם רופא גריאטר ועובדת סוציאלית.</p>"
            }
          ]
        },
        {
          "title": "הליכים ותהליכים",
          "subsections": [
            {
              "title": "איך מתחילים את התהליך של העברה לבית אבות?",
              "content": "<p><strong>סיעודי/תשוש נפש:</strong> פנייה ללשכת הבריאות האזורית + עובדת סוציאלית.</p><p><strong>עצמאי/תשוש:</strong> פנייה למחלקה לשירותים חברתיים במקום המגורים.</p>"
            },
            {
              "title": "מה זה קוד משרד הבריאות ואיך מקבלים אותו?",
              "content": "<p>אישור להשתתפות ממשלתית במימון אשפוז סיעודי/תשוש נפש. דורש הגשת מסמכים רפואיים וכלכליים ללשכת בריאות. המדינה משלמת חלק, המשפחה משלימה לפי הכנסות.</p>"
            },
            {
              "title": "כמה זמן לוקח התהליך מההגשה עד הקבלה?",
              "content": "<p><strong>משרד בריאות:</strong> 1-3 חודשים (14 ימים לביקור בית, 10 ימים לועדת סיווג, 13 ימים לחישוב השתתפות).</p><p><strong>משרד רווחה:</strong> 2-3 חודשים.</p><p>במקרי חירום יש מסלולים מזורזים.</p>"
            },
            {
              "title": "אילו מסמכים צריך להכין?",
              "content": "<p><strong>רפואיים:</strong> סיכומים רפואיים, אישורי רופאים, בדיקות דם, דו\"ח תפקודי.</p><p><strong>כלכליים:</strong> אישורי הכנסה (פנסיה/קצבאות), תנועות בנק 3 חודשים, נסח טאבו, הצהרות של כל הילדים מעל גיל 21.</p>"
            },
            {
              "title": "האם צריך את הסכמת ההורה או שאפשר להעביר בכוח?",
              "content": "<p>דרוש אישור ההורה או אפוטרופוס חוקי. אם יש פגיעה בשיפוט - צריך למנות אפוטרופוס דרך בית משפט או אב בית דין.</p>"
            },
            {
              "title": "מה קורה אם ההורה מסרב לעבור?",
              "content": "<p>צריך שיחה רגישה, הסבר על היתרונות, שיתוף בבחירה, ביקור במוסדות יחד. אם יש סכנה לחיים ואין שיפוט - דרך אפוטרופוס.</p>"
            },
            {
              "title": "האם יש הגבלת גיל?",
              "content": "<ul><li>חייבים להיות מעל גיל פרישה</li><li>אין הגבלת גיל עליונה</li></ul>"
            }
          ]
        },
        {
          "title": "מימון ועלויות",
          "subsections": [
            {
              "title": "כמה עולה בית אבות סיעודי?",
              contentFn: (nii) => {
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = n => Math.round(n).toLocaleString('he-IL');
                return `<p><strong>חדר משותף:</strong> ${fmt(v('nursing_home_shared_room_min'))}-${fmt(v('nursing_home_shared_room_max'))} ₪/חודש</p><p><strong>חדר פרטי:</strong> ${fmt(v('nursing_home_private_room_min'))}-${fmt(v('nursing_home_private_room_max'))} ₪/חודש</p><p><strong>תשושי נפש:</strong> דומה</p><p>המחיר תלוי במיקום ובמוסד.</p>`;
              }
            },
            {
              "title": "האם יש סיוע מהמדינה במימון?",
              "content": "<p><strong>כן.</strong></p><ul><li><strong>סיעודי/תשוש נפש:</strong> קוד משרד בריאות</li><li><strong>עצמאי/תשוש:</strong> סיוע משרד רווחה</li><li>תלוי בהכנסות המשפחה</li><li>יש גם ביטוח סיעודי פרטי, קרנות לניצולי שואה, ומשכנתא הפוכה</li></ul>"
            },
            {
              "title": "מה זה \"טרום קוד\" ואיך זה עובד?",
              "content": "<p>אפשרות לכניסה לבית אבות לפני קבלת הקוד הרשמי, בתשלום מופחת (הנחה של 3,000-10,000 ₪). דורש התחייבות לשהייה של שנה לאחר קבלת הקוד.</p>"
            },
            {
              "title": "האם הילדים חייבים להשתתף בתשלום?",
              "content": "<p><strong>כן.</strong> כל הילדים מעל גיל 21 (תושבי ישראל) נדרשים לחשוף הכנסות ולהשתתף לפי יכולת כלכלית. <strong>אם ילד מסרב - הבקשה נדחית!</strong></p>"
            },
            {
              "title": "מה קורה אם אין לנו כסף לשלם?",
              "content": "<p>המדינה תממן חלק גדול ממחיר המקום אם אין הכנסות גבוהות. יש להגיש בקשה מפורטת. במקרים קשים - פנייה לקרנות צדקה, עמותות, או משכנתא הפוכה.</p>"
            },
            {
              "title": "האם צריך למכור את הדירה של ההורה?",
              "content": "<p><strong>לא חייבים למכור מיד</strong>, אבל:</p><ul><li>קשיש יחיד <strong>עם דירה</strong> - משרד הבריאות ידרוש להשכיר את הדירה ולהעביר שכר דירה כהשתתפות</li><li>זוג - אפשר להשאיר</li></ul>"
            },
            {
              "title": "האם ההורה מפסיק לקבל גמלת סיעוד במעבר לבית אבות?",
              "content": "<p><strong>כן.</strong> גמלת סיעוד נועדה לקשישים בקהילה. בבית אבות מקבלים את כל השירותים, לכן הגמלה מבוטלת.</p><p><strong>חריג:</strong> דיור מוגן - אפשר להמשיך לקבל.</p>"
            },
            {
              "title": "האם יש פגיעה בקצבת הזקנה?",
              contentFn: (nii) => {
                const v = key => nii[key] ? nii[key].value : 0;
                const fmt = n => Math.round(n).toLocaleString('he-IL');
                return `<ul><li>הקצבה <strong>לא מבוטלת</strong></li><li>אבל רובה עובר למימון בית האבות</li><li>נשאר "דמי כיס" של כ-${fmt(v('nursing_home_pocket_money'))} ₪</li></ul>`;
              }
            },
            {
              "title": "מה אם ילד גר בחו\"ל?",
              "content": "<ul><li>ילדים שגרים בחו\"ל - <strong>לא</strong> נכללים בחישוב</li><li>רק ילדים המתגוררים בישראל</li></ul>"
            },
            {
              "title": "מה אם יש ביטוח סיעודי פרטי?",
              "content": "<ul><li>כדאי לבדוק את האפשרות לממש</li><li>יכול לעזור במימון ההשתתפות העצמית</li><li>לא מחליף את הקוד</li></ul>"
            }
          ]
        },
        {
          "title": "בחירת מוסד",
          "subsections": [
            {
              "title": "איך בוחרים בית אבות מתאים?",
              "content": "<p><strong>לבדוק:</strong></p><ul><li>רישיון תקף</li><li>מיקום נוח למשפחה</li><li>התאמת המחלקה לצרכים</li><li>רמת הצוות, ניקיון, ריח, אווירה</li><li>פעילויות</li><li>תגובות משפחות אחרות</li></ul><p>לבקר מספר פעמים בשעות שונות.</p>"
            },
            {
              "title": "איך בודקים אם למוסד יש רישיון?",
              "content": "<p>באתר משרד הבריאות יש <a href='https://me.health.gov.il/older-adult/services-rights/hospitalization/nursing-hospitalization/nursing-facility-finder/' target='_blank' style='color:#4A90B5;font-weight:600;'>רשימה של כל המוסדות המורשים</a>.</p><p><strong>⚠️ בית אבות ללא רישיון = אסור!</strong> אין פיקוח וסכנה לבריאות.</p>"
            },
            {
              "title": "האם כדאי לבקר במקום לפני ההחלטה?",
              "content": "<p><strong>חובה!</strong> לבקר לפחות 2-3 פעמים, בימים ושעות שונות (כולל שבת/ערב). לשוחח עם דיירים ומשפחות, לראות ארוחות, לבדוק ניקיון וריחות.</p>"
            },
            {
              "title": "האם אפשר לקבל זוג בחדר אחד?",
              "content": "<p>כן, רוב המוסדות מציעים חדרים לזוגות. חשוב לוודא שרמת התפקוד דומה, או שהמוסד יכול לטפל בשני רמות שונות באותו חדר.</p>"
            }
          ]
        },
        {
          "title": "אחרי המעבר",
          "subsections": [
            {
              "title": "האם ההורה יכול לקחת את המטפלת שלו לבית אבות?",
              "content": "<p><strong>בדרך כלל לא.</strong> בבית אבות יש צוות מלא שנותן את כל השירותים.</p><p><strong>דיור מוגן:</strong> אפשר.</p><p><strong>חריג:</strong> אם המשפחה משלמת באופן פרטי ומוכנה לממן מטפלת נוספת.</p>"
            },
            {
              "title": "האם אפשר לבקר בכל שעה?",
              "content": "<p>כן, ביקורי משפחה מותרים תמיד. רצוי להתחשב בשעות מנוחה (צהריים/לילה) ולתאם ביקורים במועדים נוחים לדייר.</p>"
            },
            {
              "title": "מה עושים אם ההורה לא מסתגל?",
              "content": "<p><strong>תקופת הסתגלות נורמלית:</strong> 2-6 שבועות.</p><p><strong>חשוב:</strong> ביקורים תכופים, הבאת חפצים אישיים, שיתוף בפעילויות, שיחה עם צוות.</p><p>אם אחרי 3 חודשים אין שיפור - לשקול מעבר למוסד אחר.</p>"
            },
            {
              "title": "מה עושים אם יש תלונות על הטיפול?",
              "content": "<p>תחילה לדבר עם העובדת הסוציאלית של המוסד. אם אין תגובה - להגיש תלונה למשרד הבריאות/רווחה.</p><p><strong>במקרי התעללות:</strong> מיד למשטרה ולפקיד הסעד.</p>"
            },
            {
              "title": "מה קורה במקרה של החמרה במצב הבריאותי?",
              "content": "<p>מוסדות טובים מאפשרים מעבר בין מחלקות (עצמאי→תשוש→סיעודי) באותו מקום. אם צריך אשפוז - פינוי לבית חולים ממומן ע\"י המוסד (בעלי קוד).</p>"
            },
            {
              "title": "האם אפשר לעבור בין בתי אבות?",
              "content": "<ul><li>כן, אבל צריך תיאום מול משרד הבריאות/רווחה</li><li>הקוד יכול לעבור למוסד אחר (בתנאים)</li></ul>"
            },
            {
              "title": "מה קורה אם בן/בת הזוג נפטר/ת?",
              "content": "<ul><li>נערך חישוב זכאות מחדש</li><li>ההשתתפות העצמית משתנה</li></ul>"
            }
          ]
        }
      ]
    },
    {
      "id": "resources",
      "title": "גורמי עזר ומידע",
      "icon": "🔗",

      "subsections": [
        {
          "title": "משרד הבריאות",
          "content": "<ul><li><strong>אתר הגיל השלישי:</strong> <a href='https://me.health.gov.il/older-adult' target='_blank' style='color:#4A90B5;font-weight:600;'>me.health.gov.il/older-adult</a></li><li><strong>מחשבון קוד סיעודי:</strong> <a href='https://me.health.gov.il/older-adult/services-rights/hospitalization/nursing-hospitalization/nursing-code-calculator/' target='_blank' style='color:#4A90B5;font-weight:600;'>כלי חישוב השתתפות</a></li><li><strong>חיפוש מוסדות סיעודיים:</strong> <a href='https://me.health.gov.il/older-adult/services-rights/hospitalization/nursing-hospitalization/nursing-facility-finder/' target='_blank' style='color:#4A90B5;font-weight:600;'>מאגר מוסדות מאושרים</a></li><li><strong>טפסים:</strong> אתר משרד הבריאות → שירותים → טפסים לציבור</li></ul>"
        },
        {
          "title": "משרד הרווחה",
          "content": "<ul><li><strong>אתר:</strong> <a href='https://www.molsa.gov.il' target='_blank' style='color:#4A90B5;font-weight:600;'>www.molsa.gov.il</a></li><li><strong>מוקד טלפוני:</strong> 118 (מוקד חירום)</li><li><strong>מחלקה לשירותים חברתיים:</strong> לפי רשות מקומית</li></ul>"
        },
        {
          "title": "ביטוח לאומי",
          "content": "<ul><li><strong>אתר:</strong> <a href='https://www.btl.gov.il' target='_blank' style='color:#4A90B5;font-weight:600;'>www.btl.gov.il</a></li><li><strong>מוקד טלפוני:</strong> *6050</li></ul>"
        },
        {
          "title": "כל-זכות - מרכז מידע לזכויות חברתיות",
          "content": "<ul><li><strong>אתר:</strong> <a href='https://www.kolzchut.org.il' target='_blank' style='color:#4A90B5;font-weight:600;'>www.kolzchut.org.il</a></li><li>מידע מקיף על זכויות אזרחים ותיקים</li></ul>"
        },
        {
          "title": "פורטלי מידע למשפחות",
          "content": "<ul><li><strong>מרכז מידע רעות-אשל:</strong> <a href='https://www.reutheshel.org.il' target='_blank' style='color:#4A90B5;font-weight:600;'>www.reutheshel.org.il</a> - מרכז מידע לגיל השלישי</li><li><strong>אתר \"ההורים שלי\":</strong> <a href='https://www.myparents.co.il' target='_blank' style='color:#4A90B5;font-weight:600;'>www.myparents.co.il</a> - פורטל מידע למשפחות</li><li><strong>יועצים גריאטריים פרטיים</strong></li></ul>"
        }
      ]
    }
  ]
};

// Export for Node.js (if used in Node)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NURSING_HOME_DATA };
}
