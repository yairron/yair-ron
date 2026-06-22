import os
import json
from bs4 import BeautifulSoup

# הגדרת נתיבים
SOURCE_DIR = "./BTL"          # תיקיית המקור הראשית עם כל תיקיות המשנה
OUTPUT_DIR = "./BTL_CLEANED"  # תיקיית היעד לקבצים הנקיים

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def clean_html(content):
    soup = BeautifulSoup(content, 'html.parser')
    for script in soup(["script", "style"]):
        script.extract()
    return soup.get_text()

def clean_json(content):
    try:
        data = json.loads(content)
        def extract_values(obj):
            texts = []
            if isinstance(obj, dict):
                for k, v in obj.items():
                    texts.extend(extract_values(v))
            elif isinstance(obj, list):
                for item in obj:
                    texts.extend(extract_values(item))
            elif isinstance(obj, (str, int, float)):
                texts.append(str(obj))
            return texts
        return "\n".join(extract_values(data))
    except Exception:
        return content

def clean_js(content):
    extracted = []
    double_quote = chr(34) # "
    single_quote = chr(39) # '
    backtick = chr(96)     # `
    quotes = [double_quote, single_quote, backtick]
    
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith("//") or line.startswith("*"):
            continue
        for quote in quotes:
            parts = line.split(quote)
            if len(parts) > 2:
                for i in range(1, len(parts), 2):
                    if any(c.isalpha() for c in parts[i]):
                        extracted.append(parts[i])
    if extracted:
        return "\n".join(extracted)
    return content

print("מתחיל בסריקה חכמה וחלץ טקסט מכל הפורמטים...")

count = 0
for root, dirs, files in os.walk(SOURCE_DIR):
    # דילוג על תיקיות קוד ומערכת
    dirs[:] = [d for d in dirs if not d.startswith('.') and d.lower() != 'node_modules']
    
    for file in files:
        if file.startswith('.') or file.lower().endswith('.lnk') or file.lower().endswith('.url'):
            continue
            
        file_path = os.path.join(root, file)
        
        try:
            if '.' not in file:
                continue
            ext = file.split('.')[-1].lower()
            clean_text = ""
            
            # 1. טיפול בקבצי טקסט וקוד
            if ext in ['html', 'htm', 'md', 'txt', 'json', 'js']:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                if ext in ['html', 'htm']:
                    clean_text = clean_html(content)
                elif ext == 'json':
                    clean_text = clean_json(content)
                elif ext == 'js':
                    clean_text = clean_js(content)
                else: 
                    clean_text = content
                    
            # 2. טיפול משודרג וחסין בקבצי PDF באמצעות pdfplumber
            elif ext == 'pdf':
                try:
                    import pdfplumber
                    pdf_text = []
                    with pdfplumber.open(file_path) as pdf:
                        for page in pdf.pages:
                            text = page.extract_text()
                            if text:
                                pdf_text.append(text)
                    clean_text = "\n".join(pdf_text)
                except Exception as pdf_err:
                    print(f"⚠️ שגיאה ייחודית בקריאת PDF עבור {file}: {pdf_err}")
                    continue
            else:
                continue

            # ניקוי רווחים ושורות ריקות מהתוצר הסופי
            lines = [line.strip() for line in clean_text.splitlines()]
            chunks = [phrase for phrase in lines if phrase]
            final_text = '\n'.join(chunks)
            
            if not final_text.strip():
                print(f"📋 התראה: הקובץ {file} חולץ כריק (ייתכן ומדובר בתמונה סרוקה לחלוטין)")
                continue

            # יצירת שם קובץ ייחודי לפי נתיב התיקייה
            relative_path = os.path.relpath(root, SOURCE_DIR)
            if relative_path == '.':
                new_file_name = f"root_{file.split('.')[0]}.txt"
            else:
                flattened_name = relative_path.replace(os.sep, '_')
                new_file_name = f"{flattened_name}_{file.split('.')[0]}.txt"
            
            output_file_path = os.path.join(OUTPUT_DIR, new_file_name)
            
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write(final_text)
                
            print(f"✅ עובד בהצלחה: {file} -> {new_file_name}")
            count += 1
            
        except Exception as e:
            print(f"❌ שגיאה כללית בעיבוד הקובץ {file_path}: {e}")

print(f"\nהסתיים! {count} קבצים נוקו בהצלחה ונמצאים בתיקייה: {OUTPUT_DIR}")
