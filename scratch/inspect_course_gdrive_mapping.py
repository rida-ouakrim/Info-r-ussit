import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("""
    SELECT id, title, video_url
    FROM syllabus_course
    WHERE subdomain_id = 'DEV_ALGO' OR title LIKE '%Algorithme%' OR title LIKE '0%' OR title LIKE '1%'
    ORDER BY id ASC
""")

rows = cursor.fetchall()
print(f"Total DEV_ALGO courses found: {len(rows)}\n")
for r in rows:
    print(f"ID: {r[0]} | Title: {r[1]}\n  URL: {r[2]}\n")

conn.close()
