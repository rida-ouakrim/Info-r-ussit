"""
parse_sciences_edu_exams.py
============================
Extracts QCM questions from Sciences de l'Éducation (علوم التربية) exam PDFs (2022-2025)
using Gemini 2.5 Pro (Vertex AI), then inserts them into:
  - concours.db  (legacy SQLite)
  - backend/db.sqlite3 (Django production database)

The prompt is in ARABIC for maximum extraction quality since the exams are in Arabic.
Supports resuming from where it stopped via a progress JSON file.
Uses multi-location fallback to bypass quota limits.
"""

import os, sys, io, json, time, sqlite3
import pypdf
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR       = os.path.dirname(os.path.abspath(__file__))
SCIENCES_EDU_DIR = os.path.join(SCRIPT_DIR, "علوم التربية")
DB_CONCOURS      = os.path.join(SCRIPT_DIR, "concours.db")
DB_DJANGO        = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")
PROGRESS_FILE    = os.path.join(SCRIPT_DIR, "scratch", "sciences_edu_progress.json")
VERTEX_PROJECT   = "chrome-backbone-496013-p4"
LOCATIONS        = ["us-central1", "us-east4", "europe-west1", "asia-northeast1"]

# Models to try in order (most powerful first)
MODELS = ["gemini-2.5-pro", "gemini-2.5-flash"]

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass

# ── Exam PDFs to parse (ordered by year) ──────────────────────────────────────
EXAM_PDFS = [
    {"filename": "امتحان علوم التربية الثانوي دورة نونبر 2022.pdf", "year": 2022},
    {"filename": "اختبار علوم التربية 2023fr-ar-1.pdf", "year": 2023},
    {"filename": "2024 october exam science d'éducation.pdf", "year": 2024},
    {"filename": "exam 2025 Science d'éducation.pdf", "year": 2025},
]


# ── Pydantic Schema ───────────────────────────────────────────────────────────
class SciencesEduQuestion(BaseModel):
    question_number: str = Field(description="رقم السؤال مثل 'Q1', 'Q2'")
    question_text: str   = Field(description="النص الكامل للسؤال بالعربية أو الفرنسية كما هو في الامتحان")
    option_a: str        = Field(description="الخيار أ")
    option_b: str        = Field(description="الخيار ب")
    option_c: str        = Field(description="الخيار ج")
    option_d: str        = Field(description="الخيار د")
    correct_option: str  = Field(description="الحرف الصحيح: 'A', 'B', 'C', أو 'D'")
    explanation: str     = Field(
        description=(
            "شرح بيداغوجي واضح ومفصل (3-5 أسطر) يوضح لماذا هذا الجواب صحيح ولماذا الأجوبة الأخرى خاطئة. "
            "اكتب الشرح بالعربية مع إضافة المصطلح الفرنسي بين قوسين عند الحاجة."
        )
    )
    astuce: str          = Field(
        description=(
            "نصيحة سريعة أو حيلة للتذكر (1-2 سطر) بالعربية مع المصطلح الفرنسي. "
            "مثال: 'بياجي = البنائية (Constructivisme) / فيغوتسكي = البنائية الاجتماعية (Socio-constructivisme)'"
        )
    )
    subdomain_code: str  = Field(
        description=(
            "الكود الفرعي الأدق:\n"
            "  EDU_PSYCHO → علم النفس التربوي: نظريات التعلم (سلوكية، بنائية، معرفية، اجتماعية)، "
            "النمو النفسي للمراهق، الذكاءات المتعددة، الدافعية، بياجي، فيغوتسكي، بلوم، غاردنر\n"
            "  EDU_SOCIO  → علم اجتماع التربية: ديناميكية الجماعة، التواصل البيداغوجي، "
            "الإدماج، التربية الدامجة، المساواة، أخلاقيات المهنة، العنف المدرسي، الحياة المدرسية\n"
            "  DID_CONCEPTS → مفاهيم الديداكتيك العام: المثلث الديداكتيكي، النقل الديداكتيكي، "
            "العقد الديداكتيكي، التمثلات، العوائق، الوضعيات المشكلة\n"
            "  DID_APPROCHES → المقاربات البيداغوجية: بيداغوجيا الأهداف (PPO)، المقاربة بالكفايات (APC)، "
            "بيداغوجيا الخطأ، بيداغوجيا المشروع، البيداغوجيا الفارقية، التقويم\n"
            "  DID_CURRICULUM → المنهاج والموارد: الميثاق الوطني، الكتاب الأبيض، الرؤية الاستراتيجية، "
            "القانون الإطار 51.17، التوجيهات التربوية، TICE"
        )
    )

