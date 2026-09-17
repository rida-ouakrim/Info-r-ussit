"""
Script standalone pour reclassifier toutes les questions via Gemini Vertex AI
en utilisant les credentials Google Cloud locaux (vertex_credentials.json).

Usage:
    python backend/reclassify_json.py
    python backend/reclassify_json.py --domain DEV
    python backend/reclassify_json.py --subdomain DEV_ALGO
    python backend/reclassify_json.py --year 2025
    python backend/reclassify_json.py --dry-run
    python backend/reclassify_json.py --batch-size 5
"""

import json
import os
import sys
import time
import argparse
from pathlib import Path
from collections import defaultdict

# Force UTF-8 output to avoid Windows cp1252 crash on French/Arabic characters
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
INITIAL_DATA_PATH = BASE_DIR / "initial_data.json"
CREDENTIALS_PATH = Path("C:/Users/RIDA OUAKRIM/Desktop/rida/vertex_credentials.json")
PROJECT_ID = "chrome-backbone-496013-p4"

# ── Set Google credentials ─────────────────────────────────────────────────────
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(CREDENTIALS_PATH)

# ── Gemini SDK ─────────────────────────────────────────────────────────────────
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("ERROR: google-genai not installed. Run: pip install google-genai")
    sys.exit(1)


def get_gemini_client():
    """Create Vertex AI Gemini client."""
    for location in ["us-central1", "europe-west1", "us-east4"]:
        try:
            client = genai.Client(
                vertexai=True,
                project=PROJECT_ID,
                location=location,
                http_options=types.HttpOptions(timeout=60000)
            )
            print(f"[OK] Connected to Vertex AI ({location})")
            return client, location
        except Exception as e:
            print(f"  [{location}] failed: {e}")
            continue
    raise RuntimeError("Cannot connect to Vertex AI with provided credentials.")


def classify_batch(client, location, course_catalog, questions_batch):
    """Send a batch of questions to Gemini and get course assignments."""
    questions_block = []
    for q in questions_batch:
        q_desc = (
            f"QUESTION_ID: {q['pk']}\n"
            f"QUESTION_NUMBER: {q['fields'].get('question_number', 'N/A')}\n"
            f"YEAR: {q['fields'].get('exam_year', 'N/A')}\n"
            f"SUBDOMAIN: {q['fields'].get('subdomain', 'N/A')}\n"
            f"QUESTION: {(q['fields'].get('question_text') or '')[:600]}\n"
            f"A) {(q['fields'].get('option_a') or '')[:120]}\n"
            f"B) {(q['fields'].get('option_b') or '')[:120]}\n"
            f"C) {(q['fields'].get('option_c') or '')[:120]}\n"
            f"D) {(q['fields'].get('option_d') or '')[:120]}\n"
            f"EXPLANATION: {(q['fields'].get('explanation') or '')[:300]}\n"
            f"{'='*60}"
        )
        questions_block.append(q_desc)

    questions_str = "\n\n".join(questions_block)

    prompt = f"""You are an expert Computer Science Professor specializing in Moroccan teacher recruitment exams (CRMEF) in Informatique, Didactique and Sciences de l'Education.

Your task: For each question below, identify the SINGLE most specific and relevant course from the catalog.

COURSE CATALOG:
{course_catalog}

QUESTIONS TO CLASSIFY:
{questions_str}

CLASSIFICATION RULES:
- Read the FULL question text, options AND explanation carefully before deciding
- Match to the MOST SPECIFIC course possible:
  * A Tri à bulles question → "11. Algorithmes de Tri et Recherche" (NOT "Introduction")
  * A tableaux 1D/2D question → "06. Les Tableaux à 1D et 2D"
  * A boucles/TantQue question → "05. Structures Itératives et Boucles"
  * A récursivité question → "12. Récursivité et approche Diviser pour régner"
  * A graphes/DFS/BFS question → "14. Graphes"
  * An arbres/ABR question → "13. Arbres binaires et ABR"
  * An enregistrements/fichiers/piles question → "10. Structures de données..."
  * A complexité/Big-O question → "09. Complexité des algorithmes"
  * A fonctions/procédures question → "08. Procédures et Fonctions"
  * A chaînes de caractères question → "07. Chaînes de Caractères"
  * A SQL/SELECT/UPDATE question → use the BDD/SI course
  * A Word/Excel/Access/PowerPoint question → use the appropriate LOG_OFFICE course
  * A processus/ordonnancement OS question → use the appropriate SYS_OS course
  * A réseau/IP/routage question → use the appropriate SYS_NET course
  * APC/PPO/triangle didactique question → use the appropriate Didactique course
- ONLY return valid Course IDs from the catalog (integers)

Respond with ONLY a valid JSON array (NO markdown, NO extra text, NO code blocks):
[
  {{"question_id": 123, "course_id": 44, "reason": "Bubble sort algorithm error detection"}},
  {{"question_id": 124, "course_id": 39, "reason": "2D array access with index"}}
]"""

    # Only gemini-2.5-flash-lite is confirmed available on this Vertex AI project
    VERTEX_MODELS = [
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
    ]

    for attempt in range(4):
        try:
            model_name = VERTEX_MODELS[attempt % len(VERTEX_MODELS)]
            response = client.models.generate_content(
                model=model_name,
                contents=[prompt],
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json"
                )
            )
            raw = response.text.strip()
            # Clean markdown fences if present
            if raw.startswith("```"):
                parts = raw.split("```")
                raw = parts[1] if len(parts) > 1 else raw
                if raw.startswith("json"):
                    raw = raw[4:]
                raw = raw.strip().rstrip("`").strip()
            result = json.loads(raw)
            if isinstance(result, dict) and "mappings" in result:
                result = result["mappings"]
            return result
        except Exception as e:
            print(f"    Attempt {attempt+1}/4 failed: {e}")
            if attempt < 3:
                time.sleep(5 * (attempt + 1))

    return []


