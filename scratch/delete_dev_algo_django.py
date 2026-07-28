import sqlite3
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE = os.path.join(BASE_DIR, "backend", "db.sqlite3")

print(f"Deleting DEV_ALGO from Django DB: {SQLITE}")
conn = sqlite3.connect(SQLITE)
c = conn.cursor()

# 1. Delete courses belonging to DEV_ALGO subdomain
c.execute("DELETE FROM syllabus_course WHERE subdomain_id='DEV_ALGO'")
print(f"  Deleted syllabus_course for DEV_ALGO: {c.rowcount} rows")

# 2. Delete the DEV_ALGO subdomain itself
c.execute("DELETE FROM syllabus_subdomain WHERE code='DEV_ALGO'")
print(f"  Deleted syllabus_subdomain DEV_ALGO: {c.rowcount} rows")

conn.commit()

# Verify remaining
c.execute("SELECT code, name FROM syllabus_subdomain WHERE domain_id='DEV'")
print("  Remaining DEV subdomains:", c.fetchall())

conn.close()
print("\nDEV_ALGO supprimé avec succès de backend/db.sqlite3 !")
