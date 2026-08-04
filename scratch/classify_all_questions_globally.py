import os
import sys
import json
import time
import sqlite3
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# Setup encoding
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DJANGO = os.path.join(BASE_DIR, "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(BASE_DIR, "concours.db")

VERTEX_PROJECT = "chrome-backbone-496013-p4"
VERTEX_LOCATION = "us-central1"

# Pydantic Schema for Gemini response
class QuestionMapping(BaseModel):
    question_id: int = Field(description="The ID of the question.")
    course_id: int = Field(description="The ID of the selected course from the syllabus.")
    reasoning: str = Field(description="Brief 1-sentence reasoning for this classification.")

class BatchClassification(BaseModel):
    mappings: List[QuestionMapping] = Field(description="List of classified question mappings.")

def build_courses_prompt_string(courses):
    # Group courses by subdomain
    grouped = {}
    for c in courses:
        sub = c['subdomain_name']
        if sub not in grouped:
            grouped[sub] = []
        grouped[sub].append(c)
        
    lines = []
    for sub, course_list in grouped.items():
        lines.append(f"\n--- Subdomain: {sub} ---")
        for c in course_list:
            lines.append(f"  * Course ID {c['id']}: {c['title']}")
    return "\n".join(lines)

def classify_batch(client, batch, courses_str):
    questions_list = []
    for q in batch:
        q_info = (
            f"Question ID: {q['id']}\n"
            f"Text: {q['question_text']}\n"
            f"Options: A) {q['option_a']}, B) {q['option_b']}, C) {q['option_c']}, D) {q['option_d']}\n"
            f"Current Subdomain (could be incorrect!): {q['subdomain_id']}\n"
            f"Explanation: {q['explanation'] or ''}\n"
            f"----------------------------------------"
        )
        questions_list.append(q_info)
        
    questions_str = "\n\n".join(questions_list)
    
    prompt = (
        f"You are an expert Computer Science Professor and Examiner.\n"
        f"We have detected some questions are classified under the wrong subdomain. You must classify each question into the correct course using the complete syllabus below.\n\n"
        f"--- SYLLABUS COURSES ---\n"
        f"{courses_str}\n\n"
        f"--- QUESTIONS TO CLASSIFY ---\n"
        f"{questions_str}\n\n"
        f"Task: For each question, select the SINGLE most relevant course ID from the syllabus courses list. Do not rely blindly on the current subdomain if the question text clearly belongs to a different subject (e.g. POO/Java, SQL, Scrum, Networks, etc.). Return only valid course IDs."
    )
    
    retries = 4
    for attempt in range(retries):
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=BatchClassification,
                    temperature=0.1,
                ),
            )
            return json.loads(resp.text).get("mappings", [])
        except Exception as e:
            print(f"    ✗ Attempt {attempt+1} failed: {e}")
            time.sleep(10 * (attempt + 1))
            
    return []

def main():
    if not os.path.exists(DB_DJANGO):
        print(f"Django DB not found at {DB_DJANGO}")
        return
        
    # Init Gemini client
    try:
        client = genai.Client(
            vertexai=True, project=VERTEX_PROJECT, location=VERTEX_LOCATION,
            http_options=types.HttpOptions(timeout=180000),
        )
        print("✓ Gemini client ready.")
    except Exception as e:
        print(f"✗ Gemini init failed: {e}")
        return

    # Connect to databases
    conn_django = sqlite3.connect(DB_DJANGO)
    conn_django.row_factory = sqlite3.Row
    cursor_django = conn_django.cursor()
    
    conn_concours = sqlite3.connect(DB_CONCOURS)
    conn_concours.row_factory = sqlite3.Row
    cursor_concours = conn_concours.cursor()

    # Load all courses with their subdomains and domains
    courses = [dict(row) for row in cursor_django.execute("""
        SELECT c.id, c.title, c.subdomain_id, s.name as subdomain_name, s.domain_id
        FROM syllabus_course c
        JOIN syllabus_subdomain s ON c.subdomain_id = s.code
    """).fetchall()]
    
    course_map = {c['id']: c for c in courses}
    courses_prompt_str = build_courses_prompt_string(courses)
    
    # Load all questions
    questions = [dict(row) for row in cursor_django.execute(
        "SELECT id, question_text, option_a, option_b, option_c, option_d, explanation, subdomain_id "
        "FROM exams_question"
    ).fetchall()]
    
    print(f"Loaded {len(questions)} questions from exams_question.")
    
    batch_size = 15
    batches = [questions[i:i + batch_size] for i in range(0, len(questions), batch_size)]
    
    total_updated = 0
    
    for idx, batch in enumerate(batches):
        print(f"Processing batch {idx+1}/{len(batches)} (Size: {len(batch)})...")
        mappings = classify_batch(client, batch, courses_prompt_str)
        
        batch_updated = 0
        for m in mappings:
            q_id = m.get('question_id')
            c_id = m.get('course_id')
            
            if q_id and c_id and c_id in course_map:
                c_info = course_map[c_id]
                new_subdomain = c_info['subdomain_id']
                new_domain = c_info['domain_id']
                
                # Fetch original question info to check if changed
                orig = cursor_django.execute(
                    "SELECT subdomain_id, course_id FROM exams_question WHERE id = ?", (q_id,)
                ).fetchone()
                
                if orig:
                    # Update Django DB
                    cursor_django.execute("""
                        UPDATE exams_question 
                        SET course_id = ?, subdomain_id = ?, domain_id = ?
                        WHERE id = ?
                    """, (c_id, new_subdomain, new_domain, q_id))
                    
                    # Fetch question text to update legacy concours.db
                    q_text = cursor_django.execute(
                        "SELECT question_text FROM exams_question WHERE id = ?", (q_id,)
                    ).fetchone()
                    
                    if q_text:
                        cursor_concours.execute("""
                            UPDATE questions 
                            SET course_id = ?, subdomain_code = ?, domain_code = ?
                            WHERE question_text = ?
                        """, (c_id, new_subdomain, new_domain, q_text['question_text']))
                        
                    if orig['course_id'] != c_id or orig['subdomain_id'] != new_subdomain:
                        batch_updated += 1
                        total_updated += 1
                        
        conn_django.commit()
        conn_concours.commit()
        print(f"  ✓ Applied {batch_updated} re-classifications in this batch.")
        
        # Cooldown
        time.sleep(2)
        
    conn_django.close()
    conn_concours.close()
    
    print(f"\n🎉 Finished global re-classification! Total questions corrected/updated: {total_updated}")

if __name__ == '__main__':
    main()
