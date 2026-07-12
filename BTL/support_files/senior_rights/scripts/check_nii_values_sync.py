#!/usr/bin/env python3
"""
check_nii_values_sync.py
---------------------------
בודק עצמאי: מוודא שהערכים הכתובים בפועל בקובץ HTML תואמים למה שאמור
להיות לפי nii-constants.json - בלי להסתמך על הקוד של sync_static_values.py
או update_nii_values.py. מחשב את הערך הצפוי בעצמו, ישירות מה-JSON,
ומשווה מול הטקסט שכתוב בקובץ.

תומך בבדיקה עצמאית מלאה עבור:
    <span data-nii="KEY">...</span>
    <span data-nii="KEY" data-format="FORMAT">...</span>  (אם הכלל תועד ב-FILE_SPECIFIC_FORMAT_RULES)
    <span data-nii-key="KEY" data-nii-format="FORMAT">...</span>

לא תומך עדיין ב-data-nii-calc / data-nii-derived (ערכים מחושבים לפי נוסחה
שטרם תועדה כאן) - אלה מדווחים כ"לא ניתן לאמת", לא כתקינים ולא כשגויים.

חשוב: אין מוסכמה אחידה באתר לעיצוב data-format="percent" (ואחרים) - כל
קובץ עשוי לממש את זה אחרת בקוד ה-JS שלו. לכן כלל עיצוב לא מנוחש באופן
כללי, אלא מתועד במפורש per-file ב-FILE_SPECIFIC_FORMAT_RULES, אחרי
שנקרא בפועל קוד ה-JS של אותו קובץ. מופע עם data-format שאין לו כלל
מתועד לקובץ הנוכחי מדווח כ"לא ניתן לאמת", לא נכשל ולא מאושר בטעות.

שימוש:
    python check_nii_values_sync.py <page>
"""

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify_render_parity as vrp  # noqa: E402  (משתמשים ב-BTL_DIR, resolve_relpath)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

NII_PATH = vrp.SENIOR_RIGHTS_DIR / "data" / "nii-constants.json"

# data-nii יכול להופיע עם או בלי data-format נלווה (הקבוצה השנייה אופציונלית)
SPAN_NII = re.compile(r'<span data-nii="([^"]+)"(?: data-format="([^"]+)")?>([^<]*)</span>')
SPAN_NII_KEY = re.compile(r'<span data-nii-key="([^"]+)" data-nii-format="([^"]+)">([^<]*)</span>')
SPAN_NII_CALC = re.compile(r'<span data-nii-calc="([^"]+)">([^<]*)</span>')
# data-nii-format אופציונלי - נתמך לקראת התבנית האחידה החדשה (ראו CLAUDE.md);
# אף קובץ קיים לא משתמש בזה עדיין, אבל בלי התמיכה הזו כלי זה היה מפספס
# בשקט כל עמוד עתידי שיאמץ את התבנית (בדיוק הבאג שכבר קרה עם data-nii).
SPAN_NII_DERIVED = re.compile(r'<span data-nii-derived="([^"]+)"(?: data-nii-format="([^"]+)")?>([^<]*)</span>')

# כללי עיצוב עבור data-nii עם data-format נלווה - מתועדים בנפרד לכל קובץ,
# כי אין מוסכמה כלל-אתרית (כל קובץ עשוי לממש עיצוב אחוזים/אחר שונה
# בקוד ה-JS שלו). כל כלל כאן אומת ידנית מול הקוד בפועל של אותו קובץ -
# אסור להעתיק כלל מקובץ אחד ולהניח שהוא תקף גם באחר.
FILE_SPECIFIC_FORMAT_RULES = {
    "senior_rights/old_pension_income_test_full_guide.html": {
        # formatValue() בקובץ הזה: עבור 'percent' מחזיר את הערך הגולמי
        # בלי שום סימן % (סימן ה-% כתוב בטקסט הסטטי שמסביב לתג עצמו).
        "percent": lambda value: str(value),
    },
}

