import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("""
    SELECT id, question_number, domain_id, subdomain_id, course_id, question_text
    FROM exams_question 
    WHERE exam_year = 2025
    ORDER BY id
""").fetchall()

print(f"2025 Questions List ({len(rows)} total):")
for r in rows:
    # Print the first 50 chars of question text
    snippet = r['question_text'].replace('\n', ' ')[:60]
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']} | Text: {snippet}...")

conn.close()
