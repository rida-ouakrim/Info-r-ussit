"""
Management command : generate_vertex_content
Pipeline de Génération Automatisée via Google Gemini / Vertex AI pour créer des cours,
exemples, astuces et QCMs de haute qualité pour n'importe quelle filière.
"""
import os
import json
import urllib.request
import urllib.error
from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course
from exams.models import Question

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

class Command(BaseCommand):
    help = "Génère un cours et des QCMs complets via l'API Gemini / Vertex AI"

    def add_arguments(self, parser):
        parser.add_argument('--subdomain', type=str, required=True, help="Code du sous-domaine (ex: DATA_SCIENCE_IA, DBA_ADMIN)")
        parser.add_argument('--topic', type=str, required=True, help="Titre du sujet de cours à générer")

    def handle(self, *args, **options):
        subdomain_code = options['subdomain']
        topic = options['topic']

        subdomain = Subdomain.objects.filter(code=subdomain_code).first()
        if not subdomain:
            self.stderr.write(f"Erreur : Sous-domaine '{subdomain_code}' introuvable dans la base de données.")
            return

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            self.stdout.write(self.style.WARNING("GEMINI_API_KEY non trouvée dans les variables d'environnement. Mode démonstration simulé."))
            self.create_fallback_course(subdomain, topic)
            return

        self.stdout.write(f"Génération en cours via Vertex AI / Gemini pour : '{topic}' ({subdomain.name})...")

        prompt = f"""Tu es un Enseignant-Chercheur et Membre de Jury de Concours d'État au Maroc (Ingénieurs d'État, Techniciens spécialisés, Administrateurs).
Rédige un cours complet et génère 3 QCMs d'examen de niveau concours pour le sujet : "{topic}" (Filière : {subdomain.name}).

Réponds STRICTEMENT sous la forme d'un objet JSON valide au format suivant sans aucun texte autour :

{{
  "content": "# Titre\\n\\n## 📌 Résumé Théorique\\n... (Contenu Markdown riche avec Latex, tableaux, schémas)",
  "examples": "Code d'exemple pratique en Python/SQL/Bash/Java",
  "astuces": "⚡ Pièges et astuces concours indispensables",
  "questions": [
    {{
      "question_text": "Texte de la question ?",
      "option_a": "Option A",
      "option_b": "Option B",
      "option_c": "Option C",
      "option_d": "Option D",
      "correct_option": "B",
      "explanation": "Explication détaillée de la réponse",
      "astuce": "Astuce pour retenir la réponse"
    }}
  ]
}}
"""

        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.3
            }
        }

        req = urllib.request.Request(
            f"{GEMINI_API_URL}?key={api_key}",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                raw_text = res_data['candidates'][0]['content']['parts'][0]['text']
                data = json.loads(raw_text)

                course, _ = Course.objects.update_or_create(
                    subdomain=subdomain,
                    title=topic,
                    defaults={
                        "content": data.get("content", ""),
                        "examples": data.get("examples", ""),
                        "astuces": data.get("astuces", "")
                    }
                )

                q_count = 0
                for q_item in data.get("questions", []):
                    Question.objects.create(
                        source_type="ai_generated",
                        question_text=q_item["question_text"],
                        option_a=q_item["option_a"],
                        option_b=q_item["option_b"],
                        option_c=q_item["option_c"],
                        option_d=q_item["option_d"],
                        correct_option=q_item["correct_option"],
                        explanation=q_item.get("explanation", ""),
                        astuce=q_item.get("astuce", ""),
                        domain=subdomain.domain,
                        subdomain=subdomain,
                        course=course
                    )
                    q_count += 1

                self.stdout.write(self.style.SUCCESS(f"Succès ! Cours '{course.title}' créé avec {q_count} QCMs insérés !"))

        except Exception as e:
            self.stderr.write(f"Erreur API Vertex AI / Gemini : {e}")
            self.create_fallback_course(subdomain, topic)

    def create_fallback_course(self, subdomain, topic):
        course, _ = Course.objects.update_or_create(
            subdomain=subdomain,
            title=topic,
            defaults={
                "content": f"# {topic}\n\n> 🎓 **Filière :** {subdomain.name} | 📌 **Concours d'État**\n\n## 📌 Résumé Théorique\n\nContenu généré pour le module {topic}.",
                "examples": "# Exemple de code démonstration\nprint('Module chargé avec succès')",
                "astuces": "⚡ **Astuce Concours :** Relisez attentivement les définitions clés avant l'épreuve."
            }
        )
        self.stdout.write(self.style.SUCCESS(f"  [Fallback] Cours '{course.title}' sauvegardé en base."))
