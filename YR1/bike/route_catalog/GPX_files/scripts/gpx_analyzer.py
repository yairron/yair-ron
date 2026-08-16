#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gpx_analyzer.py
================
מבנה התיקיות:
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\        <- קבצי ה-GPX עצמם
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\scripts\\        <- כאן יושב הסקריפט הזה, ומכאן מריצים
    G:\\My Drive\\רון - ניירת אישית\\חופשות-טיסות\\GPX_files\\scripts\\support_data\\  <- כאן נשמרים הדוחות/פלטים

הסקריפט קורא את קבצי ה-GPX מתיקיית ההורה (GPX_files), ולא מהתיקייה שבה
הוא יושב (scripts) - כי שם אין קבצי GPX, רק סקריפטים. בודק רק את הרמה
העליונה של GPX_files, לא יורד לתתי-תיקיות (כולל לא לתוך scripts או כפילויות).

מנסה, על בסיס היוריסטיקות, לזהות עבור כל קובץ:

  1. סוג פעילות:   הליכה רגלית  /  רכיבת אופניים  /  לא ברור
  2. סוג מקור:      הקלטה (track בפועל)  /  תכנון מסלול (route)  /  לא ברור

חשוב להבין: זה ניתוח היוריסטי (מבוסס מהירות ממוצעת, צפיפות נקודות, קיום
חותמות זמן, וסוג האלמנט ב-XML - trk מול rte), לא זיהוי ודאי. קבצים גבוליים
(למשל טיול הליכה תלול מאוד, או רכיבה איטית) עלולים להיות מסווגים לא נכון.
הסקריפט מציג את הנתונים הגולמיים שעליהם התבססה ההחלטה, כדי שתוכל לבדוק ידנית.

הרצה (מתוך תיקיית scripts):
    python gpx_analyzer.py
    (מייצר דוח CSV בשם gpx_analysis_report.csv בתוך תיקיית data)
