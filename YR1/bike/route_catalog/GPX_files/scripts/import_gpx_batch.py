#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
import_gpx_batch.py
====================
מייבא לתוך GPX_files/ קבצי GPX חדשים מתיקיית מקור חיצונית (למשל ייצוא מלא
מאפליקציית מעקב) - בשני צעדים:

  1. **זיהוי כפילויות לפי תוכן, לא לפי שם קובץ** - שם קובץ בתיקיית המקור
     לרוב שונה לגמרי משם הקובץ אחרי שהוא כבר עבר בעבר דרך `build_routes_catalog.py`
     (שינוי שם + ניקוי), אז השוואת שמות לא הייתה מזהה כפילויות אמיתיות. במקום זה,
     חתימה מבוססת-תוכן (מספר נקודות + חותמת זמן ראשונה + קואורדינטות התחלה/סיום,
     מעוגלות) - קובץ עם חתימה שכבר קיימת ב-GPX_files מדולג.
  2. **ניקוי extensions מיותרים בהעתקה** - קבצים מאפליקציות מעקב כוללים לרוב
     תגיות <extensions> עם דופק/קצב/מטא-דאטה נוספים בכל נקודה, וגם הצהרות סכמה
     ארוכות ב-XML - אף אחד מהם לא נקרא בשום מקום בצנרת שלנו (`extract_track_points`
     שולף רק lat/lon/ele/time). ניקוי הם מצמצם את גודל הקובץ בכ-60-70% בממוצע
     (נבדק בפועל, 16.08.2026) בלי לאבד שום דבר שבשימוש. **הקובץ המקורי בתיקיית
     המקור לא נוגעים בו בכלל** - הניקוי קורה רק בעותק שנכתב ל-GPX_files.

קבצים ללא אף נקודת מסלול (למשל אימוני שחייה/חדר-כושר שיוצאו בטעות יחד עם
המסלולים האמיתיים - יש להם רק <trk><name>/<type> בלי שום <trkpt>) מדולגים
בשקט, לא מועתקים בכלל - אין להם מה להציג בקטלוג מסלולים.

**לא מריץ בעצמו את `build_routes_catalog.py`** - אחרי הייבוא יש להריץ אותו
בנפרד (שינוי שם, ניתוח, תמונות ממוזערות) בדיוק כמו לכל קובץ חדש אחר.

הרצה (מתוך תיקיית scripts):
    python import_gpx_batch.py "<נתיב לתיקיית המקור>"
    python import_gpx_batch.py "<נתיב>" --dry-run   # רק מציג מה ייכנס, בלי להעתיק
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_routes_catalog as bc  # noqa: E402


def signature(path: Path):
    """חתימת תוכן להשוואת כפילויות. **חשוב:** חותמת הזמן מעוגלת לשנייה השלמה
    (`microsecond=0`) - לא מדויקת עד המיקרו-שנייה - כי נמצא בפועל (17.08.2026)
    זוג קבצים שהם אותה הקלטה בדיוק, אחד יוצא עם דיוק מיקרו-שנייה ("03:23:41.057")
    והשני בלי ("03:23:41") - השוואת מחרוזת isoformat מלאה לא זיהתה אותם ככפילות
    בגלל זה, למרות שכל שאר הנתונים (מספר נקודות, קואורדינטות התחלה/אמצע/סיום)
    זהים לחלוטין."""
    points = bc.extract_track_points(path)
    if not points:
        return None
    times = [p["time"] for p in points if p["time"] is not None]
    first_t = min(times).replace(microsecond=0).isoformat() if times else None
    return (
        len(points),
        first_t,
        round(points[0]["lat"], 5),
        round(points[0]["lon"], 5),
        round(points[-1]["lat"], 5),
        round(points[-1]["lon"], 5),
    )


