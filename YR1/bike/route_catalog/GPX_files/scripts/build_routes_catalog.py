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
import time
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
    """שינוי שם לקבצים חדשים (בלי שם משמעותי עדיין) - מריץ את אלגוריתם הסדר
    הכרונולוגי (start/furthest/end + זיהוי מעגלי, עם עדיפות לנקודות מאומתות
    ב-verified_start_settlements.csv) מתוך rename_by_chronological_order.py,
    ולא את gpx_meaningful_rename.py.main() הישן (רשימת 'ישובים קרובים' גנרית
    לאורך המסלול, בלי סדר/זיהוי-מעגלי, ובלי הישענות על נתונים מאומתים) - הוחלף
    20.08.2026 אחרי שהתגלה בפועל שם שגוי ('שבי ציון' לנקודת התחלה שהיא בפועל
    געתון) בקובץ חדש שעבר דרך המסלול הישן. ייבוא בתוך הפונקציה (לא בראש הקובץ)
    כדי להימנע מייבוא-מעגלי - rename_by_chronological_order.py עצמו מייבא את
    המודול הזה (build_routes_catalog) כ-builder."""
    import rename_by_chronological_order as chrono  # noqa: PLC0415

    gpx_dir = get_gpx_dir()
    support_data_dir = get_support_data_dir()

    # בדיקה זולה (רק שמות קבצים, בלי לפתוח אף קובץ) לפני load_known_points() -
    # נמדד בפועל (22.08.2026) שהיא עצמה לוקחת כ-30 שניות (קוראת מחדש את כל
    # קבצי ה-GPX כדי לבנות את טבלת הנקודות המאומתות) - מיותר לגמרי כשאין בכלל
    # קובץ חדש-בלי-שם-משמעותי לשנות לו שם.
    unnamed = [p for p in analyzer.list_gpx_files_top_level(gpx_dir) if not renamer.has_meaningful_word(p.stem)]
    if not unnamed:
        print("  אין קבצים חדשים ללא שם משמעותי - מדלג על בניית טבלת הנקודות המאומתות.")
        return

    settlements_db = renamer.load_settlements(support_data_dir)
    known_points = chrono.load_known_points(gpx_dir, support_data_dir, get_catalog_data_dir())
    renamed = chrono.auto_rename_unnamed_files(gpx_dir, settlements_db, known_points)
    for old_name, new_name in renamed:
        print(f"  [OK] {old_name}  ->  {new_name}")


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


# ---------- חלוקה ל-5 אזורים גיאוגרפיים (17.08.2026) ----------
#
# לפי הגדרה מפורשת של המשתמש, לא לפי המפה המקורית בת 34 האזורים (שהייתה מדויקת
# מדי ודרשה נתוני GIS רשמיים שלא היו זמינים בפועל). כל הגבולות פה קווים ישרים בין
# ערים אמיתיות (קואורדינטות אמיתיות, לא מומצאות) - ראו הסבר ליד כל אחד.
#
# רמת הגולן והחרמון: "כל מה שמזרחית לירדן" - קו אורך גיאוגרפי אחד (מזרחית לירדן/כנרת).
# צפון: "כל הצפון בקו חיפה-בית שאן" - קו בין שתי הערים (לא קו רוחב פשוט, כי לחיפה
#   ולבית שאן יש גם קו אורך שונה - זה קו אלכסוני אמיתי).
# מרכז: "מחיפה עד אשקלון, ובמזרח עד בית שמש" - מדרום לקו חיפה-בית שאן, עד קו
#   אשקלון-בית שמש, ומערבית לבית שמש (בית שמש עצמה היא הגבול המזרחי).
# ירושלים ומדבר יהודה: מזרחית לבית שמש (מדרום לקו חיפה-בית שאן), עד קו רוחב
#   שמפריד ממדבר הנגב (בסביבות ערד/צפון ים המלח).
# נגב וערבה: כל השאר - דרומית לקו אשקלון-בית שמש (במערב) ודרומית לגבול מדבר
#   יהודה/נגב (במזרח), עד אילת.
#
# בקעת הירדן (נוסף 17.08.2026, לבקשת המשתמש): רצועה תחומה סביב הירדן עצמו -
# מדרום הכנרת (~32.75) ועד צפון ים המלח/יריחו (~31.75), ברוחב אורך גיאוגרפי
# 35.30-35.65. נבדקת **לפני** "צפון" (כדי לתפוס בעצמה נקודות שאחרת היו נופלות
# ל"צפון" הכללי) אבל **אחרי** גולן (כדי שגולן עדיין "מנצח" לשטח שברור שהוא שלו).
# תוקן בעקבות באג אמיתי שהתגלה: אזור בקעת בית שאן היה נופל בטעות ל"ירושלים ומדבר
# יהודה" (כי הוא מזרחית לגבול מרכז/יהודה ומדרום לקו חיפה-בית שאן) - האזור החדש
# פותר את זה ישירות. אימות שטח: בית הערבה/קליה/אלמוג (בתוך הרצועה) הם בפועל
# יישובי "מועצה אזורית בקעת הירדן" האמיתית - התאמה מלאה.

