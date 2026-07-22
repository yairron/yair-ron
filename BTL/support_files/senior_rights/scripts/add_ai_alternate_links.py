#!/usr/bin/env python3
"""
add_ai_alternate_links.py
----------------------------
מוסיף/מעדכן לכל עמוד מדריך שכלול ב-TOPICS (ראו build_ai_summary.py) תג
<link rel="alternate" type="text/html" href="..."> ב-<head>, שמצביע על
קובץ ה-HTML המינימלי (ai-content/<topic>.html) שמכיל את תוכן העמוד הזה.

הסיבה: כלי AI חיצוניים (פרפלקסיטי, ג'מיני) ששולפים עמוד באתר בזמן אמת
מורידים את קובץ ה-HTML הגולמי במלואו - כולל כל קוד העיצוב/JS (עד
300KB+ בעמודים מסוימים), לא רק את הטקסט. זה גורם להם "לגמור מכסה" לפני
שמגיעים לפרטים הספציפיים בעומק העמוד. rel="alternate" הוא תקן רשת
סטנדרטי (אותו מנגנון כמו גילוי RSS) שמצביע על גרסה קלה בהרבה של אותו
תוכן - בלי לשנות שום דבר בתצוגה לבן אדם.

**עודכן 22.07.2026:** type="text/plain" (קובצי .txt גולמיים) הוחלף ל-
type="text/html" (קובצי .html עטופים מינימלית) - ג'מיני דיווח שכלי
הגלישה שלו לא ניגש בכלל לקבצי .txt. ראו הערה בראש build_ai_summary.py.

אידמפוטנטי ומעדכן-בעצמו - מזהה כל תג <link rel=alternate> קיים שמצביע
ל-ai-content (בלי תלות בסוג ה-type הישן/חדש) ומחליף אותו בתג הנכון
העדכני; אם אין תג כזה - מוסיף חדש. כלומר גם שינוי עתידי בשם/type יתעדכן
אוטומטית בהרצה חוזרת, לא רק הוספה חד-פעמית.

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

# תופס כל <link rel="alternate" ...> שמצביע ל-ai-content, בלי תלות ב-type
# (כדי לתפוס גם תגים ישנים מהדור הקודם עם type="text/plain").
EXISTING_LINK_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*href=["\'][^"\']*ai-content/)[^>]*>\s*',
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
    updated, unchanged, missing_description = [], [], []

    for relpath, slug in sorted(topic_of.items()):
        path = BTL_DIR / relpath
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")

        url = f"{bas.CONTENT_URL_PREFIX}/{slug}.html"
        tag = f'<link rel="alternate" type="text/html" href="{url}">'

        if EXISTING_LINK_RE.search(text):
            new_text = EXISTING_LINK_RE.sub(tag + "\n", text, count=1)
            if new_text == text:
                unchanged.append(relpath)
                continue
            path.write_text(new_text, encoding="utf-8")
            updated.append(relpath)
            continue

        new_text, count = DESC_RE.subn(lambda m: f"{m.group(1)}\n    {tag}", text, count=1)
        if count == 0:
            missing_description.append(relpath)
            continue

        path.write_text(new_text, encoding="utf-8")
        updated.append(relpath)

    print(f"עודכנו/נוספו {len(updated)} עמודים:")
    for r in updated:
        print(f"    + {r}")

    if unchanged:
        print(f"\nכבר היו עדכניים ({len(unchanged)}):")
        for r in unchanged:
            print(f"    = {r}")

    if missing_description:
        print(f"\n⚠️  לא נמצא meta description ({len(missing_description)}) - יש להוסיף את התג ידנית:")
        for r in missing_description:
            print(f"    ! {r}")


if __name__ == "__main__":
    main()
