"""
Restore DEV_ALGO data into concours.db from the restored backend/db.sqlite3
"""
import sqlite3, sys, os
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE) if os.path.basename(BASE) == 'scratch' else BASE

DJANGO_DB = os.path.join(ROOT, "backend", "db.sqlite3")
CONCOURS_DB = os.path.join(ROOT, "concours.db")

# 1. Read DEV_ALGO data from Django DB
django_conn = sqlite3.connect(DJANGO_DB)
dc = django_conn.cursor()

# Get subdomain info
dc.execute("SELECT code, name, domain_id, description FROM syllabus_subdomain WHERE code='DEV_ALGO'")
subdomain = dc.fetchone()
print(f"Source subdomain: {subdomain}")

# Get courses
dc.execute("SELECT title, content, examples, astuces, video_url FROM syllabus_course WHERE subdomain_id='DEV_ALGO'")
courses = dc.fetchall()
print(f"Source courses: {len(courses)}")

django_conn.close()

# 2. Insert into concours.db
concours_conn = sqlite3.connect(CONCOURS_DB)
cc = concours_conn.cursor()

# Check if DEV_ALGO subdomain exists
cc.execute("SELECT code FROM syllabus_subdomains WHERE code='DEV_ALGO'")
if not cc.fetchone():
    cc.execute(
        "INSERT INTO syllabus_subdomains (code, name, domain_code, description) VALUES (?, ?, ?, ?)",
        ('DEV_ALGO', subdomain[1], subdomain[2], subdomain[3])
    )
    print("Inserted DEV_ALGO subdomain into concours.db")
else:
    print("DEV_ALGO subdomain already exists in concours.db")

# Delete existing DEV_ALGO courses (if any partial)
cc.execute("DELETE FROM courses WHERE subdomain_code='DEV_ALGO'")
print(f"Cleaned {cc.rowcount} existing DEV_ALGO courses")

# Insert courses
for title, content, examples, astuces, video_url in courses:
    cc.execute(
        "INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url) VALUES (?, ?, ?, ?, ?, ?)",
        ('DEV_ALGO', title, content, examples, astuces, video_url)
    )

concours_conn.commit()
print(f"Inserted {len(courses)} DEV_ALGO courses into concours.db")

# Verify
cc.execute("SELECT DISTINCT subdomain_code FROM courses WHERE subdomain_code LIKE 'DEV%'")
print(f"\nAll DEV subdomain_codes in concours.db: {cc.fetchall()}")

cc.execute("SELECT title FROM courses WHERE subdomain_code='DEV_ALGO'")
print(f"DEV_ALGO courses in concours.db:")
for r in cc.fetchall():
    print(f"  - {r[0]}")

concours_conn.close()
print("\n✅ DEV_ALGO fully restored in concours.db!")
