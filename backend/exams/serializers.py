from rest_framework import serializers
from .models import Question, UserAttempt, ExamSession, Bookmark

class QuestionSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.name', read_only=True, default='')
    subdomain_name = serializers.CharField(source='subdomain.name', read_only=True, default='')
    domain_code = serializers.CharField(source='domain.code', read_only=True, default='')
    subdomain_code = serializers.CharField(source='subdomain.code', read_only=True, default='')
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            'id', 'source_type', 'exam_year', 'question_number', 'question_text',
            'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_option',
            'explanation', 'astuce', 'domain_code', 'domain_name',
            'subdomain_code', 'subdomain_name', 'is_bookmarked'
        )

    def get_is_bookmarked(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return Bookmark.objects.filter(user=user, question=obj).exists()
        return False

class UserAttemptSerializer(serializers.ModelSerializer):
    question_details = QuestionSerializer(source='question', read_only=True)

    class Meta:
        model = UserAttempt
        fields = ('id', 'user', 'question', 'question_details', 'chosen_option', 'is_correct', 'answered_at')

class ExamSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSession
        fields = ('id', 'user', 'exam_year', 'current_index', 'quiz_attempts_json', 'quiz_score', 'total_questions', 'exam_submitted', 'quiz_mode', 'created_at', 'updated_at')

class BookmarkSerializer(serializers.ModelSerializer):
    question_details = QuestionSerializer(source='question', read_only=True)

    class Meta:
        model = Bookmark
        fields = ('id', 'user', 'question', 'question_details', 'created_at')
