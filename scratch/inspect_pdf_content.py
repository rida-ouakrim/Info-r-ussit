import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_files = sorted([f for f in os.listdir('.') if f.lower().endswith('.pdf')])
print("PDFs in workspace:", pdf_files)

for filename in pdf_files:
    print(f"=== PDF: {filename} ===")
    try:
        reader = pypdf.PdfReader(filename)
        print(f"Pages: {len(reader.pages)}")
        for page_idx, page in enumerate(reader.pages):
            text = page.extract_text()
            if not text:
                continue
            if 'transpos' in text.lower() or 'pédagog' in text.lower() or 'évaluation' in text.lower():
                print(f"  Found on Page {page_idx+1}:")
                lines = text.split('\n')
                for line in lines:
                    if any(term in line.lower() for term in ['transpos', 'pédagog', 'évaluation']):
                        print(f"    * {line.strip()}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    print()
