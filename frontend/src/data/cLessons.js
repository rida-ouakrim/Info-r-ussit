export const cLessons = [
  {
    "num": 1,
    "title": "Caractère de fin de chaîne (\\0)",
    "video_url": "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing",
    "content": "En Langage C, une chaîne de caractères n'est pas un type natif autonome, mais un tableau de caractères (`char[]`) qui se termine obligatoirement par le caractère spécial NUL : `'\\0'` (code ASCII 0).\n\nLe marqueur `'\\0'` indique aux fonctions d'affichage et de manipulation (`printf`, `strlen`, `strcpy`) où s'arrête la chaîne en mémoire.",
    "examples": "```c\n#include <stdio.h>\n\nint longueurChaine(char str[]) {\n    int i = 0;\n    while (str[i] != '\\0') {\n        i++;\n    }\n    return i;\n}\n\nint main() {\n    char test[] = \"Informatique\";\n    printf(\"Longueur = %d\\n\", longueurChaine(test));\n    return 0;\n}\n```",
    "astuces": "⚡ **Piège Concours CRMEF :** N'oubliez pas d'allouer 1 octet supplémentaire pour le `\\0` lors de la déclaration d'un tableau de caractères !"
  },
  {
    "num": 2,
    "title": "Les opérateurs arithmétiques (+, -, *, /, %)",
    "video_url": "https://drive.google.com/file/d/1bWftn086PRxJBuS48bYMP74kgPVU54D2/view?usp=sharing",
    "content": "Opérateurs : `+`, `-`, `*`, `/`, `%` (Modulo).\n\nAttention : `7 / 2` vaut 3 (division entière entre entiers). Pour obtenir 3.5, écrire `7.0 / 2`.",
    "examples": "```c\n#include <stdio.h>\n\nint main() {\n    int n = 15;\n    if (n % 2 == 0) printf(\"%d est Pair\\n\", n);\n    else printf(\"%d est Impair\\n\", n);\n    return 0;\n}\n```",
    "astuces": "⚡ Le modulo `%` ne s'applique que sur les entiers !"
  },
  {
    "num": 3,
    "title": "Opérateurs d'assignation (=, +=, -=, *=)",
    "video_url": "https://drive.google.com/file/d/1aCroqgQJVwT6boOhoX4lGVKLvf5KJpjo/view?usp=sharing",
    "content": "Assignations combinées : `x += 3` équivaut à `x = x + 3`.",
    "examples": "```c\nint x = 10;\nx += 5; // 15\n```",
    "astuces": "⚡ Évaluation de droite à gauche."
  },
  {
    "num": 4,
    "title": "Opérateur conditionnel ternaire (?:)",
    "video_url": "https://drive.google.com/file/d/1ocqu_6J9740PhWXwwwm4AaR9nvgkCJxN/view?usp=sharing",
    "content": "Syntaxe : `(condition) ? valeur_si_vrai : valeur_si_faux;`",
    "examples": "```c\nint min = (a < b) ? a : b;\n```",
    "astuces": "⚡ Retourne une valeur directe."
  },
  {
    "num": 5,
    "title": "Opérateurs de comparaison (==, !=, <, >)",
    "video_url": "https://drive.google.com/file/d/1NQovbWgSkKBnpn02rpG79xp_9EyhHKui/view?usp=sharing",
    "content": "Renvoie `1` si VRAI et `0` si FAUX.",
    "examples": "```c\nif (x == 5) { /* ... */ }\n```",
    "astuces": "⚡ Ne pas confondre `=` (affectation) et `==` (test de comparaison) !"
  },
  {
    "num": 6,
    "title": "Opérateurs logiques (&&, ||, !)",
    "video_url": "https://drive.google.com/file/d/1i_kV0YtUuVNHuTA8Ys04rD4s_abaoib5/view?usp=sharing",
    "content": "ET (`&&`), OU (`||`), NON (`!`). Évaluation court-circuit.",
    "examples": "```c\nif (x != 0 && (10 / x > 2)) { /* ... */ }\n```",
    "astuces": "⚡ Évite les divisions par zéro grâce au court-circuit."
  },
  {
    "num": 7,
    "title": "Opérateurs d'incrémentation (x++ et ++x)",
    "video_url": "https://drive.google.com/file/d/1T1KH8LRC_70yP9dz-PwlF3zg_hoyCkHp/view?usp=sharing",
    "content": "`x++` (post-incrémentation) vs `++x` (pré-incrémentation).",
    "examples": "```c\nint a = 5;\nint res = a++; // res = 5, a = 6\n```",
    "astuces": "⚡ Attention à la priorité d'incrémentation."
  },
  {
    "num": 8,
    "title": "Saisie utilisateur avec scanf()",
    "video_url": "https://drive.google.com/file/d/1YyegJp4Ny4j2aIxRgG9jBD99ov4ttuyg/view?usp=sharing",
    "content": "Syntaxe : `scanf(\"%d\", &var);`",
    "examples": "```c\nint age;\nscanf(\"%d\", &age);\n```",
    "astuces": "⚡ Esperluette `&` obligatoire pour les variables !"
  },
  {
    "num": 9,
    "title": "Choix multiple avec Switch()",
    "video_url": "https://drive.google.com/file/d/1ct98571qoTDf8wNQlOMhLjq6nil4sujB/view?usp=sharing",
    "content": "Test de valeurs discrètes entières ou char.",
    "examples": "```c\nswitch(choix) {\n    case 1: printf(\"Un\\n\"); break;\n}\n```",
    "astuces": "⚡ `break` est obligatoire pour éviter le fall-through."
  },
  {
    "num": 10,
    "title": "Structure conditionnelle if",
    "video_url": "https://drive.google.com/file/d/1Dv8FemMpvYRF7PwQ0tYi3OUMpa5RvWu8/view?usp=sharing",
    "content": "Condition simple `if (cond) { ... }`",
    "examples": "```c\nif (note >= 10) printf(\"Validé\\n\");\n```",
    "astuces": "⚡ En C, 0 = Faux, Tout le reste = Vrai."
  },
  {
    "num": 11,
    "title": "Structure conditionnelle if...else if...else",
    "video_url": "https://drive.google.com/file/d/1fndp30xztb4jCGlH7Nit7YaDSyLwn1nE/view?usp=sharing",
    "content": "Conditions multiples successives.",
    "examples": "```c\nif (x > 0) p(); else if (x < 0) n(); else z();\n```",
    "astuces": "⚡ Seule la première condition vraie s'exécute."
  },
  {
    "num": 12,
    "title": "Boucle itérative while",
    "video_url": "https://drive.google.com/file/d/1_ivpBDZbZpQT5RSp4O31b2S3i5CZsxmU/view?usp=sharing",
    "content": "Boucle à pré-condition.",
    "examples": "```c\nwhile (i < 10) { i++; }\n```",
    "astuces": "⚡ Peut s'exécuter 0 fois."
  },
  {
    "num": 13,
    "title": "Arrêt inconditionnel (break et continue)",
    "video_url": "https://drive.google.com/file/d/1tOmtZjuxt0Ztb6PCD9qgMobCD5AjTwFE/view?usp=sharing",
    "content": "`break` stoppe la boucle, `continue` saute à l'itération suivante.",
    "examples": "```c\nif (i == 5) break;\n```",
    "astuces": "⚡ Pratique pour les sorties anticipées."
  },
  {
    "num": 14,
    "title": "Saut conditionnel (goto)",
    "video_url": "https://drive.google.com/file/d/1D0c5gopO0Xv9HQUP2fJh9LeBsUBVwTA5/view?usp=sharing",
    "content": "Saut vers une étiquette `goto label;`",
    "examples": "```c\ngoto fin;\nfin: return 0;\n```",
    "astuces": "⚡ Déconseillé en programmation propre."
  },
  {
    "num": 15,
    "title": "Tableaux à une dimension (1D Arrays)",
    "video_url": "https://drive.google.com/file/d/1P7DoImgFR4dMZYcDQRdrwav4B66QWSJS/view?usp=sharing",
    "content": "Tableaux d'éléments contigus en mémoire.",
    "examples": "```c\nint tab[5] = {1, 2, 3, 4, 5};\n```",
    "astuces": "⚡ Indices de 0 à N-1."
  },
  {
    "num": 16,
    "title": "Tableaux à plusieurs dimensions (Matrices 2D)",
    "video_url": "https://drive.google.com/file/d/1fv07kzrgM53DA34EghPdE1yq37XjpuiY/view?usp=sharing",
    "content": "Matrices 2D `int mat[3][3];`",
    "examples": "```c\nint mat[2][2] = {{1,2},{3,4}};\n```",
    "astuces": "⚡ Stockage ligne par ligne."
  },
  {
    "num": 17,
    "title": "Boucle itérative For",
    "video_url": "https://drive.google.com/file/d/1y6h2s4-sHxlBGyjY1aoiK8SSdYvpc8nH/view?usp=sharing",
    "content": "Boucle à compteur `for(init; cond; step)`",
    "examples": "```c\nfor(int i=0; i<10; i++) printf(\"%d\\n\", i);\n```",
    "astuces": "⚡ Compteur contrôlé."
  },
  {
    "num": 18,
    "title": "Introduction aux fonctions en C",
    "video_url": "https://drive.google.com/file/d/1ll2-7jCdBvMAYYweGFV6L6CGBeuPRIjI/view?usp=sharing",
    "content": "Blocs de code réutilisables.",
    "examples": "```c\nvoid saluer() { printf(\"Hello\\n\"); }\n```",
    "astuces": "⚡ Déclarer le prototype au début."
  },
  {
    "num": 19,
    "title": "Fonctions avec un argument",
    "video_url": "https://drive.google.com/file/d/1t0dsFTVKHDGr2JpIkAMiGsXGvoxnVbSY/view?usp=sharing",
    "content": "Passage par valeur (copie).",
    "examples": "```c\nint carre(int x) { return x*x; }\n```",
    "astuces": "⚡ L'original n'est pas modifié."
  },
  {
    "num": 20,
    "title": "Fonctions avec plusieurs arguments et types",
    "video_url": "https://drive.google.com/file/d/1sJnqxjo3loh74hmFHg4-Au4km81TcHkD/view?usp=sharing",
    "content": "Fonctions multi-paramètres.",
    "examples": "```c\nfloat moyenne(float a, float b) { return (a+b)/2; }\n```",
    "astuces": "⚡ Ordre des paramètres strict."
  },
  {
    "num": 21,
    "title": "Instruction return dans les fonctions",
    "video_url": "https://drive.google.com/file/d/1tkNRVOeQes_6nb16a6za_o019yE3Q3F1/view?usp=sharing",
    "content": "Retour de valeur avec `return`.",
    "examples": "```c\nreturn 0;\n```",
    "astuces": "⚡ Quitte immédiatement la fonction."
  },
  {
    "num": 22,
    "title": "Appeler une fonction depuis une autre",
    "video_url": "https://drive.google.com/file/d/1K2pSKBEHYE5V6dGUe6WxvYyKN31Em5u2/view?usp=sharing",
    "content": "Appels de fonctions imbriqués.",
    "examples": "```c\nvoid f2() { f1(); }\n```",
    "astuces": "⚡ La pile d'appels gère les contextes."
  },
  {
    "num": 23,
    "title": "Conversion de types (Typecasting)",
    "video_url": "https://drive.google.com/file/d/1GYqV_KKnnxpVrrpGDEcFXPClNQknxolT/view?usp=sharing",
    "content": "Conversion explicite `(float)a`",
    "examples": "```c\nfloat res = (float)7 / 2;\n```",
    "astuces": "⚡ Évite la division entière tronquée."
  },
  {
    "num": 24,
    "title": "Introduction aux pointeurs et adresses (&)",
    "video_url": "https://drive.google.com/file/d/1rLmbhSTkHd33Mkx1paes53iUKVqEubTV/view?usp=sharing",
    "content": "Opérateur d'adresse `&var`.",
    "examples": "```c\nint x = 10;\nprintf(\"%p\", &x);\n```",
    "astuces": "⚡ Renvoie l'emplacement mémoire RAM."
  },
  {
    "num": 25,
    "title": "Déclaration et utilisation des pointeurs (*)",
    "video_url": "https://drive.google.com/file/d/1zs2aRRCT0Q3o4cx1QshnWh6MBO0LnhHo/view?usp=sharing",
    "content": "Pointeur `int *p = &x;` et déférencement `*p`.",
    "examples": "```c\nint x = 5;\nint *p = &x;\n*p = 10; // x devient 10\n```",
    "astuces": "⚡ `*p` permet d'accéder à la valeur pointée."
  },
  {
    "num": 26,
    "title": "Spécificateurs de format et pointeurs (%p)",
    "video_url": "https://drive.google.com/file/d/1aj3KAY-ISZK-xY9iipxkSdObwYW_CVbB/view?usp=sharing",
    "content": "Affichage formaté d'adresse mémoire avec `%p`.",
    "examples": "```c\nprintf(\"Adresse : %p\\n\", p);\n```",
    "astuces": "⚡ Hexadécimal."
  },
  {
    "num": 27,
    "title": "Incrémentation et décrémentation des pointeurs",
    "video_url": "https://drive.google.com/file/d/1LxIdkU541_A47h05S7kgAb1TSOoKpp03/view?usp=sharing",
    "content": "Arithmétique des pointeurs `p++`.",
    "examples": "```c\np++; // Avance de sizeof(type) octets\n```",
    "astuces": "⚡ Avance selon la taille du type pointé."
  },
  {
    "num": 28,
    "title": "Taille de mémoire avec sizeof()",
    "video_url": "https://drive.google.com/file/d/1H3rDkRgB1I193xnEZMu77vzcJ64K-FAp/view?usp=sharing",
    "content": "Taille d'un type ou d'une variable en octets `sizeof(int)`.",
    "examples": "```c\nsize_t sz = sizeof(double);\n```",
    "astuces": "⚡ Opérateur évalué à la compilation."
  },
  {
    "num": 29,
    "title": "Relation entre pointeurs et tableaux",
    "video_url": "https://drive.google.com/file/d/1coDVemjVL9QsLllE3qN7mgu808zHDVMu/view?usp=sharing",
    "content": "Équivalence `*(T + i)` et `T[i]`.",
    "examples": "```c\nint T[3] = {1, 2, 3};\nprintf(\"%d\\n\", *(T + 1)); // 2\n```",
    "astuces": "⚡ Le nom d'un tableau est un pointeur constant vers &T[0]."
  },
  {
    "num": 30,
    "title": "Introduction à l'allocation dynamique de mémoire",
    "video_url": "https://drive.google.com/file/d/1d-KIyr8Lm2hmHHY0ZAQFLjXGrOMcqFTg/view?usp=sharing",
    "content": "Gestion de la mémoire dans le Tas (Heap).",
    "examples": "```c\nint *p = malloc(sizeof(int));\n```",
    "astuces": "⚡ Permet de réserver la mémoire pendant l'exécution."
  },
  {
    "num": 31,
    "title": "Allocation et Libération avec malloc() et free()",
    "video_url": "https://drive.google.com/file/d/1j9IvCelN3ZpPvEi_4UfLcsrck_A3lDuu/view?usp=sharing",
    "content": "`malloc()` pour allouer et `free()` pour libérer.",
    "examples": "```c\nint *t = malloc(10 * sizeof(int));\nfree(t); // Libération obligatoire\n```",
    "astuces": "⚡ Évite les fuites mémoire."
  },
  {
    "num": 32,
    "title": "Introduction à realloc() et calloc()",
    "video_url": "https://drive.google.com/file/d/1bYP7YwwedbFXCF7KOCpwvr-wAKOkIINo/view?usp=sharing",
    "content": "`calloc()` alloue et initialise à 0.",
    "examples": "```c\nint *t = calloc(5, sizeof(int));\n```",
    "astuces": "⚡ Les octets sont mis à zéro."
  },
  {
    "num": 33,
    "title": "Pratique de realloc() et calloc()",
    "video_url": "https://drive.google.com/file/d/1zNKsxotHT05IG9TT8z3hKS2ixY4xW8_U/view?usp=sharing",
    "content": "Redimensionnement d'un bloc avec `realloc()`.",
    "examples": "```c\nt = realloc(t, 20 * sizeof(int));\n```",
    "astuces": "⚡ Conserve les anciennes données."
  },
  {
    "num": 34,
    "title": "Structures de données (struct)",
    "video_url": "https://drive.google.com/file/d/1WmdkSVLm77-IxpUf-o1-O89kyY2X181g/view?usp=sharing",
    "content": "Déclaration de types complexes `struct Etudiant`.",
    "examples": "```c\nstruct Personne { char nom[20]; int age; };\n```",
    "astuces": "⚡ Regroupe des types différents."
  },
  {
    "num": 35,
    "title": "Structures imbriquées (Nested structures)",
    "video_url": "https://drive.google.com/file/d/10OsfOvMH4QEVQzH_XZHzHNvCfUPUOO1G/view?usp=sharing",
    "content": "Structures contenant une autre structure.",
    "examples": "```c\nstruct Etudiant { struct Date naissance; };\n```",
    "astuces": "⚡ Accès point par point."
  },
  {
    "num": 36,
    "title": "Tableaux de structures",
    "video_url": "https://drive.google.com/file/d/1R9X_orGCJkHNgvMja5i3OGrMBjVstoaR/view?usp=sharing",
    "content": "Tableau d'objets `struct Personne groupe[50];`",
    "examples": "```c\ngroupe[0].age = 20;\n```",
    "astuces": "⚡ Gestion de collections."
  },
  {
    "num": 37,
    "title": "Alias de type avec typedef",
    "video_url": "https://drive.google.com/file/d/1dSWvy64guEpxdQ45JF48Co3mGaudItZp/view?usp=sharing",
    "content": "Création d'un pseudonyme `typedef struct ... Personne;`",
    "examples": "```c\ntypedef unsigned long ulong;\n```",
    "astuces": "⚡ Rendu du code plus lisible."
  },
  {
    "num": 38,
    "title": "Structures de données et pointeurs (->)",
    "video_url": "https://drive.google.com/file/d/1FS3J2Fhlz1NsQuXcMDSRKB6uk50XbRWv/view?usp=sharing",
    "content": "Accès via pointeur avec la flèche `ptr->champ`.",
    "examples": "```c\nstruct Personne *p = &p1;\nprintf(\"%s\\n\", p->nom);\n```",
    "astuces": "⚡ Raccourci pour `(*p).champ`."
  },
  {
    "num": 39,
    "title": "Introduction aux Listes Chaînées",
    "video_url": "https://drive.google.com/file/d/1HiVOm7WNhM8imjkWa0XsHYHSJCSn4SQC/view?usp=sharing",
    "content": "Structure dynamique par nœuds reliés par des pointeurs `next`.",
    "examples": "```c\ntypedef struct Node { int data; struct Node *next; } Node;\n```",
    "astuces": "⚡ Allocation dynamique nœud par nœud."
  },
  {
    "num": 40,
    "title": "Comparatif Listes Chaînées vs Tableaux (Arrays)",
    "video_url": "https://drive.google.com/file/d/16O0ZJpMErOp4WWJ4pihUY3x3QJ4GhOOT/view?usp=sharing",
    "content": "Tableau : Accès $O(1)$, taille fixe. Liste : Insertion $O(1)$, taille dynamique.",
    "examples": "```c\n// Avantages et inconvénients\n```",
    "astuces": "⚡ Préférer les listes pour des insertions fréquentes."
  },
  {
    "num": 41,
    "title": "Unions en C (union)",
    "video_url": "https://drive.google.com/file/d/1QhI8vSIiA7GMctwcSvhFEkM9qXijwy60/view?usp=sharing",
    "content": "Dans une `union`, tous les membres partagent la même adresse mémoire.",
    "examples": "```c\nunion Donnee { int i; float f; };\n```",
    "astuces": "⚡ Économie de mémoire RAM."
  },
  {
    "num": 42,
    "title": "Pratique des Unions en C",
    "video_url": "https://drive.google.com/file/d/1CrNM4eNGtH2LUKP57WezfFaB6XeJGFtA/view?usp=sharing",
    "content": "Utilisation d'unions pour le décodage binaire.",
    "examples": "```c\nunion Donnee d; d.i = 42;\n```",
    "astuces": "⚡ Un seul membre actif à la fois."
  },
  {
    "num": 43,
    "title": "Introduction aux Fichiers (File pointers)",
    "video_url": "https://drive.google.com/file/d/1hXZ35lSPhgy842ODFq-qgPcXVrfBLyBr/view?usp=sharing",
    "content": "Pointeur de fichier `FILE *f = fopen(\"test.txt\", \"r\");`",
    "examples": "```c\nFILE *f = fopen(\"data.txt\", \"r\");\nif (f != NULL) fclose(f);\n```",
    "astuces": "⚡ Vérifier la valeur NULL."
  },
  {
    "num": 44,
    "title": "Fichiers : Créer et Écrire (fopen, fprintf)",
    "video_url": "https://drive.google.com/file/d/19XU-byEYF5OPDQDwGKQ8JkCerQ8dCsTD/view?usp=sharing",
    "content": "Mode `\"w\"` et fonction `fprintf()`.",
    "examples": "```c\nfprintf(f, \"Score : %d\\n\", score);\n```",
    "astuces": "⚡ Écrase le fichier existant."
  },
  {
    "num": 45,
    "title": "Fichiers : Lecture de données (fscanf, fgetc)",
    "video_url": "https://drive.google.com/file/d/11qv9EcFSZ4OrU3Z078StRlWqKXVfMyyP/view?usp=sharing",
    "content": "Lecture avec `fscanf()` et `fgetc()`.",
    "examples": "```c\nfscanf(f, \"%d\", &val);\n```",
    "astuces": "⚡ Se termine à EOF."
  },
  {
    "num": 46,
    "title": "Fichiers : Mode Ajout (Append)",
    "video_url": "https://drive.google.com/file/d/1DZ8szSNoGv3jbnlGRACN_imPt-0ts5ER/view?usp=sharing",
    "content": "Mode `\"a\"` pour écrire à la fin sans écraser.",
    "examples": "```c\nFILE *f = fopen(\"log.txt\", \"a\");\n```",
    "astuces": "⚡ Ajout à la fin."
  },
  {
    "num": 47,
    "title": "Fichiers : Manipulation avec fputs et fgets",
    "video_url": "https://drive.google.com/file/d/1oETO6276mUuQmjwoLQB5LfKWvc_wLTd9/view?usp=sharing",
    "content": "Lecture et écriture ligne par ligne.",
    "examples": "```c\nchar ligne[100];\nfgets(ligne, 100, f);\n```",
    "astuces": "⚡ Évite les débordements de mémoire tampon."
  },
  {
    "num": 48,
    "title": "Fichiers : Positionnement avec fseek et ftell",
    "video_url": "https://drive.google.com/file/d/1XSuqEJFwgG4Nlv7th_ICL2-5dVHF0Nv3/view?usp=sharing",
    "content": "Positionnement dynamique avec `fseek()` et mesure avec `ftell()`.",
    "examples": "```c\nfseek(f, 0, SEEK_END);\nlong sz = ftell(f);\n```",
    "astuces": "⚡ Mesure exacte du fichier."
  },
  {
    "num": 49,
    "title": "Fichiers En-tête (Header files .h)",
    "video_url": "https://drive.google.com/file/d/1NkTHJLlIJIJFvy0BGI7BIHO5zkPJIiyi/view?usp=sharing",
    "content": "Séparation des prototypes dans un fichier `.h`.",
    "examples": "```c\n#include \"mes_fonctions.h\"\n```",
    "astuces": "⚡ Modularité du projet."
  },
  {
    "num": 50,
    "title": "Organisation et Modularité des Headers",
    "video_url": "https://drive.google.com/file/d/1KPdg7aeFAfUfvajLRmSfTCXaK0beRRq8/view?usp=sharing",
    "content": "Protection contre les inclusions multiples avec `#ifndef`.",
    "examples": "```c\n#ifndef MON_HEADER_H\n#define MON_HEADER_H\n// Prototypes\n#endif\n```",
    "astuces": "⚡ Évite la redéclaration de symboles."
  }
];
