from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Question, UserAttempt, ExamSession, Bookmark
from .serializers import QuestionSerializer, UserAttemptSerializer, ExamSessionSerializer, BookmarkSerializer

from django.db.models.functions import Length

from django.db.models import Case, When, Value, IntegerField

class QuestionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = Question.objects.all().select_related('domain', 'subdomain')
        
        year = self.request.query_params.get('year')
        subdomain = self.request.query_params.get('subdomain')
        domain = self.request.query_params.get('domain')
        source_type = self.request.query_params.get('source_type')
        search = self.request.query_params.get('search')
        ids = self.request.query_params.get('ids')

        if ids:
            id_list = [int(x) for x in ids.split(',') if x.strip().isdigit()]
            queryset = queryset.filter(id__in=id_list)
        if year:
            queryset = queryset.filter(exam_year=year)
        if subdomain:
            queryset = queryset.filter(subdomain__code=subdomain)
        if domain:
            queryset = queryset.filter(domain__code=domain)
        if source_type:
            queryset = queryset.filter(source_type=source_type)
        if search:
            queryset = queryset.filter(Q(question_text__icontains=search) | Q(question_number__icontains=search))

        return queryset.annotate(
            is_didactique=Case(
                When(domain_id__in=['DIDACTIQUE', 'SCIENCES_EDU'], then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).order_by('is_didactique', Length('question_number'), 'question_number')

class RecordAttemptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        chosen_option = request.data.get('chosen_option', '').strip().upper()
        correct_option = question.correct_option.strip().upper()
        is_correct = (chosen_option == correct_option)

        attempt = UserAttempt.objects.create(
            user=request.user,
            question=question,
            chosen_option=chosen_option,
            is_correct=is_correct
        )

        return Response({
            "attempt_id": attempt.id,
            "question_id": question.id,
            "chosen_option": chosen_option,
            "correct_option": correct_option,
            "is_correct": is_correct,
            "explanation": question.explanation,
            "astuce": question.astuce
        })

class ExamSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, year):
        session = ExamSession.objects.filter(user=request.user, exam_year=year, exam_submitted=False).order_by('-updated_at').first()
        if not session:
            session = ExamSession.objects.filter(user=request.user, exam_year=year).order_by('-updated_at').first()
        if session:
            return Response(ExamSessionSerializer(session).data)
        return Response(None, status=status.HTTP_200_OK)

    def post(self, request, year):
        session_id = request.data.get('session_id')
        current_index = request.data.get('current_index', 0)
        quiz_attempts_json = request.data.get('quiz_attempts_json', {})
        quiz_score = request.data.get('quiz_score', 0)
        total_questions = request.data.get('total_questions', 0)
        exam_submitted = request.data.get('exam_submitted', False)
        quiz_mode = request.data.get('quiz_mode', 'Entraînement')

        session = None
        if session_id:
            session = ExamSession.objects.filter(id=session_id, user=request.user).first()

        if not session:
            session = ExamSession.objects.filter(user=request.user, exam_year=year, exam_submitted=False, quiz_mode=quiz_mode).order_by('-updated_at').first()

        if not session:
            session = ExamSession.objects.create(
                user=request.user,
                exam_year=year,
                current_index=current_index,
                quiz_attempts_json=quiz_attempts_json,
                quiz_score=quiz_score,
                total_questions=total_questions,
                exam_submitted=exam_submitted,
                quiz_mode=quiz_mode
            )
        else:
            session.current_index = current_index
            session.quiz_attempts_json = quiz_attempts_json
            session.quiz_score = quiz_score
            if total_questions > 0:
                session.total_questions = total_questions
            session.exam_submitted = exam_submitted
            session.quiz_mode = quiz_mode
            session.save()

        return Response(ExamSessionSerializer(session).data)

    def delete(self, request, year):
        ExamSession.objects.filter(user=request.user, exam_year=year, exam_submitted=False).delete()
        return Response({"message": f"Session pour l'examen {year} réinitialisée avec succès."})

class ExamHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = ExamSession.objects.filter(user=request.user).order_by('-updated_at')
        return Response(ExamSessionSerializer(sessions, many=True).data)

class ExamSessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        ExamSession.objects.filter(id=pk, user=request.user).delete()
        return Response({"message": "Session supprimée avec succès."})

class BookmarkToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related('question', 'question__domain', 'question__subdomain').order_by('-created_at')
        return Response(BookmarkSerializer(bookmarks, many=True, context={'request': request}).data)

    def post(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        bookmark = Bookmark.objects.filter(user=request.user, question=question).first()
        if bookmark:
            bookmark.delete()
            is_bookmarked = False
        else:
            Bookmark.objects.create(user=request.user, question=question)
            is_bookmarked = True

        return Response({
            "question_id": question.id,
            "is_bookmarked": is_bookmarked
        })

class ErrorNotebookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch questions where user's latest attempt was incorrect
        latest_attempts = UserAttempt.objects.filter(user=request.user).order_by('question_id', '-answered_at')
        
        # Group by question to find latest attempt per question
        seen_questions = set()
        failed_question_ids = []
        for attempt in latest_attempts:
            if attempt.question_id not in seen_questions:
                seen_questions.add(attempt.question_id)
                if not attempt.is_correct:
                    failed_question_ids.append(attempt.question_id)

        failed_questions = Question.objects.filter(id__in=failed_question_ids).select_related('domain', 'subdomain')
        return Response(QuestionSerializer(failed_questions, many=True, context={'request': request}).data)
