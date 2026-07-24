import os
import sys
import sqlite3
import pypdf
import time
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Set up utf-8
sys.stdout.reconfigure(encoding='utf-8')

COURS_DIR = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/cours"
DB_CONCOURS = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"
DB_BACKEND = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"

# Mapping Course ID -> List of PDF filenames
COURSE_PDF_MAPPING = {
    # Architecture des Ordinateurs
    19: ["Architecture des Ordinateurs.pdf", "Architecture des Ordinateurs 3.pdf", "ARCHITECTURE DES SYSTÈMES 1.pdf"],
    20: ["Architecture des Ordinateurs 2.pdf"],
    21: ["Architecture des Ordinateurs.pdf", "Architecture des Ordinateurs 3.pdf"],
    # Structures de Données & Algo
    2: ["Structures de donnnées 1.pdf", "Structures de donnnées 2.pdf"],
    3: ["Structures de donnnées 2.pdf", "TD1 Structures de donnnées.pdf"],
    5: ["Structures de donnnées 3.pdf", "TD2 Structures de donnnées.pdf"],
    # Systèmes d'exploitation
    14: ["SYSTÈMES D'EXPLOITATION 1.pdf"],
    15: ["SYSTÈMES D'EXPLOITATION 2.pdf"],
    16: ["SYSTÈMES D'EXPLOITATION 3.pdf", "SYSTÈMES D'EXPLOITATION 4.pdf"],
    17: ["SYSTÈMES D'EXPLOITATION 5.pdf", "SYSTÈMES D'EXPLOITATION 6.pdf"],
    18: [
        "SYSTÈMES D'EXPLOITATIONS linux 1.pdf", 
        "SYSTÈMES D'EXPLOITATIONS linux 2.pdf", 
        "SYSTÈMES D'EXPLOITATIONS linux 3.pdf",
        "SYSTÈMES D'EXPLOITATIONS linux 4.pdf",
        "SYSTÈMES D'EXPLOITATIONS linux 5.pdf"
    ]
}

class CoursePayload(BaseModel):
    content: str = Field(description="Highly detailed academic course sheet in French (markdown format)")
    examples: str = Field(description="Comprehensive step-by-step resolved examples, exercises, or code in French (markdown format)")
    astuces: str = Field(description="Traps, tips, formulas, and tricks in French (markdown format)")

def extract_pdf_text(filenames):
    combined_text = ""
    for name in filenames:
        # Match case-insensitively or with minor accents
        actual_filename = None
        for f in os.listdir(COURS_DIR):
            if f.lower().replace("é", "e").replace("è", "e") == name.lower().replace("é", "e").replace("è", "e"):
                actual_filename = f
                break
        
        if not actual_filename:
            print(f"Warning: PDF file '{name}' not found in {COURS_DIR}.")
            continue
            
        path = os.path.join(COURS_DIR, actual_filename)
        print(f"Extracting text from {actual_filename}...")
        try:
            with open(path, 'rb') as f:
                reader = pypdf.PdfReader(f)
                for page_idx, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if text:
                        combined_text += f"\n--- Page {page_idx+1} ({actual_filename}) ---\n{text}\n"
        except Exception as e:
            print(f"Error reading {actual_filename}: {e}")
            
    return combined_text

