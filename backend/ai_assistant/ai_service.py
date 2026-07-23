import json
import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

class GeneratedQuestionSchema(BaseModel):
    question_text: str = Field(description="Question text in French")
    option_a: str = Field(description="Option A text in French")
    option_b: str = Field(description="Option B text in French")
    option_c: str = Field(description="Option C text in French")
    option_d: str = Field(description="Option D text in French")
    correct_option: str = Field(description="Single correct option: A, B, C, or D")
    explanation: str = Field(description="Detailed explanation in French")
    astuce: str = Field(description="Exam tip or shortcut rule in French")

class PageQuestionsSchema(BaseModel):
    questions: List[GeneratedQuestionSchema] = Field(description="List of MCQ questions")

def get_genai_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        return genai.Client(api_key=api_key)
    
    project_id = os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4")
    location = os.environ.get("GCP_LOCATION", "us-central1")

    try:
        return genai.Client(
            vertexai=True, 
            project=project_id, 
            location=location,
            http_options=types.HttpOptions(timeout=60000)
        )
    except Exception:
        return genai.Client()

def generate_custom_qcm(subdomain_name, subdomain_code, domain_name, subdomain_description="", num_q=5, difficulty="Moyen"):
    client = get_genai_client()

    prompt = f"""
    You are a senior computer science professor and head of jury for competitive computer science recruitment exams (CRMEF, Master, Agrégation, Engineers, Technicians).
    Please generate exactly {num_q} original, high-quality Multiple Choice Questions (QCM) targeting the official syllabus subdomain: "{subdomain_name}" ({subdomain_code}) under domain "{domain_name}".
    Difficulty level: {difficulty}.
    
    Syllabus description: {subdomain_description}
    
    Each question MUST:
    1. Be written in French, clear and academically rigorous.
    2. Have exactly 4 options (A, B, C, D) with exactly one correct option.
    3. Include a detailed, educational explanation in French explaining why the correct answer is correct and why the others are incorrect.
    4. Include a short, practical tip, shortcut, or key rule (astuce in French) to quickly solve this question under exam constraints.
    
    Return strictly a JSON object matching the PageQuestionsSchema schema.
    """

    models_to_try = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-1.5-pro"]
    last_error = None

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PageQuestionsSchema,
                    temperature=0.7
                )
            )
            data = json.loads(response.text)
            return data.get("questions", [])
        except Exception as err:
            last_error = err
            continue

    raise Exception(f"Erreur d'appel API Gemini/Vertex: {str(last_error)}")
