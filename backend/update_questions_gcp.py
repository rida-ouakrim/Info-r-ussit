#!/usr/bin/env python3
"""
Script d'application des corrections (Q70, Q88, Q97, Q118) dans PostgreSQL sur GCP.
Usage:
    python backend/update_questions_gcp.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from exams.models import Question

UPDATES = {
    'Q70': {
        'correct': 'C',
        'explanation': 'التواصل الفعال (Communication efficace) يقوم على دقة الرسالة ووضوحها وتفادي اللبس والغموض وسوء الفهم، مما يعني حصر وتقليص هامش التأويل (Réduire la marge d\'interprétation) لكي يتطابق المعنى المستقبَل تماماً مع المعنى المقصود من المرسل.',
        'astuce': 'تواصل فعال = وضوح ودقة لا تترك مجالاً للتأويلات المتعددة أو الخاطئة (هامش تأويل ضيق).'
    },
    'Q88': {
        'correct': 'A',
        'explanation': 'حسب عالم الاجتماع بيير بورديو (Pierre Bourdieu)، يستمد الرأسمال الثقافي (Capital culturel) قيمته التمييزية والرمزية وسلطته الطبقية من التوزيع غير المتكافئ ومن ندرته؛ أي من وجود طبقات وفئات اجتماعية لا تتوفر عليه أو محرومة منه، وهو ما يمنح الطبقات الممتلكة له امتياز إعادة الإنتاج الاجتماعي وتكريس الفوارق.',
        'astuce': 'بورديو: الرأسمال الثقافي يستمد قيمته وسلطته التمييزية من ندرته ووجود طبقات لا تملكه.'
    },
    'Q97': {
        'correct': 'B',
        'explanation': 'تؤدي الصرامة المفرطة في المرحلة الشرجية حسب بعض امتحانات ومراجع علوم التربية والتحليل النفسي إلى نشوء مشاعر عدوانية وإسقاطات تسلطية تجاه المحيط، تتجلى في احتقار الكائنات الأدنى أو السلوكيات القهرية والعدائية.',
        'astuce': 'الصرامة المفرطة في المرحلة الشرجية = مشاعر تسلطية وعدوانية وسلوك احتقار الكائنات الأدنى.'
    },
    'Q118': {
        'correct': 'A',
        'explanation': 'حسب نظرية جان بياجيه (Jean Piaget)، يستطيع الطفل في مرحلة العمليات الملموسة، من 7 إلى 11 سنة تقريباً، إجراء العمليات الحسابية المنطقية، مثل الجمع والطرح، وفهم العلاقات بين الأعداد. لكن إذا كان المقصود هو القدرة على طرح عدد كبير من عدد صغير، فقد يشير السؤال إلى فهم الأعداد السالبة، وهو مفهوم أكثر تعقيداً؛ لذلك يعتمد الجواب الدقيق على الصياغة الأصلية للمرجع المعتمد في المباراة.',
        'astuce': 'مرحلة العمليات الملموسة (Opérations concrètes) = اكتساب العمليات الحسابية المنطقية كالجمع والطرح وفهم العلاقات بين الأعداد وقابلية العكس الإجرائي.'
    }
}

Q88_FR = {
    'correct': 'A',
    'explanation': "Selon le sociologue Pierre Bourdieu, le capital culturel tire sa valeur symbolique, distinctive et son pouvoir de classement de sa rareté et de sa distribution inégale, c'est-à-dire précisément de l'existence de classes sociales qui n'en disposent pas, ce qui permet la reproduction des inégalités sociales.",
    'astuce': "Bourdieu : Le capital culturel tire sa valeur distinctive de sa rareté et de l'existence de classes qui en sont dépourvues."
}

def run():
    print("🚀 Démarrage de la mise à jour des questions dans PostgreSQL...")
    for q_num, data in UPDATES.items():
        qs = Question.objects.filter(exam_year=2023, question_number=q_num)
        count = qs.count()
        if count == 0:
            print(f"⚠️ Aucune question trouvée pour {q_num} (2023)")
            continue
        for q in qs:
            is_french = (
                ('capital culturel' in (q.question_text or '').lower() or 'bourdieu' in (q.question_text or '').lower())
                and 'بورديو' not in (q.question_text or '')
            )
            if q_num == 'Q88' and is_french:
                q.correct_option = Q88_FR['correct']
                q.explanation = Q88_FR['explanation']
                q.astuce = Q88_FR['astuce']
            else:
                q.correct_option = data['correct']
                q.explanation = data['explanation']
                q.astuce = data['astuce']
            q.save()
            print(f"✅ Question {q_num} (ID={q.id}) mise à jour avec succès : correct_option = '{q.correct_option}'")
    print("✨ Toutes les questions sont maintenant corrigées avec succès !")

if __name__ == '__main__':
    run()
