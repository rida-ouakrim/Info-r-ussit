import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

NEW_LINKS = {
    "04": "https://drive.google.com/file/d/1cV0uHZdKoK3-dMoWnLy2CgbuyBtsov5W/view?usp=sharing", # 04. Structures Conditionnelles
    "06": "https://drive.google.com/file/d/1IE6x09KTM0ZPJE3C4ZdQaK4Wfb5OZmZn/view?usp=sharing"  # 06. Les Tableaux
}

def update_links():
    print("Updating new Google Drive video links in databases...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            for prefix, url in NEW_LINKS.items():
                cursor.execute(f"""
                    UPDATE {table_name}
                    SET video_url = ?
                    WHERE title LIKE ?
                """, (url, f"{prefix}.%"))

            conn.commit()
            print(f"Updated course video URLs in: {db_path}")
            conn.close()

if __name__ == "__main__":
    update_links()
    print("New Google Drive links applied successfully!")
