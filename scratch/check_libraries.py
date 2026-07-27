import sys

try:
    import pypdf
    print("pypdf is installed!")
except ImportError:
    print("pypdf is NOT installed.")

try:
    import pdfplumber
    print("pdfplumber is installed!")
except ImportError:
    print("pdfplumber is NOT installed.")

try:
    from google import genai
    print("google-genai is installed!")
except ImportError:
    print("google-genai is NOT installed.")
