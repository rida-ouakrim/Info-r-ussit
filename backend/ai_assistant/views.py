import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from syllabus.models import Subdomain
from exams.models import Question
from exams.serializers import QuestionSerializer
from .ai_service import generate_custom_qcm

class GenerateQCMView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subdomain_code = request.data.get('subdomain_code')
        try:
            num_q = int(request.data.get('num_questions', 5))
        except (ValueError, TypeError):
            num_q = 5

        difficulty = request.data.get('difficulty', 'Moyen')
        lang = request.data.get('lang', 'fr')
        if lang not in ['fr', 'ar']:
            lang = 'fr'

        # Input validation
        if num_q < 3 or num_q > 15:
            return Response({"error": "Le nombre de questions doit être compris entre 3 et 15."}, status=status.HTTP_400_BAD_REQUEST)

        # Enforce generation limits (except for Rida, superusers, or Premium accounts)
        user = request.user
        is_unlimited = user.is_superuser or user.username.lower() == 'rida' or getattr(user, 'account_type', 'Standard') == 'Premium'
        
        if not is_unlimited:
            try:
                with transaction.atomic():
                    # select_for_update locks the user row to prevent race conditions (concurrency check)
                    locked_user = type(user).objects.select_for_update().get(id=user.id)
                    if locked_user.allowed_generations <= 0:
                        return Response({
                            "error": "Limite de génération QCM IA atteinte. Pour obtenir plus de générations, veuillez contacter l'administrateur Rida Ouakrim.",
                            "allowed_generations": 0,
                            "contact": {
                                "email": "ridaouarkim0@gmail.com",
                                "phone": "0702555943",
                                "github": "https://github.com/rida-ouakrim"
                            }
                        }, status=status.HTTP_403_FORBIDDEN)
                    
                    # Pre-decrement to prevent concurrent race conditions
                    locked_user.allowed_generations -= 1
                    locked_user.save()
                    user.allowed_generations = locked_user.allowed_generations
            except Exception as e:
                return Response({"error": f"Erreur de transaction : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            subdomain = Subdomain.objects.select_related('domain').get(code=subdomain_code)
        except Subdomain.DoesNotExist:
            # Revert decrement if validation fails
            if not is_unlimited:
                with transaction.atomic():
                    locked_user = type(user).objects.select_for_update().get(id=user.id)
                    locked_user.allowed_generations += 1
                    locked_user.save()
            return Response({"error": "Sous-domaine invalide"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            raw_questions = generate_custom_qcm(
                subdomain_name=subdomain.name,
                subdomain_code=subdomain.code,
                domain_name=subdomain.domain.name,
                subdomain_description=subdomain.description or '',
                num_q=num_q,
                difficulty=difficulty,
                lang=lang
            )

            created_questions = []
            for i, q in enumerate(raw_questions):
                new_q = Question.objects.create(
                    source_type='ai_generated',
                    question_number=f"IA-Q{i+1}",
                    question_text=q['question_text'],
                    option_a=q['option_a'],
                    option_b=q['option_b'],
                    option_c=q['option_c'],
                    option_d=q['option_d'],
                    correct_option=q['correct_option'].upper(),
                    explanation=q['explanation'],
                    astuce=q.get('astuce', ''),
                    domain=subdomain.domain,
                    subdomain=subdomain
                )
                created_questions.append(new_q)

            serialized = QuestionSerializer(created_questions, many=True, context={'request': request}).data
            return Response({
                "questions": serialized,
                "allowed_generations": user.allowed_generations if not is_unlimited else 99999
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Compensation logic: revert decrement on Gemini api / creation failures
            if not is_unlimited:
                with transaction.atomic():
                    locked_user = type(user).objects.select_for_update().get(id=user.id)
                    locked_user.allowed_generations += 1
                    locked_user.save()
            return Response({"error": f"Erreur lors de la génération IA : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuestionChatAssistantView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        question_text = request.data.get('question_text', '')
        option_a = request.data.get('option_a', '')
        option_b = request.data.get('option_b', '')
        option_c = request.data.get('option_c', '')
        option_d = request.data.get('option_d', '')
        correct_option = request.data.get('correct_option', '')
        chosen_option = request.data.get('chosen_option', '')
        explanation = request.data.get('explanation', '')
        user_message = request.data.get('user_message', "Explications supplémentaires s'il vous plaît.")
        chat_history = request.data.get('chat_history', [])

        if not question_text:
            return Response({"error": "Énoncé de la question manquant"}, status=status.HTTP_400_BAD_REQUEST)

        from .ai_service import answer_question_chat_query

        try:
            ai_reply = answer_question_chat_query(
                question_text=question_text,
                option_a=option_a,
                option_b=option_b,
                option_c=option_c,
                option_d=option_d,
                correct_option=correct_option,
                chosen_option=chosen_option,
                explanation=explanation,
                user_message=user_message,
                chat_history=chat_history
            )
            return Response({"reply": ai_reply}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Erreur de l'Assistant IA : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AcademicLanguagesAIView(APIView):
    """AI endpoint for Academic Languages Tutor (Admin Only)."""
    permission_classes = [permissions.IsAdminUser]

    LESSONS_CACHE_FILE = os.path.join(os.path.dirname(__file__), 'cached_lessons.json')

    def _load_cache(self):
        import json as _json
        if os.path.exists(self.LESSONS_CACHE_FILE):
            try:
                with open(self.LESSONS_CACHE_FILE, 'r', encoding='utf-8') as f:
                    return _json.load(f)
            except Exception:
                return {}
        return {}

    def _save_cache(self, cache: dict):
        import json as _json
        with open(self.LESSONS_CACHE_FILE, 'w', encoding='utf-8') as f:
            _json.dump(cache, f, ensure_ascii=False, indent=2)

    def post(self, request):
        action = request.data.get('action', '')

        if action == 'generate_lesson':
            lesson_id = request.data.get('lesson_id', '')
            lesson_title = request.data.get('lesson_title', '')
            if not lesson_id or not lesson_title:
                return Response({"error": "lesson_id and lesson_title required"}, status=status.HTTP_400_BAD_REQUEST)

            # Check cache first
            cache = self._load_cache()
            if lesson_id in cache:
                return Response({"lesson": cache[lesson_id], "cached": True}, status=status.HTTP_200_OK)

            # Generate via AI
            from .ai_service import generate_language_lesson
            try:
                lesson = generate_language_lesson(lesson_id=lesson_id, lesson_title=lesson_title)
                cache[lesson_id] = lesson
                self._save_cache(cache)
                return Response({"lesson": lesson, "cached": False}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": f"Erreur de génération : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif action == 'check_text':
            text = request.data.get('text', '').strip()
            if not text:
                return Response({"error": "text is required"}, status=status.HTTP_400_BAD_REQUEST)
            from .ai_service import check_language_text
            try:
                result = check_language_text(text)
                return Response({"result": result}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": f"Erreur de correction : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Invalid action. Use 'generate_lesson' or 'check_text'."}, status=status.HTTP_400_BAD_REQUEST)
