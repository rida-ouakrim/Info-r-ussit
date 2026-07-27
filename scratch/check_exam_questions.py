import sqlite3

conn = sqlite3.connect("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3")
cursor = conn.cursor()

cursor.execute("""
    SELECT exam_year, domain_id, COUNT(*) 
    FROM exams_question 
    WHERE source_type = 'past_exam'
    GROUP BY exam_year, domain_id
    ORDER BY exam_year DESC, domain_id
""")

print("=== PAST EXAM QUESTIONS IN DJANGO DB ===")
for r in cursor.fetchall():
    print(f"Year: {r[0]} | Domain: {r[1]} | Count: {r[2]}")

conn.close()
