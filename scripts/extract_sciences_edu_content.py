"""
extract_sciences_edu_content.py
================================
Extracts structured content from Sciences de l'Éducation summary/guide PDFs
using Gemini 2.5 Pro (Vertex AI) for course enrichment.

Processes 5 reference PDFs and saves structured bilingual content (Arabic + French)
to a JSON file for later use in course enrichment.

Uses multi-location fallback and page-by-page processing for the large guide (54MB).
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
OUTPUT_FILE      = os.path.join(SCRIPT_DIR, "scratch", "sciences_edu_content.json")
PROGRESS_FILE    = os.path.join(SCRIPT_DIR, "scratch", "sciences_edu_content_progress.json")
VERTEX_PROJECT   = "chrome-backbone-496013-p4"
LOCATIONS        = ["us-central1", "us-east4", "europe-west1", "asia-northeast1"]

import builtins
def print(*args, **kwargs):
    try:
        builtins.print(*args, **kwargs, flush=True)
    except OSError:
        pass

# ── PDFs to extract (ordered by priority/richness) ──────────────────────────
CONTENT_PDFS = [
    {
        "filename": "Noor-Book.com  ملخص رائع وشامل في علوم التربية تلخيص سعيد عطاط 2 .pdf",
        "label": "ملخص شامل - سعيد عطاط",
        "type": "summary",
        "pages_per_batch": 3,  # Small PDF, batch 3 pages
    },
    {
        "filename": "ملخص البيداغوجيات.pdf",
        "label": "ملخص البيداغوجيات",
        "type": "summary",
        "pages_per_batch": 3,
    },
    {
        "filename": "ملخص مختصر عبارة عن خطاطات لعلوم التربية.pdf",
        "label": "خطاطات علوم التربية",
        "type": "schemas",
        "pages_per_batch": 2,
    },
    {
        "filename": "مرجع مهم في علوم التربية.pdf",
        "label": "مرجع مهم في علوم التربية",
        "type": "reference",
        "pages_per_batch": 2,
    },
    {
        "filename": "دليل علوم التربية والديداكتيك العام( ذ. عبد الفتاح ديبون) نسخة جديدة 2025.pdf",
        "label": "دليل شامل 2025 - عبد الفتاح ديبون",
        "type": "comprehensive_guide",
        "pages_per_batch": 2,  # Large PDF, process 2 pages at a time
    },
]


# ── Pydantic Schema for structured content extraction ─────────────────────────
class ExtractedContent(BaseModel):
    topic: str = Field(description="عنوان الموضوع الرئيسي / Titre du sujet principal")
    subtopic: str = Field(description="العنوان الفرعي إن وجد / Sous-titre si disponible")
    content_arabic: str = Field(description="المحتوى المستخرج بالعربية بتنسيق Markdown منظم")
    content_french: str = Field(description="Traduction/résumé en français du contenu en Markdown structuré")
    key_terms: str = Field(
        description=(
            "المصطلحات الأساسية بالعربية والفرنسية، مثل:\n"
            "البنائية = Constructivisme\n"
            "المثلث الديداكتيكي = Triangle didactique"
        )
    )
    subdomain_code: str = Field(
        description=(
            "الكود الفرعي:\n"
            "  EDU_PSYCHO → علم النفس التربوي، نظريات التعلم\n"
            "  EDU_SOCIO → علم اجتماع التربية، التواصل، الإدماج\n"
            "  DID_CONCEPTS → المثلث الديداكتيكي، النقل الديداكتيكي\n"
            "  DID_APPROCHES → PPO, APC, البيداغوجيا الفارقية\n"
            "  DID_CURRICULUM → المنهاج، الميثاق الوطني"
        )
    )

class PageContent(BaseModel):
    sections: List[ExtractedContent]


# ── Extraction Prompt ─────────────────────────────────────────────────────────
PROMPT = """
أنت خبير في علوم التربية والديداكتيك العام. هذه صفحة/صفحات من كتاب أو ملخص في علوم التربية.

المطلوب: استخرج المحتوى العلمي المنظم من هذه الصفحة/الصفحات.

لكل موضوع أو قسم موجود في الصفحة:
1. حدد عنوان الموضوع الرئيسي (بالعربية)
2. حدد العنوان الفرعي إن وجد
3. استخرج المحتوى بالعربية بتنسيق Markdown منظم (عناوين، نقاط، جداول، تعريفات)
4. قدم ترجمة/ملخص بالفرنسية للمحتوى نفسه
5. استخرج المصطلحات الأساسية (عربي = فرنسي)
6. صنف المحتوى في الكود الفرعي المناسب