HAIFA = (32.794, 34.989)
BEIT_SHEAN = (32.497, 35.499)
ASHKELON = (31.669, 34.571)
BEIT_SHEMESH = (31.744, 34.988)

GOLAN_LON_CUTOFF = 35.50   # מזרחית לזה = מזרחית לירדן/לכנרת
CENTER_JUDEA_LON_CUTOFF = 35.05   # מעט מזרחית לבית שמש עצמה - בית שמש נשארת "מרכז"
JUDEA_NEGEV_LAT_CUTOFF = 31.3   # בערך גובה ערד/צפון ים המלח
JORDAN_VALLEY_LON_MIN = 35.42   # תוקן 17.08.2026: 35.30 היה תפס בטעות את עמק יזרעאל/הר תבור (~35.35-35.41)
JORDAN_VALLEY_LON_MAX = 35.65
JORDAN_VALLEY_LAT_MIN = 31.75   # ~יריחו/צפון ים המלח
JORDAN_VALLEY_LAT_MAX = 32.75   # ~דרום הכנרת

REGION_ORDER = ["רמת הגולן והחרמון", "בקעת הירדן", "צפון", "מרכז", "ירושלים ומדבר יהודה", "נגב וערבה"]


def _side_of_line(lat, lon, p1, p2):
    """סימן של מכפלה וקטורית - צד של הנקודה ביחס לקו p1->p2 (מישור lat/lon מקורב
    כקרטזי, מספיק מדויק בסדר הגודל של ישראל). חיובי = צפונית/מזרחית לקו."""
    return (p2[1] - p1[1]) * (lat - p1[0]) - (p2[0] - p1[0]) * (lon - p1[1])


def classify_point_region(lat, lon):
    if lon >= GOLAN_LON_CUTOFF and _side_of_line(lat, lon, ASHKELON, BEIT_SHEMESH) > 0:
        return "רמת הגולן והחרמון"
    if JORDAN_VALLEY_LON_MIN <= lon <= JORDAN_VALLEY_LON_MAX and JORDAN_VALLEY_LAT_MIN <= lat <= JORDAN_VALLEY_LAT_MAX:
        return "בקעת הירדן"
    if _side_of_line(lat, lon, HAIFA, BEIT_SHEAN) > 0:
        return "צפון"
    if lon < CENTER_JUDEA_LON_CUTOFF:
        if _side_of_line(lat, lon, ASHKELON, BEIT_SHEMESH) > 0:
            return "מרכז"
        return "נגב וערבה"
    if lat >= JUDEA_NEGEV_LAT_CUTOFF:
        return "ירושלים ומדבר יהודה"
    return "נגב וערבה"


def classify_route_regions(coords):
    """מסווג כל נקודה נדגמת למחוז אחד, ומחזיר את **איחוד** האזורים שנמצאו - כך
    שמסלול שחוצה בין שני אזורים סמוכים (למשל מתחיל במרכז ומסתיים בירושלים) מסומן
    בשניהם באופן טבעי, בלי צורך במנגנון "רצועת חפיפה" נפרד - בדיוק כמו שהמשתמש
    ביקש ("ניתן יהיה לשמור לכל מסלול יותר מאזור אחד בתנאי שנושקים")."""
    if not coords:
        return []
    samples = renamer.sample_points(coords)
    found = {classify_point_region(lat, lon) for lat, lon in samples}
    return [r for r in REGION_ORDER if r in found]


