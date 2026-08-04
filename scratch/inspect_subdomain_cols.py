import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(syllabus_subdomain)")
print("Columns in syllabus_subdomain:", [r[1] for r in cursor.fetchall()])

cursor.execute("SELECT * FROM syllabus_subdomain")
for row in cursor.fetchall():
    print(row)

conn.close()
