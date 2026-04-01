/**
 * מערכת כפל קצבאות – שלב ב
 * תיעוד מלא: BTL/support_files/files/כפל_קצבאות_תיעוד.md
 *
 * btl_step2.js – שלב ב: איסוף תוצאות לכל צירוף A+B
 * ===================================================
 * קורא את כל זוגות A+B מקובץ ה-MD (שורות 1–57 בלבד כ-A)
 * לכל זוג: פותח דף → בוחר A → ממתין ל-B → בוחר B → לוחץ הצג → חולץ תוצאה
 * שומר תוצאות ב-btl_results.json
 *
 * הרצת בדיקה:  node btl_step2.js --test   (צירוף אחד בלבד, מאתר selector)
 * הרצה רגילה:  node btl_step2.js           (50 צירופים, ממשיך מאיפה שעצר)
 *
 * דרישות: npm install playwright && npx playwright install chromium
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

// ─── נתיבים ───────────────────────────────────────────────────────────────────

const URL_BTL      = 'https://www.btl.gov.il/Simulators/Pages/bdikatZakauutLshteGimlaoot.aspx';
const MD_FILE      = path.join(__dirname, '..', '..', 'support_files', 'files', 'Matriza_kitsbaot_script.md');
const RESULTS_FILE = path.join(__dirname, '..', '..', 'support_files', 'json', 'btl_results.json');

// ─── הגדרות ───────────────────────────────────────────────────────────────────

const HEADLESS   = false;
const DELAY_MS   = 10 * 1000; // 10 שניות בין כל פניה לאתר
const BATCH_SIZE = 50;         // צירופים לכל הרצה
const TEST_MODE  = process.argv.includes('--test');

// selectors אפשריים לריבוע התוצאה – יבדקו בסדר עד שמוצאים תוכן
const RESULT_SELECTORS = [
  '#resultsDiv',
  '#divResult',
  '#ResultDiv',
  '#result',
  '.result',
  '.ms-rtestate-field p',
  '[id*="Result"]:not(#showResult)',
  '[id*="result"]:not(#showResult)',
  '[class*="result"]',
  '.BluBorder',
  '.blueBorder',
  '[class*="blue"]',
  '[class*="Blue"]',
];

// ─── עזר ──────────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadResults() {
  if (fs.existsSync(RESULTS_FILE)) {
    try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch {}
  }
  return {};
}

function saveResults(results) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf8');
}

// ─── פרסור ה-MD ───────────────────────────────────────────────────────────────

function parseMD() {
  const md = fs.readFileSync(MD_FILE, 'utf8');

  // טבלת שמות הקצבאות (id → name)
  const names = new Map();
  const namesSection = md.match(/# שמות הקצבאות[\s\S]*?(?=\n#\s|\n-----|\n$|$)/);
  if (!namesSection) throw new Error('לא נמצאה טבלת "שמות הקצבאות" ב-MD');
  for (const m of namesSection[0].matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/gm)) {
    names.set(Number(m[1]), m[2].trim());
  }

  // טבלת רשימת הקצבאות (A → [B ids])
  const listSection = md.match(/# רשימת הקצבאות[\s\S]*?(?=\n#\s|\n-----|\n$|$)/);
  if (!listSection) throw new Error('לא נמצאה טבלת "רשימת הקצבאות" ב-MD');

  const pairs = [];
  for (const m of listSection[0].matchAll(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|/gm)) {
    const aId = Number(m[1]);
    if (aId > 57) continue;
    const combCell = m[3].trim();
    if (!combCell || combCell === '0' || combCell === 'אין צירופים' || combCell === 'טרם נבדק') continue;
    for (const bId of combCell.split(',').map(s => Number(s.trim())).filter(n => n > 0)) {
      pairs.push({
        aId,
        aName: names.get(aId) || `קצבה ${aId}`,
        bId,
        bName: names.get(bId) || `קצבה ${bId}`,
      });
    }
  }

  return pairs;
}

// ─── חילוץ תוצאה ──────────────────────────────────────────────────────────────

async function extractResult(page, testMode) {
  await sleep(2000);

  if (testMode) {
    console.log('\n  ════ מצב בדיקה – איתור ריבוע תוצאה ════');
    const candidates = await page.evaluate((selectors) => {
      return selectors.map(sel => {
        try {
          const els = document.querySelectorAll(sel);
          const results = [];
          els.forEach((el) => {
            const text = el.innerText?.trim();
            const visible = el.offsetParent !== null || el.offsetHeight > 0;
            if (text) results.push({ text: text.substring(0, 300), visible, tag: el.tagName, id: el.id, cls: el.className });
          });
          return { selector: sel, count: els.length, results };
        } catch (e) {
          return { selector: sel, count: 0, error: e.message, results: [] };
        }
      });
    }, RESULT_SELECTORS);

    let found = null;
    for (const c of candidates) {
      const withText = c.results.filter(r => r.text.length > 5);
      if (withText.length > 0) {
        console.log(`\n  ✔ selector: "${c.selector}"`);
        withText.forEach(r => console.log(`    [${r.tag}#${r.id}.${r.cls}] visible=${r.visible}\n    "${r.text}"`));
        if (!found) found = withText[0].text;
      } else {
        console.log(`  ✗ "${c.selector}" – ${c.count} אלמנטים, אין טקסט`);
      }
    }
    console.log('\n  ── גיבוי: כל הטקסט הגלוי בדף (500 תווים ראשונים) ──');
    console.log(await page.evaluate(() => document.body.innerText.trim().substring(0, 500)));
    return found || '[לא נמצאה תוצאה – ראה פלט בדיקה לעיל]';
  }

  // מצב רגיל
  for (const sel of RESULT_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (el) {
        const text = (await el.innerText()).trim().replace(/^תוצאה\s*/u, '');
        if (text.length > 5) return text;
      }
    } catch {}
  }
  return '[תוצאה לא נמצאה]';
}

