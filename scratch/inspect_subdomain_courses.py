import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

courses = cursor.execute("""
    SELECT id, title, subdomain_id 
    FROM syllabus_course 
    ORDER BY id ASC
""").fetchall()

print(f"Total syllabus courses: {len(courses)}")
for c in courses:
    print(f"  ID: {c['id']} | Subdomain: {c['subdomain_id']} | Title: {c['title']}")

conn.close()
