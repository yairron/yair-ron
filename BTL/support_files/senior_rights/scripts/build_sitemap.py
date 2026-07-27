#!/usr/bin/env python3
"""
build_sitemap.py
-------------------
בונה קובץ sitemap.xml בשורש BTL, עם כתובת מלאה לכל עמוד HTML ציבורי
באתר (עמוד הבית, senior_rights, new_immigrants). לא כולל: support_files,
קבצי נתונים גולמיים (js/json), שאלוני JSON.

אומת ישירות מול השרת החי (12.07.2026, curl גולמי, לא הנחה): BTL כן
מתפרסם תחת תחילית "/btl/" (אותיות קטנות - יש הפניית 301 מ-"/BTL/" עם
אותיות גדולות, וזו כן כוללת גם הורדת סיומת ".html" באותה קפיצה). לכן
כל הכתובות בקובץ הזה נבנות עם "btl/" ובלי ".html". יוצא מן הכלל: עמוד
הבית (index.html) מתפרסם ב-"btl/" עצמו (עם / בסוף) - לא ב-"btl/index"
(זו כן עוברת הפניה).

**תוקן 27.07.2026 - תיקון להנחה שגויה שהייתה כאן:** אומת מחדש בפועל
(curl ישיר) שכתובת עם סיומת ".html" בתחילית התקנית "btl/" (אותיות
קטנות מההתחלה, לא דרך הפניית BTL/) *לא* עוברת הפניה כלל - היא נשארת
חיה במקביל לכתובת הקנונית בלי הסיומת, שתיהן 200. זו הייתה הסיבה
לדיווח בפועל של Google Search Console על "Duplicate without
user-selected canonical" בשני עמודים. הפתרון: תג <link rel="canonical">
בכל עמוד (ראו add_canonical_links.py) - לא תלוי בהנחה על הפניה כלשהי.

יש להריץ מחדש בכל פעם שמוסיפים או מסירים עמוד ציבורי מהאתר.

שימוש:
    python build_sitemap.py
"""

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-BTL_DIR)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DOMAIN = "https://yairron.com"
CONTENT_DIRS = ["senior_rights", "new_immigrants", "additional_guides/html"]
OUTPUT_PATH = vrp.BTL_DIR / "sitemap.xml"


# עמוד הפניה בלבד (redirect stub, ראו _redirects) - לא תוכן אמיתי, ולא
# אמור להופיע במפת האתר (הנחיית גוגל: לא לכלול כתובות שמפנות במפת אתר).
REDIRECT_STUB_PAGES = {"additional_guides/html/index.html"}


def discover_public_pages() -> list:
    pages = ["index.html"]
    for d in CONTENT_DIRS:
        base = vrp.BTL_DIR / d
        if not base.exists():
            continue
        for p in sorted(base.glob("*.html")):
            relpath = f"{d}/{p.name}"
            if relpath in REDIRECT_STUB_PAGES:
                continue
            pages.append(relpath)
    # קובץ האינדקס לבינה מלאכותית - משאב ציבורי אמיתי (מקושר גם מ-robots.txt),
    # לא נמצא תחת אחת מ-CONTENT_DIRS, אז לא נתפס ע"י הלולאה למעלה. נוסף כאן במפורש.
    if (vrp.BTL_DIR / "ai-summary.html").exists():
        pages.append("ai-summary.html")
    # קובצי התוכן לפי נושא שהאינדקס מצביע עליהם (build_ai_summary.py) -
    # גם הם לא תחת CONTENT_DIRS, ומשאבים ציבוריים אמיתיים שכדאי שיהיו ניתנים לגילוי.
    content_dir = vrp.BTL_DIR / "ai-content"
    if content_dir.exists():
        for p in sorted(content_dir.glob("*.html")):
            pages.append(f"ai-content/{p.name}")
    return pages


def to_canonical_url(relpath: str) -> str:
    """בונה את הכתובת הקנונית (בלי הפניה) לפי מה שאומת מול השרת החי:
    תחילית btl/ (אותיות קטנות), בלי סיומת .html - חוץ מעמוד הבית עצמו."""
    if relpath == "index.html":
        return f"{DOMAIN}/btl/"
    without_ext = relpath[:-len(".html")] if relpath.endswith(".html") else relpath
    return f"{DOMAIN}/btl/{without_ext}"


def build_sitemap(pages: list) -> str:
    today = date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for relpath in pages:
        url = to_canonical_url(relpath)
        lines.append("  <url>")
        lines.append(f"    <loc>{url}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main():
    pages = discover_public_pages()
    xml = build_sitemap(pages)
    OUTPUT_PATH.write_text(xml, encoding="utf-8")
    print(f"נכתב ל-{OUTPUT_PATH} ({len(pages)} כתובות)")


if __name__ == "__main__":
    main()
