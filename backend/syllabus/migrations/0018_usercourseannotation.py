from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('syllabus', '0017_enrich_multimedia_course'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserCourseAnnotation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('highlights', models.JSONField(blank=True, default=dict)),
                ('notes', models.JSONField(blank=True, default=dict)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='course_annotations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
