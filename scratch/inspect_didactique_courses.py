import sqlite3

conn = sqlite3.connect("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3")
cursor = conn.cursor()

cursor.execute("""
    SELECT c.id, c.subdomain_id, c.title, LENGTH(c.content) 
    FROM syllabus_course c
    JOIN syllabus_subdomain sd ON c.subdomain_id = sd.code
    WHERE sd.domain_id = 'DIDACTIQUE'
""")
rows = cursor.fetchall()
print("=== DIDACTIQUE COURSES IN DJANGO DB ===")
for r in rows:
    print(f"ID: {r[0]} | Subdomain: {r[1]} | Title: {r[2]} | Content length: {r[3]}")

conn.close()
