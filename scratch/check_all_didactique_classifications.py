import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all questions
rows = cursor.execute("""
    SELECT id, question_number, exam_year, question_text, domain_id, subdomain_id, course_id
    FROM exams_question 
    ORDER BY exam_year, id
""").fetchall()

misclassified = []
keywords = ['didactique', 'pédagog', 'apprenant', 'enseignement', 'situation-problème', 'apc', 'ppo', 'transposition', 'contrat didactique', 'ressource didactique', 'sciences de l\'éducation', 'évaluation formative', 'évaluation sommative']

for r in rows:
    text = r['question_text'].lower()
    is_pedagogical = any(term in text for term in keywords)
    
    # If it is pedagogical but domain is DEV, SYS_RES, or LOG
    if is_pedagogical and r['domain_id'] in ['DEV', 'SYS_RES', 'LOG']:
        misclassified.append(r)

print(f"Total misclassified didactique questions found: {len(misclassified)}")
for r in misclassified[:20]:
    print(f"ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['domain_id']} | Sub: {r['subdomain_id']} | Course: {r['course_id']}")
    print(f"  Text: {r['question_text'][:120]}...\n")

conn.close()
