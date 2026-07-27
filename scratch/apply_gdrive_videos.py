import os
import shutil
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")
LOCAL_VIDEOS_DIR = os.path.join(BASE_DIR, "frontend", "public", "videos")

GDRIVE_MAPPING = [
    ("01", "https://drive.google.com/file/d/1-1W28JSIac6e78KKmPNP2c0ap9Ya9CL7/view?usp=sharing"),
    ("02", "https://drive.google.com/file/d/1MyGBpXV2QV4FhOX4t3Gj1w0Rs9g6Avnz/view?usp=sharing"),
    ("03", "https://drive.google.com/file/d/1PGuOyz-zmtHJldM64inXIpxW_tWdZZ3A/view?usp=sharing"),
    ("04", "https://drive.google.com/file/d/1Pfc-i8sqKCMJ8iSVsK_v1uMowZXbXYgy/view?usp=sharing"),
    ("05", "https://drive.google.com/file/d/1R3WVJqOByTBl9OL2UG4jrSuhDVdADfJN/view?usp=sharing"),
    ("06", "https://drive.google.com/file/d/1Vs9hi4x451Vx5hVSGqnLt2VTfvC_niCm/view?usp=sharing"),
    ("07", "https://drive.google.com/file/d/1XWJ2qHZFsjdTq87IrvOgeKn54zRQUSTB/view?usp=sharing"),
    ("08", "https://drive.google.com/file/d/1g8aDWeWbEbObQCFE7eUdyUsXqddIuCd0/view?usp=sharing"),
    ("09", "https://drive.google.com/file/d/1kAv1rPoAAjXEhCPTkf3v6xajRP7JUADL/view?usp=sharing"),
    ("10", "https://drive.google.com/file/d/1nztnVKBD8n7NImMQOI87ZRycU-0Aw1rS/view?usp=sharing"),
    ("11", "https://drive.google.com/file/d/1p7ui66rjrnGiu9FPWso4iIzIVecJSEor/view?usp=sharing"),
    ("12", "https://drive.google.com/file/d/1r4xl_LTBaEITa4plAUEGVxfdAK4YGT6t/view?usp=sharing"),
    ("13", "https://drive.google.com/file/d/1vIQJKqwnQ8GcinNHDygneOydAAKSYWRd/view?usp=sharing"),
    ("14", "https://drive.google.com/file/d/1voTOC1NW_YsBNNo8wtrKJo7lPbIfd1rc/view?usp=sharing"),
]

def update_databases():
    print("Updating databases with Google Drive links...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            for prefix, gdrive_url in GDRIVE_MAPPING:
                cursor.execute(f"""
                    UPDATE {table_name}
                    SET video_url = ?
                    WHERE title LIKE ?
                """, (gdrive_url, f"{prefix}.%"))

            conn.commit()
            print(f"Successfully updated 14 Google Drive video URLs in: {db_path}")
            conn.close()

    # Remove heavy local videos folder if present to keep project lightweight
    if os.path.exists(LOCAL_VIDEOS_DIR):
        print(f"Cleaning up local heavy video directory to save disk space: {LOCAL_VIDEOS_DIR}")
        shutil.rmtree(LOCAL_VIDEOS_DIR, ignore_errors=True)
        print("Local video directory removed.")

if __name__ == "__main__":
    update_databases()
    print("Google Drive video integration complete!")
