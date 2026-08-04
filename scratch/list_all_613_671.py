import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("""
    SELECT id, question_number, domain_id, subdomain_id, course_id, question_text
    FROM exams_question 
    WHERE id BETWEEN 613 AND 671
    ORDER BY id
""").fetchall()

print(f"Questions between 613 and 671 ({len(rows)} total):")
for r in rows:
    snippet = r['question_text'].replace('\n', ' ')[:60]
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']} | Text: {snippet}...")

conn.close()
