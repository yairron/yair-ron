/**
 * סקריפט לאיתור ורישום כל המופעים של נתונים דינמיים ב-rights-data.js
 *
 * שימוש:
 * node find-dynamic-values.js
 *
 * הסקריפט יציג דוח מפורט של:
 * 1. כל הנתונים הדינמיים
 * 2. מיקום המופעים שלהם
 * 3. המלצות לעדכון
 */

const fs = require('fs');
const path = require('path');

// טעינת הנתונים הדינמיים
const dynamicValuesPath = path.join(__dirname, 'dynamic-values.json');
const dynamicValues = JSON.parse(fs.readFileSync(dynamicValuesPath, 'utf8'));

// טעינת קובץ rights-data.js
const rightsDataPath = path.join(__dirname, 'rights-data.js');
const rightsDataContent = fs.readFileSync(rightsDataPath, 'utf8');

// פונקציה לחיפוש מופעים
function findOccurrences(content, searchValue) {
  const lines = content.split('\n');
  const occurrences = [];

  lines.forEach((line, index) => {
    if (line.includes(searchValue)) {
      occurrences.push({
        line: index + 1,
        content: line.trim()
      });
    }
  });

  return occurrences;
}

// יצירת דוח
console.log('═══════════════════════════════════════════════════════════');
console.log('          דוח נתונים דינמיים - rights-data.js');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`תאריך עדכון אחרון: ${dynamicValues.metadata.lastUpdate}`);
console.log(`גרסה: ${dynamicValues.metadata.version}\n`);

let totalOccurrences = 0;

// עבור על כל הנתונים הדינמיים
Object.entries(dynamicValues.values).forEach(([key, data]) => {
  const occurrences = findOccurrences(rightsDataContent, data.displayValue);

  if (occurrences.length > 0) {
    console.log('─'.repeat(60));
    console.log(`📌 ${data.fieldName} (${key})`);
    console.log(`   ערך: ${data.displayValue}`);
    console.log(`   תאריך עדכון: ${data.updateDate}`);
    console.log(`   הסבר: ${data.explanation}`);
    console.log(`   מספר מופעים: ${occurrences.length}`);
    console.log('\n   מיקומים:');

    occurrences.forEach((occ, idx) => {
      console.log(`   ${idx + 1}. שורה ${occ.line}: ${occ.content.substring(0, 80)}${occ.content.length > 80 ? '...' : ''}`);
    });

    console.log('');
    totalOccurrences += occurrences.length;
  }
});

console.log('═'.repeat(60));
console.log(`\n✅ סה"כ מופעים שנמצאו: ${totalOccurrences}`);
console.log('\n💡 המלצות:');
console.log('   1. שמור קובץ זה כעותק גיבוי לפני עדכון');
console.log('   2. לעדכון נתונים - ערוך את dynamic-values.json');
console.log('   3. השתמש בסקריפט replace-dynamic-values.js לעדכון אוטומטי');
console.log('   4. בדוק את התוצאות לפני פרסום\n');

// שמירת הדוח לקובץ
const reportPath = path.join(__dirname, 'dynamic-values-report.txt');
const reportContent = `
דוח נתונים דינמיים - ${new Date().toISOString()}
${'='.repeat(60)}

סה"כ מופעים: ${totalOccurrences}
תאריך עדכון: ${dynamicValues.metadata.lastUpdate}

פירוט מופעים לפי שדה:
${Object.entries(dynamicValues.values).map(([key, data]) => {
  const occurrences = findOccurrences(rightsDataContent, data.displayValue);
  return `
${data.fieldName} (${key}):
  ערך: ${data.displayValue}
  מופעים: ${occurrences.length}
  מיקומים: ${occurrences.map(o => `שורה ${o.line}`).join(', ')}
`;
}).join('\n')}
`;

fs.writeFileSync(reportPath, reportContent, 'utf8');
console.log(`📄 הדוח נשמר ב: ${reportPath}\n`);
