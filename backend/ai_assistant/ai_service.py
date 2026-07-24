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

def generate_custom_qcm(subdomain_name, subdomain_code, domain_name, subdomain_description="", num_q=5, difficulty="Moyen"):
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

    clients_to_try = []
    
    # Option A: GEMINI_API_KEY environment variable
    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if api_key:
        try:
            clients_to_try.append(genai.Client(api_key=api_key))
        except Exception:
            pass

    # Option B: Vertex AI ADC Client
    project_id = os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4")
    location = os.environ.get("GCP_LOCATION", "us-central1")
    try:
        clients_to_try.append(genai.Client(
            vertexai=True, 
            project=project_id, 
            location=location,
            http_options=types.HttpOptions(timeout=60000)
        ))
    except Exception:
        pass

    # Option C: Default fallback Client
    try:
        clients_to_try.append(genai.Client())
    except Exception:
        pass

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash"
    ]
    last_error = None

    for client in clients_to_try:
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

    raise Exception(f"{str(last_error)}")

def answer_question_chat_query(question_text, option_a, option_b, option_c, option_d, correct_option, chosen_option, explanation="", user_message="", chat_history=None):
    """
    Answers a student's follow-up question or request for explanation about a specific MCQ exam question.
    """
    history_context = ""
    if chat_history and isinstance(chat_history, list):
        for msg in chat_history:
            role = "Candidat" if msg.get("role") == "user" else "Tuteur IA"
            history_context += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""
Tu es un Tuteur Pédagogique IA bienveillant, expert agrégé en Informatique et Didactique pour les concours de recrutement des enseignants (CRMEF) au Maroc.

Un candidat révise une question de concours et demande des explications ou des précisions à propos de cette question.

--- CONTEXTE DE LA QUESTION ---
Énoncé : {question_text}
Option A : {option_a}
Option B : {option_b}
Option C : {option_c}
Option D : {option_d}
Bonne réponse officielle : Option {correct_option}
Réponse choisie par le candidat : Option {chosen_option}
Explication officielle : {explanation}

--- HISTORIQUE DE LA DISCUSSION ---
{history_context}

--- QUESTION / DEMANDE DU CANDIDAT ---
{user_message}

--- CONSIGNES POUR TA RÉPONSE ---
1. Répends de manière très claire, pédagogique, encourageante et précise en français.
2. Si le candidat a fait une erreur (en choisissant {chosen_option} au lieu de {correct_option}), explique-lui avec bienveillance POURQUOI son choix est incorrect et ce qui l'a probablement induit en erreur.
3. Donne des exemples concrets ou des règles mnémoniques si nécessaire pour ancrer le concept.
4. Reste concis, structuré (utilise du Markdown fluide et élégant), et termine par une phrase de motivation pour la réussite du concours.
"""

    clients_to_try = []
    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if api_key:
        try:
            clients_to_try.append(genai.Client(api_key=api_key))
        except Exception:
            pass

    # Vertex AI with multi-location fallback
    project_id = os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4")
    locations = ["us-east4", "europe-west1", "us-central1", "asia-northeast1"]
    for loc in locations:
        try:
            clients_to_try.append(genai.Client(
                vertexai=True,
                project=project_id,
                location=loc,
                http_options=types.HttpOptions(timeout=60000)
            ))
        except Exception:
            pass

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash"
    ]

    last_error = None
    for client in clients_to_try:
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(
                        temperature=0.4
                    )
                )
                return response.text
            except Exception as err:
                last_error = err
                continue

    raise Exception(f"Erreur Assistant IA : {str(last_error)}")

