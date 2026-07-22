#!/usr/bin/env python3
"""
build_ai_summary.py
----------------------
בונה אינדקס קצר (BTL/ai-summary.html) + קובצי תוכן לפי נושא
(BTL/ai-content/<topic>.html), לשימוש כלי בינה מלאכותית - מרכז את התוכן
המלא מכל עמודי המדריך שכבר אומתו כמכילים תוכן סטטי אמיתי (עמודי "מנוע
הליבה" שהוטמעו, וקבוצה ד' שאומתה).

פוצל מקובץ ריכוז יחיד (עד 20.07.2026) לאינדקס+קבצי-נושא ב-20.07.2026,
אחרי שג'מיני דיווח בפועל על חסימה בשליפת הקובץ המאוחד (~800KB) - כלי
fetch/grounding חיצוניים מגבילים גודל תוכן שהם שולפים מכתובת בודדת.
כל קובץ נושא כולל כמה עמודים קרובים בנושא, כדי לצמצם את הגודל שנשלף
בבת אחת (רוב הקבצים 40-165KB; faq.html לבדו ~250KB כי הוא עמוד אחד ענק
שלא פוצל בתוך עצמו). ai-summary.html הפך לאינדקס קצר בלבד שמצביע על
קובצי הנושא - לא מכיל יותר את התוכן המלא.

**עודכן 22.07.2026 - הפלט הוא HTML מינימלי, לא עוד .txt גולמי:** ג'מיני
דיווח בפועל שכלי הגלישה שלו לא יודע לגשת לקבצי `.txt` ישירים בכלל (רק
לעמודי HTML) - ככל הנראה כלי "גלישה" מבוססי-רינדור לא יודעים לטפל
בתגובת `text/plain`. הפתרון: אותו טקסט בדיוק, עטוף במעטפת HTML מינימלית
(`<pre>` בלי CSS/JS/תפריטים) כדי שה-Content-Type יהיה `text/html` -
עדיין קל בהרבה מעמודי המדריך המלאים. ראו `wrap_html()` למטה. **אין יותר
קובצי `.txt` באתר בהקשר הזה בכלל** - נמחקו לגמרי, כל ההפניות (רשימת
`ALL_PAGES`-כמו קישורי footer, `robots.txt`, `add_ai_alternate_links.py`,
`btl-chat.js`, `build_sitemap.py`) עודכנו ל-`.html`.

לא מנחש אילו קבצים לכלול: כל קובץ HTML שנמצא בפועל תחת
BTL/senior_rights ו-BTL/new_immigrants נבדק מול טבלת סיווג מלאה
(KNOWN_FILES). קובץ שלא מופיע שם בכלל - לא נכלל ולא נדחה בשקט, אלא
מודפס כאזהרה מפורשת ("קובץ לא מסווג"). קובץ שכן מופיע ברשימה אך נמחק
מהדיסק - גם הוא מודפס כאזהרה, לא נעלם בלי התראה. באותו אופן, קובץ
"include" שלא שובץ לאף נושא ב-TOPICS מודפס כאזהרה נפרדת - כל עמוד
"include" חייב להיות משובץ לנושא אחד בדיוק.

שימוש:
    python build_ai_summary.py
"""

import html as html_module
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-start_server, BTL_DIR, VIEWPORT, RENDER_WAIT_MS)

from playwright.sync_api import sync_playwright  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CONTENT_DIRS = ["senior_rights", "new_immigrants", "additional_guides/html"]
INDEX_PATH = vrp.BTL_DIR / "ai-summary.html"
CONTENT_DIR = vrp.BTL_DIR / "ai-content"
# כתובת מלאה (לא יחסית) בקובץ האינדקס בכוונה - זה טקסט גולמי, לא HTML,
# אז אין רזולוציית קישור יחסי אוטומטית עבור כלי שקורא את הטקסט כפרוזה.
CONTENT_URL_PREFIX = "https://yairron.com/btl/ai-content"

