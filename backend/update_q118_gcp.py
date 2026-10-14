#!/usr/bin/env python3
"""
Script de mise à jour directe de la question Q118 (2023) dans la base PostgreSQL (GCP ou locale).
Usage:
    python update_q118_gcp.py
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from exams.models import Question

AR_EXPLANATION = (
    "حسب نظرية جان بياجيه (Jean Piaget)، يستطيع الطفل في مرحلة العمليات الملموسة، "
    "من 7 إلى 11 سنة تقريباً، إجراء العمليات الحسابية المنطقية، مثل الجمع والطرح، وفهم العلاقات بين الأعداد. "
    "لكن إذا كان المقصود هو القدرة على طرح عدد كبير من عدد صغير، فقد يشير السؤال إلى فهم الأعداد السالبة، "
    "وهو مفهوم أكثر تعقيداً؛ لذلك يعتمد الجواب الدقيق على الصياغة الأصلية للمرجع المعتمد في المباراة."
)

AR_ASTUCE = (
    "مرحلة العمليات الملموسة (Opérations concrètes) = اكتساب العمليات الحسابية المنطقية "
    "كالجمع والطرح وفهم العلاقات بين الأعداد وقابلية العكس الإجرائي."
)

FR_EXPLANATION = (
    "Selon la théorie de Jean Piaget, l'enfant au stade des opérations concrètes (environ 7 à 11 ans) "
    "devient capable de réaliser des opérations arithmétiques logiques telles que l'addition et la soustraction, "
    "et de comprendre les relations entre les nombres et la réversibilité. Si la question sous-entend la maîtrise formelle "
    "des nombres négatifs, cela relève de la pensée formelle ; toutefois, pour l'acquisition des opérations arithmétiques "
    "réversibles dans le cadre du concours, la réponse de référence est le stade des opérations concrètes."
)

FR_ASTUCE = (
    "Stade des opérations concrètes = acquisition des opérations arithmétiques logiques "
    "(addition, soustraction et réversibilité opératoire)."
)

def update_questions():
    qs = Question.objects.filter(exam_year=2023, question_number='Q118')
    count = qs.count()
    if count == 0:
        print("⚠️ Aucune question trouvée pour exam_year=2023 et question_number=Q118.")
        return

    for q in qs:
        is_french = 'soustraire' in (q.question_text or '').lower()
        q.correct_option = 'A'
        q.explanation = FR_EXPLANATION if is_french else AR_EXPLANATION
        q.astuce = FR_ASTUCE if is_french else AR_ASTUCE
        q.save()
        lang = "Français" if is_french else "Arabe"
        print(f"✅ Question ID={q.id} ({lang}) mise à jour avec succès : correct_option = 'A'")

if __name__ == '__main__':
    update_questions()
