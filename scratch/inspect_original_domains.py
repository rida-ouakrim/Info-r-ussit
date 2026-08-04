import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn_d = sqlite3.connect('backend/db.sqlite3')
conn_d.row_factory = sqlite3.Row
cur_d = conn_d.cursor()

conn_c = sqlite3.connect('concours.db')
conn_c.row_factory = sqlite3.Row
cur_c = conn_c.cursor()

ids = [660, 668, 676, 689, 695]
print("Comparing original (concours.db) vs current (db.sqlite3):")
for q_id in ids:
    # Get from Django DB
    q_d = cur_d.execute(
        "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
        "FROM exams_question WHERE id = ?", (q_id,)
    ).fetchone()
    
    if q_d:
        # Get from concours.db by matching text
        q_c = cur_c.execute(
            "SELECT id, question_number, exam_year, domain_code, subdomain_code, course_id "
            "FROM questions WHERE question_text = ?", (q_d['question_text'],)
        ).fetchone()
        
        print(f"ID: {q_id} | Q: {q_d['question_number']} | Year: {q_d['exam_year']}")
        print(f"  Text: {q_d['question_text'][:100]}...")
        print(f"  Django  : Dom: {q_d['domain_id']} | Sub: {q_d['subdomain_id']} | Course: {q_d['course_id']}")
        if q_c:
            print(f"  Legacy  : Dom: {q_c['domain_code']} | Sub: {q_c['subdomain_code']} | Course: {q_c['course_id']}")
        else:
            print("  Legacy  : Not found in concours.db")
        print()

conn_d.close()
conn_c.close()
