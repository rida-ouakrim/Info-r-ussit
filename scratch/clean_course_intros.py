import sqlite3
import re
import os

DB_DJANGO = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"
DB_CONCOURS = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"

def clean_intro(text):
    if not text:
        return text
    # Regex to match the intro paragraph starting with "En tant qu'Expert" or "En tant que" up to "---" or first # heading
    pattern = r"En tant qu'Expert Professeur Formateur.*?(---|# 1\.|\n\n#)"
    cleaned = re.sub(r"En tant qu'Expert Professeur Formateur[^\n]*\n*", "", text, flags=re.DOTALL)
    cleaned = re.sub(r"Elle est conçue pour vous fournir[^\n]*\n*", "", cleaned)
    cleaned = re.sub(r"^\s*---\s*\n*", "", cleaned, flags=re.MULTILINE)
    return cleaned.strip()

print("Cleaning Django DB...")
conn = sqlite3.connect(DB_DJANGO)
c = conn.cursor()
c.execute("SELECT id, content FROM syllabus_course")
rows = c.fetchall()
cleaned_count = 0
for row_id, content in rows:
    if content and "En tant qu'Expert" in content:
        new_content = clean_intro(content)
        c.execute("UPDATE syllabus_course SET content = ? WHERE id = ?", (new_content, row_id))
        cleaned_count += 1
conn.commit()
conn.close()
print(f"Cleaned {cleaned_count} courses in Django DB.")

if os.path.exists(DB_CONCOURS):
    print("Cleaning Concours DB...")
    conn = sqlite3.connect(DB_CONCOURS)
    c = conn.cursor()
    c.execute("SELECT id, content FROM courses")
    rows = c.fetchall()
    cleaned_count = 0
    for row_id, content in rows:
        if content and "En tant qu'Expert" in content:
            new_content = clean_intro(content)
            c.execute("UPDATE courses SET content = ? WHERE id = ?", (new_content, row_id))
            cleaned_count += 1
    conn.commit()
    conn.close()
    print(f"Cleaned {cleaned_count} courses in Concours DB.")
