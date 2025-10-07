import os
import glob
import re
from datetime import datetime

def remove_email_style_from_html():
    """
    מוצא את כל קבצי HTML בספריית mda ובתתי-ספריותיה
    מחפש ומוחק את הסטייל .top-link .email (מלבד מקובץ index.html)
    מחזיר רשימה של קבצים שבהם הסטייל נמחק
    """
    
    # הנתיב לספריית mda הנוכחית (הסקריפט נמצא ב mda/py אז mda היא התיקייה הנוכחית)
    current_dir = os.getcwd()
    
    # בדיקה שאנחנו נמצאים בתיקיית py שבתוך mda (תואם גם Windows וגם Linux)
    current_parts = os.path.normpath(current_dir).split(os.sep)
    
    if len(current_parts) < 2 or current_parts[-1].lower() != 'py' or current_parts[-2].lower() != 'mda':
        print(f"שגיאה: הסקריפט חייב להיות בתיקייה mda{os.sep}py")
        print(f"התיקייה הנוכחית: {current_dir}")
        return []
    
    # הנתיב לספריית mda (תיקייה אחת למעלה מ-py)
    mda_directory = os.path.dirname(current_dir)
    
    # הסטייל שאנחנו מחפשים למחיקה (עם הרווחים הנכונים)
    target_style = """    .top-link .email {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8em;
    }
    .top-link .email a {
      color: #ffffff;
      text-decoration: none;
    }
    .top-link .email a:hover {
      text-decoration: underline;
    }"""
    
    # חיפוש כל קבצי HTML רק בספריית mda ובתתי-ספריותיה
    html_files = []
    
    # חיפוש ידני רק בתוך mda
    for root, dirs, files in os.walk(mda_directory):
        # וידוא שאנחנו עדיין בתוך mda
        if not os.path.abspath(root).startswith(os.path.abspath(mda_directory)):
            continue
            
        for file in files:
            if file.lower().endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    # רשימת קבצים שבהם הסטייל נמחק
    modified_files = []
    
    print(f"נמצאו {len(html_files)} קבצי HTML בספריית mda בלבד")
    print(f"ספריית החיפוש: {mda_directory}")
    print("בודק כל קובץ...")
    print("-" * 70)
    
    for html_file in html_files:
        # בדיקה שזה לא index.html
        filename = os.path.basename(html_file)
        if filename.lower() == 'index.html':
            print(f"מדלג על: {html_file} (index.html)")
            continue
            
        try:
            # קריאת הקובץ
            with open(html_file, 'r', encoding='utf-8') as f:
                original_content = f.read()
                
            # בדיקה אם הסטייל המבוקש קיים בקובץ
            if target_style in original_content:
                # הסרת הסטייל
                modified_content = original_content.replace(target_style, '')
                
                # שמירת הקובץ המעודכן
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(modified_content)
                
                modified_files.append(html_file)
                print(f"✓ נמחק סטייל מקובץ: {html_file}")
            else:
                # חיפוש גמיש יותר - מחפש חלקים של הסטייל
                if ".top-link .email" in original_content and "position: absolute" in original_content:
                    print(f"⚠️  נמצא סטייל דומה בקובץ: {html_file} (אבל לא התאמה מדויקת)")
                else:
                    print(f"- סטייל לא נמצא: {html_file}")
                
        except UnicodeDecodeError:
            # ניסיון עם קידוד אחר אם UTF-8 לא עובד
            try:
                with open(html_file, 'r', encoding='cp1255') as f:
                    original_content = f.read()
                    
                if target_style in original_content:
                    modified_content = original_content.replace(target_style, '')
                    
                    with open(html_file, 'w', encoding='cp1255') as f:
                        f.write(modified_content)
                    
                    modified_files.append(html_file)
                    print(f"✓ נמחק סטייל מקובץ: {html_file}")
                else:
                    if ".top-link .email" in original_content and "position: absolute" in original_content:
                        print(f"⚠️  נמצא סטייל דומה בקובץ: {html_file} (אבל לא התאמה מדויקת)")
                    else:
                        print(f"- סטייל לא נמצא: {html_file}")
                    
            except Exception as e:
                print(f"שגיאה בעיבוד הקובץ {html_file}: {e}")
                
        except Exception as e:
            print(f"שגיאה בקריאת הקובץ {html_file}: {e}")
    
    return modified_files

