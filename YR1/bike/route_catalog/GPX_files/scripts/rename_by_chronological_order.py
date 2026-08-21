#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rename_by_chronological_order.py
=================================
מציע/מבצע שינוי שם לקבצי GPX כך שסדר היישובים בשם הקובץ יתאים לסדר ההגעה
אליהם בפועל (לפי זמן, לא לפי ניחוש) - לא חלק מ-pipeline הבנייה הרגיל.

כללי הבנייה (סוכם עם המשתמש, 20.08.2026):
  - שם ראשון  = הישוב הקרוב ביותר לנקודת היציאה (הנקודה הראשונה בקובץ).
  - שם אחרון  = הישוב הקרוב ביותר לנקודת הסיום - חוץ ממסלול מעגלי (יציאה
    וסיום קרובים לאותו יישוב): אז השם האחרון הוא הישוב המשמעותי **האחרון
    השונה** שהמסלול עבר בו לפני החזרה, לא חזרה על שם ההתחלה.
  - שם אמצעי  = הישוב הקרוב ביותר לנקודה **הרחוקה ביותר** (קו אווירי מנקודת
    היציאה) שהמסלול מגיע אליה.
  - מעל 40 ק"מ: מותר להוסיף עוד שם יישוב אחד בין ההתחלה לנקודה הרחוקה,
    ועוד אחד בין הנקודה הרחוקה לסיום (עד 5 שמות בסה"כ) - הנקודה ה"אמצעית"
    לכל קטע נבחרת לפי אמצע המרחק המצטבר **לאורך המסלול** (לא קו אווירי).

**חשוב - קונפליקט עם מזהי המסלולים (route_ids.json, נוסף 18.08.2026):**
מזהה קבוע מוקצה **לפי שם קובץ בלבד** - שינוי שם בפועל = "קובץ חדש" מבחינת
המיפוי, ומקבל מזהה חדש (המזהה הישן לא עובר). שינוי שם המוני לכל/רוב הקבצים
יבטל את היציבות של רוב המזהים הקיימים. **לכן הסקריפט הזה תמיד רץ קודם במצב
דריי-ראן (ברירת מחדל) שרק מדפיס/שומר דוח הצעות - לא משנה שום קובץ בפועל**,
עד לאישור מפורש עם --apply.

הרצה:
    python rename_by_chronological_order.py              # דריי-ראן, מדפיס+שומר CSV
    python rename_by_chronological_order.py --apply       # מבצע בפועל את השינויים
"""
import argparse
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import gpx_analyzer as analyzer          # noqa: E402
import build_routes_catalog as builder   # noqa: E402
import gpx_meaningful_rename as renamer  # noqa: E402

REPORT_PATH = Path(__file__).resolve().parent / "support_data" / "chronological_rename_report.csv"
LONG_ROUTE_KM = 40.0


def haversine_m(lat1, lon1, lat2, lon2):
    return renamer.haversine_km(lat1, lon1, lat2, lon2) * 1000.0


def cumulative_distances_km(coords):
    cum = [0.0]
    for i in range(1, len(coords)):
        cum.append(cum[-1] + renamer.haversine_km(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1]))
    return cum


def nearest_settlement(lat, lon, settlements):
    best_name, best_d = None, None
    for name, s_lat, s_lon in settlements:
        d = renamer.haversine_km(lat, lon, s_lat, s_lon)
        if best_d is None or d < best_d:
            best_name, best_d = name, d
    return best_name, best_d


def index_at_fraction(cum, start_idx, end_idx):
    """אינדקס הנקודה הקרובה ביותר לאמצע המרחק המצטבר בין start_idx ל-end_idx
    (כולל אם end_idx < start_idx - כיוון הפוך, עדיין "אמצע" לפי המרחק)."""
    lo, hi = min(start_idx, end_idx), max(start_idx, end_idx)
    target = (cum[lo] + cum[hi]) / 2.0
    best_i, best_diff = lo, abs(cum[lo] - target)
    for i in range(lo, hi + 1):
        diff = abs(cum[i] - target)
        if diff < best_diff:
            best_i, best_diff = i, diff
    return best_i


def build_new_name(path: Path, settlements_db, date_str: str):
    points = builder.extract_track_points(path)
    cleaned, _ = builder.clean_track_points(points)
    if len(cleaned) < 2:
        return None
    coords = [(p["lat"], p["lon"]) for p in cleaned]
    cum = cumulative_distances_km(coords)
    total_km = cum[-1]

    start_lat, start_lon = coords[0]
    end_lat, end_lon = coords[-1]

    # נקודה רחוקה ביותר (קו אווירי) מההתחלה
    far_idx, far_dist = 0, -1.0
    for i, (lat, lon) in enumerate(coords):
        d = renamer.haversine_km(start_lat, start_lon, lat, lon)
        if d > far_dist:
            far_idx, far_dist = i, d

    start_name, _ = nearest_settlement(start_lat, start_lon, settlements_db)
    far_name, _ = nearest_settlement(*coords[far_idx], settlements_db)
    end_name, _ = nearest_settlement(end_lat, end_lon, settlements_db)

    is_loop = start_name == end_name

    if is_loop:
        # מחפשים אחורה מהסוף את הישוב המשמעותי האחרון שהוא שונה מהתחלה/סיום.
        # דגימה במרווחים (לא כל נקודה) - קובץ לולאה עם אלפי נקודות "תקועות"
        # ליד הבית לפני שהמסלול מתרחק שוב היה עולה יקר מדי בלי זה (עד
        # len(points) * 1174 השוואות למסלול בודד).
        back_step = max(1, len(coords) // 2000)
        last_diff_name = None
        for i in range(len(coords) - 1, -1, -back_step):
            name, _ = nearest_settlement(*coords[i], settlements_db)
            if name != start_name:
                last_diff_name = name
                break
        final_end_name = last_diff_name if last_diff_name else end_name
    else:
        final_end_name = end_name

    names = [start_name]

    if total_km > LONG_ROUTE_KM:
        mid1_idx = index_at_fraction(cum, 0, far_idx)
        mid1_name, _ = nearest_settlement(*coords[mid1_idx], settlements_db)
        if mid1_name not in (start_name, far_name):
            names.append(mid1_name)

    names.append(far_name)

    if total_km > LONG_ROUTE_KM:
        mid2_idx = index_at_fraction(cum, far_idx, len(coords) - 1)
        mid2_name, _ = nearest_settlement(*coords[mid2_idx], settlements_db)
        if mid2_name not in (far_name, final_end_name):
            names.append(mid2_name)

    if not is_loop or (names[-1] != final_end_name):
        names.append(final_end_name)

    # הסרת כפילויות עוקבות (יכול לקרות אם שני שלבים סמוכים נפלו על אותו יישוב)
    deduped = [names[0]]
    for n in names[1:]:
        if n != deduped[-1]:
            deduped.append(n)

    safe_names = [renamer.sanitize_for_filename(n) for n in deduped]
    new_stem = date_str + "_" + "_".join(safe_names)
    return new_stem + path.suffix, deduped, round(total_km, 1), is_loop


def main():
    parser = argparse.ArgumentParser(description="שינוי שם קבצי GPX לפי סדר הגעה כרונולוגי ליישובים")
    parser.add_argument("--apply", action="store_true", help="לבצע בפועל את שינויי השם (ברירת מחדל: דריי-ראן בלבד)")
    args = parser.parse_args()

    gpx_dir = analyzer.get_gpx_dir()
    support_data_dir = builder.get_support_data_dir()
    settlements_db = renamer.load_settlements(support_data_dir)

    files = analyzer.list_gpx_files_top_level(gpx_dir)
    print(f"נמצאו {len(files)} קבצי GPX. מנתח סדר כרונולוגי...\n")

    rows = []
    changed = 0
    errors = 0
    for i, path in enumerate(files, 1):
        if i % 100 == 0:
            print(f"  [{i}/{len(files)}] עובדו...")
        date_obj = renamer.extract_date_from_filename(path.stem)
        date_str = date_obj.isoformat() if date_obj else "0000-00-00"
        try:
            result = build_new_name(path, settlements_db, date_str)
        except Exception as e:  # noqa: BLE001
            errors += 1
            rows.append([path.name, "", "", "", f"שגיאה: {e}"])
            continue
        if result is None:
            rows.append([path.name, "", "", "", "פחות מ-2 נקודות"])
            continue
        new_name, names, total_km, is_loop = result
        is_changed = new_name != path.name
        if is_changed:
            changed += 1
        rows.append([path.name, new_name, is_changed, total_km, is_loop])

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["שם נוכחי", "שם מוצע", "השתנה?", "אורך (ק\"מ)", "מעגלי?"])
        writer.writerows(rows)

    print(f"\nהושלם. {changed}/{len(files)} קבצים ישתנו, {errors} שגיאות.")
    print(f"דוח מלא נשמר ב: {REPORT_PATH}")

    if args.apply:
        print("\n--apply הופעל: מבצע שינויי שם בפועל...")
        renamed = 0
        for row in rows:
            old_name, new_name, is_changed = row[0], row[1], row[2]
            if not is_changed or is_changed == "":
                continue
            old_path = gpx_dir / old_name
            new_path = renamer.unique_path(gpx_dir, new_name)
            old_path.rename(new_path)
            renamed += 1
        print(f"שונו שמות ל-{renamed} קבצים בפועל.")
    else:
        print("\nזה היה דריי-ראן בלבד - שום קובץ לא שונה. הרץ עם --apply כדי לבצע בפועל.")


if __name__ == "__main__":
    main()
