from django.urls import path
from .views import GenerateQCMView, QuestionChatAssistantView

urlpatterns = [
    path('generate-qcm/', GenerateQCMView.as_view(), name='ai_generate_qcm'),
    path('ask-question/', QuestionChatAssistantView.as_view(), name='ai_ask_question'),
]
