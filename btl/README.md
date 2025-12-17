# 🌟 מערכת חיפוש זכויות אזרחים ותיקים

אפליקציה אינטראקטיבית לגילוי וחיפוש הזכויות וההטבות המגיעות לאזרחים ותיקים בישראל.

## ✨ תכונות

- 📋 **טופס קליטת נתונים** - קלט פשוט וידידותי
- 🔍 **חיפוש אוטומטי** - שאיבת מידע מעודכן מהאינטרנט (דרך Anthropic API)
- 🎯 **תוצאות מותאמות אישית** - מידע רלוונטי בדיוק לפרופיל המשתמש
- 🎨 **עיצוב מקצועי** - ממשק נוח וברור בעברית
- 📱 **רספונסיבי** - עובד מצוין על מחשב, טאבלט וסמארטפון

## 📂 מבנה הפרויקט

```
senior-rights-app/
├── index.html                          # דף ה-HTML הראשי
├── netlify.toml                        # הגדרות Netlify
├── package.json                        # תלויות Node.js
├── README.md                           # קובץ זה
└── netlify/
    └── functions/
        └── search-rights.js            # Netlify Function לחיפוש
```

## 🚀 התקנה ופריסה

### דרישות מקדימות

1. חשבון GitHub (חינם)
2. חשבון Netlify (חינם)
3. API Key של Anthropic (אופציונלי - ללא זה האפליקציה תשתמש במידע סטטי)

### שלב 1: העלאה ל-GitHub

1. צור repository חדש ב-GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Senior Rights App"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/senior-rights-app.git
   git push -u origin main
   ```

2. או פשוט העלה את הקבצים דרך ממשק GitHub:
   - לחץ על "New Repository"
   - תן שם ל-repository (לדוגמה: `senior-rights-app`)
   - לחץ על "Upload files"
   - גרור את כל הקבצים

### שלב 2: חיבור ל-Netlify

1. היכנס ל-[Netlify](https://www.netlify.com)
2. לחץ על "Add new site" → "Import an existing project"
3. בחר "GitHub" והתחבר לחשבון שלך
4. בחר את ה-repository שיצרת
5. הגדרות הבניה:
   - **Build command:** השאר ריק (או `echo 'No build required'`)
   - **Publish directory:** `./` (נקודה)
6. לחץ על "Deploy site"

### שלב 3: הגדרת Anthropic API (אופציונלי)

אם יש לך API Key של Anthropic:

1. ב-Netlify, לך ל-"Site settings" → "Environment variables"
2. לחץ על "Add a variable"
3. הוסף:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** המפתח שלך מ-[Anthropic Console](https://console.anthropic.com/)
4. שמור ופרוס מחדש (Redeploy)

### שלב 4: בדיקת האתר

האתר שלך חי! 🎉

כתובת האתר תהיה בפורמט: `https://YOUR-SITE-NAME.netlify.app`

## 🔧 כיצד זה עובד?

### ללא Anthropic API Key:
- האפליקציה משתמשה **במידע סטטי** מובנה
- המידע מבוסס על זכויות כלליות ידועות
- עדיין מאוד שימושי וכולל מידע רב

### עם Anthropic API Key:
- האפליקציה **מחפשת באינטרנט** מידע מעודכן
- שואבת נתונים מאתרי הממשלה והביטוח הלאומי
- מתאימה את המידע בדיוק לנתוני המשתמש
- מעודכנת תמיד עם המידע הכי עדכני

## 🛠️ פיתוח מקומי

אם תרצה לבדוק את האפליקציה במחשב שלך:

1. התקן את Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. התקן תלויות:
   ```bash
   npm install
   ```

3. הרץ שרת מקומי:
   ```bash
   netlify dev
   ```

4. פתח דפדפן בכתובת: `http://localhost:8888`

## 📝 התאמה אישית

### שינוי עיצוב:
ערוך את ה-CSS בתוך תג ה-`<style>` בקובץ `index.html`

### שינוי תוכן:
ערוך את הפונקציות ב-`netlify/functions/search-rights.js`

### הוספת קטגוריות:
1. הוסף בתוך `displayResults()` ב-`index.html`
2. הוסף פונקציה מתאימה ב-`search-rights.js`

## 🔐 אבטחה

- כל המידע מעובד בצד השרת (Serverless Functions)
- ה-API Key לא חשוף לצד הלקוח
- אין שמירה של מידע אישי
- כל החיפושים אנונימיים

## 📊 קטגוריות זכויות

האפליקציה מציגה מידע על:

1. 🛡️ **ביטוח לאומי וקצבאות**
2. ❤️ **סיעוד ושירותי בריאות**
3. 💰 **הטבות מס והנחות**
4. 🚌 **תחבורה ציבורית**
5. 🏠 **דיור וסיוע במגורים**
6. 📄 **זכויות נוספות**

## 🔗 קישורים שימושיים

- [ביטוח לאומי](https://www.btl.gov.il)
- [משרד הרווחה](https://www.gov.il/he/Departments/molsa)
- [משרד הבריאות](https://www.health.gov.il)
- [זכויות אזרחים ותיקים](https://www.gov.il/he/service/senior-citizens-benefits)

## ⚠️ הערה חשובה

המידע באפליקציה הוא לידיעה כללית בלבד ואינו מהווה ייעוץ משפטי או רשמי. 
מומלץ לפנות לגורמים המוסמכים לקבלת מידע מדויק ומעודכן.

## 📞 תמיכה

לשאלות ובעיות טכניות, פתח Issue ב-GitHub.

## 📄 רישיון

MIT License - חופשי לשימוש ושינוי

---

**פותח עם ❤️ לסיוע לאזרחים ותיקים בישראל**