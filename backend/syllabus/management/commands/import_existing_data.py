import os
import sqlite3
from django.core.management.base import BaseCommand
from authentication.models import User, LicenseKey
from syllabus.models import Domain, Subdomain, Course
from exams.models import Question

class Command(BaseCommand):
    help = 'Importe (ou met à jour) domaines, sous-domaines, cours et questions depuis concours.db'

    def handle(self, *args, **kwargs):
        from django.conf import settings
        db_path = os.path.join(settings.BASE_DIR.parent, 'concours.db')
        
        if not os.path.exists(db_path):
            self.stderr.write(f"Base source introuvable : {db_path}")
            return

        self.stdout.write(f"Connexion à la base source : {db_path}")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # ─── 1. Import Domains ───────────────────────────────────────────
        cursor.execute("SELECT code, name, description FROM syllabus_domains")
        created, updated = 0, 0
        for row in cursor.fetchall():
            _, was_created = Domain.objects.update_or_create(
                code=row['code'],
                defaults={'name': row['name'], 'description': row['description']}
            )
            if was_created:
                created += 1
            else:
                updated += 1
        self.stdout.write(self.style.SUCCESS(f"Domaines — créés: {created}, mis à jour: {updated}"))

        # ─── 2. Import Subdomains ────────────────────────────────────────
        cursor.execute("SELECT code, domain_code, name, description FROM syllabus_subdomains")
        created, updated = 0, 0
        for row in cursor.fetchall():
            domain = Domain.objects.filter(code=row['domain_code']).first()
            if domain:
                _, was_created = Subdomain.objects.update_or_create(
                    code=row['code'],
                    defaults={'domain': domain, 'name': row['name'], 'description': row['description']}
                )
                if was_created:
                    created += 1
                else:
                    updated += 1
        self.stdout.write(self.style.SUCCESS(f"Sous-domaines — créés: {created}, mis à jour: {updated}"))

        # ─── 3. Import Courses ───────────────────────────────────────────
        # Détecter les colonnes disponibles dans la table courses de concours.db
        columns = [col[1] for col in cursor.execute("PRAGMA table_info(courses)").fetchall()]
        has_video_url   = 'video_url'   in columns
        has_content_ar  = 'content_ar'  in columns
        has_content_fr  = 'content_fr'  in columns

        cursor.execute("SELECT * FROM courses")
        created, updated = 0, 0
        for row in cursor.fetchall():
            subdomain = Subdomain.objects.filter(code=row['subdomain_code']).first()
            if subdomain:
                defaults = {
                    'content':  row['content'],
                    'examples': row['examples'],
                    'astuces':  row['astuces'],
                    'video_url':    row['video_url']   if has_video_url   else None,
                    'content_ar':   row['content_ar']  if has_content_ar  else None,
                    'content_fr':   row['content_fr']  if has_content_fr  else None,
                }
                _, was_created = Course.objects.update_or_create(
                    subdomain=subdomain,
                    title=row['title'],
                    defaults=defaults
                )
                if was_created:
                    created += 1
                else:
                    updated += 1
        self.stdout.write(self.style.SUCCESS(f"Cours — créés: {created}, mis à jour: {updated}"))

        # ─── 4. Import Questions ─────────────────────────────────────────
        q_columns = [col[1] for col in cursor.execute("PRAGMA table_info(questions)").fetchall()]
        has_option_e = 'option_e' in q_columns

        cursor.execute("SELECT * FROM questions")
        created, skipped = 0, 0
        for row in cursor.fetchall():
            domain    = Domain.objects.filter(code=row['domain_code']).first()    if row['domain_code']    else None
            subdomain = Subdomain.objects.filter(code=row['subdomain_code']).first() if row['subdomain_code'] else None

            # Clé unique : texte + année + numéro → évite les doublons
            _, was_created = Question.objects.get_or_create(
                question_text=row['question_text'],
                exam_year=row['exam_year'],
                question_number=row['question_number'],
                defaults={
                    'source_type':    row['source_type'] or 'past_exam',
                    'option_a':       row['option_a'],
                    'option_b':       row['option_b'],
                    'option_c':       row['option_c'],
                    'option_d':       row['option_d'],
                    'option_e':       row['option_e'] if has_option_e else None,
                    'correct_option': row['correct_option'],
                    'explanation':    row['explanation'],
                    'astuce':         row['astuce'],
                    'domain':         domain,
                    'subdomain':      subdomain,
                }
            )
            if was_created:
                created += 1
            else:
                skipped += 1
        self.stdout.write(self.style.SUCCESS(f"Questions — créées: {created}, déjà existantes: {skipped}"))

        # ─── 5. Clés de licence par défaut ──────────────────────────────
        default_keys = ["PASS-CONCOURS-2026", "DEMO-KEY-2026", "INFO-CRMEF-2026", "ADMIN-SECRET-KEY"]
        keys_created = 0
        for key_str in default_keys:
            _, was_created = LicenseKey.objects.get_or_create(key_code=key_str)
            if was_created:
                keys_created += 1
        self.stdout.write(self.style.SUCCESS(f"Clés de licence — créées: {keys_created}/{len(default_keys)}"))

        # ─── 6. Superuser admin ─────────────────────────────────────────
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@concours-info.ma',
                password='admin123',
                target_exam='Administrateur Plateforme'
            )
            self.stdout.write(self.style.SUCCESS("Superuser créé : admin / admin123"))
        else:
            self.stdout.write("Superuser 'admin' existe déjà — aucune modification")

        conn.close()
        self.stdout.write(self.style.SUCCESS("\n✅ Import terminé avec succès !"))
