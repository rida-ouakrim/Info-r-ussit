import sqlite3
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH  = os.path.join(BASE_DIR, "concours.db")
SQLITE   = os.path.join(BASE_DIR, "backend", "db.sqlite3")

def delete_algo(path, domain_t="syllabus_domains", subdomain_t="syllabus_subdomains", course_t="courses"):
    print(f"\n=== DB: {path} ===")
    if not os.path.exists(path):
        print("  [NOT FOUND]")
        return

    conn = sqlite3.connect(path)
    c = conn.cursor()

    # Delete courses belonging to DEV_ALGO subdomain
    try:
        c.execute(f"DELETE FROM {course_t} WHERE subdomain_code='DEV_ALGO'")
        print(f"  Courses deleted (subdomain_code=DEV_ALGO): {c.rowcount} rows")
    except Exception as e:
        print(f"  courses subdomain_code: {e}")

    try:
        c.execute(f"DELETE FROM {course_t} WHERE subdomain_id=(SELECT code FROM {subdomain_t} WHERE code='DEV_ALGO')")
        print(f"  Courses deleted via subquery: {c.rowcount} rows")
    except Exception as e:
        print(f"  courses subquery: {e}")

    # Delete subdomain DEV_ALGO
    try:
        c.execute(f"DELETE FROM {subdomain_t} WHERE code='DEV_ALGO'")
        print(f"  Subdomain DEV_ALGO deleted: {c.rowcount} rows")
    except Exception as e:
        print(f"  subdomain delete: {e}")

    conn.commit()

    # Verify
    c.execute(f"SELECT code, name FROM {subdomain_t} WHERE domain_code='DEV'")
    remaining = c.fetchall()
    print("  Remaining DEV subdomains:", remaining)

    conn.close()
    print(f"  Done: {path}")

delete_algo(DB_PATH)
delete_algo(SQLITE)
print("\nDEV_ALGO supprimé avec succès!")