# ---------- ניקוי קפיצות GPS (שיבוש/ריגול), 17.08.2026 ----------
#
# פורט ישיר של האלגוריתם הקיים והמוכח בכלי "ניקוי קובץ GPX" של האתר עצמו
# (YR1/bike/gpx_cleaner/gpx_cleaner.html, reprocess()) - לא המצאה מחדש. משתמש
# בסף ברירת המחדל "רכיבה" של הכלי המקורי (המקל מבין השניים, בטוח כסף אחיד
# לכל המסלולים) - לא לפי activity שכבר מסווג לכל מסלול, כי הסיווג עצמו עלול
# להיות מוטה ע"י אותה קפיצה (מהירות ממוצעת מנופחת -> activity שגוי) לפני
# שהניקוי קרה - תלות מעגלית שצריך להימנע ממנה.
CLEAN_MAX_SPEED_KMH = 80.0
CLEAN_MAX_ELE_DIFF_M = 35.0
INVALID_REMOVED_RATIO = 0.2   # מעל 20% נקודות שהוסרו -> "מסלול לא תקין"
INVALID_MIN_POINTS = 10       # פחות מזה נקודות נשארות -> "מסלול לא תקין" גם אם היחס נמוך

# "עוגן מורעל" ומנגנון resync, נוסף 17.08.2026 - ראו הסבר מלא בתוך clean_track_points.
RESYNC_MIN_RUN = 3
# תקרת מרחק ל-resync, נוספה אחרי בדיקה בפועל על 5 קבצים: הגרסה הראשונה (בלי
# תקרה) תיקנה נכון קבצים עם עוגן מורעל אמיתי (קפיצות resync של 0.03-2.5 ק"מ),
# אבל גם "אימצה" בטעות אשכולות GPS מרוגלים/משובשים לגמרי כעוגן חדש - נמצא
# בפועל בקובץ עם קפיצות resync חוזרות של 94-178 ק"מ (בדיוק דפוס הריגול לעמאן
# שהאלגוריתם המקורי נבנה כדי לתפוס!), שגרם למרחק מדווח מנופח לגמרי (380-741
# ק"מ למסלול רכיבה/הליכה מקומי). 10 ק"מ נבחר כי הוא הרבה מעל הקפיצות הלגיטימיות
# שנמצאו בפועל (עד 2.5 ק"מ) והרבה מתחת לקפיצות המרוגלות שנמצאו בפועל (94+ ק"מ).
MAX_RESYNC_JUMP_KM = 10.0


def _points_consistent(a, b):
    """בדיוק אותה בדיקת סף כמו בלולאה הראשית של clean_track_points - אבל בין שתי
    נקודות גולמיות עוקבות (סדר קובץ), לא מול נקודת-הייחוס. משמש רק לבדיקת
    resync (ראו למטה): האם קטע קטן של נקודות עוקבות עקבי-פנימית בפני עצמו."""
    if a["time"] is None or b["time"] is None:
        return True
    dt = (b["time"] - a["time"]).total_seconds()
    if dt <= 0:
        return True
    dist = renamer.haversine_km(a["lat"], a["lon"], b["lat"], b["lon"])
    speed = dist / dt * 3600
    ele_diff = abs(b["ele"] - a["ele"]) if (a["ele"] is not None and b["ele"] is not None) else 0
    return speed <= CLEAN_MAX_SPEED_KMH and ele_diff <= CLEAN_MAX_ELE_DIFF_M


