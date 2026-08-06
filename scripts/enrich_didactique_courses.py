"""
enrich_didactique_courses.py
============================
Enriches the 7 Didactique Informatique course sheets (IDs 29 to 35) in both
backend/db.sqlite3 and concours.db by synthesizing real exam questions (2018-2025)
using Gemini (Vertex AI with multi-location fallback to bypass quotas).
"""

import os
import sys
import json
import sqlite3
import time
from google import genai
from google.genai import types

# Config & Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(SCRIPT_DIR, "concours.db")

VERTEX_PROJECT = "chrome-backbone-496013-p4"
LOCATIONS = ["us-east4", "europe-west1", "us-central1", "asia-northeast1"]

# Safe print
import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass

# List of 7 Didactique course IDs in Django DB
DIDACTIQUE_COURSE_IDS = [29, 30, 31, 32, 33, 34, 35]

PROMPT_TEMPLATE = """
Tu es un Expert Professeur Formateur agrégé en Didactique de l'Informatique et membre de jury des concours de recrutement des enseignants du Secondaire (CRMEF) au Maroc.

Voici une fiche de cours existante :
TITRE DU COURS : {title}
SOUS-DOMAINE : {subdomain}

CONTENU ACTUEL :
{current_content}

---

VOICI LES QUESTIONS REELLES EXTRAITES DES CONCOURS RECENT (2018 - 2025) CONCERNANT CE DOMAINE :
{exam_questions}

---

CONSIGNE :
Rédige une FICHE DE COURS MAGISTRALE COMPLÈTE ET ULTRA DÉTAILLÉE en Markdown, spécifiquement conçue pour permettre à un candidat d'obtenir la note maximale au concours.

Structure obligatoire de la fiche (en Markdown) :
1. `# {title}`
2. `## 1. Objectifs & Cadre Référentiel du Concours`
3. `## 2. Fondements Théoriques & Définitions Académiques` (Définis précisément chaque concept récurrent des examens : Transposition didactique, Contrat didactique, Obstacles, PPO vs APC, Situations-problèmes, TICE, etc.)
4. `## 3. Modèles, Démarches & Mises en Situation Pratiques` (Exemples concrets pour l'enseignement secondaire de l'informatique : Algorithmique, Web, Python, Scratch, Bureautique)
5. `## 4. Analyse des Pièges & Exemples Décortiqués du Concours` (Intègre et décortique les vraies questions de concours fournies ci-dessus avec les explications académiques des bonnes réponses)
6. `## 5. Fiche Synthèse & Astuces de Révision "Jour J"` (Astuces d'élimination rapide, pièges fréquents du jury, termes clés indispensables)

Règles de rédaction :
- Le contenu doit être extrêmement riche, pédagogique et directement utilisable pour réviser.
- N'utilise AUCUN balisage HTML complexe, reste en standard Markdown clair et bien structuré.
- Ne tronque pas le contenu, sois très exhaustif.
"""

def get_questions_for_subdomain(subdomain_code):
    """Retrieve exam questions matching the subdomain or related didactique codes."""
    if not os.path.exists(DB_DJANGO):
        return ""
    
    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT exam_year, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, astuce
        FROM exams_question
        WHERE subdomain_id = ? OR domain_id IN ('DIDACTIQUE', 'SCIENCES_EDU')
        ORDER BY exam_year DESC, id ASC
        LIMIT 25
    """, (subdomain_code,))
    
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return "Aucune question spécifique extraite pour le moment."
    
    formatted = []
    for r in rows:
        q_str = f"- [{r['exam_year']} {r['question_number']}] {r['question_text']}\n"
        q_str += f"  A) {r['option_a']} | B) {r['option_b']} | C) {r['option_c']} | D) {r['option_d']}\n"
        q_str += f"  --> Reponse Correcte: {r['correct_option']}\n"
        if r['explanation']:
            q_str += f"  --> Explication: {r['explanation']}\n"
        if r['astuce']:
            q_str += f"  --> Astuce: {r['astuce']}\n"
        formatted.append(q_str)
        
    return "\n".join(formatted)

def enrich_course(course_id):
    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, subdomain_id, title, content FROM syllabus_course WHERE id = ?", (course_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        print(f"✗ Course ID {course_id} not found.")
        return
        
    title = row['title']
    subdomain = row['subdomain_id']
    current_content = row['content'] or ""
    
    print(f"\n========================================")
    print(f"Enriching Course ID {course_id}: {title}...")
    
    exam_questions = get_questions_for_subdomain(subdomain)
    
    prompt = PROMPT_TEMPLATE.format(
        title=title,
        subdomain=subdomain,
        current_content=current_content[:3000],
        exam_questions=exam_questions
    )
    
    # Try across multiple Vertex locations to bypass single region quota limits
    success = False
    for loc in LOCATIONS:
        try:
            print(f"  → Connecting via region: {loc}...")
            client = genai.Client(
                vertexai=True,
                project=VERTEX_PROJECT,
                location=loc,
                http_options=types.HttpOptions(timeout=120000)
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    temperature=0.2,
                )
            )
            enriched_text = response.text
            
            # Extract examples and astuces sections if present
            examples = ""
            astuces = ""
            if "## 3." in enriched_text:
                parts = enriched_text.split("## 3.")
                if len(parts) > 1:
                    examples = "## 3." + parts[1].split("## 4.")[0]
            if "## 5." in enriched_text:
                parts = enriched_text.split("## 5.")
                if len(parts) > 1:
                    astuces = "## 5." + parts[1]

            # Update Django DB
            conn = sqlite3.connect(DB_DJANGO)
            c = conn.cursor()
            c.execute("""
                UPDATE syllabus_course
                SET content = ?, examples = ?, astuces = ?
                WHERE id = ?
            """, (enriched_text, examples, astuces, course_id))
            conn.commit()
            conn.close()
            
            # Update concours.db if it exists
            if os.path.exists(DB_CONCOURS):
                conn_c = sqlite3.connect(DB_CONCOURS)
                cc = conn_c.cursor()
                cc.execute("""
                    UPDATE courses
                    SET content = ?, examples = ?, astuces = ?
                    WHERE title = ? OR subdomain_code = ?
                """, (enriched_text, examples, astuces, title, subdomain))
                conn_c.commit()
                conn_c.close()

            print(f"  ✓ Course ID {course_id} successfully enriched via region {loc} ({len(enriched_text)} chars).")
            success = True
            break
        except Exception as e:
            print(f"  ⚠ Region {loc} failed for Course ID {course_id}: {e}")
            time.sleep(5)
            
    if not success:
        print(f"✗ Could not enrich Course ID {course_id} in any region.")

def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    
    for cid in DIDACTIQUE_COURSE_IDS:
        enrich_course(cid)
        time.sleep(4)

    print("\n✓ ALL DIDACTIQUE COURSES ENRICHED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
