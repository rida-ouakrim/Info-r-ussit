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
        "In this scanned exam PDF, please find the question Q56 and Q57 (they talk about a C program that displays seasons based on a month entered, but it has some issue/bug). "
        "There is a C code block displayed near these questions in the PDF. "
        "Please extract and return the exact C code block as text. If there are other details, just return the code block inside a code fence."
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
