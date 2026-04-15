#!/usr/bin/env python3
"""
update_nii_values.py
--------------------
מעדכן ערכים hardcoded ב-HTML בהתבסס על nii-constants.json.

מחפש תבניות מסוג:
    <span data-nii="KEY">OLD_VALUE</span>

ומחליף OLD_VALUE בערך העדכני מה-JSON.

שימוש:
    python update_nii_values.py [--dry-run]
"""

import io
import json
import re
import sys
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
JSON_PATH = REPO_ROOT / "BTL" / "senior_rights" / "data" / "nii-constants.json"
HTML_DIRS = [REPO_ROOT / "BTL" / "senior_rights"]

DRY_RUN = "--dry-run" in sys.argv


def format_value(raw_value, key_type):
    """Returns the value as it should appear in HTML."""
    if key_type in ("currency", "euro"):
        # Integers → "1,838", floats → "71.83" (no thousands sep for small floats)
        if isinstance(raw_value, float) and raw_value != int(raw_value):
            return f"{raw_value:,.2f}".rstrip("0").rstrip(".")
        return f"{int(raw_value):,}"
    return str(raw_value)


def build_replacements(constants):
    """בונה מילון של key -> ערך מפורמט."""
    replacements = {}
    for key, data in constants.items():
        if key.startswith("_"):
            continue
        if not isinstance(data, dict) or "value" not in data:
            continue
        key_type = data.get("type", "currency")
        replacements[key] = format_value(data["value"], key_type)
    return replacements


def update_file(html_path, replacements):
    """מעדכן קובץ HTML בודד. מחזיר רשימת שינויים."""
    text = html_path.read_text(encoding="utf-8")
    changes = []

    def replace_span(m):
        key = m.group(1)
        old_val = m.group(2)
        new_val = replacements.get(key)
        if new_val is None or new_val == old_val:
            return m.group(0)  # אין שינוי
        changes.append((key, old_val, new_val))
        return f'<span data-nii="{key}">{new_val}</span>'

    pattern = re.compile(r'<span data-nii="([^"]+)">([^<]*)</span>')
    new_text = pattern.sub(replace_span, text)

    if changes and not DRY_RUN:
        html_path.write_text(new_text, encoding="utf-8")

    return changes


def main():
    if not JSON_PATH.exists():
        print(f"שגיאה: לא נמצא {JSON_PATH}", file=sys.stderr)
        sys.exit(1)

    with JSON_PATH.open(encoding="utf-8") as f:
        constants = json.load(f)

    replacements = build_replacements(constants)
    print(f"נטענו {len(replacements)} קבועים מ-{JSON_PATH.name}")
    if DRY_RUN:
        print("*** מצב DRY-RUN — לא נכתב שום קובץ ***\n")

    html_files = []
    for d in HTML_DIRS:
        html_files.extend(d.rglob("*.html"))

    total_changes = 0
    for html_path in sorted(html_files):
        changes = update_file(html_path, replacements)
        if changes:
            rel = html_path.relative_to(REPO_ROOT)
            print(f"\n{rel}  ({len(changes)} שינויים)")
            for key, old, new in changes:
                print(f"    {key}: {old} → {new}")
            total_changes += len(changes)

    print(f"\nסה\"כ: {total_changes} ערכים {'יעודכנו' if not DRY_RUN else 'יתעדכנו (dry-run)'}.")


if __name__ == "__main__":
    main()
