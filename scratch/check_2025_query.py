import os
import sys
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Query exact set returned for 2025 SPECIALITE
rows = cursor.execute("""
    SELECT id, question_number, domain_id, question_text, source_type
    FROM exams_question
    WHERE exam_year = 2025 AND domain_id IN ('DEV', 'SYS_RES', 'LOG')
    ORDER BY id
""").fetchall()

print(f"Total count returned for 2025 SPECIALITE: {len(rows)}")
q_map = {}
for r in rows:
    num = r['question_number'] or f"ID_{r['id']}"
    if num not in q_map:
        q_map[num] = []
    q_map[num].append(r)

print("\nListing all 2025 SPECIALITE questions by number:")
for num, q_list in sorted(q_map.items(), key=lambda x: x[0]):
    if len(q_list) > 1:
        print(f"  DUPLICATE {num}: {[q['id'] for q in q_list]}")
    else:
        q = q_list[0]
        print(f"  {num} (ID {q['id']}): {q['question_text'][:50]}...")

conn.close()
