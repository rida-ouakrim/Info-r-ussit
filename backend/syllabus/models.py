from django.db import models
from django.conf import settings

class Domain(models.Model):
    code = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Subdomain(models.Model):
    code = models.CharField(max_length=50, primary_key=True)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='subdomains')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Course(models.Model):
    subdomain = models.ForeignKey(Subdomain, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)
    examples = models.TextField(blank=True, null=True)
    astuces = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('subdomain', 'title')

    def __str__(self):
        return self.title

class CourseProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_progress')
    is_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course')
