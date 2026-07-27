import sqlite3

conn = sqlite3.connect("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3")
cursor = conn.cursor()

print("=== QUESTIONS BY DOMAIN ===")
cursor.execute("SELECT domain_id, COUNT(*) FROM exams_question GROUP BY domain_id")
for row in cursor.fetchall():
    print(f"Domain: {row[0]} | Count: {row[1]}")

print("\n=== QUESTIONS BY SUBDOMAIN ===")
cursor.execute("SELECT subdomain_id, COUNT(*) FROM exams_question GROUP BY subdomain_id")
for row in cursor.fetchall():
    print(f"Subdomain: {row[0]} | Count: {row[1]}")

conn.close()
