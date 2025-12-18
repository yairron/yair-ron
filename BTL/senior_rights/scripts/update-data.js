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
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `חפש מידע מעודכן ומקיף על ${topic} לאזרחים ותיקים בישראל. 
            
תמקד את החיפוש במקורות רשמיים:
- אתר הביטוח הלאומי (btl.gov.il)
- משרד הרווחה (gov.il/molsa)
- משרד הבריאות (health.gov.il)
- אתר gov.il

החזר את התשובה בפורמט HTML עם רשימת <ul><li> ברורה ומפורטת.
כלול מספרים, סכומים, תאריכים רלוונטיים.
כתוב בעברית פשוטה וברורה.`
          }
        ],
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
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
    social_security: 'קצבאות זקנה וזכויות ביטוח לאומי - כולל תנאי זכאות מפורטים, גיל פרישה, סכומים, ומסמכים נדרשים',
    nursing: 'זכויות סיעוד לאזרחים ותיקים - כולל רמות סיעוד, תנאי זכאות, סכומים לכל רמה, תהליך הגשת תביעה ומסמכים נדרשים',
    holocaust_survivors: 'זכויות ניצולי שואה - כולל תנאי זכאות, קצבאות, הטבות מיוחדות, סיוע רפואי וסיעודי, ומסמכים נדרשים'
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

  // בחירת קטגוריה אחת לעדכון (מתחלפת כל יום)
  const allKeys = Object.keys(topics);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const categoryIndex = dayOfYear % allKeys.length;
  const categoriesToUpdate = [allKeys[categoryIndex]];

  console.log(`\n📅 מעדכן היום: ${topics[allKeys[categoryIndex]]}\n`);

  for (const key of categoriesToUpdate) {
    const topic = topics[key];
    console.log(`\n📝 מעדכן: ${topic}`);
    const content = await searchWithAI(topic, apiKey);

    if (content) {
      existingData.categories[key] = {
        title: topic,
        content: content,
        updatedAt: new Date().toISOString()
      };
      console.log(`✅ הצליח לעדכן: ${topic}`);
    } else {
      console.log(`⚠️  לא הצליח לעדכן: ${topic}`);
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