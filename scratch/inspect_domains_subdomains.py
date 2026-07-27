import sqlite3

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT code, name FROM syllabus_domain")
print("=== DOMAINS ===")
for r in cursor.fetchall():
    print(f"Code: {r[0]} | Name: {r[1]}")

cursor.execute("SELECT code, name, domain_id FROM syllabus_subdomain")
print("\n=== SUBDOMAINS ===")
for r in cursor.fetchall():
    print(f"Code: {r[0]} | Name: {r[1]} | Domain: {r[2]}")

conn.close()
