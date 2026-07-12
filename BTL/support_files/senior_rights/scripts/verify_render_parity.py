#!/usr/bin/env python3
"""
verify_render_parity.py
------------------------
בודק שדף HTML בענף העבודה זהה לחלוטין (טקסט ומבנה) לגרסה שלו ב-git HEAD
(או ref אחר), אחרי שהדפדפן מריץ את כל הקוד.

משמש לאימות שינויים משלב 1 (הטמעת תוכן סטטי בקובץ ה-HTML) לא שינו
שום דבר שנראה או מתפקד אחרת עבור המשתמש.

הקריטריון היחיד להצלחה/כישלון הוא זהות טקסט וזהות מבנה DOM - שני אלה
דטרמיניסטיים לחלוטין ולא השתנו אף פעם בין ריצות באותו תוכן. השוואת צילומי
מסך (אחוז פיקסלים שונים) מוצגת בדוח כמידע בלבד ולא משפיעה על ההצלחה/כישלון:
נמצא שהיא לא דטרמיניסטית (אותה השוואה בדיוק נותנת אחוזים שונים בריצות
שונות, כנראה בגלל תזמון אנימציות/גלילה פנימית בדפדפן) ולכן אינה קריטריון
אמין. גודל התמונה (רוחב/גובה) כן נבדק כממצא אמיתי, כי זו השוואה בדידה
ולא אחוז מטושטש.

שימוש:
    python verify_render_parity.py <page> [--ref HEAD] [--report out.md]

<page> יכול להיות שם קובץ בלבד (מניח שהוא תחת BTL/senior_rights, לתאימות
לאחור), או נתיב יחסי הכולל תיקייה תחת BTL (לדוגמה new_immigrants/foo.html).

דוגמאות:
    python verify_render_parity.py nechut_vs_shairim.html
    python verify_render_parity.py new_immigrants/gimlat_zikna_meyuchedet.html
"""

import argparse
import http.server
import io
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from functools import partial
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[4]
BTL_DIR = REPO_ROOT / "BTL"
SENIOR_RIGHTS_DIR = BTL_DIR / "senior_rights"
VIEWPORT = {"width": 1280, "height": 900}
RENDER_WAIT_MS = 1500  # לתת לקוד בדף (כולל setTimeout הפנימי) להספיק לרוץ


def resolve_relpath(page_arg: str) -> str:
    """נתיב יחסי מ-BTL. אם לא צוינה תיקייה, מניחים senior_rights לתאימות לאחור."""
    normalized = page_arg.replace("\\", "/")
    if "/" in normalized:
        return normalized
    return f"senior_rights/{normalized}"


def git_show(ref: str, relpath: str) -> str:
    result = subprocess.run(
        ["git", "show", f"{ref}:{relpath}"],
        cwd=REPO_ROOT, capture_output=True, check=True,
    )
    return result.stdout.decode("utf-8")


def start_server(directory: Path):
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, port


def normalize_text(t: str) -> str:
    return re.sub(r"\s+", " ", t).strip()


def diff_images(png_a: bytes, png_b: bytes, tolerance: int = 12):
    img_a = Image.open(io.BytesIO(png_a)).convert("RGB")
    img_b = Image.open(io.BytesIO(png_b)).convert("RGB")
    if img_a.size != img_b.size:
        return {"comparable": False, "size_a": img_a.size, "size_b": img_b.size}
    pixels_a = img_a.load()
    pixels_b = img_b.load()
    w, h = img_a.size
    diff_count = 0
    for y in range(h):
        for x in range(w):
            ra, ga, ba = pixels_a[x, y]
            rb, gb, bb = pixels_b[x, y]
            if abs(ra - rb) + abs(ga - gb) + abs(ba - bb) > tolerance:
                diff_count += 1
    total = w * h
    return {
        "comparable": True,
        "total_pixels": total,
        "diff_pixels": diff_count,
        "diff_percent": round(100 * diff_count / total, 4),
    }


CONTENT_SELECTOR_FALLBACKS = ["#content", ".container", "body"]

