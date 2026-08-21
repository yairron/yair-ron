#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
apply_verified_start_names.py
==============================
מעדכן את שם הקובץ של כל מסלול כך שהשם הראשון (רכיב ראשון אחרי תאריך, מופרד
ב-"_") יהיה שם היישוב **המאומת** (מ-Google Maps, מאומת ידנית ע"י המשתמש) של
נקודת ההתחלה - במקום מה שאלגוריתם "הנקודה הקרובה ביותר" חישב באופן עצמאי
ב-rename_by_chronological_order.py. שאר רכיבי השם (נקודה אמצעית/רחוקה, סיום)
נשארים כפי שהם - זה תיקון ממוקד לרכיב הראשון בלבד, לא בנייה מחדש של כל השם.

קלט: verified_start_settlements.csv (route_id -> שם יישוב מאומת), נבנה
ידנית מתוך קבצי PDF שהמשתמש אימת מול Google Maps.

הרצה:
    python apply_verified_start_names.py              # דריי-ראן, מדפיס בלבד
    python apply_verified_start_names.py --apply       # מבצע בפועל
"""
import argparse
import csv
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import gpx_analyzer as analyzer          # noqa: E402
import build_routes_catalog as builder   # noqa: E402
import gpx_meaningful_rename as renamer  # noqa: E402

VERIFIED_CSV = Path(__file__).resolve().parent / "support_data" / "verified_start_settlements.csv"
REPORT_PATH = Path(__file__).resolve().parent / "support_data" / "verified_rename_report.csv"


def load_verified():
    with open(VERIFIED_CSV, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return {int(row["route"]): row["start"] for row in reader}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    gpx_dir = analyzer.get_gpx_dir()
    catalog_path = builder.get_catalog_data_dir() / "routes-catalog.json"
    with open(catalog_path, encoding="utf-8") as f:
        catalog = json.load(f)
    routes = catalog["routes"] if isinstance(catalog, dict) else catalog

    verified = load_verified()

    rows = []
    missing_from_verified = []
    for r in routes:
        rid = r["id"]
        old_name = r["file_name"]
        if rid not in verified:
            missing_from_verified.append((rid, old_name))
            continue
        verified_start = renamer.sanitize_for_filename(verified[rid])

        stem = Path(old_name).stem
        suffix = Path(old_name).suffix
        parts = stem.split("_")
        # parts[0] = תאריך (YYYY-MM-DD או 0000-00-00), parts[1] = רכיב שם ראשון
        if len(parts) < 2:
            rows.append([old_name, "", False, "פחות מ-2 רכיבים בשם"])
            continue
        date_part = parts[0]
        current_first = parts[1]
        rest = parts[2:]

        if current_first == verified_start:
            rows.append([old_name, old_name, False, ""])
            continue

        new_parts = [date_part, verified_start] + rest
        new_stem = "_".join(new_parts)
        new_name = new_stem + suffix
        rows.append([old_name, new_name, True, ""])

    changed = sum(1 for r in rows if r[2])
    print(f"סה\"כ מסלולים: {len(routes)}")
    print(f"חסרים ממיפוי האימות: {len(missing_from_verified)}")
    for rid, name in missing_from_verified:
        print(f"  {rid}: {name}")
    print(f"ישתנו: {changed}")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["שם ישן", "שם חדש", "השתנה?", "הערה"])
        writer.writerows(rows)
    print(f"דוח מלא נשמר ב: {REPORT_PATH}")

    if args.apply:
        print("\n--apply הופעל: מבצע שינויי שם בפועל...")
        renamed = 0
        for old_name, new_name, is_changed, note in rows:
            if not is_changed:
                continue
            old_path = gpx_dir / old_name
            if not old_path.exists():
                print(f"  דילוג - קובץ לא קיים: {old_name}")
                continue
            new_path = renamer.unique_path(gpx_dir, new_name)
            old_path.rename(new_path)
            renamed += 1
        print(f"שונו שמות ל-{renamed} קבצים בפועל.")
    else:
        print("\nזה היה דריי-ראן בלבד - שום קובץ לא שונה. הרץ עם --apply כדי לבצע בפועל.")


if __name__ == "__main__":
    main()
