// סקריפט בדיקה לטעויות תחביר בקובץ HTML
const fs = require('fs');
const path = require('path');

console.log('🔍 מתחיל בדיקת תחביר...\n');

const htmlPath = path.join(__dirname, 'senior_rights_new.html');

try {
    // קריאת הקובץ
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log('✅ הקובץ נקרא בהצלחה\n');

    // בדיקות תחביר בסיסיות
    let errors = [];
    let warnings = [];

    // בדיקה 1: סוגריים מסולסלים
    console.log('📊 בודק סוגריים מסולסלים...');
    const braceBalance = checkBraceBalance(htmlContent);
    if (braceBalance !== 0) {
        errors.push(`❌ אי התאמה בסוגריים מסולסלים: ${braceBalance > 0 ? 'יותר { מאשר }' : 'יותר } מאשר {'}`);
    } else {
        console.log('   ✅ סוגריים מסולסלים מאוזנים');
    }

    // בדיקה 2: גרשיים
    console.log('📊 בודק גרשיים...');
    const quoteBalance = checkQuoteBalance(htmlContent);
    if (quoteBalance) {
        warnings.push(`⚠️  אזהרה: ${quoteBalance}`);
    } else {
        console.log('   ✅ גרשיים מאוזנים');
    }

    // בדיקה 3: פונקציות חובה
    console.log('📊 בודק קיום פונקציות חובה...');
    const requiredFunctions = [
        'displayData',
        'processNestedHeadings',
        'convertHeadingsToSubAccordions',
        'initAccordions'
    ];

    requiredFunctions.forEach(funcName => {
        const regex = new RegExp(`function\\s+${funcName}\\s*\\(`);
        if (regex.test(htmlContent)) {
            console.log(`   ✅ פונקציה ${funcName} נמצאה`);
        } else {
            errors.push(`❌ פונקציה ${funcName} לא נמצאה`);
        }
    });

    // בדיקה 4: קריאות לפונקציות
    console.log('📊 בודק קריאות לפונקציות...');
    if (htmlContent.includes('convertHeadingsToSubAccordions()')) {
        console.log('   ✅ קריאה ל-convertHeadingsToSubAccordions נמצאה');
    } else {
        warnings.push('⚠️  אזהרה: לא נמצאה קריאה ל-convertHeadingsToSubAccordions');
    }

    if (htmlContent.includes('initAccordions()')) {
        console.log('   ✅ קריאה ל-initAccordions נמצאה');
    } else {
        warnings.push('⚠️  אזהרה: לא נמצאה קריאה ל-initAccordions');
    }

    // בדיקה 5: CSS classes
    console.log('📊 בודק CSS classes...');
    const cssClasses = [
        'accordion',
        'accordion-header',
        'accordion-content',
        'accordion-body',
        'sub-accordion',
        'sub-accordion-header',
        'sub-accordion-content',
        'no-accordion'
    ];

    cssClasses.forEach(className => {
        const regex = new RegExp(`\\.${className}`);
        if (regex.test(htmlContent)) {
            console.log(`   ✅ CSS class .${className} נמצא`);
        } else {
            warnings.push(`⚠️  אזהרה: CSS class .${className} לא נמצא`);
        }
    });

    // בדיקה 6: data-level attributes
    console.log('📊 בודק data-level attributes...');
    const dataLevelRegex = /data-level="([2-6])"/g;
    const dataLevelMatches = htmlContent.match(dataLevelRegex);
    if (dataLevelMatches) {
        console.log(`   ✅ נמצאו ${dataLevelMatches.length} התייחסויות ל-data-level`);
    } else {
        warnings.push('⚠️  אזהרה: לא נמצאו data-level attributes');
    }

    // בדיקה 7: console.log statements
    console.log('📊 בודק דגלי DEBUG...');
    const debugCount = (htmlContent.match(/console\.log\(/g) || []).length;
    console.log(`   ℹ️  נמצאו ${debugCount} דגלי DEBUG (console.log)`);

    // סיכום
    console.log('\n' + '='.repeat(60));
    console.log('📋 סיכום בדיקה:\n');

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅✅✅ הכל תקין! לא נמצאו שגיאות או אזהרות\n');
    } else {
        if (errors.length > 0) {
            console.log('❌ שגיאות קריטיות:');
            errors.forEach(err => console.log(`   ${err}`));
            console.log('');
        }

        if (warnings.length > 0) {
            console.log('⚠️  אזהרות:');
            warnings.forEach(warn => console.log(`   ${warn}`));
            console.log('');
        }

        if (errors.length > 0) {
            console.log('❌ יש לתקן את השגיאות לפני המשך\n');
            process.exit(1);
        } else {
            console.log('✅ לא נמצאו שגיאות קריטיות, רק אזהרות\n');
        }
    }

} catch (error) {
    console.error('❌ שגיאה בקריאת הקובץ:', error.message);
    process.exit(1);
}

// פונקציות עזר
function checkBraceBalance(content) {
    // הסר strings ו-comments כדי לא לבדוק בתוכם
    let cleanContent = content;

    // הסר /* */ comments
    cleanContent = cleanContent.replace(/\/\*[\s\S]*?\*\//g, '');

    // הסר // comments (אבל לא בתוך strings)
    cleanContent = cleanContent.replace(/\/\/[^\n]*/g, '');

    // הסר template strings (בעייתי עם nested braces)
    // נסה להסיר template strings בצורה יותר חכמה
    let inTemplate = false;
    let inString = false;
    let stringChar = '';
    let cleaned = '';
    let escaped = false;

    for (let i = 0; i < cleanContent.length; i++) {
        const char = cleanContent[i];
        const prevChar = i > 0 ? cleanContent[i - 1] : '';

        // טיפול ב-escape
        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === '\\') {
            escaped = true;
            continue;
        }

        // טיפול ב-template strings
        if (char === '`' && !inString) {
            inTemplate = !inTemplate;
            continue;
        }

        // טיפול ב-regular strings
        if ((char === '"' || char === "'") && !inTemplate) {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
            }
            continue;
        }

        // אם לא ב-string או template, שמור את התו
        if (!inString && !inTemplate) {
            cleaned += char;
        }
    }

    let balance = 0;
    for (let char of cleaned) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    return balance;
}

function checkQuoteBalance(content) {
    // בדיקה פשוטה של גרשיים (לא מושלמת אבל עוזרת)
    const scriptContent = content.match(/<script[\s\S]*?<\/script>/gi);
    if (!scriptContent) return null;

    const jsCode = scriptContent.join('\n');

    // הסר escaped quotes
    const cleaned = jsCode.replace(/\\["'`]/g, '');

    const doubleQuotes = (cleaned.match(/"/g) || []).length;
    const singleQuotes = (cleaned.match(/'/g) || []).length;
    const backticks = (cleaned.match(/`/g) || []).length;

    let issues = [];
    if (doubleQuotes % 2 !== 0) issues.push('גרשיים כפולים לא מאוזנים');
    if (singleQuotes % 2 !== 0) issues.push('גרשיים בודדים לא מאוזנים');
    if (backticks % 2 !== 0) issues.push('backticks לא מאוזנים');

    return issues.length > 0 ? issues.join(', ') : null;
}

console.log('='.repeat(60));
console.log('✅ בדיקת תחביר הושלמה!');
console.log('='.repeat(60));