def create_report_file(modified_files):
    """
    יוצר קובץ דוח עם רשימת הקבצים שבהם הסטייל נמחק
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"deleted_styles_report_{timestamp}.txt"
    
    try:
        with open(report_filename, 'w', encoding='utf-8') as f:
            f.write("דוח מחיקת סטיילים - .top-link .email\n")
            f.write("=" * 60 + "\n")
            f.write(f"תאריך ושעה: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write(f"סך הכל קבצים ששונו: {len(modified_files)}\n\n")
            
            if modified_files:
                f.write("קבצים שבהם הסטייל נמחק:\n")
                f.write("-" * 40 + "\n")
                for i, file in enumerate(modified_files, 1):
                    f.write(f"{i}. {file}\n")
            else:
                f.write("לא נמצאו קבצים עם הסטייל המבוקש.\n")
                
            f.write("\n" + "=" * 60 + "\n")
            f.write("הסטייל שנמחק:\n")
            f.write("    .top-link .email {\n")
            f.write("      position: absolute;\n")
            f.write("      left: 15px;\n")
            f.write("      top: 50%;\n")
            f.write("      transform: translateY(-50%);\n")
            f.write("      font-size: 0.8em;\n")
            f.write("    }\n")
            f.write("    .top-link .email a {\n")
            f.write("      color: #ffffff;\n")
            f.write("      text-decoration: none;\n")
            f.write("    }\n")
            f.write("    .top-link .email a:hover {\n")
            f.write("      text-decoration: underline;\n")
            f.write("    }\n")
        
        print(f"\nקובץ דוח נוצר: {report_filename}")
        return report_filename
        
    except Exception as e:
        print(f"שגיאה ביצירת קובץ הדוח: {e}")
        return None

def print_summary(modified_files):
    """
    מדפיס סיכום של הקבצים שבהם הסטייל נמחק
    """
    print("\n" + "=" * 70)
    print("סיכום - קבצי HTML שבהם הסטייל נמחק:")
    print("=" * 70)
    
    if modified_files:
        print(f"נמצאו {len(modified_files)} קבצים שבהם הסטייל נמחק:\n")
        for i, file in enumerate(modified_files, 1):
            print(f"{i}. {file}")
    else:
        print("לא נמצאו קבצים עם הסטייל המבוקש!")
    
    print("=" * 70)

def main():
    """
    פונקציה ראשית להרצת הסקריפט
    """
    print("מחפש ומוחק סטייל .top-link .email מקבצי HTML")
    print(f"הסקריפט מופעל מתיקייה: {os.getcwd()}")
    print("חיפוש בספריית mda ותתי-ספריותיה בלבד")
    print("מדלג על קובץ index.html")
    print("=" * 70)
    
    # איתור ומחיקת הסטיילים
    modified_files = remove_email_style_from_html()
    
    # הדפסת הסיכום
    print_summary(modified_files)
    
    # יצירת קובץ דוח
    if modified_files:
        report_file = create_report_file(modified_files)
        if report_file:
            print(f"הדוח נשמר בקובץ: {report_file}")
    
    print(f"\nהפעולה הושלמה בהצלחה!")
    
    # אזהרה
    if modified_files:
        print("\n⚠️  אזהרה: הקבצים שונו באופן קבוע!")
        print("   וודא שיש לך גיבוי לפני הרצת הסקריפט בעתיד")

if __name__ == "__main__":
    main()