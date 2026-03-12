import json
from pathlib import Path

SRC = Path(r"g:\My Drive\התנדבות\אתרים\yair-main\BTL\senior_rights\intake_questions.json")
OUT = Path(r"g:\My Drive\התנדבות\אתרים\yair-main\BTL\senior_rights\intake_questions_export.txt")


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    lines = []
    for sec in data.get("sections", []):
        title = (sec.get("title") or "").strip()
        if title:
            lines.append(f"=== {title} ===")
        for q in sec.get("questions", []):
            text = (q.get("text") or "").strip()
            if text:
                lines.append(f"- {text}")
            sub = q.get("subQuestion")
            if sub and sub.get("text"):
                lines.append(f"  * {sub.get('text').strip()}")
        lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(str(OUT))


if __name__ == "__main__":
    main()