def enrich_courses():
    client = genai.Client(
        vertexai=True, 
        project="chrome-backbone-496013-p4", 
        location="us-central1",
        http_options=types.HttpOptions(timeout=120000) # 2 mins timeout for larger inputs
    )
    
    # We will loop through the mapped courses and enrich them
    for course_id, pdf_list in COURSE_PDF_MAPPING.items():
        print(f"\n========================================\nProcessing Course ID: {course_id}...")
        
        # Get current title and domain details from concours.db
        conn = sqlite3.connect(DB_CONCOURS)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.title, sd.name as subdomain_name, d.name as domain_name
            FROM courses c
            JOIN syllabus_subdomains sd ON c.subdomain_code = sd.code
            JOIN syllabus_domains d ON sd.domain_code = d.code
            WHERE c.id = ?
        """, (course_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            print(f"Course ID {course_id} not found in database.")
            continue
            
        title = row['title']
        subdomain_name = row['subdomain_name']
        domain_name = row['domain_name']
        
        # Extract university PDF texts
        pdf_text = extract_pdf_text(pdf_list)
        if not pdf_text.strip():
            print(f"No PDF text could be extracted for course '{title}'. Skipping...")
            continue
            
        print(f"Extracted {len(pdf_text)} characters of academic reference text. Sending to Gemini...")
        
        prompt = f"""
        You are a distinguished university Professor of Computer Science.
        You are tasked with expanding and enriching the academic course sheet titled: "{title}".
        This course is part of the module "{subdomain_name}" under the domain "{domain_name}".
        
        Use the following university lecture notes extracted from PDFs as your primary source of academic content:
        --- START ACADEMIC REFERENCE TEXT ---
        {pdf_text[:80000]}  # Limit to ~80k characters (~12-15k tokens) to prevent prompt bloat
        --- END ACADEMIC REFERENCE TEXT ---
        
        Generate a highly detailed, comprehensive, and academically rigorous course sheet in French.
        It must be suitable for university students (Licence / Master level) as well as competitive exam candidates.
        
        The JSON response must contain:
        1. "content": The theoretical course sheet. Cover all core concepts from the reference text, standard definitions, architecture diagrams, structures, and algorithms. Use clear markdown with bullet points and bold text. DO NOT use mathematical matrices for simple parenthesized slashes (e.g. write (enregistrements ou tuples) instead of (enregistrements/tuples)).
        2. "examples": Multiple concrete, step-by-step resolved exercises, code snippets (in clean C, Java, Python, or SQL as appropriate), or operational examples illustrating the concepts.
        3. "astuces": Recurrent exam traps, common misconceptions, key formulas, and quick shortcuts/tips to solve questions fast.
        
        Provide exhaustive information. Do not skip details. Return only the JSON matching the schema.
        """
        
        retries = 3
        success = False
        delay = 15
        for attempt in range(retries):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=CoursePayload,
                        temperature=0.2
                    )
                )
                
                data = json.loads(response.text)
                content = data.get("content", "").strip()
                examples = data.get("examples", "").strip()
                astuces = data.get("astuces", "").strip()
                
                if content:
                    # Update concours.db
                    conn1 = sqlite3.connect(DB_CONCOURS)
                    cursor1 = conn1.cursor()
                    cursor1.execute("""
                        UPDATE courses 
                        SET content = ?, examples = ?, astuces = ? 
                        WHERE id = ?
                    """, (content, examples, astuces, course_id))
                    conn1.commit()
                    conn1.close()
                    
                    # Update backend/db.sqlite3
                    conn2 = sqlite3.connect(DB_BACKEND)
                    cursor2 = conn2.cursor()
                    cursor2.execute("""
                        UPDATE syllabus_course 
                        SET content = ?, examples = ?, astuces = ? 
                        WHERE id = ?
                    """, (content, examples, astuces, course_id))
                    conn2.commit()
                    conn2.close()
                    
                    print(f"Successfully enriched and saved course: '{title}' in both databases!")
                    success = True
                    break
                else:
                    print(f"Attempt {attempt+1}: Received empty response. Retrying...")
            except Exception as e:
                print(f"Attempt {attempt+1} failed for '{title}': {e}")
                if attempt < retries - 1:
                    print(f"Sleeping for {delay} seconds before retrying...")
                    time.sleep(delay)
                    delay *= 2
                    
        if not success:
            print(f"Warning: Failed to enrich course '{title}'.")
        
        # Wait between course generations to avoid rate limits
        time.sleep(10.0)

if __name__ == "__main__":
    enrich_courses()
    print("Course enrichment process complete!")
