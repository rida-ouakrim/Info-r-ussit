import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Find the course 40 title
course = cursor.execute("SELECT title FROM syllabus_course WHERE id = 40").fetchone()
print(f"Course 40: {course['title'] if course else 'Unknown'}\n")

rows = cursor.execute("""
    SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id 
    FROM exams_question 
    WHERE course_id = 40
""").fetchall()

for r in rows:
    print(f"ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']}")
    print(f"Text: {r['question_text'][:120]}...\n")

conn.close()
