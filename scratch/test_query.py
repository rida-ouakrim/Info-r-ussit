import os
import sys
import sqlite3

conn = sqlite3.connect("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3")
cursor = conn.cursor()

print("=== 2025 QUESTIONS IN DB BY DOMAIN_ID ===")
cursor.execute("SELECT domain_id, COUNT(*) FROM exams_question WHERE exam_year=2025 GROUP BY domain_id")
for row in cursor.fetchall():
    print(row)

print("\n=== SPECIALITE 2025 QUESTIONS (DEV, SYS_RES, LOG) ===")
cursor.execute("SELECT COUNT(*) FROM exams_question WHERE exam_year=2025 AND domain_id IN ('DEV', 'SYS_RES', 'LOG')")
print(cursor.fetchone()[0])

print("\n=== SPECIALITE 2025 QUESTIONS WITH source_type='past_exam' ===")
cursor.execute("SELECT source_type, COUNT(*) FROM exams_question WHERE exam_year=2025 GROUP BY source_type")
for row in cursor.fetchall():
    print(row)

conn.close()
