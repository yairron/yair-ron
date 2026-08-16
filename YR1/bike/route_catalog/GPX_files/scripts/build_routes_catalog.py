#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_routes_catalog.py
========================
מרכיב את קובץ הקטלוג המרוכז (routes-catalog.json) שיזין את דפי אתר הקטלוג -
לא מחליף את שני הכלים הקיימים, אלא מפעיל אותם ומוסיף עליהם:

  1. שינוי שם לקבצים חדשים - מפעיל ממש את gpx_meaningful_rename.py הקיים (import + קריאה
     ל-main שלו, עם פרמטרי ברירת המחדל שלו), בלי לשכפל את היגיון הזיהוי/השינוי-שם. קבצים
     שכבר יש להם שם משמעותי (כמעט כל הקבצים הקיימים) לא ייגעו בהם, בדיוק כמו היום.
  2. ניתוח וסיווג - קורא ל-analyze_file() מתוך gpx_analyzer.py הקיים לכל קובץ (סוג
     פעילות, מרחק מצטבר, סוג מקור וכו') - בלי לשכפל את ההיוריסטיקות שלו.
  3. ישובים סמוכים - קורא ל-load_settlements()/sample_points()/find_nearby_settlements()
     מתוך gpx_meaningful_rename.py, כדי שלכל קובץ (גם אם כבר יש לו שם משמעותי ולכן לא
     "נגעו" בו בשלב 1) תהיה רשימת ישובים סמוכים לצורך חיפוש בדף הקטלוג - לא רק לקבצים
     שהשם שלהם נבנה מהם.
  4. טיפוס וירידה מצטברים - לא קיימים באף אחד משני הכלים הקיימים. מחושבים לפי אלגוריתם
     סף-רעש (hysteresis) - ראו תיעוד מלא ליד calc_elevation_gain_loss() - לא סכימת כל
     הפרש חיובי/שלילי בין נקודות עוקבות (זו הייתה הנוסחה המקורית כאן עד 16.08.2026,
     ועדיין הנוסחה בכלי "ניקוי קובץ GPX", YR1/bike/gpx_cleaner/gpx_cleaner.html - תוקן
     כאן בלבד אחרי שהתגלה בפועל שהיא מנפחת משמעותית "טיפוס" ממסלולים שכמעט ואינם
     מטפסים, בגלל רעש GPS טבעי). קובץ בלי תגי גובה בכלל מקבל "אין נתון" בשניהם.
  5. תמונה ממוזערת - נוצרת בדפדפן אמיתי (Playwright, אותו כלי כבר בשימוש בסקריפטים אחרים
     באתר תחת BTL/support_files/senior_rights/scripts/) שמריץ עמוד מפה מקומי
     (thumbnail_template.html, לצדו של הסקריפט הזה) עם אותה בדיוק שכבת מפה טופוגרפית
     שכבר בשימוש בכלי "ניקוי קובץ GPX" (Israel Hiking Map). הדף נטען פעם אחת בלבד -
     ולכל מסלול רק מציירים עליו קו חדש ומצלמים, בלי לפתוח דפדפן/עמוד מחדש לכל קובץ.

תלות חדשה שהתווספה לצורך הסקריפט הזה (מותקנת כבר בסביבת הפיתוח המקומית - ראו קובץ
ה-README.md לצד הסקריפט הזה): pyproj - נדרשת בפועל על ידי load_settlements() כדי להמיר
את קואורדינטות מאגר היישובים (Web Mercator) ל-WGS84, גם קודם לכתיבת הסקריפט הזה.

פלט: קובץ יחיד, route_catalog/data/routes-catalog.json, ותמונות ממוזערות תחת
route_catalog/data/thumbnails/. זו כרגע התיקייה היחידה באתר שדפי הקטלוג בפועל יקראו
ממנה - קבצי ה-GPX המקוריים עצמם נשארים בינתיים במקומם הנוכחי (GPX_files/), עד שתסוכם
ותבוצע חלוקת התיקיות המלאה של הפרויקט.

הרצה (מתוך תיקיית scripts):
    python build_routes_catalog.py                    # הרצה מלאה, כולל תמונות ממוזערות
    python build_routes_catalog.py --skip-thumbnails   # מדלג על שלב התמונות (מהיר יותר לבדיקות)
"""

import argparse
import http.server
import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from functools import partial
from pathlib import Path
from threading import Thread

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gpx_analyzer as analyzer          # noqa: E402
import gpx_meaningful_rename as renamer  # noqa: E402

from playwright.sync_api import sync_playwright  # noqa: E402


def get_script_dir() -> Path:
    return Path(__file__).resolve().parent


def get_gpx_dir() -> Path:
    return get_script_dir().parent


def get_support_data_dir() -> Path:
    return get_script_dir() / "support_data"


def get_catalog_data_dir() -> Path:
    """route_catalog/data/ - התיקייה שדפי האתר (בעתיד) קוראים ממנה, לא תיקיית העבודה
    הפנימית של הסקריפטים (support_data/)."""
    return get_script_dir().parent.parent / "data"


def rename_new_files():
    """מפעיל את gpx_meaningful_rename.py הקיים כמו שהוא, עם פרמטרי ברירת המחדל שלו -
    בלי קשר לאיך שהסקריפט הנוכחי הופעל (מאלץ את sys.argv לזמן הקריאה בלבד)."""
    saved_argv = sys.argv
    try:
        sys.argv = [saved_argv[0]]
        renamer.main()
    finally:
        sys.argv = saved_argv


def extract_track_points(path: Path):
    """כמו renamer.extract_points_and_times, ומשתמש באותה זיהוי-namespace
    (renamer.get_namespace) - אבל שולף גם גובה (ele) לכל נקודה, ששתי הפונקציות הקיימות
    (באנלייזר ובסקריפט שינוי השם) לא שולפות בכלל."""
    try:
        tree = ET.parse(path)
    except ET.ParseError:
        return []
    root = tree.getroot()
    ns_uri = renamer.get_namespace(root.tag)
    ns = {"g": ns_uri} if ns_uri else {}

    def findall(tag_path):
        return root.findall(tag_path.replace("g:", "{" + ns_uri + "}") if ns_uri else tag_path.replace("g:", ""))

    points_el = findall(".//g:trk//g:trkpt") or findall(".//g:rte//g:rtept") or findall(".//g:wpt")

    points = []
    for pt in points_el:
        try:
            lat = float(pt.attrib["lat"])
            lon = float(pt.attrib["lon"])
        except (KeyError, ValueError):
            continue
        ele_el = pt.find("g:ele" if ns_uri else "ele", ns) if ns_uri else pt.find("ele")
        ele = None
        if ele_el is not None and ele_el.text:
            try:
                ele = float(ele_el.text)
            except ValueError:
                ele = None
        time_el = pt.find("g:time" if ns_uri else "time", ns) if ns_uri else pt.find("time")
        t = renamer.parse_gpx_time(time_el.text) if time_el is not None else None
        points.append({"lat": lat, "lon": lon, "ele": ele, "time": t})
    return points


ELEVATION_NOISE_THRESHOLD_M = 4.0


def calc_elevation_gain_loss(elevations):
    """טיפוס וירידה מצטברים, לפי אלגוריתם סף-רעש (hysteresis/deadband) - לא סכימת כל
    הפרש בין נקודות עוקבות (כך היה קודם, וגם כך זה עדיין בכלי "ניקוי קובץ GPX",
    gpx_cleaner.html - ראו הערה בסוף). מתעלמים משינוי גובה עד שהוא חוצה סף מינימלי
    (ELEVATION_NOISE_THRESHOLD_M) ביחס לנקודת הייחוס האחרונה; רק אז נספר אותו ונוזזת
    נקודת הייחוס. זה מונע מרעש GPS טבעי (תזוזה של מטר-שניים סביב הגובה האמיתי, בין
    נקודה לנקודה) להצטבר לכדי מאות מטרים של "טיפוס" מדומה על מסלול שבפועל שטוח/יורד.

    אומת בפועל (16.08.2026) מול gpx.studio על קובץ אמיתי (ערד שפך זוהר.gpx, מסלול
    שכולו ירידה בפועל אבל הנוסחה הישנה הראתה לו 659 מ' טיפוס): סף 4 מ' נתן כאן
    448 מ' טיפוס / 1377 מ' ירידה, מול 453/1384 בפועל ב-gpx.studio - פער <2%.

    מחזיר (gain, loss) מעוגלים, או (None, None) אם אין בכלל נתוני גובה בקובץ.
    **לא** תוקן ב-gpx_cleaner.html - זה כלי נפרד, עצמאי, שמשמש להעלאה/ניקוי חד-פעמיים
    של קובץ בודד ע"י המשתמש בעצמו; התיקון כאן נוגע רק לחישוב המוצג בקטלוג."""
    if not any(e is not None for e in elevations):
        return None, None
    gain = 0.0
    loss = 0.0
    ref = None
    for e in elevations:
        if e is None:
            continue
        if ref is None:
            ref = e
            continue
        diff = e - ref
        if diff >= ELEVATION_NOISE_THRESHOLD_M:
            gain += diff
            ref = e
        elif diff <= -ELEVATION_NOISE_THRESHOLD_M:
            loss += -diff
            ref = e
    return round(gain), round(loss)


def find_nearby_settlement_names(coords, settlements_db):
    """עוטף את find_nearby_settlements הקיים בהרחבת רדיוס הדרגתית, בדיוק כמו הלולאה
    שכבר קיימת בתוך renamer.main() - אבל מופעל כאן על כל קובץ (גם קבצים שכבר יש להם
    שם משמעותי ולכן renamer.main() לא נגע בהם, ולכן גם לא חישב עבורם ישובים סמוכים)."""
    if not coords:
        return []
    samples = renamer.sample_points(coords)
    radius = renamer.DEFAULT_RADIUS_KM
    matches = renamer.find_nearby_settlements(samples, settlements_db, radius)
    while len(matches) < renamer.MIN_SETTLEMENTS_IN_NAME and radius < renamer.MAX_RADIUS_KM:
        radius *= renamer.RADIUS_STEP_MULTIPLIER
        matches = renamer.find_nearby_settlements(samples, settlements_db, radius)
    return [name for name, _ in matches[:renamer.MAX_SETTLEMENTS_IN_NAME]]


def determine_display_date(path: Path, times):
    """אותה שרשרת נפילה-לאחור בדיוק שכבר קיימת בתוך renamer.main(): קודם תאריך משם
    הקובץ, אחר כך timestamps בתוך הקובץ, ולבסוף תאריך שינוי הקובץ."""
    date_obj = renamer.extract_date_from_filename(path.stem)
    if date_obj:
        return date_obj, "שם קובץ"
    valid_times = [t for t in times if t is not None]
    if valid_times:
        return min(valid_times).date(), "timestamps בקובץ"
    return datetime.fromtimestamp(path.stat().st_mtime).date(), "תאריך שינוי הקובץ (גיבוי)"


def normalize_source_guess(source_guess: str) -> str:
    """gpx_analyzer.py הקיים מחזיר שלושה נוסחים שונים לאותה משמעות ("תכנון מסלול",
    "תכנון מסלול (route)", "תכנון מסלול (לפי שם קובץ)") - הבדל בין ענפי הקוד השונים
    שקבעו את הסיווג, לא הבדל משמעותי לצורך תגית בקטלוג. מאחד אותם לתווית אחת אחידה."""
    if source_guess.startswith("תכנון מסלול"):
        return "תכנון מסלול"
    return source_guess


def build_catalog_record(path: Path, info: dict, points: list, settlements_db):
    coords = [(p["lat"], p["lon"]) for p in points]
    elevations = [p["ele"] for p in points]
    times = [p["time"] for p in points]

    date_obj, date_source = determine_display_date(path, times)
    settlements = find_nearby_settlement_names(coords, settlements_db)
    elevation_gain, elevation_loss = calc_elevation_gain_loss(elevations)

    return {
        "file_name": path.name,
        "gpx_path": f"GPX_files/{path.name}",
        "date": date_obj.isoformat(),
        "date_source": date_source,
        "activity": info["activity_guess"],
        "source": normalize_source_guess(info["source_guess"]),  # "הקלטה" / "תכנון מסלול" / "לא ברור"
        "distance_km": info["distance_km"],
        "elevation_gain_m": elevation_gain,
        "elevation_loss_m": elevation_loss,
        "point_count": info["point_count"],
        "settlements": settlements,
        # True/False מפורש (לא רק הסתמכות על רשימה ריקה) - כדי שדף הקטלוג יוכל
        # להציג תגית ברורה ("מיקום לא זוהה") במקום עמודת ישובים ריקה לא-מוסברת.
        "settlements_found": bool(settlements),
        "thumbnail": None,  # ימולא ב-generate_thumbnails, או יישאר None אם אין נקודות
        "_coords": [[lat, lon] for lat, lon in coords],  # שדה עבודה זמני - מוסר לפני הכתיבה לקובץ
    }


def generate_thumbnails(records, thumbnails_dir: Path, scripts_dir: Path, force=False):
    thumbnails_dir.mkdir(parents=True, exist_ok=True)

    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(scripts_dir))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 460, "height": 340})
            page.goto(f"http://127.0.0.1:{port}/thumbnail_template.html", wait_until="networkidle")

            total = len(records)
            for i, record in enumerate(records, 1):
                coords = record["_coords"]
                if not coords:
                    print(f"  [{i}/{total}] {record['file_name']} - אין נקודות, מדלג על תמונה")
                    continue

                thumb_name = path_stem_from_filename(record["file_name"]) + ".png"
                out_path = thumbnails_dir / thumb_name
                if out_path.exists() and not force:
                    print(f"  [{i}/{total}] {record['file_name']} - תמונה כבר קיימת, מדלג")
                    record["thumbnail"] = f"thumbnails/{thumb_name}"
                    continue

                print(f"  [{i}/{total}] {record['file_name']}")
                page.evaluate("(coords) => window.renderTrack(coords)", coords)
                try:
                    page.wait_for_function("window.__tilesLoaded === true", timeout=8000)
                except Exception:
                    pass
                page.wait_for_timeout(150)

                page.locator("#map").screenshot(path=str(out_path))
                record["thumbnail"] = f"thumbnails/{thumb_name}"

            browser.close()
    finally:
        server.shutdown()


