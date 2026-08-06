"""
parse_didactique_exams.py
=========================
Extracts QCM questions from Didactique Informatique exam PDFs (2021-2025)
using Gemini (Vertex AI), then inserts them into:
  - concours.db  (legacy SQLite)
  - backend/db.sqlite3 (Django production database)

Supports resuming from where it stopped via a progress JSON file.
"""

import os, sys, io, json, time, sqlite3
import pypdf
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Optional

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR     = os.path.dirname(os.path.abspath(__file__))
DIDACTIQUE_DIR = os.path.join(SCRIPT_DIR, "didactique informatique")
DB_CONCOURS    = os.path.join(SCRIPT_DIR, "concours.db")
DB_DJANGO      = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")
PROGRESS_FILE  = os.path.join(SCRIPT_DIR, "scratch", "didactique_progress.json")
VERTEX_PROJECT = "chrome-backbone-496013-p4"
VERTEX_LOCATION = "us-central1"

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass


# ── Pydantic Schema ───────────────────────────────────────────────────────────
class DidactiqueQuestion(BaseModel):
    question_number: str = Field(description="Question number e.g. 'Q1', 'Q2'")
    question_text: str   = Field(description="Full question text in French.")
    option_a: str        = Field(description="Option A text")
    option_b: str        = Field(description="Option B text")
    option_c: str        = Field(description="Option C text")
    option_d: str        = Field(description="Option D text")
    correct_option: str  = Field(description="Correct letter: 'A', 'B', 'C', or 'D'")
    explanation: str     = Field(description="Clear pedagogical explanation in French (3-5 lines).")
    astuce: str          = Field(description="Short memorable tip in French (1-2 lines).")
    subdomain_code: str  = Field(
        description=(
            "Most precise subdomain:\n"
            "  DID_CONCEPTS   → Triangle didactique, transposition, contrat, représentations, obstacles, situations-problèmes\n"
            "  DID_CURRICULUM → Curriculum officiel marocain, ressources, TICE, progression, objectifs pédagogiques\n"
            "  DID_APPROCHES  → PPO, APC, démarche d'investigation, apprentissage actif, évaluation formative/sommative\n"
            "  EDU_PSYCHO     → Théories d'apprentissage (Piaget, Vygotsky, béhaviorisme, constructivisme), développement adolescent\n"
            "  EDU_SOCIO      → Sociologie scolaire, dynamique de classe, inclusion, communication, éthique"
        )
    )

class PageQuestions(BaseModel):
    questions: List[DidactiqueQuestion]


