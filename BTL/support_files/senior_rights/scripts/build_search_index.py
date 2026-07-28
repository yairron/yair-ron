#!/usr/bin/env python3
"""
build_search_index.py
----------------------
בונה אינדקס חיפוש מבוסס-תוכן (BTL/senior_rights/data/search-index.json) -
לכל אקורדיון ותת-אקורדיון בכל עמודי המדריך (בכל שלוש משפחות התבנית
באתר), הטקסט המלא שלו (כולל תתי-האקורדיונים המקוננים בתוכו) + שרשרת
הכותרות (path, גם גרסה מנורמלת וגם גרסה מקורית להצגה) מהאקורדיון הראשי
ועד אליו.

נועד לפתור מגבלה ב-search-widget.js הקיים: הוא מחפש רק בכותרות התפריט
(hamburger-nav), לא בתוכן העמודים עצמו - מילה שמופיעה בתוך עמוד אך לא
בתווית הקישור שלו בתפריט (למשל "תג" בתוך chanaya_shmura_ezrach_vatik.html)
לא עלתה בחיפוש בכלל. ראו את הדיון המלא ב-BTL/claude_last_chat.md.

**קריטי:** לוגיקת החילוץ (extractSearchEntries) ולוגיקת הנרמול
(normalizeTitle) חיות במקור אחד ויחיד -
BTL/senior_rights/data/accordion-search-nav.js - ולא משוכפלות כאן
בפייתון. הסקריפט הזה מזריק את אותו קובץ JS בדיוק לתוך כל דף (דרך
Playwright, page.add_script_tag) ומריץ בתוכו את extractSearchEntries().
כך גם בניית האינדקס (כאן) וגם הפתיחה בזמן אמת בדפדפן (openFromPath,
שרץ כשמשתמש אמיתי לוחץ על תוצאת חיפוש) תמיד משתמשות באותה נורמליזציה
מילה-במילה - שכפול בשתי שפות היה מסוכן: כל סטייה קטנה הייתה גורמת
להתאמות ליפול בשקט, בדיוק הסיכון שכבר זוהה מראש בתכנון התכונה הזו.

לא בונה רשימת סיווג-קבצים מקבילה משלו - קורא ישירות מ-KNOWN_FILES
הקיים ב-build_ai_summary.py (אותו מקור אמת יחיד לאילו עמודים הם תוכן
מדריך אמיתי שכדאי לאנדקס, לא כלי אינטראקטיבי/שאלון/עמוד ניווט).

שימוש:
    python build_search_index.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (start_server, BTL_DIR, VIEWPORT, RENDER_WAIT_MS)
import build_ai_summary as bas  # noqa: E402  (KNOWN_FILES, discover_html_files - מקור אמת יחיד לרשימת הדפים)

from playwright.sync_api import sync_playwright  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

EXTRACTOR_JS_PATH = vrp.BTL_DIR / "senior_rights" / "data" / "accordion-search-nav.js"
OUTPUT_PATH = vrp.BTL_DIR / "senior_rights" / "data" / "search-index.json"


def build_index(include_files: list, extractor_js: str) -> list:
    server, port = vrp.start_server(vrp.BTL_DIR)
    all_entries = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport=vrp.VIEWPORT)
            for relpath in include_files:
                page.goto(f"http://127.0.0.1:{port}/{relpath}", wait_until="networkidle")
                page.wait_for_timeout(vrp.RENDER_WAIT_MS)
                # מזריקים את הקובץ המשותף בכל דף, בין אם הוא כבר טוען אותו
                # בעצמו (<script src>) ובין אם לא (עמודי פיילוט/config+embedded
                # שעדיין לא חוברו ל-openFromPath בזמן אמת) - כאן אנחנו רק
                # קוראים ל-extractSearchEntries(), לא ל-openFromPath, אז אין
                # השפעה על מצב הדף.
                page.add_script_tag(content=extractor_js)
                entries = page.evaluate("extractSearchEntries()")
                print(f"  {relpath}: {len(entries)} ערכים")
                for e in entries:
                    all_entries.append({
                        "page": relpath,
                        "rawPath": e["rawPath"],
                        "normPath": e["normPath"],
                        "text": e["text"],
                    })
            browser.close()
    finally:
        server.shutdown()
    return all_entries


def main():
    # אותה בדיקת "לא לנחש" כמו build_ai_summary.py - לא בונים רשימת
    # סיווג מקבילה, קוראים ישירות מ-KNOWN_FILES שם.
    discovered = set(bas.discover_html_files())
    known = set(bas.KNOWN_FILES.keys())
    unclassified = sorted(discovered - known)
    if unclassified:
        print(f"⚠️  {len(unclassified)} קבצים לא מסווגים ב-KNOWN_FILES (build_ai_summary.py) - לא נכללים באינדקס החיפוש:")
        for f in unclassified:
            print(f"    - {f}")
        print()

    include_files = sorted(
        relpath for relpath, (status, _reason) in bas.KNOWN_FILES.items()
        if status == "include" and relpath in discovered
    )

    if not EXTRACTOR_JS_PATH.exists():
        print(f"❌ לא נמצא {EXTRACTOR_JS_PATH}")
        sys.exit(1)
    extractor_js = EXTRACTOR_JS_PATH.read_text(encoding="utf-8")

    print(f"בונה אינדקס חיפוש מ-{len(include_files)} קבצים...")
    entries = build_index(include_files, extractor_js)

    OUTPUT_PATH.write_text(
        json.dumps(entries, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    size_kb = OUTPUT_PATH.stat().st_size // 1024
    print(f"\nנכתב {OUTPUT_PATH} ({len(entries)} ערכים מתוך {len(include_files)} עמודים, {size_kb}KB)")


if __name__ == "__main__":
    main()
