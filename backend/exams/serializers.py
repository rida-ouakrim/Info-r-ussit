from rest_framework import serializers
from .models import Question, UserAttempt, ExamSession, Bookmark

class QuestionSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.name', read_only=True, default='')
    subdomain_name = serializers.CharField(source='subdomain.name', read_only=True, default='')
    domain_code = serializers.CharField(source='domain.code', read_only=True, default='')
    subdomain_code = serializers.CharField(source='subdomain.code', read_only=True, default='')
    course_id = serializers.IntegerField(source='course.id', read_only=True, default=None)
    course_title = serializers.CharField(source='course.title', read_only=True, default='')
    course_content = serializers.CharField(source='course.content', read_only=True, default='')
    course_content_ar = serializers.CharField(source='course.content_ar', read_only=True, default='')
    course_content_fr = serializers.CharField(source='course.content_fr', read_only=True, default='')
    course_examples = serializers.CharField(source='course.examples', read_only=True, default='')
    course_astuces = serializers.CharField(source='course.astuces', read_only=True, default='')
    course_video_url = serializers.CharField(source='course.video_url', read_only=True, default='')
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            'id', 'source_type', 'exam_year', 'question_number', 'question_text',
            'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_option',
            'explanation', 'astuce', 'reference_text', 'domain_code', 'domain_name',
            'subdomain_code', 'subdomain_name', 'course', 'course_id', 'course_title',
            'course_content', 'course_content_ar', 'course_content_fr', 'course_examples',
            'course_astuces', 'course_video_url', 'is_bookmarked'
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
