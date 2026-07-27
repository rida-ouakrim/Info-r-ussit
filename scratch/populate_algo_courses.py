import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

ALGO_COURSES = [
    {
        "title": "01. Introduction à l'Algorithmique et Notions de Base",
        "video_url": "https://www.youtube.com/watch?v=gTlywLgE-W4",
        "content": """# 1. Introduction à l'Algorithmique

## Définition
Un **algorithme** est une suite finie et non ambiguë d'instructions permettant de résoudre un problème ou d'effectuer un traitement particulier à partir de données en entrée (*input*) pour produire un résultat en sortie (*output*).

### Caractéristiques d'un bon algorithme :
- **Finitude** : L'algorithme doit se terminer après un nombre fini d'étapes.
- **Déterminisme** : Pour une même entrée, il doit toujours produire la même sortie.
- **Non-ambiguïté** : Chaque instruction doit être claire, exacte et compréhensible par la machine.
- **Efficacité** : Il doit utiliser un minimum de ressources (temps d'exécution et espace mémoire).

## Structure Générale en Pseudo-code
```pseudo
Algorithme NomDuProgramme
Variables
    // Déclaration des variables ici
Début
    // Instructions à exécuter
Fin
```

## Différence entre Algorithme et Programme
- **Algorithme** : Description formelle indépendante du langage de programmation.
- **Programme** : Traduction concrète de l'algorithme dans un langage informatique spécifique (C, Python, Java...).""",
        "examples": """### Exemple : Algorithme de calcul de la somme de deux nombres
```pseudo
Algorithme SommeDeuxNombres
Variables
    a, b, somme : Entier
Début
    Ecrire("Entrez le premier nombre :")
    Lire(a)
    Ecrire("Entrez le deuxième nombre :")
    Lire(b)
    somme <- a + b
    Ecrire("La somme est : ", somme)
Fin
```""",
        "astuces": """⚡ **Astuces Concours :**
- L'affectation en pseudo-code s'écrit avec la flèche `<-` ou `:=`.
- Ne pas confondre l'affectation `<-` (donner une valeur) avec le test d'égalité `=` (comparaison).
- Au concours CRMEF, respectez scrupuleusement le bloc `Variables`, `Début` et `Fin`."""
    },
    {
        "title": "02. Variables, Constantes et Types de Données",
        "video_url": "https://www.youtube.com/watch?v=fN9zR5l0_0w",
        "content": """# 2. Variables, Constantes et Types de Données

## Notion de Variable
Une **variable** est un emplacement mémoire nommé permettant de stocker une valeur modifiable au cours de l'exécution du programme.

## Types de Données Fondamentaux
- **Entier** : Nombres sans virgule (ex: `-5`, `0`, `42`).
- **Réel** : Nombres à virgule (ex: `3.14`, `-0.5`).
- **Caractère** : Un seul symbole entre guillemets simples (ex: `'A'`, `'7'`).
- **Chaîne de caractères** : Suite de caractères entre guillemets doubles (ex: `"Bonjour"`).
- **Booléen** : Prend uniquement deux valeurs : `Vrai` ou `Faux`.

## Constantes
Une **constante** est un identificateur dont la valeur reste inchangée pendant toute l'exécution.
```pseudo
Constante PI = 3.14159
```""",
        "examples": """### Exemple : Déclaration et calcul du prix TTC
```pseudo
Algorithme CalculTVA
Constante TVA = 0.20
Variables
    prixHT, prixTTC : Réel
    estPaye : Booléen
Début
    prixHT <- 150.0
    prixTTC <- prixHT * (1 + TVA)
    estPaye <- Vrai
    Ecrire("Prix TTC : ", prixTTC)
Fin
```""",
        "astuces": """⚡ **Pièges Concours :**
- La division entre deux entiers `7 / 2` peut être entière (`3`) ou réelle (`3.5`) selon le contexte. En algorithmique :
  - `DIV` désigne la division entière : `7 DIV 2 = 3`
  - `MOD` désigne le reste (modulo) : `7 MOD 2 = 1`"""
    },
    {
        "title": "03. Opérateurs, Expressions et Entrées/Sorties (Lire/Écrire)",
        "video_url": "https://www.youtube.com/watch?v=YjXh9_k3Dkg",
        "content": """# 3. Opérateurs, Expressions et Instructions I/O

## Opérateurs Arithmétiques
`+` (Addition), `-` (Soustraction), `*` (Multiplication), `/` (Division réelle), `DIV` (Division entière), `MOD` (Modulo/Reste).

## Opérateurs Relationnels
`=` (Égal), `<>` ou `!=` (Différent), `<` (Strictement inférieur), `>` (Strictement supérieur), `<=` (Inférieur ou égal), `>=` (Supérieur ou égal).

## Opérateurs Logiques (Booléens)
- **ET (AND)** : Vrai si toutes les conditions sont vraies.
- **OU (OR)** : Vrai si au moins une condition est vraie.
- **NON (NOT)** : Inverse la valeur booléenne.

## Instructions d'Entrée / Sortie
- `Lire(variable)` : Lit une valeur saisie par l'utilisateur et la stocke.
- `Ecrire(expression)` : Affiche un message ou une valeur à l'écran.""",
        "examples": """### Exemple : Échange de deux variables (Permutation)
```pseudo
Algorithme Permutation
Variables
    x, y, temp : Entier
Début
    Lire(x)
    Lire(y)
    temp <- x
    x <- y
    y <- temp
    Ecrire("x = ", x, " y = ", y)
Fin
```""",
        "astuces": """⚡ **Astuce Permutation sans variable temporaire :**
- `x <- x + y`
- `y <- x - y`
- `x <- x - y`
*(Attention aux risques de dépassement de capacité / overflow !)*"""
    },
    {
        "title": "04. Structures Conditionnelles (Si...Alors...Sinon, Selon)",
        "video_url": "https://www.youtube.com/watch?v=R9_mG-0kXy4",
        "content": """# 4. Structures Conditionnelles

## 1. Conditionnelle Simple : `Si ... Alors`
```pseudo
Si (condition) Alors
    // Instructions si VRAI
FinSi
```

## 2. Conditionnelle Complète : `Si ... Alors ... Sinon`
```pseudo
Si (condition) Alors
    // Bloc 1
Sinon
    // Bloc 2
FinSi
```

## 3. Conditionnelle Sélective / Choix Multiple : `Selon ... Cas`
```pseudo
Selon (variable) Faire
    Cas val1 : // Instructions 1
    Cas val2 : // Instructions 2
    Autrement : // Instructions par défaut
FinSelon
```""",
        "examples": """### Exemple : Détermination du signe d'un nombre
```pseudo
Algorithme TesterSigne
Variables
    n : Entier
Début
    Lire(n)
    Si (n > 0) Alors
        Ecrire("Positif")
    SinonSi (n < 0) Alors
        Ecrire("Négatif")
    Sinon
        Ecrire("Nul")
    FinSi
Fin
```""",
        "astuces": """⚡ **Piège Classique :**
- Éviter la redondance : Écrire `Si (estAdmin = Vrai)` est superflu, écrivez directement `Si (estAdmin)`.
- Dans le `Selon`, n'oubliez pas le bloc `Autrement` pour gérer les cas d'exception."""
    },
    {
        "title": "05. Structures Itératives et Boucles (TantQue, Pour, Répéter)",
        "video_url": "https://www.youtube.com/watch?v=0t3H-KjL7F8",
        "content": """# 5. Structures Itératives et Boucles

## 1. Boucle `Pour` (Nombre d'itérations connu)
```pseudo
Pour i de 1 à N [par pas de 1] Faire
    // Instructions répétées
FinPour
```

## 2. Boucle `TantQue` (Condition contrôlée au DÉBUT)
```pseudo
TantQue (condition) Faire
    // Instructions répétées
FinTantQue
```

## 3. Boucle `Répéter ... Jusqu'à` (Condition contrôlée à la FIN)
Exécute au moins **une fois** le bloc d'instructions.
```pseudo
Répéter
    // Instructions
Jusqu'à (condition_arrêt)
```""",
        "examples": """### Exemple : Calcul de la factorielle (N!)
```pseudo
Algorithme Factorielle
Variables
    i, n, fact : Entier
Début
    Lire(n)
    fact <- 1
    Pour i de 1 à n Faire
        fact <- fact * i
    FinPour
    Ecrire("Factorielle = ", fact)
Fin
```""",
        "astuces": """⚡ **Comment choisir la bonne boucle ?**
- Nombre d'itérations connu à l'avance -> **Pour**.
- Arrêt dépendant d'une condition (peut s'exécuter 0 fois) -> **TantQue**.
- Le traitement doit s'exécuter au moins 1 fois -> **Répéter ... Jusqu'à**."""
    },
    {
        "title": "06. Les Tableaux à 1D et 2D (Vecteurs et Matrices)",
        "video_url": "https://www.youtube.com/watch?v=bQ1hU8aN4Jk",
        "content": """# 6. Les Tableaux (Vecteurs et Matrices)

## 1. Tableau Unidimensionnel (Vecteur)
Collection d'éléments de même type stockés de manière contiguë.
```pseudo
Variables
    T : Tableau[1..100] de Entier
```

## 2. Tableau Bidimensionnel (Matrice)
```pseudo
Variables
    M : Tableau[1..10, 1..10] de Réel
```

## Opérations Courantes
- Parcours par boucle `Pour`.
- Calcul de la somme, moyenne, recherche du min/max.
- Recherche séquentielle d'un élément.""",
        "examples": """### Exemple : Recherche du Maximum dans un vecteur
```pseudo
Algorithme RechercheMax
Variables
    T : Tableau[1..N] de Entier
    i, max, n : Entier
Début
    Lire(n)
    max <- T[1]
    Pour i de 2 à n Faire
        Si (T[i] > max) Alors
            max <- T[i]
        FinSi
    FinPour
    Ecrire("Le maximum est : ", max)
Fin
```""",
        "astuces": """⚡ **Attention aux Indices !**
- En pseudo-code standard, les indices commencent à `1` jusqu'à `N`.
- En C, Java, Python, JavaScript, les indices commencent impérativement à `0` jusqu'à `N-1`."""
    },
    {
        "title": "07. Chaînes de Caractères et Manipulations",
        "video_url": "https://www.youtube.com/watch?v=3KzJ9y2N_X0",
        "content": """# 7. Chaînes de Caractères

## Définition
Une chaîne de caractères est un vecteur de caractères.

## Fonctions Utiles
- `Longueur(ch)` : Renvoie le nombre de caractères.
- `SousChaine(ch, pos, lg)` : Extrait `lg` caractères à partir de `pos`.
- `Concatener(ch1, ch2)` ou `ch1 + ch2` : Assemblage de deux chaînes.""",
        "examples": """### Exemple : Test de Palindrome (ex: "RADAR")
```pseudo
Algorithme TestPalindrome
Variables
    ch : Chaîne
    i, n : Entier
    estPal : Booléen
Début
    Lire(ch)
    n <- Longueur(ch)
    estPal <- Vrai
    Pour i de 1 à n DIV 2 Faire
        Si (ch[i] <> ch[n - i + 1]) Alors
            estPal <- Faux
        FinSi
    FinPour
    Si (estPal) Alors Ecrire("Palindrome") Sinon Ecrire("Non Palindrome") FinSi
Fin
```""",
        "astuces": """⚡ **Astuce Concours :**
Pour inverser une chaîne en temps linéaire $O(n)$, échanger `ch[i]` et `ch[n - i + 1]` jusqu'au milieu `n DIV 2`."""
    },
    {
        "title": "08. Procédures et Fonctions (Sous-programmes & Modularité)",
        "video_url": "https://www.youtube.com/watch?v=v9Z8v7hG1wQ",
        "content": """# 8. Modularité : Procédures et Fonctions

## 1. Fonction
Retourne une valeur unique d'un type spécifié via `Retourner`.
```pseudo
Fonction Carre(x : Réel) : Réel
Début
    Retourner x * x
FinFonction
```

## 2. Procédure
Exécute un traitement sans retourner de valeur directe.
```pseudo
Procédure AfficherMessage(msg : Chaîne)
Début
    Ecrire("=== ", msg, " ===")
FinProcédure
```

## Passage de Paramètres
- **Par Valeur** : Une copie est transmise. Modifications uniquement locales.
- **Par Référence (`Var`)** : L'adresse est transmise. Les modifications affectent la variable d'origine.""",
        "examples": """### Exemple : Procédure de Permutation avec `Var`
```pseudo
Procédure Echanger(Var a : Entier, Var b : Entier)
Variables
    temp : Entier
Début
    temp <- a
    a <- b
    b <- temp
FinProcédure
```""",
        "astuces": """⚡ **Règle d'or Concours :**
- Calcul d'une valeur sans modifier les arguments -> **Fonction par valeur**.
- Modification explicite des variables appelantes -> **Procédure avec le mot-clé `Var`**."""
    },
    {
        "title": "09. Complexité des algorithmes (Notations O)",
        "video_url": "https://www.youtube.com/watch?v=g2CMeS2F-g8",
        "content": """# 9. Complexité des Algorithmes

## Notion de Complexité
La complexité mesure l'efficacité d'un algorithme en fonction de la taille $N$ des données d'entrée.

### 1. Complexité Temporelle
Évalue le nombre d'opérations élémentaires exécutées.

### 2. Complexité Spatiale
Évalue la quantité de mémoire consommée.

## Notations Asymptotiques
- **$O(1)$** : Complexité constante.
- **$O(\log N)$** : Complexité logarithmique (ex: Recherche dichotomique).
- **$O(N)$** : Complexité linéaire (ex: Parcours de tableau).
- **$O(N \log N)$** : Complexité quasi-linéaire (ex: Tri rapide / Fusion).
- **$O(N^2)$** : Complexité quadratique (ex: Tri à bulles / Sélection).
- **$O(2^N)$** : Complexité exponentielle.""",
        "examples": """### Exemple : Calcul de la complexité d'une boucle imbriquée
```pseudo
Pour i de 1 à N Faire
    Pour j de 1 à N Faire
        Ecrire(i * j)  // Exécuté N x N fois -> O(N^2)
    FinPour
FinPour
```""",
        "astuces": """⚡ **Règle Rapide Concours :**
- 1 boucle simple de 1 à N -> $O(N)$
- 2 boucles imbriquées de 1 à N -> $O(N^2)$
- Diviser la recherche par 2 à chaque étape -> $O(\log N)$"""
    },
    {
        "title": "10. Structures de données statiques et dynamiques (Piles, Files, Listes)",
        "video_url": "https://www.youtube.com/watch?v=K37_nQ9M_Wc",
        "content": """# 10. Structures de Données (Piles, Files, Listes)

## 1. Les Piles (LIFO - Last In First Out)
Dernier entré, premier sorti.
- Operations : `Empiler(P, x)`, `Dépiler(P)`.

## 2. Les Files (FIFO - First In First Out)
Premier entré, premier sorti.
- Operations : `Enfiler(F, x)`, `Défiler(F)`.

## 3. Listes Chaînées (Structure Dynamique)
Ensemble de nœuds contenant une donnée et un pointeur `suivant` vers le nœud d'après.
- Permet l'insertion et la suppression en $O(1)$ si la position est connue.""",
        "examples": """### Exemple : Empiler et Dépiler en C
```c
typedef struct Node {
    int data;
    struct Node* next;
} Node;

void push(Node** top, int val) {
    Node* newNode = malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = *top;
    *top = newNode;
}
```""",
        "astuces": """⚡ **Formules Concours :**
- Pile = LIFO (ex: Historique de navigateur, pile d'assiettes, gestion des appels de fonctions récursives).
- File = FIFO (ex: File d'impression, file d'attente réseau, parcours BFS)."""
    },
    {
        "title": "11. Algorithmes de Tri et Recherche (Tri Bulle, Sélection, Insertion, Rapide, Fusion)",
        "video_url": "https://www.youtube.com/watch?v=7uKj4b9b9c0",
        "content": """# 11. Algorithmes de Tri et Recherche

## Algorithmes de Tri Comparatifs
1. **Tri à Bulles** : Compare et échange les voisins. Complexité $O(N^2)$.
2. **Tri par Sélection** : Trouve le minimum et le place au début. Complexité $O(N^2)$.
3. **Tri par Insertion** : Insère chaque élément à sa place dans la partie triée. Complexité $O(N^2)$.
4. **Tri Rapide (QuickSort)** : Choix d'un pivot et partitionnement. Complexité moyenne $O(N \log N)$, pire cas $O(N^2)$.
5. **Tri Fusion (MergeSort)** : Diviser pour régner. Complexité garantie $O(N \log N)$.

## Algorithmes de Recherche
- **Recherche Séquentielle** : Sur tableau non trié. Complexité $O(N)$.
- **Recherche Dichotomique** : Sur tableau **obligatoirement trié**. Complexité $O(\log N)$.""",
        "examples": """### Exemple : Recherche Dichotomique en pseudo-code
```pseudo
Algorithme RechercheDicho
Variables
    T : Tableau[1..N] de Entier
    val, deb, fin, milieu : Entier
    trouve : Booléen
Début
    deb <- 1 ; fin <- N ; trouve <- Faux
    TantQue (deb <= fin ET NON trouve) Faire
        milieu <- (deb + fin) DIV 2
        Si (T[milieu] = val) Alors
            trouve <- Vrai
        SinonSi (T[milieu] < val) Alors
            deb <- milieu + 1
        Sinon
            fin <- milieu - 1
        FinSi
    FinTantQue
Fin
```""",
        "astuces": """⚡ **Tableau Récapitulatif Concours :**
| Algorithme | Pire Cas | Meilleur Cas | Stabilité |
|---|---|---|---|
| Tri Bulle | $O(N^2)$ | $O(N)$ | Oui |
| Tri Sélection | $O(N^2)$ | $O(N^2)$ | Non |
| Tri QuickSort | $O(N^2)$ | $O(N \log N)$ | Non |
| Tri MergeSort | $O(N \log N)$ | $O(N \log N)$ | Oui |"""
    },
    {
        "title": "12. Récursivité et approche Diviser pour régner",
        "video_url": "https://www.youtube.com/watch?v=kYv_8R2v7c4",
        "content": """# 12. Récursivité et Diviser pour Régner

## Principe de la Récursivité
Une fonction est dite **récursive** si elle s'appelle elle-même.

### Deux éléments obligatoires :
1. **Cas de Base (Cas d'arrêt)** : Évite une boucle infinie de pile.
2. **Hérédité (Cas Récursif)** : Réduction du problème à une instance plus petite.

## Approche Diviser pour Régner
1. **Diviser** le problème en sous-problèmes indépendants.
2. **Régner** en résolvant les sous-problèmes de façon récursive.
3. **Combiner** les solutions pour obtenir la solution globale.""",
        "examples": """### Exemple : Suite de Fibonacci Récursive
```pseudo
Fonction Fibo(n : Entier) : Entier
Début
    Si (n <= 1) Alors
        Retourner n
    Sinon
        Retourner Fibo(n - 1) + Fibo(n - 2)
    FinSi
FinFonction
```""",
        "astuces": """⚡ **Stack Overflow (Débordement de pile) :**
Se produit si la condition d'arrêt est absente ou jamais atteinte."""
    },
    {
        "title": "13. Arbres binaires et Arbres binaires de recherche (ABR)",
        "video_url": "https://www.youtube.com/watch?v=0h94yJ9y8w8",
        "content": """# 13. Arbres Binaires et ABR

## Définitions
Un **Arbre Binaire** est une structure hiérarchique où chaque nœud a au plus deux fils (gauche et droit).

## Arbre Binaire de Recherche (ABR)
Pour tout nœud $N$ :
- Toutes les clés du sous-arbre **gauche** sont **inférieures** à la clé de $N$.
- Toutes les clés du sous-arbre **droit** sont **supérieures** à la clé de $N$.

## Parcours d'Arbres
- **Infixe (In-order)** : Gauche -> Racine -> Droit (Affiche un ABR dans l'ordre croissant !).
- **Préfixe (Pre-order)** : Racine -> Gauche -> Droit.
- **Postfixe (Post-order)** : Gauche -> Droit -> Racine.""",
        "examples": """### Exemple : Parcours Infixe en C
```c
void infixe(Node* root) {
    if (root != NULL) {
        infixe(root->left);
        printf("%d ", root->data);
        infixe(root->right);
    }
}
```""",
        "astuces": """⚡ **Astuce Concours CRMEF :**
- Le parcours **Infixe** d'un ABR donne toujours les éléments **triés en ordre croissant** !"""
    },
    {
        "title": "14. Graphes : Représentation et parcours (DFS, BFS)",
        "video_url": "https://www.youtube.com/watch?v=0uB_X6t28w4",
        "content": """# 14. Graphes : Représentation et Parcours

## Définitions
Un graphe $G = (V, E)$ est composé d'un ensemble de sommets $V$ et d'arêtes $E$ (ou arcs si orienté).

## Représentations en Mémoire
1. **Matrice d'Adjacence** : Matrice $N \times N$. Espace $O(N^2)$.
2. **Listes d'Adjacence** : Tableau de listes chaînées. Espace $O(N + E)$.

## Algorithmes de Parcours
- **Parcours en Profondeur (DFS)** : Utilise une **Pile** (ou la récursivité).
- **Parcours en Largeur (BFS)** : Utilise une **File** (détermine les plus courts chemins dans un graphe non pondéré).""",
        "examples": """### Exemple : Comparaison DFS vs BFS
- **DFS** : Explore le plus loin possible le long de chaque branche avant de revenir en arrière.
- **BFS** : Explore tous les voisins à la distance 1, puis distance 2, etc.""",
        "astuces": """⚡ **Astuce Concours :**
- BFS = File (Queue) -> Plus court chemin (non-pondéré).
- DFS = Pile (Stack / Récursivité) -> Recherche de composantes connexes ou cycles."""
    }
]

def update_db(db_path):
    print(f"Updating database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Ensure video_url column exists in courses table
    cursor.execute("PRAGMA table_info(courses)")
    cols = [col[1] for col in cursor.fetchall()]
    if 'video_url' not in cols:
        print("Adding video_url column...")
        cursor.execute("ALTER TABLE courses ADD COLUMN video_url VARCHAR(500)")

    # Delete existing DEV_ALGO courses
    cursor.execute("DELETE FROM courses WHERE subdomain_code = 'DEV_ALGO'")

    # Insert all 14 courses
    for course in ALGO_COURSES:
        cursor.execute("""
            INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('DEV_ALGO', course['title'], course['content'], course['examples'], course['astuces'], course['video_url']))

    conn.commit()
    print(f"Successfully populated 14 Algorithmique courses in {db_path}")
    conn.close()

if __name__ == "__main__":
    update_db(CONCOURS_DB)
    print("Done populating concours.db!")