def clean_track_points(points):
    """מנקה קפיצות GPS בלתי-אפשריות (למשל הקפיצה החוזרת שנמצאה בפועל לשדה
    התעופה המלכה עליא בעמאן, 31.717/35.999 - ראו תיעוד מלא ב-README). ההיגיון:
    נקודה נבדקת מול נקודת-הייחוס האחרונה **שהתקבלה** (לא הנקודה הקודמת בקובץ) -
    אם המהירות המרומזת או הפרש הגובה חורגים מהסף, הנקודה נדחית **ונקודת הייחוס
    לא זזה**. כך קפיצה שנמשכת נקודה בודדת או אלפי נקודות ברצף (נמצא בפועל: קובץ
    עם 99.8% מהנקודות "תקועות" בשיבוש לאורך שעה שלמה) מטופלת באותו אופן בדיוק,
    בלי צורך להעריך מראש כמה נקודות הקפיצה תפסה - כל הנקודות הרחוקות/מהירות
    מדי מהנקודה התקינה האחרונה נדחות ברצף, עד שמגיעה נקודה שבאמת הגיונית שוב.

    תוקן 17.08.2026 - "עוגן מורעל": נמצא בפועל בקובץ אמיתי (2013-09-26,
    געתון_כפר ורדים_מנות) שקפיצת GPS יחידה מיד אחרי נקודת ההתחלה השאירה את
    נקודת הייחוס קפואה שם, וכ-799 נקודות אמיתיות (כ-45 דקות רכיבה של ממש) שבאו
    אחריה נדחו בשרשרת - לא כי הן עצמן שגויות, אלא כי נמדדו מול עוגן ישן/רחוק.
    הפתרון: כשנקודה נדחית מול העוגן, בודקים אם היא פותחת קטע עקבי-פנימית (לפי
    _points_consistent, בין נקודות עוקבות בקטע - לא מול העוגן הישן) באורך
    RESYNC_MIN_RUN לפחות. אם כן - כנראה שמצאנו קטע אמיתי שהתנתק מהעוגן, ומאמצים
    אותו כעוגן חדש (ה"קפיצה" עצמה, אם הייתה, נשארת כמעבר בודד וממוקם בין שתי
    נקודות אמיתיות - שגיאת מרחק חד-פעמית ומוגבלת, לא אובדן מאות נקודות אמיתיות).
    מקרה קצה נוסף: אם הקטע העקבי נמצא **לפני** שאושרה אף נקודה אמיתית מלבד זרע
    ההתחלה (kept עדיין רק points[0]) - סימן שנקודת ההתחלה עצמה היא הבעיה (למשל
    "fix" GPS ראשוני מיושן שנקלט לפני שהמכשיר נעל מיקום אמיתי), לא הקטע החדש;
    במקרה כזה מוותרים על נקודת ההתחלה ופותחים מחדש מהקטע העקבי.

    מחזיר (kept_points, removed_count)."""
    if not points:
        return points, 0
    n = len(points)
    kept = [points[0]]
    ref = points[0]
    removed_count = 0
    i = 1
    while i < n:
        p = points[i]
        if p["time"] is None or ref["time"] is None:
            kept.append(p)  # אין timestamp להשוואה - אי אפשר לחשב מהירות, שומרים
            ref = p
            i += 1
            continue
        dt = (p["time"] - ref["time"]).total_seconds()
        dist = renamer.haversine_km(ref["lat"], ref["lon"], p["lat"], p["lon"])
        speed = (dist / dt * 3600) if dt > 0 else 0
        ele_diff = abs(p["ele"] - ref["ele"]) if (p["ele"] is not None and ref["ele"] is not None) else 0
        if speed <= CLEAN_MAX_SPEED_KMH and ele_diff <= CLEAN_MAX_ELE_DIFF_M:
            kept.append(p)
            ref = p
            i += 1
            continue

        # p נדחתה מול העוגן הנוכחי - בדיקת resync: האם מתחיל כאן קטע עקבי-פנימית
        # (לפי המעבר הישיר בין נקודות עוקבות בקטע, לא מול העוגן) באורך מספיק,
        # **וגם** לא רחוק מדי מהעוגן הישן (ראו MAX_RESYNC_JUMP_KM למעלה - בלי
        # התקרה הזו, אשכול מרוגל ועקבי-פנימית-בפני-עצמו במיקום מזויף רחוק היה
        # מתקבל בטעות כעוגן "לגיטימי")?
        run = [p]
        j = i + 1
        while j < n and len(run) < RESYNC_MIN_RUN:
            if _points_consistent(run[-1], points[j]):
                run.append(points[j])
                j += 1
            else:
                break
        jump_dist = renamer.haversine_km(ref["lat"], ref["lon"], run[0]["lat"], run[0]["lon"])

        if len(run) >= RESYNC_MIN_RUN and jump_dist <= MAX_RESYNC_JUMP_KM:
            if len(kept) == 1 and kept[0] is points[0]:
                # אף נקודה אמיתית לא אושרה עדיין מלבד זרע ההתחלה - נקודת ההתחלה
                # עצמה כנראה הבעיה, לא הקטע החדש. מוותרים עליה ופותחים מחדש.
                removed_count += 1
                kept = list(run)
            else:
                kept.extend(run)
            ref = run[-1]
            i = j
        else:
            removed_count += 1
            i += 1
    return kept, removed_count


