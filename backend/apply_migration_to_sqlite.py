import sqlite3

def run():
    conn = sqlite3.connect('backend/db.sqlite3')
    cur = conn.cursor()

    # 1. Update SQL/BD questions Q48 to Q53
    cur.execute("""
        UPDATE exams_question
        SET domain_id='DEV', subdomain_id='DEV_SI_BD'
        WHERE exam_year=2022 AND question_number IN ('Q48', 'Q49', 'Q50', 'Q51', 'Q52', 'Q53')
          AND domain_id != 'DIDACTIQUE'
    """)
    print("Updated Q48-Q53 SQL rows:", cur.rowcount)

    # 2. Re-assign Didactique intruder questions to DIDACTIQUE
    cur.execute("""
        UPDATE exams_question
        SET domain_id='DIDACTIQUE', subdomain_id='DID_APPROCHES'
        WHERE exam_year=2022 AND question_text LIKE '%SITUATION 1%'
    """)
    print("Updated Situation 1:", cur.rowcount)

    cur.execute("""
        UPDATE exams_question
        SET domain_id='DIDACTIQUE', subdomain_id='DID_APPROCHES'
        WHERE exam_year=2022 AND (question_text LIKE '%SITUATION 2%' OR question_text LIKE '%SITUATION 3%')
    """)
    print("Updated Situation 2 & 3:", cur.rowcount)

    cur.execute("""
        UPDATE exams_question
        SET domain_id='DIDACTIQUE', subdomain_id='DID_APPROCHES'
        WHERE exam_year=2022 AND (
            question_text LIKE '%Traitement%' OR
            question_text LIKE '%concepts clés qui couvrent la science informatique%' OR
            question_text LIKE '%pratique qui consiste à créer un ensemble détaillé%'
        )
    """)
    print("Updated didactic approach rows:", cur.rowcount)

    cur.execute("""
        UPDATE exams_question
        SET domain_id='DIDACTIQUE', subdomain_id='DID_CURRICULUM'
        WHERE exam_year=2022 AND question_text LIKE '%Module Algorithmique et programmation%'
    """)
    print("Updated curriculum rows:", cur.rowcount)

    # Ensure PKs are set to DIDACTIQUE
    cur.execute("""
        UPDATE exams_question
        SET domain_id='DIDACTIQUE'
        WHERE id IN (1145, 1146, 1154, 1155, 1174, 1177, 1178, 1182, 1971, 1972) AND exam_year=2022
    """)
    print("Updated intruder PKs:", cur.rowcount)

    # 3. Check Q2
    cur.execute("SELECT id FROM exams_question WHERE exam_year=2022 AND question_number='Q2' AND domain_id='SYS_RES'")
    row = cur.fetchone()
    if not row:
        cur.execute("""
            INSERT OR REPLACE INTO exams_question (
                id, source_type, exam_year, question_number, question_text,
                option_a, option_b, option_c, option_d, option_e,
                correct_option, explanation, astuce, domain_id, subdomain_id, course_id, created_at
            ) VALUES (
                426, 'past_exam', 2022, 'Q2',
                'Dans un microprocesseur, un compteur ordinal est un registre qui :',
                'Contient l''adresse mémoire de la première instruction du processus en cours d''exécution',
                'Contient toutes les adresses mémoires des instructions du processus en cours d''exécution',
                'Contient l''adresse mémoire de l''instruction en cours d''exécution ou à exécuter',
                'Contient l''adresse mémoire de l''instruction ayant causé l''interruption du processus en cours',
                NULL, 'C',
                'Le compteur ordinal (Program Counter ou PC) est un registre du microprocesseur qui stocke l''adresse mémoire de la prochaine instruction à exécuter. Il est automatiquement incrémenté après chaque instruction pour pointer vers la suivante.',
                'Le ''compteur ordinal'' est comme un marque-page dans un livre de recettes (le programme) qui indique la prochaine étape (instruction) à suivre.',
                'SYS_RES', 'SYS_ARCHI', 9, datetime('now')
            )
        """)
        print("Inserted Q2 (PK 426)")
    else:
        print("Q2 already exists with ID:", row[0])

    # 4. Check Q78
    cur.execute("SELECT id FROM exams_question WHERE exam_year=2022 AND question_number='Q78' AND domain_id='LOG'")
    row = cur.fetchone()
    if not row:
        cur.execute("""
            INSERT OR REPLACE INTO exams_question (
                id, source_type, exam_year, question_number, question_text,
                option_a, option_b, option_c, option_d, option_e,
                correct_option, explanation, astuce, domain_id, subdomain_id, course_id, created_at
            ) VALUES (
                602, 'past_exam', 2022, 'Q78',
                'Sous Access, un index permet :',
                'D''accélérer la recherche des enregistrements',
                'D''assurer l''intégrité référentielle',
                'D''indiquer le champ unique qui servira à la recherche des enregistrements',
                'D''indiquer que le champ est unique et non nul',
                'Aucune de ces réponses n''est juste',
                'A',
                'Un index sous Microsoft Access (et dans n''importe quel système de gestion de bases de données) est une structure de données qui améliore la vitesse des opérations de recherche et de tri sur une table.\nEn indexant un champ, Access peut trouver des données spécifiques beaucoup plus rapidement, sans avoir à scanner chaque ligne de la table séquentiellement (table scan).\nLa bonne réponse est donc l''**Option A**.',
                'L''indexation accélère les recherches (SELECT) et les tris (ORDER BY), mais peut ralentir légèrement les opérations d''écriture (INSERT, UPDATE, DELETE) car l''index doit être mis à jour.',
                'LOG', 'LOG_OFFICE', 27, datetime('now')
            )
        """)
        print("Inserted Q78 (PK 602)")
    else:
        print("Q78 already exists with ID:", row[0])

    # 5. Delete active unsubmitted sessions for 2022
    cur.execute("DELETE FROM exams_examsession WHERE exam_year=2022 AND exam_submitted=0")
    print("Deleted unsubmitted 2022 sessions:", cur.rowcount)

    conn.commit()

    # 6. Verify total specialite 2022 questions
    cur.execute("""
        SELECT question_number, domain_id, id FROM exams_question
        WHERE exam_year=2022 AND domain_id IN ('DEV', 'SYS_RES', 'LOG')
        ORDER BY id
    """)
    questions = cur.fetchall()
    print("Final specialite 2022 questions count:", len(questions))
    nums = [q[0] for q in questions]
    print("Unique numbers count:", len(set(nums)))
    missing = {f"Q{i}" for i in range(1, 81)} - set(nums)
    print("Missing numbers (should be empty):", missing)

    conn.close()

if __name__ == '__main__':
    run()
