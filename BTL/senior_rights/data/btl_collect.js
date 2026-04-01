/**
 * מערכת כפל קצבאות – שלב א
 * תיעוד מלא: BTL/support_files/files/כפל_קצבאות_תיעוד.md
 *
 * btl_collect.js  –  שלב א (משולב)
 * ==================================
 * לכל קצבה A (1–57):
 *   1. שואב את רשימת B מהאתר
 *   2. ממיר ערכים מוכרים (1–125) למספרים ומעדכן טבלת "רשימת הקצבאות"
 *   3. ערכים שאינם ברשימה 1–125 → מקבלים מספר חדש מ-126 ומעלה
 *      ומתווספים לטבלת "שמות הקצבאות" ולטבלת "רשימת הקצבאות"
 *
 * הרצת בדיקה:  node btl_collect.js --test   (קצבה A=57 בלבד)
 * הרצה מלאה:   node btl_collect.js
 *
 * דרישות: npm install playwright && npx playwright install chromium
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const URL           = 'https://www.btl.gov.il/Simulators/Pages/bdikatZakauutLshteGimlaoot.aspx';
const MD_FILE       = path.join(__dirname, 'Matriza_kitsbaot_script.md');
const PROGRESS_FILE = path.join(__dirname, 'btl_progress_collect.json');
const HEADLESS        = false;
const DELAY_BETWEEN_A = 30 * 1000;
const TEST_MODE = process.argv.includes('--test');

// ─── רשימת 57 הקצבאות ────────────────────────────────────────────────────────

const KITZBAOT_57 = [
  { id:  1, value: 'אבטלה' },
  { id:  2, value: 'אזרח ותיק (זקנה)' },
  { id:  3, value: 'אזרח ותיק (זקנה) - תוספת עבור בן זוג' },
  { id:  4, value: 'אזרח ותיק (זקנה) - תוספת עבור בן זוג/ילד' },
  { id:  5, value: 'אזרח ותיק (זקנה) - תוספת עבור ילד' },
  { id:  6, value: 'אזרח ותיק (זקנה) לעולה' },
  { id:  7, value: 'אזרח ותיק מיוחדת (גמ"ז)' },
  { id:  8, value: 'איבה - תגמולים מיוחדים (מבחן הכנסות)' },
  { id:  9, value: 'איבה- משפחות שכולות' },
  { id: 10, value: 'איבה- תגמול נכה' },
  { id: 11, value: 'איבה- תט"ר' },
  { id: 12, value: 'אסירי ציון - זכאות לפי מבחן הכנסות' },
  { id: 13, value: 'אסירי ציון - נכות' },
  { id: 14, value: 'אסירי ציון - שאירים המקבלים תגמול (בן זוג וילדים)' },
  { id: 15, value: 'גזזת' },
  { id: 16, value: 'דמי לידה' },
  { id: 17, value: 'דמי מזונות' },
  { id: 18, value: 'דמי פגיעה מעבודה' },
  { id: 19, value: 'דמי שיקום' },
  { id: 20, value: 'דמי תאונה אישית' },
  { id: 21, value: 'הבטחת הכנסה' },
  { id: 22, value: 'חסידי אומות עולם' },
  { id: 23, value: 'ילד נכה' },
  { id: 24, value: 'מילואים' },
  { id: 25, value: 'מענק עבודה נדרשת לחייל משוחרר' },
  { id: 26, value: 'ניידות' },
  { id: 27, value: 'נכות כללית' },
  { id: 28, value: 'נכות כללית - תוספת עבור בן זוג' },
  { id: 29, value: 'נכות כללית - תוספת עבור בן זוג/ילד' },
  { id: 30, value: 'נכות כללית - תוספת עבור ילד' },
  { id: 31, value: 'נכות מעבודה' },
  { id: 32, value: 'נכות מעבודה מתנדבים' },
  { id: 33, value: 'נפגעי עירוי דם (איידס)' },
  { id: 34, value: 'סיעוד' },
  { id: 35, value: 'פוליו' },
  { id: 36, value: 'פיצוי לנפגעי גזזת' },
  { id: 37, value: 'פיצוי לנפגעי פוליו' },
  { id: 38, value: 'פשיטת רגל ופירוק תאגיד' },
  { id: 39, value: 'קצבה לאלמנה של נפטר מפגיעה בעבודה' },
  { id: 40, value: 'קצבה לבני משפחה של מתנדב שנפטר מפגיעה בעבודה' },
  { id: 41, value: 'קצבה לבני משפחה של נפטר מפגיעה בעבודה' },
  { id: 42, value: 'קצבה מיוחדת לנכה עבודה (משולמת על ידי השיקום)' },
  { id: 43, value: 'קצבת ילדים' },
  { id: 44, value: 'קצבת לידה (למי שילדה שלישייה ויותר)' },
  { id: 45, value: 'שאירים' },
  { id: 46, value: 'שאירים - תוספת עבור ילד' },
  { id: 47, value: 'שאירים לאלמן/ה + שאירים לילדים' },
  { id: 48, value: 'שאירים לילד' },
  { id: 49, value: 'שאירים לילד יתום משני הורים' },
  { id: 50, value: 'שאירים מיוחדת לעולה' },
  { id: 51, value: 'שיקום לאלמנות' },
  { id: 52, value: 'שירותים מיוחדים לנכה' },
  { id: 53, value: 'שירותים מיוחדים לעולה' },
  { id: 54, value: 'שמירת היריון' },
  { id: 55, value: 'תגמול לאלמן/ה של אסיר ציון שנפטר' },
  { id: 56, value: 'תגמול מילואים' },
  { id: 57, value: 'תגמול עקב אלימות במשפחה' },
];

// ─── ערכים מוכרים 101–125 (טקסט מנוקה → id) ─────────────────────────────────

const KNOWN_101_125 = {
  'אסירי ציון': 101,
  'קצבה לבני משפחה של נפטר מפגיעה בעבודה.': 102,
  'תגמול לאלמנה ממשרד הביטחון': 103,
  'אזרח ותיק (זקנה) לבן הזוג': 104,
  'דמי אבטלה לבן הזוג': 105,
  'נכות כללית לבן הזוג': 106,
  'אזרח ותיק (זקנה) לבן הזוג - תוספת עבור ילד': 107,
  'ניידות לילד נכה': 108,
  'נכות כללית לבן הזוג - תוספת עבור ילד': 109,
  'בן זוג המקבל קצבה': 110,
  'כל קצבה אחרת': 111,
  'דמי מחייה ליתום': 112,
  'קצבת לידה מיוחדת': 113,
  'קצבת שאירים ליתום אם אין אלמן/נה זכאי': 114,
  'תלויים בנכות מעבודה': 115,
  'שאירים עבור ילד': 116,
  'נכות מעבודה תוספת עבור בן זוג/ילד': 117,
  'נכות כללית- תוספת עבור בן זוג': 118,
  'משרד ביטחון - אגף שיקום נכים': 119,
  'קצבה לבני למשפחה של נפטר מפגיעה בעבודה': 120,
  'עם כל קצבה אחרת': 121,
  'דמי תאונה': 122,
  'מזונות': 123,
  'נכות מעבודה תוספת עבור אותם הילדים': 124,
  'כלל הקצבאות': 125,
};

// ─── עזר ──────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
    catch {}
  }
  return { results: {}, newUnknowns: {}, nextId: 126 };
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2), 'utf8');
}

function resolveValue(raw, progress) {
  const clean = raw.trim();
  const in57 = KITZBAOT_57.find(k => k.value.trim() === clean);
  if (in57) return in57.id;
  if (KNOWN_101_125[clean] !== undefined) return KNOWN_101_125[clean];
  if (progress.newUnknowns[clean] !== undefined) return progress.newUnknowns[clean];
  // ערך חדש לחלוטין
  const newId = progress.nextId++;
  progress.newUnknowns[clean] = newId;
  console.log(`   ⚠ ערך חדש: "${clean}" → ${newId}`);
  return newId;
}

// ─── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n========================================');
  console.log(TEST_MODE ? '  מצב בדיקה – A=57 בלבד' : `  הרצה מלאה – ${KITZBAOT_57.length} קצבאות`);
  console.log('========================================\n');

  const progress = loadProgress();
  const done = Object.keys(progress.results).length;
  if (done > 0) console.log(`► התקדמות קודמת: ${done} קצבאות\n`);

  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 50 });
  const page    = await (await browser.newContext()).newPage();
  const list    = TEST_MODE ? [KITZBAOT_57.find(k => k.id === 57)] : KITZBAOT_57;

  for (let i = 0; i < list.length; i++) {
    const kitzbaA = list[i];
    const aKey    = String(kitzbaA.id);

    if (progress.results[aKey]) {
      console.log(`[דילוג] [${kitzbaA.id}] ${kitzbaA.value}`);
      continue;
    }

    console.log(`\n── [${kitzbaA.id}/${KITZBAOT_57.length}] ${kitzbaA.value}`);

    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
      await sleep(1200);
      await page.selectOption('#Select_PensionA', { value: kitzbaA.value });
      await page.waitForFunction(
        () => (document.querySelector('#Select_PensionB')?.options.length ?? 0) > 1,
        { timeout: 10000 }
      );
      await sleep(300);

      const rawValues = await page.evaluate(() => {
        const sel = document.querySelector('#Select_PensionB');
        if (!sel) return [];
        return Array.from(sel.options).map(o => o.value).filter(v => v.trim() !== '');
      });

      const bIds = [...new Set(rawValues.map(v => resolveValue(v, progress)))].sort((a, b) => a - b);
      console.log(`   → B: ${bIds.join(', ')} (${bIds.length})`);

      progress.results[aKey] = { id: kitzbaA.id, name: kitzbaA.value, bIds };
      saveProgress(progress);
      updateMD(progress);
      console.log('   ✔ MD עודכן');

    } catch (err) {
      console.error(`   ❌ שגיאה: ${err.message.split('\n')[0]}`);
    }

    if (i < list.length - 1 && !TEST_MODE) {
      console.log('   ⏸  ממתין 30 שניות...');
      await sleep(DELAY_BETWEEN_A);
    }
  }

  await browser.close();
  console.log(TEST_MODE ? '\n✔ בדיקה הסתיימה. להרצה מלאה: node btl_collect.js' : '\n✔ סיום.');
}

// ─── עדכון MD ─────────────────────────────────────────────────────────────────

function updateMD(progress) {
  if (!fs.existsSync(MD_FILE)) { console.error(`⚠ לא נמצא: ${MD_FILE}`); return; }
  let md = fs.readFileSync(MD_FILE, 'utf8');

  // כל הערכים 101+ ממוינים לפי id
  const allExtra = [
    ...Object.entries(KNOWN_101_125).map(([name, id]) => ({ id, name })),
    ...Object.entries(progress.newUnknowns).map(([name, id]) => ({ id, name })),
  ].sort((a, b) => a.id - b.id);

  // ── טבלת שמות הקצבאות ────────────────────────────────────────────────────
  let namesRows = KITZBAOT_57.map(k => `| ${k.id} | ${k.value} |`).join('\n');
  namesRows    += '\n' + allExtra.map(k => `| ${k.id} | ${k.name} |`).join('\n');
  const namesTable = `| מספר | שם קצבה |\n|------|----------|\n${namesRows}`;
  const namesRx = /\| מספר \| שם קצבה \|\n\|------\|----------\|[\s\S]*?(?=\n\n|\n#|$)/;
  md = namesRx.test(md) ? md.replace(namesRx, namesTable) : md;

  // ── טבלת רשימת הקצבאות ───────────────────────────────────────────────────
  let mainRows = KITZBAOT_57.map(k => {
    const p    = progress.results[String(k.id)];
    const cell = p ? (p.bIds.length ? p.bIds.join(', ') : 'אין צירופים') : 'טרם נבדק';
    return `| ${k.id} | ${k.value} | ${cell} |`;
  }).join('\n');
  mainRows += '\n' + allExtra.map(k => `| ${k.id} | ${k.name} | 0 |`).join('\n');
  const mainTable = `| מספר | שם קצבה | צירופים אפשריים |\n|------|----------|------------------|\n${mainRows}`;
  const mainRx = /\| מספר \| שם קצבה \| צירופים אפשריים \|\n\|------[\s\S]*?(?=\n\n|\n#|$)/;
  md = mainRx.test(md) ? md.replace(mainRx, mainTable) : md + '\n\n' + mainTable;

  // ── חותמת זמן ────────────────────────────────────────────────────────────
  const ts   = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const note = `> **עודכן אוטומטית: ${ts}**`;
  md = md.includes('> **עודכן') ? md.replace(/> \*\*עודכן.*?\*\*/, note) : note + '\n\n' + md;

  fs.writeFileSync(MD_FILE, md, 'utf8');
}

main().catch(err => { console.error('\n❌ שגיאה:', err.message); process.exit(1); });
