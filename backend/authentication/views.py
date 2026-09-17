import secrets
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum
from django.utils import timezone
from .models import LicenseKey
from .serializers import UserSerializer, RegisterSerializer, LicenseKeySerializer

from syllabus.models import Course, CourseProgress, Subdomain
from exams.models import Question, UserAttempt, ExamSession, Bookmark

import random
from django.conf import settings as django_settings
from django.core.mail import send_mail
from .models import LicenseKey, EmailVerificationCode

User = get_user_model()

def format_study_time(total_seconds):
    if not total_seconds or total_seconds < 60:
        return "< 1 min"
    minutes = (total_seconds // 60) % 60
    hours = total_seconds // 3600
    if hours > 0:
        return f"{hours} h {minutes} min" if minutes > 0 else f"{hours} h"
    return f"{minutes} min"

class TrackStudyTimeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        added_seconds = int(request.data.get('seconds', 30))
        if 0 < added_seconds <= 300:
            user.total_study_seconds = (user.total_study_seconds or 0) + added_seconds
        
        user.last_active_at = timezone.now()
        user.save(update_fields=['total_study_seconds', 'last_active_at'])

        return Response({
            "success": True,
            "total_study_seconds": user.total_study_seconds,
            "study_formatted": format_study_time(user.total_study_seconds)
        })

class SendVerificationCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email or '@' not in email:
            return Response({"error": "Veuillez fournir une adresse e-mail valide."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({"error": "Cette adresse e-mail est déjà utilisée par un autre compte."}, status=status.HTTP_400_BAD_REQUEST)

        code = f"{random.randint(100000, 999999)}"
        EmailVerificationCode.objects.create(email=email, code=code)

        subject = "Code de verification pour votre compte Info Reussit"
        
        plain_message = (
            f"Bonjour,\n\n"
            f"Votre code de verification pour Info Reussit est : {code}\n\n"
            f"Ce code est valide pendant 15 minutes.\n"
            f"Si vous n'avez pas demande ce code, vous pouvez ignorer ce message.\n\n"
            f"Cordialement,\n"
            f"L'equipe Info Reussit"
        )

        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }}
            .container {{ max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
            .header {{ background-color: #4f46e5; padding: 24px; text-align: center; color: #ffffff; }}
            .header h1 {{ margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }}
            .content {{ padding: 32px 24px; text-align: center; }}
            .code-box {{ background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 24px; display: inline-block; font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; margin: 20px 0; }}
            .text {{ font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 8px; }}
            .footer {{ background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Info Reussit</h1>
            </div>
            <div class="content">
              <p class="text" style="font-size: 16px; font-weight: 600; color: #0f172a;">Verification de votre adresse e-mail</p>
              <p class="text">Voici votre code de confirmation pour finaliser votre inscription :</p>
              <div class="code-box">{code}</div>
              <p class="text" style="font-size: 12px; color: #64748b;">Ce code est valide pendant <strong>15 minutes</strong>.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer cet e-mail en toute securite.</p>
              <p style="margin: 4px 0 0 0;">© 2026 Info Reussit — Plateforme Nationale de Preparation aux Concours</p>
            </div>
          </div>
        </body>
        </html>
        """

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                html_message=html_message,
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=django_settings.DEBUG,
            )
        except Exception as e:
            if not django_settings.DEBUG:
                return Response({"error": "Erreur d'envoi de l'email. Veuillez reessayer."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_data = {
            "success": True,
            "message": f"Code de verification envoye a {email}.",
        }

        return Response(response_data, status=status.HTTP_200_OK)

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
        candidates = User.objects.all().order_by('-created_at')
        total_candidates = candidates.count()

        total_keys = LicenseKey.objects.count()
        used_keys = LicenseKey.objects.filter(is_used=True).count()
        unused_keys = total_keys - used_keys

        total_questions = Question.objects.count()
        total_courses = Course.objects.count()

        total_global_attempts = UserAttempt.objects.count()
        total_global_exams_completed = ExamSession.objects.filter(exam_submitted=True).count()
        total_global_courses_completed = CourseProgress.objects.filter(is_completed=True).count()

        # Breakdown by target exam
        target_exam_stats = {}
        for c in candidates:
            exam_name = c.target_exam or 'Non spécifié'
            target_exam_stats[exam_name] = target_exam_stats.get(exam_name, 0) + 1

        target_exam_distribution = [
            {"name": name, "count": count}
            for name, count in sorted(target_exam_stats.items(), key=lambda x: -x[1])
        ]

        total_global_seconds = 0
        now = timezone.now()
        candidates_overview = []

        for c in candidates:
            c_completed_courses = CourseProgress.objects.filter(user=c, is_completed=True).count()
            c_attempts = UserAttempt.objects.filter(user=c)
            c_total_att = c_attempts.count()
            c_correct_att = c_attempts.filter(is_correct=True).count()
            c_rate = round((c_correct_att / c_total_att * 100), 1) if c_total_att > 0 else 0.0

            c_exams_completed = ExamSession.objects.filter(user=c, exam_submitted=True).count()
            c_exams_total = ExamSession.objects.filter(user=c).count()

            c_seconds = getattr(c, 'total_study_seconds', 0) or 0
            if c_seconds == 0:
                est_minutes = (c_completed_courses * 20) + (c_total_att * 1.5)
                c_seconds = int(est_minutes * 60)

            total_global_seconds += c_seconds

            c_study_hours = round(c_seconds / 3600, 1)
            c_study_formatted = format_study_time(c_seconds)

            c_last_active = getattr(c, 'last_active_at', None)
            is_online = False
            if c_last_active and (now - c_last_active).total_seconds() < 300:
                is_online = True

            candidates_overview.append({
                "id": c.id,
                "username": c.username,
                "email": c.email,
                "full_name": f"{c.first_name} {c.last_name}".strip() or c.username,
                "target_exam": c.target_exam,
                "completed_courses": c_completed_courses,
                "total_attempts": c_total_att,
                "correct_attempts": c_correct_att,
                "success_rate": c_rate,
                "exams_completed": c_exams_completed,
                "exams_total": c_exams_total,
                "study_hours": c_study_hours,
                "study_seconds": c_seconds,
                "study_formatted": c_study_formatted,
                "is_online": is_online,
                "last_active_at": c_last_active,
                "allowed_generations": c.allowed_generations,
                "account_type": c.account_type,
                "is_active": c.is_active,
                "is_staff": c.is_staff,
                "is_superuser": c.is_superuser,
                "last_login": c.last_login,
                "created_at": c.created_at
            })

        all_keys = LicenseKeySerializer(LicenseKey.objects.all().order_by('-created_at'), many=True).data
        total_global_hours = round(total_global_seconds / 3600, 1)

        return Response({
            "metrics": {
                "total_candidates": total_candidates,
                "total_keys": total_keys,
                "used_keys": used_keys,
                "unused_keys": unused_keys,
                "total_questions": total_questions,
                "total_courses": total_courses,
                "total_global_attempts": total_global_attempts,
                "total_global_exams_completed": total_global_exams_completed,
                "total_global_courses_completed": total_global_courses_completed,
                "total_global_hours": total_global_hours
            },
            "target_exam_distribution": target_exam_distribution,
            "candidates": candidates_overview,
            "license_keys": all_keys
        })

class UpdateAllowedGenerationsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            if 'allowed_generations' in request.data:
                user.allowed_generations = int(request.data.get('allowed_generations', 0))
            if 'account_type' in request.data:
                user.account_type = request.data.get('account_type', 'Standard')
            if 'is_active' in request.data:
                user.is_active = bool(request.data.get('is_active'))
            if 'is_staff' in request.data:
                is_staff_val = bool(request.data.get('is_staff'))
                user.is_staff = is_staff_val
                if is_staff_val:
                    user.is_superuser = True
            if 'new_password' in request.data:
                new_pass = str(request.data.get('new_password', '')).strip()
                if len(new_pass) >= 6:
                    user.set_password(new_pass)
                else:
                    return Response({"error": "Le mot de passe doit contenir au moins 6 caractères."}, status=status.HTTP_400_BAD_REQUEST)
            user.save()
            return Response({
                "success": True, 
                "allowed_generations": user.allowed_generations,
                "account_type": user.account_type,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            })
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)
