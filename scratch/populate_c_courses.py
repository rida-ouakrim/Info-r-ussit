import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

C_COURSES = [
    {
        "num": "01",
        "title": "01. Introduction au Langage C & Environnement de Travail",
        "video": "https://drive.google.com/file/d/10OsfOvMH4QEVQzH_XZHzHNvCfUPUOO1G/view?usp=sharing",
        "content": """# 1. Introduction au Langage C & Compilateurs

## Présentation
Le **Langage C** est un langage de programmation impératif, structuré et compilé créé en 1972 par **Dennis Ritchie** aux laboratoires Bell.
Il est à la base des systèmes d'exploitation modernes (Linux, UNIX, Windows).

### Caractéristiques Principales :
- **Compilé** : Traduit directement en code machine binaire par un compilateur (`gcc`, `clang`, `MSVC`).
- **Typé statiquement** : Le type de chaque variable doit être déclaré à la compilation.
- **Accès bas niveau** : Gestion directe de la mémoire via les pointeurs.
- **Portabilité** : Code facilement adaptable sur n'importe quel processeur.

## Structure d'un Programme C Minimal
```c
#include <stdio.stdio.h>

int main() {
    printf("Bonjour et bienvenue en Langage C !\\n");
    return 0;
}
```""",
        "examples": """### Compilation et Exécution avec GCC
```bash
# Compilation
gcc -o mon_programme main.c

# Exécution sous Linux/Mac
./mon_programme

# Exécution sous Windows
mon_programme.exe
```""",
        "astuces": """⚡ **Règles Concours CRMEF :**
- La fonction `main()` doit impérativement retourner un `int` (`0` indique un succès sans erreur).
- N'oubliez jamais le point-virgule `;` à la fin de chaque instruction C !"""
    },
    {
        "num": "02",
        "title": "02. Premier Programme & Structure main()",
        "video": "https://drive.google.com/file/d/11qv9EcFSZ4OrU3Z078StRlWqKXVfMyyP/view?usp=sharing",
        "content": """# 2. Structure d'un Programme C

## Les Composants d'un Fichier `.c`
1. **Directives du Préprocesseur** : Lignes commençant par `#` (ex: `#include <stdio.h>`).
2. **Fonction Principale `main()`** : Point d'entrée obligatoire de tout programme C.
3. **Blocs de Code `{ ... }`** : Délimitent les fonctions et les structures de contrôle.

## Commentaires en C
```c
// Commentaire sur une seule ligne

/* Commentaire sur
   plusieurs lignes */
```""",
        "examples": """### Exemple : Affichage sur plusieurs lignes
```c
#include <stdio.h>

int main() {
    printf("Ligne 1 : Bienvenue\\n");
    printf("Ligne 2 : Académie Info CRMEF\\n");
    return 0;
}
```""",
        "astuces": """⚡ **Astuce Concours :**
- `\\n` est le caractère d'échappement pour le saut de ligne.
- `\\t` permet d'insérer une tabulation."""
    },
    {
        "num": "03",
        "title": "03. Variables, Constantes et Types de Données (int, float, char)",
        "video": "https://drive.google.com/file/d/16O0ZJpMErOp4WWJ4pihUY3x3QJ4GhOOT/view?usp=sharing",
        "content": """# 3. Variables, Constantes et Types en C

## Types de Base
- `int` : Entier signé (généralement 4 octets / 32 bits).
- `float` : Nombre à virgule flottante simple précision (4 octets).
- `double` : Nombre à virgule double précision (8 octets).
- `char` : Caractère ASCII (1 octet).

## Déclaration et Initialisation
```c
int age = 25;
float note = 17.5f;
char grade = 'A';
const double PI = 3.14159;
```""",
        "examples": """### Exemple : Taille des types en mémoire (`sizeof`)
```c
#include <stdio.h>

int main() {
    printf("Taille de int : %lu octets\\n", sizeof(int));
    printf("Taille de float : %lu octets\\n", sizeof(float));
    printf("Taille de char : %lu octet\\n", sizeof(char));
    return 0;
}
```""",
        "astuces": """⚡ **Piège Concours :**
- Une variable déclarée sans initialisation contient des **valeurs résiduelles aléatoires (Garbage Values)** ! Initialisez toujours vos variables (`int x = 0;`)."""
    },
    {
        "num": "04",
        "title": "04. Entrées/Sorties avec printf() et Formatage",
        "video": "https://drive.google.com/file/d/19XU-byEYF5OPDQDwGKQ8JkCerQ8dCsTD/view?usp=sharing",
        "content": """# 4. Affichage Formaté avec `printf()`

## Spécificateurs de Format
- `%d` ou `%i` : Entier (`int`).
- `%f` : Réel (`float`).
- `%lf` : Réel double précision (`double`).
- `%c` : Caractère unique (`char`).
- `%s` : Chaîne de caractères (`char*`).
- `%p` : Adresse mémoire en hexadécimal (pointeur).

## Formatage Précis des Nombres
- `%.2f` : Affiche un réel avec exactement 2 chiffres après la virgule (ex: `17.50`).""",
        "examples": """### Exemple : Formatage d'affichage
```c
#include <stdio.h>

int main() {
    int id = 42;
    float moyenne = 16.789;
    printf("Candidat N°%04d - Moyenne : %.2f/20\\n", id, moyenne);
    return 0;
}
```""",
        "astuces": """⚡ **Formule Concours :**
- `%04d` complète par des zéros à gauche pour obtenir 4 chiffres (ex: `0042`)."""
    },
    {
        "num": "05",
        "title": "05. Saisie Utilisateur avec scanf() et Adresse (&)",
        "video": "https://drive.google.com/file/d/1CrNM4eNGtH2LUKP57WezfFaB6XeJGFtA/view?usp=sharing",
        "content": """# 5. Lecture au Clavier avec `scanf()`

## Syntaxe de `scanf`
La fonction `scanf` exige le spécificateur de format et **l'adresse mémoire `&`** de la variable réceptrice.
```c
int age;
scanf("%d", &age); // L'esperluette & est OBLIGATOIRE
```

## Piège du Buffer du Clavier (`\\n`)
Lors de la saisie d'un caractère après un nombre, le saut de ligne `\\n` reste dans le tampon. Solution : insérer un espace avant `%c` (`scanf(" %c", &ch)`).""",
        "examples": """### Exemple : Lecture sécurisée d'un entier et d'un réel
```c
#include <stdio.h>

int main() {
    int x;
    float y;
    printf("Entrez un entier et un réel : ");
    scanf("%d %f", &x, &y);
    printf("Vous avez saisi : x = %d, y = %.2f\\n", x, y);
    return 0;
}
```""",
        "astuces": """⚡ **Règle d'or Concours :**
- Oublier le `&` dans `scanf("%d", val)` provoque immédiatement un crash de mémoire (**Segmentation Fault**) !"""
    },
    {
        "num": "06",
        "title": "06. Opérateurs Arithmétiques, Logiques et de Comparaison",
        "video": "https://drive.google.com/file/d/1D0c5gopO0Xv9HQUP2fJh9LeBsUBVwTA5/view?usp=sharing",
        "content": """# 6. Opérateurs en Langage C

## Opérateurs Arithmétiques
`+`, `-`, `*`, `/`, `%` (Modulo/Reste entier).

## Opérateurs de Comparaison
`==` (Égalité), `!=` (Différent), `<`, `>`, `<=`, `>=`.

## Opérateurs Logiques
- `&&` : ET logique (Short-circuit).
- `||` : OU logique.
- `!` : NON logique.

## Incrémentation et Décrémentation
- `x++` (Post-incrémentation) : Utilise la valeur de `x` puis l'incrémente.
- `++x` (Pré-incrémentation) : Incrémente `x` puis utilise la nouvelle valeur.""",
        "examples": """### Exemple : Différence entre x++ et ++x
```c
#include <stdio.h>

int main() {
    int a = 5, b = 5;
    printf("a++ = %d\\n", a++); // Affiche 5, a devient 6
    printf("++b = %d\\n", ++b); // b devient 6, affiche 6
    return 0;
}
```""",
        "astuces": """⚡ **Piège Concours :**
- `7 / 2` entre deux entiers donne `3` (Division entière).
- Pour obtenir `3.5`, au moins un opérande doit être un réel : `7.0 / 2` ou `(float)7 / 2`."""
    },
    {
        "num": "07",
        "title": "07. Structures Conditionnelles (if, else, else if)",
        "video": "https://drive.google.com/file/d/1DZ8szSNoGv3jbnlGRACN_imPt-0ts5ER/view?usp=sharing",
        "content": """# 7. Instructions Conditionnelles en C

## Syntaxe de `if...else`
```c
if (condition) {
    // Instructions si VRAI (différent de 0)
} else if (autre_condition) {
    // Autre bloc
} else {
    // Bloc par défaut
}
```

## Évaluation de la Vérité en C
En C, il n'y avait pas de type booléen natif à l'origine :
- `0` équivaut à **FAUX**.
- Toute valeur **différente de 0** équivaut à **VRAI**.""",
        "examples": """### Exemple : Contrôle d'admissibilité
```c
#include <stdio.h>

int main() {
    float note = 14.5;
    if (note >= 12.0) {
        printf("Admis au concours CRMEF !\\n");
    } else {
        printf("Ajourné.\\n");
    }
    return 0;
}
```""",
        "astuces": """⚡ **Erreur Classique Concours :**
- Écrire `if (x = 5)` au lieu de `if (x == 5)` ! L'affectation `x = 5` retourne `5` (VRAI) et modifie `x` !"""
    },
    {
        "num": "08",
        "title": "08. Choix Multiple avec switch() et break",
        "video": "https://drive.google.com/file/d/1Dv8FemMpvYRF7PwQ0tYi3OUMpa5RvWu8/view?usp=sharing",
        "content": """# 8. Structure Sélective `switch`

## Syntaxe du `switch`
Permet de tester une variable entière ou caractère par rapport à plusieurs valeurs constantes.
```c
switch (choix) {
    case 1:
        // Traitement 1
        break;
    case 2:
        // Traitement 2
        break;
    default:
        // Traitement par défaut
}
```

## Rôle du `break`
Sans l'instruction `break`, l'exécution se poursuit ("fall-through") dans les cas suivants !""",
        "examples": """### Exemple : Menu d'options
```c
#include <stdio.h>

int main() {
    int code = 2;
    switch(code) {
        case 1: printf("Algorithmique\\n"); break;
        case 2: printf("Langage C\\n"); break;
        default: printf("Option inconnue\\n");
    }
    return 0;
}
```""",
        "astuces": """⚡ **Règle Concours :**
- Le `switch` ne fonctionne qu'avec des types **discrets (entiers, char, enum)**. On ne peut PAS faire un `switch` sur un `float` ou un `double` !"""
    },
    {
        "num": "09",
        "title": "09. Boucle while (Condition contrôlée au début)",
        "video": "https://drive.google.com/file/d/1FS3J2Fhlz1NsQuXcMDSRKB6uk50XbRWv/view?usp=sharing",
        "content": """# 9. Boucle `while` en C

## Syntaxe
```c
while (condition) {
    // Instructions répétées tant que condition est VRAIE
}
```
Si la condition est fausse au départ, le bloc d'instructions ne sera **jamais exécuté** (0 fois).""",
        "examples": """### Exemple : Saisie contrôlée
```c
#include <stdio.h>

int main() {
    int val = -1;
    while (val < 0) {
        printf("Entrez un nombre positif : ");
        scanf("%d", &val);
    }
    printf("Valeur valide : %d\\n", val);
    return 0;
}
```""",
        "astuces": """⚡ **Attention aux boucles infinies :**
Assurez-vous qu'une variable à l'intérieur de la boucle modifie la condition d'arrêt !"""
    },
    {
        "num": "10",
        "title": "10. Boucle do...while (Exécution au moins 1 fois)",
        "video": "https://drive.google.com/file/d/1GYqV_KKnnxpVrrpGDEcFXPClNQknxolT/view?usp=sharing",
        "content": """# 10. Boucle `do...while`

## Syntaxe
```c
do {
    // Instructions exécutées AU MOINS une fois
} while (condition); // Attention au point-virgule final !
```

## Différence avec `while`
- `while` : Évalue la condition **avant** l'exécution.
- `do...while` : Évalue la condition **après** la première exécution.""",
        "examples": """### Exemple : Validation de note entre 0 et 20
```c
#include <stdio.h>

int main() {
    float note;
    do {
        printf("Entrez une note (0-20) : ");
        scanf("%f", &note);
    } while (note < 0 || note > 20);
    return 0;
}
```""",
        "astuces": """⚡ **Piège Concours :**
- N'oubliez pas le point-virgule `;` obligatoire après `while (condition);` dans un `do...while` !"""
    },
    {
        "num": "11",
        "title": "11. Boucle for et Compteurs d'Itération",
        "video": "https://drive.google.com/file/d/1H3rDkRgB1I193xnEZMu77vzcJ64K-FAp/view?usp=sharing",
        "content": """# 11. Boucle `for`

## Syntaxe
```c
for (initialisation; condition; incrémentation) {
    // Instructions
}
```

## Équivalence en C
Depuis la norme C99, il est possible de déclarer le compteur dans l'en-tête de la boucle :
`for (int i = 0; i < N; i++)`""",
        "examples": """### Exemple : Calcul de la somme 1 à N
```c
#include <stdio.h>

int main() {
    int N = 10, somme = 0;
    for (int i = 1; i <= N; i++) {
        somme += i;
    }
    printf("Somme de 1 à %d = %d\\n", N, somme);
    return 0;
}
```""",
        "astuces": """⚡ **Astuce Concours :**
- Les trois parties du `for` sont optionnelles : `for (;;)` crée une **boucle infinie** !"""
    },
    {
        "num": "12",
        "title": "12. Déclaration et Appel de Fonctions",
        "video": "https://drive.google.com/file/d/1HiVOm7WNhM8imjkWa0XsHYHSJCSn4SQC/view?usp=sharing",
        "content": """# 12. Les Fonctions en C

## Définition
Une **fonction** est un bloc de code nommé et réutilisable qui effectue une tâche précise et peut retourner une valeur via `return`.

## Prototypes de Fonctions
Les prototypes permettent de déclarer les signatures de fonctions au début du fichier avant leur définition sous `main()`.
```c
int carre(int n); // Prototype

int main() {
    int res = carre(4);
    return 0;
}

int carre(int n) { // Définition
    return n * n;
}
```""",
        "examples": """### Exemple : Fonction Maximum
```c
#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    printf("Max = %d\\n", max(15, 23));
    return 0;
}
```""",
        "astuces": """⚡ **Règle Concours :**
- Une fonction qui ne retourne aucune valeur doit avoir le type de retour `void`."""
    },
    {
        "num": "13",
        "title": "13. Portée des Variables (Locales vs Globales & static)",
        "video": "https://drive.google.com/file/d/1K2pSKBEHYE5V6dGUe6WxvYyKN31Em5u2/view?usp=sharing",
        "content": """# 13. Portée et Durée de Vie des Variables

## Variables Locales
Déclarées dans un bloc `{}`. Accessibles uniquement dans ce bloc. Libérées à la sortie.

## Variables Globales
Déclarées hors de toute fonction. Accessibles partout. Conservées pendant toute la durée du programme.

## Mot-clé `static`
Une variable locale marquée `static` conserve sa valeur entre les appels successifs de la fonction !""",
        "examples": """### Exemple : Compteur d'appels avec `static`
```c
#include <stdio.h>

void compter() {
    static int nbAppels = 0;
    nbAppels++;
    printf("Appel N°%d\\n", nbAppels);
}

int main() {
    compter(); // 1
    compter(); // 2
    compter(); // 3
    return 0;
}
```""",
        "astuces": """⚡ **Question Fréquente Concours :**
- Une variable `static` est initialisée **une seule fois** au démarrage du programme."""
    },
    {
        "num": "14",
        "title": "14. Modularité et Fichiers En-tête (.h et .c)",
        "video": "https://drive.google.com/file/d/1KPdg7aeFAfUfvajLRmSfTCXaK0beRRq8/view?usp=sharing",
        "content": """# 14. Modularité et Fichiers `.h`

## Séparation du Code
- **`mon_module.h`** : Contient les prototypes et les structures (Interface public).
- **`mon_module.c`** : Contient les implémentations des fonctions.
- **`main.c`** : Utilise le module via `#include "mon_module.h"`.

## Protection contre l'Inclusion Multiple (Include Guards)
```c
#ifndef MON_MODULE_H
#define MON_MODULE_H

// Prototypes ici

#endif
```""",
        "examples": """### Exemple d'Inclusion Local vs Système
- `#include <stdio.h>` : Fichier système inclus dans les répertoires standards.
- `#include "mes_fonctions.h"` : Fichier local au répertoire de projet.""",
        "astuces": """⚡ **Règle Concours :**
- Les guillemets `"..."` cherchent d'abord dans le dossier courant, tandis que `<...>` cherche dans les répertoires du compilateur."""
    },
    {
        "num": "15",
        "title": "15. Les Pointeurs en C (Adresses &, Déférencement * et Pointeur NULL)",
        "video_url": "https://drive.google.com/file/d/1LxIdkU541_A47h05S7kgAb1TSOoKpp03/view?usp=sharing",
        "content": """# 15. Les Pointeurs en Langage C

## Définition
Un **pointeur** est une variable dont la valeur est **l'adresse mémoire** d'une autre variable.

## Opérateurs Fondamentaux
- `&` : Opérateur d'adresse (Renvoie l'adresse d'une variable).
- `*` : Opérateur d'indirection / déférencement (Accède à la valeur contenue à l'adresse).

```c
int x = 10;
int *p = &x; // p contient l'adresse de x
printf("Valeur de x = %d\\n", *p); // Affiche 10
```""",
        "examples": """### Exemple : Passage par Adresse (Permutation de 2 entiers)
```c
#include <stdio.h>

void echanger(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    echanger(&x, &y);
    printf("x = %d, y = %d\\n", x, y); // x = 10, y = 5
    return 0;
}
```""",
        "astuces": """⚡ **Question Incontournable Concours :**
- Pour modifier une variable de l'appelant dans une fonction en C, on doit obligatoirement transmettre son adresse `&var` et utiliser des pointeurs !"""
    },
    {
        "num": "16",
        "title": "16. Tableaux 1D & 2D et Arithmétique des Pointeurs",
        "video": "https://drive.google.com/file/d/1NQovbWgSkKBnpn02rpG79xp_9EyhHKui/view?usp=sharing",
        "content": """# 16. Tableaux et Pointeurs en C

## Relation entre Tableau et Pointeur
En C, le nom d'un tableau est un **pointeur constant** vers son premier élément !
`T` est équivalent à `&T[0]`.

```c
int T[5] = {10, 20, 30, 40, 50};
printf("%d\\n", *T);       // Affiche 10
printf("%d\\n", *(T + 1)); // Affiche 20 (Arithmétique des pointeurs)
```""",
        "examples": """### Exemple : Parcours de tableau par pointeur
```c
#include <stdio.h>

int main() {
    int tab[3] = {1, 2, 3};
    int *p = tab;
    for (int i = 0; i < 3; i++) {
        printf("tab[%d] = %d\\n", i, *(p + i));
    }
    return 0;
}
```""",
        "astuces": """⚡ **Formule Concours :**
- `*(T + i)` est rigoureusement identique à `T[i]` !"""
    },
    {
        "num": "17",
        "title": "17. Chaînes de Caractères & Fonctions <string.h>",
        "video": "https://drive.google.com/file/d/1NkTHJLlIJIJFvy0BGI7BIHO5zkPJIiyi/view?usp=sharing",
        "content": """# 17. Chaînes de Caractères en C

## Définition
Une chaîne de caractères en C est un tableau de caractères se terminant par le caractère nul **`'\\0'`**.
```c
char str[] = "Bonjour"; // Taille 8 (7 lettres + '\0')
```

## Fonctions Principales de `<string.h>`
- `strlen(s)` : Renvoie la longueur de la chaîne (sans compter `\\0`).
- `strcpy(dest, src)` : Copie `src` dans `dest`.
- `strcat(dest, src)` : Concatène `src` à la fin de `dest`.
- `strcmp(s1, s2)` : Compare deux chaînes (`0` si égales).""",
        "examples": """### Exemple : Test d'égalité de chaînes
```c
#include <stdio.h>
#include <string.h>

int main() {
    char s1[] = "CRMEF";
    char s2[] = "CRMEF";
    if (strcmp(s1, s2) == 0) {
        printf("Chaînes identiques !\\n");
    }
    return 0;
}
```""",
        "astuces": """⚡ **Piège Classique :**
- On ne peut pas comparer deux chaînes avec `if (s1 == s2)` en C ! Cela compare leurs adresses mémoire et non leur contenu."""
    },
    {
        "num": "18",
        "title": "18. Prétraitement, Directives #define et Macros",
        "video": "https://drive.google.com/file/d/1P7DoImgFR4dMZYcDQRdrwav4B66QWSJS/view?usp=sharing",
        "content": """# 18. Le Préprocesseur C

## Rôle du Préprocesseur
Intervient **avant** la compilation. Il effectue des substitutions de texte et des traitements de directives.

## Macros de Constantes et de Fonctions
```c
#define PI 3.14159
#define CARRE(x) ((x) * (x))
```""",
        "examples": """### Exemple de Piège des Macros
```c
#define CARRE(x) x * x
// CARRE(1 + 2) devient 1 + 2 * 1 + 2 = 5 au lieu de 9 !
// Solution : Entourer toujours avec des parenthèses : #define CARRE(x) ((x) * (x))
```""",
        "astuces": """⚡ **Question Concours :**
- Les macros `#define` n'occupent aucun emplacement mémoire car elles sont remplacées textuellement avant la compilation."""
    },
    {
        "num": "19",
        "title": "19. Structures et Champs d'Enregistrement (struct)",
        "video": "https://drive.google.com/file/d/1QhI8vSIiA7GMctwcSvhFEkM9qXijwy60/view?usp=sharing",
        "content": """# 19. Les Structures en C (`struct`)

## Définition
Une **structure** regroupe des variables de types différents sous un même nom.
```c
struct Etudiant {
    int id;
    char nom[50];
    float moyenne;
};
```

## Accès aux Champs
- **Par variable directe** : Utiliser l'opérateur point `.` (`e.moyenne = 16.5;`).
- **Par pointeur de structure** : Utiliser la flèche `->` (`ptr->moyenne = 16.5;`).""",
        "examples": """### Exemple : Pointeur sur structure (`->`)
```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    struct Point p1 = {10, 20};
    struct Point *ptr = &p1;
    printf("Point x = %d, y = %d\\n", ptr->x, ptr->y);
    return 0;
}
```""",
        "astuces": """⚡ **Formule Concours :**
- `ptr->champ` est un raccourci syntaxique exact de `(*ptr).champ` !"""
    },
    {
        "num": "20",
        "title": "20. Définition de Types Personnalisés (typedef) et enums",
        "video": "https://drive.google.com/file/d/1R9X_orGCJkHNgvMja5i3OGrMBjVstoaR/view?usp=sharing",
        "content": """# 20. `typedef` et Énumérations (`enum`)

## Alias de Type avec `typedef`
Permet de créer un pseudonyme pour un type existant.
```c
typedef struct Etudiant Etudiant;
// On peut maintenant déclarer : Etudiant e1;
```

## Énumérations (`enum`)
Définit un type associant des constantes entières à des noms lisibles.
```c
enum Jour { LUNDI, MARDI, MERCREDI, JEUDI, VENDREDI };
```""",
        "examples": """### Exemple : Combinaison `typedef struct`
```c
typedef struct {
    int code;
    char titre[100];
} Cours;

int main() {
    Cours c1 = {101, "Langage C"};
    return 0;
}
```""",
        "astuces": """⚡ **Astuce Concours :**
- Dans un `enum`, par défaut le premier élément vaut `0`, le second `1`, etc."""
    },
    {
        "num": "21",
        "title": "21. Allocation Dynamique de Mémoire (malloc, calloc, free, realloc)",
        "video": "https://drive.google.com/file/d/1T1KH8LRC_70yP9dz-PwlF3zg_hoyCkHp/view?usp=sharing",
        "content": """# 21. Allocation Dynamique en C (Le Tas / Heap)

## Fonctions de la bibliothèque `<stdlib.h>`
- `malloc(taille)` : Alloue `taille` octets (mémoire non initialisée).
- `calloc(n, taille)` : Alloue et **initialise tous les octets à 0**.
- `free(ptr)` : **Libère la mémoire** allouée dynamiquement.
- `realloc(ptr, nouvelle_taille)` : Redimensionne un bloc mémoire existant.

```c
int *tab = (int*) malloc(10 * sizeof(int));
if (tab == NULL) {
    // Échec d'allocation mémoire !
}
free(tab); // Libération obligatoire
```""",
        "examples": """### Exemple : Allocation dynamique d'un tableau
```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *t = malloc(n * sizeof(int));
    if (t != NULL) {
        for (int i = 0; i < n; i++) t[i] = i * 2;
        free(t); // Évite les fuites mémoire
    }
    return 0;
}
```""",
        "astuces": """⚡ **Règle d'or Concours :**
- Chaque `malloc` doit être impérativement associé à un `free()` pour éviter les **fuites mémoire (Memory Leaks)** !"""
    },
    {
        "num": "22",
        "title": "22. Gestion des Fichiers en C (fopen, fclose, fread, fwrite)",
        "video": "https://drive.google.com/file/d/1WmdkSVLm77-IxpUf-o1-O89kyY2X181g/view?usp=sharing",
        "content": """# 22. Entrées/Sorties sur Fichiers

## Ouverture et Fermeture
- `FILE *f = fopen("fichier.txt", "r");` (Modes: `"r"` lecture, `"w"` écriture, `"a"` ajout).
- `fclose(f);`

## Fonctions de Lecture / Écriture
- **Texte** : `fprintf()`, `fscanf()`, `fgetc()`, `fgets()`.
- **Binaire** : `fread()`, `fwrite()`.""",
        "examples": """### Exemple : Écriture dans un fichier texte
```c
#include <stdio.h>

int main() {
    FILE *f = fopen("output.txt", "w");
    if (f != NULL) {
        fprintf(f, "Résultats Concours CRMEF 2026\\n");
        fclose(f);
    }
    return 0;
}
```""",
        "astuces": """⚡ **Vérification Obligatoire :**
- Toujours tester `if (f == NULL)` après `fopen` avant toute opération sur le fichier !"""
    },
    {
        "num": "23",
        "title": "23. Implémentation des Piles en C (LIFO avec Tableau ou Liste)",
        "video": "https://drive.google.com/file/d/1XSuqEJFwgG4Nlv7th_ICL2-5dVHF0Nv3/view?usp=sharing",
        "content": """# 23. Structure de Données : La Pile (Stack en C)

## Principe LIFO (Last In First Out)
Dernier entré, premier sorti.

## Implémentation par Liste Chaînée
```c
typedef struct Element {
    int valeur;
    struct Element *suivant;
} Element;

typedef struct {
    Element *sommet;
} Pile;
```""",
        "examples": """### Empiler (Push) en C
```c
void empiler(Pile *p, int val) {
    Element *nouveau = malloc(sizeof(Element));
    nouveau->valeur = val;
    nouveau->suivant = p->sommet;
    p->sommet = nouveau;
}
```""",
        "astuces": """⚡ **Astuce Concours :**
- L'empilement et le dépilement s'effectuent en **complexité constante $O(1)$**."""
    },
    {
        "num": "24",
        "title": "24. Implémentation des Files en C (FIFO avec Pointeurs Tête/Queue)",
        "video": "https://drive.google.com/file/d/1YyegJp4Ny4j2aIxRgG9jBD99ov4ttuyg/view?usp=sharing",
        "content": """# 24. Structure de Données : La File (Queue en C)

## Principe FIFO (First In First Out)
Premier entré, premier sorti.

## Structure à deux pointeurs
```c
typedef struct {
    Element *tete;
    Element *queue;
} File;
```""",
        "examples": """### Enfiler (Enqueue)
```c
void enfiler(File *f, int val) {
    Element *nouveau = malloc(sizeof(Element));
    nouveau->valeur = val;
    nouveau->suivant = NULL;
    if (f->queue != NULL) f->queue->suivant = nouveau;
    f->queue = nouveau;
    if (f->tete == NULL) f->tete = nouveau;
}
```""",
        "astuces": """⚡ **Formule Concours :**
- Enfilement par la queue et défilement par la tête en $O(1)$."""
    },
    {
        "num": "25",
        "title": "25. Listes Simplement Chaînées en C",
        "video": "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing",
        "content": """# 25. Listes Simplement Chaînées

## Structure d'un Nœud
```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;
```

## Insertion en Tête
```c
Node* insererTete(Node *head, int val) {
    Node *nouveau = malloc(sizeof(Node));
    nouveau->data = val;
    nouveau->next = head;
    return nouveau; // Nouvelle tête
}
```""",
        "examples": """### Parcours et Affichage de la Liste
```c
void afficher(Node *head) {
    Node *courant = head;
    while (courant != NULL) {
        printf("%d -> ", courant->data);
        courant = courant->next;
    }
    printf("NULL\\n");
}
```""",
        "astuces": """⚡ **Piège Concours :**
- Toujours mettre à jour le pointeur `next` avant d'écraser la tête pour ne pas perdre la liste !"""
    },
    {
        "num": "26",
        "title": "26. Listes Doublement Chaînées (prev et next)",
        "video": "https://drive.google.com/file/d/1_ivpBDZbZpQT5RSp4O31b2S3i5CZsxmU/view?usp=sharing",
        "content": """# 26. Listes Doublement Chaînées

## Structure d'un Nœud Double
Chaque nœud contient deux pointeurs : `next` vers le suivant et `prev` vers le précédent.
```c
typedef struct DNode {
    int data;
    struct DNode *prev;
    struct DNode *next;
} DNode;
```""",
        "examples": """### Avantage
Permet le parcours bidirectionnel (avant et arrière) en temps $O(1)$ pour la suppression du dernier élément si on conserve le pointeur `tail`.""",
        "astuces": """⚡ **Point Concours :**
- Penser à mettre à jour à la fois `prev` et `next` lors de toute insertion ou suppression !"""
    },
    {
        "num": "27",
        "title": "27. Listes Circulaires",
        "video": "https://drive.google.com/file/d/1aCroqgQJVwT6boOhoX4lGVKLvf5KJpjo/view?usp=sharing",
        "content": """# 27. Listes Circulaires

## Définition
Le pointeur `next` du dernier nœud pointe vers le **premier nœud** au lieu de `NULL`.""",
        "examples": """### Parcours d'une liste circulaire
```c
void afficherCirculaire(Node *head) {
    if (head == NULL) return;
    Node *curr = head;
    do {
        printf("%d ", curr->data);
        curr = curr->next;
    } while (curr != head);
}
```""",
        "astuces": """⚡ **Piège :** Utiliser une boucle `do...while` pour ne pas s'arrêter immédiatement à la condition `curr == head` !"""
    },
    {
        "num": "28",
        "title": "28. Structure d'un Arbre Binaire en C",
        "video": "https://drive.google.com/file/d/1aj3KAY-ISZK-xY9iipxkSdObwYW_CVbB/view?usp=sharing",
        "content": """# 28. Arbres Binaires en C

## Nœud d'Arbre Binaire
```c
typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;
```""",
        "examples": """### Création d'un Nœud
```c
TreeNode* creerNoeud(int val) {
    TreeNode* n = malloc(sizeof(TreeNode));
    n->val = val;
    n->left = NULL;
    n->right = NULL;
    return n;
}
```""",
        "astuces": """⚡ **Règle :** Les sous-arbres gauche et droit d'un nouveau nœud doivent être initialisés à `NULL`."""
    },
    {
        "num": "29",
        "title": "29. Arbres Binaires de Recherche (ABR) en C",
        "video": "https://drive.google.com/file/d/1bWftn086PRxJBuS48bYMP74kgPVU54D2/view?usp=sharing",
        "content": """# 29. Arbres Binaires de Recherche (ABR) en C

## Propriété ABR
Pour tout nœud : `left->val < root->val < right->val`.""",
        "examples": """### Insertion Récursive dans un ABR
```c
TreeNode* inserer(TreeNode* root, int val) {
    if (root == NULL) return creerNoeud(val);
    if (val < root->val) root->left = inserer(root->left, val);
    else if (val > root->val) root->right = inserer(root->right, val);
    return root;
}
```""",
        "astuces": """⚡ **Infixe = Ordre Croissant !**"""
    },
    {
        "num": "30",
        "title": "30. Graphes en C (Matrice d'Adjacence et Listes)",
        "video": "https://drive.google.com/file/d/1bYP7YwwedbFXCF7KOCpwvr-wAKOkIINo/view?usp=sharing",
        "content": """# 30. Graphes en C

## Représentation par Matrice d'Adjacence
```c
#define MAX 100
int adj[MAX][MAX];
```""",
        "examples": """### Représentation par Liste d'Adjacence
```c
typedef struct AdjListNode {
    int dest;
    struct AdjListNode* next;
} AdjListNode;
```""",
        "astuces": """⚡ **Espace Mémoire :** Matrice = $O(V^2)$, Liste d'adjacence = $O(V + E)$."""
    },
    {
        "num": "31",
        "title": "31. Implémentation du Tri à Bulles en C",
        "video": "https://drive.google.com/file/d/1coDVemjVL9QsLllE3qN7mgu808zHDVMu/view?usp=sharing",
        "content": """# 31. Tri à Bulles en C

```c
void triBulles(int T[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (T[j] > T[j+1]) {
                int tmp = T[j];
                T[j] = T[j+1];
                T[j+1] = tmp;
            }
        }
    }
}
```""",
        "examples": """### Complexité : $O(N^2)$""",
        "astuces": """⚡ Tri stable en place $O(1)$ mémoire."""
    },
    {
        "num": "32",
        "title": "32. Implémentation du Tri par Sélection en C",
        "video": "https://drive.google.com/file/d/1ct98571qoTDf8wNQlOMhLjq6nil4sujB/view?usp=sharing",
        "content": """# 32. Tri par Sélection en C

```c
void triSelection(int T[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (T[j] < T[minIdx]) minIdx = j;
        }
        int tmp = T[i];
        T[i] = T[minIdx];
        T[minIdx] = tmp;
    }
}
```""",
        "examples": """### Complexité : $O(N^2)$ dans tous les cas.""",
        "astuces": """⚡ Minimise le nombre d'échanges (maximum $N-1$ échanges)."""
    },
    {
        "num": "33",
        "title": "33. Implémentation du Tri par Insertion en C",
        "video": "https://drive.google.com/file/d/1d-KIyr8Lm2hmHHY0ZAQFLjXGrOMcqFTg/view?usp=sharing",
        "content": """# 33. Tri par Insertion en C

```c
void triInsertion(int T[], int n) {
    for (int i = 1; i < n; i++) {
        int cle = T[i];
        int j = i - 1;
        while (j >= 0 && T[j] > cle) {
            T[j + 1] = T[j];
            j--;
        }
        T[j + 1] = cle;
    }
}
```""",
        "examples": """### Complexité : $O(N^2)$ pire cas, $O(N)$ meilleur cas.""",
        "astuces": """⚡ Efficace pour les petits tableaux ou quasi-triés."""
    },
    {
        "num": "34",
        "title": "34. Implémentation du Tri Rapide (QuickSort) en C",
        "video": "https://drive.google.com/file/d/1dSWvy64guEpxdQ45JF48Co3mGaudItZp/view?usp=sharing",
        "content": """# 34. Tri Rapide (QuickSort) en C

```c
int partition(int T[], int low, int high) {
    int pivot = T[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (T[j] < pivot) {
            i++;
            int tmp = T[i]; T[i] = T[j]; T[j] = tmp;
        }
    }
    int tmp = T[i + 1]; T[i + 1] = T[high]; T[high] = tmp;
    return i + 1;
}

void quickSort(int T[], int low, int high) {
    if (low < high) {
        int pi = partition(T, low, high);
        quickSort(T, low, pi - 1);
        quickSort(T, pi + 1, high);
    }
}
```""",
        "examples": """### Complexité moyenne : $O(N \\log N)$""",
        "astuces": """⚡ Diviser pour régner."""
    },
    {
        "num": "35",
        "title": "35. Implémentation du Tri Fusion (MergeSort) en C",
        "video": "https://drive.google.com/file/d/1fndp30xztb4jCGlH7Nit7YaDSyLwn1nE/view?usp=sharing",
        "content": """# 35. Tri Fusion (MergeSort) en C

Complexité garantie $O(N \\log N)$ dans tous les cas !""",
        "examples": """### Fusion de deux sous-tableaux triés.""",
        "astuces": """⚡ Nécessite $O(N)$ de mémoire supplémentaire."""
    },
    {
        "num": "36",
        "title": "36. Recherche Dichotomique en C",
        "video": "https://drive.google.com/file/d/1fv07kzrgM53DA34EghPdE1yq37XjpuiY/view?usp=sharing",
        "content": """# 36. Recherche Dichotomique en C

```c
int rechercheDicho(int T[], int n, int val) {
    int deb = 0, fin = n - 1;
    while (deb <= fin) {
        int mid = deb + (fin - deb) / 2;
        if (T[mid] == val) return mid;
        if (T[mid] < val) deb = mid + 1;
        else fin = mid - 1;
    }
    return -1;
}
```""",
        "examples": """### Complexité : $O(\\log N)$""",
        "astuces": """⚡ Le tableau doit être STRICTEMENT trié au préalable !"""
    },
    {
        "num": "37",
        "title": "37. Projets Pratiques en C (Gestion d'Étudiants / Stock)",
        "video": "https://drive.google.com/file/d/1hXZ35lSPhgy842ODFq-qgPcXVrfBLyBr/view?usp=sharing",
        "content": """# 37. Projet Pratique : Gestion d'Étudiants en C""",
        "examples": """### Manipulation de structures, pointeurs et fichiers.""",
        "astuces": """⚡ Mise en pratique globale des notions du concours."""
    },
    {
        "num": "38",
        "title": "38. Exercices Avancés et Problèmes de Concours",
        "video": "https://drive.google.com/file/d/1i_kV0YtUuVNHuTA8Ys04rD4s_abaoib5/view?usp=sharing",
        "content": """# 38. Exercices Avancés""",
        "examples": """### Problèmes complexes du concours CRMEF.""",
        "astuces": """⚡ Analyse de code et détection de bugs."""
    },
    {
        "num": "39",
        "title": "39. Récursivité Avancée et Pile d'Appel",
        "video": "https://drive.google.com/file/d/1j9IvCelN3ZpPvEi_4UfLcsrck_A3lDuu/view?usp=sharing",
        "content": """# 39. Récursivité Avancée en C""",
        "examples": """### Tours de Hanoï et Récursivité Croisée.""",
        "astuces": """⚡ Risque de Stack Overflow si la condition de base manque."""
    },
    {
        "num": "40",
        "title": "40. Pointeurs de Fonctions (Callback en C)",
        "video": "https://drive.google.com/file/d/1ll2-7jCdBvMAYYweGFV6L6CGBeuPRIjI/view?usp=sharing",
        "content": """# 40. Pointeurs de Fonctions en C

```c
int (*operation)(int, int);
```""",
        "examples": """### Utilisation avec `qsort` de `<stdlib.h>`.""",
        "astuces": """⚡ Permet l'implémentation de callbacks et polymorphisme en C."""
    },
    {
        "num": "41",
        "title": "41. Unions et Bitfields (Optimisation Mémoire Bas Niveau)",
        "video": "https://drive.google.com/file/d/1oETO6276mUuQmjwoLQB5LfKWvc_wLTd9/view?usp=sharing",
        "content": """# 41. Unions (`union`) et Bitfields en C

Dans une `union`, tous les membres partagent **la même adresse mémoire** !""",
        "examples": """### Taille d'une union = Taille du membre le plus grand.""",
        "astuces": """⚡ Très posé au concours CRMEF sur l'alignement mémoire."""
    },
    {
        "num": "42",
        "title": "42. Arguments de la Ligne de Commande (argc, argv)",
        "video": "https://drive.google.com/file/d/1ocqu_6J9740PhWXwwwm4AaR9nvgkCJxN/view?usp=sharing",
        "content": """# 42. Arguments `main(int argc, char *argv[])`

- `argc` : Nombre d'arguments passés au programme.
- `argv` : Tableau de chaînes représentant chaque argument (`argv[0]` est le nom du programme).""",
        "examples": """### Exemple de lecture de `argc` et `argv`.""",
        "astuces": """⚡ `argv[0]` contient toujours le nom de l'exécutable."""
    },
    {
        "num": "43",
        "title": "43. Gestion des Erreurs (errno, perror, strerror)",
        "video": "https://drive.google.com/file/d/1rLmbhSTkHd33Mkx1paes53iUKVqEubTV/view?usp=sharing",
        "content": """# 43. Gestion des Erreurs en C

Bibliothèque `<errno.h>` et fonctions `perror()`, `strerror()`.""",
        "examples": """### Diagnostic des erreurs système.""",
        "astuces": """⚡ Bonne pratique pour le code professionnel."""
    },
    {
        "num": "44",
        "title": "44. Bibliothèques Statiques (.a) et Dynamiques (.so, .dll)",
        "video": "https://drive.google.com/file/d/1sJnqxjo3loh74hmFHg4-Au4km81TcHkD/view?usp=sharing",
        "content": """# 44. Bibliothèques C (.a vs .so / .dll)""",
        "examples": """### Création et liaison d'une bibliothèque.""",
        "astuces": """⚡ Statique = inclus au moment du build. Dynamique = chargé à l'exécution."""
    },
    {
        "num": "45",
        "title": "45. Optimisation du Code C et Inlining",
        "video": "https://drive.google.com/file/d/1t0dsFTVKHDGr2JpIkAMiGsXGvoxnVbSY/view?usp=sharing",
        "content": """# 45. Optimisation de Code C

Utilisation du mot-clé `inline` et des options du compilateur `-O2`, `-O3`.""",
        "examples": """### Réduction du surcoût d'appel des petites fonctions.""",
        "astuces": """⚡ Inlining évite l'empilement/dépilement d'appels de fonction."""
    },
    {
        "num": "46",
        "title": "46. Détection des Fuites Mémoire avec Valgrind",
        "video": "https://drive.google.com/file/d/1tOmtZjuxt0Ztb6PCD9qgMobCD5AjTwFE/view?usp=sharing",
        "content": """# 46. Fuites Mémoire et Valgrind

Utilisation de Valgrind sous Linux pour traquer les `malloc` sans `free`.""",
        "examples": """### Commande : `valgrind --leak-check=full ./programme`""",
        "astuces": """⚡ Garantit un code C robuste et sans fuites."""
    },
    {
        "num": "47",
        "title": "47. Threads et Programmation Concurrente (POSIX pthread)",
        "video": "https://drive.google.com/file/d/1tkNRVOeQes_6nb16a6za_o019yE3Q3F1/view?usp=sharing",
        "content": """# 47. Threads avec `<pthread.h>` en C""",
        "examples": """### Création de threads avec `pthread_create()` et `pthread_join()`.""",
        "astuces": """⚡ Utilisation des mutex (`pthread_mutex_t`) pour éviter les data races."""
    },
    {
        "num": "48",
        "title": "48. Programmation Réseau et Sockets en C",
        "video": "https://drive.google.com/file/d/1y6h2s4-sHxlBGyjY1aoiK8SSdYvpc8nH/view?usp=sharing",
        "content": """# 48. Sockets Réseau TCP/IP en C""",
        "examples": """### Fonctions `socket()`, `bind()`, `listen()`, `accept()`, `connect()`.""",
        "astuces": """⚡ Base de la programmation système et réseau sous Linux."""
    },
    {
        "num": "49",
        "title": "49. Examen Blanc CRMEF Langage C - Partie 1",
        "video": "https://drive.google.com/file/d/1zNKsxotHT05IG9TT8z3hKS2ixY4xW8_U/view?usp=sharing",
        "content": """# 49. Examen Blanc CRMEF - Langage C (Partie 1)""",
        "examples": """### Évaluation sous forme d'annales corrigées.""",
        "astuces": """⚡ Entraînement en conditions réelles d'examen."""
    },
    {
        "num": "50",
        "title": "50. Examen Blanc CRMEF Langage C - Partie 2",
        "video": "https://drive.google.com/file/d/1zs2aRRCT0Q3o4cx1QshnWh6MBO0LnhHo/view?usp=sharing",
        "content": """# 50. Examen Blanc CRMEF - Langage C (Partie 2)""",
        "examples": """### Correction détaillée et conseils pour le jour J.""",
        "astuces": """⚡ Récapitulatif final et stratégie pour valider le module."""
    }
]

def populate_c_courses():
    print("Populating 50 C Language courses in databases...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            # Delete old DEV_C courses
            cursor.execute(f"DELETE FROM {table_name} WHERE subdomain_code = 'DEV_C' OR subdomain_id = 'DEV_C'")

            for c in C_COURSES:
                if db_path == CONCOURS_DB:
                    cursor.execute("""
                        INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, ('DEV_C', c['title'], c['content'], c['examples'], c['astuces'], c['video']))
                else:
                    cursor.execute("""
                        INSERT INTO syllabus_course (subdomain_id, title, content, examples, astuces, video_url, is_completed)
                        VALUES (?, ?, ?, ?, ?, ?, 0)
                    """, ('DEV_C', c['title'], c['content'], c['examples'], c['astuces'], c['video']))

            conn.commit()
            print(f"Successfully inserted 50 C Language courses into: {db_path}")
            conn.close()

if __name__ == "__main__":
    populate_c_courses()
    print("C Language courses population complete!")
