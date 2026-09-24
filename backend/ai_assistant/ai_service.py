import json
import os
import urllib.request
from decouple import config
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

VALID_GEMINI_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]

def _execute_gemini_text_request(prompt, temperature=0.4, response_mime_type=None, response_schema=None):
    """
    Unified Gemini API caller trying:
    1. Direct REST API via GEMINI_API_KEY (fast, reliable, no SDK version conflict)
    2. google.genai Client with GEMINI_API_KEY
    3. Vertex AI Client
    """
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        env_creds = config('GOOGLE_APPLICATION_CREDENTIALS', default="").strip().strip('"').strip("'")
        if env_creds and os.path.exists(env_creds):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = env_creds
        else:
            default_creds_path = r"C:\Users\RIDA OUAKRIM\Desktop\rida\vertex_credentials.json"
            if os.path.exists(default_creds_path):
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = default_creds_path

    api_key = config('GEMINI_API_KEY', default=os.environ.get("GEMINI_API_KEY", "")).strip().strip('"').strip("'")
    last_error = None

    # Method 1: Direct REST API call if GEMINI_API_KEY is defined
    if api_key:
        for model in VALID_GEMINI_MODELS:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": temperature}
                }
                if response_mime_type:
                    payload["generationConfig"]["response_mime_type"] = response_mime_type

                req_data = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(url, data=req_data, headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req, timeout=30) as resp:
                    res_json = json.loads(resp.read().decode('utf-8'))
                    text = res_json['candidates'][0]['content']['parts'][0]['text']
                    if text:
                        return text
            except Exception as e:
                last_error = e
                continue

    # Method 2: SDK Client with GEMINI_API_KEY
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            for model in VALID_GEMINI_MODELS:
                try:
                    cfg_args = {"temperature": temperature}
                    if response_mime_type:
                        cfg_args["response_mime_type"] = response_mime_type
                    if response_schema:
                        cfg_args["response_schema"] = response_schema
                    
                    config_obj = types.GenerateContentConfig(**cfg_args)
                    response = client.models.generate_content(
                        model=model,
                        contents=[prompt],
                        config=config_obj
                    )
                    if response and response.text:
                        return response.text
                except Exception as e:
                    last_error = e
                    continue
        except Exception as e:
            last_error = e

    # Method 3: Vertex AI Client
    project_id = config('GCP_PROJECT_ID', default=os.environ.get("GCP_PROJECT_ID", "chrome-backbone-496013-p4"))
    for loc in ["us-central1", "europe-west1", "us-east4"]:
        try:
            client = genai.Client(
                vertexai=True,
                project=project_id,
                location=loc,
                http_options=types.HttpOptions(timeout=30000)
            )
            for model in VALID_GEMINI_MODELS:
                try:
                    cfg_args = {"temperature": temperature}
                    if response_mime_type:
                        cfg_args["response_mime_type"] = response_mime_type
                    if response_schema:
                        cfg_args["response_schema"] = response_schema
                    
                    response = client.models.generate_content(
                        model=model,
                        contents=[prompt],
                        config=types.GenerateContentConfig(**cfg_args)
                    )
                    if response and response.text:
                        return response.text
                except Exception as e:
                    last_error = e
                    continue
        except Exception as e:
            last_error = e

    raise Exception(f"Services IA non disponibles : {last_error}")


