import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cursor = conn.cursor()
rows = cursor.execute("SELECT exam_year, COUNT(*) FROM exams_question GROUP BY exam_year").fetchall()
print("Questions per year in Django DB:")
for r in rows:
    print(f"  Year {r[0]}: {r[1]} questions")
    
rows_conc = cursor.execute("SELECT COUNT(*) FROM exams_question").fetchone()[0]
print(f"Total questions in Django DB: {rows_conc}")
conn.close()
