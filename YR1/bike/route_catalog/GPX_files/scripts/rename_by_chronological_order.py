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
import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import gpx_analyzer as analyzer          # noqa: E402
import build_routes_catalog as builder   # noqa: E402
import gpx_meaningful_rename as renamer  # noqa: E402

REPORT_PATH = Path(__file__).resolve().parent / "support_data" / "chronological_rename_report.csv"
LONG_ROUTE_KM = 40.0

# מרחק סף לזיהוי "אותה נקודה ממש" מול נקודות מאומתות - נבחר קטן במכוון (300 מ')
# כי המטרה היא לתפוס רק חזרה על אותה נקודת התחלה/סיום ממש (כמו חניית האופניים
# הקבועה ליד הבית), לא כל נקודה באזור כללי. ראו load_known_points() למטה.
KNOWN_POINT_THRESHOLD_KM = 0.3


def load_known_points(gpx_dir: Path, support_data_dir: Path, catalog_data_dir: Path):
    """נקודות התחלה/סיום שכבר אומתו בפועל מול Google Maps ע"י המשתמש (נוסף
    20.08.2026, ראו verified_start_settlements.csv) - לצד הקואורדינטות **הנוכחיות
    בפועל** של אותם מסלולים (לא הקואורדינטות שנשמרו ב-CSV, שנוצר לצורך תיקון שם
    בלבד). המטרה: לפני שקוראים לחיפוש-יישוב-קרוב הגנרי (מרחק גיאומטרי גולמי
    מול city.csv), לבדוק אם הנקודה כבר מוכרת-בוודאות מנקודת מבט אנושית - כי
    התגלה בפועל (מסלול חדש 2026-08-20) שהמרחק הגיאומטרי הגולמי הכי קרוב לא
    תמיד תואם את השם שמשתמשים אמיתיים מתכוונים אליו לאותה נקודה ממש (למשל
    געתון מול שבי ציון/כברי/יחיעם - כל הדוגמאות שתועדו כבר בפרויקט הזה)."""
    verified_path = support_data_dir / "verified_start_settlements.csv"
    catalog_path = catalog_data_dir / "routes-catalog.json"
    if not verified_path.exists() or not catalog_path.exists():
        return []

    with open(verified_path, encoding="utf-8-sig", newline="") as f:
        verified = {int(row["route"]): (row["start"], row["end"]) for row in csv.DictReader(f)}

    with open(catalog_path, encoding="utf-8") as f:
        catalog = json.load(f)
    routes = catalog["routes"] if isinstance(catalog, dict) else catalog
    id_to_file = {r["id"]: r["file_name"] for r in routes}

    points = []
    for route_id, (start_name, end_name) in verified.items():
        file_name = id_to_file.get(route_id)
        if not file_name:
            continue
        path = gpx_dir / file_name
        if not path.exists():
            continue
        try:
            raw_points = builder.extract_track_points(path)
            cleaned, _ = builder.clean_track_points(raw_points)
        except Exception:  # noqa: BLE001
            continue
        if len(cleaned) < 2:
            continue
        points.append((cleaned[0]["lat"], cleaned[0]["lon"], start_name))
        points.append((cleaned[-1]["lat"], cleaned[-1]["lon"], end_name))
    return points


def resolve_name(lat, lon, settlements_db, known_points):
    """כמו nearest_settlement(), אבל בודק קודם נגד known_points (ראו
    load_known_points) - אם יש התאמה בטווח KNOWN_POINT_THRESHOLD_KM, מחזיר את
    השם המאומת גם אם הוא לא היישוב הגיאומטרי הכי קרוב לפי city.csv."""
    if known_points:
        best_name, best_d = None, None
        for k_lat, k_lon, k_name in known_points:
            d = renamer.haversine_km(lat, lon, k_lat, k_lon)
            if best_d is None or d < best_d:
                best_name, best_d = k_name, d
        if best_d is not None and best_d <= KNOWN_POINT_THRESHOLD_KM:
            return best_name
    name, _ = nearest_settlement(lat, lon, settlements_db)
    return name


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


