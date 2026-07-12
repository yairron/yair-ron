#!/usr/bin/env python3
"""
sync_static_values.py
------------------------
מעדכן ערכים סטטיים בעמודים שכבר מכילים תוכן קבוע עם ערכים חיים מסומנים
בתגים: data-nii="KEY" (עם או בלי data-format="FORMAT" נלווה) |
data-nii-key="KEY" data-nii-format="FORMAT" | data-nii-calc="KEY" |
data-nii-derived="KEY".

בניגוד ל-update_nii_values.py (שמעדכן רק data-nii, ורק בלוקאפ ישיר מה-JSON),
הכלי הזה טוען את העמוד בדפדפן אמיתי מול nii-constants.json החי, נותן לקוד
של העמוד עצמו לחשב את כל הערכים - כולל ערכים מחושבים/נגזרים שאין דרך
לדעת את הנוסחה שלהם בלי לקרוא את קוד העמוד - ואז קורא בחזרה את הטקסט
הסופי מכל span מסומן וכותב אותו כערך הקבוע החדש בקובץ עצמו.

לא קורא/כותב שום קובץ JS או JSON - רק את קובץ ה-HTML של העמוד עצמו.

שימוש:
    python sync_static_values.py <page> [--check-only]
"""

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-start_server, BTL_DIR, resolve_relpath וכו')

from playwright.sync_api import sync_playwright  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ATTR_NAMES = ["data-nii", "data-nii-key", "data-nii-calc", "data-nii-derived"]

# תבניות ה-span האפשריות בקובץ. data-nii-key תמיד מלווה ב-data-nii-format.
# data-nii עצמו יכול להופיע עם או בלי data-format נלווה (לדוגמה בקובץ
# old_pension_income_test_full_guide.html) - הקבוצה השנייה אופציונלית.
# data-nii-derived: אופציונלי גם כן data-nii-format נלווה - נתמך לקראת
# התבנית האחידה החדשה לעמודי קבוצה ד עתידיים (ראו CLAUDE.md), אף שאף
# קובץ קיים לא משתמש בזה עדיין.
SPAN_PATTERNS = {
    "data-nii": re.compile(r'<span data-nii="([^"]+)"(?: data-format="([^"]+)")?>([^<]*)</span>'),
    "data-nii-key": re.compile(r'<span data-nii-key="([^"]+)" data-nii-format="([^"]+)">([^<]*)</span>'),
    "data-nii-calc": re.compile(r'<span data-nii-calc="([^"]+)">([^<]*)</span>'),
    "data-nii-derived": re.compile(r'<span data-nii-derived="([^"]+)"(?: data-nii-format="([^"]+)")?>([^<]*)</span>'),
}


def capture_live_values(relpath: str) -> dict:
    """טוען את העמוד בדפדפן אמיתי, וקורא את הטקסט הנוכחי מכל span מסומן
    אחרי שקוד העמוד סיים לעדכן אותם. מחזיר dict: attr_name -> {key: text}."""
    server, port = vrp.start_server(vrp.BTL_DIR)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport=vrp.VIEWPORT)
            page.goto(f"http://127.0.0.1:{port}/{relpath}", wait_until="networkidle")
            page.wait_for_timeout(vrp.RENDER_WAIT_MS)

            result = {}
            for attr in ATTR_NAMES:
                values = page.eval_on_selector_all(
                    f"[{attr}]",
                    "els => els.map(el => [el.getAttribute('" + attr + "'), el.textContent])",
                )
                result[attr] = dict(values)
            browser.close()
    finally:
        server.shutdown()
    return result


