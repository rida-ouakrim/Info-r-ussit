import sqlite3

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT id, title, LENGTH(content) FROM syllabus_course")
print("=== Current Course Content Lengths in backend/db.sqlite3 ===")
for r in cursor.fetchall():
    print(f"ID: {r[0]} | Title: {r[1]} | Length: {r[2]}")

conn.close()
