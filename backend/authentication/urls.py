from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, LicenseKeyListView, CandidateDashboardView, AdminDashboardView, UpdateAllowedGenerationsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('dashboard/candidate/', CandidateDashboardView.as_view(), name='candidate_dashboard'),
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/keys/', LicenseKeyListView.as_view(), name='auth_license_keys'),
    path('admin/update-generations/', UpdateAllowedGenerationsView.as_view(), name='admin_update_generations'),
]