# תבנית מותרת עבור עבודת תיוג Tier B (BTL/additional_guides): הוספת
# <span data-nii-key="..."> / <span data-nii-derived="..."> (עם data-nii-format
# אופציונלי) סביב טקסט קיים, בלי לשנות/למחוק אף תו. אם זה ההבדל היחיד ב-DOM,
# זו הוספה מכוונת ולא באג - לא נחשב ממצא/כשל.
#
# הערה: לא משתמשים ב-difflib.SequenceMatcher ברמת התו כדי לזהות את זה - כשיש
# הרבה הכנסות סמוכות בטקסט עם תגי HTML חוזרים (כמו "</div>" רבים), האלגוריתם
# עלול ליישר את ה-opcodes בצורה לא צפויה (למשל לפצל "</span>" לשני חלקים לא
# שלמים), מה שגורם לזיהוי שגוי. במקום זה, "מפרקים" ישירות רק את תגי ה-span
# data-nii שאנחנו עצמנו הוספנו (open+content+close כיחידה אחת), ומשווים את
# מה שנשאר לגרסה המקורית - זה לא תלוי כלל בבחירת ה-diff algorithm.
NII_SPAN_UNWRAP_RE = re.compile(
    r'<span data-nii-(?:key|derived)="[^"]*"(?: data-nii-format="[^"]*")?>([^<]*)</span>'
)


def classify_dom_diff(old_html, new_html):
    """משווה שני outerHTML ומסווג את ההבדל: 'identical' (זהה לחלוטין),
    'nii_tags_only' (ההבדל היחיד הוא הוספת span data-nii-key/derived סביב
    טקסט קיים - הוספה מכוונת, לא כשל), או 'changed' (כל הבדל אחר - כשל אמיתי)."""
    if old_html == new_html:
        return "identical"
    unwrapped_new = NII_SPAN_UNWRAP_RE.sub(r"\1", new_html)
    if unwrapped_new == old_html:
        return "nii_tags_only"
    return "changed"


def capture_state(page):
    text = normalize_text(page.inner_text("body"))
    content_html = None
    for selector in CONTENT_SELECTOR_FALLBACKS:
        if page.query_selector(selector):
            content_html = page.eval_on_selector(selector, "el => el.outerHTML")
            break
    screenshot = page.screenshot(full_page=True)
    return {"text": text, "html": content_html, "screenshot": screenshot}


