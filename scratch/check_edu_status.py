import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Check concours.db
print("=" * 60)
print("CONCOURS.DB - Courses for SCIENCES_EDU & DIDACTIQUE")
print("=" * 60)
conn = sqlite3.connect(os.path.join(BASE_DIR, "concours.db"))
c = conn.cursor()
c.execute("""
    SELECT id, subdomain_code, title, 
           CASE WHEN content IS NOT NULL AND content != '' THEN 'YES' ELSE 'NO' END as has_content
    FROM courses 
    WHERE subdomain_code IN ('EDU_PSYCHO', 'EDU_SOCIO', 'DID_CONCEPTS', 'DID_CURRICULUM', 'DID_APPROCHES')
    ORDER BY id
""")
for r in c.fetchall():
    print(f"  ID={r[0]} | {r[1]} | {r[2]} | Content: {r[3]}")

# Check questions count
print("\n" + "=" * 60)
print("CONCOURS.DB - Questions count by domain")
print("=" * 60)
c.execute("""
    SELECT domain_code, subdomain_code, COUNT(*) as cnt
    FROM questions
    WHERE domain_code IN ('SCIENCES_EDU', 'DIDACTIQUE')
    GROUP BY domain_code, subdomain_code
    ORDER BY domain_code, subdomain_code
""")
for r in c.fetchall():
    print(f"  {r[0]} / {r[1]}: {r[2]} questions")

c.execute("SELECT COUNT(*) FROM questions WHERE domain_code IN ('SCIENCES_EDU', 'DIDACTIQUE')")
total = c.fetchone()[0]
print(f"\n  TOTAL: {total} questions")
conn.close()

# Check Django DB
print("\n" + "=" * 60)
print("BACKEND/DB.SQLITE3 - Questions count")
print("=" * 60)
django_db = os.path.join(BASE_DIR, "backend", "db.sqlite3")
if os.path.exists(django_db):
    conn2 = sqlite3.connect(django_db)
    c2 = conn2.cursor()
    c2.execute("""
        SELECT domain_id, subdomain_id, COUNT(*) as cnt
        FROM exams_question
        WHERE domain_id IN ('SCIENCES_EDU', 'DIDACTIQUE')
        GROUP BY domain_id, subdomain_id
        ORDER BY domain_id, subdomain_id
    """)
    for r in c2.fetchall():
        print(f"  {r[0]} / {r[1]}: {r[2]} questions")
    c2.execute("SELECT COUNT(*) FROM exams_question WHERE domain_id IN ('SCIENCES_EDU', 'DIDACTIQUE')")
    total2 = c2.fetchone()[0]
    print(f"\n  TOTAL: {total2} questions")
    
    # Check courses
    print("\n" + "=" * 60)
    print("BACKEND/DB.SQLITE3 - Courses for EDU/DID")
    print("=" * 60)
    c2.execute("""
        SELECT id, subdomain_id, title,
               CASE WHEN content IS NOT NULL AND content != '' THEN 'YES' ELSE 'NO' END as has_content
        FROM syllabus_course
        WHERE subdomain_id IN ('EDU_PSYCHO', 'EDU_SOCIO', 'DID_CONCEPTS', 'DID_CURRICULUM', 'DID_APPROCHES')
        ORDER BY id
    """)
    for r in c2.fetchall():
        print(f"  ID={r[0]} | {r[1]} | {r[2]} | Content: {r[3]}")
    conn2.close()
else:
    print("  Django DB not found")
