#!/usr/bin/env python3
"""
bake_static_content.py
------------------------
מטמיע תוכן סטטי אמיתי לתוך #content של עמוד מדריך, במקום תיבת הטעינה,
כדי שקוראים בלי הרצת קוד (כולל כלי בינה מלאכותית) יראו את התוכן המלא.

איך זה עובד: טוען את העמוד בדפדפן אמיתי (מוסתר) מול nii-constants.json
החי, ממתין שהקוד של העמוד ירוץ עד הסוף (בדיוק כפי שקורה אצל משתמש רגיל),
ואז לוכד את מה שבאמת נוצר בתוך #content ומטמיע את זה בקובץ עצמו.
לא קורא/כותב שום קובץ JS או JSON - רק את קובץ ה-HTML של העמוד עצמו.

אחרי ההטמעה מריץ אוטומטית את verify_render_parity.py כדי לוודא
שלא נוצר שום הבדל בתוכן, במבנה או בתפעול לעומת הגרסה הקודמת.

שימוש:
    python bake_static_content.py <page.html> [--check-only] [--skip-verify]

הערה: מיועד לעמודים מהמשפחה של nechut_vs_shairim.html - כאלה עם
<div id="content"> שמוחלף בשלמותו על ידי קוד העמוד בזמן טעינה.
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-start_server, SENIOR_RIGHTS_DIR וכו')

from playwright.sync_api import sync_playwright  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CONTENT_START = '<div id="content">'


def find_matching_close(html: str, open_idx: int) -> int:
    """מוצא, בספירת עומק, את האינדקס (אחרי הסימן) של </div> הסוגר את ה-<div> שמתחיל ב-open_idx."""
    depth = 0
    tag_re = re.compile(r"<div\b|</div>")
    for m in tag_re.finditer(html, open_idx):
        if m.group(0) == "</div>":
            depth -= 1
            if depth == 0:
                return m.end()
        else:
            depth += 1
    raise ValueError('לא נמצא </div> סוגר תואם ל-<div id="content">')


def capture_rendered_content(relpath: str) -> str:
    server, port = vrp.start_server(vrp.BTL_DIR)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport=vrp.VIEWPORT)
            page.goto(f"http://127.0.0.1:{port}/{relpath}", wait_until="networkidle")
            page.wait_for_timeout(vrp.RENDER_WAIT_MS)
            html = page.eval_on_selector("#content", "el => el.innerHTML")
            browser.close()
    finally:
        server.shutdown()
    return html


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "page",
        help="שם קובץ תחת BTL/senior_rights (לדוגמה nechut_vs_shairim.html), "
        "או נתיב יחסי מ-BTL הכולל תיקייה (לדוגמה new_immigrants/foo.html)",
    )
    parser.add_argument("--check-only", action="store_true", help="לחשב ולהשוות בלבד, בלי לכתוב לקובץ")
    parser.add_argument("--skip-verify", action="store_true", help="לדלג על הרצת בדיקת הזהות האוטומטית בסיום")
    args = parser.parse_args()

    relpath = vrp.resolve_relpath(args.page)
    page_path = vrp.BTL_DIR / relpath
    if not page_path.exists():
        print(f"שגיאה: הקובץ {page_path} לא קיים.")
        sys.exit(2)

    original = page_path.read_text(encoding="utf-8")

    if CONTENT_START not in original:
        print(
            f'שגיאה: לא נמצא <div id="content"> ב-{relpath}. '
            "הכלי הזה מיועד רק לעמודים מהמשפחה של nechut_vs_shairim.html "
            "(תיבת תוכן יחידה שמוחלפת בשלמותה על ידי קוד העמוד)."
        )
        sys.exit(2)

    print(f"טוען את {relpath} בדפדפן אמיתי מול nii-constants.json החי...")
    rendered = capture_rendered_content(relpath)

    accordion_count = rendered.count('class="accordion"')
    if accordion_count == 0:
        print("שגיאה: התוכן שנלכד לא מכיל אף אקורדיון - כנראה הרינדור נכשל. עוצר בלי לגעת בקובץ.")
        sys.exit(2)
    print(f"נלכדו {accordion_count} אקורדיונים.")

    open_idx = original.index(CONTENT_START)
    start_idx = open_idx + len(CONTENT_START)
    close_end_idx = find_matching_close(original, open_idx)
    close_tag_idx = close_end_idx - len("</div>")

    new_html = original[:start_idx] + rendered + original[close_tag_idx:]
    changed = new_html != original
    print(f"שינוי בקובץ: {'כן' if changed else 'לא (התוכן כבר עדכני)'}")

    if args.check_only:
        print("--check-only: לא נכתב לקובץ.")
        return

    if changed:
        page_path.write_text(new_html, encoding="utf-8")
        print(f"נכתב ל-{page_path}")
    else:
        print("אין צורך לכתוב - הקובץ כבר תואם לגרסה החדשה.")

    if args.skip_verify:
        return

    print("\nמריץ בדיקת זהות אוטומטית (verify_render_parity.py)...")
    result = subprocess.run(
        [sys.executable, str(Path(__file__).resolve().parent / "verify_render_parity.py"), relpath],
        cwd=str(vrp.REPO_ROOT),
    )
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
