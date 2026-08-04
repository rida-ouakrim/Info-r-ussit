import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("""
    SELECT q.id, q.question_number, q.exam_year, q.course_id, c.title as course_title, q.question_text
    FROM exams_question q
    LEFT JOIN syllabus_course c ON q.course_id = c.id
    WHERE q.id IN (667, 668, 669)
""").fetchall()

for r in rows:
    print(f"ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Course: {r['course_id']} ({r['course_title']})")
    print(f"Text: {r['question_text'][:120]}...\n")

conn.close()
