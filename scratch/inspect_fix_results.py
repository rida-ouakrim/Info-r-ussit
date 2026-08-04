import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

ids = [15, 225, 346, 351, 357, 511, 530, 563, 660, 668, 676, 689, 765]
print("Re-classification results for the 13 Course 40 questions:")
for q_id in ids:
    r = cursor.execute("""
        SELECT q.id, q.question_number, q.exam_year, q.question_text, q.course_id, c.title as course_title
        FROM exams_question q
        LEFT JOIN syllabus_course c ON q.course_id = c.id
        WHERE q.id = ?
    """, (q_id,)).fetchone()
    if r:
        print(f"ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Course: {r['course_id']} ({r['course_title']})")
        print(f"  Text: {r['question_text'][:120]}...\n")

conn.close()
