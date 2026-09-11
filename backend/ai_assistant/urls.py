from django.urls import path
from .views import GenerateQCMView, QuestionChatAssistantView, CourseChatAssistantView, AcademicLanguagesAIView

urlpatterns = [
    path('generate-qcm/', GenerateQCMView.as_view(), name='ai_generate_qcm'),
    path('ask-question/', QuestionChatAssistantView.as_view(), name='ai_ask_question'),
    path('chat/', CourseChatAssistantView.as_view(), name='ai_course_chat'),
    path('languages-academy/', AcademicLanguagesAIView.as_view(), name='languages_academy'),
]