# כל עמוד "include" ב-KNOWN_FILES חייב להיות משובץ לנושא אחד בדיוק כאן.
# קיבוץ לפי קרבה נושאית, עם איזון גודל בערך (ראו הערה למעלה) - לא לפי
# תיקיית המקור של הקובץ (עמודים מ-senior_rights/new_immigrants/
# additional_guides מעורבבים בין הנושאים לפי תוכן, לא לפי מיקום).
TOPICS = {
    "btl-faq": (
        "שאלות ותשובות נפוצות",
        "מאגר שאלות-תשובות קצרות שמכסה את רוב נושאי האתר - קצבת זקנה, שאירים, סיעוד, הכנסה ועוד.",
        ["senior_rights/faq.html"],
    ),
    "btl-pension-overview": (
        "קצבת זקנה - סקירה כללית",
        "מדריכים מקיפים לכלל זכויות האזרח הוותיק וקצבת הזקנה: תנאי זכאות, סכומים, תהליכים.",
        ["senior_rights/senior_rights_full.html", "senior_rights/senior_citizens_rights_2026.html"],
    ),
    "btl-income-test": (
        "מבחני הכנסה וטבלאות סכומים",
        "חישוב זכאות לפי מבחן הכנסות (עבודה/נכסים/הכנסה רעיונית), טבלאות תקרות וסכומים מרכזיים.",
        [
            "senior_rights/old_pension_income_test_full_guide.html",
            "senior_rights/imputed_income_guide.html",
            "senior_rights/financial-tables-and-definitions.html",
            "additional_guides/html/takrut_hachnasa.html",
        ],
    ),
    "btl-survivors-disability": (
        "קצבת שאירים ונכות",
        "קצבת שאירים, השוואה מול קצבת נכות כללית, נכות מעבודה, והגדרת תלויים לצורך זכאות.",
        [
            "senior_rights/survivors_benefits_guide_2026.html",
            "senior_rights/nechut_vs_shairim.html",
            "additional_guides/html/nechut_mul_shairim.html",
            "additional_guides/html/hagdarat_tluim.html",
            "additional_guides/html/nechut_klalit_mul_avoda.html",
        ],
    ),
    "btl-immigrants-treaties": (
        "עולים חדשים ואמנות בינלאומיות",
        "גמלת זקנה מיוחדת לעולים ותושבים חוזרים, ואמנות ביטחון סוציאלי בינלאומיות של ישראל.",
        [
            "new_immigrants/gimlat_zikna_meyuchedet.html",
            "new_immigrants/international_treaties.html",
            "additional_guides/html/amnot_binleumiot.html",
            "additional_guides/html/gamlay_zikna.html",
        ],
    ),
    "btl-care-transitions": (
        "סיעוד, נשים ומעברים",
        "סיוע במימון בית אבות, מענק מעבר לנשים, יציאה לחו\"ל, חובת התייצבות, תקופת אכשרה, זכויות באשפוז, והעסקת עובד זר בסיעוד.",
        [
            "senior_rights/nursing_home_guide.html",
            "senior_rights/women_transition_benefit_guide.html",
            "additional_guides/html/yetzia_lachul.html",
            "additional_guides/html/chovaat_hitatzbut.html",
            "additional_guides/html/tkufat_achshara.html",
            "additional_guides/html/zchuyot_achrei_ishpuz.html",
            "additional_guides/html/oved_zar_bituach_leumi.html",
        ],
    ),
    "btl-special-cases": (
        "מקרים מיוחדים",
        "מקרים חריגים בגמלאות, דו\"ח זכויות מבצע שאגת הארי, ייפוי כוח מתמשך, ועמוד ניווט לסיכומי ה-PDF.",
        [
            "additional_guides/html/mekarim_meyuchadim.html",
            "additional_guides/html/shaagat_haari.html",
            "additional_guides/html/additional_guides_index.html",
            "additional_guides/html/yipuy_koach_mitmashech.html",
        ],
    ),
}

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
    "senior_rights/faq.html": ("include", "מנוע ליבה - הוטמע ואומת - שאלות נפוצות שנבנו מבדיקת 150 שאלות מול btl-chat.js"),

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

    # additional_guides - סיכומי PDF שהועברו מ-YR1/BTL (תוכן סטטי קבוע)
    "additional_guides/html/amnot_binleumiot.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/chovaat_hitatzbut.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/gamlay_zikna.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/hagdarat_tluim.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/mekarim_meyuchadim.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/nechut_mul_shairim.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/shaagat_haari.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/takrut_hachnasa.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/tkufat_achshara.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/yetzia_lachul.html": ("include", "סיכום PDF - תוכן סטטי"),
    "additional_guides/html/additional_guides_index.html": ("include", "עמוד ניווט ל-PDF-ים - כותרות האקורדיונים משקפות רשימת נושאים שימושית גם בלי טקסט ה-PDF עצמו"),
    "additional_guides/html/index.html": ("exclude", "הפניה (redirect) בלבד"),
    "additional_guides/html/zchuyot_achrei_ishpuz.html": ("include", "סיכום PDF - תוכן סטטי, הועתק ל-HTML 22.07.2026"),
    "additional_guides/html/yipuy_koach_mitmashech.html": ("include", "סיכום PDF - תוכן סטטי, הועתק ל-HTML 22.07.2026"),
    "additional_guides/html/nechut_klalit_mul_avoda.html": ("include", "סיכום PDF - תוכן סטטי, הועתק ל-HTML 22.07.2026"),
    "additional_guides/html/oved_zar_bituach_leumi.html": ("include", "סיכום PDF - תוכן סטטי, הועתק ל-HTML 22.07.2026"),
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


