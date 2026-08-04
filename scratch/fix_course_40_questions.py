import os
import sys
import json
import time
import sqlite3
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Setup encoding
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DJANGO = os.path.join(BASE_DIR, "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(BASE_DIR, "concours.db")

VERTEX_PROJECT = "chrome-backbone-496013-p4"
VERTEX_LOCATION = "us-central1"

class QuestionMapping(BaseModel):
    course_id: int = Field(description="The correct course ID from the syllabus.")
    reasoning: str = Field(description="Brief reasoning for this classification.")

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

    # Load all courses
    courses = [dict(row) for row in cursor_django.execute("""
        SELECT c.id, c.title, c.subdomain_id, s.name as subdomain_name, s.domain_id
        FROM syllabus_course c
        JOIN syllabus_subdomain s ON c.subdomain_id = s.code
    """).fetchall()]
    
    course_map = {c['id']: c for c in courses}
    
    # Format courses list
    courses_str_list = []
    for c in courses:
        courses_str_list.append(f"  * Course ID {c['id']} (Subdomain {c['subdomain_id']}): {c['title']}")
    courses_str = "\n".join(courses_str_list)

    # Fetch questions currently in course_id = 40 (Introduction to Algorithms)
    questions = [dict(row) for row in cursor_django.execute(
        "SELECT id, question_number, exam_year, question_text, explanation, subdomain_id "
        "FROM exams_question WHERE course_id = 40"
    ).fetchall()]
    
    print(f"Found {len(questions)} questions in Course 40.")
    
    updated_count = 0
    
    for q in questions:
        print(f"\nRe-evaluating Question ID {q['id']} (Q: {q['question_number']} | Year: {q['exam_year']})")
        print(f"Text: {q['question_text'][:150]}...")
        
        prompt = (
            f"You are an expert Computer Science Professor and Examiner.\n"
            f"We are fixing misclassified questions. Many questions were wrongly assigned to Course 40 ('01. Introduction à l'Algorithmique et Notions de Base').\n\n"
            f"Syllabus Courses:\n"
            f"{courses_str}\n\n"
            f"Here is the question to re-classify:\n"
            f"Text: {q['question_text']}\n"
            f"Explanation: {q['explanation'] or ''}\n\n"
            f"Strict Instructions:\n"
            f"1. DO NOT select Course 40 (ID 40) unless the question is extremely basic (e.g. naming the three structures, definition of algorithm, basic variable assignment).\n"
            f"2. If the question involves loops (boucles, Pour, Tant Que, arrays trace), choose Course 44 ('05. Structures Itératives et Boucles').\n"
            f"3. If the question involves arrays (tableaux, matrices), choose Course 45 ('06. Les Tableaux').\n"
            f"4. If the question is about didactique, pedagogy, student errors, evaluation, objectives, MOOCs, or teaching methods, it MUST be classified under Didactique (courses 29 to 35) or Sciences de l'Éducation (courses 36 to 39) - e.g. Course 34 for PPO/APC, Course 31 for situations, Course 30 for student representations/obstacles.\n"
            f"5. If the question involves Huffman coding or data compression, it is a compression algorithm topic, choose Course 52 (Arbres/ABR) or Course 49 (Piles/Files/Listes) or Course 28 (Powerpoint/multimedia) if it's media compression.\n"
            f"Return the correct course ID."
        )
        
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=QuestionMapping,
                    temperature=0.1,
                ),
            )
            
            mapping = json.loads(resp.text)
            c_id = mapping.get("course_id")
            
            if c_id and c_id in course_map:
                c_info = course_map[c_id]
                new_subdomain = c_info['subdomain_id']
                new_domain = c_info['domain_id']
                
                if c_id != 40:
                    print(f"  -> Reclassified from 40 to {c_id} ({c_info['title']})")
                    
                    # Update Django DB
                    cursor_django.execute("""
                        UPDATE exams_question 
                        SET course_id = ?, subdomain_id = ?, domain_id = ?
                        WHERE id = ?
                    """, (c_id, new_subdomain, new_domain, q['id']))
                    
                    # Update legacy concours.db
                    cursor_concours.execute("""
                        UPDATE questions 
                        SET course_id = ?, subdomain_code = ?, domain_code = ?
                        WHERE question_text = ?
                    """, (c_id, new_subdomain, new_domain, q['question_text']))
                    
                    updated_count += 1
                else:
                    print(f"  -> Retained in Course 40 ({c_info['title']})")
            else:
                print("  -> Invalid course ID returned.")
        except Exception as e:
            print(f"  -> Error reclassifying: {e}")
            
    conn_django.commit()
    conn_concours.commit()
    
    conn_django.close()
    conn_concours.close()
    
    print(f"\n🎉 Finished re-classification of Course 40! Total corrected: {updated_count}")

if __name__ == '__main__':
    main()
