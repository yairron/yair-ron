import os

INPUT_DIR = "./BTL_CLEANED"
OUTPUT_FILE = "./ALL_DATA.txt"

print("מתחיל לאחד את כל הקבצים לקובץ אחד...")

if not os.path.exists(INPUT_DIR):
    print(f"❌ שגיאה: התיקייה {INPUT_DIR} לא קיימת!")
else:
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        for file in os.listdir(INPUT_DIR):
            if file.endswith('.txt'):
                file_path = os.path.join(INPUT_DIR, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        # כותב את שם הקובץ המקורי ככותרת כדי שהבוט ידע מאיפה המידע הגיע
                        outfile.write(f"\n\n=== מקור המידע: {file} ===\n\n")
                        outfile.write(infile.read())
                except Exception as e:
                    print(f"שגיאה בקריאת הקובץ {file}: {e}")

    print(f"✅ הסתיים בהצלחה! כל המידע אוחד לקובץ אחד: {OUTPUT_FILE}")