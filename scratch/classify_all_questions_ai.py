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

# Pydantic Schemas
class QuestionMapping(BaseModel):
    question_id: int = Field(description="The ID of the question being classified.")
    course_id: int = Field(description="The ID of the selected course that this question belongs to.")
    reasoning: str = Field(description="A brief 1-sentence explanation of why this question fits this course.")

class BatchClassification(BaseModel):
    mappings: List[QuestionMapping] = Field(description="List of question-to-course mappings.")

def classify_subdomain_questions(client, subdomain_code, courses, questions):
    print(f"\nClassifying {len(questions)} questions for subdomain '{subdomain_code}'...")
    
    # Format courses list for the prompt
    courses_str = "\n".join([f"- ID {c['id']}: {c['title']}" for c in courses])
    
    # Batch size
    batch_size = 15
    batches = [questions[i:i + batch_size] for i in range(0, len(questions), batch_size)]
    
    mappings = []
    
    for idx, batch in enumerate(batches):
        print(f"  Processing batch {idx+1}/{len(batches)} (Size: {len(batch)})...")
        
        # Format questions for the prompt
        questions_list = []
        for q in batch:
            q_info = (
                f"Question ID: {q['id']}\n"
                f"Text: {q['question_text']}\n"
                f"Options: A) {q['option_a']}, B) {q['option_b']}, C) {q['option_c']}, D) {q['option_d']}\n"
                f"Explanation: {q['explanation'] or ''}\n"
                f"Astuce: {q['astuce'] or ''}\n"
                f"----------------------------------------"
            )
            questions_list.append(q_info)
            
        questions_str = "\n\n".join(questions_list)
        
        prompt = (
            f"You are an expert Computer Science Professor and Examiner.\n"
            f"Classify the following Moroccan teacher certification multiple-choice questions into one of the available syllabus courses.\n\n"
            f"--- AVAILABLE COURSES FOR SUBDOMAIN '{subdomain_code}' ---\n"
            f"{courses_str}\n\n"
            f"--- QUESTIONS TO CLASSIFY ---\n"
            f"{questions_str}\n\n"
            f"Task: For each question, select the SINGLE most relevant course ID from the available courses list. If there is no exact fit, select the closest logical match. Never return a course ID that is not in the available courses list."
        )
        
        retries = 3
        success = False
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
                
                batch_mappings = json.loads(resp.text).get("mappings", [])
                mappings.extend(batch_mappings)
                success = True
                print(f"    ✓ Batch {idx+1} classified successfully ({len(batch_mappings)} mappings).")
                break
            except Exception as e:
                print(f"    ✗ Attempt {attempt+1} failed: {e}")
                time.sleep(5)
                
        if not success:
            print(f"    ⚠️ Skipping classification for batch {idx+1}.")
            
        # Cooldown to avoid hitting rate limits
        time.sleep(2)
        
    return mappings

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

    # Load all subdomains
    subdomains = [row['code'] for row in cursor_django.execute("SELECT code FROM syllabus_subdomain").fetchall()]
    
    total_updated = 0
    
    for sub in subdomains:
        # Load courses for this subdomain
        courses = [dict(row) for row in cursor_django.execute(
            "SELECT id, title FROM syllabus_course WHERE subdomain_id = ?", (sub,)
        ).fetchall()]
        
        if not courses:
            print(f"No courses found for subdomain {sub}, skipping.")
            continue
            
        # Load questions for this subdomain
        questions = [dict(row) for row in cursor_django.execute(
            "SELECT id, question_text, option_a, option_b, option_c, option_d, explanation, astuce "
            "FROM exams_question WHERE subdomain_id = ? AND (course_id IS NULL OR course_id = '')", (sub,)
        ).fetchall()]
        
        if not questions:
            print(f"All questions classified for subdomain {sub}.")
            continue
            
        # Run classification
        mappings = classify_subdomain_questions(client, sub, courses, questions)
        
        # Apply updates
        valid_course_ids = {c['id'] for c in courses}
        subdomain_updated = 0
        
        for m in mappings:
            q_id = m.get('question_id')
            c_id = m.get('course_id')
            
            if q_id and c_id:
                if c_id not in valid_course_ids:
                    print(f"  ⚠️ Warning: AI returned invalid course ID {c_id} for question {q_id}. Skipping.")
                    continue
                    
                # Update Django DB
                cursor_django.execute(
                    "UPDATE exams_question SET course_id = ? WHERE id = ?", (c_id, q_id)
                )
                
                # Fetch question text to update legacy concours.db as well
                q_text = cursor_django.execute(
                    "SELECT question_text FROM exams_question WHERE id = ?", (q_id,)
                ).fetchone()
                
                if q_text:
                    cursor_concours.execute(
                        "UPDATE questions SET course_id = ? WHERE question_text = ?", (c_id, q_text['question_text'])
                    )
                    
                subdomain_updated += 1
                total_updated += 1
                
        conn_django.commit()
        conn_concours.commit()
        print(f"✓ Applied {subdomain_updated} updates for subdomain {sub}.")
        
    conn_django.close()
    conn_concours.close()
    
    print(f"\n🎉 Finished! Total classified questions updated: {total_updated}")

if __name__ == '__main__':
    main()
