"""
enrich_c_lessons.py
===================
Enriches all 50 C lessons in cLessons.js with:
1. High quality "Fiche de Révision" (content)
2. High quality "Pratique & Exemples" (examples)
3. High quality "Astuces & Pièges Concours" (astuces)
4. 10 targeted MCQs per lesson (quiz) with detailed explanations.

Uses Gemini Vertex AI (gemini-2.5-flash-lite).
"""

import json
import os
import sys
import time
from pathlib import Path

# Force UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Paths
BASE_DIR = Path(__file__).parent
CREDENTIALS_PATH = Path("C:/Users/RIDA OUAKRIM/Desktop/rida/vertex_credentials.json")
if CREDENTIALS_PATH.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(CREDENTIALS_PATH)

PROJECT_ID = "chrome-backbone-496013-p4"

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("google-genai not installed")
    sys.exit(1)

def get_client():
    for loc in ["us-central1", "europe-west1", "us-east4"]:
        try:
            client = genai.Client(
                vertexai=True,
                project=PROJECT_ID,
                location=loc,
                http_options=types.HttpOptions(timeout=60000)
            )
            return client
        except Exception:
            continue
    raise RuntimeError("Cannot connect to Vertex AI")

def generate_lesson_enrichment(client, lesson_num, lesson_title):
    prompt = f"""Tu es un Professeur agrégé d'Informatique au Maroc, membre du jury CRMEF et expert du Langage C.

Génère un contenu pédagogique ultra-complet, rigoureux et moderne pour la Leçon N°{lesson_num} : "{lesson_title}" du cours de Langage C.

RETOURNE STRICTEMENT UN OBJET JSON avec la structure exacte suivante :
{{
  "num": {lesson_num},
  "title": "{lesson_title}",
  "content": "# {lesson_title}\\n\\n## 1. Cadre Général & Définition...\\n\\n## 2. Règle Syntaxe et Mémoire...\\n\\n## 3. Synthèse Académique...",
  "examples": "```c\\n#include <stdio.h>\\n...\\n```\\n\\n**Explication étape par étape :**\\n1. ...\\n2. ...",
  "astuces": "⚡ **Pièges & Conseils Concours CRMEF :**\\n- ...\\n- ...",
  "quiz": [
    {{
      "id": {lesson_num}01,
      "question_number": "Q1",
      "question_text": "Question 1 spécifique sur {lesson_title}...",
      "option_a": "Option A...",
      "option_b": "Option B...",
      "option_c": "Option C...",
      "option_d": "Option D...",
      "correct_option": "A",
      "explanation": "Explication pédagogique détaillée...",
      "astuce": "Règle clé à retenir le jour du concours."
    }}
  ]
}}

Consignes :
1. Le "quiz" doit contenir EXACTEMENT 10 questions uniques et pertinentes (options A, B, C, D) numérotées de {lesson_num}01 à {lesson_num}10.
2. Le code dans "examples" doit être valide et correctement commenté.
3. Ne mets pas de balises markdown ```json autour du résultat si possible, uniquement du JSON pur valide.
"""

    for attempt in range(5):
        try:
            res = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json"
                )
            )
            raw = res.text.strip()
            if raw.startswith("```"):
                parts = raw.split("```")
                raw = parts[1] if len(parts) > 1 else raw
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip().rstrip("`").strip()
            data = json.loads(raw)
            if isinstance(data, dict) and "quiz" in data and len(data["quiz"]) > 0:
                return data
        except Exception as e:
            print(f"  Attempt {attempt+1} failed for Lesson {lesson_num}: {e}")
            time.sleep(4 * (attempt + 1))
    return None

def main():
    print("Connecting to Vertex AI...")
    client = get_client()
    print("Connected OK.")

    c_lessons_path = BASE_DIR.parent / "frontend" / "src" / "data" / "cLessons.js"
    print(f"Reading {c_lessons_path}...")
    
    with open(c_lessons_path, "r", encoding="utf-8") as f:
        text = f.read()

    json_str = text.replace("export const cLessons = ", "").strip().rstrip(";\n")
    c_lessons = json.loads(json_str)

    missing_nums = [x["num"] for x in c_lessons if not x.get("quiz") or len(x.get("quiz", [])) < 5]
    print(f"Lessons needing enrichment ({len(missing_nums)}): {missing_nums}")

    if not missing_nums:
        print("All lessons are already fully enriched with 10 MCQs each!")
        return

    updated_count = 0
    for les in c_lessons:
        num = les["num"]
        if num in missing_nums:
            title = les["title"]
            v_url = les.get("video_url", "")
            dur = les.get("duration", "10 min")

            print(f"\n[Targeted {num}/50] Enriching: {title}...")
            data = generate_lesson_enrichment(client, num, title)

            if data and "quiz" in data and len(data["quiz"]) > 0:
                les["content"] = data.get("content", les.get("content", ""))
                les["examples"] = data.get("examples", les.get("examples", ""))
                les["astuces"] = data.get("astuces", les.get("astuces", ""))
                les["quiz"] = data["quiz"]
                les["video_url"] = v_url
                les["duration"] = dur
                updated_count += 1
                print(f"  [OK] Lesson {num} enriched with {len(data['quiz'])} MCQs.")
            else:
                print(f"  [WARN] Failed to enrich Lesson {num}.")
            
            time.sleep(3)

    # Save output back to JS file
    output_js = "export const cLessons = " + json.dumps(c_lessons, ensure_ascii=False, indent=2) + ";\n"
    with open(c_lessons_path, "w", encoding="utf-8") as f:
        f.write(output_js)

    print(f"\nSUCCESS! {updated_count} lessons updated. File saved: {c_lessons_path}")

if __name__ == "__main__":
    main()
