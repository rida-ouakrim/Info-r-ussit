"""
Management command to reclassify ALL questions to their correct courses using Gemini AI.
This reads each question's text and intelligently assigns the most precise matching course.

Usage (on the GCP server):
    cd ~/Info-r-ussit/backend && source venv/bin/activate
    python manage.py reclassify_all_questions
    python manage.py reclassify_all_questions --domain DEV        # Only DEV domain
    python manage.py reclassify_all_questions --domain DEV_ALGO   # Only DEV_ALGO subdomain
    python manage.py reclassify_all_questions --year 2025         # Only year 2025
    python manage.py reclassify_all_questions --dry-run           # Preview without saving
"""
import time
import json
import os
import sys
import urllib.request
from django.core.management.base import BaseCommand
from exams.models import Question
from syllabus.models import Course

# Try to import google.genai, fall back to REST API
try:
    from google import genai
    from google.genai import types
    HAS_GENAI_SDK = True
except ImportError:
    HAS_GENAI_SDK = False


def call_gemini_rest(prompt, api_key, model="gemini-2.0-flash", temperature=0.1):
    """Direct REST call to Gemini API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "response_mime_type": "application/json"
        }
    }
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        res_json = json.loads(resp.read().decode("utf-8"))
        return res_json["candidates"][0]["content"]["parts"][0]["text"]


def call_vertex_ai(prompt, project_id, location="us-east4", model="gemini-2.0-flash", temperature=0.1):
    """Call Gemini via Vertex AI SDK."""
    client = genai.Client(
        vertexai=True,
        project=project_id,
        location=location,
        http_options=types.HttpOptions(timeout=60000)
    )
    response = client.models.generate_content(
        model=model,
        contents=[prompt],
        config=types.GenerateContentConfig(
            temperature=temperature,
            response_mime_type="application/json"
        )
    )
    return response.text


class Command(BaseCommand):
    help = "Re-classify ALL questions to their correct courses using Gemini AI (reads the question, assigns the right course)."

    def add_arguments(self, parser):
        parser.add_argument("--domain", type=str, default=None, help="Filter by domain code (e.g. DEV, SYS_RES)")
        parser.add_argument("--subdomain", type=str, default=None, help="Filter by subdomain code (e.g. DEV_ALGO)")
        parser.add_argument("--year", type=int, default=None, help="Filter by exam year (e.g. 2025)")
        parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving to DB")
        parser.add_argument("--batch-size", type=int, default=10, help="Number of questions per AI call (default: 10)")
        parser.add_argument("--start-from", type=int, default=0, help="Skip the first N questions (for resuming)")

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        batch_size = options["batch_size"]
        start_from = options["start_from"]
        domain_filter = options["domain"]
        subdomain_filter = options["subdomain"]
        year_filter = options["year"]

        if dry_run:
            self.stdout.write(self.style.WARNING("*** DRY RUN MODE — No changes will be saved ***\n"))

        # --- Setup Gemini client ---
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        project_id = os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4")
        use_rest = bool(api_key)

        if use_rest:
            self.stdout.write(self.style.SUCCESS(f"[OK] Using Gemini REST API (key found)."))
        elif HAS_GENAI_SDK:
            self.stdout.write(self.style.SUCCESS(f"[OK] Using Vertex AI SDK (project: {project_id})."))
        else:
            self.stdout.write(self.style.ERROR("[ERROR] No Gemini API key and no google-genai SDK. Cannot proceed."))
            return

        # --- Load all courses ---
        courses = list(Course.objects.all().select_related("subdomain", "subdomain__domain"))
        if not courses:
            self.stdout.write(self.style.ERROR("No courses found in database!"))
            return

        course_map = {c.id: c for c in courses}

        # Build courses taxonomy for the prompt
        from collections import defaultdict
        by_subdomain = defaultdict(list)
        for c in courses:
            by_subdomain[c.subdomain.code].append(c)

        course_catalog_lines = []
        for sub_code, course_list in sorted(by_subdomain.items()):
            sub_name = course_list[0].subdomain.name
            dom_name = course_list[0].subdomain.domain.name if course_list[0].subdomain.domain else "?"
            course_catalog_lines.append(f"\n[{dom_name} / {sub_name} ({sub_code})]")
            for c in sorted(course_list, key=lambda x: x.id):
                course_catalog_lines.append(f"  ID={c.id} : {c.title}")

        course_catalog = "\n".join(course_catalog_lines)

        # --- Load questions ---
        qs = Question.objects.all().select_related("domain", "subdomain", "course")
        if domain_filter:
            qs = qs.filter(domain__code=domain_filter)
        if subdomain_filter:
            qs = qs.filter(subdomain__code=subdomain_filter)
        if year_filter:
            qs = qs.filter(exam_year=year_filter)

        questions = list(qs.order_by("id"))[start_from:]
        total = len(questions)

        self.stdout.write(self.style.NOTICE(
            f"\nClassifying {total} questions (from index {start_from}) — batch_size={batch_size}\n"
        ))

        if total == 0:
            self.stdout.write(self.style.WARNING("No questions match the filters."))
            return

        batches = [questions[i:i+batch_size] for i in range(0, total, batch_size)]
        total_updated = 0
        total_errors = 0

        for batch_idx, batch in enumerate(batches):
            self.stdout.write(f"\n--- Batch {batch_idx+1}/{len(batches)} ({len(batch)} questions) ---")

            # Build question descriptions for this batch
            questions_block = []
            for q in batch:
                q_desc = (
                    f"QUESTION_ID: {q.id}\n"
                    f"QUESTION_NUMBER: {q.question_number or 'N/A'}\n"
                    f"EXAM_YEAR: {q.exam_year or 'N/A'}\n"
                    f"CURRENT_SUBDOMAIN: {q.subdomain.code if q.subdomain else 'N/A'}\n"
                    f"QUESTION_TEXT: {q.question_text[:600]}\n"
                    f"OPTIONS: A) {q.option_a[:100]}  B) {q.option_b[:100]}  "
                    f"C) {q.option_c[:100]}  D) {q.option_d[:100]}\n"
                    f"EXPLANATION: {(q.explanation or '')[:300]}\n"
                    f"{'='*60}"
                )
                questions_block.append(q_desc)

            questions_str = "\n\n".join(questions_block)

            prompt = f"""You are an expert Computer Science Professor specializing in Moroccan teacher recruitment exams (CRMEF) in Informatique and Didactique.

