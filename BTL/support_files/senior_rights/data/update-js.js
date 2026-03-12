const fs = require('fs');
const data = JSON.parse(fs.readFileSync('rights-data.json', 'utf8'));

const jsContent = `// נתוני זכויות אזרחים ותיקים - עודכן אוטומטית
// עדכון אחרון: ${new Date(data.lastUpdate).toLocaleString('he-IL')}

const RIGHTS_DATA = ${JSON.stringify(data, null, 2)};

// ייצוא לשימוש בדפדפן
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RIGHTS_DATA;
}
`;

fs.writeFileSync('rights-data.js', jsContent, 'utf8');
console.log('✅ rights-data.js regenerated successfully');
