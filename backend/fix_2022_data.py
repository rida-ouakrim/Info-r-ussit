import json

def main():
    with open('initial_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Update intruder Didactique questions
    intruders_approches = [1145, 1146, 1971, 1972, 1154, 1155, 1174, 1177, 1178]
    intruders_curriculum = [1182]

    for item in data:
        pk = item.get('pk')
        fields = item.get('fields', {})
        if pk in intruders_approches:
            fields['domain'] = 'DIDACTIQUE'
            fields['subdomain'] = 'DID_APPROCHES'
        elif pk in intruders_curriculum:
            fields['domain'] = 'DIDACTIQUE'
            fields['subdomain'] = 'DID_CURRICULUM'
        elif pk in range(472, 478): # Q48 to Q53 SQL
            fields['domain'] = 'DEV'
            fields['subdomain'] = 'DEV_SI_BD'
        elif pk == 426: # Q2
            fields['option_a'] = "Contient l'adresse mémoire de la première instruction du processus en cours d'exécution"
            fields['option_b'] = "Contient toutes les adresses mémoires des instructions du processus en cours d'exécution"
            fields['option_c'] = "Contient l'adresse mémoire de l'instruction en cours d'exécution ou à exécuter"
            fields['option_d'] = "Contient l'adresse mémoire de l'instruction ayant causé l'interruption du processus en cours"
            fields['explanation'] = "Le compteur ordinal (Program Counter ou PC) est un registre du microprocesseur qui stocke l'adresse mémoire de la prochaine instruction à exécuter. Il est automatiquement incrémenté après chaque instruction pour pointer vers la suivante."
            fields['astuce'] = "Le 'compteur ordinal' est comme un marque-page dans un livre de recettes (le programme) qui indique la prochaine étape (instruction) à suivre."

    # Check if PK 602 exists
    has_602 = any(item.get('pk') == 602 for item in data)
    if not has_602:
        q78_item = {
            'model': 'exams.question',
            'pk': 602,
            'fields': {
                'source_type': 'past_exam',
                'exam_year': 2022,
                'question_number': 'Q78',
                'question_text': 'Sous Access, un index permet :',
                'option_a': "D'accélérer la recherche des enregistrements",
                'option_b': "D'assurer l'intégrité référentielle",
                'option_c': "D'indiquer le champ unique qui servira à la recherche des enregistrements",
                'option_d': "D'indiquer que le champ est unique et non nul",
                'option_e': "Aucune de ces réponses n'est juste",
                'correct_option': 'A',
                'explanation': "Un index sous Microsoft Access (et dans n'importe quel système de gestion de bases de données) est une structure de données qui améliore la vitesse des opérations de recherche et de tri sur une table.\nEn indexant un champ, Access peut trouver des données spécifiques beaucoup plus rapidement, sans avoir à scanner chaque ligne de la table séquentiellement (table scan).\nLa bonne réponse est donc l'**Option A**.",
                'astuce': "L'indexation accélère les recherches (SELECT) et les tris (ORDER BY), mais peut ralentir légèrement les opérations d'écriture (INSERT, UPDATE, DELETE) car l'index doit être mis à jour.",
                'reference_text': None,
                'domain': 'LOG',
                'subdomain': 'LOG_OFFICE',
                'course': 27,
                'created_at': '2026-07-22T10:58:33.301Z'
            }
        }
        data.append(q78_item)

    # Verify count of specialite questions in updated data
    specialite_2022 = [
        item for item in data
        if item.get('model') == 'exams.question'
        and item.get('fields', {}).get('exam_year') == 2022
        and item.get('fields', {}).get('domain') in ['DEV', 'SYS_RES', 'LOG', 'SPECIALITE']
    ]

    print(f'Updated Specialite 2022 count: {len(specialite_2022)}')
    nums = sorted([item['fields']['question_number'] for item in specialite_2022], key=lambda x: (len(x), x))
    print(f'Distinct numbers count: {len(set(nums))}')
    print(f'First 5: {nums[:5]}')
    print(f'Last 5: {nums[-5:]}')
    missing = {f'Q{i}' for i in range(1, 81)} - set(nums)
    print(f'Missing numbers: {missing}')

    if len(specialite_2022) == 80 and not missing:
        with open('initial_data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print('SUCCESS: initial_data.json successfully updated!')
    else:
        print('FAILED verification, file not saved.')

if __name__ == '__main__':
    main()