class PageQuestions(BaseModel):
    questions: List[SciencesEduQuestion]


# ── Arabic Prompt for Exam Extraction ─────────────────────────────────────────
PROMPT = """
هذه صفحة من امتحان مباراة توظيف أساتذة التعليم الثانوي في المغرب - مادة علوم التربية والديداكتيك العام.

المطلوب: استخرج جميع أسئلة الاختيار من متعدد (QCM) الموجودة في هذه الصفحة.

لكل سؤال:
1. استخرج رقم السؤال (مثل Q1, Q2).
2. استخرج النص الكامل للسؤال بالعربية (أو الفرنسية إذا كان السؤال بالفرنسية) كما هو مكتوب.
3. استخرج الخيارات الأربعة (أ، ب، ج، د) أو (A, B, C, D).
4. حل السؤال بدقة وحدد الجواب الصحيح. انتبه جيداً للأسئلة التي تحتوي على نفي أو "ليس من بين" أو "لا ينتمي إلى".
5. اكتب شرحاً بيداغوجياً واضحاً ومفصلاً بالعربية (3-5 أسطر) مع إضافة المصطلحات الفرنسية بين قوسين.
6. اكتب نصيحة/حيلة سريعة للتذكر بالعربية (1-2 سطر).
7. صنف السؤال في الكود الفرعي المناسب:
   - EDU_PSYCHO: علم النفس التربوي، نظريات التعلم، النمو، الدافعية
   - EDU_SOCIO: علم الاجتماع التربوي، التواصل، الإدماج، الحياة المدرسية
   - DID_CONCEPTS: المثلث الديداكتيكي، النقل الديداكتيكي، العقد الديداكتيكي، التمثلات
   - DID_APPROCHES: PPO, APC, البيداغوجيا الفارقية، بيداغوجيا الخطأ، التقويم
   - DID_CURRICULUM: المنهاج، الميثاق الوطني، القانون الإطار، التوجيهات التربوية

⚠️ مهم جداً:
- إذا كانت الصفحة لا تحتوي على أسئلة (صفحة غلاف، تعليمات، فارغة)، أرجع قائمة فارغة.
- احرص على الدقة في تحديد الجواب الصحيح.
- حافظ على النص الأصلي للسؤال والخيارات كما هو دون تعديل.
"""


# ── Helpers ───────────────────────────────────────────────────────────────────
def get_page_bytes(pdf_path: str, page_num: int) -> bytes:
    reader = pypdf.PdfReader(pdf_path)
    writer = pypdf.PdfWriter()
    writer.add_page(reader.pages[page_num])
    buf = io.BytesIO()
    writer.write(buf)
    data = buf.getvalue()

    # Compress if too large (> 3 MB)
    if len(data) > 3 * 1024 * 1024:
        print(f"    [COMPRESS] {len(data)//1024}KB → compressing...")
        try:
            w2 = pypdf.PdfWriter()
            w2.add_page(reader.pages[page_num])
            w2.compress_identical_objects(remove_identicals=True, remove_orphans=True)
            b2 = io.BytesIO()
            w2.write(b2)
            c = b2.getvalue()
            if len(c) < len(data):
                print(f"    [COMPRESS] Now {len(c)//1024}KB ✓")
                return c
        except Exception as e:
            print(f"    [COMPRESS] Failed: {e}")
    return data


def load_progress() -> dict:
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_progress(p: dict):
    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(p, f, indent=2, ensure_ascii=False)


# ── Gemini Extraction with Multi-Location + Multi-Model Fallback ──────────────
def create_client(location: str):
    return genai.Client(
        vertexai=True,
        project=VERTEX_PROJECT,
        location=location,
        http_options=types.HttpOptions(timeout=300000),  # 5 min timeout for pro model
    )


