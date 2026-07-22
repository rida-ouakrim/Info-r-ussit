from django.urls import path
from .views import DomainListView, CourseListView, CourseDetailView, ToggleCourseProgressView, CourseStatsView

urlpatterns = [
    path('domains/', DomainListView.as_view(), name='domain_list'),
    path('courses/', CourseListView.as_view(), name='course_list'),
    path('courses/stats/', CourseStatsView.as_view(), name='course_stats'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:pk>/toggle-completed/', ToggleCourseProgressView.as_view(), name='toggle_course_progress'),
]
