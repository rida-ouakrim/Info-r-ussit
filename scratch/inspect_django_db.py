import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute(
    "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
    "FROM exams_question WHERE subdomain_id = 'DEV_ALGO'"
).fetchall()

print(f"Total DEV_ALGO questions: {len(rows)}")
for r in rows[:40]:
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Course: {r['course_id']}")
    print(f"  Text: {r['question_text'][:120]}...")

conn.close()