# נוסחאות עבור data-nii-calc/data-nii-derived - כל נוסחה הועתקה ואומתה
# ידנית מקוד ה-JS בפועל של אותו קובץ (applyNiiValues בקובץ זה, שורות
# ~1109-1148). מפתח = נתיב הקובץ, ערך = dict של calc-key -> פונקציה
# שמקבלת את מילון הקבועים המלא ומחזירה את המחרוזת המעוצבת הצפויה.
FILE_SPECIFIC_CALC_RULES = {
    "senior_rights/old_pension_income_test_full_guide.html": {
        # קצבה בסיסית ליחיד * (1 + אחוז תוספת ותק מקסימלי / 100), מעוגל
        "pension_single_with_seniority_max": lambda c: format_currency(
            round(c["pension_single_basic"]["value"] * (1 + c["seniority_bonus_max"]["value"] / 100))
        ),
        # 10% מהקצבה הבסיסית ליחיד, מעוגל
        "min_partial_rounded": lambda c: format_currency(
            round(c["pension_single_basic"]["value"] * 0.1)
        ),
        # תקרת עבודה ליחיד * 2
        "income_test_single_full_x2": lambda c: format_currency(
            c["income_test_single_full"]["value"] * 2
        ),
        # תקרת עבודה לנשוי * 2
        "income_test_married_full_x2": lambda c: format_currency(
            c["income_test_married_full"]["value"] * 2
        ),
    },
}

# אותו רעיון בדיוק, עבור data-nii-derived. הנוסחאות הועתקו ואומתו ידנית
# מקוד ה-JS בפועל (survivors_benefits_guide_2026.html, שורות ~1842-1854),
# כולל fmt() החיצוני שמעגל תמיד את התוצאה הסופית (Math.round) לפני עיצוב.
FILE_SPECIFIC_DERIVED_RULES = {
    "senior_rights/survivors_benefits_guide_2026.html": {
        "widow_with_1child": lambda c: format_currency(round(
            c["survivors_widow_over50"]["value"] + c["survivors_orphan"]["value"]
        )),
        "widow_with_2children": lambda c: format_currency(round(
            c["survivors_widow_over50"]["value"] + c["survivors_orphan"]["value"] * 2
        )),
        "widow_50pct": lambda c: format_currency(round(
            round(c["survivors_widow_over50"]["value"] * 0.5)
        )),
        "widow_over80_diff": lambda c: format_currency(round(
            c["survivors_widow_over80"]["value"] - c["survivors_widow_over50"]["value"]
        )),
        "example_seniority_40pct": lambda c: format_currency(round(
            round(c["survivors_widow_over50"]["value"] * 0.40)
        )),
        "example_total_20yr": lambda c: format_currency(round(
            c["survivors_widow_over50"]["value"] + round(c["survivors_widow_over50"]["value"] * 0.40)
        )),
        # 7200 הוא מספר-דוגמה קשיח בקוד המקור עצמו (תרחיש לדוגמה), לא מפתח מה-JSON
        "example_pension_after_deduction": lambda c: format_currency(round(
            7200 - c["survivors_income_allowed_employed"]["value"]
        )),
        "livelihood_2children_threshold": lambda c: format_currency(round(
            c["livelihood_income_threshold_orphan"]["value"] + c["livelihood_child_addition"]["value"]
        )),
    },
    # הנוסחאות הועתקו ואומתו ידנית מקוד ה-JS בפועל
    # (women_transition_benefit_guide.html, שורות ~1048-1053). 2000/7500
    # הם מספרי-דוגמה קשיחים בקוד המקור עצמו (תרחישי דוגמה), לא מפתחות מה-JSON.
    "senior_rights/women_transition_benefit_guide.html": {
        "example1_diff": lambda c: format_currency(round(
            c["transition_grant_income_allowed"]["value"] - 2000
        )),
        "example2_diff": lambda c: format_currency(round(
            c["transition_grant_income_allowed"]["value"] - 7500
        )),
    },
    # הנוסחה הועתקה ואומתה ידנית מקוד ה-JS בפועל (mekarim_meyuchadim.html,
    # מנוע ה-JS בסוף הקובץ). data-nii-format="percent" - הפונקציה מחזירה
    # ישירות את המחרוזת המעוצבת (כולל %), לא עובר format_currency.
    "additional_guides/html/mekarim_meyuchadim.html": {
        "spouse_ceiling_pct": lambda c: str(round(
            c["income_test_spouse_ceiling"]["value"] / c["average_wage"]["value"] * 100
        )) + "%",
    },
    # הנוסחאות הועתקו ואומתו ידנית מקוד ה-JS בפועל (nechut_mul_shairim.html,
    # מנוע ה-JS בסוף הקובץ). כולן data-nii-format="plain" (בלי ₪/%).
    "additional_guides/html/nechut_mul_shairim.html": {
        "combo_spouse": lambda c: format_currency(
            c["disability_full"]["value"] + c["disability_spouse"]["value"]
        ),
        "combo_child": lambda c: format_currency(
            c["disability_full"]["value"] + c["disability_child"]["value"]
        ),
        "widow_max_seniority": lambda c: format_currency(
            c["survivors_widow_over50"]["value"] * 1.5
        ),
    },
    # הנוסחאות הועתקו ואומתו ידנית מקוד ה-JS בפועל (takrut_hachnasa.html,
    # מנוע ה-JS בסוף הקובץ). כולן data-nii-format="plain". שים לב:
    # partial_floor_precise ו-partial_floor_rounded הם אותה נוסחה בסיסית
    # (10% מהקצבה הבסיסית ליחיד) בשתי רמות דיוק שונות - הקובץ מציג את הערך
    # המדויק (183.8) פעם אחת, ואת המעוגל (184) פעמיים, בהקשרים שונים בטקסט.
    "additional_guides/html/takrut_hachnasa.html": {
        "single_with_seniority": lambda c: format_currency(
            c["pension_single_basic"]["value"] * 1.5
        ),
        "partial_floor_precise": lambda c: format_currency(
            c["pension_single_basic"]["value"] * 0.10
        ),
        "partial_floor_rounded": lambda c: format_currency(
            round(c["pension_single_basic"]["value"] * 0.10)
        ),
    },
}