def path_stem_from_filename(filename: str) -> str:
    return filename.rsplit(".", 1)[0]


def cleanup_orphan_thumbnails(records, thumbnails_dir: Path) -> int:
    """מוחק קבצי תמונה ממוזערת בתיקייה שאין להם יותר רשומה תואמת בקטלוג - קורה
    בעיקר אחרי ששינו שם לקובץ GPX ידנית: התמונה הישנה (תחת השם הקודם) לא
    נמחקת בעצמה על ידי generate_thumbnails (שרק בודק/יוצר לפי השם הנוכחי),
    ונשארת "יתומה". מריץ רק כשבאמת עברו על כל הקבצים (לא תחת --skip-thumbnails,
    שם records[i]['thumbnail'] הוא None לכולם ולכן הכול היה נמחק בטעות)."""
    if not thumbnails_dir.exists():
        return 0
    expected = {r["thumbnail"].split("/", 1)[1] for r in records if r["thumbnail"]}
    removed = 0
    for png in thumbnails_dir.glob("*.png"):
        if png.name not in expected:
            png.unlink()
            removed += 1
    return removed


def main():
    parser = argparse.ArgumentParser(description="בונה את קובץ הקטלוג המרוכז של מסלולי ה-GPX")
    parser.add_argument("--skip-thumbnails", action="store_true", help="לדלג על יצירת תמונות ממוזערות (מהיר יותר לבדיקות)")
    parser.add_argument("--force-thumbnails", action="store_true", help="ליצור מחדש את כל התמונות הממוזערות, גם אם כבר קיימות (למשל אחרי שינוי עיצוב בתבנית)")
    args = parser.parse_args()

    gpx_dir = get_gpx_dir()
    scripts_dir = get_script_dir()
    support_data_dir = get_support_data_dir()
    catalog_data_dir = get_catalog_data_dir()
    thumbnails_dir = catalog_data_dir / "thumbnails"

    print("שלב 1: קליטת קבצים חדשים (שינוי שם באמצעות הכלי הקיים)")
    rename_new_files()

    print("\nשלב 2: טעינת מאגר היישובים")
    settlements_db = renamer.load_settlements(support_data_dir)

    files = analyzer.list_gpx_files_top_level(gpx_dir)
    print(f"\nשלב 3: ניתוח {len(files)} קבצי GPX")

    records = []
    for i, path in enumerate(files, 1):
        print(f"  [{i}/{len(files)}] {path.name}")
        info = analyzer.analyze_file(path)
        points = extract_track_points(path)
        records.append(build_catalog_record(path, info, points, settlements_db))

    if args.skip_thumbnails:
        print("\nשלב 4: דולג (--skip-thumbnails)")
    else:
        print(f"\nשלב 4: יצירת תמונות ממוזערות ({len(records)} מסלולים)" + (" - כפוי מחדש לכולם" if args.force_thumbnails else ""))
        generate_thumbnails(records, thumbnails_dir, scripts_dir, force=args.force_thumbnails)
        removed_orphans = cleanup_orphan_thumbnails(records, thumbnails_dir)
        if removed_orphans:
            print(f"  נמחקו {removed_orphans} תמונות ממוזערות יתומות (שם קובץ שכבר לא קיים בקטלוג)")

    no_elevation = sum(1 for r in records if r["elevation_gain_m"] is None)
    no_settlements = sum(1 for r in records if not r["settlements"])
    no_thumbnail = sum(1 for r in records if r["thumbnail"] is None)

    for r in records:
        r.pop("_coords", None)

    catalog = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "route_count": len(records),
        "routes": records,
    }

    catalog_data_dir.mkdir(parents=True, exist_ok=True)
    out_path = catalog_data_dir / "routes-catalog.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"\nהושלם. קובץ הקטלוג נשמר ב: {out_path}")
    print(f"  סה\"כ מסלולים: {len(records)}")
    print(f"  בלי נתוני גובה: {no_elevation}")
    print(f"  בלי ישוב קרוב שנמצא: {no_settlements}")
    print(f"  בלי תמונה ממוזערת: {no_thumbnail}")


if __name__ == "__main__":
    main()
