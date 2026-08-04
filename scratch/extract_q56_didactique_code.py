import os
import sys
from google import genai
from google.genai import types

sys.stdout.reconfigure(encoding='utf-8')

VERTEX_PROJECT = "chrome-backbone-496013-p4"
VERTEX_LOCATION = "us-central1"

def main():
    pdf_path = '2025.pdf'
    if not os.path.exists(pdf_path):
        print("PDF not found")
        return
        
    client = genai.Client(
        vertexai=True, project=VERTEX_PROJECT, location=VERTEX_LOCATION
    )
    
    print("Reading PDF file...")
    with open(pdf_path, 'rb') as f:
        pdf_bytes = f.read()
        
    print("Querying Gemini with PDF bytes...")
    
    prompt = (
        "In the provided PDF, find the DIDACTIQUE section (which is typically at the very end of the exam, around pages 17-20). "
        "Locate the didactique questions Q56 (which asks about displaying multiple seasons for a single month) and Q57 (which asks about the type of error in the provided code). "
        "There is a C code block (a program using switch/case) printed in the PDF that belongs to these questions. "
        "Extract and return the exact text of this C code block."
    )
    
    try:
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(
                    data=pdf_bytes,
                    mime_type="application/pdf"
                ),
                prompt
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
            )
        )
        print("=== RESULT ===")
        print(resp.text)
    except Exception as e:
        print(f"Error querying Gemini: {e}")

if __name__ == '__main__':
    main()
