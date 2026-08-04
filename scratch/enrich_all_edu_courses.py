"""
enrich_all_edu_courses.py
==========================
Uses Gemini (Vertex AI) to enrich all 4 Sciences de l'Éducation courses (36-39)
in both backend/db.sqlite3 and concours.db with:
  - Simplified pedagogical bilingual content (pure French in content_fr, pure Arabic in content_ar)
  - Famous experiments of the authors described clearly for memorization
  - Embedded French illustrations (from /images/)
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
COURSE_IDS = [36, 37, 38, 39]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "..", "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(SCRIPT_DIR, "..", "concours.db")

# Course-specific prompt instructions and image embeddings
COURSE_METADATA = {
    36: {
        "images": {
            "fr": [
                "![Béhaviorisme](/images/behaviorism.png)",
                "![Constructivisme](/images/constructivism.png)",
                "![Socio-constructivisme](/images/socio_constructivism.png)",
                "![Cognitivisme](/images/cognitivism.png)"
            ],
            "ar": [
                "![السلوكية](/images/behaviorism.png)",
                "![البنائية](/images/constructivism.png)",
                "![السوسيو-بنائية](/images/socio_constructivism.png)",
                "![المعرفية](/images/cognitivism.png)"
            ]
        },
        "focus": "Théories de l'apprentissage (Béhaviorisme, Constructivisme, Socio-constructivisme, Cognitivisme). Expliquez en détail les expériences des auteurs : le chien de Pavlov, la boîte de Skinner, le petit Albert de Watson, les verres d'eau de Piaget, l'étayage de Bruner, le traitement de l'information (esprit-ordinateur). Ajoutez les images correspondantes dans les sections."
    },
    37: {
        "images": {
            "fr": [
                "![Les Stades du Développement](/images/stages_piaget.png)",
                "![L'Expérience de la Conservation](/images/piaget_conservation.png)"
            ],
            "ar": [
                "![مراحل النمو المعرفي](/images/stages_piaget.png)",
                "![تجربة الحفاظ على السوائل](/images/piaget_conservation.png)"
            ]
        },
        "focus": "Psychologie du développement de l'adolescent et cognition. Expliquez en détail les théories du développement cognitif (Piaget) et psychosocial (Erikson). Décrivez concrètement les expériences : l'expérience de la conservation des liquides de Piaget (les verres d'eau), les stades d'Erikson. Insérez les images correspondantes dans le texte."
    },
    38: {
        "images": {
            "fr": [
                "![L'Effet Pygmalion](/images/pygmalion_effect.png)",
                "![Les Styles de Leadership de Lewin](/images/lewin_leadership.png)"
            ],
            "ar": [
                "![تأثير بيجماليون](/images/pygmalion_effect.png)",
                "![أنماط القيادة عند كورت لوين](/images/lewin_leadership.png)"
            ]
        },
        "focus": "Sociologie de l'éducation, climat scolaire et dynamique de classe. Expliquez les grands courants sociologiques (Fonctionnalisme de Durkheim/Parsons, Reproduction de Bourdieu/Passeron, Correspondance de Bowles/Gintis). Décrivez en détail les expériences/études : l'expérience de Rosenthal et Jacobson sur l'Effet Pygmalion (les attentes de l'enseignant), l'étude de Kurt Lewin sur les styles de leadership (autoritaire, démocratique, laisser-faire) et la dynamique de groupe. Insérez les images correspondantes."
    },
    39: {
        "images": {
            "fr": [
                "![Égalité vs Équité](/images/equality_equity.png)"
            ],
            "ar": [
                "![المساواة مقابل الإنصاف](/images/equality_equity.png)"
            ]
        },
        "focus": "Éducation inclusive, mixité, égalité des chances et éthique professionnelle. Expliquez clairement les différences entre Exclusion, Ségrégation, Intégration et Inclusion. Définissez l'Égalité vs Équité avec des exemples pratiques. Présentez la Charte nationale d'éthique professionnelle de l'enseignant au Maroc. Insérez l'image de l'égalité vs équité."
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
    prompt_fr = f"""You are a master Pedagogy Professor preparing candidates for the CRMEF Morocco teacher training exam.

Your goal is to write a premium, clear, and highly visual course guide in FRENCH for:
Course Title: {title}
Focus Area: {metadata["focus"]}

Required Images to Embed in your Markdown:
{chr(10).join(metadata["images"]["fr"])}
Make sure to place these markdown images at the exact relevant places (e.g., right under the heading of each theory/concept).

