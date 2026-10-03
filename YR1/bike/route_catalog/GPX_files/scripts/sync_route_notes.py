#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_route_notes.py
====================
בונה מחדש את route_catalog/data/route-notes.json מתוך גיליון Google של הערות
המסלולים (נוסף 03.10.2026). הגיליון הוא מקור האמת היחיד להערות - הקובץ נדרס
במלואו בכל הרצה, כך שהערה שנמחקה מהגיליון נמחקת גם מהאתר.

הגיליון נשלף כ-CSV דרך כתובת הייצוא הציבורית (הגיליון משותף "כל מי שיש לו את
הקישור יכול לצפות") - בלי מפתחות/חשבון שירות.

מבנה הגיליון (העמודות מזוהות לפי שם הכותרת, לא לפי מיקום):
  תאריך                 - לתיעוד בלבד, הסקריפט מתעלם ממנה
  שם קובץ או מספר קובץ  - מספר מסלול (#725) או שם קובץ GPX (עם או בלי .gpx)
  הערה                  - טקסט חופשי
  מקומות                - מקומות עניין, מופרדים בפסיק או בנקודה

שם קובץ מתורגם למספר מסלול לפי routes-catalog.json - לכן יש להריץ אחרי
build_routes_catalog.py, כדי שמסלול חדש כבר יקבל מספר. שורה שלא נמצאה בקטלוג,
או מסלול שמופיע בשתי שורות, מדווחים כאזהרה (השורה שלא נמצאה מדולגת; בכפילות
השורה האחרונה גוברת).

כישלון בשליפת הגיליון (אין רשת וכו') לא נוגע בקובץ הקיים - יוצא בקוד 2, כדי
שה-pre-commit יוכל להזהיר בלי לחסום את ה-commit.

הרצה (מתוך תיקיית scripts):
    python sync_route_notes.py            # שליפה וכתיבה
    python sync_route_notes.py --check    # הצגת השינויים בלבד, בלי לכתוב
"""

import argparse
import csv
import io
import json
import sys
import urllib.request
from pathlib import Path

# אותו מזהה גם ב-NOTES_SHEET_URL בתוך catalog.html (קישור העריכה) - לעדכן בשניהם
SHEET_ID = "1zbwalOSD41pD131tzPATiq2xUdXIe1IYPecbddzQNPg"
SHEET_CSV_URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv"

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CATALOG_PATH = DATA_DIR / "routes-catalog.json"
NOTES_PATH = DATA_DIR / "route-notes.json"

# זיהוי עמודה לפי מילת מפתח בכותרת - עמיד לשינוי סדר עמודות ולניסוח קל של הכותרת
COLUMN_KEYWORDS = {"key": "שם קובץ", "text": "הערה", "places": "מקומות"}


def fetch_sheet_rows():
    req = urllib.request.Request(SHEET_CSV_URL, headers={"User-Agent": "sync_route_notes"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8-sig")
    if raw.lstrip().startswith("<"):
        # גיליון שאינו משותף לצפייה מחזיר דף התחברות HTML במקום CSV
        raise RuntimeError("התקבל HTML במקום CSV - האם הגיליון עדיין משותף לצפייה עם הקישור?")
    return list(csv.reader(io.StringIO(raw)))


def find_columns(header):
    cols = {}
    for name, keyword in COLUMN_KEYWORDS.items():
        matches = [i for i, h in enumerate(header) if keyword in h]
        if not matches:
            raise RuntimeError(f'לא נמצאה עמודה עם "{keyword}" בכותרת הגיליון: {header}')
        cols[name] = matches[0]
    return cols


def build_lookup(catalog):
    by_id = {r["id"] for r in catalog["routes"]}
    by_name = {}
    for r in catalog["routes"]:
        name = r["file_name"].strip().lower()
        by_name[name] = r["id"]
        stem = name[:-4] if name.endswith(".gpx") else name
        by_name.setdefault(stem, r["id"])
    return by_id, by_name


def resolve_route_id(key, by_id, by_name):
    key = key.strip().lstrip("#").strip()
    if key.isdigit():
        return int(key) if int(key) in by_id else None
    return by_name.get(key.lower())


def clean(value):
    return value.replace("\r\n", "\n").replace("\r", "\n").strip()


def build_notes(rows, catalog):
    header, data = rows[0], rows[1:]
    cols = find_columns(header)
    by_id, by_name = build_lookup(catalog)
    notes, warnings, seen = {}, [], {}

    for line_no, row in enumerate(data, start=2):
        row = row + [""] * (len(header) - len(row))
        key, text, places = (clean(row[cols["key"]]), clean(row[cols["text"]]), clean(row[cols["places"]]))
        if not key and not text and not places:
            continue  # שורה ריקה
        if not key:
            warnings.append(f"שורה {line_no}: אין שם קובץ/מספר מסלול - דולגה")
            continue
        route_id = resolve_route_id(key, by_id, by_name)
        if route_id is None:
            warnings.append(f'שורה {line_no}: "{key}" לא נמצא בקטלוג - דולגה '
                            f"(מסלול חדש? יש להריץ קודם את build_routes_catalog.py)")
            continue
        if not text and not places:
            continue
        if route_id in seen:
            warnings.append(f"שורה {line_no}: מסלול #{route_id} מופיע גם בשורה {seen[route_id]} - השורה האחרונה גוברת")
        seen[route_id] = line_no
        notes[str(route_id)] = {"text": text, "places": places}

    sorted_notes = {k: notes[k] for k in sorted(notes, key=int)}
    return sorted_notes, warnings


def main():
    parser = argparse.ArgumentParser(description="סנכרון route-notes.json מגיליון ההערות")
    parser.add_argument("--check", action="store_true", help="הצגת השינויים בלבד, בלי לכתוב")
    args = parser.parse_args()

    try:
        rows = fetch_sheet_rows()
    except Exception as e:
        print(f"sync_route_notes: שליפת הגיליון נכשלה ({e}) - route-notes.json לא שונה.")
        return 2
    if not rows:
        print("sync_route_notes: הגיליון ריק לגמרי (גם בלי כותרת) - route-notes.json לא שונה.")
        return 2

    with open(CATALOG_PATH, encoding="utf-8") as f:
        catalog = json.load(f)
    notes, warnings = build_notes(rows, catalog)

    old = {}
    if NOTES_PATH.exists():
        try:
            with open(NOTES_PATH, encoding="utf-8") as f:
                old = json.load(f)
        except ValueError:
            old = {}

    added = [k for k in notes if k not in old]
    removed = [k for k in old if k not in notes]
    changed = [k for k in notes if k in old and notes[k] != old[k]]

    for w in warnings:
        print("  ⚠ " + w)
    print(f"sync_route_notes: {len(notes)} הערות בגיליון | נוספו: {added or '-'} | "
          f"עודכנו: {changed or '-'} | נמחקו: {removed or '-'}")

    if not (added or removed or changed):
        print("sync_route_notes: אין שינוי - route-notes.json לא נכתב מחדש.")
        return 0
    if args.check:
        print("sync_route_notes: --check - לא נכתב דבר.")
        return 0

    with open(NOTES_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(notes, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"sync_route_notes: נכתב {NOTES_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
