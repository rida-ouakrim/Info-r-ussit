#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de déploiement et d'enrichissement du cours Multimédia sur GCP PostgreSQL.
Usage:
    python backend/deploy_multimedia_course.py
"""

import os
import sys
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from syllabus.models import Course, Subdomain
from exams.models import Question

MULTIMEDIA_EXAM_QUESTIONS = [
    (2025, 'Q77'),
    (2025, 'Q78'),
    (2025, 'Q79'),
    (2025, 'Q80'),
    (2024, 'Q17'),
    (2024, 'Q18'),
    (2024, 'Q19'), # Post-production vidéo
    (2024, 'Q20'),
    (2023, 'Q62'),
    (2023, 'Q63'),
    (2023, 'Q64'),
    (2022, 'Q61'),
    (2022, 'Q62'),
    (2022, 'Q63'),
    (2022, 'Q68'),
    (2021, 'Q17'),
    (2021, 'Q22'),
    (2020, 'Q17'),
]

def main():
    print("[*] Déploiement du cours Multimédia sur PostgreSQL...")
    json_path = os.path.join(os.path.dirname(__file__), 'initial_data.json')
    if not os.path.exists(json_path):
        print(f"[!] Erreur: Fichier {json_path} introuvable.")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    item = next(
        (x for x in data if x.get('model') == 'syllabus.course' and 'Multimédia' in x.get('fields', {}).get('title', '')),
        None
    )
    if not item:
        print("[!] Erreur: Cours Multimédia introuvable dans initial_data.json")
        sys.exit(1)

    f = item['fields']
    subdomain_code = f.get('subdomain') or 'LOG_OFFICE'
    subdomain = Subdomain.objects.filter(code=subdomain_code).first()
    if not subdomain:
        print(f"[!] Erreur: Sous-domaine {subdomain_code} introuvable.")
        sys.exit(1)

    course, created = Course.objects.get_or_create(
        subdomain=subdomain,
        title=f.get('title'),
        defaults={
            'title_ar': f.get('title_ar'),
            'content': f.get('content'),
            'content_fr': f.get('content_fr'),
            'content_ar': f.get('content_ar'),
            'examples': f.get('examples'),
            'examples_fr': f.get('examples_fr'),
            'examples_ar': f.get('examples_ar'),
            'astuces': f.get('astuces'),
            'astuces_fr': f.get('astuces_fr'),
            'astuces_ar': f.get('astuces_ar'),
            'video_url': f.get('video_url'),
        }
    )

    if not created:
        Course.objects.filter(pk=course.pk).update(
            title_ar=f.get('title_ar'),
            content=f.get('content'),
            content_fr=f.get('content_fr'),
            content_ar=f.get('content_ar'),
            examples=f.get('examples'),
            examples_fr=f.get('examples_fr'),
            examples_ar=f.get('examples_ar'),
            astuces=f.get('astuces'),
            astuces_fr=f.get('astuces_fr'),
            astuces_ar=f.get('astuces_ar'),
            video_url=f.get('video_url'),
        )
        print(f"[+] Cours mis à jour existant (ID={course.pk}): {course.title}")
    else:
        print(f"[+] Nouveau cours créé avec succès (ID={course.pk}): {course.title}")

    # Liaison des questions d'examen
    total_linked = 0
    for yr, qnum in MULTIMEDIA_EXAM_QUESTIONS:
        count = Question.objects.filter(exam_year=yr, question_number=qnum).update(course=course)
        total_linked += count

    print(f"[+] {total_linked} questions d'examen reliées au cours Multimédia (dont 2024 Q19).")
    print("[SUCCESS] Déploiement terminé avec succès !")

if __name__ == '__main__':
    main()
