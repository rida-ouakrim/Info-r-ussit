import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("""
    SELECT id, question_number, exam_year, question_text 
    FROM exams_question 
    WHERE course_id = 40
""").fetchall()

print(f"Total questions under Course 40: {len(rows)}")
for r in rows:
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']}")
    print(f"  Text: {r['question_text'][:120]}...\n")

conn.close()
