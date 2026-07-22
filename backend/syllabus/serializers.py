from rest_framework import serializers
from .models import Domain, Subdomain, Course, CourseProgress

class SubdomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subdomain
        fields = ('code', 'domain', 'name', 'description')

class DomainSerializer(serializers.ModelSerializer):
    subdomains = SubdomainSerializer(many=True, read_only=True)

    class Meta:
        model = Domain
        fields = ('code', 'name', 'description', 'subdomains')

class CourseSerializer(serializers.ModelSerializer):
    subdomain_name = serializers.CharField(source='subdomain.name', read_only=True)
    domain_code = serializers.CharField(source='subdomain.domain.code', read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'subdomain', 'subdomain_name', 'domain_code', 'title', 'is_completed')

    def get_is_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return CourseProgress.objects.filter(user=user, course=obj, is_completed=True).exists()
        return False

class CourseDetailSerializer(serializers.ModelSerializer):
    subdomain_name = serializers.CharField(source='subdomain.name', read_only=True)
    subdomain_code = serializers.CharField(source='subdomain.code', read_only=True)
    domain_name = serializers.CharField(source='subdomain.domain.name', read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'subdomain', 'subdomain_code', 'subdomain_name', 'domain_name', 'title', 'content', 'examples', 'astuces', 'is_completed')

    def get_is_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return CourseProgress.objects.filter(user=user, course=obj, is_completed=True).exists()
        return False
