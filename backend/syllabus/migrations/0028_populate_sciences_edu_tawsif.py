import os
import json
from django.db import migrations
from django.conf import settings

def populate_sciences_edu(apps, schema_editor):
    Subdomain = apps.get_model('syllabus', 'Subdomain')
    Course = apps.get_model('syllabus', 'Course')
    Domain = apps.get_model('syllabus', 'Domain')

    # Ensure domain exists
    domain, _ = Domain.objects.get_or_create(
        code='SCIENCES_EDU',
        defaults={'name': "Sciences de l'éducation", 'description': "علوم التربية ومستجدات المنهاج"}
    )

    # Subdomains
    subdomains_data = [
        ('EDU_DEV', "Psychologie du développement (20%)", "علم نفس النمو – مفاهيمه، مراحله، ونظرياته الكبرى (بياجي، فرويد، إريكسون، فيغوتسكي)"),
        ('EDU_APPR', "Psychologie de l'apprentissage (20%)", "علم نفس التعلم – نظريات التعلم، شروطه، الدافعية، الذاكرة، وعوائق التعلم"),
        ('EDU_APPROCHES', "De la PPO à l'APC (15%)", "المقاربات البيداغوجية – من بيداغوجيا الأهداف إلى المقاربة بالكفايات وبيداغوجيا الإدماج"),
        ('EDU_METHODES', "Méthodes d'enseignement (15%)", "طرائق التدريس واستراتيجيات التعليم والتعلم – حل المشكلات، المشروع، التمايز، والتقويم"),
        ('EDU_SOCIO', "Sociologie de l'éducation (15%)", "سوسيولوجيا التربية – التنشئة الاجتماعية، إعادة الإنتاج، العدالة المدرسية، وإصلاحات التعليم"),
        ('EDU_GROUPE', "Dynamique de groupe (15%)", "دينامية الجماعة – جماعة القسم، أنماط القيادة، السوسيومترية، والتواصل التربوي"),
    ]

    for code, name, desc in subdomains_data:
        Subdomain.objects.update_or_create(
            code=code,
            defaults={'domain': domain, 'name': name, 'description': desc}
        )

    # Reassign legacy courses 36, 37, 38, 39 to DEV_ALGO so they do not count in SCIENCES_EDU
    try:
        dev_sub = Subdomain.objects.filter(code='DEV_ALGO').first()
        if dev_sub:
            Course.objects.filter(id__in=[36, 37, 38, 39]).update(subdomain=dev_sub)
    except Exception:
        pass

    # Read initial_data.json
    base_dir = getattr(settings, 'BASE_DIR', None)
    if base_dir:
        json_path = os.path.join(base_dir, 'initial_data.json')
    else:
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'initial_data.json')

    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf8') as f:
            data = json.load(f)

        for item in data:
            if item.get('model') == 'syllabus.course':
                pk = item.get('pk')
                fields = item.get('fields', {})
                subdomain_code = fields.get('subdomain')
                try:
                    sub_obj = Subdomain.objects.get(code=subdomain_code)
                except Subdomain.DoesNotExist:
                    continue

                Course.objects.update_or_create(
                    id=pk,
                    defaults={
                        'subdomain': sub_obj,
                        'title': fields.get('title'),
                        'title_ar': fields.get('title_ar'),
                        'content': fields.get('content'),
                        'content_ar': fields.get('content_ar'),
                        'content_fr': fields.get('content_fr'),
                        'examples': fields.get('examples'),
                        'examples_ar': fields.get('examples_ar'),
                        'examples_fr': fields.get('examples_fr'),
                        'astuces': fields.get('astuces'),
                        'astuces_ar': fields.get('astuces_ar'),
                        'astuces_fr': fields.get('astuces_fr'),
                        'video_url': fields.get('video_url'),
                    }
                )

def reverse_populate(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('syllabus', '0027_fix_course_headings_separated'),
    ]

    operations = [
        migrations.RunPython(populate_sciences_edu, reverse_code=reverse_populate),
    ]
