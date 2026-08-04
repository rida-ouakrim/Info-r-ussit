import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get questions around 2025 Q57
rows = cursor.execute("""
    SELECT id, question_number, question_text, option_a, option_b, option_c, option_d, explanation
    FROM exams_question 
    WHERE exam_year = 2025 AND (question_number LIKE '%55%' OR question_number LIKE '%56%' OR question_number LIKE '%57%' OR question_number LIKE '%58%' OR id BETWEEN 650 AND 675)
    ORDER BY id
""").fetchall()

print(f"Found {len(rows)} questions near 2025 Q57:")
for r in rows:
    print(f"ID: {r['id']} | Q: {r['question_number']}")
    print(f"Text:\n{r['question_text']}\n")
    print("-" * 50)

conn.close()