def extract_page(pdf_path: str, page_num: int) -> list:
    """Extract questions from a single PDF page using Gemini, with multi-location + multi-model fallback."""
    page_bytes = get_page_bytes(pdf_path, page_num)
    
    for model_name in MODELS:
        for loc in LOCATIONS:
            retries, delay = 3, 30
            for attempt in range(retries):
                try:
                    client = create_client(loc)
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=[
                            types.Part.from_bytes(data=page_bytes, mime_type="application/pdf"),
                            PROMPT,
                        ],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=PageQuestions,
                            temperature=0.1,
                        ),
                    )
                    questions = json.loads(resp.text).get("questions", [])
                    if model_name != MODELS[0]:
                        print(f"(used {model_name}@{loc})", end=" ")
                    return questions
                except Exception as e:
                    err_str = str(e)
                    if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                        print(f"\n    Rate limited on {model_name}@{loc} (attempt {attempt+1}), waiting {delay}s...")
                        time.sleep(delay)
                        delay *= 2
                    elif "400" in err_str or "INVALID" in err_str:
                        print(f"\n    Invalid request on {model_name}@{loc}: {e}")
                        break  # Don't retry invalid requests, try next location
                    else:
                        print(f"\n    {model_name}@{loc} attempt {attempt+1} failed: {e}")
                        if attempt < retries - 1:
                            time.sleep(delay)
                            delay *= 1.5
                        break  # Try next location
            # Try next location
            continue
        # If we exhausted all locations for this model, try next model
        print(f"\n    Exhausted all locations for {model_name}, trying next model...")
    
    print(f"\n    ✗ All models and locations failed for page {page_num+1}. Skipping.")
    return []


# ── DB Insert ─────────────────────────────────────────────────────────────────
DOMAIN_MAP = {
    "DID_CONCEPTS":   "DIDACTIQUE",
    "DID_CURRICULUM":  "DIDACTIQUE",
    "DID_APPROCHES":  "DIDACTIQUE",
    "EDU_PSYCHO":     "SCIENCES_EDU",
    "EDU_SOCIO":      "SCIENCES_EDU",
}

VALID_SUBDOMAINS = set(DOMAIN_MAP.keys())

def normalize_subdomain(sub: str) -> str:
    """Normalize subdomain code, defaulting to EDU_PSYCHO if unrecognized."""
    sub = sub.strip().upper()
    if sub in VALID_SUBDOMAINS:
        return sub
    # Try common variants
    if "PSYCHO" in sub: return "EDU_PSYCHO"
    if "SOCIO" in sub: return "EDU_SOCIO"
    if "CONCEPT" in sub: return "DID_CONCEPTS"
    if "APPROCH" in sub: return "DID_APPROCHES"
    if "CURRICUL" in sub: return "DID_CURRICULUM"
    return "EDU_PSYCHO"  # Default

def fmt_qnum(q_num: str) -> str:
    q_num = q_num.strip()
    return q_num if q_num.upper().startswith("Q") else f"Q{q_num}"