⚠️ مهم:
- حافظ على جميع التعريفات والمفاهيم كما هي
- إذا كانت الصفحة تحتوي على خطاطة أو جدول، صِفها بالتفصيل
- إذا كانت الصفحة فارغة أو غلاف، أرجع قائمة فارغة
- لا تختصر المحتوى، كن شاملاً ومفصلاً
"""


# ── Helpers ───────────────────────────────────────────────────────────────────
def get_pages_bytes(pdf_path: str, page_nums: list) -> bytes:
    """Extract multiple pages from a PDF as a single PDF bytes object."""
    reader = pypdf.PdfReader(pdf_path)
    writer = pypdf.PdfWriter()
    for pn in page_nums:
        if pn < len(reader.pages):
            writer.add_page(reader.pages[pn])
    buf = io.BytesIO()
    writer.write(buf)
    data = buf.getvalue()
    
    # Compress if > 4MB
    if len(data) > 4 * 1024 * 1024:
        print(f"    [COMPRESS] {len(data)//1024}KB → compressing...")
        try:
            w2 = pypdf.PdfWriter()
            for pn in page_nums:
                if pn < len(reader.pages):
                    w2.add_page(reader.pages[pn])
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

def load_output() -> dict:
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"pdfs": {}}

def save_output(data: dict):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ── Gemini Extraction ─────────────────────────────────────────────────────────
def extract_pages_content(pdf_path: str, page_nums: list) -> list:
    """Extract structured content from PDF pages using Gemini with multi-location fallback."""
    page_bytes = get_pages_bytes(pdf_path, page_nums)
    
    models = ["gemini-2.5-pro", "gemini-2.5-flash"]
    
    for model_name in models:
        for loc in LOCATIONS:
            retries, delay = 3, 30
            for attempt in range(retries):
                try:
                    client = genai.Client(
                        vertexai=True,
                        project=VERTEX_PROJECT,
                        location=loc,
                        http_options=types.HttpOptions(timeout=300000),
                    )
                    resp = client.models.generate_content(
                        model=model_name,
                        contents=[
                            types.Part.from_bytes(data=page_bytes, mime_type="application/pdf"),
                            PROMPT,
                        ],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=PageContent,
                            temperature=0.15,
                        ),
                    )
                    sections = json.loads(resp.text).get("sections", [])
                    return sections
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
    
    print(f"\n    ✗ All attempts failed. Skipping these pages.")
    return []


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    
    progress = load_progress()
    output = load_output()
    
    print(f"📖 Sciences de l'Éducation - Content Extractor")
    print(f"   Processing {len(CONTENT_PDFS)} reference PDFs\n")
    
    total_sections = 0
    
    for pdf_info in CONTENT_PDFS:
        filename = pdf_info["filename"]
        label = pdf_info["label"]
        batch_size = pdf_info["pages_per_batch"]
        file_key = filename
        
        file_progress = progress.get(file_key, {"done": False, "last_batch": -1})
        
        if file_progress.get("done"):
            existing = len(output.get("pdfs", {}).get(file_key, {}).get("sections", []))
            print(f"✓ {label} already completed ({existing} sections). Skipping.")
            total_sections += existing
            continue
        
        pdf_path = os.path.join(SCIENCES_EDU_DIR, filename)
        if not os.path.exists(pdf_path):
            print(f"✗ File not found: {filename}")
            continue
        
        print(f"{'='*70}")
        print(f"📄 Processing: {label}")
        
        try:
            reader = pypdf.PdfReader(pdf_path)
            total_pages = len(reader.pages)
            print(f"   Pages: {total_pages} | Batch size: {batch_size}")
        except Exception as e:
            print(f"   ✗ Cannot open: {e}")
            continue
        
        # Initialize output for this file
        if file_key not in output.get("pdfs", {}):
            if "pdfs" not in output:
                output["pdfs"] = {}
            output["pdfs"][file_key] = {
                "label": label,
                "type": pdf_info["type"],
                "sections": []
            }
        
        # Calculate batches
        all_batches = []
        for i in range(0, total_pages, batch_size):
            batch_pages = list(range(i, min(i + batch_size, total_pages)))
            all_batches.append(batch_pages)
        
        start_batch = file_progress.get("last_batch", -1) + 1
        if start_batch > 0:
            print(f"   ▶ Resuming from batch {start_batch + 1}/{len(all_batches)}...")
        
        failed = False
        for batch_idx in range(start_batch, len(all_batches)):
            batch_pages = all_batches[batch_idx]
            pages_str = f"{batch_pages[0]+1}-{batch_pages[-1]+1}" if len(batch_pages) > 1 else str(batch_pages[0]+1)
            print(f"   → Batch {batch_idx+1}/{len(all_batches)} (pages {pages_str})...", end=" ")
            time.sleep(4)
            
            try:
                sections = extract_pages_content(pdf_path, batch_pages)
                print(f"{len(sections)} section(s) extracted")
                
                # Append to output
                for sec in sections:
                    output["pdfs"][file_key]["sections"].append(sec)
                    total_sections += 1
                
                # Save progress
                progress[file_key] = {"done": False, "last_batch": batch_idx}
                save_progress(progress)
                save_output(output)
                
            except Exception as e:
                print(f"\n   ✗ Error on batch {batch_idx+1}: {e}")
                failed = True
                break
        
        if not failed:
            progress[file_key] = {"done": True, "last_batch": len(all_batches) - 1}
            save_progress(progress)
            save_output(output)
            file_sections = len(output["pdfs"][file_key]["sections"])
            print(f"   ✅ DONE: {file_sections} sections extracted from {label}")
    
    # Print summary
    print(f"\n{'='*70}")
    print(f"🏁 CONTENT EXTRACTION COMPLETE")
    print(f"   Total sections extracted: {total_sections}")
    print(f"   Output saved to: {OUTPUT_FILE}")
    
    # Print breakdown by subdomain
    subdomain_counts = {}
    for pdf_key, pdf_data in output.get("pdfs", {}).items():
        for sec in pdf_data.get("sections", []):
            sd = sec.get("subdomain_code", "UNKNOWN")
            subdomain_counts[sd] = subdomain_counts.get(sd, 0) + 1
    
    print(f"\n   Breakdown by subdomain:")
    for sd, count in sorted(subdomain_counts.items()):
        print(f"     {sd}: {count} sections")


if __name__ == "__main__":
    main()
