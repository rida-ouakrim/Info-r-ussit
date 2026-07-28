"""
Script pour restaurer DEV_ALGO dans concours.db COTE SERVEUR.
A executer sur le VPS après le git pull:
  python backend/restore_algo_server.py
"""
import sqlite3, sys, os
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE, "backend", "db.sqlite3")
CONCOURS_DB = os.path.join(BASE, "concours.db")

print(f"Django DB: {DJANGO_DB}")
print(f"Concours DB: {CONCOURS_DB}")

# 1. Read DEV_ALGO data from Django DB
django_conn = sqlite3.connect(DJANGO_DB)
dc = django_conn.cursor()

dc.execute("SELECT code, name, domain_id, description FROM syllabus_subdomain WHERE code='DEV_ALGO'")
subdomain = dc.fetchone()
if not subdomain:
    print("ERROR: DEV_ALGO not found in Django DB!")
    sys.exit(1)

print(f"Source subdomain: {subdomain}")

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
    print("Inserted DEV_ALGO subdomain")
else:
    print("DEV_ALGO subdomain already exists")

# Clean + insert courses
cc.execute("DELETE FROM courses WHERE subdomain_code='DEV_ALGO'")
for title, content, examples, astuces, video_url in courses:
    cc.execute(
        "INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url) VALUES (?, ?, ?, ?, ?, ?)",
        ('DEV_ALGO', title, content, examples, astuces, video_url)
    )

concours_conn.commit()
print(f"Inserted {len(courses)} DEV_ALGO courses into concours.db")

# Verify
cc.execute("SELECT title FROM courses WHERE subdomain_code='DEV_ALGO'")
print(f"\nVerification - DEV_ALGO courses:")
for r in cc.fetchall():
    print(f"  - {r[0]}")

concours_conn.close()
print("\n✅ DEV_ALGO restored successfully on server!")