Your task: For each question below, identify the SINGLE most specific and relevant course from the catalog.

COURSE CATALOG:
{course_catalog}

QUESTIONS TO CLASSIFY:
{questions_str}

CLASSIFICATION RULES:
- Read the full question text, options, and explanation carefully
- Match to the MOST SPECIFIC course (e.g., a Tri à bulles question → "11. Algorithmes de Tri et Recherche", NOT "Introduction à l'algorithmique")
- A question about a specific algorithm, data structure, or concept should map to the course covering that specific topic
- For Didactique/Sciences de l'éducation: match to the specific pedagogical concept (APC, triangle didactique, etc.)
- ONLY return valid Course IDs from the catalog above

Respond with ONLY a JSON array (no markdown, no extra text):
[
  {{"question_id": 123, "course_id": 44, "reason": "Question about bubble sort algorithm"}},
  {{"question_id": 124, "course_id": 39, "reason": "Question about 2D arrays"}},
  ...
]"""

            # --- Call Gemini ---
            raw_response = None
            for attempt in range(4):
                try:
                    if use_rest:
                        for model in ["gemini-2.0-flash", "gemini-1.5-flash"]:
                            try:
                                raw_response = call_gemini_rest(prompt, api_key, model=model)
                                break
                            except Exception:
                                continue
                    else:
                        for location in ["us-east4", "europe-west1", "us-central1"]:
                            try:
                                raw_response = call_vertex_ai(prompt, project_id, location=location)
                                break
                            except Exception:
                                continue

                    if raw_response:
                        break
                    else:
                        raise Exception("Empty response from API")

                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"  Attempt {attempt+1} failed: {e}"))
                    if attempt < 3:
                        time.sleep(5 * (attempt + 1))

            if not raw_response:
                self.stdout.write(self.style.ERROR(f"  FAILED batch {batch_idx+1} after 4 retries. Skipping."))
                total_errors += len(batch)
                continue

            # --- Parse response ---
            try:
                cleaned = raw_response.strip()
                # Remove potential markdown code fences
                if cleaned.startswith("```"):
                    cleaned = cleaned.split("```")[1]
                    if cleaned.startswith("json"):
                        cleaned = cleaned[4:]
                    cleaned = cleaned.strip().rstrip("`").strip()
                mappings = json.loads(cleaned)
                if isinstance(mappings, dict) and "mappings" in mappings:
                    mappings = mappings["mappings"]
            except json.JSONDecodeError as e:
                self.stdout.write(self.style.ERROR(f"  JSON parse error: {e}\n  Raw: {raw_response[:300]}"))
                total_errors += len(batch)
                continue

            # --- Apply mappings ---
            batch_updated = 0
            q_id_map = {q.id: q for q in batch}

            for m in mappings:
                q_id = m.get("question_id")
                c_id = m.get("course_id")
                reason = m.get("reason", "")

                if not q_id or not c_id:
                    continue
                if q_id not in q_id_map:
                    self.stdout.write(self.style.WARNING(f"    Unknown question_id {q_id}"))
                    continue
                if c_id not in course_map:
                    self.stdout.write(self.style.WARNING(f"    Invalid course_id {c_id} for Q{q_id}"))
                    continue

                q_obj = q_id_map[q_id]
                c_obj = course_map[c_id]
                old_course = q_obj.course.title[:40] if q_obj.course else "None"
                new_course = c_obj.title[:40]

                if q_obj.course_id != c_id:
                    self.stdout.write(
                        f"  Q{q_id} ({q_obj.question_number}): {old_course!r} → {new_course!r}  | {reason}"
                    )

                    if not dry_run:
                        q_obj.course = c_obj
                        q_obj.subdomain = c_obj.subdomain
                        q_obj.domain = c_obj.subdomain.domain
                        q_obj.save(update_fields=["course", "subdomain", "domain"])

                    batch_updated += 1
                    total_updated += 1
                else:
                    self.stdout.write(f"  Q{q_id}: [unchanged] {new_course!r}")

            self.stdout.write(self.style.SUCCESS(
                f"  Batch {batch_idx+1}: {batch_updated} questions re-assigned."
            ))

            # Throttle to avoid rate limits
            time.sleep(2)

        # --- Final summary ---
        self.stdout.write(self.style.SUCCESS(
            f"\n{'='*60}\n"
            f"DONE! Total re-classified: {total_updated} | Errors: {total_errors}\n"
            f"{'='*60}"
        ))

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN — No changes were saved. Run without --dry-run to apply."))
        else:
            self.stdout.write(self.style.NOTICE(
                "\nNext step: export updated data to initial_data.json:\n"
                "  python manage.py dumpdata exams.question --indent 2 > /tmp/questions_reclassified.json\n"
            ))
