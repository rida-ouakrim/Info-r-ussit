import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

def check_db_for_q(db_path, table_name, is_django):
    print(f"=== DB: {db_path} | Table: {table_name} ===")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    dom_col = "domain_id" if is_django else "domain_code"
    sub_col = "subdomain_id" if is_django else "subdomain_code"
    
    query = f"""
        SELECT id, question_number, exam_year, question_text, {dom_col} as dom, {sub_col} as sub, course_id 
        FROM [{table_name}] 
        WHERE exam_year = 2021 AND (question_number = 'Q8' OR question_number = '8' OR question_number LIKE '%Q8%')
    """
    rows = cursor.execute(query).fetchall()
    
    for r in rows:
        print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: 2021 | Dom: {r['dom']} | Sub: {r['sub']} | Course: {r['course_id']}")
        print(f"  Text: {r['question_text'][:120]}...")
        
    conn.close()

check_db_for_q('backend/db.sqlite3', 'exams_question', is_django=True)
check_db_for_q('concours.db', 'questions', is_django=False)