def calc_distance_km(coords):
    """מרחק מצטבר מהנקודות שנשמרו אחרי ניקוי - **לא** משתמשים ב-distance_km
    שמחזיר analyze_file() הקיים, כי הוא מחושב מהנקודות הגולמיות (כולל קפיצות),
    ולכן היה מנופח לכל קובץ עם שיבוש GPS (נצפה בפועל: 169 ק"מ למסלול מקומי
    שאמור להיות 20-40 ק"מ)."""
    total = 0.0
    for i in range(1, len(coords)):
        total += renamer.haversine_km(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1])
    return round(total, 2)


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


def content_signature(path: Path):
    """חתימת תוכן יציבה למסלול - **זהה בכוונה** ל-signature() ב-import_gpx_batch.py
    (לא שכפול-בטעות, אלא אותה הגדרה בדיוק בשני מקומות - ראו הערה שם על עיגול
    חותמת הזמן לשנייה השלמה). משמשת כאן כמפתח ל-route_ids.json במקום שם קובץ
    (ראו תיקון 20.08.2026 למטה) - מבוססת על points גולמיים (extract_track_points,
    לא points אחרי clean_track_points), כדי שהחתימה תישאר יציבה גם אם אלגוריתם
    הניקוי משתנה בעתיד, לא רק אם שם הקובץ משתנה."""
    return content_signature_from_points(extract_track_points(path))


def content_signature_from_points(points):
    """כמו content_signature, אבל מקבלת points שכבר חולצו - נמנעת מפענוח כפול
    של אותו קובץ XML (unified caller ב-main() כבר שולף points בכל מקרה)."""
    if not points:
        return None
    times = [p["time"] for p in points if p["time"] is not None]
    first_t = min(times).replace(microsecond=0).isoformat() if times else None
    sig = (
        len(points),
        first_t,
        round(points[0]["lat"], 5),
        round(points[0]["lon"], 5),
        round(points[-1]["lat"], 5),
        round(points[-1]["lon"], 5),
    )
    return "|".join(str(x) for x in sig)


def load_route_ids(support_data_dir: Path) -> dict:
    """מזהה קבוע ("id") לכל מסלול, נוסף 18.08.2026 - נשמר בקובץ route_ids.json
    נפרד (לא בתוך routes-catalog.json עצמו, כדי שהמיפוי ישרוד גם אם
    routes-catalog.json נבנה מחדש מאפס).

    תוקן 20.08.2026 - **המפתח הוא content_signature, לא שם קובץ**: במקור המפתח
    היה שם הקובץ, ושינוי שם בפועל נחשב "קובץ חדש" וקיבל מזהה חדש. זה התנגש
    ישירות עם rename_by_chronological_order.py (שינה שם ל-584/601 קבצים בבת
    אחת, ראו שם) - היה מבטל את היציבות של כמעט כל מזהה קיים. עם מפתח לפי תוכן,
    שינוי שם (בלי שינוי בנקודות עצמן) לא נוגע במזהה בכלל - יציב באמת, לא רק
    "יציב כל עוד לא משנים שם"."""
    path = support_data_dir / "route_ids.json"
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


def assign_route_ids(signatures, id_map: dict) -> dict:
    next_id = (max(id_map.values()) + 1) if id_map else 1
    for sig in sorted(s for s in signatures if s is not None):
        if sig not in id_map:
            id_map[sig] = next_id
            next_id += 1
    return id_map


def save_route_ids(id_map: dict, support_data_dir: Path):
    path = support_data_dir / "route_ids.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(id_map, f, ensure_ascii=False, indent=2, sort_keys=True)


# מטמון בין-הרצות לשלב הניתוח (נוסף 22.08.2026) - לפני זה כל הרצה ניתחה מחדש
# את כל קבצי ה-GPX, גם כשהשינוי היחיד היה הוספת קובץ אחד. המפתח לזיהוי "לא
# השתנה" הוא שם קובץ + גודל + מועד שינוי (mtime) - זול לבדוק (stat() בלבד,
# בלי לפתוח את הקובץ), ומספיק כדי לדעת בבטחון שהניתוח הקודם עדיין תקף. שומרים
# את הרשומה **כולל** "_coords" (לא רק את הגרסה הציבורית) כי generate_thumbnails()
# צריך אותו גם לרשומות שמגיעות מהמטמון (למשל אם התמונה הממוזערת נמחקה חיצונית).
def load_build_cache(support_data_dir: Path) -> dict:
    path = support_data_dir / "catalog_build_cache.json"
    if not path.exists():
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_build_cache(cache: dict, support_data_dir: Path):
    path = support_data_dir / "catalog_build_cache.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False)


