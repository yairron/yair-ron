#!/usr/bin/env python3
import subprocess
import sys
import os

def run_build_main_quiz():
    """
    ריץ את הפקודה node mda/js/build_main_quiz.js
    """
    try:
        # בדוק אם קובץ ה-JS קיים
        js_file = "mda/js/build_main_quiz.js"
        if not os.path.exists(js_file):
            print(f"שגיאה: הקובץ {js_file} לא נמצא")
            return False
        
        # הרץ את הפקודה
        print(f"מריץ: node {js_file}")
        result = subprocess.run(
            ["node", js_file],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        # הצג את הפלט
        if result.stdout:
            print("פלט:")
            print(result.stdout)
        
        if result.stderr:
            print("שגיאות:")
            print(result.stderr)
        
        # בדוק את קוד היציאה
        if result.returncode == 0:
            print("הפקודה הושלמה בהצלחה!")
            return True
        else:
            print(f"הפקודה נכשלה עם קוד יציאה: {result.returncode}")
            return False
            
    except FileNotFoundError:
        print("שגיאה: Node.js לא נמצא במערכת. אנא ודא שהוא מותקן ונמצא ב-PATH")
        return False
    except Exception as e:
        print(f"שגיאה לא צפויה: {e}")
        return False

if __name__ == "__main__":
    success = run_build_main_quiz()
    sys.exit(0 if success else 1)