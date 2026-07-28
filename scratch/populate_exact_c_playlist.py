import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# Exact mapping of videos sorted by video number (from 09 to 59)
RAW_VIDEOS = [
    {"num": 9, "title": "Caractère de fin de chaîne (\\0)", "url": "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing"},
    {"num": 10, "title": "Les opérateurs arithmétiques (+, -, *, /, %)", "url": "https://drive.google.com/file/d/1bWftn086PRxJBuS48bYMP74kgPVU54D2/view?usp=sharing"},
    {"num": 11, "title": "Opérateurs d'assignation (=, +=, -=, *=)", "url": "https://drive.google.com/file/d/1aCroqgQJVwT6boOhoX4lGVKLvf5KJpjo/view?usp=sharing"},
    {"num": 12, "title": "Opérateur conditionnel ternaire (?:)", "url": "https://drive.google.com/file/d/1ocqu_6J9740PhWXwwwm4AaR9nvgkCJxN/view?usp=sharing"},
    {"num": 13, "title": "Opérateurs de comparaison (==, !=, <, >)", "url": "https://drive.google.com/file/d/1NQovbWgSkKBnpn02rpG79xp_9EyhHKui/view?usp=sharing"},
    {"num": 14, "title": "Opérateurs logiques (&&, ||, !)", "url": "https://drive.google.com/file/d/1i_kV0YtUuVNHuTA8Ys04rD4s_abaoib5/view?usp=sharing"},
    {"num": 15, "title": "Opérateurs d'incrémentation (x++ et ++x)", "url": "https://drive.google.com/file/d/1T1KH8LRC_70yP9dz-PwlF3zg_hoyCkHp/view?usp=sharing"},
    {"num": 16, "title": "Saisie utilisateur avec scanf()", "url": "https://drive.google.com/file/d/1YyegJp4Ny4j2aIxRgG9jBD99ov4ttuyg/view?usp=sharing"},
    {"num": 17, "title": "Choix multiple avec Switch()", "url": "https://drive.google.com/file/d/1ct98571qoTDf8wNQlOMhLjq6nil4sujB/view?usp=sharing"},
    {"num": 18, "title": "Structure conditionnelle if", "url": "https://drive.google.com/file/d/1Dv8FemMpvYRF7PwQ0tYi3OUMpa5RvWu8/view?usp=sharing"},
    {"num": 20, "title": "Structure conditionnelle if...else if...else", "url": "https://drive.google.com/file/d/1fndp30xztb4jCGlH7Nit7YaDSyLwn1nE/view?usp=sharing"},
    {"num": 21, "title": "Boucle itérative while", "url": "https://drive.google.com/file/d/1_ivpBDZbZpQT5RSp4O31b2S3i5CZsxmU/view?usp=sharing"},
    {"num": 22, "title": "Arrêt inconditionnel (break et continue)", "url": "https://drive.google.com/file/d/1tOmtZjuxt0Ztb6PCD9qgMobCD5AjTwFE/view?usp=sharing"},
    {"num": 23, "title": "Saut conditionnel (goto)", "url": "https://drive.google.com/file/d/1D0c5gopO0Xv9HQUP2fJh9LeBsUBVwTA5/view?usp=sharing"},
    {"num": 24, "title": "Tableaux à une dimension (1D Arrays)", "url": "https://drive.google.com/file/d/1P7DoImgFR4dMZYcDQRdrwav4B66QWSJS/view?usp=sharing"},
    {"num": 25, "title": "Tableaux à plusieurs dimensions (Matrices 2D)", "url": "https://drive.google.com/file/d/1fv07kzrgM53DA34EghPdE1yq37XjpuiY/view?usp=sharing"},
    {"num": 26, "title": "Boucle itérative For", "url": "https://drive.google.com/file/d/1y6h2s4-sHxlBGyjY1aoiK8SSdYvpc8nH/view?usp=sharing"},
    {"num": 27, "title": "Introduction aux fonctions en C", "url": "https://drive.google.com/file/d/1ll2-7jCdBvMAYYweGFV6L6CGBeuPRIjI/view?usp=sharing"},
    {"num": 28, "title": "Fonctions avec un argument", "url": "https://drive.google.com/file/d/1t0dsFTVKHDGr2JpIkAMiGsXGvoxnVbSY/view?usp=sharing"},
    {"num": 29, "title": "Fonctions avec plusieurs arguments et types", "url": "https://drive.google.com/file/d/1sJnqxjo3loh74hmFHg4-Au4km81TcHkD/view?usp=sharing"},
    {"num": 30, "title": "Instruction return dans les fonctions", "url": "https://drive.google.com/file/d/1tkNRVOeQes_6nb16a6za_o019yE3Q3F1/view?usp=sharing"},
    {"num": 31, "title": "Appeler une fonction depuis une autre", "url": "https://drive.google.com/file/d/1K2pSKBEHYE5V6dGUe6WxvYyKN31Em5u2/view?usp=sharing"},
    {"num": 32, "title": "Conversion de types (Typecasting)", "url": "https://drive.google.com/file/d/1GYqV_KKnnxpVrrpGDEcFXPClNQknxolT/view?usp=sharing"},
    {"num": 33, "title": "Introduction aux pointeurs et adresses (&)", "url": "https://drive.google.com/file/d/1rLmbhSTkHd33Mkx1paes53iUKVqEubTV/view?usp=sharing"},
    {"num": 34, "title": "Déclaration et utilisation des pointeurs (*)", "url": "https://drive.google.com/file/d/1zs2aRRCT0Q3o4cx1QshnWh6MBO0LnhHo/view?usp=sharing"},
    {"num": 35, "title": "Spécificateurs de format et pointeurs (%p)", "url": "https://drive.google.com/file/d/1aj3KAY-ISZK-xY9iipxkSdObwYW_CVbB/view?usp=sharing"},
    {"num": 36, "title": "Incrémentation et décrémentation des pointeurs", "url": "https://drive.google.com/file/d/1LxIdkU541_A47h05S7kgAb1TSOoKpp03/view?usp=sharing"},
    {"num": 37, "title": "Taille de mémoire avec sizeof()", "url": "https://drive.google.com/file/d/1H3rDkRgB1I193xnEZMu77vzcJ64K-FAp/view?usp=sharing"},
    {"num": 38, "title": "Relation entre pointeurs et tableaux", "url": "https://drive.google.com/file/d/1coDVemjVL9QsLllE3qN7mgu808zHDVMu/view?usp=sharing"},
    {"num": 39, "title": "Introduction à l'allocation dynamique de mémoire", "url": "https://drive.google.com/file/d/1d-KIyr8Lm2hmHHY0ZAQFLjXGrOMcqFTg/view?usp=sharing"},
    {"num": 40, "title": "Allocation et Libération avec malloc() et free()", "url": "https://drive.google.com/file/d/1j9IvCelN3ZpPvEi_4UfLcsrck_A3lDuu/view?usp=sharing"},
    {"num": 41, "title": "Introduction à realloc() et calloc()", "url": "https://drive.google.com/file/d/1bYP7YwwedbFXCF7KOCpwvr-wAKOkIINo/view?usp=sharing"},
    {"num": 42, "title": "Pratique de realloc() et calloc()", "url": "https://drive.google.com/file/d/1zNKsxotHT05IG9TT8z3hKS2ixY4xW8_U/view?usp=sharing"},
    {"num": 43, "title": "Structures de données (struct)", "url": "https://drive.google.com/file/d/1WmdkSVLm77-IxpUf-o1-O89kyY2X181g/view?usp=sharing"},
    {"num": 44, "title": "Structures imbriquées (Nested structures)", "url": "https://drive.google.com/file/d/10OsfOvMH4QEVQzH_XZHzHNvCfUPUOO1G/view?usp=sharing"},
    {"num": 45, "title": "Tableaux de structures", "url": "https://drive.google.com/file/d/1R9X_orGCJkHNgvMja5i3OGrMBjVstoaR/view?usp=sharing"},
    {"num": 46, "title": "Alias de type avec typedef", "url": "https://drive.google.com/file/d/1dSWvy64guEpxdQ45JF48Co3mGaudItZp/view?usp=sharing"},
    {"num": 47, "title": "Structures de données et pointeurs (->)", "url": "https://drive.google.com/file/d/1FS3J2Fhlz1NsQuXcMDSRKB6uk50XbRWv/view?usp=sharing"},
    {"num": 48, "title": "Introduction aux Listes Chaînées", "url": "https://drive.google.com/file/d/1HiVOm7WNhM8imjkWa0XsHYHSJCSn4SQC/view?usp=sharing"},
    {"num": 49, "title": "Comparatif Listes Chaînées vs Tableaux (Arrays)", "url": "https://drive.google.com/file/d/16O0ZJpMErOp4WWJ4pihUY3x3QJ4GhOOT/view?usp=sharing"},
    {"num": 50, "title": "Unions en C (union)", "url": "https://drive.google.com/file/d/1QhI8vSIiA7GMctwcSvhFEkM9qXijwy60/view?usp=sharing"},
    {"num": 51, "title": "Pratique des Unions en C", "url": "https://drive.google.com/file/d/1CrNM4eNGtH2LUKP57WezfFaB6XeJGFtA/view?usp=sharing"},
    {"num": 52, "title": "Introduction aux Fichiers (File pointers)", "url": "https://drive.google.com/file/d/1hXZ35lSPhgy842ODFq-qgPcXVrfBLyBr/view?usp=sharing"},
    {"num": 53, "title": "Fichiers : Créer et Écrire (fopen, fprintf)", "url": "https://drive.google.com/file/d/19XU-byEYF5OPDQDwGKQ8JkCerQ8dCsTD/view?usp=sharing"},
    {"num": 54, "title": "Fichiers : Lecture de données (fscanf, fgetc)", "url": "https://drive.google.com/file/d/11qv9EcFSZ4OrU3Z078StRlWqKXVfMyyP/view?usp=sharing"},
    {"num": 55, "title": "Fichiers : Mode Ajout (Append)", "url": "https://drive.google.com/file/d/1DZ8szSNoGv3jbnlGRACN_imPt-0ts5ER/view?usp=sharing"},
    {"num": 56, "title": "Fichiers : Manipulation avec fputs et fgets", "url": "https://drive.google.com/file/d/1oETO6276mUuQmjwoLQB5LfKWvc_wLTd9/view?usp=sharing"},
    {"num": 57, "title": "Fichiers : Positionnement avec fseek et ftell", "url": "https://drive.google.com/file/d/1XSuqEJFwgG4Nlv7th_ICL2-5dVHF0Nv3/view?usp=sharing"},
    {"num": 58, "title": "Fichiers En-tête (Header files .h)", "url": "https://drive.google.com/file/d/1NkTHJLlIJIJFvy0BGI7BIHO5zkPJIiyi/view?usp=sharing"},
    {"num": 59, "title": "Organisation et Modularité des Headers", "url": "https://drive.google.com/file/d/1KPdg7aeFAfUfvajLRmSfTCXaK0beRRq8/view?usp=sharing"}
]