def run_page_scenario(page, url: str):
    """טוען את הדף, ממתין לרינדור, ואוסף מצב עבור מצב סגור + כל אקורדיון פתוח בנפרד."""
    page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(RENDER_WAIT_MS)

    states = {}
    states["closed"] = capture_state(page)

    headers = page.query_selector_all(".accordion-header")
    n = len(headers)
    redirect_indexes = []
    for i in range(n):
        headers = page.query_selector_all(".accordion-header")  # רענון אחרי כל קליק
        headers[i].click()
        # יש בקוד הדף גם setTimeout(450ms) לגלילה חלקה (scrollIntoView smooth) בנוסף
        # למעבר ה-CSS על גובה התוכן (0.4s) - ממתינים מספיק זמן שכל האנימציות יסתיימו
        # לגמרי לפני צילום המסך, כדי שלא ייתפס הבדל שנובע מתזמון גלילה ולא מתוכן.
        page.wait_for_timeout(1800)
        # חלק מהאקורדיונים באתר הם בעצם קישורים מוסווים שמנווטים לעמוד אחר בלחיצה
        # (למשל data-category="interactions" ב-senior_rights_full.html). אם זה קרה,
        # לא ממשיכים לבדוק את התוכן של העמוד הזר - חוזרים לעמוד המקורי וממשיכים.
        if page.url != url:
            redirect_indexes.append(i)
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(RENDER_WAIT_MS)
            continue
        states[f"accordion_{i}_open"] = capture_state(page)

    # בדיקת תת-אקורדיון אחד לדוגמה. תתי-אקורדיונים קיימים ב-DOM גם כשהאקורדיון
    # הראשי שלהם סגור (רק חבויים ב-CSS), אז קודם פותחים בפועל את האקורדיון הראשי
    # שמכיל אותם - אחרת הקליק נכשל כי האלמנט לא נראה/לא יציב.
    # מוצאים את האקורדיון הראשי דרך מעבר ב-DOM (closest) ולא לפי שם תכונה
    # ספציפי (data-index/data-section/...) - קבצים שונים באתר משתמשים בשמות שונים.
    sub_headers = page.query_selector_all(".sub-accordion-header")
    if sub_headers:
        target_sub = sub_headers[0]
        parent_header_handle = target_sub.evaluate_handle(
            "el => el.closest('.accordion').querySelector('.accordion-header')"
        )
        parent_header = parent_header_handle.as_element()
        if parent_header is None:
            raise RuntimeError('לא נמצא ".accordion-header" בתוך האקורדיון המכיל את תת-האקורדיון הראשון')
        parent_header.click()
        page.wait_for_timeout(1800)
        target_sub.click()
        page.wait_for_timeout(500)
        states["sub_accordion_0_open"] = capture_state(page)

    return states, n, len(sub_headers), redirect_indexes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page", help="שם קובץ תחת BTL/senior_rights, לדוגמה nechut_vs_shairim.html")
    parser.add_argument("--ref", default="HEAD", help="git ref של הגרסה הישנה (ברירת מחדל: HEAD)")
    parser.add_argument("--report", default=None, help="נתיב לקובץ דוח (ברירת מחדל: תיקיית reports)")
    args = parser.parse_args()

    relpath = resolve_relpath(args.page)  # יחסי ל-BTL, לדוגמה senior_rights/x.html או new_immigrants/y.html
    page_name = Path(relpath).name  # לשימוש בשם הדוח בלבד

    # מעתיקים לתיקייה זמנית את אותו מבנה תיקיות יחסי שקיים באמת תחת BTL,
    # כך שנתיבים יחסיים בתוך הדף (data/..., ../senior_rights/data/...) יעבדו
    # זהה לגרסה האמיתית - גם לעמודים שלא יושבים ישירות תחת senior_rights.
    old_dir = Path(tempfile.mkdtemp(prefix="parity_old_"))
    shutil.copytree(SENIOR_RIGHTS_DIR / "data", old_dir / "senior_rights" / "data")
    old_html = git_show(args.ref, f"BTL/{relpath}")
    old_page_path = old_dir / relpath
    old_page_path.parent.mkdir(parents=True, exist_ok=True)
    old_page_path.write_text(old_html, encoding="utf-8")

    old_server, old_port = start_server(old_dir)
    new_server, new_port = start_server(BTL_DIR)

    findings = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            old_page = browser.new_page(viewport=VIEWPORT)
            new_page = browser.new_page(viewport=VIEWPORT)

            old_url = f"http://127.0.0.1:{old_port}/{relpath}"
            new_url = f"http://127.0.0.1:{new_port}/{relpath}"

            old_states, old_n, old_sub_n, old_redirects = run_page_scenario(old_page, old_url)
            new_states, new_n, new_sub_n, new_redirects = run_page_scenario(new_page, new_url)

            browser.close()
    finally:
        old_server.shutdown()
        new_server.shutdown()

    if old_redirects or new_redirects:
        findings.append(
            f"הערה: אקורדיונים בעמדות {old_redirects or new_redirects} הם קישורי-ניווט "
            "(מנווטים לעמוד אחר בלחיצה) ולכן לא נבדק תוכנם - רק שלא קרסו."
        )
    if old_redirects != new_redirects:
        findings.append(f"רשימת אקורדיוני-הניווט שונה: ישן={old_redirects}, חדש={new_redirects}")

    if old_n != new_n:
        findings.append(f"מספר האקורדיונים שונה: ישן={old_n}, חדש={new_n}")
    if old_sub_n != new_sub_n:
        findings.append(f"מספר תתי-האקורדיונים שונה (במצב הראשון שנפתח): ישן={old_sub_n}, חדש={new_sub_n}")

    all_keys = sorted(set(old_states.keys()) | set(new_states.keys()))
    detail_rows = []
    for key in all_keys:
        if key not in old_states:
            findings.append(f"[{key}] קיים רק בגרסה החדשה")
            continue
        if key not in new_states:
            findings.append(f"[{key}] קיים רק בגרסה הישנה")
            continue

        old_s, new_s = old_states[key], new_states[key]
        text_match = old_s["text"] == new_s["text"]
        dom_status = classify_dom_diff(old_s["html"], new_s["html"])
        html_match = dom_status in ("identical", "nii_tags_only")  # שני אלה עוברים - לא נחשבים כשל
        img_diff = diff_images(old_s["screenshot"], new_s["screenshot"])

        detail_rows.append((key, text_match, dom_status, img_diff))

        if not text_match:
            # מאתר את ההבדל המדויק הראשון בין הטקסטים
            a, b = old_s["text"], new_s["text"]
            i = 0
            while i < min(len(a), len(b)) and a[i] == b[i]:
                i += 1
            findings.append(
                f"[{key}] טקסט שונה בעמדה {i}: ישן=...{a[max(0,i-40):i+40]!r}... "
                f"חדש=...{b[max(0,i-40):i+40]!r}..."
            )
        if dom_status == "changed":
            findings.append(f"[{key}] מבנה ה-DOM (בתוך {CONTENT_SELECTOR_FALLBACKS}) שונה (outerHTML לא זהה, ולא רק הוספת span data-nii)")
        # שים לב: הבדל אחוז פיקסלים לא נחשב ממצא/כשל - הוכח כלא-דטרמיניסטי
        # (ראו הסבר בראש הקובץ). רק גודל תמונה שונה (מספר בדיד) כן נחשב ממצא.
        if not img_diff["comparable"]:
            findings.append(f"[{key}] גודל התמונה שונה: {img_diff['size_a']} מול {img_diff['size_b']}")

    # דוח
    report_lines = []
    report_lines.append(f"# דוח בדיקת זהות רינדור — {relpath}")
    report_lines.append("")
    report_lines.append(f"גרסת ייחוס: `{args.ref}` | מספר אקורדיונים: {old_n} | מספר תתי-אקורדיונים (בבדיקה): {old_sub_n}")
    report_lines.append("")
    report_lines.append("## תוצאה לכל מצב שנבדק")
    report_lines.append("")
    report_lines.append("(הקריטריון להצלחה/כישלון: טקסט ומבנה בלבד. עמודת ההבדל החזותי היא מידע בלבד - ראו הסבר בראש הקובץ למה היא לא קריטריון אמין.)")
    report_lines.append("")
    report_lines.append("| מצב | טקסט זהה | מבנה DOM | הבדל חזותי (מידע בלבד) |")
    report_lines.append("|---|---|---|---|")
    dom_cell_map = {
        "identical": "✅",
        "nii_tags_only": "🏷️ (רק span data-nii נוסף)",
        "changed": "❌",
    }
    for key, text_match, dom_status, img_diff in detail_rows:
        img_cell = f"{img_diff['diff_percent']}%" if img_diff.get("comparable") else "גודל תמונה שונה"
        report_lines.append(
            f"| {key} | {'✅' if text_match else '❌'} | {dom_cell_map[dom_status]} | {img_cell} |"
        )
    report_lines.append("")

    if findings:
        report_lines.append("## ממצאים / כשלים")
        report_lines.append("")
        for f in findings:
            report_lines.append(f"- {f}")
    else:
        report_lines.append("## ממצאים")
        report_lines.append("")
        any_tags_only = any(status == "nii_tags_only" for _key, _t, status, _i in detail_rows)
        if any_tags_only:
            report_lines.append("הטקסט זהה לחלוטין בכל המצבים שנבדקו. מבנה ה-DOM זהה במקומות שסומנו ✅, ובמקומות שסומנו 🏷️ ההבדל היחיד הוא הוספת span data-nii-key/data-nii-derived סביב טקסט קיים (תיוג מכוון) - לא נחשב כשל.")
        else:
            report_lines.append("הטקסט ומבנה ה-DOM זהים לחלוטין בכל המצבים שנבדקו (הקריטריון הקובע). ראו טבלה למידע חזותי בלבד.")

    report_text = "\n".join(report_lines)

    report_path = Path(args.report) if args.report else (
        Path(__file__).resolve().parent / "reports" / f"parity_{page_name.replace('.html','')}.md"
    )
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report_text, encoding="utf-8")

    print(report_text)
    print(f"\n(דוח נשמר גם ב: {report_path})")

    sys.exit(1 if findings else 0)


if __name__ == "__main__":
    main()
