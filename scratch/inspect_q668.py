import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

q = cursor.execute("SELECT * FROM exams_question WHERE id = 668").fetchone()
if q:
    print("ID:", q['id'])
    print("Text:", q['question_text'])
    print("A:", q['option_a'])
    print("B:", q['option_b'])
    print("C:", q['option_c'])
    print("D:", q['option_d'])
    print("Explanation:", q['explanation'])
else:
    print("Question 668 not found.")
conn.close()
