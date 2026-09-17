import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INITIAL_DATA_PATH = os.path.join(BASE_DIR, "initial_data.json")

ENRICHED_COURSES = {
    "01. Introduction à l'Algorithmique et Notions de Base": {
        "content": """# 01. Introduction à l'Algorithmique et Notions de Base

## 📌 1. Définition et Rôle d'un Algorithme
Un **algorithme** est une suite d'instructions ordonnées, finies et non ambiguës permettant de résoudre un problème donné ou d'effectuer un traitement de données.

### Les 4 Caractéristiques d'un Bon Algorithme :
1. **Finitude :** L'algorithme doit obligatoirement s'arrêter après un nombre fini d'étapes.
2. **Déterminisme :** Pour les mêmes données d'entrée, il doit produire exactement le même résultat.
3. **Non-ambiguïté :** Chaque instruction doit être claire et interprétable d'une seule façon.
4. **Efficacité :** Il doit optimiser le temps d'exécution et l'utilisation de la mémoire.

---

## 📌 2. Structure Générale d'un Algorithme en Pseudocode
```alg
ALGORITHME NomDuProgramme
VARIABLES
   // Déclaration des variables (Nom : Type)
   x, y : Entier
   resultat : Réel

DÉBUT
   // Bloc d'instructions principales
   Lire(x)
   y <- x * 2
   Écrire("Le résultat est : ", y)
FIN
```

---

## 📌 3. Différence entre Algorithme et Programme
- **Algorithme :** Description conceptuelle et indépendante de tout langage de programmation.
- **Programme :** Traduction concrète de l'algorithme dans un langage informatique spécifique (C, Python, Java).""",
        "examples": "```alg\nALGORITHME SommeDeuxNombres\nVARIABLES\n   a, b, s : Entier\nDÉBUT\n   Écrire(\"Entrez premier nombre : \")\n   Lire(a)\n   Écrire(\"Entrez deuxième nombre : \")\n   Lire(b)\n   s <- a + b\n   Écrire(\"La somme est : \", s)\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Un algorithme sans condition d'arrêt (boucle infinie) viole le principe fondamental de **Finitude**."
    },
    "02. Variables, Constantes et Types de Données": {
        "content": """# 02. Variables, Constantes et Types de Données

## 📌 1. Notion de Variable et Mémoire
Une **variable** est un emplacement réservé dans la mémoire RAM caractérisé par :
- Un **Nom (Identificateur)** (ex: `age`, `note_examen`)
- Un **Type de données** qui détermine la taille en octets et les opérations autorisées.
- Une **Valeur** qui peut varier au cours de l'exécution.
- Une **Adresse mémoire**.

---

## 📌 2. Les Types de Données Élémentaires
1. **Entier (Integer) :** Nombres sans virgule (ex: `-5`, `0`, `42`).
2. **Réel (Float / Double) :** Nombres avec virgule (ex: `3.14`, `-0.001`).
3. **Booléen (Boolean) :** Valeurs logiques : `Vrai` (True) ou `Faux` (False).
4. **Caractère (Char) :** Un seul symbole entre guillemets ou apostrophes (ex: `'A'`, `'9'`, `'+'`).
5. **Chaîne de caractères (String) :** Suite de caractères (ex: `"Bonjour Maroc"`).

---

## 📌 3. Déclaration et Constantes
```alg
VARIABLES
   nom : Chaîne
   age : Entier
   moyenne : Réel
   admis : Booléen

CONSTANTES
   PI = 3.14159
   TAILLE_MAX = 100
```""",
        "examples": "```alg\nVARIABLES\n   compteur : Entier\n   prix_ht, prix_ttc : Réel\n   est_valide : Booléen\nDÉBUT\n   prix_ht <- 150.0\n   prix_ttc <- prix_ht * 1.20\n   est_valide <- Vrai\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** L'affectation `<-` attribue la valeur de droite à la variable de gauche. Le type de la valeur doit être compatible avec celui de la variable !"
    },
    "03. Opérateurs, Expressions et Entrées/Sorties (Lire/Écrire)": {
        "content": """# 03. Opérateurs, Expressions et Entrées/Sorties

## 📌 1. Opérateurs Arithmétiques
- `+` (Addition), `-` (Soustraction), `*` (Multiplication), `/` (Division réelle).
- `div` (Division entière : quotient) $\\rightarrow$ `17 div 5 = 3`.
- `mod` (Reste de la division entière / Modulo) $\\rightarrow$ `17 mod 5 = 2`.

---

## 📌 2. Opérateurs Logiques et de Comparaison
- **Comparaison :** `=`, `≠` (ou `!=`), `<`, `>`, `≤` (ou `<=`), `≥` (ou `>=`).
- **Logiques :** `Et` (AND), `Ou` (OR), `Non` (NOT).
  - `Vrai Et Faux = Faux`
  - `Vrai Ou Faux = Vrai`
  - `Non(Vrai) = Faux`

---

## 📌 3. Entrées et Sorties (Lire / Écrire)
```alg
DÉBUT
   Écrire("Veuillez saisir la note de l'étudiant : ")
   Lire(note)
   si (note >= 10) Alors
      Écrire("Étudiant Admis !")
   FinSi
FIN
```""",
        "examples": "```alg\nVARIABLES\n   n, q, r : Entier\nDÉBUT\n   n <- 23\n   q <- n div 5 // q = 4\n   r <- n mod 5 // r = 3\n   Écrire(\"Quotient = \", q, \", Reste = \", r)\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Pour vérifier si un entier $N$ est pair : `N mod 2 = 0`. Pour vérifier s'il est impair : `N mod 2 ≠ 0`."
    },
    "04. Structures Conditionnelles (Si...Alors...Sinon, Selon)": {
        "content": """# 04. Structures Conditionnelles

## 📌 1. Conditionnelle Simple et Alternative
```alg
// Forme Alternative
Si (condition) Alors
   // Instructions si la condition est VRAIE
Sinon
   // Instructions si la condition est FAUSSE
FinSi
```

---

## 📌 2. Structure Imbriquée
```alg
Si (note >= 16) Alors
   mention <- "Très Bien"
Sinon
   Si (note >= 14) Alors
      mention <- "Bien"
   Sinon
      Si (note >= 12) Alors
         mention <- "Assez Bien"
      Sinon
         mention <- "Passable"
      FinSi
   FinSi
FinSi
```

---

## 📌 3. Structure à Choix Multiple (Selon / Switch)
```alg
Selon (choix)
   Cas 1 : Écrire("Menu Fichier")
   Cas 2 : Écrire("Menu Édition")
   Cas 3 : Écrire("Menu Aide")
   Sinon : Écrire("Choix invalide !")
FinSelon
```""",
        "examples": "```alg\nVARIABLES num_jour : Entier\nDÉBUT\n   Lire(num_jour)\n   Selon (num_jour)\n      Cas 1 : Écrire(\"Lundi\")\n      Cas 2 : Écrire(\"Mardi\")\n      Cas 3 : Écrire(\"Mercredi\")\n      Sinon : Écrire(\"Autre jour\")\n   FinSelon\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** La structure `Selon` s'applique uniquement sur des types ordinaux (Entier, Caractère). Elle ne s'applique pas sur les Réels !"
    },
    "05. Structures Itératives et Boucles (TantQue, Pour, Répéter)": {
        "content": """# 05. Structures Itératives et Boucles

## 📌 1. La Boucle Pour (Nombre d'itérations connu)
S'utilise lorsque le nombre exact de répétitions est connu à l'avance.
```alg
Pour i de 1 à N [Pas de 1] faire
   Écrire("Itération numéro : ", i)
FinPour
```

---

## 📌 2. La Boucle Tant Que (Condition préalable)
Évalue la condition **avant** chaque itération (0 à N exécutions).
```alg
TantQue (condition) faire
   // Instructions qui doivent modifier la condition !
FinTantQue
```

---

## 📌 3. La Boucle Répéter...Jusqu'à (Post-testée)
Exécute le bloc au moins **une fois** avant de vérifier la condition.
```alg
Répéter
   Écrire("Entrez un nombre positif : ")
   Lire(x)
Jusqu'à (x > 0)
```""",
        "examples": "```alg\n// Calcul de la somme des N premiers entiers\nVARIABLES i, N, S : Entier\nDÉBUT\n   Lire(N)\n   S <- 0\n   Pour i de 1 à N faire\n      S <- S + i\n   FinPour\n   Écrire(\"Somme = \", S)\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Si la condition initiale de `TantQue` est fausse dès le départ, la boucle s'exécute **0 fois**. Pour `Répéter...Jusqu'à`, le corps de boucle s'exécute au moins **1 fois**."
    },
    "06. Les Tableaux à 1D et 2D (Vecteurs et Matrices)": {
        "content": """# 06. Les Tableaux à 1D et 2D (Vecteurs et Matrices)

## 📌 1. Tableaux à une dimension (Vecteurs)
Un tableau 1D est une suite d'éléments de **même type** stockés en emplacements mémoire contigus.
```alg
VARIABLES
   T : Tableau[1..N] de Entier
   i, somme : Entier

DÉBUT
   somme <- 0
   Pour i de 1 à N faire
      somme <- somme + T[i]
   FinPour
FIN
```

---

## 📌 2. Tableaux à deux dimensions (Matrices)
Une matrice est structurée en **lignes** et **colonnes**.
```alg
VARIABLES
   M : Tableau[1..3, 1..3] de Réel
   l, c : Entier

DÉBUT
   Pour l de 1 à 3 faire
      Pour c de 1 à 3 faire
         M[l, c] <- 0.0
      FinPour
   FinPour
FIN
```""",
        "examples": "```alg\n// Recherche du Maximum dans un Tableau 1D\nVARIABLES\n   T : Tableau[1..5] de Entier\n   i, max : Entier\nDÉBUT\n   max <- T[1]\n   Pour i de 2 à 5 faire\n      Si (T[i] > max) Alors\n         max <- T[i]\n      FinSi\n   FinPour\n   Écrire(\"Le Max est : \", max)\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** L'accès à un élément `T[i]` ou `M[l,c]` se fait en temps constant $O(1)$ grâce à l'accès direct par indice."
    },
    "07. Chaînes de Caractères et Manipulations": {
        "content": """# 07. Chaînes de Caractères et Manipulations

## 📌 1. Représentation et Opérations
Une chaîne est une séquence ordonnée de caractères.
- `Longueur(ch)` ou `len(ch)` : Nombre de caractères.
- `Concat(ch1, ch2)` ou `ch1 + ch2` : Assemblage de deux chaînes.
- `SousChaine(ch, pos, lg)` : Extrait `lg` caractères à partir de `pos`.

```alg
VARIABLES
   str : Chaîne
   n : Entier

DÉBUT
   str <- "Informatique"
   n <- Longueur(str) // n = 12
   Écrire(SousChaine(str, 1, 4)) // Affiche "Info"
FIN
```""",
        "examples": "```alg\n// Inverser une chaîne de caractères\nVARIABLES ch, inv : Chaîne\n   i, n : Entier\nDÉBUT\n   Lire(ch)\n   inv <- \"\"\n   n <- Longueur(ch)\n   Pour i de n à 1 pas -1 faire\n      inv <- inv + SousChaine(ch, i, 1)\n   FinPour\n   Écrire(\"Inverse = \", inv)\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** En Python, les indices de chaînes vont de `0` à `len(ch)-1`. En pseudocode standard, les indices vont souvent de `1` à `N`."
    },
    "08. Procédures et Fonctions (Sous-programmes & Modularité)": {
        "content": """# 08. Procédures et Fonctions (Sous-programmes & Modularité)

## 📌 1. Différence entre Fonction et Procédure
- **Fonction :** Calcule et retourne **une valeur unique** grâce à l'instruction `Retourner`.
- **Procédure :** Effectue une suite d'actions sans retourner de valeur directement.

---

## 📌 2. Passage de Paramètres : Valeur vs Référence (`var`)
1. **Passage par Valeur :**
   - Une copie de l'argument est transmise.
   - Toute modification locale est **sans effet** sur la variable d'origine.
2. **Passage par Référence / Adresse (`var`) :**
   - L'adresse mémoire est transmise.
   - Les modifications effectuées à l'intérieur impactent **directement** la variable d'origine.

```alg
Procédure Echanger(var a : Entier, var b : Entier)
VARIABLES temp : Entier
DÉBUT
   temp <- a
   a <- b
   b <- temp
FinProcédure
```""",
        "examples": "```alg\nFonction EstPair(n : Entier) : Booléen\nDÉBUT\n   Si (n mod 2 = 0) Alors\n      Retourner Vrai\n   Sinon\n      Retourner Faux\n   FinSi\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Si une question demande de modifier plusieurs variables dans un sous-programme, utilisez une **Procédure avec des paramètres passés par référence (`var`)**."
    },
    "09. Complexité des algorithmes (Notations O)": {
        "content": """# 09. Complexité des Algorithmes (Notation Big-O)

## 📌 1. Complexité Temporelle et Spatiale
- **Complexité Temporelle $T(n)$ :** Nombre d'opérations élémentaires en fonction de la taille $n$ des données.
- **Complexité Spatiale $S(n)$ :** Espace mémoire supplémentaire utilisé.

---

## 📌 2. Les Classes de Complexité Courantes
1. **$O(1)$ (Constante) :** Accès direct par indice `T[i]`.
2. **$O(\\log n)$ (Logarithmique) :** Recherche dichotomique, ABR équilibré.
3. **$O(n)$ (Linéaire) :** Recherche séquentielle, parcours d'une liste.
4. **$O(n \\log n)$ (Quasi-linéaire) :** Tri rapide (QuickSort moyen), Tri Fusion (MergeSort).
5. **$O(n^2)$ (Quadratique) :** Tri à bulles, tri par sélection, double boucle imbriquée.
6. **$O(2^n)$ (Exponentielle) :** Résolution par force brute (Tours de Hanoï).""",
        "examples": "```alg\n// Exemple O(n^2) : Double boucle imbriquée\nPour i de 1 à N faire\n   Pour j de 1 à N faire\n      // Opération O(1)\n   FinPour\nFinPour\n```",
        "astuces": "⚡ **Astuce Concours :** Pour déterminer la complexité d'une boucle : si le pas de boucle est multiplié/divisé par 2 ($\to O(\\log n)$), si le pas est $+1$ ($\to O(n)$)."
    },
    "10. Structures de données statiques et dynamiques (Piles, Files, Listes)": {
        "content": """# 10. Structures de Données Statiques et Dynamiques (Piles, Files, Listes, Enregistrements & Fichiers)

## 📌 1. Les Enregistrements (Structures / Records)
Un **enregistrement** (`struct`) regroupe plusieurs champs de types différents sous une même variable.

```alg
ENREGISTREMENT Etudiant
   nom : Chaîne
   age : Entier
   notes : Tableau[1..4] de Réel
FINENREGISTREMENT

Var e : Etudiant
e.nom <- "Karim"
e.notes[2] <- 15.5 // Affecte 15.5 à la 2ème note du tableau notes
```

---

## 📌 2. Gestion des Fichiers Texte & Séquentiels
Permet la persistance des données en mémoire secondaire.

```alg
VARIABLES
   f : Fichier Texte
   ligne : Chaîne

DÉBUT
   Ouvrir(f, "r") // Mode lecture ("r" = read)
   Tant que NON Fin_Fichier(f) Faire
      Lire(f, ligne)
      Écrire(ligne)
   FIN TantQue
   Fermer(f)
FIN
```

---

## 📌 3. Piles (LIFO), Files (FIFO) et Listes Chaînées
- **Pile (LIFO - Last In First Out) :** Insérer/Retirer au sommet (`Empiler` / `Dépiler`).
- **File (FIFO - First In First Out) :** Insérer en queue (`Enfiler`), retirer en tête (`Défiler`).
- **Liste Chaînée :** Maillons dynamiques reliés par des pointeurs `suivant`.""",
        "examples": "```alg\n// Accès au champ d'un enregistrement\nENREGISTREMENT Produit\n   code : Entier\n   prix : Réel\nFINENREGISTREMENT\n\nVar p : Produit\np.code <- 101\np.prix <- 49.99\n```",
        "astuces": "⚡ **Astuce Concours :** Pour accéder à un élément de tableau contenu dans un enregistrement `e`, la syntaxe exacte est : `e.tableau[indice] <- valeur` (ex: `e.notes[2] <- 15.5`)."
    },
    "11. Algorithmes de Tri et Recherche (Tri Bulle, Sélection, Insertion, Rapide, Fusion)": {
        "content": """# 11. Algorithmes de Tri et Recherche

## 📌 1. Algorithmes de Recherche
- **Recherche Séquentielle :** Parcourt le tableau élément par élément. Fonctionne sur tableau trié ou non trié. Complexité : $O(n)$.
- **Recherche Dichotomique :** Divise le tableau en deux à chaque étape. **Condition obligatoire : Le tableau doit être strictement trié !** Complexité : $O(\\log n)$.

---

## 📌 2. Algorithmes de Tri Comparatifs
| Algorithme | Meilleur Cas | Cas Moyen | Pire Cas | Stabilité |
| :--- | :---: | :---: | :---: | :---: |
| **Tri à Bulles** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | Oui |
| **Tri par Sélection** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | Non |
| **Tri par Insertion** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | Oui |
| **Tri Rapide (QuickSort)** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | Non |
| **Tri Fusion (MergeSort)** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | Oui |""",
        "examples": "```alg\n// Recherche Dichotomique dans un tableau T trié de 1 à N\nVARIABLES T : Tableau[1..N] de Entier, val, deb, fin, milieu : Entier, trouve : Booléen\nDÉBUT\n   deb <- 1; fin <- N; trouve <- Faux\n   TantQue (deb <= fin Et NON trouve) Faire\n      milieu <- (deb + fin) div 2\n      Si (T[milieu] = val) Alors trouve <- Vrai\n      Sinon Si (T[milieu] < val) Alors deb <- milieu + 1\n      Sinon fin <- milieu - 1\n      FinSi\n   FinTantQue\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Le Tri Fusion (MergeSort) a la meilleure garantie de pire cas ($O(n \\log n)$), mais nécessite $O(n)$ d'espace mémoire supplémentaire."
    },
    "12. Récursivité et approche Diviser pour régner": {
        "content": """# 12. Récursivité et Approche Diviser pour Régner

## 📌 1. Principes de la Récursivité
Un algorithme est récursif lorsqu'il s'appelle lui-même.

### Les 2 Conditions Indispensables :
1. **Cas de Base (Condition d'Arrêt) :** Stoppe l'empilement des appels récursifs dans la pile d'exécution (Call Stack).
2. **Cas Récursif :** Réduit le problème à un sous-problème de plus petite taille.

```alg
Fonction Factorielle(n : Entier) : Entier
DÉBUT
   Si (n <= 1) Alors
      Retourner 1 // Cas de base
   Sinon
      Retourner n * Factorielle(n - 1) // Cas récursif
   FinSi
FIN
```""",
        "examples": "```alg\n// Suite de Fibonacci récursive\nFonction Fibo(n : Entier) : Entier\nDÉBUT\n   Si (n <= 1) Alors Retourner n\n   Sinon Retourner Fibo(n-1) + Fibo(n-2)\n   FinSi\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Sans cas de base ou avec un cas de base mal défini, un sous-programme récursif provoque une erreur **Stack Overflow** (débordement de la pile)."
    },
    "13. Arbres binaires et Arbres binaires de recherche (ABR)": {
        "content": """# 13. Arbres Binaires et Arbres Binaires de Recherche (ABR)

## 📌 1. Arbre Binaire et Vocabulaire
- **Racine :** Le nœud sommet de l'arbre.
- **Feuille :** Nœud sans aucun fils.
- **Hauteur :** Longueur du plus long chemin de la racine vers une feuille.

---

## 📌 2. Arbre Binaire de Recherche (ABR)
Pour chaque nœud $N$ :
- Toutes les clés du sous-arbre **gauche** sont $< N.clé$.
- Toutes les clés du sous-arbre **droit** sont $> N.clé$.

### Les 3 Parcours en Profondeur :
1. **Infixe (Gauche - Racine - Droit) :** Visite les éléments dans l'ordre croissant !
2. **Préfixe (Racine - Gauche - Droit) :** Utilisé pour copier un arbre.
3. **Postfixe (Gauche - Droit - Racine) :** Utilisé pour supprimer un arbre.""",
        "examples": "```alg\n// Parcours Infixe (GRD)\nProcédure ParcoursInfixe(racine : PointeurNoeud)\nDÉBUT\n   Si (racine ≠ NIL) Alors\n      ParcoursInfixe(racine^.fils_gauche)\n      Écrire(racine^.valeur)\n      ParcoursInfixe(racine^.fils_droit)\n   FinSi\nFinProcédure\n```",
        "astuces": "⚡ **Astuce Concours :** Le parcours **Infixe** d'un Arbre Binaire de Recherche (ABR) produit **toujours** la suite des clés triées par ordre croissant."
    },
    "14. Graphes : Représentation et parcours (DFS, BFS)": {
        "content": """# 14. Graphes : Représentation et Parcours (DFS, BFS)

## 📌 1. Définition et Représentations
Un **graphe** $G = (V, E)$ est composé de sommets (V) et d'arêtes ou arcs (E).

### 2 Modes de Représentation :
1. **Matrice d'Adjacence :** Tableau $N \\times N$ où $M[i][j] = 1$ s'il existe une arête entre $i$ et $j$. Espace : $O(V^2)$.
2. **Liste d'Adjacence :** Tableau de listes chaînées. Espace : $O(V + E)$.

---

## 📌 2. Parcours de Graphes
- **Parcours en Profondeur (DFS - Depth First Search) :** Explore le plus loin possible le long de chaque branche. Repose sur une **Pile** (ou récursivité).
- **Parcours en Largeur (BFS - Breadth First Search) :** Explore les sommets niveau par niveau. Repose sur une **File**.
- **Algorithme de Dijkstra :** Calcule les plus courts chemins depuis une source vers tous les sommets (poids d'arêtes $\\ge 0$).""",
        "examples": "```alg\n// Représentation par Matrice d'Adjacence\nVARIABLES\n   M : Tableau[1..4, 1..4] de Entier\nDÉBUT\n   // M[1,2] = 1 signifie qu'il y a un arc du sommet 1 au sommet 2\nFIN\n```",
        "astuces": "⚡ **Astuce Concours :** Retenez la différence essentielle : **DFS = Pile (ou Récursivité)** tandis que **BFS = File**."
    }
}

def enrich_initial_data():
    with open(INITIAL_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated_count = 0
    for item in data:
        if item.get("model") == "syllabus.course" and item.get("fields", {}).get("subdomain") == "DEV_ALGO":
            title = item["fields"].get("title", "")
            # Find matching key
            for key, enriched in ENRICHED_COURSES.items():
                # Match title prefix or contains
                prefix = key.split('.')[0] # e.g. '01'
                if title.startswith(prefix + '.') or prefix in title:
                    item["fields"]["content"] = enriched["content"]
                    item["fields"]["examples"] = enriched.get("examples", "")
                    item["fields"]["astuces"] = enriched.get("astuces", "")
                    updated_count += 1
                    print(f"Updated Course {prefix}: {title}")
                    break

    with open(INITIAL_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully enriched {updated_count} DEV_ALGO courses in initial_data.json!")

if __name__ == "__main__":
    enrich_initial_data()
