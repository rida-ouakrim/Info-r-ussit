"""
generate_sciences_edu_qcm.py
==============================
Generates targeted AI QCM questions for Sciences de l'Éducation (علوم التربية)
using the enriched course content and Gemini 2.5 Flash.

Generates bilingual questions (Arabic with French terms) covering:
- Educational psychology theories and theorists
- Pedagogical approaches (PPO, APC, error pedagogy, etc.)
- Moroccan educational legislation and reforms
- Comparative questions and trap questions

Inserts with source_type = 'ai_generated' into both databases.
"""

import os, sys, json, sqlite3, time
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR     = os.path.dirname(os.path.abspath(__file__))
DB_CONCOURS    = os.path.join(SCRIPT_DIR, "concours.db")
DB_DJANGO      = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")
VERTEX_PROJECT = "chrome-backbone-496013-p4"
LOCATIONS      = ["us-central1", "us-east4", "europe-west1", "asia-northeast1"]

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass


# ── Pydantic Schema ───────────────────────────────────────────────────────────
class GeneratedQuestion(BaseModel):
    question_text: str = Field(description="نص السؤال بالعربية (أو ثنائي اللغة)")
    option_a: str = Field(description="الخيار أ")
    option_b: str = Field(description="الخيار ب")
    option_c: str = Field(description="الخيار ج")
    option_d: str = Field(description="الخيار د")
    correct_option: str = Field(description="الحرف الصحيح: 'A', 'B', 'C', أو 'D'")
    explanation: str = Field(
        description="شرح مفصل ثنائي اللغة (عربي + فرنسي) لماذا هذا الجواب صحيح ولماذا الأجوبة الأخرى خاطئة (3-5 أسطر)"
    )
    astuce: str = Field(
        description="نصيحة سريعة للتذكر ثنائية اللغة (1-2 سطر)"
    )
    difficulty: str = Field(description="مستوى الصعوبة: 'easy', 'medium', أو 'hard'")

class GeneratedQuestions(BaseModel):
    questions: List[GeneratedQuestion]


