import re
from docx import Document
from docx.shared import Inches
import html
import pyperclip

def clean_text(text):
    """ניקוי טקסט מרווחים מיותרים וסימני עיצוב"""
    if not text:
        return ""
    
    # הסרת סימני עיצוב מיותרים
    text = re.sub(r'\[([^\]]+)\]\{[^}]+\}', r'\1', text)  # הסרת סימני עיצוב כמו [טקסט]{dir="rtl"}
    text = re.sub(r'\{[^}]+\}', '', text)  # הסרת כל מה שבין סוגריים מסולסלים
    text = re.sub(r'\[([^\]]+)\]', r'\1', text)  # הסרת סוגריים מרובעים
    text = re.sub(r'\s+', ' ', text)  # החלפת מספר רווחים ברווח יחיד
    text = text.strip()
    
    return text

def extract_text_from_docx(file_path):
    """חילוץ טקסט מקובץ Word"""
    try:
        doc = Document(file_path)
        text_content = []
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_content.append(paragraph.text.strip())
        
        return '\n'.join(text_content)
    except Exception as e:
        print(f"שגיאה בקריאת הקובץ: {e}")
        return None

def parse_content_structure(content):
    """ניתוח מבנה התוכן ויצירת HTML ישירות"""
    lines = content.split('\n')
    html_content = ""
    accordion_stack = []  # מחסנית לניהול רמות האקורדיונים הפתוחים
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # ניקוי הטקסט
        clean_line = clean_text(line)
        
        # בדיקת סימנים לפי סדר עדיפויות
        if line.startswith('+++'):
            # אקורדיון משולש (רמה 3) - צריך לסגור רמות גבוהות יותר
            while len(accordion_stack) > 2:
                html_content += '      </div>\n    </details>\n\n'
                accordion_stack.pop()
            
            # סגירת אקורדיון רמה 3 קודם אם קיים
            if len(accordion_stack) == 3:
                html_content += '      </div>\n    </details>\n\n'
                accordion_stack.pop()
            
            # פתיחת אקורדיון רמה 3 חדש
            text = clean_line[3:].strip()
            indent = '        ' if len(accordion_stack) >= 2 else '    '
            html_content += f'{indent}<details>\n{indent}  <summary>{html.escape(text)}</summary>\n{indent}  <div class="content">\n'
            accordion_stack.append(3)
            
        elif line.startswith('++'):
            # אקורדיון כפול (רמה 2) - צריך לסגור רמות גבוהות יותר
            while len(accordion_stack) > 1:
                html_content += '      </div>\n    </details>\n\n'
                accordion_stack.pop()
            
            # סגירת אקורדיון רמה 2 קודם אם קיים
            if len(accordion_stack) == 2:
                html_content += '      </div>\n    </details>\n\n'
                accordion_stack.pop()
            
            # פתיחת אקורדיון רמה 2 חדש
            text = clean_line[2:].strip()
            indent = '      ' if len(accordion_stack) >= 1 else '    '
            html_content += f'{indent}<details>\n{indent}  <summary>{html.escape(text)}</summary>\n{indent}  <div class="content">\n'
            accordion_stack.append(2)
            
        elif line.startswith('+'):
            # אקורדיון ראשי (רמה 1) - סגירת כל האקורדיונים הפתוחים
            while accordion_stack:
                html_content += '      </div>\n    </details>\n\n'
                accordion_stack.pop()
            
            # פתיחת אקורדיון ראשי חדש
            text = clean_line[1:].strip()
            html_content += f'    <details>\n      <summary>{html.escape(text)}</summary>\n      <div class="content">\n'
            accordion_stack.append(1)
            
        elif line.startswith('**'):
            # תת סעיף שלישי לא מודגש ללא בולט - 3 רמות הסטה (60px)
            text = clean_line[2:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 60px;">{html.escape(text)}</div>\n'
            
        elif line.startswith('=='):
            # תת סעיף שני לא מודגש עם בולט ריבוע חלול - 2 רמות הסטה (40px)
            text = clean_line[2:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 40px;"><span style="font-size: 60%;">☐</span> {html.escape(text)}</div>\n'
            
        elif line.startswith('--'):
            # תת סעיף ראשון לא מודגש עם בולט עיגול מלא - 1 רמת הסטה (20px)
            text = clean_line[2:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 20px;">● {html.escape(text)}</div>\n'
            
        elif line.startswith('-'):
            # תת סעיף ראשון מודגש עם בולט עיגול מלא - 1 רמת הסטה (20px)
            text = clean_line[1:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 20px;">● <strong>{html.escape(text)}</strong></div>\n'
            
        elif line.startswith('='):
            # תת סעיף שני מודגש עם בולט ריבוע חלול - 2 רמות הסטה (40px)
            text = clean_line[1:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 40px;"><span style="font-size: 60%;">☐</span> <strong>{html.escape(text)}</strong></div>\n'
            
        elif line.startswith('*'):
            # תת סעיף שלישי לא מודגש עם בולט עיגול חלול - 3 רמות הסטה (60px)
            text = clean_line[1:].strip()
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div style="margin-right: 60px;">○ {html.escape(text)}</div>\n'
            
        else:
            # טקסט ללא סימן - ללא הסטה
            base_indent = '        '
            extra_indent = '  ' * (len(accordion_stack) - 1) if len(accordion_stack) > 1 else ''
            html_content += f'{base_indent}{extra_indent}<div>{html.escape(clean_line)}</div>\n'
    
    # סגירת כל האקורדיונים הפתוחים
    while accordion_stack:
        html_content += '      </div>\n    </details>\n\n'
        accordion_stack.pop()
    
    return html_content

def generate_accordion_html(content):
    """יצירת קוד HTML לאקורדיונים"""
    return content

def convert_docx_to_accordion(docx_path, output_path=None):
    """המרת קובץ Word לקוד HTML אקורדיונים בלבד"""
    # קריאת התוכן מהקובץ
    content = extract_text_from_docx(docx_path)
    
    if not content:
        print("לא ניתן לקרוא את הקובץ")
        return False
    
    # ניתוח המבנה ויצירת HTML
    html_content = parse_content_structure(content)
    
    # שמירת הקובץ או הדפסתו
    if output_path:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"קוד האקורדיונים נשמר בהצלחה: {output_path}")
            return True
        except Exception as e:
            print(f"שגיאה בשמירת הקובץ: {e}")
            return False
    else:
        # הדפסת הקוד למסך
        print("קוד האקורדיונים:")
        print("=" * 50)
        print(html_content)
        return True

def get_file_input(previous_path=""):
    """קבלת נתיב קובץ הקלט מהמשתמש"""
    print("=" * 60)
    print("המרת קובץ Word לאקורדיונים HTML")
    print("=" * 60)
    print("💡 טיפ: אם הנתיב מכיל רווחים, פשוט הדבק אותו ללא מרכאות")
    print("📝 פורמט נתמך:")
    print("   + אקורדיון ראשי (רמה 1)")
    print("   ++ אקורדיון משני (רמה 2)")
    print("   +++ אקורדיון שלישי (רמה 3)")
    print("   - תת סעיף ראשון מודגש עם בולט עיגול מלא")
    print("   -- תת סעיף ראשון לא מודגש עם בולט עיגול מלא")
    print("   = תת סעיף שני מודגש עם בולט ריבוע חלול")
    print("   == תת סעיף שני לא מודגש עם בולט ריבוע חלול")
    print("   * תת סעיף שלישי לא מודגש עם בולט עיגול חלול")
    print("   ** תת סעיף שלישי לא מודגש ללא בולט")
    
    while True:
        if previous_path:
            prompt = f"\nהכנס את נתיב קובץ ה-Word (או לחץ Enter לשימוש ב: {previous_path}): "
        else:
            prompt = "\nהכנס את נתיב קובץ ה-Word (או לחץ Enter לדוגמה): "
        
        docx_file = input(prompt).strip()
        
        # אם המשתמש לחץ Enter בלבד
        if not docx_file:
            if previous_path:
                docx_file = previous_path
                print(f"משתמש בקובץ הקודם: {docx_file}")
            else:
                docx_file = "פרוטוקול אסתמה.docx"
                print(f"משתמש בקובץ ברירת מחדל: {docx_file}")
        else:
            # הסרת מרכאות מרובות - כל סוגי המרכאות
            original_path = docx_file
            
            # הסרת מרכאות בודדות מהקצוות
            docx_file = docx_file.strip("'")
            # הסרת מרכאות כפולות מהקצוות  
            docx_file = docx_file.strip('"')
            # עוד סיבוב של הסרת מרכאות למקרה של שילוב
            docx_file = docx_file.strip("'\"")
            
            print(f"📝 הנתיב המקורי: {original_path}")
            print(f"🔍 מחפש את הקובץ: {docx_file}")
        
        # בדיקת קיום הקובץ
        import os
        if os.path.exists(docx_file):
            return docx_file
        else:
            print(f"❌ הקובץ לא נמצא בנתיב: {docx_file}")
            print("💡 וודא ש:")
            print("   - הנתיב נכון")
            print("   - הקובץ קיים")
            print("   - אין מרכאות מיותרות")
            print("   - הקובץ הוא .docx")
            print("📁 דוגמת נתיב נכון: C:\\Users\\שם\\Documents\\קובץ.docx")
            
            # בדיקה אם זה Google Drive
            if "My Drive" in docx_file:
                print("🔍 נראה שזה קובץ Google Drive - וודא ש:")
                print("   - Google Drive מסונכרן למחשב")
                print("   - הקובץ הורד מהענן (יש לו סמל ירוק)")
                print("   - אתה מחובר לאינטרנט")

def get_output_choice():
    """קבלת בחירת פלט מהמשתמש"""
    print("\nבחר איך להציג את התוצאה:")
    print("1. הצגה על המסך")
    print("2. שמירה בקובץ")
    
    while True:
        choice = input("\nהכנס את בחירתך (1 או 2): ").strip()
        
        if choice == "1":
            return None  # הצגה על המסך
        elif choice == "2":
            output_file = input("\nהכנס שם ונתיב לקובץ הפלט (דוגמה: accordion_output.html): ").strip()
            if not output_file:
                output_file = "accordion_output.html"
                print(f"משתמש בשם ברירת מחדל: {output_file}")
            return output_file
        else:
            print("❌ בחירה לא חוקית! אנא הכנס 1 או 2")

def display_result(html_content, output_path=None):
    """הצגת התוצאה או שמירתה"""
    if output_path:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"\n✅ קוד האקורדיונים נשמר בהצלחה ב: {output_path}")
            print(f"📁 גודל הקובץ: {len(html_content)} תווים")
        except Exception as e:
            print(f"❌ שגיאה בשמירת הקובץ: {e}")
            return False
    else:
        print("\n" + "=" * 60)
        print("קוד האקורדיונים HTML:")
        print("=" * 60)
        print(html_content)
        print("=" * 60)
        print("📋 העתק את הקוד למעלה והדבק אותו בקובץ ה-HTML שלך")
    
    # העתקה לקליפבוארד
    try:
        pyperclip.copy(html_content)
        print("✅ הקוד הועתק לקליפבוארד בהצלחה!")
        print("💡 עכשיו אפשר להדביק אותו עם Ctrl+V")
    except Exception as e:
        print(f"⚠️ לא ניתן להעתיק לקליפבוארד: {e}")
        print("💡 העתק את הקוד ידנית מהטקסט למעלה")
    
    return True

# פונקציה ראשית מעודכנת
def main(previous_file_path=""):
    """פונקציה ראשית אינטראקטיבית"""
    try:
        # קבלת קובץ הקלט
        docx_file = get_file_input(previous_file_path)
        
        # קריאת התוכן מהקובץ
        print(f"\n📖 קורא את הקובץ: {docx_file}")
        content = extract_text_from_docx(docx_file)
        
        if not content:
            print("❌ לא ניתן לקרוא את הקובץ")
            return
        
        print("✅ הקובץ נקרא בהצלחה")
        
        # ניתוח המבנה ויצירת HTML
        print("🔍 מנתח את מבנה התוכן ויוצר HTML...")
        html_content = parse_content_structure(content)
        
        if not html_content.strip():
            print("⚠️ לא נמצא תוכן מתאים להמרה (לא נמצאו סימנים של + - = *)")
            return
        
        # קבלת בחירת הפלט
        output_path = get_output_choice()
        
        # הצגת התוצאה
        if display_result(html_content, output_path):
            print(f"\n🎉 ההמרה הושלמה בהצלחה!")
        
        # שאלה על המשך
        print(f"\n" + "-" * 40)
        again = input("האם תרצה להמיר קובץ נוסף? (y/n): ").strip().lower()
        if again in ['y', 'yes', 'כן']:
            print("\n")
            main(docx_file)  # העברת נתיב הקובץ הנוכחי להרצה הבאה
        else:
            print("תודה שהשתמשת בסקריפט! 👋")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ הסקריפט הופסק על ידי המשתמש")
    except Exception as e:
        print(f"\n❌ שגיאה כללית: {e}")

# הרצת הסקריפט
if __name__ == "__main__":
    main()