def insert_concours(questions: list, year: int) -> int:
    if not os.path.exists(DB_CONCOURS):
        return 0
    conn = sqlite3.connect(DB_CONCOURS)
    cur  = conn.cursor()
    n = 0
    for q in questions:
        sub = normalize_subdomain(q.get("subdomain_code", "EDU_PSYCHO"))
        dom = DOMAIN_MAP.get(sub, "SCIENCES_EDU")
        # Deduplicate by question text
        cur.execute("SELECT COUNT(*) FROM questions WHERE question_text=?", (q["question_text"],))
        if cur.fetchone()[0]: continue
        cur.execute("""
            INSERT INTO questions (source_type,exam_year,question_number,question_text,
            option_a,option_b,option_c,option_d,correct_option,explanation,astuce,domain_code,subdomain_code)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, ("past_exam", year, fmt_qnum(q["question_number"]), q["question_text"],
              q["option_a"], q["option_b"], q["option_c"], q["option_d"],
              q["correct_option"].upper(), q["explanation"], q["astuce"], dom, sub))
        n += 1
    conn.commit(); conn.close()
    return n


def insert_django(questions: list, year: int) -> int:
    if not os.path.exists(DB_DJANGO):
        return 0
    conn = sqlite3.connect(DB_DJANGO)
    cur  = conn.cursor()
    n = 0
    for q in questions:
        sub = normalize_subdomain(q.get("subdomain_code", "EDU_PSYCHO"))
        dom = DOMAIN_MAP.get(sub, "SCIENCES_EDU")
        # Deduplicate by question text
        cur.execute("SELECT COUNT(*) FROM exams_question WHERE question_text=?", (q["question_text"],))
        if cur.fetchone()[0]: continue
        cur.execute("""
            INSERT INTO exams_question (source_type,exam_year,question_number,question_text,
            option_a,option_b,option_c,option_d,option_e,correct_option,explanation,astuce,
            domain_id,subdomain_id,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
        """, ("past_exam", year, fmt_qnum(q["question_number"]), q["question_text"],
              q["option_a"], q["option_b"], q["option_c"], q["option_d"], "",
              q["correct_option"].upper(), q["explanation"], q["astuce"], dom, sub))
        n += 1
    conn.commit(); conn.close()
    return n


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    # Verify all exam PDFs exist
    for exam in EXAM_PDFS:
        path = os.path.join(SCIENCES_EDU_DIR, exam["filename"])
        if not os.path.exists(path):
            print(f"✗ File not found: {exam['filename']}")
            return
    
    progress = load_progress()
    print(f"📚 Sciences de l'Éducation - Exam Parser")
    print(f"   Found {len(EXAM_PDFS)} exam PDFs. Progress file: {PROGRESS_FILE}\n")

    total_c, total_d = 0, 0

    for exam in EXAM_PDFS:
        filename = exam["filename"]
        year = exam["year"]
        file_key = filename
        
        file_progress = progress.get(file_key, {"done": False, "last_page": -1, "inserted_c": 0, "inserted_d": 0})

        if file_progress.get("done"):
            print(f"✓ {filename} ({year}) already completed ({file_progress['inserted_c']}+{file_progress['inserted_d']} questions). Skipping.")
            total_c += file_progress["inserted_c"]
            total_d += file_progress["inserted_d"]
            continue

        print(f"{'='*70}")
        print(f"📄 Processing: {filename} (Year {year})")

        pdf_path = os.path.join(SCIENCES_EDU_DIR, filename)
        try:
            reader = pypdf.PdfReader(pdf_path)
            total_pages = len(reader.pages)
            print(f"   Pages: {total_pages}")
        except Exception as e:
            print(f"   ✗ Cannot open: {e}")
            continue

        start_page = file_progress["last_page"] + 1
        if start_page > 0:
            print(f"   ▶ Resuming from page {start_page + 1}...")

        file_inserted_c = file_progress.get("inserted_c", 0)
        file_inserted_d = file_progress.get("inserted_d", 0)
        failed = False

        for page_num in range(start_page, total_pages):
            print(f"   → Page {page_num+1}/{total_pages}...", end=" ")
            time.sleep(4)  # Rate limiting

            try:
                questions = extract_page(pdf_path, page_num)
                print(f"{len(questions)} question(s) found")

                if questions:
                    n_c = insert_concours(questions, year)
                    n_d = insert_django(questions, year)
                    file_inserted_c += n_c
                    file_inserted_d += n_d
                    if n_c or n_d:
                        print(f"      ↳ Inserted: {n_c} concours.db | {n_d} Django DB")

                # Save progress after each page
                progress[file_key] = {
                    "done": False,
                    "last_page": page_num,
                    "inserted_c": file_inserted_c,
                    "inserted_d": file_inserted_d,
                }
                save_progress(progress)

            except Exception as e:
                print(f"\n   ✗ Critical error on page {page_num+1}: {e}")
                failed = True
                break

        if not failed:
            progress[file_key] = {
                "done": True,
                "last_page": total_pages - 1,
                "inserted_c": file_inserted_c,
                "inserted_d": file_inserted_d,
            }
            save_progress(progress)
            print(f"   ✅ DONE: {file_inserted_c} in concours.db | {file_inserted_d} in Django DB")
        else:
            print(f"   ⚠ Stopped at page {progress[file_key]['last_page']+1}. Re-run to resume.")

        total_c += file_inserted_c
        total_d += file_inserted_d

    print(f"\n{'='*70}")
    print(f"🏁 FINISHED. Total inserted:")
    print(f"   concours.db        : {total_c}")
    print(f"   backend/db.sqlite3 : {total_d}")


if __name__ == "__main__":
    main()
