import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all 2025 specialization questions
rows = cursor.execute("""
    SELECT id, question_number, question_text, domain_id, subdomain_id, course_id
    FROM exams_question 
    WHERE exam_year = 2025 AND domain_id IN ('DEV', 'SYS_RES', 'LOG')
    ORDER BY CAST(SUBSTR(question_number, 2) AS INTEGER), id
""").fetchall()

print(f"Total questions: {len(rows)}")
counts = {}
for r in rows:
    num = r['question_number']
    if num not in counts:
        counts[num] = []
    counts[num].append(r)

print("\nDuplicate question numbers found:")
for num, q_list in counts.items():
    if len(q_list) > 1:
        print(f"Question Number: {num} ({len(q_list)} occurrences)")
        for q in q_list:
            print(f"  ID: {q['id']} | Dom: {q['domain_id']} | Text: {q['question_text'][:80]}...")
            
conn.close()