def main():
    parser = argparse.ArgumentParser(description="Reclassify questions in initial_data.json using Gemini AI")
    parser.add_argument("--domain", type=str, default=None, help="Filter by domain (e.g. DEV, SYS_RES, DIDACTIQUE)")
    parser.add_argument("--subdomain", type=str, default=None, help="Filter by subdomain (e.g. DEV_ALGO, LOG_OFFICE)")
    parser.add_argument("--year", type=int, default=None, help="Filter by exam year (e.g. 2025)")
    parser.add_argument("--dry-run", action="store_true", help="Preview only, do not save changes")
    parser.add_argument("--batch-size", type=int, default=8, help="Questions per API call (default: 8)")
    parser.add_argument("--start-from", type=int, default=0, help="Skip first N questions (for resuming)")
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print("QUESTION -> COURSE RECLASSIFIER (Gemini Vertex AI)")
    print(f"{'='*60}")
    if args.dry_run:
        print("*** DRY RUN - No changes will be saved ***")
    print()

    # Load data
    print(f"Loading {INITIAL_DATA_PATH}...")
    with open(INITIAL_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    # Build course catalog
    courses = {x["pk"]: x["fields"] for x in data if x.get("model") == "syllabus.course"}
    subdomains = {x["pk"]: x["fields"] for x in data if x.get("model") == "syllabus.subdomain"}
    domains = {x["pk"]: x["fields"] for x in data if x.get("model") == "syllabus.domain"}

    # Group courses by subdomain for the catalog
    by_subdomain = defaultdict(list)
    for pk, fields in courses.items():
        sub_code = fields.get("subdomain", "?")
        by_subdomain[sub_code].append((pk, fields.get("title", "")))

    catalog_lines = []
    for sub_code, course_list in sorted(by_subdomain.items()):
        sub_info = subdomains.get(sub_code, {})
        sub_name = sub_info.get("name", sub_code)
        dom_code = sub_info.get("domain", "?")
        catalog_lines.append(f"\n[{dom_code} / {sub_name} ({sub_code})]")
        for pk, title in sorted(course_list, key=lambda x: x[0]):
            catalog_lines.append(f"  ID={pk} : {title}")

    course_catalog = "\n".join(catalog_lines)
    print(f"Found {len(courses)} courses across {len(by_subdomain)} subdomains.")

    # Filter questions
    all_questions = [x for x in data if x.get("model") == "exams.question"]
    if args.domain:
        all_questions = [q for q in all_questions if q["fields"].get("domain") == args.domain]
    if args.subdomain:
        all_questions = [q for q in all_questions if q["fields"].get("subdomain") == args.subdomain]
    if args.year:
        all_questions = [q for q in all_questions if q["fields"].get("exam_year") == args.year]

    all_questions = all_questions[args.start_from:]
    total = len(all_questions)
    print(f"Questions to reclassify: {total} (starting from index {args.start_from})\n")

    if total == 0:
        print("No questions match filters.")
        return

    # Connect to Vertex AI
    client, location = get_gemini_client()

    # Build PK -> index map for updates
    pk_to_idx = {x["pk"]: i for i, x in enumerate(data) if x.get("model") == "exams.question"}

    # Process in batches
    batches = [all_questions[i:i+args.batch_size] for i in range(0, total, args.batch_size)]
    total_updated = 0
    total_unchanged = 0
    total_errors = 0

    for batch_idx, batch in enumerate(batches):
        print(f"\n--- Batch {batch_idx+1}/{len(batches)} ({len(batch)} questions) ---")

        mappings = classify_batch(client, location, course_catalog, batch)

        if not mappings:
            print(f"  ERROR: No response for this batch. Skipping {len(batch)} questions.")
            total_errors += len(batch)
            time.sleep(3)
            continue

        batch_map = {q["pk"]: q for q in batch}

        for m in mappings:
            q_pk = m.get("question_id")
            c_id = m.get("course_id")
            reason = m.get("reason", "")

            if not q_pk or not c_id:
                continue
            if q_pk not in batch_map:
                print(f"  WARNING: Unknown question PK {q_pk}")
                continue
            if c_id not in courses:
                print(f"  WARNING: Invalid course_id {c_id} for Q{q_pk} - skipping")
                continue

            q = batch_map[q_pk]
            old_course_id = q["fields"].get("course")
            old_title = courses[old_course_id].get("title", "None") if old_course_id in courses else "None"
            new_title = courses[c_id].get("title", "")

            # Get correct subdomain and domain from course
            course_subdomain = courses[c_id].get("subdomain")
            subdomain_domain = subdomains.get(course_subdomain, {}).get("domain")

            if old_course_id != c_id:
                # Sanitize reason: keep only ASCII + common chars for safe printing
                safe_reason = reason.encode('ascii', errors='replace').decode('ascii')[:80]
                print(f"  Q{q_pk} ({q['fields'].get('question_number')}): "
                      f"{old_title[:30]!r} -> {new_title[:30]!r}  ({safe_reason})")

                if not args.dry_run:
                    # Update in-memory data
                    data_idx = pk_to_idx[q_pk]
                    data[data_idx]["fields"]["course"] = c_id
                    if course_subdomain:
                        data[data_idx]["fields"]["subdomain"] = course_subdomain
                    if subdomain_domain:
                        data[data_idx]["fields"]["domain"] = subdomain_domain

                total_updated += 1
            else:
                print(f"  Q{q_pk}: [OK] {new_title[:40]!r}")
                total_unchanged += 1

        # Save to disk every 10 batches to preserve progress
        if not args.dry_run and total_updated > 0 and (batch_idx + 1) % 10 == 0:
            with open(INITIAL_DATA_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"  [AUTO-SAVE] Saved {total_updated} corrections so far...")

        time.sleep(2)  # Throttle between batches

    # Save results
    print(f"\n{'='*60}")
    print(f"DONE! Updated: {total_updated} | Unchanged: {total_unchanged} | Errors: {total_errors}")
    print(f"{'='*60}")

    if not args.dry_run and total_updated > 0:
        backup_path = INITIAL_DATA_PATH.with_suffix(".backup.json")
        import shutil
        shutil.copy2(INITIAL_DATA_PATH, backup_path)
        print(f"\nBackup saved to: {backup_path}")

        with open(INITIAL_DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"initial_data.json updated with {total_updated} corrections!")
        print(f"\nNext step: commit and push to GitHub, then run on GCP:")
        print("  git add backend/initial_data.json")
        print('  git commit -m "Reclassify all questions with Gemini AI"')
        print("  git push origin main")
    elif args.dry_run:
        print("\nDRY RUN complete. No files were modified.")


if __name__ == "__main__":
    main()