def wrap_html(title: str, plain_text: str) -> str:
    """עוטף טקסט רגיל במעטפת HTML מינימלית - בלי CSS/JS/תפריטים - רק כדי
    שה-Content-Type שהשרת מגיש יהיה text/html במקום text/plain (ראו הערה
    בראש הקובץ). התוכן עצמו בתוך <pre> נשאר בדיוק אותו טקסט, רק עם escape
    ל-& < > (לא ל-quote, מיותר בתוך text node). btl-chat.js עושה את
    ה-unescape הסימטרי אחרי שליפת ה-<pre> בזמן ריצה."""
    escaped = html_module.escape(plain_text, quote=False)
    return (
        "<!DOCTYPE html>\n"
        '<html lang="he" dir="rtl">\n'
        "<head>\n"
        '<meta charset="UTF-8">\n'
        f"<title>{html_module.escape(title, quote=False)}</title>\n"
        "</head>\n"
        "<body>\n"
        '<pre style="white-space:pre-wrap;word-wrap:break-word;font-family:inherit">\n'
        f"{escaped}\n"
        "</pre>\n"
        "</body>\n"
        "</html>\n"
    )


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

    topic_of = {}
    for slug, (_title, _desc, paths) in TOPICS.items():
        for p in paths:
            topic_of[p] = slug
    unassigned = sorted(set(include_files) - set(topic_of.keys()))
    if unassigned:
        print(f"⚠️  {len(unassigned)} קבצי 'include' לא משובצים לאף נושא ב-TOPICS - יש לשבץ:")
        for f in unassigned:
            print(f"    - {f}")
        print()

    print(f"מרכז תוכן מ-{len(include_files)} קבצים...")
    sections = build_summary(include_files)
    text_of = dict(sections)

    CONTENT_DIR.mkdir(exist_ok=True)
    index_lines = [
        "ריכוז מידע - זכויות אזרחים ותיקים בישראל (אינדקס)",
        "",
        "מסמך זה הוא אינדקס קצר לתוכן המדריכים באתר, לשימוש כלי בינה מלאכותית.",
        "התוכן המלא מפוצל לקבצי נושא נפרדים (במקום קובץ אחד גדול), כדי שכל קובץ יהיה קטן וניתן לשליפה בבודדת.",
        "לכל שאלה - יש לשלוף את קובץ הנושא הרלוונטי ביותר מהרשימה למטה, ולחפש בתוכו את העמוד המדויק (מסומן בקובץ בהפרדת \"===== נתיב =====\").",
        "",
    ]

    for slug, (title, desc, paths) in TOPICS.items():
        topic_paths = [p for p in paths if p in text_of]
        if not topic_paths:
            continue
        topic_lines = []
        for relpath in topic_paths:
            topic_lines.append(f"===== {relpath} =====")
            topic_lines.append("")
            topic_lines.append(text_of[relpath])
            topic_lines.append("")
        content_path = CONTENT_DIR / f"{slug}.html"
        content_path.write_text(wrap_html(title, "\n".join(topic_lines)), encoding="utf-8")
        size_kb = content_path.stat().st_size // 1024
        print(f"  נכתב ל-{content_path} ({len(topic_paths)} עמודים, {size_kb}KB)")

        index_lines.append(f"📁 {CONTENT_URL_PREFIX}/{slug}.html — {title}")
        index_lines.append(f"   {desc}")
        for relpath in topic_paths:
            index_lines.append(f"   - {relpath}")
        index_lines.append("")

    INDEX_PATH.write_text(wrap_html("ריכוז מידע - זכויות אזרחים ותיקים בישראל (אינדקס)", "\n".join(index_lines)), encoding="utf-8")
    print(f"\nנכתב אינדקס ל-{INDEX_PATH} ({len(TOPICS)} נושאים, {len(sections)} עמודים)")


if __name__ == "__main__":
    main()
