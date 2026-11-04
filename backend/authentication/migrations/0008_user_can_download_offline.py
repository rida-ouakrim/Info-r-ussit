from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_backfill_user_study_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='can_download_offline',
            field=models.BooleanField(default=False, verbose_name='Accès Mode Hors-Ligne'),
        ),
    ]
