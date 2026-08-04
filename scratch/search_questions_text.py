import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_db(db_path, table_name, query_term, is_django):
    print(f"=== {db_path} | Query: {query_term} ===")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    dom_col = "domain_id" if is_django else "domain_code"
    sub_col = "subdomain_id" if is_django else "subdomain_code"
    
    query = f"""
        SELECT id, question_number, exam_year, question_text, {dom_col} as dom, {sub_col} as sub, course_id 
        FROM [{table_name}] 
        WHERE question_text LIKE ?
    """
    rows = cursor.execute(query, (f"%{query_term}%",)).fetchall()
    
    for r in rows[:15]:
        print(f"  ID: {r['id']} | Q: {r['question_number']} | Year: {r['exam_year']} | Dom: {r['dom']} | Sub: {r['sub']} | Course: {r['course_id']}")
        print(f"  Text: {r['question_text'][:120]}...")
    print(f"Total found: {len(rows)}\n")
    conn.close()

search_db('concours.db', 'questions', 'savoir', is_django=False)
search_db('concours.db', 'questions', 'pédagogique', is_django=False)
search_db('concours.db', 'questions', 'évaluation', is_django=False)
search_db('concours.db', 'questions', 'travaux', is_django=False)