def strip_gpx_text(points) -> str:
    """בונה טקסט GPX נקי: רק trk/trkseg/trkpt עם lat/lon/ele/time - בלי extensions
    ובלי הצהרות סכמה. ראו הסבר מלא בראש הקובץ."""
    lines = ['<?xml version="1.0" encoding="utf-8"?>', "<gpx version=\"1.1\"><trk><trkseg>"]
    for p in points:
        inner = ""
        if p["ele"] is not None:
            inner += f'<ele>{p["ele"]}</ele>'
        if p["time"] is not None:
            inner += f'<time>{p["time"].strftime("%Y-%m-%dT%H:%M:%SZ")}</time>'
        lines.append(f'<trkpt lat="{p["lat"]}" lon="{p["lon"]}">{inner}</trkpt>')
    lines.append("</trkseg></trk></gpx>")
    return "\n".join(lines)


def unique_dest_path(folder: Path, filename: str) -> Path:
    candidate = folder / filename
    if not candidate.exists():
        return candidate
    stem, suffix = filename.rsplit(".", 1)
    counter = 1
    while True:
        candidate = folder / f"{stem}_{counter}.{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def main():
    parser = argparse.ArgumentParser(description="מייבא קבצי GPX חדשים מתיקיית מקור חיצונית ל-GPX_files, עם ניקוי extensions וזיהוי כפילויות לפי תוכן")
    parser.add_argument("source", help="נתיב לתיקיית המקור")
    parser.add_argument("--dry-run", action="store_true", help="רק מציג מה ייכנס, בלי להעתיק בפועל")
    args = parser.parse_args()

    source_dir = Path(args.source)
    if not source_dir.is_dir():
        raise SystemExit(f"התיקייה לא נמצאה: {source_dir}")

    gpx_dir = bc.get_gpx_dir()

    print("טוען חתימות של קבצים קיימים...")
    existing_sigs = set()
    for p in gpx_dir.iterdir():
        if p.suffix.lower() == ".gpx":
            sig = signature(p)
            if sig:
                existing_sigs.add(sig)
    print(f"  {len(existing_sigs)} קבצים קיימים עם חתימה תקינה\n")

    source_files = sorted(p for p in source_dir.iterdir() if p.suffix.lower() == ".gpx")
    print(f"נמצאו {len(source_files)} קבצי GPX במקור\n")

    copied = 0
    skipped_dupe = 0
    skipped_empty = 0
    orig_bytes = 0
    new_bytes = 0

    for path in source_files:
        points = bc.extract_track_points(path)
        if not points:
            skipped_empty += 1
            continue

        sig = signature(path)
        if sig in existing_sigs:
            skipped_dupe += 1
            continue

        dest = unique_dest_path(gpx_dir, path.name)
        orig_bytes += path.stat().st_size

        if args.dry_run:
            print(f"  [ייכנס] {path.name} -> {dest.name}")
        else:
            text = strip_gpx_text(points)
            dest.write_text(text, encoding="utf-8")
            new_bytes += len(text.encode("utf-8"))

        existing_sigs.add(sig)  # מונע כפילות כפולה בתוך אותה הרצה
        copied += 1

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}סיכום:")
    print(f"  {'ייכנסו' if args.dry_run else 'הועתקו ונוקו'}: {copied}")
    print(f"  דולגו (כפילות תוכן מול קבצים קיימים): {skipped_dupe}")
    print(f"  דולגו (אין בהם אף נקודת מסלול): {skipped_empty}")
    if not args.dry_run and copied:
        print(f"  גודל מקורי: {orig_bytes/1024/1024:.1f}MB -> אחרי ניקוי: {new_bytes/1024/1024:.1f}MB "
              f"({100*(1-new_bytes/orig_bytes):.0f}% צמצום)")
    print("\nכעת יש להריץ python build_routes_catalog.py כדי לשנות שם/לנתח/ליצור תמונות ממוזערות לקבצים החדשים.")


if __name__ == "__main__":
    main()
