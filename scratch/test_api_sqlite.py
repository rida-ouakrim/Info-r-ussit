import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# We simulate: year=2025, source_type=past_exam, domain=SPECIALITE
rows = cursor.execute("""
    SELECT id, question_number, domain_id, question_text
    FROM exams_question 
    WHERE exam_year = 2025 
      AND source_type = 'past_exam' 
      AND domain_id IN ('DEV', 'SYS_RES', 'LOG')
    ORDER BY id
""").fetchall()

print(f"Total questions returned for 2025 SPECIALITE: {len(rows)}")
for r in rows:
    print(f"  ID: {r['id']} | Q: {r['question_number']} | Dom: {r['domain_id']} | Text: {r['question_text'][:60]}...")
    
conn.close()
