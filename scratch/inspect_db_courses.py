import sqlite3
import os

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# List courses
cursor.execute("SELECT id, title, subdomain_code FROM courses")
rows = cursor.fetchall()
print("=== COURSES ===")
for r in rows:
    print(f"ID: {r[0]} | Title: {r[1]} | Subdomain: {r[2]}")

print("\n=== SEARCHING FOR BDR / RELATIONNEL / JOIN / GPI ===")
cursor.execute("SELECT id, title, content, examples, astuces FROM courses WHERE title LIKE '%Relationnel%' OR content LIKE '%pmatrix%' OR content LIKE '%SELF JOIN%' OR title LIKE '%GPI%'")
for r in cursor.fetchall():
    print(f"ID: {r[0]} | Title: {r[1]}")
    print("Content preview:")
    print(r[2][:300] if r[2] else "None")
    print("-" * 50)

conn.close()
