import sqlite3
import os

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Get tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables in backend/db.sqlite3:")
for t in cursor.fetchall():
    print(t[0])

# Check syllabus_course
cursor.execute("SELECT id, title, subdomain_id FROM syllabus_course")
print("\nCourses in syllabus_course:")
for r in cursor.fetchall():
    print(f"ID: {r[0]} | Title: {r[1]} | Subdomain ID: {r[2]}")

# Search for Course 13
cursor.execute("SELECT id, title, content FROM syllabus_course WHERE id=13")
row = cursor.fetchone()
if row:
    print(f"\nFound Course 13 in backend/db.sqlite3! Title: {row[1]}")
    print(row[2][:300] if row[2] else "No content")
else:
    print("\nCourse 13 NOT found in backend/db.sqlite3!")

conn.close()