"""

import math
import csv
import re
from pathlib import Path
from datetime import datetime
import xml.etree.ElementTree as ET

# --- הגדרות סף להיוריסטיקות ---
WALK_MAX_SPEED_KMH = 7.0       # מתחת לזה -> הליכה
CYCLE_MAX_SPEED_KMH = 45.0     # מעל WALK ועד כאן -> רכיבה (מעל זה - חריג/לא ברור)
RECORDING_MIN_TIME_RATIO = 0.8  # לפחות 80% מהנקודות עם timestamp -> הקלטה
PLANNED_MAX_TIME_RATIO = 0.1    # פחות מ-10% מהנקודות עם timestamp -> תכנון

# רמזים מתוך שם הקובץ (לא מכריע, רק תומך/מחזק את המסקנה)
WALK_KEYWORDS = ["הליכה", "טיול רגלי", "מסלול הליכה", "walk", "hik", "trek", "רגלי"]
CYCLE_KEYWORDS = ["רכיבה", "אופניים", "bike", "cycl", "mtb", "gravel"]
PLAN_KEYWORDS = ["תכנון", "plan", "route", "מסלול מתוכנן"]
RECORD_KEYWORDS = ["הקלטה", "track", "recorded", "log"]

# רמזי כלים ידועים מתוך attribute ה-creator ב-gpx
KNOWN_RECORDING_TOOLS = ["oruxmaps", "strava", "garmin", "suunto", "polar", "wahoo", "endomondo", "runkeeper"]
KNOWN_PLANNING_TOOLS = ["caltopo", "gpsvisualizer", "komoot", "outdooractive", "mymaps", "google earth", "basecamp"]


def get_script_dir() -> Path:
    return Path(__file__).resolve().parent


def get_gpx_dir() -> Path:
    """תיקיית ה-GPX היא ההורה של תיקיית scripts שבה יושב הסקריפט."""
    return get_script_dir().parent


def get_data_dir() -> Path:
    data_dir = get_script_dir() / "support_data"
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def list_gpx_files_top_level(folder: Path):
    return sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() == ".gpx")


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def parse_time(text):
    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None


def get_namespace(root_tag: str) -> str:
    # root_tag נראה כמו "{http://www.topografix.com/GPX/1/1}gpx"
    if root_tag.startswith("{"):
        return root_tag[1:root_tag.index("}")]
    return ""


def analyze_file(path: Path) -> dict:
    result = {
        "filename": path.name,
        "creator": "",
        "element_type": "",       # trk / rte / wpt-only / ריק
        "point_count": 0,
        "points_with_time_pct": 0.0,
        "distance_km": 0.0,
        "duration_min": 0.0,
        "avg_speed_kmh": None,
        "avg_point_spacing_m": None,
        "activity_guess": "לא ברור",
        "source_guess": "לא ברור",
        "notes": [],
    }

    try:
        tree = ET.parse(path)
    except ET.ParseError as e:
        result["notes"].append(f"שגיאת פענוח XML: {e}")
        return result

    root = tree.getroot()
    ns_uri = get_namespace(root.tag)
    ns = {"g": ns_uri} if ns_uri else {}

    def find(tag_path):
        return root.findall(tag_path.replace("g:", "{" + ns_uri + "}") if ns_uri else tag_path.replace("g:", ""))

    result["creator"] = root.attrib.get("creator", "")

    trkpts = find(".//g:trk//g:trkpt")
    rtepts = find(".//g:rte//g:rtept")
    wpts = find(".//g:wpt")

    if trkpts:
        result["element_type"] = "trk (מסלול/הקלטה)"
        points = trkpts
    elif rtepts:
        result["element_type"] = "rte (route מתוכנן)"
        points = rtepts
    elif wpts:
        result["element_type"] = "wpt בלבד (נקודות ציון)"
        points = []
    else:
        result["element_type"] = "ריק/לא מזוהה"
        points = []

    result["point_count"] = len(points)

    coords = []
    times = []
    for pt in points:
        try:
            lat = float(pt.attrib["lat"])
            lon = float(pt.attrib["lon"])
        except (KeyError, ValueError):
            continue
        coords.append((lat, lon))
        time_el = pt.find("g:time" if ns_uri else "time", ns) if ns_uri else pt.find("time")
        t = parse_time(time_el.text) if time_el is not None else None
        times.append(t)

    if coords:
        result["points_with_time_pct"] = round(100.0 * sum(1 for t in times if t) / len(coords), 1)

        total_dist = 0.0
        spacings = []
        for i in range(1, len(coords)):
            d = haversine_km(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1])
            total_dist += d
            spacings.append(d * 1000)  # מטרים
        result["distance_km"] = round(total_dist, 2)
        if spacings:
            result["avg_point_spacing_m"] = round(sum(spacings) / len(spacings), 1)

        valid_times = [t for t in times if t is not None]
        if len(valid_times) >= 2:
            duration_sec = (max(valid_times) - min(valid_times)).total_seconds()
            if duration_sec > 0:
                result["duration_min"] = round(duration_sec / 60.0, 1)
                result["avg_speed_kmh"] = round(total_dist / (duration_sec / 3600.0), 1)

    # --- סיווג סוג מקור: הקלטה מול תכנון ---
    creator_lower = result["creator"].lower()
    time_ratio = result["points_with_time_pct"] / 100.0

    if rtepts and not trkpts:
        result["source_guess"] = "תכנון מסלול (route)"
        result["notes"].append("הקובץ מבוסס rte, לא trk - מבנה טיפוסי לתכנון ולא להקלטה")
    elif any(tool in creator_lower for tool in KNOWN_RECORDING_TOOLS):
        result["source_guess"] = "הקלטה"
        result["notes"].append(f"creator מזהה כלי הקלטה ידוע: {result['creator']}")
    elif any(tool in creator_lower for tool in KNOWN_PLANNING_TOOLS):
        result["source_guess"] = "תכנון מסלול"
        result["notes"].append(f"creator מזהה כלי תכנון ידוע: {result['creator']}")
    elif time_ratio >= RECORDING_MIN_TIME_RATIO and result["point_count"] > 20:
        result["source_guess"] = "הקלטה"
        result["notes"].append(f"{result['points_with_time_pct']}% מהנקודות עם timestamp + הרבה נקודות")
    elif time_ratio <= PLANNED_MAX_TIME_RATIO:
        result["source_guess"] = "תכנון מסלול"
        result["notes"].append("כמעט אין timestamps על הנקודות")
    else:
        fname_lower = path.name.lower()
        if any(k in fname_lower for k in RECORD_KEYWORDS):
            result["source_guess"] = "הקלטה (לפי שם קובץ)"
        elif any(k in fname_lower for k in PLAN_KEYWORDS):
            result["source_guess"] = "תכנון מסלול (לפי שם קובץ)"

    # --- סיווג סוג פעילות: הליכה מול רכיבה ---
    fname_lower = path.name.lower()
    fname_walk = any(k in fname_lower for k in WALK_KEYWORDS)
    fname_cycle = any(k in fname_lower for k in CYCLE_KEYWORDS)

    if result["avg_speed_kmh"] is not None:
        speed = result["avg_speed_kmh"]
        if speed <= WALK_MAX_SPEED_KMH:
            result["activity_guess"] = "הליכה רגלית"
        elif speed <= CYCLE_MAX_SPEED_KMH:
            result["activity_guess"] = "רכיבת אופניים"
        else:
            result["activity_guess"] = f"לא ברור (מהירות חריגה: {speed} קמ״ש)"
        result["notes"].append(f"מבוסס מהירות ממוצעת מחושבת: {speed} קמ״ש")
    elif fname_walk and not fname_cycle:
        result["activity_guess"] = "הליכה רגלית (לפי שם קובץ בלבד)"
    elif fname_cycle and not fname_walk:
        result["activity_guess"] = "רכיבת אופניים (לפי שם קובץ בלבד)"
    else:
        result["notes"].append("אין timestamps מספיקים לחישוב מהירות, ואין רמז ברור בשם הקובץ")

    return result


def main():
    gpx_dir = get_gpx_dir()
    data_dir = get_data_dir()

    print(f"סורק קבצי GPX בתיקייה: {gpx_dir}")
    print(f"(רמה עליונה בלבד, לא כולל תתי-תיקיות)\n")

    files = list_gpx_files_top_level(gpx_dir)

    if not files:
        print("לא נמצאו קבצי GPX בתיקייה.")
        return

    print(f"נמצאו {len(files)} קבצי GPX. מנתח...\n")

    results = [analyze_file(p) for p in files]

    for r in results:
        print(f"── {r['filename']} ──")
        print(f"   סוג אלמנט: {r['element_type']}  |  נקודות: {r['point_count']}  |  creator: {r['creator'] or '-'}")
        print(f"   מרחק: {r['distance_km']} ק\"מ  |  משך: {r['duration_min']} דק'  |  "
              f"מהירות ממוצעת: {r['avg_speed_kmh'] if r['avg_speed_kmh'] is not None else '-'} קמ\"ש  |  "
              f"% נקודות עם זמן: {r['points_with_time_pct']}%")
        print(f"   >> פעילות: {r['activity_guess']}   |   מקור: {r['source_guess']}")
        if r["notes"]:
            print(f"   הערות: {' ; '.join(r['notes'])}")
        print()

    # סיכום
    from collections import Counter
    activity_counts = Counter(r["activity_guess"] for r in results)
    source_counts = Counter(r["source_guess"] for r in results)

    print("=" * 50)
    print("סיכום סוג פעילות:")
    for k, v in activity_counts.most_common():
        print(f"   {k}: {v}")
    print("\nסיכום סוג מקור:")
    for k, v in source_counts.most_common():
        print(f"   {k}: {v}")

    # דוח CSV
    csv_path = data_dir / "gpx_analysis_report.csv"
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow([
            "שם קובץ", "סוג אלמנט", "כמות נקודות", "% נקודות עם זמן",
            "מרחק (ק\"מ)", "משך (דק')", "מהירות ממוצעת (קמ\"ש)",
            "מרווח ממוצע בין נקודות (מ')", "creator",
            "סיווג פעילות", "סיווג מקור", "הערות",
        ])
        for r in results:
            writer.writerow([
                r["filename"], r["element_type"], r["point_count"], r["points_with_time_pct"],
                r["distance_km"], r["duration_min"], r["avg_speed_kmh"],
                r["avg_point_spacing_m"], r["creator"],
                r["activity_guess"], r["source_guess"], " ; ".join(r["notes"]),
            ])

    print(f"\nדוח מלא נשמר ב: {csv_path}")


if __name__ == "__main__":
    main()