// ─── ביצוע צירוף אחד ──────────────────────────────────────────────────────────

async function runPair(page, pair, results, testMode) {
  const key = `${pair.aId}+${pair.bId}`;
  console.log(`  → ${key}: ${pair.aName} + ${pair.bName}`);

  try {
    await page.goto(URL_BTL, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(1000);

    await page.selectOption('#Select_PensionA', { label: pair.aName });
    await page.waitForFunction(
      () => (document.querySelector('#Select_PensionB')?.options.length ?? 0) > 1,
      { timeout: 15000 }
    );
    await sleep(500);

    await page.selectOption('#Select_PensionB', { label: pair.bName });
    await sleep(500);

    await page.click('#showResult');

    const resultText = await extractResult(page, testMode);
    console.log(`     ✔ ${resultText.substring(0, 80)}${resultText.length > 80 ? '...' : ''}`);

    results[key] = { aId: pair.aId, bId: pair.bId, aName: pair.aName, bName: pair.bName, result: resultText };

  } catch (err) {
    console.error(`     ❌ שגיאה: ${err.message.split('\n')[0]}`);
    results[key] = { aId: pair.aId, bId: pair.bId, aName: pair.aName, bName: pair.bName, result: `שגיאה: ${err.message.split('\n')[0]}` };
  }
}

// ─── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n========================================');
  console.log(TEST_MODE ? '  מצב בדיקה – צירוף אחד בלבד' : `  הרצה – עד ${BATCH_SIZE} צירופים`);
  console.log('========================================\n');

  let pairs;
  try {
    pairs = parseMD();
    console.log(`► נמצאו ${pairs.length} צירופים ב-MD`);
  } catch (err) {
    console.error(`❌ שגיאה בקריאת MD: ${err.message}`);
    process.exit(1);
  }

  const results = loadResults();

  if (TEST_MODE) {
    const p = pairs[0];
    console.log(`\n  בדיקה על: A=${p.aId} (${p.aName}) + B=${p.bId} (${p.bName})\n`);
    const browser = await chromium.launch({ headless: HEADLESS, slowMo: 50 });
    const page    = await (await browser.newContext()).newPage();
    await runPair(page, p, results, true);
    await browser.close();
    saveResults(results);
    console.log('\n✔ בדיקה הסתיימה. הרץ: node btl_step2.js');
    return;
  }

  const pending = pairs.filter(p => !results[`${p.aId}+${p.bId}`]);
  console.log(`► הושלמו: ${pairs.length - pending.length} / ${pairs.length}  |  נותרו: ${pending.length}\n`);

  if (pending.length === 0) {
    console.log('✔ כל הצירופים כבר הושלמו!');
    return;
  }

  const batch = pending.slice(0, BATCH_SIZE);
  console.log(`► מריץ ${batch.length} צירופים בסבב זה\n`);

  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 50 });
  const page    = await (await browser.newContext()).newPage();

  for (let i = 0; i < batch.length; i++) {
    if (i > 0) {
      console.log(`  ⏸  ממתין ${DELAY_MS / 1000} שניות...`);
      await sleep(DELAY_MS);
    }
    await runPair(page, batch[i], results, false);
    saveResults(results);
  }

  await browser.close();

  const remaining = pairs.filter(p => !results[`${p.aId}+${p.bId}`]).length;
  console.log(`\n✔ סבב הסתיים. ${pairs.length - remaining} / ${pairs.length} הושלמו.`);
  if (remaining > 0) console.log(`  נותרו עוד ${remaining}. הרץ שוב: node btl_step2.js`);
  else console.log('  כל הצירופים הושלמו!');
}

main().catch(err => { console.error('\n❌ שגיאה:', err.message); process.exit(1); });
