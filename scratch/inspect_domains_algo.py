import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "concours.db")
SQLITE_PATH = os.path.join(BASE_DIR, "backend", "db.sqlite3")

def inspect_db(path):
    print(f"=== Inspecting {path} ===")
    if not os.path.exists(path):
        print("Path does not exist")
        return
    conn = sqlite3.connect(path)
    c = conn.cursor()
    c.execute("SELECT id, code, name FROM main_domain")
    domains = c.fetchall()
    print("DOMAINS:")
    for d in domains:
        print(d)
        c.execute("SELECT id, code, name FROM main_subdomain WHERE domain_id = ?", (d[0],))
        subs = c.fetchall()
        for s in subs:
            print("   --> Subdomain:", s)
    conn.close()

inspect_db(DB_PATH)
inspect_db(SQLITE_PATH)
