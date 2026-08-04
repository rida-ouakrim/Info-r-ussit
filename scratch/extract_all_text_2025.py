import pypdf
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = '2025.pdf'
print("Exists:", os.path.exists(pdf_path))
if os.path.exists(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    print("Pages:", len(reader.pages))
    with open('scratch/2025_pdf_text.txt', 'w', encoding='utf-8') as f:
        for idx, page in enumerate(reader.pages):
            text = page.extract_text()
            f.write(f"=== PAGE {idx+1} ===\n")
            if text:
                f.write(text)
            else:
                f.write("[Empty/Scan]\n")
            f.write("\n\n")
    print("Done! Saved to scratch/2025_pdf_text.txt")
