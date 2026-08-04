import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all 2025 questions
rows = cursor.execute("""
    SELECT id, question_number, question_text, domain_id, subdomain_id, course_id
    FROM exams_question 
    WHERE exam_year = 2025
    ORDER BY id
""").fetchall()

print(f"Total 2025 questions: {len(rows)}")
for r in rows:
    # Check if the question text contains didactique/pedagogical terms
    text = r['question_text'].lower()
    is_pedagogical = any(term in text for term in ['didactique', 'pédagog', 'apprenant', 'enseignement', 'situation-problème', 'apc', 'ppo', 'transposition', 'contrat didactique', 'ressource didactique'])
    if is_pedagogical:
        print(f"ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']}")
        print(f"  Text: {r['question_text'][:120]}...\n")

conn.close()
