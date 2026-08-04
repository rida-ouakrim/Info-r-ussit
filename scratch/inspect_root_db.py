import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Root db.sqlite3 exists:", os.path.exists('db.sqlite3'))
if os.path.exists('db.sqlite3'):
    print("Size:", os.path.getsize('db.sqlite3'), "bytes")
    conn = sqlite3.connect('db.sqlite3')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    try:
        tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        print("Tables in root db.sqlite3:")
        for t in tables:
            name = t[0]
            count = cursor.execute(f"SELECT COUNT(*) FROM [{name}]").fetchone()[0]
            print(f"  - {name} ({count} rows)")
            if name in ['exams_question', 'questions']:
                print("  Sample questions:")
                rows = cursor.execute(f"SELECT id, question_number, exam_year, question_text FROM [{name}] LIMIT 5").fetchall()
                for r in rows:
                    print(f"    * ID {r[0]} | Q {r[1]} | Year {r[2]} | Text: {r[3][:60]}...")
    except Exception as e:
        print("Error inspecting root db.sqlite3:", e)
    conn.close()
