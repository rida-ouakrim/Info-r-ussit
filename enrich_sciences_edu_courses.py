"""
enrich_sciences_edu_courses.py
===============================
Enriches the Sciences de l'Éducation course sheets (IDs 36-39) in both
backend/db.sqlite3 and concours.db using:
  - Extracted content from reference PDFs (Phase 2 output)
  - Real exam questions (extracted in Phase 1)
  - Gemini 2.5 Pro for synthesis

Generates bilingual course content (Arabic + French).
"""

import os, sys, json, sqlite3, time
from google import genai
from google.genai import types

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR    = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO     = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")
DB_CONCOURS   = os.path.join(SCRIPT_DIR, "concours.db")
CONTENT_FILE  = os.path.join(SCRIPT_DIR, "scratch", "sciences_edu_content.json")

VERTEX_PROJECT = "chrome-backbone-496013-p4"
LOCATIONS      = ["us-central1", "us-east4", "europe-west1", "asia-northeast1"]

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass

# Course IDs for Sciences de l'Éducation in the database
SCIENCES_EDU_COURSE_IDS = [36, 37, 38, 39]

# Mapping subdomain_code -> course IDs that should use that content
SUBDOMAIN_TO_COURSES = {
    "EDU_PSYCHO": [36, 37],   # Théories d'apprentissage + Psychologie du développement
    "EDU_SOCIO": [38, 39],    # Sociologie de l'éducation + Éducation inclusive
}


PROMPT_TEMPLATE = """
أنت خبير أستاذ مبرز في علوم التربية والديداكتيك العام، وعضو في لجنة تحكيم مباريات توظيف أساتذة التعليم الثانوي (CRMEF) بالمغرب.

📌 عنوان الدرس: {title}
📌 المجال الفرعي: {subdomain}

───── المحتوى المرجعي المستخرج من الكتب والملخصات ─────
{reference_content}

───── أسئلة حقيقية من المباريات السابقة (2018-2025) ─────
{exam_questions}

───── التعليمات ─────
قم بإعداد فيشة درس شاملة ومفصلة ثنائية اللغة (عربي + فرنسي) بتنسيق Markdown.

البنية الإلزامية:

# {title}

## 1. الإطار المرجعي والأهداف / Cadre Référentiel & Objectifs
(ما يجب على المترشح إتقانه في هذا المحور)

## 2. المفاهيم الأساسية والتعريفات / Concepts Fondamentaux & Définitions
(لكل مفهوم: التعريف بالعربية ثم بالفرنسية مع الإشارة للمنظرين)
مثال:
### البنائية / Constructivisme
- **بالعربية**: النظرية التي تعتبر أن المتعلم يبني معارفه بنفسه...
- **بالفرنسية**: Théorie selon laquelle l'apprenant construit ses connaissances...
- **المنظر الرئيسي**: جان بياجي (Jean Piaget)

## 3. الجداول المقارنة والتصنيفات / Tableaux Comparatifs
(جداول مقارنة بالعربية والفرنسية: مثلاً السلوكية vs البنائية vs المعرفية)

## 4. تحليل أسئلة المباراة وفخاخ لجنة التحكيم / Analyse des Questions & Pièges
(تحليل مفصل لأسئلة حقيقية من المباريات مع شرح لماذا الجواب صحيح)

## 5. فيشة المراجعة ونصائح يوم الامتحان / Fiche Synthèse & Astuces Jour J
(ملخص سريع للمراجعة النهائية - نقاط أساسية ثنائية اللغة)

## 6. المصطلحات الأساسية / Glossaire Bilingue
(جدول: المصطلح بالعربية | Terme en français | التعريف المختصر)

قواعد الكتابة:
- المحتوى يجب أن يكون غنياً جداً، بيداغوجياً، ومباشرة قابل للاستخدام في المراجعة
- استخدم Markdown نظيف ومنظم بدون HTML
- لا تختصر، كن شاملاً ومفصلاً
- اربط كل مفهوم بالمنظر/العالم المرتبط به
- ركز على ما يتكرر في المباريات السابقة
"""