# ── Question Generation Themes ────────────────────────────────────────────────
GENERATION_THEMES = [
    {
        "subdomain": "EDU_PSYCHO",
        "theme": "نظريات التعلم والمنظرون",
        "prompt_context": """
        أنشئ أسئلة QCM حول نظريات التعلم:
        - السلوكية (Béhaviorisme): واطسون، سكينر، بافلوف، ثورندايك
        - البنائية (Constructivisme): بياجي - مراحل النمو المعرفي
        - البنائية الاجتماعية (Socio-constructivisme): فيغوتسكي - منطقة النمو القريب (ZPD)
        - المعرفية (Cognitivisme): برونر، أوزوبل، غانيي
        - الذكاءات المتعددة (Intelligences multiples): غاردنر
        - التعلم بالملاحظة (Apprentissage social): باندورا
        - تصنيف بلوم (Taxonomie de Bloom): المعرفة، الفهم، التطبيق، التحليل، التركيب، التقويم
        
        ⚠️ ركز على:
        - أسئلة الربط بين المنظر ونظريته
        - أسئلة التمييز بين النظريات المتشابهة
        - أسئلة حول المفاهيم الأساسية لكل نظرية
        - أسئلة بصيغة النفي ("ليس من بين", "لا ينتمي إلى")
        """,
        "count": 15,
    },
    {
        "subdomain": "EDU_PSYCHO",
        "theme": "النمو النفسي والدافعية",
        "prompt_context": """
        أنشئ أسئلة QCM حول:
        - مراحل النمو عند بياجي (Stades de développement de Piaget):
          * الحسي-حركي (0-2), ما قبل العمليات (2-7), العمليات المادية (7-11), العمليات المجردة (11+)
        - النمو الأخلاقي عند كولبرغ (Kohlberg)
        - النمو النفسي-اجتماعي عند إريكسون (Erikson)
        - الدافعية الداخلية والخارجية (Motivation intrinsèque/extrinsèque)
        - نظرية تقرير المصير (Théorie de l'autodétermination): ديسي وراين
        - هرم ماسلو (Pyramide de Maslow)
        - خصائص المراهقة وانعكاساتها التربوية
        """,
        "count": 12,
    },
    {
        "subdomain": "EDU_SOCIO",
        "theme": "علم اجتماع التربية والتواصل",
        "prompt_context": """
        أنشئ أسئلة QCM حول:
        - ديناميكية الجماعة (Dynamique de groupe): كورت لوين
        - التواصل البيداغوجي: أنواعه، معيقاته، تقنياته
        - العلاقة التربوية: أنماط السلطة (ديمقراطي، استبدادي، تسيبي)
        - العنف المدرسي والتنمر: الأسباب والحلول
        - الإعاقة والتربية الدامجة (Éducation inclusive)
        - المساواة بين الجنسين في المدرسة (Égalité des genres)
        - أخلاقيات مهنة التدريس (Éthique professionnelle)
        - الحياة المدرسية: المجالس، الأندية، مشروع المؤسسة
        """,
        "count": 15,
    },
    {
        "subdomain": "DID_CONCEPTS",
        "theme": "مفاهيم الديداكتيك العام",
        "prompt_context": """
        أنشئ أسئلة QCM حول مفاهيم الديداكتيك العام:
        - المثلث الديداكتيكي (Triangle didactique): المعرفة، المتعلم، المدرس
        - النقل الديداكتيكي (Transposition didactique): شوفالار - المعرفة العالمة → المعرفة المدرسية
        - العقد الديداكتيكي (Contrat didactique): بروسو
        - التمثلات (Représentations): الحاجز الإبستمولوجي
        - الوضعية المشكلة (Situation-problème): خصائصها، مراحلها
        - الصراع المعرفي (Conflit cognitif) والصراع المعرفي-الاجتماعي
        - العائق الديداكتيكي والإبستمولوجي (Obstacle didactique/épistémologique): باشلار
        - مفهوم الانحراف (Dévolution): بروسو
        """,
        "count": 15,
    },
    {
        "subdomain": "DID_APPROCHES",
        "theme": "المقاربات البيداغوجية والتقويم",
        "prompt_context": """
        أنشئ أسئلة QCM حول:
        - بيداغوجيا الأهداف (PPO): ماجر، بلوم - الأهداف الإجرائية، تصنيف بلوم
        - المقاربة بالكفايات (APC): تعريف الكفاية، أنواع الكفايات، وضعية الإدماج
        - بيداغوجيا الخطأ (Pédagogie de l'erreur): مصادر الخطأ، استثمار الخطأ
        - البيداغوجيا الفارقية (Pédagogie différenciée): تعريفها، أنواع الفروقات
        - بيداغوجيا المشروع (Pédagogie de projet)
        - بيداغوجيا الإدماج (Pédagogie de l'intégration): روجيرس
        - بيداغوجيا حل المشكلات (Résolution de problèmes)
        - التقويم (Évaluation): تشخيصي، تكويني، إجمالي، إشهادي
        - الوثائق التربوية: جذاذة، مذكرة يومية، دفتر النصوص
        
        ⚠️ أنشئ أسئلة مقارنة بين المقاربات (PPO vs APC)
        """,
        "count": 15,
    },
    {
        "subdomain": "DID_CURRICULUM",
        "theme": "التشريع التربوي والمنهاج المغربي",
        "prompt_context": """
        أنشئ أسئلة QCM حول التشريع والمنهاج التربوي المغربي:
        - الميثاق الوطني للتربية والتكوين (Charte Nationale) 1999/2000
        - الكتاب الأبيض (Livre Blanc) 2002
        - المخطط الاستعجالي (Plan d'urgence) 2009-2012
        - الرؤية الاستراتيجية 2015-2030 (Vision stratégique)
        - القانون الإطار 51.17 (Loi-cadre)
        - النظام الأساسي لموظفي التعليم
        - مجالس المؤسسة: مجلس التدبير، المجلس التربوي، مجالس الأقسام
        - التوجيهات التربوية والبرامج الدراسية
        - مشروع المؤسسة ومشروع القسم
        - الحياة المدرسية: الأندية، الأنشطة الموازية
        
        ⚠️ ركز على التواريخ والأرقام والتسلسل الزمني للإصلاحات
        """,
        "count": 12,
    },
]


