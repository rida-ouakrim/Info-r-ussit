import json
import os
from django.db import migrations

def update_excel_course_tp(apps, schema_editor):
    Course = apps.get_model('syllabus', 'Course')
    json_path = os.path.join(os.path.dirname(__file__), '../../initial_data.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        excel_item = next((x for x in data if x.get('model') == 'syllabus.course' and x.get('pk') == 16), None)
        if excel_item:
            f = excel_item['fields']
            Course.objects.filter(pk=16).update(
                content=f.get('content'),
                content_fr=f.get('content_fr')
            )

def reverse_update(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('syllabus', '0018_usercourseannotation'),
    ]

    operations = [
        migrations.RunPython(update_excel_course_tp, reverse_code=reverse_update),
    ]