def sync_file(relpath: str, live_values: dict) -> list:
    """מעדכן את הקובץ הסטטי לפי הערכים החיים שנלכדו. מחזיר רשימת שינויים.

    כל תבנית מטופלת בפונקציה נפרדת ומפורשת משלה (לא הכללה משותפת) -
    כי כל תבנית שונה במספר וסוג התכונות שלה, וזה מנע כאן כבר טעות
    אחת (data-format שהופיע רק בחלק מהמופעים של data-nii)."""
    page_path = vrp.BTL_DIR / relpath
    text = page_path.read_text(encoding="utf-8")
    changes = []

    def replace_data_nii(m):
        key, fmt, old_val = m.group(1), m.group(2), m.group(3)
        new_val = live_values.get("data-nii", {}).get(key)
        if new_val is None or new_val == old_val:
            return m.group(0)
        changes.append(("data-nii", key, old_val, new_val))
        if fmt:
            return f'<span data-nii="{key}" data-format="{fmt}">{new_val}</span>'
        return f'<span data-nii="{key}">{new_val}</span>'

    def replace_data_nii_key(m):
        key, fmt, old_val = m.group(1), m.group(2), m.group(3)
        new_val = live_values.get("data-nii-key", {}).get(key)
        if new_val is None or new_val == old_val:
            return m.group(0)
        changes.append(("data-nii-key", key, old_val, new_val))
        return f'<span data-nii-key="{key}" data-nii-format="{fmt}">{new_val}</span>'

    def replace_simple(attr):
        def replace(m):
            key, old_val = m.group(1), m.group(2)
            new_val = live_values.get(attr, {}).get(key)
            if new_val is None or new_val == old_val:
                return m.group(0)
            changes.append((attr, key, old_val, new_val))
            return f'<span {attr}="{key}">{new_val}</span>'
        return replace

    def replace_data_nii_derived(m):
        key, fmt, old_val = m.group(1), m.group(2), m.group(3)
        new_val = live_values.get("data-nii-derived", {}).get(key)
        if new_val is None or new_val == old_val:
            return m.group(0)
        changes.append(("data-nii-derived", key, old_val, new_val))
        if fmt:
            return f'<span data-nii-derived="{key}" data-nii-format="{fmt}">{new_val}</span>'
        return f'<span data-nii-derived="{key}">{new_val}</span>'

    text = SPAN_PATTERNS["data-nii"].sub(replace_data_nii, text)
    text = SPAN_PATTERNS["data-nii-key"].sub(replace_data_nii_key, text)
    text = SPAN_PATTERNS["data-nii-calc"].sub(replace_simple("data-nii-calc"), text)
    text = SPAN_PATTERNS["data-nii-derived"].sub(replace_data_nii_derived, text)

    if changes:
        page_path.write_text(text, encoding="utf-8")
    return changes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page", help="נתיב יחסי מ-BTL, לדוגמה senior_rights/imputed_income_guide.html")
    parser.add_argument("--check-only", action="store_true", help="לחשב ולהשוות בלבד, בלי לכתוב לקובץ")
    args = parser.parse_args()

    relpath = vrp.resolve_relpath(args.page)
    page_path = vrp.BTL_DIR / relpath
    if not page_path.exists():
        print(f"שגיאה: הקובץ {page_path} לא קיים.")
        sys.exit(2)

    print(f"טוען את {relpath} בדפדפן אמיתי מול nii-constants.json החי...")
    live_values = capture_live_values(relpath)
    total_tags = sum(len(v) for v in live_values.values())
    if total_tags == 0:
        print("שגיאה: לא נמצא אף תג data-nii*/data-nii-key/data-nii-calc/data-nii-derived בעמוד. עוצר בלי לגעת בקובץ.")
        sys.exit(2)
    for attr, mapping in live_values.items():
        if mapping:
            print(f"  {attr}: {len(mapping)} ערכים ייחודיים")

    if args.check_only:
        print("--check-only: לא נכתב לקובץ (משתמשים ב-check_nii_values_sync.py לבדיקה עצמאית אמיתית).")
        return

    changes = sync_file(relpath, live_values)
    if changes:
        print(f"\nעודכנו {len(changes)} ערכים:")
        for attr, key, old, new in changes:
            print(f"  [{attr}] {key}: {old!r} -> {new!r}")
    else:
        print("\nאין צורך לעדכן - כל הערכים כבר תואמים.")


if __name__ == "__main__":
    main()
