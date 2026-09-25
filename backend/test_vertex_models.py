"""Test: List available Gemini models for this Vertex AI project."""
import os
import sys

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\RIDA OUAKRIM\Desktop\rida\vertex_credentials.json"

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Install: pip install google-genai")
    sys.exit(1)

PROJECT_ID = "chrome-backbone-496013-p4"
MODELS_TO_TEST = [
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
]

for location in ["us-central1", "europe-west1"]:
    try:
        client = genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=location,
            http_options=types.HttpOptions(timeout=15000)
        )
        print(f"\n[Location: {location}] - Connected OK")
        for model_name in MODELS_TO_TEST:
            try:
                resp = client.models.generate_content(
                    model=model_name,
                    contents=["Say: OK"],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        max_output_tokens=5
                    )
                )
                print(f"  [OK] {model_name} - WORKS! Response: {resp.text.strip()}")
            except Exception as e:
                err_str = str(e)[:80]
                print(f"  [FAIL] {model_name} - {err_str}")
    except Exception as e:
        print(f"\n[Location: {location}] - CONNECT FAILED: {e}")
