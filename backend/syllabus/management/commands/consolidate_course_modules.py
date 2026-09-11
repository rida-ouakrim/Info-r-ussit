"""
consolidate_course_modules.py
==============================
Consolidates single video rows and fragmented lesson titles into unified master course modules.
Group video playlists (Java POO, SQL, MCD, Architecture, Réseau, UML) and Algo into clean master courses.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course


class Command(BaseCommand):
    help = 'Consolidate individual video rows into clean master course modules'

    def handle(self, *args, **kwargs):
        # 1. Clean up duplicate legacy titles
        Course.objects.filter(title="Technologies Web côté client : HTML5, CSS3, JavaScript").delete()
        Course.objects.filter(title="Développement dynamique côté serveur : PHP et SGBD MySQL").delete()
        Course.objects.filter(title="Programmation Orientée Objet (Java/C++) : Concepts et principes").delete()
        Course.objects.filter(title="Modélisation UML : Cas d'utilisation, Classes, Séquences").delete()
        Course.objects.filter(title="Analyse de données et formules complexes sur tableur (Excel)").delete()

        # 2. Consolidate video series titles into master courses
        video_series = [
            {
                "prefix": "Java POO ",
                "master_title": "Programmation Orientée Objet : Java POO (Classes, Héritage, Polymorphisme)",
                "playlist_url": "https://www.youtube.com/watch?v=GC5BdRve38A&list=PLSVDd2z0rl6PlOscYvneTFvU8qqPFzFkl",
                "subdomain": "DEV_PROG_WEB",
            },
            {
                "prefix": "SQL ",
                "master_title": "Bases de données relationnelles et requêtes SQL (Jointures, Agrégats)",
                "playlist_url": "https://www.youtube.com/watch?v=GC5BdRve38A&list=PLSVDd2z0rl6PlOscYvneTFvU8qqPFzFkl",
                "subdomain": "DEV_SI_BD",
            },
            {
                "prefix": "MCD ",
                "master_title": "Modèle Conceptuel de Données (MCD) : Entité, Association, Cardinalités",
                "playlist_url": "https://www.youtube.com/watch?v=SgRPE34cunI&list=PLF2W_rB6QiYAaU6SaT3zCDBXOJ5ufSHXL",
                "subdomain": "DEV_SI_BD",
            },
            {
                "prefix": "UML ",
                "master_title": "Conception Orientée Objet : UML 2.5 (Cas d'utilisation, Classes, Séquence, Activité)",
                "playlist_url": "https://www.youtube.com/watch?v=GC5BdRve38A&list=PLSVDd2z0rl6PlOscYvneTFvU8qqPFzFkl",
                "subdomain": "DEV_SI_BD",
            },
            {
                "prefix": "Chapitre ",
                "master_title": "Architecture des Ordinateurs & Composants (CPU, RAM, Carte mère)",
                "playlist_url": "https://www.youtube.com/watch?v=bYcxWw-a2mI&list=PL-dXZxcGvCRVgbHf5OWpy_m3kIq_-waiN",
                "subdomain": "SYS_ARCHI",
            },
            {
                "prefix": "Réseau ",
                "master_title": "Architecture réseau : Couches et protocoles du modèle OSI et TCP/IP",
                "playlist_url": "https://drive.google.com/file/d/1of8bwTqSk68xD7TcYwTjI-VEkBAM-elz/view?usp=sharing",
                "subdomain": "SYS_NET",
            },
        ]

        for series in video_series:
            prefix = series["prefix"]
            master_title = series["master_title"]
            sub_code = series["subdomain"]
            playlist_url = series["playlist_url"]

            subdomain = Subdomain.objects.filter(code=sub_code).first()
            if not subdomain:
                continue

            master_course, created = Course.objects.get_or_create(
                subdomain=subdomain,
                title=master_title,
                defaults={'video_url': playlist_url}
            )
            if not master_course.video_url:
                master_course.video_url = playlist_url
                master_course.save()

            deleted_count, _ = Course.objects.filter(
                subdomain=subdomain,
                title__startswith=prefix
            ).exclude(id=master_course.id).delete()

            self.stdout.write(f"[OK] Grouped '{prefix}' series into '{master_title}' (Removed {deleted_count} individual cards)")

        # 3. Consolidate DEV_ALGO into 1 master card
        sub_algo = Subdomain.objects.filter(code='DEV_ALGO').first()
        if sub_algo:
            master_algo, _ = Course.objects.get_or_create(
                subdomain=sub_algo,
                title="Algorithmique & Structures de Données (Concepts & Leçons)",
                defaults={
                    'content': "# Algorithmique & Structures de Données\n\nConsultez les 14 leçons ci-dessous pour maîtriser les variables, boucles, tableaux, récursivité, arbres et graphes.",
                }
            )
            del_algo, _ = Course.objects.filter(subdomain=sub_algo).exclude(id=master_algo.id).delete()
            self.stdout.write(f"[OK] Grouped DEV_ALGO into single master course (Removed {del_algo} cards)")

        self.stdout.write(self.style.SUCCESS("[OK] Courses consolidation complete!"))
