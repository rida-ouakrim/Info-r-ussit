import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
JSON_PATH = BASE_DIR / "initial_data.json"

FIXES = {
    352: {  # Q8
        "question_text": "```alg\nproc1()\n  Entier i, j, L, T[40][40]\n  Afficher(\"Entrer le nombre de lignes ou de colonnes (L=C): \")\n  Lire(L)\n  Pour i <- 0 à L-1\n    Pour j <- 0 à L-1\n      Lire(T[i][j])\n    Fin pour\n  Fin pour\nFin\n```\n\nLa procédure `proc1` permet :"
    },
    353: {  # Q9
        "question_text": "```alg\nf (n :entier)\n  Si n = 0 alors\n    retourner 1\n  Sinon\n    retourner n * f(n-1)\nfin\n```\n\nPour n = 4, la fonction f retourne :"
    },
    357: {  # Q13
        "question_text": "Que retourne la fonction F définie ci-dessous ?\n\n```alg\nFonction F(tab)\n  m <- tab[0]\n  Pour chaque élément x du tableau tab\n    Si x < m Alors\n      m <- x\n  Fin Pour\n  Retourner m\nFin\n```"
    },
    362: {  # Q18
        "question_text": "Quelle ligne du code suivant contient une erreur de syntaxe ?\n\n```c\n1  void f(unsigned int n) {\n2    int i; j = 1;\n3    for (i=1; i<n; i++) {\n4      j = j * i;\n5    }\n6    printf(\"Resultat : %d -> %d\\n\", n, j);\n7  }\n```"
    },
    369: {  # Q25
        "question_text": "Que fait ce code ?\n\n```php\n<?php\n$db = mysql_connect('localhost', 'mabase', 'mot-de-passe');\nmysql_select_db('mabase', $db);\n$req = mysql_query('SELECT * FROM matable');\n$res = mysql_numrows($req);\necho \".$res\";\nmysql_close($db);\n?>\n```"
    }
}

SCHEMA_27_30 = """**Schéma relationnel :**
- `candidat` (**Code_candidat**, Nom, prenom)
- `participe` (**#Code_candidat**, **#Code_concours**)
- `concours` (**Code_concours**, Date)"""

REF_FIXES = {
    371: SCHEMA_27_30,  # Q27
    372: SCHEMA_27_30,  # Q28
    373: SCHEMA_27_30,  # Q29
    374: SCHEMA_27_30,  # Q30
}

def update_json():
    print(f"Reading {JSON_PATH}...")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    for item in data:
        if item.get("model") == "exams.question":
            pk = item.get("pk")
            if pk in FIXES:
                item["fields"]["question_text"] = FIXES[pk]["question_text"]
                updated_count += 1
                print(f"  -> Updated pk={pk} ({item['fields'].get('question_number')}) question_text")
            if pk in REF_FIXES:
                item["fields"]["reference_text"] = REF_FIXES[pk]
                print(f"  -> Updated pk={pk} ({item['fields'].get('question_number')}) reference_text")

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated {updated_count} questions in {JSON_PATH.name}!")

def generate_sql():
    sql_path = BASE_DIR / "update_2023_code_display.sql"
    statements = [
        "-- ==============================================================",
        "-- MISE À JOUR AFFICHAGE CODE CONCOURS SPÉCIALITÉ 2023",
        "-- Corrige Q8, Q9, Q13, Q18, Q25 et texte d'appui Q27-Q30",
        "-- ==============================================================",
        "BEGIN;",
        ""
    ]

    q_num_map = {
        352: 'Q8',
        353: 'Q9',
        357: 'Q13',
        362: 'Q18',
        369: 'Q25',
        371: 'Q27',
        372: 'Q28',
        373: 'Q29',
        374: 'Q30'
    }

    for pk, val in FIXES.items():
        escaped_text = val["question_text"].replace("'", "''")
        q_num = q_num_map.get(pk, f'Q{pk}')
        statements.append(f"-- Correction Question {q_num} (pk={pk})")
        statements.append(f"UPDATE exams_question SET question_text = '{escaped_text}' WHERE id = {pk} OR (exam_year = 2023 AND question_number = '{q_num}' AND source_type = 'past_exam');")
        statements.append("")

    for pk, ref_val in REF_FIXES.items():
        escaped_ref = ref_val.replace("'", "''")
        q_num = q_num_map.get(pk, f'Q{pk}')
        statements.append(f"-- Ajout Document d'appui {q_num} (pk={pk})")
        statements.append(f"UPDATE exams_question SET reference_text = '{escaped_ref}' WHERE id = {pk} OR (exam_year = 2023 AND question_number = '{q_num}' AND source_type = 'past_exam');")
        statements.append("")

    statements.append("COMMIT;")
    statements.append("")

    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("\n".join(statements))

    print(f"Generated SQL script: {sql_path.name}")

if __name__ == "__main__":
    update_json()
    generate_sql()
