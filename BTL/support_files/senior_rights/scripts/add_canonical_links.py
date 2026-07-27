#!/usr/bin/env python3
"""
add_canonical_links.py
----------------------------
מוסיף/מעדכן לכל עמוד HTML ציבורי (כפי שנקבע ע"י discover_public_pages()
ב-build_sitemap.py) תג <link rel="canonical" href="..."> ב-<head>, שמצביע
על הכתובת הקנונית של אותו עמוד (build_sitemap.py.to_canonical_url - בלי
סיומת .html, עם תחילית btl/).

הסיבה: אומת בפועל (27.07.2026, curl ישיר מול השרת החי) שבניגוד למה שהיה
מתועד קודם ב-build_sitemap.py, כתובת עם סיומת .html (למשל
senior_rights/nursing_home_guide.html) *לא* עוברת הפניה לכתובת הקנונית
בלי הסיומת - שתי הכתובות חיות במקביל, שתיהן מחזירות 200 עם אותו תוכן
בדיוק, בלי שום rel="canonical" שמורה לגוגל איזו מהן העיקרית. Google
Search Console דיווח על כך בפועל כ-"Duplicate without user-selected
canonical" עבור שני עמודים (senior_rights/holocaust_survivors_rights.html,
senior_rights/nursing_home_guide.html) - אבל הבעיה קיימת פוטנציאלית בכל
עמוד באתר, לא רק בשניים שכבר נצפו/נסרקו בפועל דרך הכתובת עם הסיומת.

אידמפוטנטי ומעדכן-בעצמו - מזהה כל תג <link rel="canonical"> קיים ומחליף
אותו בכתובת הנכונה העדכנית; אם אין תג כזה - מוסיף חדש מיד אחרי
meta description.

שימוש:
    python add_canonical_links.py
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_sitemap as bs  # noqa: E402  (discover_public_pages, to_canonical_url, vrp.BTL_DIR)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BTL_DIR = bs.vrp.BTL_DIR

# עמודים שלא כדאי שיקבלו כתג קנוני את עצמם - הם עצמם רק הפניה (redirect)
# ל-URL אחר, אז אין להם "כתובת קנונית" משל עצמם.
SKIP = {"additional_guides/html/index.html"}

EXISTING_LINK_RE = re.compile(
    r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>\s*',
    re.IGNORECASE,
)
DESC_RE = re.compile(r'(<meta\s+name=["\']description["\'][^>]*>)', re.IGNORECASE)


def main():
    pages = [p for p in bs.discover_public_pages() if p not in SKIP]
    updated, unchanged, missing_description = [], [], []

    for relpath in sorted(pages):
        path = BTL_DIR / relpath
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")

        url = bs.to_canonical_url(relpath)
        tag = f'<link rel="canonical" href="{url}">'

        if EXISTING_LINK_RE.search(text):
            new_text = EXISTING_LINK_RE.sub(tag + "\n", text, count=1)
            if new_text == text:
                unchanged.append(relpath)
                continue
            path.write_text(new_text, encoding="utf-8")
            updated.append(relpath)
            continue

        new_text, count = DESC_RE.subn(lambda m: f"{m.group(1)}\n  {tag}", text, count=1)
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
