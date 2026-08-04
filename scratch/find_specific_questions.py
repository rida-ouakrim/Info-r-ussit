import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

queries = [
    "transposer",
    "Transposition",
    "pédagogie de",
    "L'activité de programmation",
    "Parmi ces trois concepts",
    "travaux pratiques",
    "variables locales"
]

for q in queries:
    print(f"=== Search query: '{q}' ===")
    rows = cursor.execute(
        "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
        "FROM exams_question WHERE question_text LIKE ?", (f"%{q}%",)
    ).fetchall()
    for r in rows:
        course_title = "None"
        if r['course_id']:
            c = cursor.execute("SELECT title FROM syllabus_course WHERE id = ?", (r['course_id'],)).fetchone()
            if c:
                course_title = c['title']
        print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course ID: {r['course_id']} ({course_title})")
        print(f"  Text: {r['question_text'][:80]}...")
    print()

conn.close()
