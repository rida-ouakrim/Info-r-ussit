"""
enrich_didactique_illustrations.py
==================================
Uses Gemini (Vertex AI) to enrich all 7 Didactique de l'Informatique courses (29-35)
in both backend/db.sqlite3 and concours.db with:
  - Simplified pedagogical bilingual content (pure French in content_fr, pure Arabic in content_ar)
  - Beautiful ASCII/Unicode text diagrams to illustrate the concepts
  - Grille de décodage / cheat sheet for exam QCMs
"""

import os
import sys
import sqlite3
import time
import re

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
COURSE_IDS = [29, 30, 31, 32, 33, 34, 35]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "..", "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(SCRIPT_DIR, "..", "concours.db")

# Course-specific prompt instructions and image embeddings
COURSE_METADATA = {
    29: {
        "images": {
            "fr": [
                "![Le Triangle Didactique](/images/triangle_didactique.png)",
                "![La Transposition Didactique](/images/transposition_didactique.png)"
            ],
            "ar": [
                "![المثلث الديداكتيكي](/images/triangle_didactique.png)",
                "![النقل الديداكتيكي](/images/transposition_didactique.png)"
            ]
        },
        "focus": "Didactique générale : Triangle didactique (Enseignant, Apprenant, Savoir) et Transposition didactique. Intégrez l'image du triangle didactique et l'image de la transposition didactique dans leurs sections respectives."
    },
    30: {
        "images": {
            "fr": [
                "![Les Obstacles Didactiques](/images/obstacles_didactiques.png)"
            ],
            "ar": [
                "![العوائق الديداكتيكية](/images/obstacles_didactiques.png)"
            ]
        },
        "focus": "Conceptions des apprenants, représentations et obstacles didactiques (épistémologique de Bachelard, didactique, ontogénétique). Intégrez l'image des obstacles didactiques dans la section sur les types d'obstacles."
    },
    31: {
        "images": {
            "fr": [
                "![Théorie des Situations Didactiques](/images/tsd_brousseau.png)"
            ],
            "ar": [
                "![نظرية الوضعيات الديداكتيكية](/images/tsd_brousseau.png)"
            ]
        },
        "focus": "Situations-problèmes et situations didactiques en informatique. Théorie des situations didactiques (TSD) de Brousseau. Intégrez l'image de la TSD de Brousseau dans la section expliquant les 4 phases (action, formulation, validation, institutionnalisation)."
    },
    32: {
        "images": {
            "fr": [
                "![Curriculum Informatique Maroc](/images/curriculum_maroc.png)"
            ],
            "ar": [
                "![منهج المعلوميات بالمغرب](/images/curriculum_maroc.png)"
            ]
        },
        "focus": "Curriculum officiel d'informatique marocain (Secondaire collégial et qualifiant). Intégrez l'image du curriculum d'informatique marocain dans la section sur les programmes et enveloppes horaires."
    },
    33: {
        "images": {
            "fr": [
                "![Le Modèle SAMR](/images/modele_samr.png)"
            ],
            "ar": [
                "![نموذج SAMR](/images/modele_samr.png)"
            ]
        },
        "focus": "Conception et choix des ressources didactiques, manuels scolaires et TICE. Modèle SAMR (Substitution, Augmentation, Modification, Redéfinition). Intégrez l'image du modèle SAMR dans la section correspondante."
    },
    34: {
        "images": {
            "fr": [
                "![Situation d'Intégration APC](/images/situation_integration.png)"
            ],
            "ar": [
                "![وضعية الإدماج](/images/situation_integration.png)"
            ]
        },
        "focus": "Pédagogie Par Objectifs (PPO) et Approche Par Competences (APC). La situation d'intégration (famille de situations, ressources internes/externes, consigne, support). Intégrez l'image de la situation d'intégration dans la section APC."
    },
    35: {
        "images": {
            "fr": [
                "![La Démarche d'Investigation](/images/demarche_investigation.png)"
            ],
            "ar": [
                "![خطوات تقصي المفاهيم](/images/demarche_investigation.png)"
            ]
        },
        "focus": "Démarches d'investigation et d'apprentissage actif en classe d'informatique (OPHERIC, démarche de projet, classe inversée). Intégrez l'image de la démarche d'investigation dans la section correspondante."
    }
}