def get_reference_content(subdomain_code: str) -> str:
    """Load extracted content from Phase 2 output file, filtered by subdomain."""
    if not os.path.exists(CONTENT_FILE):
        return "لا يوجد محتوى مرجعي مستخرج حتى الآن."
    
    with open(CONTENT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    relevant_sections = []
    for pdf_key, pdf_data in data.get("pdfs", {}).items():
        for sec in pdf_data.get("sections", []):
            sec_sub = sec.get("subdomain_code", "")
            # Include matching subdomain + general education content
            if sec_sub == subdomain_code or sec_sub in ("EDU_PSYCHO", "EDU_SOCIO", "DID_CONCEPTS", "DID_APPROCHES"):
                content = f"### {sec.get('topic', '')}"
                if sec.get('subtopic'):
                    content += f" - {sec['subtopic']}"
                content += f"\n{sec.get('content_arabic', '')}"
                if sec.get('content_french'):
                    content += f"\n\n**[FR]** {sec['content_french']}"
                if sec.get('key_terms'):
                    content += f"\n\n**المصطلحات**: {sec['key_terms']}"
                relevant_sections.append(content)
    
    if not relevant_sections:
        return "لا يوجد محتوى مرجعي مستخرج لهذا المجال الفرعي."
    
    # Limit to ~60k chars to fit in context
    combined = "\n\n---\n\n".join(relevant_sections)
    return combined[:60000]


def get_exam_questions(subdomain_code: str) -> str:
    """Get real exam questions for this subdomain from the database."""
    questions_text = []
    
    for db_path, q_table, sub_col in [
        (DB_DJANGO, "exams_question", "subdomain_id"),
        (DB_CONCOURS, "questions", "subdomain_code"),
    ]:
        if not os.path.exists(db_path):
            continue
        try:
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute(f"""
                SELECT exam_year, question_number, question_text, 
                       option_a, option_b, option_c, option_d, 
                       correct_option, explanation, astuce
                FROM {q_table}
                WHERE {sub_col} = ? OR {sub_col.replace('_id', '_code').replace('_code', '_id') if '_' in sub_col else sub_col} = ?
                ORDER BY exam_year DESC, id ASC
                LIMIT 30
            """, (subdomain_code, subdomain_code))
            
            for r in c.fetchall():
                q_str = f"📝 [{r['exam_year']} {r['question_number']}] {r['question_text']}\n"
                q_str += f"   أ) {r['option_a']} | ب) {r['option_b']} | ج) {r['option_c']} | د) {r['option_d']}\n"
                q_str += f"   ✅ الجواب الصحيح: {r['correct_option']}\n"
                if r['explanation']:
                    q_str += f"   📖 الشرح: {r['explanation']}\n"
                if r['astuce']:
                    q_str += f"   💡 نصيحة: {r['astuce']}\n"
                questions_text.append(q_str)
            conn.close()
            if questions_text:
                break  # Got questions from one DB, no need to check the other
        except Exception as e:
            print(f"    DB query error ({db_path}): {e}")
    
    if not questions_text:
        # Also try getting questions from related subdomains
        related = {
            "EDU_PSYCHO": ["EDU_SOCIO", "DID_CONCEPTS"],
            "EDU_SOCIO": ["EDU_PSYCHO", "DID_APPROCHES"],
        }
        for rel_sub in related.get(subdomain_code, []):
            if not os.path.exists(DB_CONCOURS):
                continue
            try:
                conn = sqlite3.connect(DB_CONCOURS)
                conn.row_factory = sqlite3.Row
                c = conn.cursor()
                c.execute("""
                    SELECT exam_year, question_number, question_text, 
                           option_a, option_b, option_c, option_d, correct_option, explanation
                    FROM questions WHERE subdomain_code = ?
                    ORDER BY exam_year DESC LIMIT 10
                """, (rel_sub,))
                for r in c.fetchall():
                    q_str = f"📝 [{r['exam_year']} {r['question_number']}] {r['question_text']}\n"
                    q_str += f"   أ) {r['option_a']} | ب) {r['option_b']} | ج) {r['option_c']} | د) {r['option_d']}\n"
                    q_str += f"   ✅ {r['correct_option']}\n"
                    questions_text.append(q_str)
                conn.close()
            except:
                pass
    
    return "\n".join(questions_text) if questions_text else "لا توجد أسئلة مستخرجة بعد."


def enrich_course(course_id: int):
    """Enrich a single course using Gemini with multi-location fallback."""
    # Get course info from Django DB
    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, subdomain_id, title, content FROM syllabus_course WHERE id = ?", (course_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        # Try concours.db
        conn = sqlite3.connect(DB_CONCOURS)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT id, subdomain_code as subdomain_id, title, content FROM courses WHERE id = ?", (course_id,))
        row = c.fetchone()
        conn.close()
    
    if not row:
        print(f"✗ Course ID {course_id} not found.")
        return False
    
    title = row['title']
    subdomain = row['subdomain_id']
    
    print(f"\n{'='*70}")
    print(f"📝 Enriching Course ID {course_id}: {title}")
    print(f"   Subdomain: {subdomain}")
    
    # Gather context
    reference_content = get_reference_content(subdomain)
    exam_questions = get_exam_questions(subdomain)
    
    print(f"   Reference content: {len(reference_content)} chars")
    print(f"   Exam questions: {len(exam_questions)} chars")
    
    prompt = PROMPT_TEMPLATE.format(
        title=title,
        subdomain=subdomain,
        reference_content=reference_content[:50000],
        exam_questions=exam_questions[:15000]
    )
    
    # Try Gemini with multi-location fallback
    models = ["gemini-2.5-pro", "gemini-2.5-flash"]
    for model_name in models:
        for loc in LOCATIONS:
            try:
                print(f"   → Trying {model_name}@{loc}...")
                client = genai.Client(
                    vertexai=True,
                    project=VERTEX_PROJECT,
                    location=loc,
                    http_options=types.HttpOptions(timeout=300000),
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(temperature=0.2),
                )
                enriched_text = response.text
                
                if not enriched_text or len(enriched_text) < 500:
                    print(f"   ⚠ Response too short ({len(enriched_text or '')} chars), trying next...")
                    continue
                
                # Extract sections for examples and astuces
                examples = ""
                astuces = ""
                if "## 3." in enriched_text or "## 4." in enriched_text:
                    parts = enriched_text.split("## 3.")
                    if len(parts) > 1:
                        examples = "## 3." + parts[1].split("## 4.")[0] if "## 4." in parts[1] else parts[1]
                if "## 5." in enriched_text or "## 6." in enriched_text:
                    parts = enriched_text.split("## 5.")
                    if len(parts) > 1:
                        astuces = "## 5." + parts[1]
                
                # Update Django DB
                if os.path.exists(DB_DJANGO):
                    conn = sqlite3.connect(DB_DJANGO)
                    c = conn.cursor()
                    c.execute("""
                        UPDATE syllabus_course SET content = ?, examples = ?, astuces = ? WHERE id = ?
                    """, (enriched_text, examples, astuces, course_id))
                    conn.commit()
                    conn.close()
                
                # Update concours.db
                if os.path.exists(DB_CONCOURS):
                    conn = sqlite3.connect(DB_CONCOURS)
                    c = conn.cursor()
                    c.execute("""
                        UPDATE courses SET content = ?, examples = ?, astuces = ? WHERE id = ?
                    """, (enriched_text, examples, astuces, course_id))
                    conn.commit()
                    conn.close()
                
                print(f"   ✅ Course ID {course_id} enriched ({len(enriched_text)} chars) via {model_name}@{loc}")
                return True
                
            except Exception as e:
                print(f"   ⚠ {model_name}@{loc} failed: {e}")
                time.sleep(5)
    
    print(f"   ✗ Could not enrich Course ID {course_id} in any region/model.")
    return False


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    
    print(f"📚 Sciences de l'Éducation - Course Enrichment")
    print(f"   Courses to enrich: {SCIENCES_EDU_COURSE_IDS}")
    print(f"   Content file: {CONTENT_FILE}")
    print(f"   Exists: {os.path.exists(CONTENT_FILE)}\n")
    
    success_count = 0
    for cid in SCIENCES_EDU_COURSE_IDS:
        if enrich_course(cid):
            success_count += 1
        time.sleep(5)
    
    print(f"\n{'='*70}")
    print(f"🏁 ENRICHMENT COMPLETE: {success_count}/{len(SCIENCES_EDU_COURSE_IDS)} courses enriched successfully")


if __name__ == "__main__":
    main()
