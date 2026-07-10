#!/usr/bin/env python3
"""
build_ai_summary.py
----------------------
בונה קובץ ריכוז אחד, בטקסט נקי (בלי HTML/עיצוב), לשימוש כלי בינה
מלאכותית - מרכז את התוכן המלא מכל עמודי המדריך שכבר אומתו כמכילים
תוכן סטטי אמיתי (עמודי "מנוע הליבה" שהוטמעו, וקבוצה ד' שאומתה).

לא מנחש אילו קבצים לכלול: כל קובץ HTML שנמצא בפועל תחת
BTL/senior_rights ו-BTL/new_immigrants נבדק מול טבלת סיווג מלאה
(KNOWN_FILES). קובץ שלא מופיע שם בכלל - לא נכלל ולא נדחה בשקט, אלא
מודפס כאזהרה מפורשת ("קובץ לא מסווג"). קובץ שכן מופיע ברשימה אך נמחק
מהדיסק - גם הוא מודפס כאזהרה, לא נעלם בלי התראה.

שימוש:
    python build_ai_summary.py
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-start_server, BTL_DIR, VIEWPORT, RENDER_WAIT_MS)

from playwright.sync_api import sync_playwright  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CONTENT_DIRS = ["senior_rights", "new_immigrants"]
OUTPUT_PATH = vrp.BTL_DIR / "ai-summary.txt"

# סיווג מלא של כל קובצי התוכן הידועים באתר (מהמיפוי המפורט שכבר בוצע
# בעבודה על שלב 1). status: "include" - יש בו תוכן סטטי מאומת, נכלל
# בקובץ הריכוז. "exclude" - עם סיבה מפורשת, לא נכלל.
KNOWN_FILES = {
    # מנוע ליבה - הוטמע בפועל ואומת מול הגרסה הקודמת (verify_render_parity.py)
    "senior_rights/nechut_vs_shairim.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "senior_rights/senior_citizens_rights_2026.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "senior_rights/nursing_home_guide.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "senior_rights/senior_rights_full.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "senior_rights/financial-tables-and-definitions.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "new_immigrants/gimlat_zikna_meyuchedet.html": ("include", "מנוע ליבה - הוטמע ואומת"),
    "new_immigrants/international_treaties.html": ("include", "מנוע ליבה - הוטמע ואומת"),

    # קבוצה ד' - כבר סטטיים, אומתו מול nii-constants.json (check_nii_values_sync.py)
    "senior_rights/imputed_income_guide.html": ("include", "קבוצה ד' - אומת"),
    "senior_rights/old_pension_income_test_full_guide.html": ("include", "קבוצה ד' - אומת"),
    "senior_rights/survivors_benefits_guide_2026.html": ("include", "קבוצה ד' - אומת"),
    "senior_rights/women_transition_benefit_guide.html": ("include", "קבוצה ד' - אומת"),

    # קבצים סטטיים אחרים - קיימים, אך לא נבדקו/אומתו בסבב הנוכחי - לא נכללים כרגע
    "senior_rights/dependents_definition_old_age_survivors.html": ("exclude", "תוכן סטטי אך לא אומת בסבב הנוכחי"),
    "senior_rights/forms.html": ("exclude", "רשימת טפסים, לא תוכן מדריך"),
    "senior_rights/benefits-index.html": ("exclude", "לא אומת בסבב הנוכחי"),
    "senior_rights/important-links.html": ("exclude", "תיבת תוכן ריקה (קבוצה ג') - הוחלט לא לטפל"),
    "senior_rights/Information_Sources.html": ("exclude", "תוכן נטען חלקית לפי קליק על כל מסמך - לא נבדק"),
    "senior_rights/counseling_referral_form.html": ("exclude", "טופס, לא תוכן מידע"),
    "senior_rights/holocaust_survivors_rights.html": ("exclude", "מבנה היברידי מורכב (טאבים+שאלון) - לא טופל"),
    "senior_rights/benefit-combinations.html": ("exclude", "מחשבון אינטראקטיבי - תוכן תלוי קלט משתמש"),
    "senior_rights/age_pension_eligibility_calculator.html": ("exclude", "מחשבון אינטראקטיבי"),
    "senior_rights/retirement-calculator.html": ("exclude", "מחשבון אינטראקטיבי"),
    "senior_rights/id-check.html": ("exclude", "מחשבון/כלי בדיקה"),
    "senior_rights/questionnaire.html": ("exclude", "מנוע שאלונים - תוכן תלוי קלט משתמש"),
    "senior_rights/sampels.html": ("exclude", "לא מקושר מהאתר החי (קישור מוסתר בהערה ב-index.html)"),
    "new_immigrants/new_immigrants_full.html": ("exclude", "עמוד ניווט/תפריט, לא תוכן מדריך"),
}


def discover_html_files() -> list:
    files = []
    for d in CONTENT_DIRS:
        base = vrp.BTL_DIR / d
        if not base.exists():
            continue
        for p in sorted(base.glob("*.html")):
            files.append(f"{d}/{p.name}")
    return files


def clean_text(raw: str) -> str:
    """משמר מבנה שורות (כותרות/פסקאות בשורה משלהן, כמו ש-inner_text כבר
    מפיק), רק מנקה רווחים מיותרים בכל שורה ומוריד שורות ריקות."""
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in raw.splitlines()]
    return "\n".join(line for line in lines if line)


def build_summary(include_files: list) -> list:
    server, port = vrp.start_server(vrp.BTL_DIR)
    sections = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport=vrp.VIEWPORT)
            for relpath in include_files:
                print(f"  מחלץ טקסט מ-{relpath}...")
                page.goto(f"http://127.0.0.1:{port}/{relpath}", wait_until="networkidle")
                page.wait_for_timeout(vrp.RENDER_WAIT_MS)
                raw = page.inner_text("body")
                sections.append((relpath, clean_text(raw)))
            browser.close()
    finally:
        server.shutdown()
    return sections


def main():
    discovered = set(discover_html_files())
    known = set(KNOWN_FILES.keys())

    unclassified = sorted(discovered - known)
    missing = sorted(known - discovered)

    if unclassified:
        print(f"⚠️  נמצאו {len(unclassified)} קבצים לא מסווגים - לא נכללים אוטומטית, יש לבדוק ולהוסיף ל-KNOWN_FILES:")
        for f in unclassified:
            print(f"    - {f}")
        print()

    if missing:
        print(f"⚠️  {len(missing)} קבצים ברשימת הסיווג לא נמצאו בדיסק (אולי נמחקו) - יש להסיר מ-KNOWN_FILES:")
        for f in missing:
            print(f"    - {f}")
        print()

    include_files = sorted(
        relpath for relpath, (status, _reason) in KNOWN_FILES.items()
        if status == "include" and relpath in discovered
    )

    print(f"מרכז תוכן מ-{len(include_files)} קבצים...")
    sections = build_summary(include_files)

    output_lines = [
        "ריכוז מידע - זכויות אזרחים ותיקים בישראל",
        "",
        "מסמך זה נוצר אוטומטית ומרכז את התוכן המלא של עמודי המדריך באתר, לשימוש כלי בינה מלאכותית.",
        "המידע מבוסס על אתר הביטוח הלאומי ומקורות רשמיים נוספים, ומעודכן בכל פעם שהתוכן החי משתנה.",
        "",
    ]
    for relpath, text in sections:
        output_lines.append(f"===== {relpath} =====")
        output_lines.append("")
        output_lines.append(text)
        output_lines.append("")

    OUTPUT_PATH.write_text("\n".join(output_lines), encoding="utf-8")
    print(f"\nנכתב ל-{OUTPUT_PATH} ({len(sections)} פרקים)")


if __name__ == "__main__":
    main()
