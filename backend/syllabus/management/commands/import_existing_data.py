import os
import sqlite3
from django.core.management.base import BaseCommand
from authentication.models import User, LicenseKey
from syllabus.models import Domain, Subdomain, Course
from exams.models import Question

class Command(BaseCommand):
    help = 'Imports domains, subdomains, courses, and questions from concours.db'

    def handle(self, *args, **kwargs):
        from django.conf import settings
        db_path = os.path.join(settings.BASE_DIR.parent, 'concours.db')
        
        if not os.path.exists(db_path):
            self.stderr.write(f"Source database not found at {db_path}")
            return

        self.stdout.write(f"Connecting to source database: {db_path}")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # 1. Import Domains
        cursor.execute("SELECT code, name, description FROM syllabus_domains")
        domains_count = 0
        for row in cursor.fetchall():
            Domain.objects.update_or_create(
                code=row['code'],
                defaults={'name': row['name'], 'description': row['description']}
            )
            domains_count += 1
        self.stdout.write(self.style.SUCCESS(f"Imported {domains_count} Domains"))

        # 2. Import Subdomains
        cursor.execute("SELECT code, domain_code, name, description FROM syllabus_subdomains")
        subdomains_count = 0
        for row in cursor.fetchall():
            domain = Domain.objects.filter(code=row['domain_code']).first()
            if domain:
                Subdomain.objects.update_or_create(
                    code=row['code'],
                    defaults={'domain': domain, 'name': row['name'], 'description': row['description']}
                )
                subdomains_count += 1
        self.stdout.write(self.style.SUCCESS(f"Imported {subdomains_count} Subdomains"))

        # 3. Import Courses
        cursor.execute("SELECT subdomain_code, title, content, examples, astuces FROM courses")
        courses_count = 0
        for row in cursor.fetchall():
            subdomain = Subdomain.objects.filter(code=row['subdomain_code']).first()
            if subdomain:
                Course.objects.update_or_create(
                    subdomain=subdomain,
                    title=row['title'],
                    defaults={
                        'content': row['content'],
                        'examples': row['examples'],
                        'astuces': row['astuces']
                    }
                )
                courses_count += 1
        self.stdout.write(self.style.SUCCESS(f"Imported {courses_count} Courses"))

        # 4. Import Questions
        cursor.execute("SELECT source_type, exam_year, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, astuce, domain_code, subdomain_code FROM questions")
        questions_count = 0
        for row in cursor.fetchall():
            domain = Domain.objects.filter(code=row['domain_code']).first() if row['domain_code'] else None
            subdomain = Subdomain.objects.filter(code=row['subdomain_code']).first() if row['subdomain_code'] else None
            
            Question.objects.get_or_create(
                question_text=row['question_text'],
                defaults={
                    'source_type': row['source_type'] or 'past_exam',
                    'exam_year': row['exam_year'],
                    'question_number': row['question_number'],
                    'option_a': row['option_a'],
                    'option_b': row['option_b'],
                    'option_c': row['option_c'],
                    'option_d': row['option_d'],
                    'correct_option': row['correct_option'],
                    'explanation': row['explanation'],
                    'astuce': row['astuce'],
                    'domain': domain,
                    'subdomain': subdomain
                }
            )
            questions_count += 1
        self.stdout.write(self.style.SUCCESS(f"Imported {questions_count} Questions"))

        # 5. Create Default License Keys
        default_keys = ["PASS-CONCOURS-2026", "DEMO-KEY-2026", "INFO-CRMEF-2026", "ADMIN-SECRET-KEY"]
        for key_str in default_keys:
            LicenseKey.objects.get_or_create(key_code=key_str)
        self.stdout.write(self.style.SUCCESS(f"Generated default License Keys: {default_keys}"))

        # 6. Create Superuser (Admin)
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@concours-info.ma',
                password='admin123',
                target_exam='Administrateur Plateforme'
            )
            self.stdout.write(self.style.SUCCESS("Created Superuser: admin / admin123"))

        conn.close()
        self.stdout.write(self.style.SUCCESS("Data import completed successfully!"))