def generate_custom_qcm(subdomain_name, subdomain_code, domain_name, subdomain_description="", num_q=5, difficulty="Moyen", lang="fr", technology="", topic=""):
    lang_name = "arabe (العربية)" if lang == "ar" else "français"

    difficulty_instructions = {
        "Facile": """
    NIVEAU FACILE — Compréhension directe :
    - Questions qui testent la mémorisation et la reconnaissance des définitions clés.
    - Les distracteurs sont des termes du même domaine mais clairement distincts.
    """,
        "Moyen": """
    NIVEAU MOYEN — Application et analyse :
    - Questions qui nécessitent de comprendre les concepts ET de les appliquer à des situations concrètes.
    - Les distracteurs doivent être plausibles.
    """,
        "Difficile": """
    NIVEAU DIFFICILE — Évaluation et synthèse (style concours CRMEF expert) :
    - Questions qui nécessitent une analyse approfondie, une comparaison rigoureuse ou un raisonnement multi-étapes.
    """
    }

    diff_guide = difficulty_instructions.get(difficulty, difficulty_instructions["Moyen"])

    tech_focus = f"\nTechnologie / Langage ciblé : {technology}" if technology and technology != "AUTOMATIC" else ""
    topic_focus = f"\nThème / Notion spécifique : {topic}" if topic and topic.strip() else ""

    prompt = f"""
Tu es un membre expérimenté du jury national du concours CRMEF (Centre Régional des Métiers de l'Éducation et de la Formation) au Maroc, spécialisé en Informatique et Didactique des Sciences.
Ton rôle est de créer des QCM de HAUTE QUALITÉ.

=== CONTEXTE ===
Sous-domaine : "{subdomain_name}" ({subdomain_code})
Domaine : "{domain_name}"
Description officielle : {subdomain_description}{tech_focus}{topic_focus}
Nombre de questions : {num_q}
Difficulté : {difficulty}
Langue de rédaction : {lang_name}

=== CONSIGNES DE RÉDACTION ===
- Si une technologie (ex: Langage C, Python, Java, SQL...) ou une notion spécifique est définie, concentre le QCM spécifiquement sur des exemples de code, la syntaxe, et les pièges classiques du concours concernant cette technologie.
{diff_guide}

=== FORMAT DE SORTIE ===
Retourne STRICTEMENT un objet JSON valide au format:
{{
  "questions": [
    {{
      "question_text": "...",
      "option_a": "...",
      "option_b": "...",
      "option_c": "...",
      "option_d": "...",
      "correct_option": "A",
      "explanation": "...",
      "astuce": "..."
    }}
  ]
}}
Pas de markdown, pas de texte avant ou après le JSON.
"""

    gen_temperature = 0.85 if difficulty == "Difficile" else 0.92

    try:
        raw_res = _execute_gemini_text_request(
            prompt=prompt,
            temperature=gen_temperature,
            response_mime_type="application/json",
            response_schema=PageQuestionsSchema
        )
        cleaned = raw_res.strip()
        if cleaned.startswith("```"):
            parts = cleaned.split("```")
            cleaned = parts[1] if len(parts) > 1 else cleaned
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip().rstrip("`").strip()
        data = json.loads(cleaned)
        if isinstance(data, dict) and "questions" in data:
            return data["questions"]
        elif isinstance(data, list):
            return data
    except Exception as err:
        pass

    # Fallback default questions generator if AI call fails
    fallback_questions = []
    for i in range(1, num_q + 1):
        fallback_questions.append({
            "question_text": f"En {subdomain_name} ({subdomain_code}), quelle est la bonne pratique essentielle concernant ce module ?",
            "option_a": f"Appliquer la méthodologie recommandée pour {subdomain_name}",
            "option_b": "Ignorer la gestion des cas limites",
            "option_c": "Utiliser une approche non standardisée",
            "option_d": "Ne pas valider les entrées/sorties",
            "correct_option": "A",
            "explanation": f"L'option A énonce la bonne pratique standard pour le sous-domaine {subdomain_name}.",
            "astuce": f"Relisez la fiche de cours {subdomain_code} pour réviser les concepts fondamentaux."
        })
    return fallback_questions

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
1. Réponds de manière très claire, pédagogique, encourageante et précise en français.
2. Si le candidat a fait une erreur (en choisissant {chosen_option} au lieu de {correct_option}), explique-lui avec bienveillance POURQUOI son choix est incorrect et ce qui l'a probablement induit en erreur.
3. Donne des exemples concrets ou des règles mnémoniques si nécessaire pour ancrer le concept.
4. Reste concis, structuré (utilise du Markdown fluide et élégant), et termine par une phrase de motivation pour la réussite du concours.
"""

    try:
        return _execute_gemini_text_request(prompt, temperature=0.4)
    except Exception as err:
        opt_text = f" (Votre choix : Option {chosen_option})" if chosen_option else ""
        
        fallback_reply = f"""### 💡 Tuteur Pédagogique IA

Bonjour ! Concernant la question :
> **{question_text}**

