from django.db import models
from django.conf import settings
from django.utils import timezone
from syllabus.models import Domain, Subdomain

class Question(models.Model):
    SOURCE_TYPES = (
        ('past_exam', 'Past Exam'),
        ('ai_generated', 'AI Generated'),
    )
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES, default='past_exam')
    exam_year = models.IntegerField(null=True, blank=True)
    question_number = models.CharField(max_length=50, null=True, blank=True)
    question_text = models.TextField()
    option_a = models.TextField()
    option_b = models.TextField()
    option_c = models.TextField()
    option_d = models.TextField()
    option_e = models.TextField(blank=True, null=True)
    correct_option = models.CharField(max_length=5)
    explanation = models.TextField(blank=True, null=True)
    astuce = models.TextField(blank=True, null=True)
    domain = models.ForeignKey(Domain, on_delete=models.SET_NULL, null=True, blank=True)
    subdomain = models.ForeignKey(Subdomain, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.question_number or self.id} ({self.exam_year or 'AI'})"

class UserAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attempts')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_attempts')
    chosen_option = models.CharField(max_length=5)
    is_correct = models.BooleanField()
    answered_at = models.DateTimeField(auto_now_add=True)

class ExamSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exam_sessions')
    exam_year = models.IntegerField()
    current_index = models.IntegerField(default=0)
    quiz_attempts_json = models.JSONField(default=dict)
    quiz_score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    exam_submitted = models.BooleanField(default=False)
    quiz_mode = models.CharField(max_length=50, default='Entraînement')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='bookmarked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'question')
