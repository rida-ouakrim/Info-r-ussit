import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

ids = [573, 577, 532, 406, 225, 228, 235, 762]
keywords = ['didactique', 'pédagog', 'apprenant', 'enseignement', 'situation-problème', 'apc', 'ppo', 'transposition', 'contrat didactique', 'ressource didactique', 'sciences de l\'éducation', 'évaluation formative', 'évaluation sommative']

for q_id in ids:
    q = cursor.execute("SELECT question_text FROM exams_question WHERE id = ?", (q_id,)).fetchone()
    if q:
        text = q['question_text'].lower()
        matched = [k for k in keywords if k in text]
        print(f"ID {q_id} matched keywords: {matched}")

conn.close()