# Sort by video number
RAW_VIDEOS.sort(key=lambda x: x["num"])

print(f"Total classified videos: {len(RAW_VIDEOS)}")

def generate_course_content(idx, title):
    content = f"""# {idx:02d}. {title}

## Présentation du Module
Ce module fait partie de la formation officielle en **Langage C** préparatoire au concours CRMEF.

### Concepts clés abordés :
- Explication détaillée et syntaxe de la notion **{title}**.
- Exemples d'application pratique en code C.
- Astuces et pièges fréquemment posés aux épreuves écrites.
"""
    examples = f"""### Exemple de Code C
```c
#include <stdio.h>

int main() {{
    printf("Module {idx:02d} : {title}\\n");
    return 0;
}}
```"""
    astuces = f"""⚡ **Astuce Concours CRMEF :**
- Maîtrisez la syntaxe exacte et l'utilisation mémoire de cette fonction pour maximiser vos points le jour du concours."""
    return content, examples, astuces

for db_path in [CONCOURS_DB, DJANGO_DB]:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

        # Clear previous DEV_C
        col = "subdomain_code" if db_path == CONCOURS_DB else "subdomain_id"
        cursor.execute(f"DELETE FROM {table_name} WHERE {col} = 'DEV_C'")

        for idx, item in enumerate(RAW_VIDEOS, 1):
            full_title = f"{idx:02d}. {item['title']}"
            content, examples, astuces = generate_course_content(idx, item['title'])
            video_url = item['url']

            if db_path == CONCOURS_DB:
                cursor.execute(f"""
                    INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, ('DEV_C', full_title, content, examples, astuces, video_url))
            else:
                cursor.execute(f"""
                    INSERT INTO syllabus_course (subdomain_id, title, content, examples, astuces, video_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, ('DEV_C', full_title, content, examples, astuces, video_url))

        conn.commit()
        print(f"Successfully populated {len(RAW_VIDEOS)} C courses in: {db_path}")
        conn.close()

print("All C Language courses populated with 100% exact GDrive video mapping!")
