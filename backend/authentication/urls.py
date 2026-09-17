from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView, LicenseKeyListView, CandidateDashboardView, 
    AdminDashboardView, UpdateAllowedGenerationsView, SendVerificationCodeView, 
    TrackStudyTimeView, SendPasswordResetCodeView, ResetPasswordWithCodeView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('send-verification-code/', SendVerificationCodeView.as_view(), name='send_verification_code'),
    path('password-reset/send-code/', SendPasswordResetCodeView.as_view(), name='password_reset_send_code'),
    path('password-reset/confirm/', ResetPasswordWithCodeView.as_view(), name='password_reset_confirm'),
    path('login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('track-time/', TrackStudyTimeView.as_view(), name='track_study_time'),
    path('dashboard/candidate/', CandidateDashboardView.as_view(), name='candidate_dashboard'),
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/keys/', LicenseKeyListView.as_view(), name='auth_license_keys'),
    path('admin/update-generations/', UpdateAllowedGenerationsView.as_view(), name='admin_update_generations'),
]
