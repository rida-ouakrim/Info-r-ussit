from django.urls import path
from .views import GenerateQCMView

urlpatterns = [
    path('generate-qcm/', GenerateQCMView.as_view(), name='ai_generate_qcm'),
]
