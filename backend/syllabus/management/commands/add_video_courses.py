"""
add_video_courses.py
====================
Creates or updates courses with YouTube video URLs for:
- Architecture des Ordinateurs (20 videos, Monsieur Cremer) → SYS_ARCHI
- Java POO Darija (13 videos, EL BAHJA academy) → DEV_PROG_WEB
- Réseau Informatique Darija (5 videos, Anas Education) → SYS_NET
- SQL/MySQL Darija (28 videos, BYDEVMAR) → DEV_SI_BD
- UML (7 videos, Delphine Longuet) → DEV_SI_BD
- MCD (12 videos, Zeek Zone) → DEV_SI_BD
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course


# ── Video Course Data ────────────────────────────────────────────────────────

ARCHITECTURE_PLAYLIST = "https://www.youtube.com/watch?v=bYcxWw-a2mI&list=PL-dXZxcGvCRVgbHf5OWpy_m3kIq_-waiN"
ARCHITECTURE_VIDEOS = [
    {"num": 1,  "title": "Chapitre 1 - Introduction à l'architecture des systèmes informatiques", "duration": "15:47"},
    {"num": 2,  "title": "Chapitre 2 - CPU - partie 1/6 : Rôle et composants du processeur", "duration": "22:52"},
    {"num": 3,  "title": "Chapitre 2 - CPU - partie 2/6 : Cycle d'instruction", "duration": "13:26"},
    {"num": 4,  "title": "Chapitre 2 - CPU - partie 3/6 : Registres et bus", "duration": "21:44"},
    {"num": 5,  "title": "Chapitre 2 - CPU - partie 4/6 : Architecture interne", "duration": "43:59"},
    {"num": 6,  "title": "Chapitre 2 - CPU - partie 5/6 : Pipeline et performance", "duration": "35:07"},
    {"num": 7,  "title": "Chapitre 2 - CPU - partie 6/6 : Évolution des processeurs", "duration": "26:20"},
    {"num": 8,  "title": "Chapitre 3 - RAM - partie 1/2 : Types de mémoire", "duration": "25:30"},
    {"num": 9,  "title": "Chapitre 3 - RAM - partie 2/2 : Hiérarchie mémoire et cache", "duration": "32:40"},
    {"num": 10, "title": "Chapitre 4 - Stockage - partie 1/2 : Disques durs et SSD", "duration": "33:51"},
    {"num": 11, "title": "Chapitre 4 - Stockage - partie 2/2 : RAID et systèmes de fichiers", "duration": "35:27"},
    {"num": 12, "title": "Chapitre 5 - Carte mère - partie 1/2 : Composants et chipset", "duration": "24:55"},
    {"num": 13, "title": "Chapitre 5 - Carte mère - partie 2/2 : Bus et connecteurs", "duration": "28:30"},
    {"num": 14, "title": "Chapitre 6 - Alimentation - partie 1/2 : Fonctionnement", "duration": "25:01"},
    {"num": 15, "title": "Chapitre 6 - Alimentation - partie 2/2 : Calcul de puissance", "duration": "34:09"},
    {"num": 16, "title": "Chapitre 7 - Processeur graphique - partie 1/2 : GPU et rendu", "duration": "29:03"},
    {"num": 17, "title": "Chapitre 7 - Processeur graphique - partie 2/2 : GPU vs CPU", "duration": "42:25"},
    {"num": 18, "title": "Chapitre 8 - Le boîtier : Form factors et refroidissement", "duration": "24:51"},
    {"num": 19, "title": "Chapitre 9 - Les écrans - partie 1/2 : Technologies d'affichage", "duration": "39:59"},
    {"num": 20, "title": "Chapitre 9 - Les écrans - partie 2/2 : Résolution et connectique", "duration": "43:55"},
]

JAVA_POO_PLAYLIST = "https://www.youtube.com/watch?v=kYJv8P-V9pY&list=PL3a0W0x2e0_B7x0c_N-W60bY8R23q341N"
JAVA_POO_VIDEOS = [
    {"num": 1,  "title": "Java POO 01 : What's an Object (Darija)", "duration": "14:49"},
    {"num": 2,  "title": "Java POO 02 : Create Java Class (Darija)", "duration": "4:56"},
    {"num": 3,  "title": "Java POO 03 : Fields and Methods (Darija)", "duration": "5:16"},
    {"num": 4,  "title": "Java POO 04 : Instantiation (Darija)", "duration": "6:26"},
    {"num": 5,  "title": "Java POO 05 : Anonymous Object (Darija)", "duration": "3:56"},
    {"num": 6,  "title": "Java POO 06 : Modifiers (Darija)", "duration": "7:44"},
    {"num": 7,  "title": "Java POO 07 : Getters and Setters (Darija)", "duration": "10:49"},
    {"num": 8,  "title": "Java POO 08 : Constructor (Darija)", "duration": "12:06"},
    {"num": 9,  "title": "Java POO 09 : Single Level Inheritance (Darija)", "duration": "5:00"},
    {"num": 10, "title": "Java POO 10 : Multilevel Inheritance (Darija)", "duration": "8:16"},
    {"num": 11, "title": "Java POO 11 : Inheritance Types (Darija)", "duration": "6:41"},
    {"num": 12, "title": "Java POO 12 : Method Overloading (Darija)", "duration": "10:49"},
    {"num": 13, "title": "Java POO 13 : Method Overloading suite (Darija)", "duration": "10:49"},
]

RESEAU_PLAYLIST = "https://drive.google.com/file/d/1of8bwTqSk68xD7TcYwTjI-VEkBAM-elz/view?usp=sharing"
RESEAU_VIDEOS = [
    {"num": 1, "title": "Réseau Informatique : Cours complet de révision (Darija)", "duration": "1:15:00"},
]

SQL_PLAYLIST = "https://www.youtube.com/watch?v=1-MYSQL-DARIJA&list=PLBYDEVMAR_SQL"
SQL_VIDEOS = [
    {"num": 1,  "title": "SQL 01 : Introduction à MySQL (Darija)", "duration": "8:42"},
    {"num": 2,  "title": "SQL 02 : Premier code SQL (Darija)", "duration": "8:33"},
    {"num": 3,  "title": "SQL 03 : Les types de données (Darija)", "duration": "14:58"},
    {"num": 4,  "title": "SQL 04 : Créer une base de données (Darija)", "duration": "9:26"},
    {"num": 5,  "title": "SQL 05 : Création des tables (Darija)", "duration": "9:49"},
    {"num": 6,  "title": "SQL 06 : NOT NULL et UNIQUE (Darija)", "duration": "6:29"},
    {"num": 7,  "title": "SQL 07 : CHECK et DEFAULT (Darija)", "duration": "6:41"},
    {"num": 8,  "title": "SQL 08 : PRIMARY KEY (Darija)", "duration": "8:30"},
    {"num": 9,  "title": "SQL 09 : FOREIGN KEY (Darija)", "duration": "9:55"},
    {"num": 10, "title": "SQL 10 : INSERT INTO (Darija)", "duration": "11:08"},
    {"num": 11, "title": "SQL 11 : UPDATE TABLE (Darija)", "duration": "5:05"},
    {"num": 12, "title": "SQL 12 : DELETE FROM (Darija)", "duration": "3:46"},
    {"num": 13, "title": "SQL 13 : SELECT 'HELLO WORLD!' (Darija)", "duration": "3:13"},
    {"num": 14, "title": "SQL 14 : SELECT FROM (Darija)", "duration": "2:43"},
    {"num": 15, "title": "SQL 15 : WHERE - Les conditions (Darija)", "duration": "4:33"},
    {"num": 16, "title": "SQL 16 : AND, OR, XOR, NOT (Darija)", "duration": "5:51"},
    {"num": 17, "title": "SQL 17 : L'opérateur LIKE (Darija)", "duration": "6:05"},
    {"num": 18, "title": "SQL 18 : L'opérateur BETWEEN (Darija)", "duration": "3:47"},
    {"num": 19, "title": "SQL 19 : L'opérateur IN (Darija)", "duration": "3:24"},
    {"num": 20, "title": "SQL 20 : ORDER BY (Darija)", "duration": "4:05"},
    {"num": 21, "title": "SQL 21 : DISTINCT (Darija)", "duration": "2:13"},
    {"num": 22, "title": "SQL 22 : LIMIT (Darija)", "duration": "2:47"},
    {"num": 23, "title": "SQL 23 : ALIAS (Darija)", "duration": "5:07"},
    {"num": 24, "title": "SQL 24 : SINGLE ROW FUNCTIONS (Darija)", "duration": "9:18"},
    {"num": 25, "title": "SQL 25 : Fonctions d'agrégation MAX, MIN, AVG, SUM, COUNT (Darija)", "duration": "5:12"},
    {"num": 26, "title": "SQL 26 : GROUP BY (Darija)", "duration": "9:32"},
    {"num": 27, "title": "SQL 27 : INNER JOIN (Darija)", "duration": "7:27"},
    {"num": 28, "title": "SQL 28 : Examen SQL - Correction complète (Darija)", "duration": "40:28"},
]

UML_PLAYLIST = "https://www.youtube.com/watch?v=GC5BdRve38A&list=PLSVDd2z0rl6PlOscYvneTFvU8qqPFzFkl"
UML_VIDEOS = [
    {"num": 1, "title": "UML 01 : Diagrammes de cas d'utilisation", "duration": "13:00"},
    {"num": 2, "title": "UML 02 : Scénarios détaillés et diagrammes de séquence", "duration": "8:09"},
    {"num": 3, "title": "UML 03 : Diagrammes de classes - Classes et associations", "duration": "12:33"},
    {"num": 4, "title": "UML 04 : Diagrammes de classes - Associations, héritage", "duration": "13:56"},
    {"num": 5, "title": "UML 05 : Diagrammes de classes - Contraintes", "duration": "8:12"},
    {"num": 6, "title": "UML 06 : Diagrammes de classes - Opérations", "duration": "6:05"},
    {"num": 7, "title": "UML 07 : Diagrammes de séquence (conception)", "duration": "14:32"},
]

MCD_PLAYLIST = "https://www.youtube.com/watch?v=SgRPE34cunI&list=PLF2W_rB6QiYAaU6SaT3zCDBXOJ5ufSHXL"
MCD_VIDEOS = [
    {"num": 1,  "title": "MCD 01 : Notion de modélisation (Darija)", "duration": "8:02"},
    {"num": 2,  "title": "MCD 02 : Notion d'entité (Darija)", "duration": "9:55"},
    {"num": 3,  "title": "MCD 03 : Notion d'identifiant et de clé (Darija)", "duration": "14:02"},
    {"num": 4,  "title": "MCD 04 : Notion d'association (Darija)", "duration": "9:57"},
    {"num": 5,  "title": "MCD 05 : Notion de cardinalités (Darija)", "duration": "10:25"},
    {"num": 6,  "title": "MCD 06 : Exercice entité-association 1 (Darija)", "duration": "16:12"},
    {"num": 7,  "title": "MCD 07 : Exercice entité-association 2 (Darija)", "duration": "15:55"},
    {"num": 8,  "title": "MCD 08 : Exercice entité-association 3 (Darija)", "duration": "12:01"},
    {"num": 9,  "title": "MCD 09 : Exercice EA - Distribution d'ouvrages 1/2 (Darija)", "duration": "13:48"},
    {"num": 10, "title": "MCD 10 : Exercice EA - Distribution d'ouvrages 2/2 (Darija)", "duration": "13:26"},
    {"num": 11, "title": "MCD 11 : Exercice EA - Agence de voyage 1/2 (Darija)", "duration": "14:03"},
    {"num": 12, "title": "MCD 12 : Exercice EA - Agence de voyage 2/2 (Darija)", "duration": "15:54"},
]


class Command(BaseCommand):
    help = 'Add video courses (Architecture, Java POO, Réseau, SQL, UML, MCD) with YouTube URLs'

    def handle(self, *args, **kwargs):
        total_created = 0
        total_updated = 0

        groups = [
            {
                "subdomain_code": "SYS_ARCHI",
                "videos": ARCHITECTURE_VIDEOS,
                "playlist": ARCHITECTURE_PLAYLIST,
                "prefix": "Architecture",
                "channel": "Monsieur Cremer",
            },
            {
                "subdomain_code": "DEV_PROG_WEB",
                "videos": JAVA_POO_VIDEOS,
                "playlist": JAVA_POO_PLAYLIST,
                "prefix": "Java POO",
                "channel": "EL BAHJA academy",
            },
            {
                "subdomain_code": "SYS_NET",
                "videos": RESEAU_VIDEOS,
                "playlist": RESEAU_PLAYLIST,
                "prefix": "Réseau",
                "channel": "Anas Education",
            },
            {
                "subdomain_code": "DEV_SI_BD",
                "videos": SQL_VIDEOS,
                "playlist": SQL_PLAYLIST,
                "prefix": "SQL",
                "channel": "BYDEVMAR",
            },
            {
                "subdomain_code": "DEV_SI_BD",
                "videos": UML_VIDEOS,
                "playlist": UML_PLAYLIST,
                "prefix": "UML",
                "channel": "Delphine Longuet",
            },
            {
                "subdomain_code": "DEV_SI_BD",
                "videos": MCD_VIDEOS,
                "playlist": MCD_PLAYLIST,
                "prefix": "MCD",
                "channel": "Zeek Zone",
            },
        ]

        for group in groups:
            sub_code = group["subdomain_code"]
            subdomain = Subdomain.objects.filter(code=sub_code).first()
            if not subdomain:
                self.stderr.write(f"Subdomain {sub_code} not found, skipping {group['prefix']}")
                continue

            self.stdout.write(f"\n{'='*60}")
            self.stdout.write(f"[VIDEO] {group['prefix']} ({group['channel']}) -> {sub_code}")

            for video in group["videos"]:
                title = video["title"]
                # Use playlist URL for the first video, specific video_url if available
                video_url = group.get("playlist") or ""
                
                # Build content with video metadata
                content = (
                    f"# {title}\n\n"
                    f"**Chaîne YouTube :** {group['channel']}\n\n"
                    f"**Durée :** {video['duration']}\n\n"
                    f"---\n\n"
                    f"Regardez la vidéo dans l'onglet **Leçon Vidéo** ci-dessus pour suivre le cours complet.\n\n"
                    f"> Ce cours fait partie d'une série de {len(group['videos'])} vidéos.\n"
                )

                course, created = Course.objects.update_or_create(
                    subdomain=subdomain,
                    title=title,
                    defaults={
                        'content': content,
                        'video_url': video_url,
                    }
                )

                if created:
                    total_created += 1
                    self.stdout.write(f"  [NEW] {title}")
                else:
                    total_updated += 1
                    self.stdout.write(f"  [UPD] {title}")

        self.stdout.write(f"\n{'='*60}")
        self.stdout.write(self.style.SUCCESS(
            f"[OK] Done! Created: {total_created} | Updated: {total_updated} | Total: {total_created + total_updated}"
        ))