def build_catalog_record(path: Path, info: dict, points: list, settlements_db, route_id: int):
    source = normalize_source_guess(info["source_guess"])  # "הקלטה" / "תכנון מסלול" / "לא ברור"
    is_planned = source == "תכנון מסלול"

    # ניקוי קפיצות GPS מבוסס על מהירות/הפרש-גובה **מרומזים מחותמות הזמן** בין
    # נקודות. במסלול מתוכנן (source == "תכנון מסלול") אין הקלטת GPS אמיתית
    # שיכולה להישבש/להיות מזויפת בכלל - וגם אם יש timestamps בקובץ (ראו
    # UNIFORM_TIMESTAMP_* ב-gpx_analyzer.py) הם מלאכותיים ולא משקפים זמן אמיתי
    # בין נקודות, כך שחישוב "מהירות" מהם חסר משמעות וגורם ל"לא תקין" שגוי (נצפה
    # בפועל: מהירות מרומזת של 1,343 קמ"ש בקובץ תכנון תקין לגמרי). לכן מדלגים
    # לגמרי על הניקוי ועל הדגל "לא תקין" למסלולים מתוכננים - נשמרות כל הנקודות
    # כמו שהן, נסמכים על הקואורדינטות הגולמיות בלבד.
    original_count = len(points)
    if is_planned:
        removed_count = 0
    else:
        points, removed_count = clean_track_points(points)

    coords = [(p["lat"], p["lon"]) for p in points]
    elevations = [p["ele"] for p in points]
    times = [p["time"] for p in points]

    date_obj, date_source = determine_display_date(path, times)
    settlements = find_nearby_settlement_names(coords, settlements_db)
    elevation_gain, elevation_loss = calc_elevation_gain_loss(elevations)

    # "לא תקין" - נצפה בפועל שקפיצת GPS יחידה (כמו לשדה תעופה בעמאן) יכולה
    # להימשך בין נקודה בודדת ל-99.8% מהקובץ. אם הוסר חלק גדול מדי, או נשארו
    # מעט מדי נקודות, כנראה שאין כאן בכלל מסלול אמיתי-ברובו לסמוך עליו.
    # לא רלוונטי למסלול מתוכנן (ראו למעלה) - שם הדגל תמיד False.
    if is_planned:
        invalid = False
    else:
        removed_ratio = (removed_count / original_count) if original_count else 0
        invalid = removed_ratio > INVALID_REMOVED_RATIO or len(points) < INVALID_MIN_POINTS

    return {
        "id": route_id,
        "file_name": path.name,
        "gpx_path": f"GPX_files/{path.name}",
        "date": date_obj.isoformat(),
        "date_source": date_source,
        "activity": info["activity_guess"],
        "source": source,
        "distance_km": calc_distance_km(coords),
        "elevation_gain_m": elevation_gain,
        "elevation_loss_m": elevation_loss,
        "point_count": len(points),
        # נקודות התחלה/סיום - נוספו 22.08.2026 כדי לאפשר בקטלוג.html חיפוש לפי
        # קורדינטות (לא היה קיים שום שדה קואורדינטה ברשומה עד כה).
        "start_lat": round(coords[0][0], 5) if coords else None,
        "start_lon": round(coords[0][1], 5) if coords else None,
        "end_lat": round(coords[-1][0], 5) if coords else None,
        "end_lon": round(coords[-1][1], 5) if coords else None,
        "regions": classify_route_regions(coords),
        "settlements": settlements,
        # True/False מפורש (לא רק הסתמכות על רשימה ריקה) - כדי שדף הקטלוג יוכל
        # להציג תגית ברורה ("מיקום לא זוהה") במקום עמודת ישובים ריקה לא-מוסברת.
        "settlements_found": bool(settlements),
        # מסלול "לא תקין" - ראו הסבר למעלה. גם אם לא תקין, עדיין מוצג בקטלוג
        # (עם הנתונים הנקיים שכן נשארו) - לא נמחק ולא מוסתר, רק מסומן ונדחק
        # לתחתית הרשימה בדף עצמו.
        "invalid": invalid,
        "removed_points": removed_count,
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

    # רשימת קבצים קיימים בבת-אחת (listdir בודד) במקום Path.exists() לכל רשומה
    # בנפרד (564 קריאות) - נמדד בפועל (22.08.2026) שזה היה השלב האיטי ביותר
    # בכל הסקריפט (148 מתוך 158 שניות סה"כ באותה הרצה!) אף על פי שכל רשומה
    # דילגה בלי לגעת ב-Playwright בכלל - כי כל קובץ נמצא בתיקייה שמסונכרנת עם
    # Google Drive, ושם ל-stat/exists בודד יש חביון גבוה משמעותית מדיסק מקומי.
    existing_thumbnails = {p.name for p in thumbnails_dir.glob("*.jpg")} if thumbnails_dir.exists() else set()

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

                thumb_name = path_stem_from_filename(record["file_name"]) + ".jpg"
                out_path = thumbnails_dir / thumb_name
                if thumb_name in existing_thumbnails and not force:
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

                # JPEG באיכות 80 במקום PNG - נבדק בפועל (16.08.2026): כ-80% קטן יותר על
                # תמונת מפה טיפוסית, בלי פגיעה נראית לעין (מפת טיילים אינה קווי-אמנות/טקסט
                # חד שדורש PNG חסר-אובדן - היא יותר "צילומית" בגלל הגוונים והמרקם).
                page.locator("#map").screenshot(path=str(out_path), type="jpeg", quality=80)
                record["thumbnail"] = f"thumbnails/{thumb_name}"

            browser.close()
    finally:
        server.shutdown()


def path_stem_from_filename(filename: str) -> str:
    return filename.rsplit(".", 1)[0]


def invalidate_thumbnails_for_cleaned_routes(records, thumbnails_dir: Path) -> int:
    """מוחק את התמונה הממוזערת הקיימת (אם יש) לכל מסלול שניקוי הקפיצות (17.08.2026)
    בפועל הסיר ממנו נקודות - כי generate_thumbnails מדלג על יצירת תמונה חדשה
    כשכבר קיים קובץ באותו שם (אופטימיזציה לריצות רגילות), ותמונה שנוצרה **לפני**
    הניקוי מציגה את קו הקפיצה הבלתי-אפשרי (למשל קו ישר עד עמאן) - צריך לצייר
    מחדש, לא לדלג. **חייב לרוץ לפני** generate_thumbnails - בשלב הזה עדיין
    r["thumbnail"] הוא None לכולם (generate_thumbnails הוא זה שממלא אותו), אז
    בונים את שם הקובץ הצפוי ישירות מ-file_name, לא מהשדה thumbnail."""
    if not thumbnails_dir.exists():
        return 0
    removed = 0
    for r in records:
        if r["removed_points"] <= 0:
            continue
        thumb_path = thumbnails_dir / (path_stem_from_filename(r["file_name"]) + ".jpg")
        if thumb_path.exists():
            thumb_path.unlink()
            removed += 1
    return removed


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
    # גם *.png: עד 16.08.2026 התמונות נוצרו כ-PNG - כל הקבצים הישנים בפורמט הזה
    # יתומים במובהק אחרי המעבר ל-JPEG (אף רשומה בקטלוג לא מצביעה יותר על .png).
    for img in list(thumbnails_dir.glob("*.jpg")) + list(thumbnails_dir.glob("*.png")):
        if img.name not in expected:
            img.unlink()
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

    t_start = time.time()
    print("שלב 1: קליטת קבצים חדשים (שינוי שם באמצעות הכלי הקיים)")
    rename_new_files()
    print(f"  (שלב 1 לקח {time.time() - t_start:.1f} שניות)")

    t_stage = time.time()
    print("\nשלב 2: טעינת מאגר היישובים")
    settlements_db = renamer.load_settlements(support_data_dir)
    print(f"  (שלב 2 לקח {time.time() - t_stage:.1f} שניות)")

    files = analyzer.list_gpx_files_top_level(gpx_dir)

    t_stage = time.time()
    print(f"\nשלב 3: ניתוח {len(files)} קבצי GPX (עם מטמון לקבצים שלא השתנו)")

    route_ids = load_route_ids(support_data_dir)
    build_cache = load_build_cache(support_data_dir)
    new_build_cache = {}
    records = []
    reused_count = 0
    freshly_analyzed_names = set()
    for i, path in enumerate(files, 1):
        stat = path.stat()
        cached = build_cache.get(path.name)
        if cached and cached.get("size") == stat.st_size and cached.get("mtime") == stat.st_mtime:
            records.append(cached["record"])
            new_build_cache[path.name] = cached
            reused_count += 1
            continue
        print(f"  [{i}/{len(files)}] {path.name}")
        info = analyzer.analyze_file(path)
        points = extract_track_points(path)
        sig = content_signature_from_points(points)
        if sig is not None and sig not in route_ids:
            route_ids = assign_route_ids([sig], route_ids)
        route_id = route_ids.get(sig, 0)  # 0 = קובץ בלי נקודות בכלל, לא אמור לקרות בפועל
        record = build_catalog_record(path, info, points, settlements_db, route_id)
        records.append(record)
        new_build_cache[path.name] = {"size": stat.st_size, "mtime": stat.st_mtime, "record": record}
        freshly_analyzed_names.add(path.name)
    save_route_ids(route_ids, support_data_dir)
    save_build_cache(new_build_cache, support_data_dir)
    print(f"  {reused_count}/{len(files)} קבצים ללא שינוי - נלקחו מהמטמון, לא נותחו מחדש")
    print(f"  (שלב 3 לקח {time.time() - t_stage:.1f} שניות)")
    t_stage = time.time()

    cleaned_count = sum(1 for r in records if r["removed_points"] > 0)
    if cleaned_count:
        print(f"\nניקוי קפיצות GPS: {cleaned_count} קבצים הכילו נקודות שהוסרו")
        # רק בין הקבצים שנותחו מחדש ממש עכשיו (לא נלקחו מהמטמון) - אחרת הפונקציה
        # הזו מוחקת ומייצרת מחדש את אותה תמונה בכל הרצה, לנצח, לכל קובץ עם ניקוי
        # קבוע (תכונה קבועה של הקובץ הגולמי, לא "תוקן עכשיו") - נמדד בפועל
        # (22.08.2026) שזה גרם ל-54 מסלולים "לתקוע" כ-8.5 שניות בכל הרצה, כי
        # ה-thumbnail תמיד נמחק מחדש לפני שהספיק בכלל להיבדק אם כבר קיים.
        freshly_cleaned = [r for r in records if r["removed_points"] > 0 and r["file_name"] in freshly_analyzed_names]
        if freshly_cleaned:
            stale = invalidate_thumbnails_for_cleaned_routes(freshly_cleaned, thumbnails_dir)
            if stale:
                print(f"  נמחקו {stale} תמונות ממוזערות ישנות (נוצרו לפני הניקוי, מציגות את הקפיצה)")

    if args.skip_thumbnails:
        print("\nשלב 4: דולג (--skip-thumbnails)")
    else:
        print(f"\nשלב 4: יצירת תמונות ממוזערות ({len(records)} מסלולים)" + (" - כפוי מחדש לכולם" if args.force_thumbnails else ""))
        generate_thumbnails(records, thumbnails_dir, scripts_dir, force=args.force_thumbnails)
        removed_orphans = cleanup_orphan_thumbnails(records, thumbnails_dir)
        if removed_orphans:
            print(f"  נמחקו {removed_orphans} תמונות ממוזערות יתומות (שם קובץ שכבר לא קיים בקטלוג)")
        print(f"  (שלב 4 לקח {time.time() - t_stage:.1f} שניות)")

    print(f"\nזמן כולל: {time.time() - t_start:.1f} שניות")

    no_elevation = sum(1 for r in records if r["elevation_gain_m"] is None)
    no_settlements = sum(1 for r in records if not r["settlements"])
    no_thumbnail = sum(1 for r in records if r["thumbnail"] is None)
    invalid_count = sum(1 for r in records if r["invalid"])

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

    from collections import Counter
    region_counts = Counter()
    for r in records:
        for reg in r["regions"]:
            region_counts[reg] += 1
    no_region = sum(1 for r in records if not r["regions"])

    print(f"\nהושלם. קובץ הקטלוג נשמר ב: {out_path}")
    print(f"  סה\"כ מסלולים: {len(records)}")
    print(f"  בלי נתוני גובה: {no_elevation}")
    print(f"  בלי ישוב קרוב שנמצא: {no_settlements}")
    print(f"  בלי תמונה ממוזערת: {no_thumbnail}")
    print(f"  מסומנים 'לא תקין' (קפיצת GPS משמעותית): {invalid_count}")
    print(f"  בלי אזור מזוהה (בלי נקודות בכלל): {no_region}")
    print("  פילוח לפי אזור (מסלול שחוצה כמה אזורים נספר בכל אחד מהם):")
    for reg in REGION_ORDER:
        print(f"    {reg}: {region_counts[reg]}")


if __name__ == "__main__":
    main()