def build_new_name(path: Path, settlements_db, date_str: str, known_points=None):
    known_points = known_points or []
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

    start_name = resolve_name(start_lat, start_lon, settlements_db, known_points)
    far_name = resolve_name(*coords[far_idx], settlements_db, known_points)
    end_name = resolve_name(end_lat, end_lon, settlements_db, known_points)

    is_loop = start_name == end_name

    if is_loop:
        # מחפשים אחורה מהסוף את הישוב המשמעותי האחרון שהוא שונה מהתחלה/סיום.
        # דגימה במרווחים (לא כל נקודה) - קובץ לולאה עם אלפי נקודות "תקועות"
        # ליד הבית לפני שהמסלול מתרחק שוב היה עולה יקר מדי בלי זה (עד
        # len(points) * 1174 השוואות למסלול בודד).
        back_step = max(1, len(coords) // 2000)
        last_diff_name = None
        for i in range(len(coords) - 1, -1, -back_step):
            name = resolve_name(*coords[i], settlements_db, known_points)
            if name != start_name:
                last_diff_name = name
                break
        final_end_name = last_diff_name if last_diff_name else end_name
    else:
        final_end_name = end_name

    names = [start_name]

    if total_km > LONG_ROUTE_KM:
        mid1_idx = index_at_fraction(cum, 0, far_idx)
        mid1_name = resolve_name(*coords[mid1_idx], settlements_db, known_points)
        if mid1_name not in (start_name, far_name):
            names.append(mid1_name)

    names.append(far_name)

    if total_km > LONG_ROUTE_KM:
        mid2_idx = index_at_fraction(cum, far_idx, len(coords) - 1)
        mid2_name = resolve_name(*coords[mid2_idx], settlements_db, known_points)
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


def auto_rename_unnamed_files(gpx_dir: Path, settlements_db, known_points):
    """מפעיל את אותו אלגוריתם כרונולוגי (start/furthest/end + זיהוי מעגלי) על כל
    קובץ שעדיין אין לו שם משמעותי - מחליף את ההסתמכות הישנה על
    gpx_meaningful_rename.py.main() (שהניב בפועל שם שגוי, 'שבי ציון' לנקודת
    התחלה שהיא בפועל געתון, כי הוא רק אוסף 'ישובים קרובים' גנרי לאורך המסלול
    בלי שום מושג של סדר-הגעה/מסלול-מעגלי, ובלי הישענות על היישובים המאומתים
    ב-verified_start_settlements.csv). מחזיר רשימת (שם ישן, שם חדש) שבאמת שונו."""
    renamed = []
    for path in analyzer.list_gpx_files_top_level(gpx_dir):
        if renamer.has_meaningful_word(path.stem):
            continue
        _, times = renamer.extract_points_and_times(path)
        date_obj = renamer.extract_date_from_filename(path.stem)
        if not date_obj:
            valid_times = [t for t in times if t is not None]
            if valid_times:
                date_obj = min(valid_times).date()
        if not date_obj:
            date_obj = datetime.fromtimestamp(path.stat().st_mtime).date()
        date_str = date_obj.isoformat()
        try:
            result = build_new_name(path, settlements_db, date_str, known_points)
        except Exception:  # noqa: BLE001
            continue
        if result is None:
            continue
        new_name = result[0]
        if new_name == path.name:
            continue
        new_path = renamer.unique_path(gpx_dir, new_name)
        path.rename(new_path)
        renamed.append((path.name, new_path.name))
    return renamed


def main():
    parser = argparse.ArgumentParser(description="שינוי שם קבצי GPX לפי סדר הגעה כרונולוגי ליישובים")
    parser.add_argument("--apply", action="store_true", help="לבצע בפועל את שינויי השם (ברירת מחדל: דריי-ראן בלבד)")
    args = parser.parse_args()

    gpx_dir = analyzer.get_gpx_dir()
    support_data_dir = builder.get_support_data_dir()
    settlements_db = renamer.load_settlements(support_data_dir)
    known_points = load_known_points(gpx_dir, support_data_dir, builder.get_catalog_data_dir())

    files = analyzer.list_gpx_files_top_level(gpx_dir)
    print(f"נמצאו {len(files)} קבצי GPX. מנתח סדר כרונולוגי... ({len(known_points)} נקודות מאומתות ידועות)\n")

    rows = []
    changed = 0
    errors = 0
    for i, path in enumerate(files, 1):
        if i % 100 == 0:
            print(f"  [{i}/{len(files)}] עובדו...")
        date_obj = renamer.extract_date_from_filename(path.stem)
        date_str = date_obj.isoformat() if date_obj else "0000-00-00"
        try:
            result = build_new_name(path, settlements_db, date_str, known_points)
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
