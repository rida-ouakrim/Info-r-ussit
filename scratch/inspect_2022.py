import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute(
    "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
    "FROM exams_question WHERE exam_year = 2022"
).fetchall()

with open('scratch/2022_questions.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total 2022 questions: {len(rows)}\n\n")
    for r in rows:
        c_title = "None"
        if r['course_id']:
            c = cursor.execute("SELECT title FROM syllabus_course WHERE id = ?", (r['course_id'],)).fetchone()
            c_title = c['title'] if c else "None"
        f.write(f"ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']} ({c_title})\n")
        f.write(f"Text: {r['question_text']}\n")
        f.write("-" * 80 + "\n\n")

print("Done! Check scratch/2022_questions.txt")
conn.close()
