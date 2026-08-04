import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

# Get all 14 DEV_ALGO courses
cursor.execute("SELECT id, title FROM syllabus_course WHERE subdomain_id = 'DEV_ALGO' ORDER BY id ASC")
courses = cursor.fetchall()
print("DEV_ALGO Courses:")
for c in courses:
    print(f"ID: {c[0]} | Title: {c[1]}")

print("\nChecking course_id values in exams_question:")
cursor.execute("SELECT course_id, COUNT(*) FROM exams_question WHERE subdomain_id = 'DEV_ALGO' GROUP BY course_id")
for row in cursor.fetchall():
    print(f"Course ID {row[0]}: {row[1]} questions")

conn.close()
