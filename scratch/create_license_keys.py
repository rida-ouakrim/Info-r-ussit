import sqlite3
import random
import string

DB_CONCOURS = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"
DB_BACKEND = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"

def generate_key():
    p1 = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    p2 = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"INFO-{p1}-{p2}"

def insert_keys(db_path, is_backend):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    keys = [generate_key() for _ in range(5)]
    table_name = "authentication_licensekey" if is_backend else "license_keys" # Wait, let's see what the table name in concours.db is
    
    # Check if table exists in concours.db
    if not is_backend:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='license_keys'")
        if not cursor.fetchone():
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='authentication_licensekey'")
            if cursor.fetchone():
                table_name = "authentication_licensekey"
            else:
                print(f"Skipping license keys for {db_path} (no table found)")
                conn.close()
                return []
                
    for k in keys:
        try:
            cursor.execute(f"INSERT INTO {table_name} (key_code, is_used, created_at) VALUES (?, 0, datetime('now'))", (k,))
            print(f"Inserted key '{k}' into {db_path}")
        except Exception as e:
            print(f"Failed to insert key into {db_path}: {e}")
            
    conn.commit()
    conn.close()
    return keys

print("=== GENERATING NEW KEYS ===")
backend_keys = insert_keys(DB_BACKEND, True)
print(f"Created backend keys: {backend_keys}")

conn_concours = sqlite3.connect(DB_CONCOURS)
cursor_concours = conn_concours.cursor()
cursor_concours.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("concours.db tables:")
for t in cursor_concours.fetchall():
    print(t[0])
conn_concours.close()

insert_keys(DB_CONCOURS, False)
