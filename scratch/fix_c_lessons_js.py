import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = os.path.join(BASE_DIR, "frontend", "src", "data", "cLessons.js")

RAW_LESSONS = [
    (1, "Caractère de fin de chaîne (\\0)", "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing", "En Langage C, une chaîne de caractères n'est pas un type natif autonome, mais un tableau de caractères (`char[]`) qui se termine obligatoirement par le caractère spécial NUL : `'\\0'` (code ASCII 0).\n\nLe marqueur `'\\0'` indique aux fonctions d'affichage et de manipulation (`printf`, `strlen`, `strcpy`) où s'arrête la chaîne en mémoire.", "```c\n#include <stdio.h>\n\nint longueurChaine(char str[]) {\n    int i = 0;\n    while (str[i] != '\\0') {\n        i++;\n    }\n    return i;\n}\n\nint main() {\n    char test[] = \"Informatique\";\n    printf(\"Longueur = %d\\n\", longueurChaine(test));\n    return 0;\n}\n```", "⚡ **Piège Concours CRMEF :** N'oubliez pas d'allouer 1 octet supplémentaire pour le `\\0` lors de la déclaration d'un tableau de caractères !"),
    (2, "Les opérateurs arithmétiques (+, -, *, /, %)", "https://drive.google.com/file/d/1bWftn086PRxJBuS48bYMP74kgPVU54D2/view?usp=sharing", "Opérateurs : `+`, `-`, `*`, `/`, `%` (Modulo).\n\nAttention : `7 / 2` vaut 3 (division entière entre entiers). Pour obtenir 3.5, écrire `7.0 / 2`.", "```c\n#include <stdio.h>\n\nint main() {\n    int n = 15;\n    if (n % 2 == 0) printf(\"%d est Pair\\n\", n);\n    else printf(\"%d est Impair\\n\", n);\n    return 0;\n}\n```", "⚡ Le modulo `%` ne s'applique que sur les entiers !"),
    (3, "Opérateurs d'assignation (=, +=, -=, *=)", "https://drive.google.com/file/d/1aCroqgQJVwT6boOhoX4lGVKLvf5KJpjo/view?usp=sharing", "Assignations combinées : `x += 3` équivaut à `x = x + 3`.", "```c\nint x = 10;\nx += 5; // 15\n```", "⚡ Évaluation de droite à gauche."),
    (4, "Opérateur conditionnel ternaire (?:)", "https://drive.google.com/file/d/1ocqu_6J9740PhWXwwwm4AaR9nvgkCJxN/view?usp=sharing", "Syntaxe : `(condition) ? valeur_si_vrai : valeur_si_faux;`", "```c\nint min = (a < b) ? a : b;\n```", "⚡ Retourne une valeur directe."),
    (5, "Opérateurs de comparaison (==, !=, <, >)", "https://drive.google.com/file/d/1NQovbWgSkKBnpn02rpG79xp_9EyhHKui/view?usp=sharing", "Renvoie `1` si VRAI et `0` si FAUX.", "```c\nif (x == 5) { /* ... */ }\n```", "⚡ Ne pas confondre `=` (affectation) et `==` (test de comparaison) !"),
    (6, "Opérateurs logiques (&&, ||, !)", "https://drive.google.com/file/d/1i_kV0YtUuVNHuTA8Ys04rD4s_abaoib5/view?usp=sharing", "ET (`&&`), OU (`||`), NON (`!`). Évaluation court-circuit.", "```c\nif (x != 0 && (10 / x > 2)) { /* ... */ }\n```", "⚡ Évite les divisions par zéro grâce au court-circuit."),
    (7, "Opérateurs d'incrémentation (x++ et ++x)", "https://drive.google.com/file/d/1T1KH8LRC_70yP9dz-PwlF3zg_hoyCkHp/view?usp=sharing", "`x++` (post-incrémentation) vs `++x` (pré-incrémentation).", "```c\nint a = 5;\nint res = a++; // res = 5, a = 6\n```", "⚡ Attention à la priorité d'incrémentation."),
    (8, "Saisie utilisateur avec scanf()", "https://drive.google.com/file/d/1YyegJp4Ny4j2aIxRgG9jBD99ov4ttuyg/view?usp=sharing", "Syntaxe : `scanf(\"%d\", &var);`", "```c\nint age;\nscanf(\"%d\", &age);\n```", "⚡ Esperluette `&` obligatoire pour les variables !"),
    (9, "Choix multiple avec Switch()", "https://drive.google.com/file/d/1ct98571qoTDf8wNQlOMhLjq6nil4sujB/view?usp=sharing", "Test de valeurs discrètes entières ou char.", "```c\nswitch(choix) {\n    case 1: printf(\"Un\\n\"); break;\n}\n```", "⚡ `break` est obligatoire pour éviter le fall-through."),
    (10, "Structure conditionnelle if", "https://drive.google.com/file/d/1Dv8FemMpvYRF7PwQ0tYi3OUMpa5RvWu8/view?usp=sharing", "Condition simple `if (cond) { ... }`", "```c\nif (note >= 10) printf(\"Validé\\n\");\n```", "⚡ En C, 0 = Faux, Tout le reste = Vrai."),
    (11, "Structure conditionnelle if...else if...else", "https://drive.google.com/file/d/1fndp30xztb4jCGlH7Nit7YaDSyLwn1nE/view?usp=sharing", "Conditions multiples successives.", "```c\nif (x > 0) p(); else if (x < 0) n(); else z();\n```", "⚡ Seule la première condition vraie s'exécute."),
    (12, "Boucle itérative while", "https://drive.google.com/file/d/1_ivpBDZbZpQT5RSp4O31b2S3i5CZsxmU/view?usp=sharing", "Boucle à pré-condition.", "```c\nwhile (i < 10) { i++; }\n```", "⚡ Peut s'exécuter 0 fois."),
    (13, "Arrêt inconditionnel (break et continue)", "https://drive.google.com/file/d/1tOmtZjuxt0Ztb6PCD9qgMobCD5AjTwFE/view?usp=sharing", "`break` stoppe la boucle, `continue` saute à l'itération suivante.", "```c\nif (i == 5) break;\n```", "⚡ Pratique pour les sorties anticipées."),
    (14, "Saut conditionnel (goto)", "https://drive.google.com/file/d/1D0c5gopO0Xv9HQUP2fJh9LeBsUBVwTA5/view?usp=sharing", "Saut vers une étiquette `goto label;`", "```c\ngoto fin;\nfin: return 0;\n```", "⚡ Déconseillé en programmation propre."),
    (15, "Tableaux à une dimension (1D Arrays)", "https://drive.google.com/file/d/1P7DoImgFR4dMZYcDQRdrwav4B66QWSJS/view?usp=sharing", "Tableaux d'éléments contigus en mémoire.", "```c\nint tab[5] = {1, 2, 3, 4, 5};\n```", "⚡ Indices de 0 à N-1."),
    (16, "Tableaux à plusieurs dimensions (Matrices 2D)", "https://drive.google.com/file/d/1fv07kzrgM53DA34EghPdE1yq37XjpuiY/view?usp=sharing", "Matrices 2D `int mat[3][3];`", "```c\nint mat[2][2] = {{1,2},{3,4}};\n```", "⚡ Stockage ligne par ligne."),
    (17, "Boucle itérative For", "https://drive.google.com/file/d/1y6h2s4-sHxlBGyjY1aoiK8SSdYvpc8nH/view?usp=sharing", "Boucle à compteur `for(init; cond; step)`", "```c\nfor(int i=0; i<10; i++) printf(\"%d\\n\", i);\n```", "⚡ Compteur contrôlé."),
    (18, "Introduction aux fonctions en C", "https://drive.google.com/file/d/1ll2-7jCdBvMAYYweGFV6L6CGBeuPRIjI/view?usp=sharing", "Blocs de code réutilisables.", "```c\nvoid saluer() { printf(\"Hello\\n\"); }\n```", "⚡ Déclarer le prototype au début."),
    (19, "Fonctions avec un argument", "https://drive.google.com/file/d/1t0dsFTVKHDGr2JpIkAMiGsXGvoxnVbSY/view?usp=sharing", "Passage par valeur (copie).", "```c\nint carre(int x) { return x*x; }\n```", "⚡ L'original n'est pas modifié."),
    (20, "Fonctions avec plusieurs arguments et types", "https://drive.google.com/file/d/1sJnqxjo3loh74hmFHg4-Au4km81TcHkD/view?usp=sharing", "Fonctions multi-paramètres.", "```c\nfloat moyenne(float a, float b) { return (a+b)/2; }\n```", "⚡ Ordre des paramètres strict."),
    (21, "Instruction return dans les fonctions", "https://drive.google.com/file/d/1tkNRVOeQes_6nb16a6za_o019yE3Q3F1/view?usp=sharing", "Retour de valeur avec `return`.", "```c\nreturn 0;\n```", "⚡ Quitte immédiatement la fonction."),
    (22, "Appeler une fonction depuis une autre", "https://drive.google.com/file/d/1K2pSKBEHYE5V6dGUe6WxvYyKN31Em5u2/view?usp=sharing", "Appels de fonctions imbriqués.", "```c\nvoid f2() { f1(); }\n```", "⚡ La pile d'appels gère les contextes."),
    (23, "Conversion de types (Typecasting)", "https://drive.google.com/file/d/1GYqV_KKnnxpVrrpGDEcFXPClNQknxolT/view?usp=sharing", "Conversion explicite `(float)a`", "```c\nfloat res = (float)7 / 2;\n```", "⚡ Évite la division entière tronquée."),
    (24, "Introduction aux pointeurs et adresses (&)", "https://drive.google.com/file/d/1rLmbhSTkHd33Mkx1paes53iUKVqEubTV/view?usp=sharing", "Opérateur d'adresse `&var`.", "```c\nint x = 10;\nprintf(\"%p\", &x);\n```", "⚡ Renvoie l'emplacement mémoire RAM."),
    (25, "Déclaration et utilisation des pointeurs (*)", "https://drive.google.com/file/d/1zs2aRRCT0Q3o4cx1QshnWh6MBO0LnhHo/view?usp=sharing", "Pointeur `int *p = &x;` et déférencement `*p`.", "```c\nint x = 5;\nint *p = &x;\n*p = 10; // x devient 10\n```", "⚡ `*p` permet d'accéder à la valeur pointée."),
    (26, "Spécificateurs de format et pointeurs (%p)", "https://drive.google.com/file/d/1aj3KAY-ISZK-xY9iipxkSdObwYW_CVbB/view?usp=sharing", "Affichage formaté d'adresse mémoire avec `%p`.", "```c\nprintf(\"Adresse : %p\\n\", p);\n```", "⚡ Hexadécimal."),
    (27, "Incrémentation et décrémentation des pointeurs", "https://drive.google.com/file/d/1LxIdkU541_A47h05S7kgAb1TSOoKpp03/view?usp=sharing", "Arithmétique des pointeurs `p++`.", "```c\np++; // Avance de sizeof(type) octets\n```", "⚡ Avance selon la taille du type pointé."),
    (28, "Taille de mémoire avec sizeof()", "https://drive.google.com/file/d/1H3rDkRgB1I193xnEZMu77vzcJ64K-FAp/view?usp=sharing", "Taille d'un type ou d'une variable en octets `sizeof(int)`.", "```c\nsize_t sz = sizeof(double);\n```", "⚡ Opérateur évalué à la compilation."),
    (29, "Relation entre pointeurs et tableaux", "https://drive.google.com/file/d/1coDVemjVL9QsLllE3qN7mgu808zHDVMu/view?usp=sharing", "Équivalence `*(T + i)` et `T[i]`.", "```c\nint T[3] = {1, 2, 3};\nprintf(\"%d\\n\", *(T + 1)); // 2\n```", "⚡ Le nom d'un tableau est un pointeur constant vers &T[0]."),
    (30, "Introduction à l'allocation dynamique de mémoire", "https://drive.google.com/file/d/1d-KIyr8Lm2hmHHY0ZAQFLjXGrOMcqFTg/view?usp=sharing", "Gestion de la mémoire dans le Tas (Heap).", "```c\nint *p = malloc(sizeof(int));\n```", "⚡ Permet de réserver la mémoire pendant l'exécution."),
    (31, "Allocation et Libération avec malloc() et free()", "https://drive.google.com/file/d/1j9IvCelN3ZpPvEi_4UfLcsrck_A3lDuu/view?usp=sharing", "`malloc()` pour allouer et `free()` pour libérer.", "```c\nint *t = malloc(10 * sizeof(int));\nfree(t); // Libération obligatoire\n```", "⚡ Évite les fuites mémoire."),
    (32, "Introduction à realloc() et calloc()", "https://drive.google.com/file/d/1bYP7YwwedbFXCF7KOCpwvr-wAKOkIINo/view?usp=sharing", "`calloc()` alloue et initialise à 0.", "```c\nint *t = calloc(5, sizeof(int));\n```", "⚡ Les octets sont mis à zéro."),
    (33, "Pratique de realloc() et calloc()", "https://drive.google.com/file/d/1zNKsxotHT05IG9TT8z3hKS2ixY4xW8_U/view?usp=sharing", "Redimensionnement d'un bloc avec `realloc()`.", "```c\nt = realloc(t, 20 * sizeof(int));\n```", "⚡ Conserve les anciennes données."),
    (34, "Structures de données (struct)", "https://drive.google.com/file/d/1WmdkSVLm77-IxpUf-o1-O89kyY2X181g/view?usp=sharing", "Déclaration de types complexes `struct Etudiant`.", "```c\nstruct Personne { char nom[20]; int age; };\n```", "⚡ Regroupe des types différents."),
    (35, "Structures imbriquées (Nested structures)", "https://drive.google.com/file/d/10OsfOvMH4QEVQzH_XZHzHNvCfUPUOO1G/view?usp=sharing", "Structures contenant une autre structure.", "```c\nstruct Etudiant { struct Date naissance; };\n```", "⚡ Accès point par point."),
    (36, "Tableaux de structures", "https://drive.google.com/file/d/1R9X_orGCJkHNgvMja5i3OGrMBjVstoaR/view?usp=sharing", "Tableau d'objets `struct Personne groupe[50];`", "```c\ngroupe[0].age = 20;\n```", "⚡ Gestion de collections."),
    (37, "Alias de type avec typedef", "https://drive.google.com/file/d/1dSWvy64guEpxdQ45JF48Co3mGaudItZp/view?usp=sharing", "Création d'un pseudonyme `typedef struct ... Personne;`", "```c\ntypedef unsigned long ulong;\n```", "⚡ Rendu du code plus lisible."),
    (38, "Structures de données et pointeurs (->)", "https://drive.google.com/file/d/1FS3J2Fhlz1NsQuXcMDSRKB6uk50XbRWv/view?usp=sharing", "Accès via pointeur avec la flèche `ptr->champ`.", "```c\nstruct Personne *p = &p1;\nprintf(\"%s\\n\", p->nom);\n```", "⚡ Raccourci pour `(*p).champ`."),
    (39, "Introduction aux Listes Chaînées", "https://drive.google.com/file/d/1HiVOm7WNhM8imjkWa0XsHYHSJCSn4SQC/view?usp=sharing", "Structure dynamique par nœuds reliés par des pointeurs `next`.", "```c\ntypedef struct Node { int data; struct Node *next; } Node;\n```", "⚡ Allocation dynamique nœud par nœud."),
    (40, "Comparatif Listes Chaînées vs Tableaux (Arrays)", "https://drive.google.com/file/d/16O0ZJpMErOp4WWJ4pihUY3x3QJ4GhOOT/view?usp=sharing", "Tableau : Accès $O(1)$, taille fixe. Liste : Insertion $O(1)$, taille dynamique.", "```c\n// Avantages et inconvénients\n```", "⚡ Préférer les listes pour des insertions fréquentes."),
    (41, "Unions en C (union)", "https://drive.google.com/file/d/1QhI8vSIiA7GMctwcSvhFEkM9qXijwy60/view?usp=sharing", "Dans une `union`, tous les membres partagent la même adresse mémoire.", "```c\nunion Donnee { int i; float f; };\n```", "⚡ Économie de mémoire RAM."),
    (42, "Pratique des Unions en C", "https://drive.google.com/file/d/1CrNM4eNGtH2LUKP57WezfFaB6XeJGFtA/view?usp=sharing", "Utilisation d'unions pour le décodage binaire.", "```c\nunion Donnee d; d.i = 42;\n```", "⚡ Un seul membre actif à la fois."),
    (43, "Introduction aux Fichiers (File pointers)", "https://drive.google.com/file/d/1hXZ35lSPhgy842ODFq-qgPcXVrfBLyBr/view?usp=sharing", "Pointeur de fichier `FILE *f = fopen(\"test.txt\", \"r\");`", "```c\nFILE *f = fopen(\"data.txt\", \"r\");\nif (f != NULL) fclose(f);\n```", "⚡ Vérifier la valeur NULL."),
    (44, "Fichiers : Créer et Écrire (fopen, fprintf)", "https://drive.google.com/file/d/19XU-byEYF5OPDQDwGKQ8JkCerQ8dCsTD/view?usp=sharing", "Mode `\"w\"` et fonction `fprintf()`.", "```c\nfprintf(f, \"Score : %d\\n\", score);\n```", "⚡ Écrase le fichier existant."),
    (45, "Fichiers : Lecture de données (fscanf, fgetc)", "https://drive.google.com/file/d/11qv9EcFSZ4OrU3Z078StRlWqKXVfMyyP/view?usp=sharing", "Lecture avec `fscanf()` et `fgetc()`.", "```c\nfscanf(f, \"%d\", &val);\n```", "⚡ Se termine à EOF."),
    (46, "Fichiers : Mode Ajout (Append)", "https://drive.google.com/file/d/1DZ8szSNoGv3jbnlGRACN_imPt-0ts5ER/view?usp=sharing", "Mode `\"a\"` pour écrire à la fin sans écraser.", "```c\nFILE *f = fopen(\"log.txt\", \"a\");\n```", "⚡ Ajout à la fin."),
    (47, "Fichiers : Manipulation avec fputs et fgets", "https://drive.google.com/file/d/1oETO6276mUuQmjwoLQB5LfKWvc_wLTd9/view?usp=sharing", "Lecture et écriture ligne par ligne.", "```c\nchar ligne[100];\nfgets(ligne, 100, f);\n```", "⚡ Évite les débordements de mémoire tampon."),
    (48, "Fichiers : Positionnement avec fseek et ftell", "https://drive.google.com/file/d/1XSuqEJFwgG4Nlv7th_ICL2-5dVHF0Nv3/view?usp=sharing", "Positionnement dynamique avec `fseek()` et mesure avec `ftell()`.", "```c\nfseek(f, 0, SEEK_END);\nlong sz = ftell(f);\n```", "⚡ Mesure exacte du fichier."),
    (49, "Fichiers En-tête (Header files .h)", "https://drive.google.com/file/d/1NkTHJLlIJIJFvy0BGI7BIHO5zkPJIiyi/view?usp=sharing", "Séparation des prototypes dans un fichier `.h`.", "```c\n#include \"mes_fonctions.h\"\n```", "⚡ Modularité du projet."),
    (50, "Organisation et Modularité des Headers", "https://drive.google.com/file/d/1KPdg7aeFAfUfvajLRmSfTCXaK0beRRq8/view?usp=sharing", "Protection contre les inclusions multiples avec `#ifndef`.", "```c\n#ifndef MON_HEADER_H\n#define MON_HEADER_H\n// Prototypes\n#endif\n```", "⚡ Évite la redéclaration de symboles.")
]

import json

items = []
for num, title, url, content, examples, astuces in RAW_LESSONS:
    items.append({
        "num": num,
        "title": title,
        "video_url": url,
        "content": content,
        "examples": examples,
        "astuces": astuces
    })

js_content = f"export const cLessons = {json.dumps(items, ensure_ascii=False, indent=2)};\n"

with open(TARGET, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully generated clean valid JS file: {TARGET}")