- **Bonne réponse officielle :** **Option {correct_option}**
"""
        if chosen_option and chosen_option.upper() != correct_option.upper():
            fallback_reply += f"- **Votre choix ({chosen_option})** : Notez que l'option {chosen_option} est incorrecte par rapport aux critères de l'énoncé.\n"
        
        if explanation:
            fallback_reply += f"\n**Explication officielle :**\n{explanation}\n"

        if user_message:
            msg_lower = user_message.lower()
            fallback_reply += f"\n**Analyse de votre question :** *\"{user_message}\"*\n"
            if "len" in msg_lower or "comptage" in msg_lower or "0" in msg_lower or "1" in msg_lower:
                fallback_reply += "\nEn algorithmique et en Python, les indices d'une chaîne ou d'un tableau commencent **toujours à 0** (du 1er élément à l'indice 0 jusqu me `len - 1`). La fonction `len()` renvoie la **longueur totale** (le nombre d'éléments).\n"
            else:
                fallback_reply += "\nExaminez attentivement l'explication et comparez chaque option avec l'énoncé du problème. En concours, l'attention portée aux détails synthétiques fait la différence.\n"

        fallback_reply += "\n*Excellente révision et plein de succès pour le concours ! 🎓*"
        return fallback_reply


def _call_ai_text(prompt, temperature=0.6):
    """Generic AI text call with client/model fallback."""
    try:
        return _execute_gemini_text_request(prompt, temperature=temperature)
    except Exception as e:
        return f"Aide pédagogique : {str(e)}"


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


def answer_course_chat_query(user_message: str, course_title: str = "", chat_history: list = None) -> str:
    """
    Answers a student's question during a course or video lesson.
    Produces clean, perfectly structured responses in Arabic or French based on candidate preference.
    """
    history_context = ""
    if chat_history and isinstance(chat_history, list):
        for msg in chat_history:
            role = "Candidat" if msg.get("role") in ["user", "sender_user"] or msg.get("sender") == "user" else "Tuteur IA"
            text = msg.get("text", msg.get("content", ""))
            history_context += f"{role}: {text}\n"

    course_ctx = course_title if course_title else "Informatique / Didactique"

    prompt = f"""
Tu es un Tuteur Pédagogique IA expert et bienveillant pour la préparation aux concours enseignants (CRMEF) et concours de l'État en Informatique et Didactique au Maroc.

Un candidat étudie le cours "{course_ctx}" et te pose la question suivante :

--- HISTORIQUE DE LA DISCUSSION ---
{history_context}

--- QUESTION / DEMANDE DU CANDIDAT ---
{user_message}

--- CONSIGNES DE STRUCTURATION ET DE RÉDACTION (STRICTES) ---

1. **Langue de la réponse** :
   - Si le candidat demande une réponse "en darija" / "بالدارجة" / "darija" :
     -> Rédige l'explication en **Darija marocaine claire et bien expliquée** (avec les termes techniques en français entre parenthèses).
   - Si le candidat demande une définition/explication "en arabe" (ex: "en arabe", "بالعربية", "c'est quoi X en arabe ?") OU écrit en arabe :
     -> Rédige **l'intégralité de la réponse en Arabe clair et fluide (الفصحى)**, avec les termes techniques français équivalents entre parenthèses.
   - Sinon, réponds en **Français académique clair**.

2. **Structure et Présentation de la réponse** (Utilise ce plan structuré et esthétique) :
   - **Titre principal avec icône** (ex: `### 📊 Tri par Sélection vs. Tri par Insertion`)
   - **Définition synthétique** (2 à 3 lignes concises avec des mots-clés en gras)
   - **Composantes & Étapes fondamentales** (présentées avec des blocs clairs ou des puces séparées pour chaque concept)
   - **Exemple concret & Pédagogique** (analogie concrète comme les cartes ou copies d'élèves)
   - **Mot de fin / Encouragement** (1 phrase dynamique et motivante avec émoji 🎓)

3. **Formatage Markdown** :
   - Utilise un Markdown propre, aéré et moderne (titres `###`, sous-titres `####`, puces, gras, blocs de citation si utile).
   - Évite les introductions longues ou le bavardage inutile.
"""

    try:
        return _execute_gemini_text_request(prompt, temperature=0.4)
    except Exception as err:
        title = course_title if course_title else "Informatique & Didactique"
        return f"""### 📚 Tuteur Pédagogique IA ({title})

Merci pour votre question : **"{user_message}"**

### 📌 Synthèse & Éléments clés :
1. **Concept principal :** En {title}, il est primordial de bien maîtriser les définitions théoriques et de savoir les appliquer.
2. **Méthodologie :** Analysez la structure, la logique et les cas particuliers.
3. **Astuce Concours :** Référez-vous aux cours détaillés dans la section **Cours & Syllabus**.

*Bonne révision et tous nos voeux de réussite ! 🎓*"""
