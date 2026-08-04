import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(exams_question)")
cols = [c[1] for c in cursor.fetchall()]
print("Columns in exams_question:", cols)

cursor.execute("""
    SELECT id, text, course_id, subdomain_code, domain_code
    FROM exams_question
    WHERE subdomain_code = 'DEV_ALGO'
    LIMIT 15
""")
rows = cursor.fetchall()
print(f"\nSample DEV_ALGO questions (Total {len(rows)} sample):")
for r in rows:
    print(f"ID: {r[0]} | CourseID: {r[2]} | Subdomain: {r[3]} | Text: {r[1][:70]}...")

conn.close()
