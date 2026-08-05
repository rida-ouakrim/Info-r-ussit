"""
enrich_os_illustrations.py
==================================
Uses Gemini (Vertex AI) to enrich all 5 Operating Systems courses (14-18)
in both backend/db.sqlite3 and concours.db with:
  - Premium bilingual content (pure French in content_fr, pure Arabic in content_ar)
  - Integration of premium PNG illustrations (nano banana design)
  - Cheatsheets / Grilles de décodage for exam QCMs
  - No ASCII/Unicode art diagrams
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
COURSE_IDS = [14, 15, 16, 17, 18]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "..", "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(SCRIPT_DIR, "..", "concours.db")

# Course-specific prompt instructions and image embeddings
COURSE_METADATA = {
    14: {
        "images": {
            "fr": [
                "![Architecture Fonctionnelle d'un SE](/images/se_architecture.png)"
            ],
            "ar": [
                "![بنية نظام التشغيل](/images/se_architecture.png)"
            ]
        },
        "focus": "Architecture des systèmes d'exploitation : rôle du noyau (Kernel), espace utilisateur vs espace noyau, appels système (System Calls), types de SE (monolithique, micro-noyau). Intégrez l'image de l'architecture fonctionnelle d'un SE dans la section correspondante."
    },
    15: {
        "images": {
            "fr": [
                "![Transitions d'États d'un Processus](/images/process_states.png)"
            ],
            "ar": [
                "![مخطط حالات العمليات](/images/process_states.png)"
            ]
        },
        "focus": "Gestion des processus et ordonnancement (Scheduling) : PCB (Process Control Block), états d'un processus (Prêt, Élu, Bloqué, etc.), algorithmes d'ordonnancement (FIFO, SJF, SRT, Round Robin, Priorités). Intégrez l'image des transitions d'états d'un processus dans la section sur les états de processus."
    },
    16: {
        "images": {
            "fr": [
                "![Mécanisme de Pagination de la Mémoire](/images/memory_pagination.png)"
            ],
            "ar": [
                "![آلية تقسيم الذاكرة](/images/memory_pagination.png)"
            ]
        },
        "focus": "Gestion de la mémoire : pagination, segmentation, mémoire virtuelle, table des pages, MMU, défaut de page (page fault), algorithmes de remplacement de pages (FIFO, LRU, Optimal). Intégrez l'image de la pagination de la mémoire dans la section décrivant la pagination."
    },
    17: {
        "images": {
            "fr": [
                "![Structure d'un Inode Unix](/images/file_system_inode.png)"
            ],
            "ar": [
                "![بنية عقدة الفهرسة Inode](/images/file_system_inode.png)"
            ]
        },
        "focus": "Systèmes de fichiers et Entrées/Sorties : concept d'inode (inœud) sous Unix/Linux, pointeurs directs et indirects, allocation de blocs, gestion de l'espace libre, spooling et mise en mémoire tampon (buffering). Intégrez l'image de l'inode dans la section système de fichiers."
    },
    18: {
        "images": {
            "fr": [
                "![Arborescence Standard de Linux](/images/linux_tree.png)"
            ],
            "ar": [
                "![شجرة مجلدات لينكس](/images/linux_tree.png)"
            ]
        },
        "focus": "Commandes d'administration et scripting shell : arborescence FHS Linux (/bin, /etc, /home, /var...), redirection (<, >, 2>), tubes (pipes |), variables et structures de contrôle shell (if, for, while). Intégrez l'image de l'arborescence Linux dans la section sur la structure des dossiers."
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
    prompt_fr = f"""You are a master Computer Science Professor preparing candidates for the CRMEF Morocco teacher training exam in Operating Systems.

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

## 2. Concepts Fondamentaux & Schémas d'Architecture
(For each key OS concept:
- Plain, simplified explanation of the theory.
- The specific PNG image embedded (using the exact provided image Markdown).
- Detailed analysis of the components and mechanism.)

## 3. Tableaux Comparatifs
(A clean markdown table summarizing the models/algorithms/concepts for easy comparison.)

## 4. Analyse des Questions & Pièges (Exemples résolus)
(Provide 2-3 real exam questions (QCM) from Morocco CRMEF exams related to this module. For each question, explain why the right answer is correct and what traps the examiners use.)

## 5. Fiche Synthèse / Grille de décodage pour l'examen
(A practical cheat sheet: 'If the question mentions term X, the correct answer is theory Y'. Focus on triggers that appear in exams.)

## 6. Glossaire technique bilingue
(A bilingual table: Term in French | Term in Arabic | Brief Definition)

Rules:
- All content in this document must be in PURE French. No Arabic text except when indicating the Arabic term in parentheses next to titles (e.g., (نظام التشغيل)).
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
    prompt_ar = f"""You are a master Computer Science Professor preparing candidates for the CRMEF Morocco teacher training exam in Operating Systems.

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

## 2. المفاهيم الأساسية والخطاطات الهيكلية
(لكل مفهوم أساسي:
- المفهوم بالعربية والفرنسية.
- الفكرة الجوهرية بتبسيط شديد.
- إدراج الصورة التوضيحية المخصصة (بالمسار المحدد في الأعلى).
- تحليل تفصيلي للمكونات وطريقة العمل.)

## 3. الجداول المقارنة والتصنيفات
(جدول مقارن واضح بتنسيق markdown يلخص الفروقات بين الأوردرات/الخوارزميات/المفاهيم.)

## 4. تحليل أسئلة المباراة وفخاخ لجنة التحكيم
(تحليل 2-3 أسئلة حقيقية من مباريات التوظيف بالمغرب مع شرح لماذا الجواب صحيح وما هي فخاخ لجان التحكيم.)

## 5. مفتاح الذهب لإجابة QCMs الامتحانات
(دليل عملي سريع للمراجعة: 'إذا وردت في السؤال كلمة X، فالجواب هو الخوارزمية/المفهوم Y'.)

## 6. مصطلحات أساسية ثنائية اللغة
(جدول: المصطلح بالفرنسية | المصطلح بالعربية | التعريف المختصر)

Rules:
- All content in this document must be in PURE Arabic. No French text except next to titles or names in parentheses (e.g. (Système d'exploitation)).
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
    print("🚀 Starting global Operating Systems course visual enrichment...\n")
    for cid in COURSE_IDS:
        enrich_course(cid)
        time.sleep(5)
    print("\n🏁 OS enrichment complete!")


if __name__ == '__main__':
    main()
