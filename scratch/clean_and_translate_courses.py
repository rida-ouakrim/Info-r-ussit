"""
clean_and_translate_courses.py
===============================
Cleans and translates Sciences de l'Éducation courses (IDs 36-39) in backend/db.sqlite3:
  1. Removes HTML break tags (<br/>, <br>, etc.) and cleans up formatting.
  2. Translates comparative tables in content_fr to pure French.
  3. Translates comparative tables in content_ar to pure Arabic.
  4. Translates Section 4 (Analyse des Questions & Pièges) in content_fr to pure French.
  5. Translates Section 4 in content_ar to pure Arabic.
  6. Keeps technical terms (Piaget, Vygotsky, ZPD, etc.) unchanged.
  7. Updates the database.
"""

import os
import sys
import re
import sqlite3
import time
import json

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from google import genai
from google.genai import types

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass

# === CONFIG ===
VERTEX_PROJECT = "chrome-backbone-496013-p4"
LOCATIONS = ["us-central1", "us-east4", "europe-west1", "asia-northeast1"]
COURSE_IDS = [36, 37, 38, 39]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "..", "backend", "db.sqlite3")


def remove_html_tags(text: str) -> str:
    """Removes HTML break tags and formatting tags while keeping text structure."""
    if not text:
        return text
    
    # Replace <br/> or <br> or <br > with a space or newline depending on context
    # In table cells, replace with a space/comma or small dash for clean readability
    text = re.sub(r'<br\s*/?>\s*\*?', ' - ', text)
    
    # Replace other HTML tags if any
    text = re.sub(r'<[^>]+>', '', text)
    
    return text.strip()


def translate_with_gemini(text: str, target_lang: str) -> str:
    """Translates content or tables to target_lang using Gemini Flash."""
    if not text or len(text.strip()) < 10:
        return text

    lang_instructions = {
        "fr": "Translate all Arabic text, tables, headers, questions, and explanations in this document into PURE, grammatically correct French. Keep French text unchanged. Keep names and technical concepts (e.g. Piaget, Skinner, ZPD) unchanged.",
        "ar": "Translate all French text, tables, headers, questions, and explanations in this document into PURE, academically correct Arabic. Keep Arabic text unchanged. Keep names and technical concepts in parentheses (e.g., (Piaget), (ZPD)) unchanged."
    }

    prompt = f"""You are an expert academic translator specializing in Sciences de l'Éducation (sciences of education and pedagogy) in Morocco.

Task: {lang_instructions[target_lang]}

Rules:
- Keep the exact markdown formatting (headers, bold, lists, tables).
- Maintain all table columns and rows, but translate the cell values completely.
- Keep numbers, year numbers, and question references (like [Q72]) unchanged.
- Do NOT translate names of theorists (e.g. keep Pavlov, Skinner, Vygotsky, Piaget) but you can write them in {target_lang} if they are written in the other language, or keep their latin representation.
- Ensure the tone is highly professional and academic.
- Do NOT include any meta-commentary, notes, or intros. Return only the translated markdown.

CONTENT TO TRANSLATE:
{text}
"""

    for model_name in ["gemini-2.5-flash", "gemini-2.5-pro"]:
        for loc in LOCATIONS:
            try:
                client = genai.Client(
                    vertexai=True,
                    project=VERTEX_PROJECT,
                    location=loc,
                    http_options=types.HttpOptions(timeout=180000),
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(temperature=0.1),
                )
                if response.text and len(response.text.strip()) > 10:
                    return response.text.strip()
            except Exception as e:
                print(f"    ⚠ Attempt failed with {model_name}@{loc}: {e}")
                time.sleep(3)
    
    return text


