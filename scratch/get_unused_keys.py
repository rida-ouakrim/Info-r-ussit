import sqlite3

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT key_code FROM authentication_licensekey WHERE is_used=0")
rows = cursor.fetchall()
print("=== UNUSED LICENSE KEYS ===")
for r in rows:
    print(r[0])

conn.close()