# ── Domain mapping ────────────────────────────────────────────────────────────
DOMAIN_MAP = {
    "DID_CONCEPTS":   "DIDACTIQUE",
    "DID_CURRICULUM":  "DIDACTIQUE",
    "DID_APPROCHES":  "DIDACTIQUE",
    "EDU_PSYCHO":     "SCIENCES_EDU",
    "EDU_SOCIO":      "SCIENCES_EDU",
}


def get_course_content(subdomain_code: str) -> str:
    """Get enriched course content for context."""
    content_parts = []
    for db_path, table, sub_col in [
        (DB_DJANGO, "syllabus_course", "subdomain_id"),
        (DB_CONCOURS, "courses", "subdomain_code"),
    ]:
        if not os.path.exists(db_path):
            continue
        try:
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute(f"SELECT title, content FROM {table} WHERE {sub_col} = ? AND content IS NOT NULL AND content != ''",
                      (subdomain_code,))
            for r in c.fetchall():
                content_parts.append(f"### {r['title']}\n{r['content'][:5000]}")
            conn.close()
            if content_parts:
                break
        except Exception as e:
            print(f"    DB error: {e}")
    
    return "\n\n".join(content_parts) if content_parts else ""


def generate_questions(theme_info: dict) -> list:
    """Generate QCM questions for a theme using Gemini with multi-location fallback."""
    subdomain = theme_info["subdomain"]
    theme = theme_info["theme"]
    context = theme_info["prompt_context"]
    count = theme_info["count"]
    
    course_content = get_course_content(subdomain)
    
    prompt = f"""
أنت خبير في إعداد أسئلة مباريات توظيف أساتذة التعليم الثانوي بالمغرب - مادة علوم التربية.

الموضوع: {theme}
المجال الفرعي: {subdomain}

{'───── محتوى الدرس المرجعي ─────' if course_content else ''}
{course_content[:10000] if course_content else ''}

───── التعليمات ─────
{context}

أنشئ بالضبط {count} سؤال QCM بمستويات صعوبة متنوعة (easy, medium, hard).

قواعد مهمة:
1. اكتب السؤال بالعربية مع إضافة المصطلح الفرنسي بين قوسين
2. اجعل الخيارات متقاربة ومعقولة (تجنب الخيارات السخيفة)
3. استخدم صيغ مختلفة: "أي مما يلي"، "ليس من بين"، "يعتبر"، "حدد"...
4. الشرح يجب أن يكون ثنائي اللغة (عربي + فرنسي) ومفصل
5. كل نصيحة (astuce) يجب أن تساعد على التذكر السريع
6. تأكد من صحة الجواب الصحيح
"""
    
    models = ["gemini-2.5-flash", "gemini-2.5-pro"]  # Flash first for generation (faster/cheaper)
    for model_name in models:
        for loc in LOCATIONS:
            retries, delay = 3, 30
            for attempt in range(retries):
                try:
                    client = genai.Client(
                        vertexai=True,
                        project=VERTEX_PROJECT,
                        location=loc,
                        http_options=types.HttpOptions(timeout=180000),
                    )
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=[prompt],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=GeneratedQuestions,
                            temperature=0.7,  # Higher temp for diversity
                        ),
                    )
                    questions = json.loads(resp.text).get("questions", [])
                    return questions
                except Exception as e:
                    err_str = str(e)
                    if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                        print(f"\n    Rate limited {model_name}@{loc}, waiting {delay}s...")
                        time.sleep(delay)
                        delay *= 2
                    else:
                        print(f"\n    {model_name}@{loc} failed: {e}")
                        if attempt < retries - 1:
                            time.sleep(delay)
                        break
    
    return []