# ── Prompt ────────────────────────────────────────────────────────────────────
PROMPT = """
This is a page from a Moroccan competitive exam for Secondary School Computer Science Teachers,
specifically the DIDACTIQUE DE L'INFORMATIQUE (Didactics of Computer Science) section.

Extract ALL multiple-choice questions (QCM) visible on this page.

For each question:
1. Extract the question number (e.g. Q1, Q2).
2. Extract the full question text in French, preserving quotations and terms.
3. Extract the 4 answer options (A, B, C, D).
4. Solve the question carefully and identify the CORRECT answer.
5. Write a clear pedagogical EXPLANATION in French (3-5 lines).
6. Write a short ASTUCE (tip) in French (1-2 lines).
7. Assign the most appropriate subdomain code.

If the page has NO questions (cover page, instructions, blank), return an empty list.
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


def extract_year(filename: str) -> Optional[int]:
    for y in range(2018, 2030):
        if str(y) in filename:
            return y
    return None


def load_progress() -> dict:
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_progress(p: dict):
    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(p, f, indent=2)


# ── Gemini ────────────────────────────────────────────────────────────────────
def extract_page(client, pdf_path: str, page_num: int) -> list:
    page_bytes = get_page_bytes(pdf_path, page_num)
    retries, delay = 3, 40
    for attempt in range(retries):
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
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
            return json.loads(resp.text).get("questions", [])
        except Exception as e:
            print(f"    Attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                print(f"    Retry in {delay}s...")
                time.sleep(delay)
                delay *= 2
            else:
                print(f"    Skipping page {page_num+1}.")
                return []


# ── DB Insert ─────────────────────────────────────────────────────────────────
DOMAIN_MAP = {
    "DID_CONCEPTS":  "DIDACTIQUE",
    "DID_CURRICULUM":"DIDACTIQUE",
    "DID_APPROCHES": "DIDACTIQUE",
    "EDU_PSYCHO":    "SCIENCES_EDU",
    "EDU_SOCIO":     "SCIENCES_EDU",
}

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
        sub = q.get("subdomain_code", "DID_CONCEPTS")
        dom = DOMAIN_MAP.get(sub, "DIDACTIQUE")
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
        sub = q.get("subdomain_code", "DID_CONCEPTS")
        dom = DOMAIN_MAP.get(sub, "DIDACTIQUE")
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

    pdf_files = sorted([f for f in os.listdir(DIDACTIQUE_DIR) if f.lower().endswith(".pdf")])
    if not pdf_files:
        print("No PDFs found."); return

    progress = load_progress()
    print(f"Found {len(pdf_files)} PDFs. Progress file: {PROGRESS_FILE}\n")

    try:
        client = genai.Client(
            vertexai=True, project=VERTEX_PROJECT, location=VERTEX_LOCATION,
            http_options=types.HttpOptions(timeout=180000),
        )
        print("✓ Gemini client ready.\n")
    except Exception as e:
        print(f"✗ Gemini init failed: {e}"); return

    total_c, total_d = 0, 0

    for filename in pdf_files:
        year = extract_year(filename)
        if year is None:
            print(f"⚠ Cannot detect year for '{filename}', skipping."); continue

        file_key = filename
        file_progress = progress.get(file_key, {"done": False, "last_page": -1, "inserted_c": 0, "inserted_d": 0})

        if file_progress.get("done"):
            print(f"✓ {filename} already completed ({file_progress['inserted_d']} questions). Skipping.")
            total_c += file_progress["inserted_c"]
            total_d += file_progress["inserted_d"]
            continue

        print(f"{'='*60}")
        print(f"Processing: {filename} (Year {year})")

        try:
            reader = pypdf.PdfReader(os.path.join(DIDACTIQUE_DIR, filename))
            total_pages = len(reader.pages)
            print(f"  Pages: {total_pages}")
        except Exception as e:
            print(f"  ✗ Cannot open: {e}"); continue

        start_page = file_progress["last_page"] + 1
        if start_page > 0:
            print(f"  Resuming from page {start_page + 1}...")

        file_inserted_c = file_progress.get("inserted_c", 0)
        file_inserted_d = file_progress.get("inserted_d", 0)
        failed = False

        for page_num in range(start_page, total_pages):
            print(f"  → Page {page_num+1}/{total_pages}...", end=" ")
            time.sleep(3)

            try:
                questions = extract_page(client, os.path.join(DIDACTIQUE_DIR, filename), page_num)
                print(f"{len(questions)} question(s) found")

                n_c = insert_concours(questions, year)
                n_d = insert_django(questions, year)
                file_inserted_c += n_c
                file_inserted_d += n_d

                # Save progress after each page
                progress[file_key] = {
                    "done": False,
                    "last_page": page_num,
                    "inserted_c": file_inserted_c,
                    "inserted_d": file_inserted_d,
                }
                save_progress(progress)

            except Exception as e:
                print(f"\n  ✗ Critical error on page {page_num+1}: {e}")
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
            print(f"  ✓ DONE: {file_inserted_c} inserted in concours.db | {file_inserted_d} in Django DB")
        else:
            print(f"  ⚠ Stopped at page {progress[file_key]['last_page']+1}. Re-run to resume.")

        total_c += file_inserted_c
        total_d += file_inserted_d

    print(f"\n{'='*60}")
    print(f"FINISHED. Total inserted:")
    print(f"  concours.db        : {total_c}")
    print(f"  backend/db.sqlite3 : {total_d}")


if __name__ == "__main__":
    main()
