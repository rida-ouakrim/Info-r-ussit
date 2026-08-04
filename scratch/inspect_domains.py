import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

rows = cursor.execute("SELECT * FROM syllabus_domain").fetchall()
print("Domains in Django DB:")
for r in rows:
    print(f"  Code: {r['code']} | Name: {r['name']}")
    
conn.close()