def insert_questions(questions: list, subdomain: str, theme: str) -> tuple:
    """Insert generated questions into both databases. Returns (n_concours, n_django)."""
    domain = DOMAIN_MAP.get(subdomain, "SCIENCES_EDU")
    n_c, n_d = 0, 0
    
    for i, q in enumerate(questions):
        q_num = f"AI_{subdomain}_{i+1}"
        correct = q.get("correct_option", "A").upper()
        if correct not in ("A", "B", "C", "D"):
            correct = "A"
        
        # Insert into concours.db
        if os.path.exists(DB_CONCOURS):
            conn = sqlite3.connect(DB_CONCOURS)
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM questions WHERE question_text=?", (q["question_text"],))
            if not c.fetchone()[0]:
                c.execute("""
                    INSERT INTO questions (source_type, exam_year, question_number, question_text,
                    option_a, option_b, option_c, option_d, correct_option, explanation, astuce,
                    domain_code, subdomain_code)
                    VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, ("ai_generated", q_num, q["question_text"],
                      q["option_a"], q["option_b"], q["option_c"], q["option_d"],
                      correct, q["explanation"], q["astuce"], domain, subdomain))
                n_c += 1
            conn.commit(); conn.close()
        
        # Insert into Django DB
        if os.path.exists(DB_DJANGO):
            conn = sqlite3.connect(DB_DJANGO)
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM exams_question WHERE question_text=?", (q["question_text"],))
            if not c.fetchone()[0]:
                c.execute("""
                    INSERT INTO exams_question (source_type, exam_year, question_number, question_text,
                    option_a, option_b, option_c, option_d, option_e, correct_option, explanation, astuce,
                    domain_id, subdomain_id, created_at)
                    VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                """, ("ai_generated", q_num, q["question_text"],
                      q["option_a"], q["option_b"], q["option_c"], q["option_d"], "",
                      correct, q["explanation"], q["astuce"], domain, subdomain))
                n_d += 1
            conn.commit(); conn.close()
    
    return n_c, n_d


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    
    print(f"🧠 Sciences de l'Éducation - AI QCM Generator")
    print(f"   Themes to process: {len(GENERATION_THEMES)}")
    print(f"   Target: ~{sum(t['count'] for t in GENERATION_THEMES)} questions total\n")
    
    total_c, total_d = 0, 0
    
    for idx, theme in enumerate(GENERATION_THEMES):
        print(f"{'='*70}")
        print(f"📝 [{idx+1}/{len(GENERATION_THEMES)}] {theme['theme']} ({theme['subdomain']})")
        print(f"   Target: {theme['count']} questions")
        
        time.sleep(3)
        
        questions = generate_questions(theme)
        print(f"   Generated: {len(questions)} questions")
        
        if questions:
            n_c, n_d = insert_questions(questions, theme["subdomain"], theme["theme"])
            total_c += n_c
            total_d += n_d
            print(f"   ✅ Inserted: {n_c} concours.db | {n_d} Django DB")
        else:
            print(f"   ⚠ No questions generated for this theme")
        
        time.sleep(5)
    
    print(f"\n{'='*70}")
    print(f"🏁 QCM GENERATION COMPLETE")
    print(f"   Total inserted in concours.db: {total_c}")
    print(f"   Total inserted in Django DB:   {total_d}")
    
    # Print final stats
    if os.path.exists(DB_CONCOURS):
        conn = sqlite3.connect(DB_CONCOURS)
        c = conn.cursor()
        c.execute("""
            SELECT subdomain_code, source_type, COUNT(*) 
            FROM questions 
            WHERE domain_code IN ('SCIENCES_EDU', 'DIDACTIQUE')
            GROUP BY subdomain_code, source_type
            ORDER BY subdomain_code
        """)
        print(f"\n   Final question breakdown (concours.db):")
        for r in c.fetchall():
            print(f"     {r[0]} [{r[1]}]: {r[2]} questions")
        conn.close()


if __name__ == "__main__":
    main()
