#!/usr/bin/env python3
"""
build_sitemap.py
-------------------
בונה קובץ sitemap.xml בשורש BTL, עם כתובת מלאה לכל עמוד HTML ציבורי
באתר (עמוד הבית, senior_rights, new_immigrants). לא כולל: support_files,
קבצי נתונים גולמיים (js/json), שאלוני JSON.

מניח ש-BTL הוא שורש הפרסום של האתר (כפי ש-netlify.toml שבתוכו כבר
קובע publish="." יחסית למיקומו) - כלומר BTL/index.html מתפרסם ב-
DOMAIN/index.html, בלי תחילית "/BTL/" בכתובת.

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


def discover_public_pages() -> list:
    pages = ["index.html"]
    for d in CONTENT_DIRS:
        base = vrp.BTL_DIR / d
        if not base.exists():
            continue
        for p in sorted(base.glob("*.html")):
            pages.append(f"{d}/{p.name}")
    return pages


def build_sitemap(pages: list) -> str:
    today = date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for relpath in pages:
        url = f"{DOMAIN}/{relpath}"
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
