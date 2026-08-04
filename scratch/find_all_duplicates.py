import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/db.sqlite3')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all questions
rows = cursor.execute("""
    SELECT id, question_number, exam_year, question_text, domain_id
    FROM exams_question 
    ORDER BY exam_year, CAST(SUBSTR(question_number, 2) AS INTEGER), id
""").fetchall()

grouped = {}
for r in rows:
    key = (r['exam_year'], r['question_number'], r['domain_id'])
    if key not in grouped:
        grouped[key] = []
    grouped[key].append(r)

print("Duplicates found across all years:")
duplicate_ids_to_delete = []
for key, q_list in grouped.items():
    if len(q_list) > 1:
        year, num, dom = key
        print(f"Year: {year} | Q: {num} | Dom: {dom} ({len(q_list)} occurrences)")
        # Keep the first one (lowest ID), mark others for deletion
        for q in q_list[1:]:
            print(f"  -> Duplicate ID: {q['id']} | Text: {q['question_text'][:80]}...")
            duplicate_ids_to_delete.append(q['id'])

print(f"\nTotal duplicate rows to delete: {len(duplicate_ids_to_delete)}")
print(f"Duplicate IDs: {duplicate_ids_to_delete}")

conn.close()
