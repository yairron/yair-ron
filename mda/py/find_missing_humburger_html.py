import os
import glob

def find_html_files_missing_script():
    """
    מוצא את כל קבצי HTML בספריה mda ובתתי-ספריותיה
    ובודק אם הם מכילים את השורה: <script src="/mda/js/hamburger-menu.js"></script>
    מחזיר רשימה של קבצים שבהם השורה חסרה
    """
    
    # הנתיב לספריית mda (מהתיקייה הנוכחית שהיא /mda/py, עולים רמה אחת למעלה)
    mda_directory = ".."
    
    # בדיקה שהספריה קיימת
    if not os.path.exists(mda_directory):
        print(f"שגיאה: הספריה '{mda_directory}' לא נמצאה")
        print("ודא שהסקריפט נמצא בתיקייה /mda/py")
        return []
    
    # השורה שאנחנו מחפשים
    target_script = '<script src="/mda/js/hamburger-menu.js"></script>'
    
    # חיפוש כל קבצי HTML בספריה ובתתי-ספריות
    html_pattern = os.path.join(mda_directory, "**", "*.html")
    html_files = glob.glob(html_pattern, recursive=True)
    
    # רשימת קבצים שבהם השורה חסרה
    missing_script_files = []
    
    print(f"נמצאו {len(html_files)} קבצי HTML בספריה mda (חיפוש מתיקייה /mda/py)")
    print("בודק כל קובץ...")
    print("-" * 50)
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # בדיקה אם השורה המבוקשת קיימת בקובץ
                if target_script not in content:
                    missing_script_files.append(html_file)
                    print(f"חסר: {html_file}")
                else:
                    print(f"נמצא: {html_file}")
                    
        except UnicodeDecodeError:
            # ניסיון עם קידוד אחר אם UTF-8 לא עובד
            try:
                with open(html_file, 'r', encoding='cp1255') as f:
                    content = f.read()
                    if target_script not in content:
                        missing_script_files.append(html_file)
                        print(f"חסר: {html_file}")
                    else:
                        print(f"נמצא: {html_file}")
            except Exception as e:
                print(f"שגיאה בקריאת הקובץ {html_file}: {e}")
                
        except Exception as e:
            print(f"שגיאה בקריאת הקובץ {html_file}: {e}")
    
    return missing_script_files

def print_summary(missing_files):
    """
    מדפיס סיכום של הקבצים שבהם השורה חסרה
    """
    print("\n" + "=" * 60)
    print("סיכום - קבצי HTML שבהם השורה חסרה:")
    print("=" * 60)
    
    if missing_files:
        print(f"נמצאו {len(missing_files)} קבצים שבהם השורה חסרה:\n")
        for i, file in enumerate(missing_files, 1):
            print(f"{i}. {file}")
    else:
        print("כל קבצי HTML מכילים את השורה המבוקשת!")
    
    print("=" * 60)

def main():
    """
    פונקציה ראשית להרצת הסקריפט
    הסקריפט נמצא בתיקייה /mda/py ומחפש בספריית mda העליונה
    """
    print("מחפש קבצי HTML שבהם חסרה השורה:")
    print('<script src="/mda/js/hamburger-menu.js"></script>')
    print("הסקריפט מופעל מתיקייה: /mda/py")
    print("=" * 60)
    
    # חיפוש הקבצים
    missing_files = find_html_files_missing_script()
    
    # הדפסת הסיכום
    print_summary(missing_files)
    
    # שמירת התוצאות לקובץ טקסט (אופציונלי)
    if missing_files:
        output_file = "missing_script_files.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("קבצי HTML שבהם חסרה השורה:\n")
            f.write('<script src="/mda/js/hamburger-menu.js"></script>\n')
            f.write("=" * 60 + "\n\n")
            for file in missing_files:
                f.write(f"{file}\n")
        print(f"\nהתוצאות נשמרו גם בקובץ: {output_file}")

if __name__ == "__main__":
    main()