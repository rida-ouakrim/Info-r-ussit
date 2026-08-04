import sqlite3, sys, os
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(BASE, "backend", "db_backup_before_delete.sqlite3")

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Check for DEV_ALGO subdomain
c.execute("SELECT code, name, domain_id FROM syllabus_subdomain WHERE code='DEV_ALGO'")
rows = c.fetchall()
print("=== SUBDOMAIN DEV_ALGO ===")
for r in rows:
    print(f"  {r}")

# Check courses
c.execute("SELECT id, title, subdomain_id FROM syllabus_course WHERE subdomain_id='DEV_ALGO'")
courses = c.fetchall()
print(f"\n=== COURSES in DEV_ALGO ({len(courses)}) ===")
for r in courses:
    print(f"  {r}")

# Check full content of one course
if courses:
    c.execute("SELECT id, title, content, examples, astuces, video_url FROM syllabus_course WHERE subdomain_id='DEV_ALGO' LIMIT 2")
    full = c.fetchall()
    print("\n=== SAMPLE COURSE CONTENT ===")
    for r in full:
        print(f"  ID: {r[0]}")
        print(f"  Title: {r[1]}")
        print(f"  Content (first 200): {str(r[2])[:200]}")
        print(f"  Video URL: {r[5]}")
        print()

conn.close()
