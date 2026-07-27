import os
import pypdf

COURS_DIR = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/cours"

print("=== PDF INSPECTION ===")
for filename in os.listdir(COURS_DIR):
    if filename.endswith(".pdf"):
        filepath = os.path.join(COURS_DIR, filename)
        try:
            with open(filepath, 'rb') as f:
                reader = pypdf.PdfReader(f)
                num_pages = len(reader.pages)
                print(f"File: {filename} | Pages: {num_pages}")
        except Exception as e:
            print(f"Error reading {filename}: {e}")
