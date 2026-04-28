import sys, io, os, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, 'C:/Users/yairr/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0/LocalCache/local-packages/Python313/site-packages')

import fitz
from collections import Counter

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
OUT_DIR = os.path.join(DATA_DIR, 'bookmarked')
os.makedirs(OUT_DIR, exist_ok=True)

MAX_LEVELS = 3   # keep only 3 levels deep
MIN_LEN    = 4   # minimum chars to be a heading
MAX_OCCUR  = 15  # if a text appears this many times it's probably a table cell


def extract_headings(pdf_path):
    doc = fitz.open(pdf_path)
    spans_data = []
    for page_num, page in enumerate(doc, start=1):
        blocks = page.get_text('dict')['blocks']
        for block in blocks:
            if block['type'] != 0:
                continue
            for line in block['lines']:
                for span in line['spans']:
                    text = span['text'].strip()
                    if not text:
                        continue
                    size = round(span['size'], 1)
                    bold = bool(span.get('flags', 0) & 16)
                    spans_data.append({'size': size, 'bold': bold, 'text': text, 'page': page_num})

    bold_sizes = sorted({s['size'] for s in spans_data if s['bold']}, reverse=True)
    if not bold_sizes:
        print(f"  אין bold ב-{os.path.basename(pdf_path)}, מדלג.")
        doc.close()
        return []

    size_to_level = {sz: i + 1 for i, sz in enumerate(bold_sizes)}

    # Count text occurrences to filter table-cell noise
    text_counts = Counter(s['text'] for s in spans_data if s['bold'])

    candidates = []
    for s in spans_data:
        if not s['bold']:
            continue
        text = s['text']
        if len(text) < MIN_LEN:
            continue
        if re.fullmatch(r'[\d\s\.\-\(\)]+', text):   # pure numbers/punctuation
            continue
        if text_counts[text] > MAX_OCCUR:              # too frequent → table cell
            continue
        lv = size_to_level[s['size']]
        candidates.append((lv, text, s['page']))

    if not candidates:
        doc.close()
        return []

    # Find top_level = first level appearing >= 2 times
    level_counts = Counter(lv for lv, _, _ in candidates)
    top_level = next((lv for lv in sorted(level_counts) if level_counts[lv] >= 2), 1)

    # Keep only from top_level down, cap at MAX_LEVELS deep
    filtered = [
        (lv - top_level + 1, txt, pg)
        for lv, txt, pg in candidates
        if top_level <= lv <= top_level + MAX_LEVELS - 1
    ]

    # Fix hierarchy: never jump more than 1 level at a time
    result = []
    for lv, txt, pg in filtered:
        if result:
            prev_lv = result[-1][0]
            lv = min(lv, prev_lv + 1)
        else:
            lv = 1
        result.append((lv, txt, pg))

    doc.close()
    return result


def add_bookmarks(pdf_path, out_path, headings):
    doc = fitz.open(pdf_path)
    toc = [[lv, txt, pg] for lv, txt, pg in headings]
    doc.set_toc(toc)
    doc.save(out_path)
    doc.close()


pdf_files = [f for f in os.listdir(DATA_DIR) if f.lower().endswith('.pdf')]

for filename in sorted(pdf_files):
    src = os.path.join(DATA_DIR, filename)
    dst = os.path.join(OUT_DIR, filename)
    print(f"\n--- {filename} ---")
    headings = extract_headings(src)
    if not headings:
        continue
    print(f"  {len(headings)} כותרות:")
    for lv, txt, pg in headings:
        print(f"    {'  ' * (lv - 1)}[{lv}] עמ'{pg}: {txt[:70]}")
    add_bookmarks(src, dst, headings)
    print(f"  => נשמר: bookmarked/{filename}")

print("\nסיום.")
