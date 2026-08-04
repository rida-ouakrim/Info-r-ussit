import sqlite3
import os

def check_db(db_path):
    print(f"=== DB: {db_path} ===")
    if not os.path.exists(db_path):
        print("Does not exist!")
        return
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print("Tables:")
    for t in tables:
        name = t[0]
        count = cursor.execute(f"SELECT COUNT(*) FROM [{name}]").fetchone()[0]
        print(f"  - {name} ({count} rows)")
        if name in ['exams_question', 'syllabus_course', 'courses', 'questions']:
            cols = cursor.execute(f"PRAGMA table_info([{name}])").fetchall()
            print("    Columns:")
            for col in cols:
                print(f"      * {col[1]} ({col[2]})")
    conn.close()

check_db('concours.db')
check_db(os.path.join('backend', 'db.sqlite3'))
