const fs = require('fs');
const path = require('path');
// עבור לספריה /mda/js הפעל את הסקריפט
// הסקריפט יוצר קובץ JSON מכל קובצי השאלות  עם QUIZ בשם
//להפעלה node build_main_quiz.js
// זיהוי סביבת הרצה אוטומטי
const isNetlify = process.env.NETLIFY === 'true';
const isLocalDev = !isNetlify;

// נתיבים עבור מבנה הספריות
let jsonDirectory, outputFile;

if (isNetlify) {
  // סביבת Netlify - נתיב מהשורש
  jsonDirectory = './mda/json';
  outputFile = './mda/json/main_q.json';
  console.log('🌍 רץ בסביבת Netlify');
} else {
  // סביבה מקומית - נתיב יחסי מ-mda/js
  jsonDirectory = path.join(__dirname, '..', 'json');
  outputFile = path.join(__dirname, '..', 'json', 'main_q.json');
  console.log('💻 רץ בסביבה מקומית');
}

// הדפס את הנתיבים לדיבוג
console.log('📂 נתיב הסקריפט:', __dirname);
console.log('📂 נתיב ספריית JSON:', jsonDirectory);
console.log('📄 נתיב קובץ הפלט:', outputFile);
console.log('📂 האם ספריית JSON קיימת?', fs.existsSync(jsonDirectory));

/**
 * פונקציה לקריאת כל קבצי JSON בספרייה
 */
function getAllJsonFiles(directory) {
    try {
        const files = fs.readdirSync(directory);
        return files.filter(file => 
            file.toLowerCase().endsWith('.json') && 
            file.toLowerCase().includes('quiz')
        );
    } catch (error) {
        console.error('שגיאה בקריאת הספרייה:', error);
        return [];
    }
}

/**
 * פונקציה לבדיקת תקינות מבנה השאלה
 */
function isValidQuestion(question) {
    return (
        question &&
        question.id !== undefined &&
        question.question &&
        Array.isArray(question.options) &&
        question.options.length > 0 &&
        (question.correct !== undefined || question.correctAnswer !== undefined)
    );
}

/**
 * פונקציה לנרמול השאלה - אחיד את השדות
 */
function normalizeQuestion(question, subject, sourceFile, index) {
    // וודא שיש שדה correct
    let correct = question.correct;
    if (correct === undefined && question.correctAnswer !== undefined) {
        correct = question.correctAnswer;
    }

    return {
        id: question.id || index + 1,
        question: question.question,
        type: question.type || 'multiple_choice',
        options: question.options,
        correct: correct,
        subject: subject,
        sourceFile: sourceFile
    };
}

/**
 * הפונקציה הראשית
 */
