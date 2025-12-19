// סקריפט לעדכון אוטומטי של בסיס נתונים זכויות אזרחים ותיקים
// scripts/update-data.js

const fs = require('fs').promises;
const path = require('path');

// קטגוריות המידע
const CATEGORIES = [
  'social_security',
  'nursing',
  'tax_benefits',
  'transportation',
  'housing',
  'additional'
];

async function searchWithAI(topic, apiKey) {
  try {
    console.log(`🔍 מחפש מידע על: ${topic}`);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [
          {
            role: 'user',
            content: `חפש מידע מעודכן ומקיף על ${topic} לאזרחים ותיקים בישראל.

תמקד את החיפוש במקורות רשמיים:
- אתר הביטוח הלאומי (btl.gov.il)
- משרד הרווחה (gov.il/molsa)
- משרד הבריאות (health.gov.il)
- אתר gov.il

חשוב מאוד: החזר את התשובה בפורמט HTML טהור בלבד!
- השתמש בתגיות HTML: <h2>, <h3>, <ul>, <li>, <strong>, <p>, <table>
- אל תשתמש ב-Markdown (אל תשתמש ב-#, ##, ###, -, *)
- כלול מספרים, סכומים, תאריכים רלוונטיים
- כתוב בעברית פשוטה וברורה
- אל תכלול תג <html> או <body> - רק את תוכן ה-HTML`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // חילוץ הטקסט מהתשובה
    const textContent = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    return textContent;

  } catch (error) {
    console.error(`❌ שגיאה בחיפוש ${topic}:`, error.message);
    return null;
  }
}

async function updateAllCategories(apiKey) {
  const topics = {
    social_security: {
      title: 'קצבאות זקנה וזכויות ביטוח לאומי',
      prompt: `קצבאות זקנה וזכויות ביטוח לאומי לאזרחים ותיקים בישראל - חפש ב-btl.gov.il ו-gov.il מידע מעודכן על:
- גיל פרישה מדויק (גברים ונשים)
- סכומי קצבת זקנה (עד גיל 80 ומגיל 80+)
- תוספת השלמת הכנסה - תנאים וסכומים
- גמלת הבטחת הכנסה
- תנאי זכאות מפורטים
- מסמכים נדרשים להגשת תביעה
- הנחות בתחבורה ציבורית (50%)
- הנחות במוזיאונים וגנים לאומיים
- תוספת מים במחיר מופחת
- פרטי קשר ומוקדי מידע
הצג בפורמט HTML מסודר עם כותרות ורשימות`
    },

    nursing: {
      title: 'זכויות סיעוד לאזרחים ותיקים',
      prompt: `חפש מידע מקיף ומעודכן על זכויות סיעוד לאזרחים ותיקים בישראל מאתר btl.gov.il.

חשוב מאוד: הבא מידע מפורט ומלא על כל הנושאים הבאים:

1. תנאי זכאות בסיסיים:
   - גיל פרישה מדויק (גברים ונשים)
   - תנאי תושבות
   - מבחן הכנסות מפורט עם סכומים מדויקים לגמלה מלאה ומופחתת
   - דרישות מצב תפקודי

2. 6 רמות הסיעוד - חובה לכלול לכל רמה:
   - נקודות תלות מדויקות (טווח נקודות)
   - שעות טיפול שבועיות
   - גמלה מקסימלית בכסף (סכום מדויק ב-₪)
   - שווי שעת טיפול עדכני
   - הבדלים בין מטפל ישראלי לעובד זר

3. סל השירותים המלא:
   - טיפול אישי, מרכז יום, מוצרי ספיגה, לחצן מצוקה, שירותי כביסה
   - אפשרויות המרה לכסף לפי רמות
   - תוספות ניקוד למצבים מיוחדים (גר לבד, עם בן זוג מטופל, בן 90+)

4. תהליך הגשת תביעה:
   - שלבי ההגשה המלאים
   - מבחן ADL - פירוט כל הפעולות שנבדקות
   - זמני תגובה ממועד הגשה
   - טיפים להגשה מוצלחת
   - זכות ערעור ותהליך הערעור

5. מניעות וחסמים:
   - קצבאות סותרות
   - סוגי מגורים המונעים זכאות

6. פרטי קשר מלאים: מוקדים, אתרים, טלפונים

הצג את המידע בפורמט HTML עשיר עם טבלאות מפורטות, כותרות ברורות (h2, h3), ורשימות מסודרות.`
    },

    holocaust_survivors: {
      title: 'זכויות מיוחדות לניצולי שואה',
      prompt: `זכויות מיוחדות לניצולי שואה בישראל - חפש ב-btl.gov.il, באתר הרשות לזכויות ניצולי השואה, וועידת התביעות:

הגדרה: מי מוכר כניצול שואה? (רשות לזכויות ניצולי השואה, Claims Conference, BEG)

תוספת 9 שעות סיעוד:
- תנאי זכאות מדויקים (רמה 3 עם 6+ נקודות, או רמות 4-6)
- סכום בכסף מדויק
- גופים מממנים ומפעילים
- תוספות למצבים שונים (גמלה מופחתת, 5-5.5 נקודות)

תוכנית סול"ם:
- סול"ם לאחר אשפוז (50 שעות, תנאי הכנסה, הגשה)
- סול"ם בקהילה (50 שעות, תנאים, הגשה)

הטבות רפואיות:
- פטור מלא מתרופות
- פטור מטופס 17
- פטור מרפואה יועצת
- פטור מטיפולי שיניים
- פטור בסיעודי מורכב

הטבות כלכליות:
- הנחה בארנונה
- פטור מאגרת טלוויזיה
- דמי הבראה
- החזר מע"מ
- מענק שנתי

גמלאות חודשיות:
- תגמול לפי חוק נכי רדיפות הנאצים
- קצבה ליוצאי מחנות וגטאות
- קצבה מקרן סעיף 2
- מענק שנתי ליוצאי מרוקו, אלג'יריה ועיראק

פרטי קשר מלאים: רשות, קרן, ועידת התביעות, מוקדים
הצג בפורמט HTML מסודר עם כותרות, רשימות וטבלאות`
    }
  };

  // טעינת הנתונים הקיימים
  const dataFile = path.join(__dirname, '..', 'data', 'rights-data.json');
  let existingData = {
    lastUpdate: new Date().toISOString(),
    version: '1.0',
    categories: {}
  };

  try {
    const fileContent = await fs.readFile(dataFile, 'utf-8');
    existingData = JSON.parse(fileContent);
  } catch (error) {
    console.log('📄 לא נמצא קובץ קיים, יוצר חדש...');
  }

  // בחירת קטגוריה אחת לעדכון (מתחלפת כל שבוע)
  const allKeys = Object.keys(topics);
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (7 * 86400000));
  const categoryIndex = weekOfYear % allKeys.length;
  const categoriesToUpdate = [allKeys[categoryIndex]];

  console.log(`\n📅 מעדכן השבוע: ${topics[categoriesToUpdate[0]].title}\n`);

  for (const key of categoriesToUpdate) {
    const topicData = topics[key];
    console.log(`\n📝 מעדכן: ${topicData.title}`);
    const content = await searchWithAI(topicData.prompt, apiKey);

    if (content) {
      // בדיקת תקינות - התוכן צריך להיות עשיר מספיק
      const minContentLength = 500; // מינימום 500 תווים

      if (content.length < minContentLength) {
        console.log(`⚠️  התוכן קצר מדי (${content.length} תווים), משאיר את התוכן הקיים`);
        console.log(`⚠️  נדרש מינימום ${minContentLength} תווים`);
      } else {
        existingData.categories[key] = {
          title: topicData.title,
          content: content,
          updatedAt: new Date().toISOString()
        };
        console.log(`✅ הצליח לעדכן: ${topicData.title} (${content.length} תווים)`);
      }
    } else {
      console.log(`⚠️  לא הצליח לעדכן: ${topicData.title}`);
    }

    // המתנה קצרה בין בקשות
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  existingData.lastUpdate = new Date().toISOString();
  return existingData;
}

async function saveDataToFile(data) {
  const dataDir = path.join(__dirname, '..', 'data');
  const dataFile = path.join(dataDir, 'rights-data.json');

  try {
    // יצירת תיקייה אם לא קיימת
    await fs.mkdir(dataDir, { recursive: true });

    // שמירת הנתונים
    await fs.writeFile(
      dataFile,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log(`\n💾 הנתונים נשמרו בהצלחה ב: ${dataFile}`);
    return true;
  } catch (error) {
    console.error('❌ שגיאה בשמירת הנתונים:', error);
    return false;
  }
}

async function generateStaticJavaScript(data) {
  const jsFile = path.join(__dirname, '..', 'data', 'rights-data.js');
  
  const jsContent = `// נתוני זכויות אזרחים ותיקים - עודכן אוטומטית
// עדכון אחרון: ${new Date(data.lastUpdate).toLocaleString('he-IL')}

const RIGHTS_DATA = ${JSON.stringify(data, null, 2)};

// ייצוא לשימוש בדפדפן
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RIGHTS_DATA;
}
`;

  try {
    await fs.writeFile(jsFile, jsContent, 'utf-8');
    console.log(`📄 קובץ JavaScript נוצר: ${jsFile}`);
    return true;
  } catch (error) {
    console.error('❌ שגיאה ביצירת קובץ JS:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 מתחיל עדכון אוטומטי של בסיס הנתונים...\n');

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('❌ שגיאה: חסר ANTHROPIC_API_KEY');
    console.error('הוסף את המפתח בהגדרות GitHub Secrets');
    process.exit(1);
  }

  try {
    // עדכון כל הקטגוריות
    console.log('📊 אוסף מידע מעודכן מהאינטרנט...\n');
    const updatedData = await updateAllCategories(apiKey);

    // שמירת הנתונים
    console.log('\n💾 שומר נתונים...');
    await saveDataToFile(updatedData);
    await generateStaticJavaScript(updatedData);

    // סיכום
    console.log('\n✅ ========================================');
    console.log('✅ העדכון הושלם בהצלחה!');
    console.log(`✅ תאריך עדכון: ${new Date().toLocaleString('he-IL')}`);
    console.log(`✅ מספר קטגוריות: ${Object.keys(updatedData.categories).length}`);
    console.log('✅ ========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ שגיאה כללית:', error);
    process.exit(1);
  }
}

// הרצה
if (require.main === module) {
  main();
}

module.exports = { updateAllCategories, saveDataToFile };