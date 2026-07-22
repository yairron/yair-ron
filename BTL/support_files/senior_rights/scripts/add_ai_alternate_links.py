#!/usr/bin/env python3
"""
add_ai_alternate_links.py
----------------------------
מוסיף לכל עמוד מדריך שכלול ב-TOPICS (ראו build_ai_summary.py) תג
<link rel="alternate" type="text/plain" href="..."> ב-<head>, שמצביע על
קובץ הטקסט הנקי (ai-content/<topic>.txt) שמכיל את תוכן העמוד הזה.

הסיבה: כלי AI חיצוניים (פרפלקסיטי, ג'מיני) ששולפים עמוד באתר בזמן אמת
מורידים את קובץ ה-HTML הגולמי במלואו - כולל כל קוד העיצוב/JS (עד
300KB+ בעמודים מסוימים), לא רק את הטקסט. זה גורם להם "לגמור מכסה" לפני
שמגיעים לפרטים הספציפיים בעומק העמוד. rel="alternate" הוא תקן רשת
סטנדרטי (אותו מנגנון כמו גילוי RSS) שמצביע על גרסת טקסט נקייה וקלה בהרבה
של אותו תוכן - בלי לשנות שום דבר בתצוגה לבן אדם.

אידמפוטנטי - מדלג על עמוד שכבר יש בו את התג (מזהה rel=alternate +
type=text/plain יחד, בלי תלות בסדר התכונות).

שימוש:
    python add_ai_alternate_links.py
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ai_summary as bas  # noqa: E402  (TOPICS, CONTENT_URL_PREFIX, vrp.BTL_DIR)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BTL_DIR = bas.vrp.BTL_DIR

LINK_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\btype=["\']text/plain["\'])[^>]*>',
    re.IGNORECASE,
)
DESC_RE = re.compile(r'(<meta\s+name=["\']description["\'][^>]*>)', re.IGNORECASE)


def topic_of_map() -> dict:
    m = {}
    for slug, (_title, _desc, paths) in bas.TOPICS.items():
        for p in paths:
            m[p] = slug
    return m


def main():
    topic_of = topic_of_map()
    updated, already_present, missing_description = [], [], []

    for relpath, slug in sorted(topic_of.items()):
        path = BTL_DIR / relpath
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")

        if LINK_RE.search(text):
            already_present.append(relpath)
            continue

        url = f"{bas.CONTENT_URL_PREFIX}/{slug}.txt"
        tag = f'<link rel="alternate" type="text/plain" href="{url}">'
        new_text, count = DESC_RE.subn(lambda m: f"{m.group(1)}\n    {tag}", text, count=1)
        if count == 0:
            missing_description.append(relpath)
            continue

        path.write_text(new_text, encoding="utf-8")
        updated.append(relpath)

    print(f"עודכנו {len(updated)} עמודים:")
    for r in updated:
        print(f"    + {r}")

    if already_present:
        print(f"\nכבר היה קיים בהם התג ({len(already_present)}):")
        for r in already_present:
            print(f"    = {r}")

    if missing_description:
        print(f"\n⚠️  לא נמצא meta description ({len(missing_description)}) - יש להוסיף את התג ידנית:")
        for r in missing_description:
            print(f"    ! {r}")


if __name__ == "__main__":
    main()
