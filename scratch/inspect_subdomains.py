import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("SELECT id, name, domain_id FROM syllabus_subdomain")
print("Subdomains:")
for row in cursor.fetchall():
    print(row)

print("\nCourses per Subdomain:")
cursor.execute("SELECT subdomain_id, COUNT(*) FROM syllabus_course GROUP BY subdomain_id")
for row in cursor.fetchall():
    print(row)

conn.close()