def format_currency(value) -> str:
    if isinstance(value, float) and value != int(value):
        return f"{value:,.2f}".rstrip("0").rstrip(".")
    return f"{int(value):,}"


def expected_data_nii(constants: dict, key: str, fmt, relpath: str):
    """מחזיר (ערך_צפוי, סיבה_אם_לא_ניתן_לאמת). ערך_צפוי=None אם לא ניתן לחשב."""
    entry = constants.get(key)
    if not entry:
        return None, "המפתח לא קיים ב-nii-constants.json"
    if fmt is None:
        key_type = entry.get("type", "currency")
        if key_type in ("currency", "euro"):
            return format_currency(entry["value"]), None
        return str(entry["value"]), None
    rule = FILE_SPECIFIC_FORMAT_RULES.get(relpath, {}).get(fmt)
    if rule is None:
        return None, (
            f"יש data-format='{fmt}' בלי כלל עיצוב מתועד עבור הקובץ הזה "
            "ב-FILE_SPECIFIC_FORMAT_RULES - יש לקרוא את קוד ה-JS ולתעד קודם"
        )
    return rule(entry["value"]), None


def expected_data_nii_key(constants: dict, key: str, fmt: str):
    """currency -> '#,###' + ' ₪' (תואם את renderPage() ב-imputed_income_guide.html),
    percent -> '#%', plain -> '#,###' בלי סימן נלווה (תואם את מנוע ה-JS
    ב-BTL/additional_guides - raw.toLocaleString('he-IL'), פסיקי אלפים בלי ₪/%)."""
    entry = constants.get(key)
    if not entry:
        return None
    value = entry["value"]
    if fmt == "currency":
        return f"{format_currency(value)} ₪"
    if fmt == "percent":
        return f"{value}%"
    return format_currency(value)


