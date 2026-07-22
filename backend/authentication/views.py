import secrets
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum
from .models import LicenseKey
from .serializers import UserSerializer, RegisterSerializer, LicenseKeySerializer

from syllabus.models import Course, CourseProgress, Subdomain
from exams.models import Question, UserAttempt, ExamSession, Bookmark

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class LicenseKeyListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = LicenseKeySerializer
    queryset = LicenseKey.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        prefix = request.data.get('prefix', 'INFO')
        count = int(request.data.get('count', 1))
        
        created_keys = []
        for _ in range(count):
            random_part = secrets.token_hex(4).upper()
            code = f"{prefix}-{random_part[:4]}-{random_part[4:]}"
            key_obj = LicenseKey.objects.create(key_code=code)
            created_keys.append(LicenseKeySerializer(key_obj).data)

        return Response(created_keys, status=status.HTTP_201_CREATED)

class CandidateDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Course progress stats
        total_courses = Course.objects.count()
        completed_courses = CourseProgress.objects.filter(user=user, is_completed=True).count()
        course_percentage = round((completed_courses / total_courses * 100), 1) if total_courses > 0 else 0.0

        # MCQ attempts stats
        attempts = UserAttempt.objects.filter(user=user)
        total_attempts = attempts.count()
        correct_attempts = attempts.filter(is_correct=True).count()
        success_rate = round((correct_attempts / total_attempts * 100), 1) if total_attempts > 0 else 0.0

        # Active exam sessions
        active_sessions = ExamSession.objects.filter(user=user, exam_submitted=False)
        active_sessions_data = [
            {
                "exam_year": s.exam_year,
                "current_index": s.current_index,
                "quiz_score": s.quiz_score,
                "quiz_mode": s.quiz_mode,
                "updated_at": s.updated_at
            }
            for s in active_sessions
        ]

        # Bookmarks count
        bookmarks_count = Bookmark.objects.filter(user=user).count()

        # Weak points analysis per subdomain
        subdomain_attempts = UserAttempt.objects.filter(user=user).values(
            'question__subdomain__code', 'question__subdomain__name'
        ).annotate(
            total=Count('id'),
            correct=Count('id', filter=Q(is_correct=True))
        )

        weak_subdomains = []
        for sa in subdomain_attempts:
            rate = round((sa['correct'] / sa['total'] * 100), 1) if sa['total'] > 0 else 0.0
            weak_subdomains.append({
                "subdomain_code": sa['question__subdomain__code'],
                "subdomain_name": sa['question__subdomain__name'],
                "total_attempts": sa['total'],
                "correct_attempts": sa['correct'],
                "success_rate": rate
            })

        weak_subdomains.sort(key=lambda x: (x['success_rate'], -x['total_attempts']))

        return Response({
            "user": UserSerializer(user).data,
            "course_stats": {
                "total": total_courses,
                "completed": completed_courses,
                "percentage": course_percentage
            },
            "quiz_stats": {
                "total_attempts": total_attempts,
                "correct_attempts": correct_attempts,
                "success_rate": success_rate
            },
            "bookmarks_count": bookmarks_count,
            "active_sessions": active_sessions_data,
            "weak_points": weak_subdomains
        })

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        candidates = User.objects.filter(is_staff=False).order_by('-created_at')
        total_candidates = candidates.count()

        total_keys = LicenseKey.objects.count()
        used_keys = LicenseKey.objects.filter(is_used=True).count()
        unused_keys = total_keys - used_keys

        total_questions = Question.objects.count()
        total_courses = Course.objects.count()

        candidates_overview = []
        for c in candidates:
            c_completed_courses = CourseProgress.objects.filter(user=c, is_completed=True).count()
            c_attempts = UserAttempt.objects.filter(user=c)
            c_total_att = c_attempts.count()
            c_correct_att = c_attempts.filter(is_correct=True).count()
            c_rate = round((c_correct_att / c_total_att * 100), 1) if c_total_att > 0 else 0.0

            candidates_overview.append({
                "id": c.id,
                "username": c.username,
                "email": c.email,
                "full_name": f"{c.first_name} {c.last_name}".strip() or c.username,
                "target_exam": c.target_exam,
                "completed_courses": c_completed_courses,
                "total_attempts": c_total_att,
                "success_rate": c_rate,
                "allowed_generations": c.allowed_generations,
                "created_at": c.created_at
            })

        all_keys = LicenseKeySerializer(LicenseKey.objects.all().order_by('-created_at'), many=True).data

        return Response({
            "metrics": {
                "total_candidates": total_candidates,
                "total_keys": total_keys,
                "used_keys": used_keys,
                "unused_keys": unused_keys,
                "total_questions": total_questions,
                "total_courses": total_courses
            },
            "candidates": candidates_overview,
            "license_keys": all_keys
        })

class UpdateAllowedGenerationsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')
        allowed_generations = int(request.data.get('allowed_generations', 0))
        try:
            user = User.objects.get(id=user_id)
            user.allowed_generations = allowed_generations
            user.save()
            return Response({"success": True, "allowed_generations": user.allowed_generations})
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)