Structure of the course:
# {title}

## 1. Cadre Référentiel & Objectifs
(A concise, bulleted list of what candidates must master for the exam).

## 2. Concepts Fondamentaux, Auteurs & Expériences Clés
(For each key theory or concept:
- Name in French and Arabic
- The core idea explained simply.
- **The Famous Experiment of the Author**: Tell the concrete story of the experiment (e.g., Pavlov's dog salivation, Skinner's box conditioning, Piaget's conservation verres d'eau, etc.) in a highly memorable, visual, and narrative way. This is CRITICAL for memorization.
- The associated image embedded.
- Key concepts defined simply.
- The role of the teacher, pupil, and the status of errors.)

## 3. Tableaux Comparatifs
(A clean markdown table summarizing the models/concepts for easy comparison.)

## 4. Analyse des Questions & Pièges (Exemples résolus)
(Provide 2-3 real exam questions (QCM) from Morocco CRMEF exams related to this module. For each question, explain why the right answer is correct and what traps the examiners use.)

## 5. Fiche Synthèse / Grille de décodage pour l'examen
(A practical cheat sheet: 'If the question mentions term X, the correct answer is theory Y'. Focus on triggers that appear in exams.)

## 6. Glossaire
(A bilingual table: Term in French | Term in Arabic | Brief Definition)

Rules:
- All content in this document must be in PURE French. No Arabic text except when indicating the Arabic term in parentheses next to titles (e.g., (السلوكية)).
- Do NOT use HTML tags (like <br/>). Use clean markdown.
- Be extremely thorough, detailed, and simple. Do not write short summaries.
- Return ONLY the markdown content, no notes, no intros.
"""

    print("   🤖 Generating French version (content_fr)...")
    content_fr = call_gemini(prompt_fr)
    if not content_fr:
        print("   ✗ Failed to generate French version.")
        return

    # ── GENERATE ARABIC CONTENT ──
    prompt_ar = f"""You are a master Pedagogy Professor preparing candidates for the CRMEF Morocco teacher training exam.

Your goal is to write a premium, clear, and highly visual course guide in ARABIC for:
Course Title: {title}
Focus Area: {metadata["focus"]}

Required Images to Embed in your Markdown:
{chr(10).join(metadata["images"]["ar"])}
Make sure to place these markdown images at the exact relevant places.

Structure of the course:
# {title}

## 1. الإطار المرجعي والأهداف
(ما يجب على المترشح ضبطه للاستعداد للمباراة في نقاط مركزة).

## 2. المفاهيم الأساسية، الرواد والتجارب المفتاحية
(لكل نظرية أو مفهوم أساسي:
- المفهوم بالعربية والفرنسية.
- الفكرة الجوهرية بتبسيط شديد.
- **التجربة التاريخية الشهيرة للمنظر**: احكِ قصة التجربة (مثال: تجربة لعاب كلب بافلوف، علبة سكينر، تجربة الكؤوس لبياجي، إلخ) بأسلوب سردي مشوق، مرئي ومثبت في الذاكرة.
- الصورة التوضيحية المدمجة.
- المفاهيم المفتاحية مشروحة ببساطة.
- دور المدرس، المتعلم ومكانة الخطأ.)

## 3. الجداول المقارنة والتصنيفات
(جدول مقارن واضح بتنسيق markdown يلخص الفروقات بين النظريات/المفاهيم.)

## 4. تحليل أسئلة المباراة وفخاخ لجنة التحكيم
(تحليل 2-3 أسئلة حقيقية من مباريات التوظيف بالمغرب مع شرح لماذا الجواب صحيح وما هي فخاخ لجان التحكيم.)

## 5. مفتاح الذهب لإجابة QCMs الامتحانات
(دليل عملي سريع للمراجعة: 'إذا وردت في السؤال كلمة X، فالجواب هو النظرية Y'.)

## 6. مصطلحات أساسية ثنائية اللغة
(جدول: المصطلح بالفرنسية | المصطلح بالعربية | التعريف المختصر)

Rules:
- All content in this document must be in PURE Arabic. No French text except next to titles or names in parentheses (e.g. (Pavlov)).
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
    import re
    print("🚀 Starting global visual and experimental course enrichment...\n")
    for cid in COURSE_IDS:
        enrich_course(cid)
        time.sleep(5)
    print("\n🏁 Enrichment complete!")


if __name__ == '__main__':
    main()
