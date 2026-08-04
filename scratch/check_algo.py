import sqlite3, sys, os
sys.stdout.reconfigure(encoding='utf-8')

db_path = os.path.join("backend", "db.sqlite3")
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Check for DEV_ALGO subdomain
c.execute("SELECT code, name, domain_id FROM syllabus_subdomain WHERE code='DEV_ALGO'")
rows = c.fetchall()
print("=== SUBDOMAIN DEV_ALGO ===")
for r in rows:
    print(f"  {r}")
if not rows:
    print("  (NOT FOUND)")

# Check courses
c.execute("SELECT id, title, subdomain_id FROM syllabus_course WHERE subdomain_id='DEV_ALGO'")
courses = c.fetchall()
print(f"\n=== COURSES in DEV_ALGO ({len(courses)}) ===")
for r in courses:
    print(f"  {r}")

# Also show all subdomains for DEV domain
c.execute("SELECT code, name FROM syllabus_subdomain WHERE domain_id='DEV'")
print("\n=== ALL DEV SUBDOMAINS ===")
for r in c.fetchall():
    print(f"  {r}")

conn.close()
