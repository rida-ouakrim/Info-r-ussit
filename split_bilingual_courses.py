"""
split_bilingual_courses.py
===========================
Splits bilingual courses (IDs 36-39 = Sciences de l'Éducation) into:
  - content_ar : Pure Arabic version
  - content_fr : Pure French version
  - content    : Cleaned bilingual (intro phrase removed)

Also removes the unprofessional intro phrase from all bilingual courses.
"""

import os, sys, re, sqlite3, json, time

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

BILINGUAL_COURSE_IDS = [36, 37, 38, 39]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "backend", "db.sqlite3")


def clean_intro(content: str) -> str:
    """Remove unprofessional intro phrases from content."""
    cleaned = content

    # Remove the بصفتي... pattern at the very start (before first real heading)
    pattern = r'^بصفتي.*?(?=\n---\n|\n#+\s)'
    cleaned = re.sub(pattern, '', cleaned, flags=re.DOTALL)

    # Also handle "ترشح/المترشح" address patterns at start
    pattern2 = r'^(المترشح\(ة\)|ترشح\(ة\)).*?بصفتي.*?(?=\n---\n|\n#+\s)'
    cleaned = re.sub(pattern2, '', cleaned, flags=re.DOTALL)

    # Remove any leading --- separator after the removed intro
    cleaned = re.sub(r'^\s*---\s*\n', '', cleaned)

    # Strip leading whitespace
    cleaned = cleaned.lstrip('\n\r ')

    return cleaned


def split_bilingual_with_ai(course_id: int, title: str, content: str) -> dict:
    """Use Gemini (Vertex AI) to split bilingual content into AR and FR versions."""

    prompt = f"""You are processing bilingual Arabic-French educational content from a CRMEF Morocco teacher training exam preparation platform.

The following course content is written in BOTH Arabic and French, mixed throughout.

Your task is to SEPARATE this into two clean versions:
1. content_ar: Pure Arabic — all Arabic text with full structure
2. content_fr: Pure French — all French text with full structure

Rules:
- Keep ALL content, just separate by language
- Maintain markdown formatting (headers, bullets, tables, bold, etc.)
- For bilingual tables (separate rows/columns per language), include the full table in BOTH versions
- Keep technical terms (ZPD, CRMEF, Béhaviorisme, etc.) in both versions  
- Do NOT translate anything — just separate existing content
- Keep section numbering consistent in both versions
- Remove any intro phrase that starts with "بصفتي أستاذاً" or similar personal intro

Course: {title}

BILINGUAL CONTENT:
{content[:10000]}

Return ONLY a JSON object:
{{
  "content_ar": "... full arabic markdown ...",
  "content_fr": "... full french markdown ..."
}}"""

    models = ["gemini-2.5-flash", "gemini-2.5-pro"]
    for model_name in models:
        for loc in LOCATIONS:
            try:
                print(f"   → Trying {model_name}@{loc}...")
                client = genai.Client(
                    vertexai=True,
                    project=VERTEX_PROJECT,
                    location=loc,
                    http_options=types.HttpOptions(timeout=180000),
                )
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(temperature=0.1),
                )
                text = response.text.strip()

                # Remove markdown code blocks if present
                if text.startswith('```json'):
                    text = text[7:]
                if text.startswith('```'):
                    text = text[3:]
                if text.endswith('```'):
                    text = text[:-3]

                result = json.loads(text.strip())
                if result.get('content_ar') and result.get('content_fr'):
                    return result
                print(f"   ⚠ Response missing required keys, trying next...")
            except json.JSONDecodeError as e:
                print(f"   ⚠ JSON parse error: {e}")
            except Exception as e:
                print(f"   ⚠ {model_name}@{loc} failed: {e}")
                time.sleep(3)

    return None


def main():
    print("🚀 Splitting bilingual Sciences de l'Éducation courses...\n")

    conn = sqlite3.connect(DB_DJANGO)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # Verify columns exist
    c.execute("PRAGMA table_info(syllabus_course)")
    cols = [row[1] for row in c.fetchall()]
    has_bilingual = 'content_ar' in cols and 'content_fr' in cols
    print(f"✓ content_ar/content_fr columns: {'present' if has_bilingual else 'MISSING'}\n")

    for course_id in BILINGUAL_COURSE_IDS:
        c.execute("SELECT id, title, content FROM syllabus_course WHERE id = ?", (course_id,))
        row = c.fetchone()

        if not row:
            print(f"⚠️ Course {course_id} not found in DB")
            continue

        title = row['title']
        content = row['content'] or ''

        print(f"\n{'='*65}")
        print(f"📚 Course {course_id}: {title[:65]}")
        print(f"   Content: {len(content)} chars")

        # Step 1: Clean intro phrase
        cleaned = clean_intro(content)
        removed = len(content) - len(cleaned)
        print(f"   Cleaned: {len(cleaned)} chars (removed {removed} chars of intro)")

        if has_bilingual:
            print(f"   🤖 Splitting with Gemini...")
            result = split_bilingual_with_ai(course_id, title, cleaned)

            if result:
                content_ar = result.get('content_ar', '')
                content_fr = result.get('content_fr', '')
                print(f"   ✅ AR: {len(content_ar)} chars | FR: {len(content_fr)} chars")
                c.execute(
                    "UPDATE syllabus_course SET content = ?, content_ar = ?, content_fr = ? WHERE id = ?",
                    (cleaned, content_ar, content_fr, course_id)
                )
            else:
                print("   ⚠️ AI split failed — saving cleaned content only")
                c.execute("UPDATE syllabus_course SET content = ? WHERE id = ?", (cleaned, course_id))
        else:
            c.execute("UPDATE syllabus_course SET content = ? WHERE id = ?", (cleaned, course_id))
            print("   ✅ Cleaned intro (no bilingual columns)")

        conn.commit()
        time.sleep(5)

    conn.close()

    print("\n\n🎉 Done! Verification:")
    conn = sqlite3.connect(DB_DJANGO)
    c = conn.cursor()
    for cid in BILINGUAL_COURSE_IDS:
        c.execute("SELECT id, length(content), length(content_ar), length(content_fr) FROM syllabus_course WHERE id = ?", (cid,))
        row = c.fetchone()
        if row:
            print(f"  Course {row[0]}: content={row[1]}, content_ar={row[2]}, content_fr={row[3]}")
    conn.close()


if __name__ == '__main__':
    main()
