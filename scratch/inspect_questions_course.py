import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

queries = [
    ("2023", "Lorsque le professeur interprète"),
    ("2022", "Dans le cadre de l'évaluation dans la pédagogie"),
    ("2022", "En didactique de l'informatique"),
    ("2021", "Parmi ces options"),
    ("2023", "Quel est l'objectif"),
    ("2023", "transposer"),
    ("2023", "Transposition")
]

print("Checking specific questions in local backend/db.sqlite3:")
for year, text_p in queries:
    rows = cursor.execute(
        "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
        "FROM exams_question WHERE exam_year = ? AND question_text LIKE ?", (year, f"%{text_p}%")
    ).fetchall()
    
    if not rows:
        print(f"❌ Not found: Year {year} | Text like '{text_p}'")
    for r in rows:
        c_title = "None"
        if r['course_id']:
            c = cursor.execute("SELECT title FROM syllabus_course WHERE id = ?", (r['course_id'],)).fetchone()
            c_title = c['title'] if c else "None"
        print(f"✅ Found ID {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']} ({c_title})")
        print(f"   Text: {r['question_text'][:120]}...")

conn.close()