def clean_and_process_course(course_id: int):
    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("SELECT id, title, content_ar, content_fr FROM syllabus_course WHERE id = ?", (course_id,))
    row = c.fetchone()
    if not row:
        print(f"✗ Course {course_id} not found in DB")
        conn.close()
        return

    title = row['title']
    content_ar = row['content_ar'] or ''
    content_fr = row['content_fr'] or ''

    print(f"\n{'='*70}")
    print(f"Processing Course {course_id}: {title}")

    # Step 1: Clean HTML tags first
    cleaned_ar = remove_html_tags(content_ar)
    cleaned_fr = remove_html_tags(content_fr)

    # Step 2: Separate markdown sections for translation
    # Translate comparative tables and question sections separately to preserve structure and avoid context limits
    
    def process_sections(content: str, lang: str) -> str:
        # Split text by major markdown headings
        sections = re.split(r'(\n##\s+)', content)
        processed_parts = []
        
        # The first part is the H1/intro before the first H2
        if sections:
            processed_parts.append(sections[0])
            
        i = 1
        while i < len(sections):
            heading_marker = sections[i]  # '\n## '
            section_body = sections[i+1] if i+1 < len(sections) else ''
            
            # Find the heading title (first line)
            heading_lines = section_body.split('\n', 1)
            heading_title = heading_lines[0].strip()
            body_content = heading_lines[1] if len(heading_lines) > 1 else ''
            
            print(f"   -> Processing section: ## {heading_title[:50]} ({lang.upper()})")
            
            # Translate tables or sections that need it
            # We translate Tableaux Comparatifs (section 3), Analyse des Questions (section 4), and Glossaire (section 6)
            is_table_section = "tableau" in heading_title.lower() or "جدول" in heading_title or "comparatif" in heading_title.lower()
            is_question_section = "analyse" in heading_title.lower() or "تحليل" in heading_title or "questions" in heading_title.lower()
            is_glossary_section = "glossaire" in heading_title.lower() or "مصطلحات" in heading_title
            
            # Wait! If section 4 is empty or missing in FR, we should populate it using AR version's translation
            if is_question_section and lang == 'fr' and len(body_content.strip().replace('-', '').replace('\n', '')) < 20:
                print("      ⚠️ Section 4 is empty/missing in FR. Populating by translating AR version...")
                # Get the corresponding section 4 from content_ar
                ar_sec4_body = ""
                ar_sections = re.split(r'(\n##\s+)', content_ar)
                j = 1
                while j < len(ar_sections):
                    ar_title = ar_sections[j+1].split('\n', 1)[0].strip()
                    if "تحليل" in ar_title or "questions" in ar_title.lower() or "analyse" in ar_title.lower():
                        ar_sec4_body = ar_sections[j+1].split('\n', 1)[1] if len(ar_sections[j+1].split('\n', 1)) > 1 else ''
                        break
                    j += 2
                
                if ar_sec4_body:
                    translated_body = translate_with_gemini(ar_sec4_body, "fr")
                    body_content = "\n" + translated_body
                else:
                    body_content = "\n" + translate_with_gemini(body_content, lang)
            elif is_table_section or is_question_section or is_glossary_section or ("بالفرنسية" in body_content) or ("بالعربية" in body_content):
                # Translate this section body
                translated_body = translate_with_gemini(body_content, lang)
                body_content = "\n" + translated_body
            else:
                body_content = "\n" + body_content
                
            processed_parts.append(heading_marker + heading_title + body_content)
            i += 2
            
        return "".join(processed_parts)

    print("\n📚 Translating/Refining French version...")
    final_fr = process_sections(cleaned_fr, 'fr')
    
    print("\n📚 Translating/Refining Arabic version...")
    final_ar = process_sections(cleaned_ar, 'ar')

    # Double clean HTML tags on final outputs just in case
    final_fr = remove_html_tags(final_fr)
    final_ar = remove_html_tags(final_ar)

    # Save to database
    c.execute(
        "UPDATE syllabus_course SET content_ar = ?, content_fr = ? WHERE id = ?",
        (final_ar, final_fr, course_id)
    )
    conn.commit()
    conn.close()
    print(f"\n✅ Course {course_id} cleaned and updated in DB")


def main():
    print("🚀 Starting clean-up & translation of comparative tables and Section 4...\n")
    for cid in COURSE_IDS:
        clean_and_process_course(cid)
        time.sleep(3)
        
    print("\n🎉 Verification of lengths:")
    conn = sqlite3.connect(DB_DJANGO)
    c = conn.cursor()
    c.execute("SELECT id, length(content_ar), length(content_fr) FROM syllabus_course WHERE id BETWEEN 36 AND 39")
    for r in c.fetchall():
        print(f"  Course {r[0]}: AR={r[1]} chars | FR={r[2]} chars")
    conn.close()


if __name__ == '__main__':
    main()
