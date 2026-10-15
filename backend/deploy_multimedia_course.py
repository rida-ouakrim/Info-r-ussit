#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de déploiement et de restauration pour les 5 cours de TIC, Bureautique et Multimédia :
1. Word (Traitement de texte avancé)
2. Excel (Analyse de données et formules complexes)
3. Access (Gestion de bases de données de bureau)
4. PowerPoint (Conception de diaporamas et présentations multimédias)
5. Multimédia (Technologies du Multimédia : Image, Son, Vidéo & Post-Production)
"""

import os
import sys
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from syllabus.models import Course, Subdomain
from exams.models import Question

SUBDOMAIN_CODE = "LOG_OFFICE"

POWERPOINT_EXAM_QUESTIONS = [
    (2025, 'Q73'),
    (2025, 'Q74'),
    (2024, 'Q9'),
    (2024, 'Q10'),
    (2024, 'Q11'),
    (2024, 'Q12'),
    (2023, 'Q73'),
    (2023, 'Q74'),
    (2023, 'Q75'),
    (2023, 'Q76'),
    (2022, 'Q67'),
    (2022, 'Q69'),
    (2022, 'Q70'),
    (2022, 'Q75'),
    (2022, 'Q76'),
    (2021, 'Q6'),
    (2019, 'Q5'),
    (2019, 'Q8'),
]

MULTIMEDIA_EXAM_QUESTIONS = [
    (2025, 'Q77'), # Montage non linéaire NLE
    (2025, 'Q78'), # Vidéo Full HD 1080p brute
    (2025, 'Q79'), # Débit 8 Mbps 4 Go
    (2025, 'Q80'), # Débit 4 Mbps 15 min
    (2024, 'Q17'), # Segmentation d'image
    (2024, 'Q18'), # Distorsion du son (harmoniques)
    (2024, 'Q19'), # Post-production vidéo (Question concours 2024)
    (2024, 'Q20'), # Keyframe animation
    (2023, 'Q62'), # Son stéréo 1 min 44.1 kHz
    (2023, 'Q63'), # Image 16 bits (65536 couleurs)
    (2023, 'Q64'), # Résolution meilleure qualité (4K)
    (2022, 'Q61'), # Audio mono 512 s
    (2022, 'Q62'), # Moniteur 72 dpi
    (2022, 'Q63'), # Image matricielle pixels fixes
    (2022, 'Q68'), # Formes dessin vectoriel
    (2021, 'Q17'), # Compression avec perte DCT/JPEG
    (2021, 'Q22'), # Image 800x600 24 bits taille
    (2020, 'Q17'), # Screencast enregistrement écran
]

def main():
    print("=" * 60)
    print("[*] Déploiement et structuration des 5 cours de LOG_OFFICE...")
    print("=" * 60)

    subdomain = Subdomain.objects.filter(code=SUBDOMAIN_CODE).first()
    if not subdomain:
        print(f"[!] Erreur: Sous-domaine {SUBDOMAIN_CODE} introuvable.")
        sys.exit(1)

    json_path = os.path.join(os.path.dirname(__file__), 'initial_data.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    ppt_item = next((x for x in data if x.get('model') == 'syllabus.course' and x.get('pk') == 18), None)
    multi_item = next((x for x in data if x.get('model') == 'syllabus.course' and x.get('pk') == 150), None)

    if not ppt_item or not multi_item:
        print("[!] Erreur: Données PowerPoint ou Multimédia manquantes dans initial_data.json")
        sys.exit(1)

    # 1. RESTAURATION DE POWERPOINT (ID=18 ou titre PowerPoint)
    ppt_fields = ppt_item['fields']
    ppt_course = Course.objects.filter(pk=18).first()
    if not ppt_course:
        ppt_course = Course.objects.filter(subdomain=subdomain, title__icontains="PowerPoint").first()

    if ppt_course:
        ppt_course.title = ppt_fields.get('title')
        ppt_course.title_ar = ppt_fields.get('title_ar')
        ppt_course.content = ppt_fields.get('content')
        ppt_course.content_fr = ppt_fields.get('content_fr')
        ppt_course.content_ar = ppt_fields.get('content_ar')
        ppt_course.examples = ppt_fields.get('examples')
        ppt_course.examples_fr = ppt_fields.get('examples_fr')
        ppt_course.examples_ar = ppt_fields.get('examples_ar')
        ppt_course.astuces = ppt_fields.get('astuces')
        ppt_course.astuces_fr = ppt_fields.get('astuces_fr')
        ppt_course.astuces_ar = ppt_fields.get('astuces_ar')
        ppt_course.video_url = ppt_fields.get('video_url')
        ppt_course.save()
        print(f"[+] Cours PowerPoint restauré (ID={ppt_course.pk}): {ppt_course.title}")
    else:
        ppt_course = Course.objects.create(
            id=18,
            subdomain=subdomain,
            title=ppt_fields.get('title'),
            title_ar=ppt_fields.get('title_ar'),
            content=ppt_fields.get('content'),
            content_fr=ppt_fields.get('content_fr'),
            content_ar=ppt_fields.get('content_ar'),
            examples=ppt_fields.get('examples'),
            examples_fr=ppt_fields.get('examples_fr'),
            examples_ar=ppt_fields.get('examples_ar'),
            astuces=ppt_fields.get('astuces'),
            astuces_fr=ppt_fields.get('astuces_fr'),
            astuces_ar=ppt_fields.get('astuces_ar'),
            video_url=ppt_fields.get('video_url'),
        )
        print(f"[+] Cours PowerPoint recréé (ID={ppt_course.pk}): {ppt_course.title}")

    # Relier les questions PowerPoint
    ppt_linked = 0
    for yr, qnum in POWERPOINT_EXAM_QUESTIONS:
        count = Question.objects.filter(exam_year=yr, question_number=qnum).update(course=ppt_course)
        ppt_linked += count
    print(f"    -> {ppt_linked} questions d'examen reliées au cours PowerPoint.")

    # 2. CRÉATION DU COURS MULTIMÉDIA (5ème cours distinct)
    multi_fields = multi_item['fields']
    multi_title = multi_fields.get('title')

    multi_course = Course.objects.filter(subdomain=subdomain, title=multi_title).first()
    if not multi_course:
        multi_course = Course.objects.filter(pk=150).first()

    if multi_course:
        multi_course.title = multi_title
        multi_course.title_ar = None
        multi_course.content = multi_fields.get('content')
        multi_course.content_fr = multi_fields.get('content_fr')
        multi_course.content_ar = None
        multi_course.examples = multi_fields.get('examples')
        multi_course.examples_fr = multi_fields.get('examples_fr')
        multi_course.examples_ar = None
        multi_course.astuces = multi_fields.get('astuces')
        multi_course.astuces_fr = multi_fields.get('astuces_fr')
        multi_course.astuces_ar = None
        multi_course.video_url = None
        multi_course.save()
        print(f"[+] Cours Multimédia mis à jour (ID={multi_course.pk}): {multi_course.title}")
    else:
        multi_course = Course.objects.create(
            subdomain=subdomain,
            title=multi_title,
            title_ar=None,
            content=multi_fields.get('content'),
            content_fr=multi_fields.get('content_fr'),
            content_ar=None,
            examples=multi_fields.get('examples'),
            examples_fr=multi_fields.get('examples_fr'),
            examples_ar=None,
            astuces=multi_fields.get('astuces'),
            astuces_fr=multi_fields.get('astuces_fr'),
            astuces_ar=None,
            video_url=None
        )
        print(f"[+] Nouveau cours Multimédia créé (ID={multi_course.pk}): {multi_course.title}")

    # Relier les questions Multimédia (dont Q19 2024)
    multi_linked = 0
    for yr, qnum in MULTIMEDIA_EXAM_QUESTIONS:
        count = Question.objects.filter(exam_year=yr, question_number=qnum).update(course=multi_course)
        multi_linked += count
    print(f"    -> {multi_linked} questions d'examen reliées au cours Multimédia (dont 2024 Q19).")

    print("=" * 60)
    courses_in_subdomain = Course.objects.filter(subdomain=subdomain).order_by('id')
    total_count = courses_in_subdomain.count()
    print(f"[+] Total des cours dans '{subdomain.name}' : {total_count} cours :")
    for i, c in enumerate(courses_in_subdomain, 1):
        print(f"    {i}. [ID={c.id}] {c.title}")
    print("=" * 60)

    if total_count >= 5:
        print("[SUCCESS] Les 5 cours (Word, Excel, Access, PowerPoint, Multimédia) sont actifs !")
    else:
        print(f"[!] Attention: {total_count} cours trouvés au lieu de 5.")

if __name__ == '__main__':
    main()
