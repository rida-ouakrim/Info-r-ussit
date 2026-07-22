from django.urls import path
from .views import QuestionListView, RecordAttemptView, ExamSessionView, ExamHistoryView, ExamSessionDetailView, BookmarkToggleView, ErrorNotebookView

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question_list'),
    path('questions/<int:pk>/attempt/', RecordAttemptView.as_view(), name='record_attempt'),
    path('exams/session/<int:year>/', ExamSessionView.as_view(), name='exam_session'),
    path('exams/history/', ExamHistoryView.as_view(), name='exam_history'),
    path('exams/session/detail/<int:pk>/', ExamSessionDetailView.as_view(), name='exam_session_detail'),
    path('bookmarks/', BookmarkToggleView.as_view(), name='bookmark_list'),
    path('bookmarks/<int:pk>/toggle/', BookmarkToggleView.as_view(), name='bookmark_toggle'),
    path('errors/', ErrorNotebookView.as_view(), name='error_notebook'),
]
