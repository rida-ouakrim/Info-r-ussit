import os
import django
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Setup Django
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from exams.models import Question

# We simulate: year=2025, source_type=past_exam, domain=SPECIALITE
queryset = Question.objects.all().select_related('domain', 'subdomain')
queryset = queryset.filter(exam_year=2025)
queryset = queryset.filter(source_type='past_exam')

# Apply SPECIALITE filter
queryset = queryset.filter(domain_id__in=['DEV', 'SYS_RES', 'LOG'])

print(f"Total questions returned for 2025 SPECIALITE: {queryset.count()}")
for q in queryset:
    print(f"  ID: {q.id} | Q: {q.question_number} | Dom: {q.domain_id} | Text: {q.question_text[:50]}...")
