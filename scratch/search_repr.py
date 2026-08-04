import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute(
    "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
    "FROM exams_question WHERE question_text LIKE '%représentation%' OR question_text LIKE '%representation%'"
).fetchall()

print(f"Total found: {len(rows)}")
for r in rows:
    c_title = "None"
    if r['course_id']:
        c = cursor.execute("SELECT title FROM syllabus_course WHERE id = ?", (r['course_id'],)).fetchone()
        c_title = c['title'] if c else "None"
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']} ({c_title})")
    print(f"  Text: {r['question_text'][:120]}...\n")

conn.close()