def call_gemini(prompt: str) -> str:
    """Helper to query Gemini with multi-location fallback."""
    for model_name in ["gemini-2.5-pro", "gemini-2.5-flash"]:
        for loc in LOCATIONS:
            try:
                client = genai.Client(
                    vertexai=True,
                    project=VERTEX_PROJECT,
                    location=loc,
                    http_options=types.HttpOptions(timeout=240000),
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(temperature=0.15),
                )
                if response.text and len(response.text.strip()) > 300:
                    return response.text.strip()
            except Exception as e:
                print(f"    ⚠ Gemini failed ({model_name}@{loc}): {e}")
                time.sleep(3)
    return ""


def enrich_course(course_id: int):
    print(f"\n{'='*70}")
    print(f"📚 Enriching Course ID {course_id}...")

    # Load course title from Django DB
    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT title FROM syllabus_course WHERE id = ?", (course_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        print(f"✗ Course {course_id} not found in database.")
        return

    title = row['title']
    metadata = COURSE_METADATA[course_id]

    # ── GENERATE FRENCH CONTENT ──
    prompt_fr = f"""You are a master Computer Science Didactics Professor preparing candidates for the CRMEF Morocco teacher training exam.

Your goal is to write a premium, clear, and highly visual course guide in FRENCH for:
Course Title: {title}
Focus Area: {metadata["focus"]}

Required Images to Embed in your Markdown:
{chr(10).join(metadata["images"]["fr"])}
Make sure to place these markdown images at the exact relevant places (e.g., right under the heading of each theory/concept).

Design requirements:
- Do NOT draw any Unicode/ASCII diagrams, boxes, lines, or drawings in code blocks or blockquotes. They look broken and unreadable in the app.
- Instead, rely strictly on embedding the provided PNG images using the Markdown syntax: `![Alt Text](/images/image_name.png)`.

Structure of the course:
# {title}

## 1. Cadre Référentiel & Objectifs
(A concise, bulleted list of what candidates must master for the exam).

## 2. Concepts Fondamentaux, Auteurs & Schémas Didactiques
(For each key didactic concept/model:
- Name in French and Arabic.
- Plain, simplified explanation of the theory.
- The specific PNG image embedded (using the exact provided image Markdown).
- Practical classroom examples in computer science (e.g. how it applies to teaching algorithms, Scratch, HTML, or databases).)

## 3. Tableaux Comparatifs
(A clean markdown table summarizing the models/concepts for easy comparison.)

## 4. Analyse des Questions & Pièges (Exemples résolus)
(Provide 2-3 real exam questions (QCM) from Morocco CRMEF exams related to this module. For each question, explain why the right answer is correct and what traps the examiners use.)

## 5. Fiche Synthèse / Grille de décodage pour l'examen
(A practical cheat sheet: 'If the question mentions term X, the correct answer is theory Y'. Focus on triggers that appear in exams.)

## 6. Glossaire Didactique
(A bilingual table: Term in French | Term in Arabic | Brief Definition)

Rules:
- All content in this document must be in PURE French. No Arabic text except when indicating the Arabic term in parentheses next to titles (e.g., (النقل الديداكتيكي)).
- Do NOT use HTML tags. Use clean markdown.
- Be extremely thorough, detailed, and simple. Do not write short summaries.
- Return ONLY the markdown content, no notes, no intros.
"""

    print("   🤖 Generating French version (content_fr)...")
    content_fr = call_gemini(prompt_fr)
    if not content_fr:
        print("   ✗ Failed to generate French version.")
        return

    # ── GENERATE ARABIC CONTENT ──
    prompt_ar = f"""You are a master Computer Science Didactics Professor preparing candidates for the CRMEF Morocco teacher training exam.

Your goal is to write a premium, clear, and highly visual course guide in ARABIC for:
Course Title: {title}
Focus Area: {metadata["focus"]}

Required Images to Embed in your Markdown:
{chr(10).join(metadata["images"]["ar"])}
Make sure to place these markdown images at the exact relevant places.

Design requirements:
- Do NOT draw any Unicode/ASCII diagrams, boxes, lines, or drawings in code blocks or blockquotes. They look broken and unreadable in the app.
- Instead, rely strictly on embedding the provided PNG images using the Markdown syntax: `![Alt Text](/images/image_name.png)`.

Structure of the course:
# {title}

## 1. الإطار المرجعي والأهداف
(ما يجب على المترشح ضبطه للاستعداد للمباراة في نقاط مركزة).

## 2. المفاهيم الأساسية، الرواد والخطاطات الديداكتيكية
(لكل مفهوم ديداكتيكي أساسي:
- المفهوم بالعربية والفرنسية.
- الفكرة الجوهرية بتبسيط شديد.
- إدراج الصورة التوضيحية المخصصة (بالمسار المحدد في الأعلى).
- أمثلة تطبيقية ملموسة من تدريس المعلوميات (مثال: البرمجة بلغة Scratch، الخوارزميات، قواعد البيانات، إلخ).)

## 3. الجداول المقارنة والتصنيفات
(جدول مقارن واضح بتنسيق markdown يلخص الفروقات بين النظريات/المفاهيم.)

## 4. تحليل أسئلة المباراة وفخاخ لجنة التحكيم
(تحليل 2-3 أسئلة حقيقية من مباريات التوظيف بالمغرب مع شرح لماذا الجواب صحيح وما هي فخاخ لجان التحكيم.)

## 5. مفتاح الذهب لإجابة QCMs الامتحانات
(دليل عملي سريع للمراجعة: 'إذا وردت في السؤال كلمة X، فالجواب هو النظرية Y'.)

## 6. مصطلحات أساسية ثنائية اللغة
(جدول: المصطلح بالفرنسية | المصطلح بالعربية | التعريف المختصر)

Rules:
- All content in this document must be in PURE Arabic. No French text except next to titles or names in parentheses (e.g. (Transposition didactique)).
- Do NOT use HTML tags. Use clean markdown.
- Be extremely thorough, detailed, and simple.
- Return ONLY the markdown content.
"""

    print("   🤖 Generating Arabic version (content_ar)...")
    content_ar = call_gemini(prompt_ar)
    if not content_ar:
        print("   ✗ Failed to generate Arabic version.")
        return

    # Clean HTML tags in python just in case
    content_fr = re.sub(r'<[^>]+>', '', content_fr)
    content_ar = re.sub(r'<[^>]+>', '', content_ar)

    # Save to Django DB
    print("   💾 Saving to Django DB...")
    conn = sqlite3.connect(DB_DJANGO)
    c = conn.cursor()
    c.execute("""
        UPDATE syllabus_course 
        SET content_ar = ?, content_fr = ?, content = ? 
        WHERE id = ?
    """, (content_ar, content_fr, content_fr, course_id))
    conn.commit()
    conn.close()

    # Save to Concours DB
    if os.path.exists(DB_CONCOURS):
        print("   💾 Saving to Concours DB...")
        conn = sqlite3.connect(DB_CONCOURS)
        c = conn.cursor()
        c.execute("PRAGMA table_info(courses)")
        cols = [col[1] for col in c.fetchall()]
        if 'content_ar' in cols and 'content_fr' in cols:
            c.execute("""
                UPDATE courses 
                SET content_ar = ?, content_fr = ?, content = ? 
                WHERE id = ?
            """, (content_ar, content_fr, content_fr, course_id))
        else:
            c.execute("""
                UPDATE courses 
                SET content = ? 
                WHERE id = ?
            """, (content_fr, course_id))
        conn.commit()
        conn.close()

    print(f"   ✅ Course {course_id} successfully enriched!")


def main():
    print("🚀 Starting global didactics course visual enrichment...\n")
    for cid in COURSE_IDS:
        enrich_course(cid)
        time.sleep(5)
    print("\n🏁 Didactics enrichment complete!")


if __name__ == '__main__':
    main()
