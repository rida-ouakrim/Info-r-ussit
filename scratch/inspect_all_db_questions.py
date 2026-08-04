import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Search for any questions containing 'transposer' case-insensitively
print("=== Search for 'transposer' (case-insensitive) ===")
rows = cursor.execute(
    "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
    "FROM exams_question WHERE question_text LIKE '%transposer%' OR question_text LIKE '%Transposer%'"
).fetchall()
for r in rows:
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course ID: {r['course_id']}")
    print(f"  Text: {r['question_text'][:120]}...")

print("\n=== Search for 'didactique' (case-insensitive) ===")
rows = cursor.execute(
    "SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id "
    "FROM exams_question WHERE question_text LIKE '%didactique%' OR question_text LIKE '%Didactique%'"
).fetchall()
print(f"Found {len(rows)} questions.")
for r in rows[:10]:
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course ID: {r['course_id']}")
    print(f"  Text: {r['question_text'][:120]}...")

conn.close()
