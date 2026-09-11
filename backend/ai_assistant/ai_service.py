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
    lang_name = "arabe (العربية)" if lang == "ar" else "français"

    difficulty_instructions = {
        "Facile": """
    NIVEAU FACILE — Compréhension directe :
    - Questions qui testent la mémorisation et la reconnaissance des définitions clés.
    - Les distracteurs sont des termes du même domaine mais clairement distincts.
    - 1 ou 2 pièges subtils maximum par série (confusion de termes proches).
    """,
        "Moyen": """
    NIVEAU MOYEN — Application et analyse :
    - Questions qui nécessitent de comprendre les concepts ET de les appliquer à des situations concrètes.
    - Les distracteurs doivent être plausibles : vraies définitions mais de mauvais concepts (ex : bonnes propriétés mais du mauvais algorithme).
    - Inclure des situations-pièges basées sur des erreurs classiques des candidats (confusion entre concepts voisins).
    - Au moins 50% des questions doivent présenter un scénario ou une situation pratique avant de poser la question.
    """,
        "Difficile": """
    NIVEAU DIFFICILE — Évaluation et synthèse (style concours CRMEF expert) :
    - Questions qui nécessitent une analyse approfondie, une comparaison rigoureuse ou un raisonnement multi-étapes.
    - Tous les distracteurs doivent être crédibles : des candidats qui n'ont pas étudié en profondeur pourraient choisir n'importe quelle option.
    - Construire des pièges sophistiqués : affirmations vraies en général mais fausses dans le contexte spécifique, exceptions à la règle, ou nuances terminologiques fines.
    - Présenter des cas limites, des contre-exemples, ou des scénarios d'application complexes.
    - Minimum 70% des questions doivent nécessiter une déduction ou un raisonnement (pas de réponse immédiate par simple mémorisation).
    """
    }

    diff_guide = difficulty_instructions.get(difficulty, difficulty_instructions["Moyen"])

    prompt = f"""
Tu es un membre expérimenté du jury national du concours CRMEF (Centre Régional des Métiers de l'Éducation et de la Formation) au Maroc, spécialisé en Informatique et Didactique des Sciences.
Ton rôle est de créer des QCM de HAUTE QUALITÉ qui distinguent vraiment les candidats qui ont compris en profondeur de ceux qui ont mémorisé superficiellement.

=== CONTEXTE ===
Sous-domaine : "{subdomain_name}" ({subdomain_code})
Domaine : "{domain_name}"
Description officielle : {subdomain_description}
Nombre de questions : {num_q}
Difficulté : {difficulty}
Langue de rédaction : {lang_name}

=== CONSIGNES DE NIVEAU ===
{diff_guide}

=== RÈGLES ABSOLUES POUR CHAQUE QUESTION ===

**Structure de la question :**
1. Commence par une MISE EN SITUATION réelle (scénario professionnel, code, erreur courante, comparaison entre deux approches) au lieu d'une simple définition à réciter.
2. Pose une question précise qui teste la compréhension, l'analyse ou l'application — PAS la simple mémorisation.
3. Utilise des formulations comme : "Lequel des énoncés suivants est INCORRECT ?", "Dans ce contexte précis, quelle est la meilleure approche ?", "Parmi ces affirmations, laquelle est vraie UNIQUEMENT dans ce cas ?", "Quel est le résultat de...?".

**Construction des distracteurs (options incorrectes) :**
- Option B, C, D doivent être des PIÈGES RÉALISTES basés sur :
  a) Confusions classiques entre concepts voisins (ex: FIFO vs LIFO, compilateur vs interpréteur, héritage vs composition)
  b) Définitions vraies mais appliquées au mauvais concept
  c) Affirmations partiellement vraies qui deviennent fausses dans ce contexte précis
  d) Erreurs de raisonnement que font souvent les candidats non préparés
- JAMAIS de distracteurs fantaisistes ou manifestement absurdes qui se repèrent en 2 secondes.
- JAMAIS de "Toutes les réponses ci-dessus" ou "Aucune des réponses".

**Explication (explanation) :**
- Expliquer clairement POURQUOI la bonne réponse est correcte.
- Pour CHAQUE mauvaise réponse, expliquer précisément le piège qu'elle représente et pourquoi elle est fausse.
- Citer des principes fondamentaux, des auteurs ou des exemples concrets si pertinent.
- Longueur : 80 à 200 mots, structurée et pédagogique.

**Astuce (astuce) :**
- Donner une règle mnémotechnique, un mot-clé, ou une technique de déduction rapide spécifique à cette question.
- L'astuce doit permettre à un candidat d'éliminer les mauvaises réponses même sous pression du temps.
- Format court : 1-3 phrases maximum.

=== EXEMPLES DE MAUVAISES QUESTIONS (À ÉVITER) ===
❌ "Qu'est-ce qu'un algorithme ?" → trop basique, mémorisation pure
❌ "Quel est le rôle du système d'exploitation ?" → trop vague
❌ "Lequel est un langage de programmation : A) Python B) HTML C) TCP D) Aucun" → distracteurs absurdes

=== EXEMPLES DE BONNES QUESTIONS (À IMITER) ===
✅ "Un enseignant remarque qu'après avoir introduit la récursivité avec l'exemple de la factorielle, la moitié de ses élèves continue à produire des fonctions récursives sans cas de base. Selon Brousseau, ce phénomène illustre principalement : A) Un contrat didactique défaillant B) Un obstacle épistémologique C) Une transposition didactique incorrecte D) Un problème de différenciation pédagogique"
✅ "Considérez ces deux algorithmes de tri : Tri à bulles O(n²) et Tri rapide O(n log n) en moyenne. Un développeur choisit systématiquement le tri rapide. Dans quel cas PRÉCIS ce choix est-il contre-productif ? A) Listes de grande taille B) Listes déjà triées ou quasi-triées C) Listes contenant des doublons D) Listes de chaînes de caractères"

=== FORMAT DE SORTIE ===
Retourne STRICTEMENT un objet JSON valide correspondant au schéma PageQuestionsSchema.
Pas de markdown, pas de texte avant ou après le JSON.
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

    # Higher temperature for creative variety; Difficile slightly lower for precision
    gen_temperature = 0.85 if difficulty == "Difficile" else 0.92

    for client in clients_to_try:
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=[prompt],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=PageQuestionsSchema,
                        temperature=gen_temperature
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
   - Si le candidat demande une définition/explication "en arabe" (ex: "en arabe", "بالعربية", "c'est quoi X en arabe ?") OU écrit en arabe :
     -> Rédige **l'intégralité de la réponse en Arabe clair et fluide (الفصحى)**, avec les termes techniques français équivalents entre parenthèses.
   - Sinon, réponds en **Français académique clair**.

2. **Structure exacte de la réponse** (Utilise ce plan synthétique sans verbosité) :
   - **Titre principal** (H2 ou H3 en Markdown)
   - **Définition synthétique** (2 à 3 lignes directes et précises)
   - **Les 3 étapes / composantes fondamentales** (présentées avec des puces très bien structurées)
   - **Exemple concret en Informatique / Pédagogie** (scénario concis adapté au contexte éducatif marocain)
   - **Mot de fin / Encouragement** (1 phrase dynamique et motivante)

3. **Formatage** :
   - Utilise un Markdown propre, aéré et élégant (listes, gras, puces).
   - Évite les introductions longues, le bavardage inutile ou les répétitions multiples.
"""

    return _call_ai_text(prompt, temperature=0.4)


