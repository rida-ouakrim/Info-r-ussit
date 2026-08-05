import json
import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

class GeneratedQuestionSchema(BaseModel):
    question_text: str = Field(description="Question text")
    option_a: str = Field(description="Option A text")
    option_b: str = Field(description="Option B text")
    option_c: str = Field(description="Option C text")
    option_d: str = Field(description="Option D text")
    correct_option: str = Field(description="Single correct option: A, B, C, or D")
    explanation: str = Field(description="Detailed explanation")
    astuce: str = Field(description="Exam tip or shortcut rule")

class PageQuestionsSchema(BaseModel):
    questions: List[GeneratedQuestionSchema] = Field(description="List of MCQ questions")

def generate_custom_qcm(subdomain_name, subdomain_code, domain_name, subdomain_description="", num_q=5, difficulty="Moyen", lang="fr"):
    lang_name = "Arabic (العربية)" if lang == "ar" else "French"
    prompt = f"""
    You are a senior computer science professor and head of jury for competitive computer science recruitment exams (CRMEF, Master, Agrégation, Engineers, Technicians).
    Please generate exactly {num_q} original, high-quality Multiple Choice Questions (QCM) targeting the official syllabus subdomain: "{subdomain_name}" ({subdomain_code}) under domain "{domain_name}".
    Difficulty level: {difficulty}.
    
    Syllabus description: {subdomain_description}
    
    Each question MUST:
    1. Be written in {lang_name}, clear and academically rigorous.
    2. Have exactly 4 options (A, B, C, D) with exactly one correct option.
    3. Include a detailed, educational explanation in {lang_name} explaining why the correct answer is correct and why the others are incorrect.
    4. Include a short, practical tip, shortcut, or key rule (astuce in {lang_name}) to quickly solve this question under exam constraints.
    
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


def _get_ai_clients():
    """Returns a list of Gemini clients to try in order."""
    clients = []
    api_key = os.environ.get("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if api_key:
        try:
            clients.append(genai.Client(api_key=api_key))
        except Exception:
            pass
    project_id = os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4")
    for loc in ["us-east4", "europe-west1", "us-central1"]:
        try:
            clients.append(genai.Client(
                vertexai=True,
                project=project_id,
                location=loc,
                http_options=types.HttpOptions(timeout=90000)
            ))
        except Exception:
            pass
    return clients


def _call_ai_text(prompt, temperature=0.6):
    """Generic AI text call with client/model fallback."""
    models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    last_error = None
    for client in _get_ai_clients():
        for model in models:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=[prompt],
                    config=types.GenerateContentConfig(temperature=temperature)
                )
                return response.text
            except Exception as e:
                last_error = e
                continue
    raise Exception(f"AI service unavailable: {last_error}")


def generate_language_lesson(lesson_id: str, lesson_title: str) -> dict:
    """
    Generates a complete French language lesson for an admin user.
    Returns a structured dict with content, vocabulary, story, exercises, quiz, and motivation.
    """
    prompt = f"""
Tu es un professeur de français académique expert, bienveillant et motivant.
Tu dois créer une leçon complète, claire, interactive et encourageante pour un futur professeur marocain qui souhaite améliorer son français oral et écrit.

LEÇON : "{lesson_title}" (ID: {lesson_id})

Génère en JSON exactement cette structure:
{{
  "lesson_id": "{lesson_id}",
  "title": "{lesson_title}",
  "intro": "Courte introduction motivante (2-3 phrases) expliquant pourquoi cette compétence est essentielle pour un enseignant.",
  "rule": "La règle principale expliquée de manière simple, claire, sans jargon technique. Utiliser des analogies si possible.",
  "examples": [
    {{"wrong": "Exemple incorrect", "correct": "Exemple correct", "explanation": "Pourquoi c'est incorrect et comment corriger"}},
    {{"wrong": "Exemple incorrect", "correct": "Exemple correct", "explanation": "Explication claire"}},
    {{"wrong": "Exemple incorrect", "correct": "Exemple correct", "explanation": "Explication claire"}}
  ],
  "astuce": "Astuce mnémotechnique courte et mémorable pour retenir la règle rapidement.",
  "quiz": [
    {{
      "question": "Question de compréhension ou d'application de la règle",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explication détaillée et encourageante de la bonne réponse."
    }},
    {{
      "question": "Deuxième question pratique",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1,
      "explanation": "Explication avec bienveillance."
    }},
    {{
      "question": "Troisième question sur un cas piège",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2,
      "explanation": "Explication du piège et de la règle correcte."
    }}
  ],
  "motivation": "Message de motivation chaleureux, sincère, personnel et encourageant (3-4 phrases) pour continuer l'apprentissage."
}}

Réponds UNIQUEMENT en JSON valide. Pas de markdown, pas de texte avant ou après.
"""
    result = _call_ai_text(prompt, temperature=0.5)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        parts = cleaned.split("```")
        cleaned = parts[1] if len(parts) > 1 else cleaned
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip().rstrip("`").strip()
    return json.loads(cleaned)


def check_language_text(text: str) -> dict:
    """
    Analyzes a French text for grammar, spelling, and conjugation errors.
    Returns corrected text, highlighted errors with explanations.
    """
    prompt = f"""
Tu es un correcteur de français académique, bienveillant et pédagogique.
Un futur professeur t'envoie ce texte pour correction. Tu dois l'aider à progresser.

TEXTE À ANALYSER :
\"\"\"
{text}
\"\"\"

Génère en JSON exactement cette structure:
{{
  "corrected_text": "Le texte entièrement corrigé, fluide et académique.",
  "errors": [
    {{
      "original": "Expression ou mot incorrect exact",
      "correction": "Expression ou mot correct",
      "rule": "La règle grammaticale violée (conjugaison, accord, orthographe...)",
      "explanation": "Explication simple et bienveillante de pourquoi c est une erreur et comment l eviter.",
      "type": "orthographe"
    }}
  ],
  "score": 85,
  "level": "Intermédiaire",
  "summary": "Résumé global bienveillant et motivant du niveau d ecriture.",
  "main_advice": "Conseil principal personnalisé pour progresser rapidement."
}}

Réponds UNIQUEMENT en JSON valide. Pas de markdown, pas de texte avant ou après.
"""
    result = _call_ai_text(prompt, temperature=0.3)
    cleaned = result.strip()
    if cleaned.startswith("```"):
        parts = cleaned.split("```")
        cleaned = parts[1] if len(parts) > 1 else cleaned
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip().rstrip("`").strip()
    return json.loads(cleaned)
