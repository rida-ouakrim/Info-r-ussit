import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# Update subdomain from DEV_C to DEV_PROG_WEB
for db_path in [CONCOURS_DB, DJANGO_DB]:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"
        col = "subdomain_code" if db_path == CONCOURS_DB else "subdomain_id"

        cursor.execute(f"UPDATE {table_name} SET {col} = 'DEV_PROG_WEB' WHERE {col} = 'DEV_C'")
        count = cursor.rowcount
        conn.commit()
        print(f"Updated {count} courses in {db_path} to subdomain 'DEV_PROG_WEB'.")
        conn.close()

print("Subdomain update complete!")
