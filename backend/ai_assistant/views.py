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
                difficulty=difficulty
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