async function buildMainQuizFile() {
    console.log('\n🔍 מחפש קבצי quiz בספרייה:', jsonDirectory);
    
    // בדוק אם הספרייה קיימת
    if (!fs.existsSync(jsonDirectory)) {
        console.error(`❌ הספרייה לא נמצאה: ${jsonDirectory}`);
        console.log('💡 בדוק שהמבנה הוא:');
        console.log('   mda/');
        console.log('   ├── js/');
        console.log('   │   └── build_main_quiz.js');
        console.log('   └── json/');
        console.log('       ├── file1_quiz.json');
        console.log('       └── file2_quiz.json');
        
        if (isNetlify) {
          throw new Error('ספריית JSON לא נמצאה ב-Netlify');
        }
        return;
    }
    
    const jsonFiles = getAllJsonFiles(jsonDirectory);
    
    if (jsonFiles.length === 0) {
        const errorMsg = 'לא נמצאו קבצי JSON עם המילה "quiz" בספרייה';
        console.log(`❌ ${errorMsg}`);
        
        if (isNetlify) {
          throw new Error(errorMsg);
        }
        return;
    }

    console.log(`📁 נמצאו ${jsonFiles.length} קבצים:`, jsonFiles);

    let allQuestions = [];
    let processedFiles = 0;
    let totalQuestions = 0;

    // עבור על כל קובץ
    for (const fileName of jsonFiles) {
        const filePath = path.join(jsonDirectory, fileName);
        
        try {
            console.log(`📖 קורא קובץ: ${fileName}`);
            
            // קרא את הקובץ
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            // חלץ את הנושא
            const subject = data.subject || 'לא צוין';
            
            // חלץ את השאלות
            let questions = [];
            if (Array.isArray(data)) {
                questions = data;
            } else if (data.questions && Array.isArray(data.questions)) {
                questions = data.questions;
            } else if (data.quiz && data.quiz.questions && Array.isArray(data.quiz.questions)) {
                questions = data.quiz.questions;
            }

            if (questions.length === 0) {
                console.log(`⚠️  לא נמצאו שאלות בקובץ: ${fileName}`);
                continue;
            }

            let validQuestions = 0;

            // עבור על כל שאלה
            questions.forEach((question, index) => {
                if (isValidQuestion(question)) {
                    const normalizedQuestion = normalizeQuestion(question, subject, fileName, index);
                    
                    // הוסף ID ייחודי
                    normalizedQuestion.id = `${fileName.replace('.json', '')}_${normalizedQuestion.id}`;
                    
                    allQuestions.push(normalizedQuestion);
                    validQuestions++;
                }
            });

            console.log(`✅ נוספו ${validQuestions} שאלות תקינות מקובץ ${fileName} (נושא: ${subject})`);
            processedFiles++;
            totalQuestions += validQuestions;

        } catch (error) {
            console.error(`❌ שגיאה בעיבוד קובץ ${fileName}:`, error.message);
        }
    }

    // בנה את הקובץ הסופי
    const mainQuizData = {
        subject: "שאלון חזרה כללי",
        description: "שאלון מאוחד של כל השאלות מקבצי ה-quiz השונים",
        totalQuestions: totalQuestions,
        sourceFiles: jsonFiles,
        createdAt: new Date().toISOString(),
        questions: allQuestions
    };

    // שמור את הקובץ
    try {
        fs.writeFileSync(outputFile, JSON.stringify(mainQuizData, null, 2), 'utf8');
        
        console.log('\n🎉 הושלם בהצלחה!');
        console.log(`📊 סטטיסטיקות:`);
        console.log(`   • קבצים שעובדו: ${processedFiles}/${jsonFiles.length}`);
        console.log(`   • סה"כ שאלות: ${totalQuestions}`);
        console.log(`   • קובץ נשמר ב: ${outputFile}`);
        
        // הצג פילוח לפי נושאים
        const subjectCounts = {};
        allQuestions.forEach(q => {
            subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
        });
        
        console.log('\n📚 פילוח לפי נושאים:');
        Object.entries(subjectCounts).forEach(([subject, count]) => {
            console.log(`   • ${subject}: ${count} שאלות`);
        });

    } catch (error) {
        console.error('❌ שגיאה בשמירת הקובץ:', error);
        
        if (isNetlify) {
          throw error; // זרוק שגיאה ב-Netlify כדי לכשל את ה-build
        }
    }
}

/**
 * פונקציה לבדיקת תקינות הקובץ שנוצר
 */
function validateOutputFile() {
    try {
        if (!fs.existsSync(outputFile)) {
            console.log('❌ קובץ הפלט לא נמצא');
            return false;
        }

        const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        
        if (!data.questions || !Array.isArray(data.questions)) {
            console.log('❌ מבנה הקובץ לא תקין');
            return false;
        }

        console.log(`✅ קובץ הפלט תקין עם ${data.questions.length} שאלות`);
        return true;

    } catch (error) {
        console.error('❌ שגיאה בבדיקת תקינות:', error);
        return false;
    }
}

// הרץ את הסקריפט
if (isLocalDev) {
  console.log('🚀 מתחיל בניית קובץ main_q.json במחשב המקומי...\n');
} else {
  console.log('🚀 מתחיל בניית קובץ main_q.json ב-Netlify...\n');
}

buildMainQuizFile()
    .then(() => {
        console.log('\n🔍 בודק תקינות הקובץ שנוצר...');
        const isValid = validateOutputFile();
        
        if (isValid) {
          if (isNetlify) {
            console.log('✅ Build הושלם בהצלחה ב-Netlify!');
          } else {
            console.log('✅ הקובץ נוצר בהצלחה במחשב המקומי!');
            console.log('💡 כעת אתה יכול לדחוף את השינויים ל-Git');
          }
        } else {
          // כישלון בבדיקת תקינות
          console.error('❌ הקובץ שנוצר לא תקין');
          if (isNetlify) {
            process.exit(1); // כישלון ב-Netlify build
          }
        }
    })
    .catch(error => {
        console.error('❌ שגיאה כללית:', error);
        if (isNetlify) {
          process.exit(1); // חשוב ל-Netlify - יכשיל את ה-build במקרה של שגיאה
        }
    });