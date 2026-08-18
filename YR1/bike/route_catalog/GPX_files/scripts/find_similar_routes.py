#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
find_similar_routes.py
=======================
מזהה מסלולים חופפים/כפולים בקטלוג לפי גאומטריה בפועל (לא לפי שם קובץ) - סקריפט
ניתוח עצמאי להרצה ידנית, לא חלק מ-pipeline הבנייה הרגיל (build_routes_catalog.py)
ולא נוגע בקובץ הקטלוג. משתמש חוזר ב-extract_track_points/clean_track_points
מתוך build_routes_catalog.py (כולל תיקון "עוגן מורעל") ובקבועי renamer -
לא ממציא לוגיקת קריאת/ניקוי GPX חדשה.

רקע/החלטות (סוכם עם המשתמש, 18.08.2026):

  קריטריון "זהה" (שני מסלולים הם אותו מסלול פיזי):
    - התחלה וסיום קרובים בין שני המסלולים (עד סף, ראו SAME_ENDPOINT_*)
    - הפרש אורך כולל עד 3%
    - לפחות SAME_SAMPLE_PASS_RATIO (90%) מדגימות כל 200 מ' לאורך המסלול הקצר
      נמצאות בטווח סביר מהנקודה **הקרובה ביותר** על פני כל המסלול השני - לא
      לפי אינדקס מקביל/זמן, כי סטייה מקומית קטנה (עיקוף, עצירה) הייתה מזיזה
      את כל ההתאמות אחריה ומייצרת פערים מדומים לאורך שאר המסלול.

  קריטריון "שונה":
    - התחלה או סיום רחוקים מדי, או הפרש אורך מעל 5%, או ממוצע הדגימות חורג.

  כל מה שביניהם -> "חשוד - לבדיקה ידנית" (לא בינארי, כדי לא לפספס/להטעות).

  ספים יחסיים לאורך: לא רק מטרים קבועים - סף = max(מטרים קבועים, אחוז מהאורך),
  כדי שמסלול קצר (הליכה של 2 ק"מ) לא "ייענש" יותר ממסלול ארוך (רכיבה של
  100 ק"מ) על אותה סטייה במטרים.

  נבדק גם כיוון הפוך (התחלה של A מול סיום של B ולהפך) - מסלול הלוך-חזור/הפוך
  על אותו נתיב הוא עדיין "אותו מסלול".

  "הכלה" - קטגוריה נוספת: מסלול קצר משמעותית שכל דגימותיו נמצאות קרוב לנתיב
  של מסלול ארוך ממנו (בכל מיקום לאורכו, לא רק מההתחלה) - למשל מסלול שהוא
  קטע-פתיחה מדויק של מסלול ארוך יותר. לא נבדק לפי התחלה/סיום בכלל.

  סינון מקדים: רק בין מסלולים מאותה פעילות (activity), לא כולל מסלולים
  שמסומנים invalid=true, ורק בין מסלולים שחולקים לפחות אזור גאוגרפי אחד
  (regions) - כדי לצמצם באופן זול את מרחב הזוגות לפני החישוב היקר.

הרצה: python find_similar_routes.py
פלט: מודפס למסך + נשמר כ-CSV תחת support_data/similar_routes_report.csv
"""

import csv
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import gpx_analyzer as analyzer          # noqa: E402
import build_routes_catalog as builder   # noqa: E402
import gpx_meaningful_rename as renamer  # noqa: E402

import json

CATALOG_PATH = Path(r"G:\My Drive\התנדבות\אתרים\yair-main\YR1\bike\route_catalog\data\routes-catalog.json")
REPORT_PATH = Path(__file__).resolve().parent / "support_data" / "similar_routes_report.csv"

# ---------- ספי "זהה" ----------
SAME_LENGTH_DIFF_PCT = 3.0
SAME_ENDPOINT_ABS_M = 50.0
SAME_ENDPOINT_REL = 0.005      # 0.5% מהאורך
SAME_SAMPLE_ABS_M = 100.0
SAME_SAMPLE_REL = 0.01         # 1% מהאורך
SAME_SAMPLE_PASS_RATIO = 0.9   # לפחות 90% מהדגימות בטווח

# ---------- ספי "שונה" ----------
DIFF_LENGTH_DIFF_PCT = 5.0
DIFF_ENDPOINT_ABS_M = 1000.0
DIFF_ENDPOINT_REL = 0.05       # 5% מהאורך
DIFF_SAMPLE_ABS_M = 300.0
DIFF_SAMPLE_REL = 0.03         # 3% מהאורך

# ---------- הכלה ----------
CONTAINMENT_MAX_LEN_RATIO = 0.9    # הקצר חייב להיות מתחת ל-90% מאורך הארוך
CONTAINMENT_SAMPLE_PASS_RATIO = 0.9
CONTAINMENT_QUICK_CHECK_M = 500.0  # סינון מקדים זול: נקודת התחלה של הקצר חייבת
                                    # להיות קרובה למסלול הארוך במידה סבירה

SAMPLE_INTERVAL_M = 200.0
DENSE_INTERVAL_M = 50.0


def haversine_m(lat1, lon1, lat2, lon2):
    return renamer.haversine_km(lat1, lon1, lat2, lon2) * 1000.0


def cumulative_distances_m(coords):
    cum = [0.0]
    for i in range(1, len(coords)):
        cum.append(cum[-1] + haversine_m(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1]))
    return cum


def resample_by_distance(coords, cum, interval_m):
    """מדגם את המסלול לפי מרחק מצטבר (לא לפי אינדקס/זמן גולמי) - נקודה כל
    interval_m מטרים בדיוק, באינטרפולציה לינארית בין שתי הנקודות הגולמיות
    שמקיפות אותה."""
    total = cum[-1]
    if total <= 0:
        return [coords[0]]
    targets = []
    d = 0.0
    while d < total:
        targets.append(d)
        d += interval_m
    targets.append(total)

    result = []
    j = 0
    n = len(coords)
    for t in targets:
        while j < n - 2 and cum[j + 1] < t:
            j += 1
        d0, d1 = cum[j], cum[j + 1]
        if d1 <= d0:
            result.append(coords[j])
        else:
            frac = max(0.0, min(1.0, (t - d0) / (d1 - d0)))
            lat = coords[j][0] + frac * (coords[j + 1][0] - coords[j][0])
            lon = coords[j][1] + frac * (coords[j + 1][1] - coords[j][1])
            result.append((lat, lon))
    return result


def nearest_point_distance_m(pt, dense_points):
    """המרחק (מ') מ-pt לנקודה הקרובה ביותר מתוך dense_points - חיפוש גס, לא
    היטל על קטע (segment projection) - קירוב סביר בהתחשב ברזולוציית הדגימה
    הצפופה (DENSE_INTERVAL_M)."""
    best = None
    lat0, lon0 = pt
    for lat1, lon1 in dense_points:
        d = haversine_m(lat0, lon0, lat1, lon1)
        if best is None or d < best:
            best = d
    return best


def threshold(abs_m, rel_frac, length_m):
    return max(abs_m, rel_frac * length_m)


def load_catalog():
    with open(CATALOG_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return data["routes"] if isinstance(data, dict) else data


def precompute(routes_meta, gpx_dir):
    """מחשב פעם אחת לכל מסלול: נקודות נקיות, אורך מצטבר, דגימות כל 200מ',
    ודגימות צפופות כל 50מ' (למניעת פענוח/ניקוי GPX חוזר בכל זוג)."""
    data = {}
    skipped = 0
    for i, r in enumerate(routes_meta, 1):
        if r.get("invalid"):
            continue
        path = gpx_dir / r["file_name"]
        if not path.exists():
            skipped += 1
            continue
        raw_points = builder.extract_track_points(path)
        cleaned, _ = builder.clean_track_points(raw_points)
        coords = [(p["lat"], p["lon"]) for p in cleaned]
        if len(coords) < 5:
            skipped += 1
            continue
        cum = cumulative_distances_m(coords)
        total_len_m = cum[-1]
        if total_len_m < 100:
            skipped += 1
            continue
        data[r["file_name"]] = {
            "meta": r,
            "total_len_m": total_len_m,
            "start": coords[0],
            "end": coords[-1],
            "samples_200": resample_by_distance(coords, cum, SAMPLE_INTERVAL_M),
            "dense_50": resample_by_distance(coords, cum, DENSE_INTERVAL_M),
        }
        if i % 100 == 0:
            print(f"  [{i}/{len(routes_meta)}] עובדו...")
    print(f"מוכנים {len(data)} מסלולים לניתוח ({skipped} דולגו - invalid/קובץ חסר/קצר מדי)")
    return data


def sample_deviation_stats(samples, dense_target):
    devs = [nearest_point_distance_m(p, dense_target) for p in samples]
    mean_dev = sum(devs) / len(devs)
    max_dev = max(devs)
    return mean_dev, max_dev, devs


def check_containment(short_key, long_key, data):
    s, l = data[short_key], data[long_key]
    if s["total_len_m"] / l["total_len_m"] > CONTAINMENT_MAX_LEN_RATIO:
        return None
    # סינון מקדים זול: נק' ההתחלה של הקצר צריכה להיות קרובה-יחסית לנתיב הארוך
    # (לפי דגימה גסה של הארוך), לפני שמריצים את הבדיקה המלאה היקרה.
    quick = nearest_point_distance_m(s["start"], l["dense_50"][::max(1, len(l["dense_50"]) // 40)])
    if quick > CONTAINMENT_QUICK_CHECK_M * 3:
        return None
    pass_thr = threshold(SAME_SAMPLE_ABS_M, SAME_SAMPLE_REL, s["total_len_m"])
    mean_dev, max_dev, devs = sample_deviation_stats(s["samples_200"], l["dense_50"])
    pass_ratio = sum(1 for d in devs if d <= pass_thr) / len(devs)
    if pass_ratio >= CONTAINMENT_SAMPLE_PASS_RATIO:
        return {"pass_ratio": round(pass_ratio, 3), "mean_dev_m": round(mean_dev, 1), "max_dev_m": round(max_dev, 1)}
    return None


def check_same_or_different(key_a, key_b, data):
    a, b = data[key_a], data[key_b]
    len_a, len_b = a["total_len_m"], b["total_len_m"]
    length_diff_pct = abs(len_a - len_b) / max(len_a, len_b) * 100
    avg_len = (len_a + len_b) / 2

    d_start_start = haversine_m(*a["start"], *b["start"])
    d_end_end = haversine_m(*a["end"], *b["end"])
    d_start_end = haversine_m(*a["start"], *b["end"])
    d_end_start = haversine_m(*a["end"], *b["start"])

    forward_max = max(d_start_start, d_end_end)
    reversed_max = max(d_start_end, d_end_start)
    if reversed_max < forward_max:
        reversed_dir = True
        ep1, ep2 = d_start_end, d_end_start
    else:
        reversed_dir = False
        ep1, ep2 = d_start_start, d_end_end

    same_ep_thr = threshold(SAME_ENDPOINT_ABS_M, SAME_ENDPOINT_REL, avg_len)
    diff_ep_thr = threshold(DIFF_ENDPOINT_ABS_M, DIFF_ENDPOINT_REL, avg_len)
    endpoint_same_ok = ep1 <= same_ep_thr and ep2 <= same_ep_thr
    endpoint_diff = ep1 > diff_ep_thr or ep2 > diff_ep_thr

    # רק אם יש סיכוי סביר (לא ברור-שונה) ממשיכים לבדיקת הדגימות היקרה
    if endpoint_diff and length_diff_pct > DIFF_LENGTH_DIFF_PCT:
        return {
            "verdict": "שונה", "reversed": reversed_dir, "length_diff_pct": round(length_diff_pct, 1),
            "endpoint1_m": round(ep1, 1), "endpoint2_m": round(ep2, 1),
            "mean_dev_m": None, "max_dev_m": None, "pass_ratio": None,
        }

    shorter_samples = a["samples_200"] if len_a <= len_b else b["samples_200"]
    longer_dense = b["dense_50"] if len_a <= len_b else a["dense_50"]
    same_sample_thr = threshold(SAME_SAMPLE_ABS_M, SAME_SAMPLE_REL, avg_len)
    diff_sample_thr = threshold(DIFF_SAMPLE_ABS_M, DIFF_SAMPLE_REL, avg_len)
    mean_dev, max_dev, devs = sample_deviation_stats(shorter_samples, longer_dense)
    pass_ratio = sum(1 for d in devs if d <= same_sample_thr) / len(devs)

    is_same = (length_diff_pct <= SAME_LENGTH_DIFF_PCT and endpoint_same_ok
               and pass_ratio >= SAME_SAMPLE_PASS_RATIO)
    is_diff = (length_diff_pct > DIFF_LENGTH_DIFF_PCT or endpoint_diff
               or mean_dev > diff_sample_thr)

    verdict = "זהה" if is_same else ("שונה" if is_diff else "חשוד - לבדיקה ידנית")

    return {
        "verdict": verdict, "reversed": reversed_dir, "length_diff_pct": round(length_diff_pct, 1),
        "endpoint1_m": round(ep1, 1), "endpoint2_m": round(ep2, 1),
        "mean_dev_m": round(mean_dev, 1), "max_dev_m": round(max_dev, 1), "pass_ratio": round(pass_ratio, 3),
    }


def main():
    t0 = time.time()
    gpx_dir = analyzer.get_gpx_dir()
    routes_meta = load_catalog()
    print(f"נטענו {len(routes_meta)} מסלולים מהקטלוג")

    print("\nשלב 1: קריאה+ניקוי GPX וחישוב דגימות לכל מסלול (פעם אחת)")
    data = precompute(routes_meta, gpx_dir)

    keys = list(data.keys())
    # אינדקס הפוך לפי (activity, region בודד) - כל מסלול נכנס לכמה קבוצות (אחת
    # לכל אזור שהוא חוצה), וזוג מסלולים שחולק **כל** אזור משותף אחד ייבדק -
    # לא "קיבוץ" בלעדי שעלול לפספס זוג שמתחבר רק דרך אזור שלישי (transitively).
    from collections import defaultdict
    region_index = defaultdict(list)
    for k in keys:
        m = data[k]["meta"]
        act = m.get("activity")
        for reg in (m.get("regions") or [None]):
            region_index[(act, reg)].append(k)

    candidate_pairs = set()
    for members in region_index.values():
        n = len(members)
        for i in range(n):
            for j in range(i + 1, n):
                candidate_pairs.add(tuple(sorted((members[i], members[j]))))

    total_pairs_considered = 0
    same_results = []
    contain_results = []
    suspect_results = []

    print(f"\nשלב 2: השוואת {len(candidate_pairs)} זוגות מועמדים (פעילות+אזור משותף)")
    for ka, kb in candidate_pairs:
        total_pairs_considered += 1
        res = check_same_or_different(ka, kb, data)
        if res["verdict"] == "זהה":
            same_results.append((ka, kb, res))
        elif res["verdict"] == "חשוד - לבדיקה ידנית":
            suspect_results.append((ka, kb, res))
        elif res["length_diff_pct"] > SAME_LENGTH_DIFF_PCT:
            # לא "זהה"/"חשוד" - בודקים גם הכלה (לא תלוי בהתחלה/סיום)
            len_a, len_b = data[ka]["total_len_m"], data[kb]["total_len_m"]
            short_key, long_key = (ka, kb) if len_a <= len_b else (kb, ka)
            c = check_containment(short_key, long_key, data)
            if c:
                contain_results.append((short_key, long_key, c))
        if total_pairs_considered % 2000 == 0:
            print(f"  ...{total_pairs_considered}/{len(candidate_pairs)} זוגות נבדקו")

    elapsed = time.time() - t0
    print(f"\nהושלם ב-{elapsed:.1f} שניות. נבדקו {total_pairs_considered} זוגות מועמדים.")
    print(f"  זהה: {len(same_results)}")
    print(f"  חשוד - לבדיקה ידנית: {len(suspect_results)}")
    print(f"  הכלה (מסלול קצר בתוך ארוך): {len(contain_results)}")

    def route_id(key):
        return data[key]["meta"].get("id", "")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_PATH, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["קטגוריה", "מזהה א'", "קובץ א'", "מזהה ב'", "קובץ ב'", "verdict/יחס", "הפוך?",
                          "הפרש אורך %", "מרחק-קצה 1 (מ')", "מרחק-קצה 2 (מ')",
                          "סטיית-דגימה ממוצעת (מ')", "סטיית-דגימה מקס' (מ')", "אחוז-מעבר"])
        for ka, kb, res in same_results:
            writer.writerow(["זהה", route_id(ka), ka, route_id(kb), kb, res["verdict"], res["reversed"], res["length_diff_pct"],
                              res["endpoint1_m"], res["endpoint2_m"], res["mean_dev_m"], res["max_dev_m"], res["pass_ratio"]])
        for ka, kb, res in suspect_results:
            writer.writerow(["חשוד", route_id(ka), ka, route_id(kb), kb, res["verdict"], res["reversed"], res["length_diff_pct"],
                              res["endpoint1_m"], res["endpoint2_m"], res["mean_dev_m"], res["max_dev_m"], res["pass_ratio"]])
        for short_k, long_k, c in contain_results:
            writer.writerow(["הכלה", route_id(short_k), short_k, route_id(long_k), long_k, "מוכל-ב", "", "", "", "",
                              c["mean_dev_m"], c["max_dev_m"], c["pass_ratio"]])
    print(f"\nדוח מלא נשמר ב: {REPORT_PATH}")

    def show(title, rows, limit=15):
        print(f"\n{'=' * 60}\n{title} (מציג עד {limit} מתוך {len(rows)})\n{'=' * 60}")
        for row in rows[:limit]:
            print(" | ".join(str(x) for x in row))

    show("זהה", [(ka, kb, res["reversed"], res["length_diff_pct"], res["pass_ratio"]) for ka, kb, res in same_results])
    show("חשוד - לבדיקה ידנית", [(ka, kb, res["length_diff_pct"], res["pass_ratio"]) for ka, kb, res in suspect_results])
    show("הכלה", [(short_k, long_k, c["pass_ratio"]) for short_k, long_k, c in contain_results])


if __name__ == "__main__":
    main()