def expected_calc(rules_table: dict, constants: dict, key: str, relpath: str, attr_label: str):
    """מחפש נוסחה מתועדת עבור data-nii-calc/data-nii-derived. מחזיר (ערך_צפוי, סיבה)."""
    rule = rules_table.get(relpath, {}).get(key)
    if rule is None:
        return None, f"ערך מחושב, אין נוסחה מתועדת עבור {key} בקובץ הזה ב-{attr_label} - לא נבדק"
    try:
        return rule(constants), None
    except KeyError as e:
        return None, f"נוסחה מתועדת אך מפתח חסר ב-nii-constants.json: {e}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("page", help="נתיב יחסי מ-BTL, לדוגמה senior_rights/imputed_income_guide.html")
    args = parser.parse_args()

    relpath = vrp.resolve_relpath(args.page)
    page_path = vrp.BTL_DIR / relpath
    if not page_path.exists():
        print(f"שגיאה: הקובץ {page_path} לא קיים.")
        sys.exit(2)
    if not NII_PATH.exists():
        print(f"שגיאה: לא נמצא {NII_PATH}.")
        sys.exit(2)

    constants = json.loads(NII_PATH.read_text(encoding="utf-8"))
    text = page_path.read_text(encoding="utf-8")

    mismatches = []
    unverifiable = []
    checked = 0

    for m in SPAN_NII.finditer(text):
        key, fmt, actual = m.group(1), m.group(2), m.group(3)
        expected, reason = expected_data_nii(constants, key, fmt, relpath)
        checked += 1
        if expected is None:
            label = f"{key} (data-format={fmt})" if fmt else key
            unverifiable.append(f"[data-nii] {label}: {reason}")
        elif expected != actual:
            mismatches.append(f"[data-nii] {key}: בקובץ='{actual}' צפוי='{expected}'")

    for m in SPAN_NII_KEY.finditer(text):
        key, fmt, actual = m.group(1), m.group(2), m.group(3)
        expected = expected_data_nii_key(constants, key, fmt)
        checked += 1
        if expected is None:
            unverifiable.append(f"[data-nii-key] {key}: המפתח לא קיים ב-nii-constants.json")
        elif expected != actual:
            mismatches.append(f"[data-nii-key] {key} ({fmt}): בקובץ='{actual}' צפוי='{expected}'")

    for m in SPAN_NII_CALC.finditer(text):
        key, actual = m.group(1), m.group(2)
        expected, reason = expected_calc(FILE_SPECIFIC_CALC_RULES, constants, key, relpath, "FILE_SPECIFIC_CALC_RULES")
        checked += 1
        if expected is None:
            unverifiable.append(f"[data-nii-calc] {key}: {reason}")
        elif expected != actual:
            mismatches.append(f"[data-nii-calc] {key}: בקובץ='{actual}' צפוי='{expected}'")

    for m in SPAN_NII_DERIVED.finditer(text):
        # הקבוצה השנייה (data-nii-format) לא משמשת כאן לחישוב - הנוסחה
        # המלאה (כולל עיצוב) מגיעה תמיד מ-FILE_SPECIFIC_DERIVED_RULES.
        # היא נלכדת רק כדי שהביטוי הרגולרי לא יפספס בשקט תגים עתידיים
        # שיכללו אותה (התבנית האחידה החדשה).
        key, _fmt, actual = m.group(1), m.group(2), m.group(3)
        expected, reason = expected_calc(FILE_SPECIFIC_DERIVED_RULES, constants, key, relpath, "FILE_SPECIFIC_DERIVED_RULES")
        checked += 1
        if expected is None:
            unverifiable.append(f"[data-nii-derived] {key}: {reason}")
        elif expected != actual:
            mismatches.append(f"[data-nii-derived] {key}: בקובץ='{actual}' צפוי='{expected}'")

    print(f"נבדקו {checked} מופעים ב-{relpath}\n")

    if checked == 0:
        print(
            "ℹ️ לא נמצא בקובץ הזה אף תג data-nii/data-nii-key/data-nii-calc/data-nii-derived — "
            "כנראה שהוא לא מהעמודים שהכלי הזה מיועד לבדוק (למשל עמוד מבוסס תיבת #content, לא ערכים חיים מוטבעים)."
        )
    elif mismatches:
        print(f"❌ נמצאו {len(mismatches)} אי-התאמות:")
        for msg in mismatches:
            print(f"  - {msg}")
    else:
        print("✅ כל הערכים שניתן היה לאמת תואמים ל-nii-constants.json")

    if unverifiable:
        print(f"\n⚠️ {len(unverifiable)} מופעים לא נבדקו (ראו פירוט):")
        for msg in unverifiable:
            print(f"  - {msg}")

    sys.exit(1 if mismatches else 0)


if __name__ == "__main__":
    main()
