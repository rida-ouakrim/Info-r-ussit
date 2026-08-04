import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Fetch questions 665 to 669
rows = cursor.execute("""
    SELECT id, question_number, question_text, explanation
    FROM exams_question 
    WHERE id BETWEEN 665 AND 669
    ORDER BY id
""").fetchall()

for r in rows:
    print(f"=== ID: {r['id']} | Q: {r['question_number']} ===")
    print(f"Text:\n{r['question_text']}")
    print(f"Explanation:\n{r['explanation']}")
    print("=" * 60)

conn.close()
