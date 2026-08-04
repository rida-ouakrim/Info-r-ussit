import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("""
    SELECT id, question_number, question_text, domain_id, subdomain_id, course_id
    FROM exams_question 
    WHERE exam_year = 2025
    ORDER BY id
""").fetchall()

with open('scratch/2025_all_questions.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total 2025 questions: {len(rows)}\n\n")
    for r in rows:
        f.write(f"ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']}\n")
        f.write(f"Text: {r['question_text']}\n")
        f.write("-" * 80 + "\n\n")

print("Done! Saved to scratch/2025_all_questions.txt")
conn.close()
