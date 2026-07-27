import sqlite3

DB_DJANGO = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"

conn = sqlite3.connect(DB_DJANGO)
cursor = conn.cursor()

print("=== exams_question table schema ===")
cursor.execute("PRAGMA table_info(exams_question)")
for row in cursor.fetchall():
    print(row)

print("\n=== syllabus_domain table schema ===")
cursor.execute("PRAGMA table_info(syllabus_domain)")
for row in cursor.fetchall():
    print(row)

print("\n=== syllabus_subdomain table schema ===")
cursor.execute("PRAGMA table_info(syllabus_subdomain)")
for row in cursor.fetchall():
    print(row)

conn.close()
