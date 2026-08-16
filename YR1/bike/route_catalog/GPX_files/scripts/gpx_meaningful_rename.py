#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gpx_meaningful_rename.py
==========================
מבנה תיקיות (כמו שקבענו):
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\                <- קבצי GPX
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\scripts\\               <- כאן יושב הסקריפט
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\scripts\\support_data\\         <- כאן שמים את קובץ מאגר היישובים (CSV)

מה הסקריפט עושה:
  1. עובר על כל קבצי ה-GPX ברמה העליונה של GPX_files (לא נכנס ל-scripts/data/כפילויות).
  2. לכל קובץ בודק אם לשם שלו יש "מילה ברורה" (עברית או אנגלית) - כלומר מילה אמיתית
     שאינה תאריך/מספר/מילת-רעש גנרית (כמו track, new, קובץ, עותק וכו').
     אם יש כזו מילה - הקובץ לא נוגע בו.
  3. אם אין מילה כזו (שם שנראה כמו קוד/timestamp אוטומטי) - הסקריפט:
     א. מוצא תאריך: קודם מנסה לחלץ מתוך שם הקובץ, ואם אין - מתוך ה-timestamps
        בתוך קובץ ה-GPX עצמו, ואם גם זה לא קיים - נופל לתאריך השינוי של הקובץ.
     ב. דוגם נקודות לאורך המסלול ומוצא את היישובים (מתוך מאגר היישובים ב-data/)
        שנמצאים במרחק עד RADIUS_KM ק"מ מהמסלול (ברירת מחדל 1, ניתן לשינוי),
        עם הרחבת רדיוס הדרגתית אם לא נמצא כלום (למשל טיולים בחו"ל).
     ג. בונה שם קובץ חדש: <תאריך>_<יישוב1>_<יישוב2>[_<יישוב3>].gpx

  קבצים שלא נמצא להם אף יישוב (סביר שמדובר בטיול בחו"ל - המאגר מכסה רק ישראל)
  לא משתנים, ומסומנים בלוג לבדיקה ידנית.

מאגר היישובים - פורמט קובץ ה-CSV:
  הסקריפט מזהה אוטומטית עמודת שם + עמודות קואורדינטות (lat/lon או ITM X/Y),
  וממיר ITM ל-WGS84 אם צריך (דורש pip install pyproj במקרה הזה).
  אם הזיהוי האוטומטי נכשל, ההרצה תעצור עם הודעה שמפרטת אילו עמודות נמצאו,
  כדי שתוכל לעדכן את הקוד או לשלוח לי את שמות העמודות.

הרצה (מתוך תיקיית scripts):
    python gpx_meaningful_rename.py --dry-run     # מומלץ להתחיל כך - רק מציג, לא משנה שמות
    python gpx_meaningful_rename.py                # מבצע בפועל
    python gpx_meaningful_rename.py --radius 8      # רדיוס התחלתי בק"מ (ברירת מחדל 1)
"""

import os
import re
import csv
import math
import argparse
from pathlib import Path
from datetime import datetime
from collections import Counter
import xml.etree.ElementTree as ET

DEFAULT_RADIUS_KM = 1.0
MAX_RADIUS_KM = 40.0          # תקרה להרחבת רדיוס הדרגתית
RADIUS_STEP_MULTIPLIER = 2.0
MAX_SETTLEMENTS_IN_NAME = 3
MIN_SETTLEMENTS_IN_NAME = 2
SAMPLE_POINTS_COUNT = 40       # כמה נקודות דוגמים לאורך כל מסלול

SETTLEMENTS_CSV_FILENAME = "city.csv"
NAME_COL_CANDIDATES = ["mglsde_loc", "שם_ישוב", "שם ישוב", "שם", "name", "city_name", "settlement_name", "city", "locality"]
LAT_COL_CANDIDATES = ["lat", "latitude", "y_wgs", "y_wgs84", "קו רוחב"]
LON_COL_CANDIDATES = ["lon", "lng", "longitude", "x_wgs", "x_wgs84", "קו אורך"]
ITM_X_COL_CANDIDATES = ["x", "x_itm", "east", "easting"]
ITM_Y_COL_CANDIDATES = ["y", "y_itm", "north", "northing"]

NOISE_WORDS_EN = {
    "track", "gpx", "new", "folder", "copy", "file", "files", "export", "untitled",
    "document", "doc", "img", "image", "waypoints", "waypoint", "points", "point",
    "data", "log", "recording", "gps", "txt", "route", "routes", "trk", "rte",
    "activity", "session", "device", "backup", "hk",
}
NOISE_WORDS_HE = {
    "קובץ", "חדש", "עותק", "ללא", "שם", "מסלול", "הקלטה", "נתונים", "גיבוי", "נקודות",
    "נקודה", "טיול", "מסע",
}


def get_script_dir() -> Path:
    return Path(__file__).resolve().parent


def get_gpx_dir() -> Path:
    return get_script_dir().parent


def get_data_dir() -> Path:
    return get_script_dir() / "support_data"


def list_gpx_files_top_level(folder: Path):
    return sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() == ".gpx")


# ---------- זיהוי אם לשם קובץ יש כבר מילה משמעותית ----------

def has_meaningful_word(stem: str) -> bool:
    tokens = re.findall(r"[A-Za-z]+|[\u0590-\u05FF]+", stem)
    for tok in tokens:
        if len(tok) < 2:
            continue
        if tok.isascii():
            if tok.lower() in NOISE_WORDS_EN:
                continue
        else:
            if tok in NOISE_WORDS_HE:
                continue
        return True
    return False


# ---------- חילוץ תאריך משם קובץ ----------

DATE_PATTERNS = [
    re.compile(r"(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})"),   # YYYY-MM-DD / YYYYMMDD
    re.compile(r"(\d{2})[-_.](\d{2})[-_.](20\d{2})"),      # DD-MM-YYYY
]


def extract_date_from_filename(stem: str):
    for pat in DATE_PATTERNS:
        m = pat.search(stem)
        if not m:
            continue
        g = m.groups()
        try:
            if len(g[0]) == 4:
                y, mo, d = int(g[0]), int(g[1]), int(g[2])
            else:
                d, mo, y = int(g[0]), int(g[1]), int(g[2])
            return datetime(y, mo, d).date()
        except ValueError:
            continue
    return None


def parse_gpx_time(text):
    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None


# ---------- קריאת קבצי GPX ----------

def get_namespace(root_tag: str) -> str:
    if root_tag.startswith("{"):
        return root_tag[1:root_tag.index("}")]
    return ""


def extract_points_and_times(path: Path):
    """מחזיר (list[(lat,lon)], list[datetime|None])."""
    try:
        tree = ET.parse(path)
    except ET.ParseError:
        return [], []
    root = tree.getroot()
    ns_uri = get_namespace(root.tag)

    def findall(tag_path):
        return root.findall(tag_path.replace("g:", "{" + ns_uri + "}") if ns_uri else tag_path.replace("g:", ""))

    points_el = findall(".//g:trk//g:trkpt") or findall(".//g:rte//g:rtept") or findall(".//g:wpt")

    coords, times = [], []
    for pt in points_el:
        try:
            lat = float(pt.attrib["lat"])
            lon = float(pt.attrib["lon"])
        except (KeyError, ValueError):
            continue
        coords.append((lat, lon))
        time_el = pt.find("g:time" if ns_uri else "time", {"g": ns_uri} if ns_uri else {})
        times.append(parse_gpx_time(time_el.text) if time_el is not None else None)
    return coords, times


def sample_points(coords, n=SAMPLE_POINTS_COUNT):
    if len(coords) <= n:
        return coords
    step = len(coords) / n
    return [coords[int(i * step)] for i in range(n)]


# ---------- מאגר יישובים ----------

def find_header_col(header, candidates):
    header_lower = [h.strip().lower() for h in header]
    for cand in candidates:
        cand_l = cand.strip().lower()
        for i, h in enumerate(header_lower):
            if h == cand_l:
                return header[i]
    for cand in candidates:
        cand_l = cand.strip().lower()
        for i, h in enumerate(header_lower):
            if cand_l in h:
                return header[i]
    return None


def load_settlements(data_dir: Path):
    csv_path = data_dir / SETTLEMENTS_CSV_FILENAME
    if not csv_path.exists():
        raise SystemExit(
            f"לא נמצא הקובץ {SETTLEMENTS_CSV_FILENAME} בתיקייה {data_dir}.\n"
            f"שים שם את קובץ מאגר היישובים בשם המדויק הזה."
        )
    print(f"טוען מאגר יישובים מתוך: {csv_path.name}")

    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        header = reader.fieldnames
        name_col = find_header_col(header, NAME_COL_CANDIDATES)
        lat_col = find_header_col(header, LAT_COL_CANDIDATES)
        lon_col = find_header_col(header, LON_COL_CANDIDATES)
        x_col = find_header_col(header, ITM_X_COL_CANDIDATES)
        y_col = find_header_col(header, ITM_Y_COL_CANDIDATES)

        if not name_col:
            raise SystemExit(f"לא זוהתה עמודת שם יישוב. עמודות שנמצאו בקובץ: {header}")

        use_wgs = lat_col and lon_col
        use_itm = (not use_wgs) and x_col and y_col
        if not use_wgs and not use_itm:
            raise SystemExit(
                f"לא זוהו עמודות קואורדינטות (lat/lon או X/Y). עמודות שנמצאו בקובץ: {header}"
            )

        rows = list(reader)

    settlements = []  # (name, lat, lon)

    if use_wgs:
        print(f"  זוהו עמודות WGS84: {name_col} / {lat_col} / {lon_col}")
        for row in rows:
            try:
                name = row[name_col].strip()
                lat = float(row[lat_col])
                lon = float(row[lon_col])
                if name and -90 <= lat <= 90 and -180 <= lon <= 180:
                    settlements.append((name, lat, lon))
            except (ValueError, KeyError, TypeError):
                continue
    else:
        print(f"  זוהו עמודות X/Y: {name_col} / {x_col} / {y_col}")
        # דוגמים כמה שורות כדי לזהות את היטל הקואורדינטות לפי סדר הגודל של הערכים
        sample_vals = []
        for row in rows[:20]:
            try:
                sample_vals.append((float(row[x_col]), float(row[y_col])))
            except (ValueError, KeyError, TypeError):
                continue
        if not sample_vals:
            raise SystemExit(f"לא הצלחתי לקרוא ערכים מספריים מעמודות {x_col}/{y_col}.")

        avg_x = sum(v[0] for v in sample_vals) / len(sample_vals)
        avg_y = sum(v[1] for v in sample_vals) / len(sample_vals)

        if 100_000 <= abs(avg_x) <= 300_000 and 350_000 <= abs(avg_y) <= 800_000:
            src_crs = "EPSG:2039"  # ITM - רשת ישראל
            print("  זוהה היטל: ITM (רשת ישראל, EPSG:2039)")
        elif abs(avg_x) > 1_000_000 and abs(avg_y) > 1_000_000:
            src_crs = "EPSG:3857"  # Web Mercator
            print("  זוהה היטל: Web Mercator (EPSG:3857)")
        else:
            raise SystemExit(
                f"לא הצלחתי לזהות את היטל הקואורדינטות של עמודות {x_col}/{y_col} "
                f"(ערכים לדוגמה: X={avg_x:.1f}, Y={avg_y:.1f}). שלח לי כמה שורות לדוגמה מהקובץ."
            )

        try:
            from pyproj import Transformer
        except ImportError:
            raise SystemExit(
                f"הקואורדינטות במאגר הן {src_crs} ולא WGS84.\n"
                "כדי להמיר, צריך להתקין: pip install pyproj\nולהריץ שוב."
            )
        transformer = Transformer.from_crs(src_crs, "EPSG:4326", always_xy=True)
        for row in rows:
            try:
                name = row[name_col].strip()
                x = float(row[x_col])
                y = float(row[y_col])
                lon, lat = transformer.transform(x, y)
                if name and -90 <= lat <= 90 and -180 <= lon <= 180:
                    settlements.append((name, lat, lon))
            except (ValueError, KeyError, TypeError):
                continue

    if not settlements:
        raise SystemExit("לא נטענו יישובים תקינים מהקובץ - בדוק את הפורמט.")

    print(f"  נטענו {len(settlements)} יישובים.\n")
    return settlements


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def find_nearby_settlements(sample_coords, settlements, radius_km):
    """מחזיר רשימת שמות יישובים ייחודיים במרחק עד radius_km מאיזושהי נקודה נדגמת,
    ממוינים לפי המרחק המינימלי שלהם למסלול (הקרוב ביותר קודם)."""
    best_dist = {}  # name -> מרחק מינימלי
    deg_margin = radius_km / 111.0 * 1.5  # מסנן גס לפני חישוב מדויק

    for lat, lon in sample_coords:
        for name, s_lat, s_lon in settlements:
            if abs(s_lat - lat) > deg_margin or abs(s_lon - lon) > deg_margin:
                continue
            d = haversine_km(lat, lon, s_lat, s_lon)
            if d <= radius_km:
                if name not in best_dist or d < best_dist[name]:
                    best_dist[name] = d

    return sorted(best_dist.items(), key=lambda kv: kv[1])  # [(name, dist), ...]


def sanitize_for_filename(text: str) -> str:
    text = re.sub(r'[\\/:*?"<>|]', "", text)
    return re.sub(r"\s+", " ", text).strip()


def unique_path(folder: Path, filename: str) -> Path:
    candidate = folder / filename
    if not candidate.exists():
        return candidate
    stem, suffix = os.path.splitext(filename)
    counter = 1
    while True:
        candidate = folder / f"{stem}_{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def main():
    parser = argparse.ArgumentParser(description="משנה שמות קבצי GPX חסרי-שם-משמעותי לפי תאריך + יישובים קרובים")
    parser.add_argument("--dry-run", action="store_true", help="מציג מה ישתנה בלי לבצע שינויים בפועל")
    parser.add_argument("--radius", type=float, default=DEFAULT_RADIUS_KM, help="רדיוס התחלתי בק\"מ (ברירת מחדל 1)")
    args = parser.parse_args()

    gpx_dir = get_gpx_dir()
    data_dir = get_data_dir()

    settlements = load_settlements(data_dir)
    files = list_gpx_files_top_level(gpx_dir)

    if not files:
        print("לא נמצאו קבצי GPX.")
        return

    print(f"נמצאו {len(files)} קבצי GPX ב-{gpx_dir}\n")

    log_rows = []
    renamed_count = 0
    skipped_meaningful = 0
    skipped_no_settlement = 0

    for path in files:
        stem = path.stem

        if has_meaningful_word(stem):
            skipped_meaningful += 1
            log_rows.append([path.name, "", "לא שונה - כבר יש שם משמעותי", ""])
            continue

        coords, times = extract_points_and_times(path)
        if not coords:
            log_rows.append([path.name, "", "לא שונה - לא נמצאו נקודות בקובץ", ""])
            continue

        # --- תאריך ---
        date_obj = extract_date_from_filename(stem)
        date_source = "שם קובץ"
        if not date_obj:
            valid_times = [t for t in times if t is not None]
            if valid_times:
                date_obj = min(valid_times).date()
                date_source = "timestamps בקובץ"
        if not date_obj:
            date_obj = datetime.fromtimestamp(path.stat().st_mtime).date()
            date_source = "תאריך שינוי הקובץ (גיבוי)"

        # --- יישובים קרובים, עם הרחבת רדיוס הדרגתית ---
        samples = sample_points(coords)
        radius = args.radius
        matches = find_nearby_settlements(samples, settlements, radius)
        while len(matches) < MIN_SETTLEMENTS_IN_NAME and radius < MAX_RADIUS_KM:
            radius *= RADIUS_STEP_MULTIPLIER
            matches = find_nearby_settlements(samples, settlements, radius)

        if not matches:
            skipped_no_settlement += 1
            log_rows.append([path.name, "", "לא שונה - לא נמצא יישוב קרוב (כנראה טיול בחו\"ל)", ""])
            continue

        chosen = [name for name, _ in matches[:MAX_SETTLEMENTS_IN_NAME]]
        settlements_part = "_".join(sanitize_for_filename(n) for n in chosen)
        new_name = f"{date_obj.isoformat()}_{settlements_part}{path.suffix}"
        new_path = unique_path(path.parent, new_name)

        note = f"תאריך מ: {date_source}; רדיוס בפועל: {radius:.1f} ק\"מ"
        log_rows.append([path.name, new_path.name, "שונה", note])
        renamed_count += 1

        if args.dry_run:
            print(f"  [RENAME] {path.name}  ->  {new_path.name}   ({note})")
        else:
            path.rename(new_path)
            print(f"  [OK] {path.name}  ->  {new_path.name}")

    data_dir.mkdir(parents=True, exist_ok=True)
    log_path = data_dir / "gpx_rename_log.csv"
    with open(log_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["שם מקורי", "שם חדש", "סטטוס", "הערה"])
        writer.writerows(log_rows)

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}סיכום:")
    print(f"  שונו: {renamed_count}")
    print(f"  דולגו (כבר שם משמעותי): {skipped_meaningful}")
    print(f"  דולגו (לא נמצא יישוב קרוב): {skipped_no_settlement}")
    print(f"\nלוג מלא נשמר ב: {log_path}")


if __name__ == "__main__":
    main()
