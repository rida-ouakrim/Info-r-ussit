import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# Module 10 GDrive Video Link
MODULE_10_GDRIVE = "https://drive.google.com/file/d/1hFn7qnqmJryUFwMcU5BGonY0Y-hGkgHy/view?usp=sharing"

# Module 11 Content
MOD_11_CONTENT = """# 11. Algorithmes de Tri et Recherche

## 1. Introduction aux Algorithmes de Tri
Le tri consiste à réorganiser les éléments d'un tableau selon un ordre (croissant ou décroissant).

### Classification des Tris :
- **Tris par comparaison** : Tri à bulles, Sélection, Insertion, QuickSort, MergeSort.
- **Tris stables** : Préservent l'ordre relatif des éléments égaux (ex: Tri à bulles, Insertion, MergeSort).
- **Tris en place ($O(1)$ mémoire)** : N'utilisent pas de tableau auxiliaire (ex: Tri à bulles, Sélection, Insertion, QuickSort).

---

## 2. Tri à Bulles (Bubble Sort)
Compare de manière répétée les couples d'éléments adjacents et les échange s'ils sont dans le mauvais ordre.
- **Complexité Temporelle** : Pire cas $O(N^2)$, Meilleur cas $O(N)$ (si optimisé avec un drapeau d'échange).
- **Complexité Spatiale** : $O(1)$ (En place).

### Pseudo-code du Tri à Bulles Optimisé
```pseudo
Algorithme TriBullesOptimise
Variables
    T : Tableau[1..N] de Entier
    i, temp : Entier
    echange : Booléen
Début
    Répéter
        echange <- Faux
        Pour i de 1 à N-1 Faire
            Si (T[i] > T[i+1]) Alors
                temp <- T[i]
                T[i] <- T[i+1]
                T[i+1] <- temp
                echange <- Vrai
            FinSi
        FinPour
    Jusqu'à (NON echange)
Fin
```

---

## 3. Tri par Sélection (Selection Sort)
Recherche le plus petit élément du tableau non trié et l'échange avec l'élément à la position courante.
- **Complexité Temporelle** : $O(N^2)$ dans TOUS les cas (pire, moyen, meilleur).
- **Complexité Spatiale** : $O(1)$ (Non stable).

### Pseudo-code du Tri par Sélection
```pseudo
Algorithme TriSelection
Variables
    T : Tableau[1..N] de Entier
    i, j, minIdx, temp : Entier
Début
    Pour i de 1 à N-1 Faire
        minIdx <- i
        Pour j de i+1 à N Faire
            Si (T[j] < T[minIdx]) Alors
                minIdx <- j
            FinSi
        FinPour
        Si (minIdx <> i) Alors
            temp <- T[i]
            T[i] <- T[minIdx]
            T[minIdx] <- temp
        FinSi
    FinPour
Fin
```

---

## 4. Tri par Insertion (Insertion Sort)
Prend un élément et l'insère à sa position exacte dans la sous-partie déjà triée (analogie avec le jeu de cartes).
- **Complexité Temporelle** : Pire cas $O(N^2)$, Meilleur cas $O(N)$ (si tableau déjà trié).
- **Complexité Spatiale** : $O(1)$ (Stable).

### Pseudo-code du Tri par Insertion
```pseudo
Algorithme TriInsertion
Variables
    T : Tableau[1..N] de Entier
    i, j, cle : Entier
Début
    Pour i de 2 à N Faire
        cle <- T[i]
        j <- i - 1
        TantQue (j >= 1 ET T[j] > cle) Faire
            T[j+1] <- T[j]
            j <- j - 1
        FinTantQue
        T[j+1] <- cle
    FinPour
Fin
```

---

## 5. Tri Rapide (QuickSort)
Algorithme de type *Diviser pour Régner*. Sélectionne un **pivot**, réorganise le tableau de sorte que les éléments inférieurs au pivot soient à gauche et les supérieurs à droite, puis trie récursivement les deux parties.
- **Complexité Temporelle** : Moyenne $O(N \log N)$, Pire cas $O(N^2)$ (pivot mal choisi sur tableau trié).
- **Complexité Spatiale** : $O(\log N)$ (pile d'appels récursifs).

---

## 6. Tri Fusion (MergeSort)
Divise le tableau en deux moitiés égales, trie chaque moitié de manière récursive, puis **fusionne** les deux moitiés triées.
- **Complexité Temporelle** : Garantie $O(N \log N)$ dans tous les cas !
- **Complexité Spatiale** : $O(N)$ (nécessite un tableau temporaire auxiliaire).

---

## 7. Algorithmes de Recherche

### A. Recherche Séquentielle (Linéaire)
Parcourt le tableau élément par élément de $1$ à $N$.
- **Condition** : Fonctionne sur tableau **trié ou non trié**.
- **Complexité** : $O(N)$.

### B. Recherche Dichotomique (Binary Search)
Divise l'espace de recherche par 2 à chaque étape en comparant l'élément cherché avec l'élément du milieu.
- **Condition OBLIGATOIRE** : Le tableau doit être **strictement trié** !
- **Complexité** : $O(\log N)$."""

MOD_11_EXAMPLES = """### Exemple Complet : Simulation de la Recherche Dichotomique
Chercher la valeur `14` dans le tableau trié : `T = [2, 5, 8, 12, 14, 18, 25]` (N = 7).

1. **Étape 1** : `deb = 1`, `fin = 7`
   - `milieu = (1 + 7) DIV 2 = 4` -> `T[4] = 12`
   - `14 > 12` -> La valeur cherchée est à droite ! Donc `deb = 5`.

2. **Étape 2** : `deb = 5`, `fin = 7`
   - `milieu = (5 + 7) DIV 2 = 6` -> `T[6] = 18`
   - `14 < 18` -> La valeur cherchée est à gauche ! Donc `fin = 5`.

3. **Étape 3** : `deb = 5`, `fin = 5`
   - `milieu = (5 + 5) DIV 2 = 5` -> `T[5] = 14`
   - `T[5] = 14` -> **Élément trouvé à l'indice 5 en seulement 3 comparaisons !**"""

MOD_11_ASTUCES = """⚡ **Tableau Récapitulatif Concours CRMEF :**

| Algorithme | Pire Cas (Temps) | Meilleur Cas | Stabilité | Mémoire |
|---|---|---|---|---|
| **Tri à Bulles** | $O(N^2)$ | $O(N)$ | Oui | $O(1)$ |
| **Tri Sélection** | $O(N^2)$ | $O(N^2)$ | Non | $O(1)$ |
| **Tri Insertion** | $O(N^2)$ | $O(N)$ | Oui | $O(1)$ |
| **QuickSort** | $O(N^2)$ | $O(N \log N)$ | Non | $O(\log N)$ |
| **MergeSort** | $O(N \log N)$ | $O(N \log N)$ | Oui | $O(N)$ |
| **Recherche Dicho** | $O(\log N)$ | $O(1)$ | N/A | $O(1)$ |

⚡ **Règle Pédagogique Concours :**
- Si le tableau n'est PAS trié $\rightarrow$ Seule la recherche séquentielle $O(N)$ est possible.
- Pour effectuer la recherche dichotomique $\rightarrow$ Il faut OBLIGATOIREMENT trier le tableau au préalable !"""


# Module 13 Content
MOD_13_CONTENT = """# 13. Arbres Binaires et Arbres Binaires de Recherche (ABR)

## 1. Définitions et Vocabulaire
Un **Arbre Binaire** est une structure de données hiérarchique où chaque nœud possède au plus **deux enfants** (appelés fils gauche et fils droit).

### Terminologie essentielle :
- **Racine** : Le nœud au sommet de l'arbre (sans parent).
- **Feuille** : Nœud sans aucun enfant (fils gauche = NULL et fils droit = NULL).
- **Hauteur (Profondeur $H$)** : Longueur du plus long chemin de la racine à une feuille.
- **Taille $N$** : Nombre total de nœuds de l'arbre.

---

## 2. Arbre Binaire de Recherche (ABR / BST)
Un **Arbre Binaire de Recherche** est un arbre binaire vérifiant la propriété suivante pour **chaque nœud $N$** :
- Toutes les clés du sous-arbre **gauche** sont strictement **inférieures** à la clé de $N$.
- Toutes les clés du sous-arbre **droit** sont strictement **supérieures** à la clé de $N$.

### Exemple d'Arbre Binaire de Recherche (ABR) :
```alg
       8
     /   \\
    3     10
   / \\      \\
  1   6      14
     / \\     /
    4   7   13
```

---

## 3. Les Parcours d'Arbres Binaires

### A. Parcours Infixe (In-Order Traversal)
Ordre : **Sous-arbre Gauche $\rightarrow$ Racine $\rightarrow$ Sous-arbre Droit**
- **Propriété Fondamentale Concours** : Le parcours infixe d'un ABR donne TOUJOURS la liste des clés **triées en ordre croissant** !
- Résultat sur l'arbre exemple : `1, 3, 4, 6, 7, 8, 10, 13, 14`.

### B. Parcours Préfixe (Pre-Order Traversal)
Ordre : **Racine $\rightarrow$ Sous-arbre Gauche $\rightarrow$ Sous-arbre Droit**
- Utilisé pour copier un arbre.
- Résultat sur l'arbre exemple : `8, 3, 1, 6, 4, 7, 10, 14, 13`.

### C. Parcours Postfixe (Post-Order Traversal)
Ordre : **Sous-arbre Gauche $\rightarrow$ Sous-arbre Droit $\rightarrow$ Racine**
- Utilisé pour libérer la mémoire ou évaluer des expressions arithmétiques.
- Résultat sur l'arbre exemple : `1, 4, 7, 6, 3, 13, 14, 10, 8`.

---

## 4. Complexité des Opérations sur ABR
- **Recherche / Insertion / Suppression** :
  - **Cas Moyen (Arbre Équilibré)** : $O(\log N)$
  - **Pire Cas (Arbre Dégénéré/Filiforme)** : $O(N)$ (lorsque l'arbre ressemble à une liste chaînée)."""

MOD_13_EXAMPLES = """### Exemple de Structure et Recherche Récursive en C

```c
typedef struct Node {
    int key;
    struct Node *left;
    struct Node *right;
} Node;

// Fonction de recherche dans un ABR
Node* search(Node* root, int val) {
    if (root == NULL || root->key == val)
        return root;
    
    if (val < root->key)
        return search(root->left, val);
    
    return search(root->right, val);
}
```"""

MOD_13_ASTUCES = """⚡ **Formules et Pièges Concours CRMEF :**
- **Hauteur minimale** d'un arbre binaire à $N$ nœuds : $H_{min} = \lfloor \log_2(N) \rfloor$.
- **Nombre max de nœuds** pour une hauteur $H$ : $N_{max} = 2^{H+1} - 1$.
- **Règle d'or** : Le parcours **INFIXE** d'un ABR affiche toujours les éléments triés par ordre croissant !"""


# Module 14 Content
MOD_14_CONTENT = """# 14. Graphes : Représentation et Parcours (DFS, BFS)

## 1. Définition et Notions de Base
Un **Graphe** $G = (V, E)$ est une structure composée :
- D'un ensemble de **Sommets** (Vertices $V$).
- D'un ensemble d'**Arêtes** (Edges $E$) reliant les sommets (ou **Arcs** si le graphe est orienté).

---

## 2. Représentations en Mémoire

### A. Matrice d'Adjacence
Matrice carrée $M$ de taille $N \times N$ où $M[i][j] = 1$ s'il existe une arête entre le sommet $i$ et $j$, $0$ sinon.
- **Complexité Spatiale** : $O(N^2)$ (Indépendant du nombre d'arêtes).
- **Accès rapide** : Vérifier si $(i, j)$ existe en $O(1)$.

### B. Liste d'Adjacence
Tableau de $N$ listes chaînées où chaque sous-liste contient la liste des voisins du sommet.
- **Complexité Spatiale** : $O(N + E)$ (Idéal pour les graphes creux).

---

## 3. Algorithmes de Parcours de Graphes

### A. Parcours en Profondeur (DFS - Depth First Search)
Explore le graphe en allant le plus loin possible le long de chaque branche avant de faire un retour en arrière (*backtracking*).
- **Structure utilisée** : **Pile (Stack)** ou **Récursivité**.
- **Applications** : Détection de cycles, composantes connexes, tri topologique.
- **Complexité** : $O(N + E)$.

### B. Parcours en Largeur (BFS - Breadth First Search)
Explore le graphe niveau par niveau (tous les voisins à la distance 1, puis distance 2...).
- **Structure utilisée** : **File (Queue - FIFO)**.
- **Applications** : Calcul du **plus court chemin** (en nombre d'arêtes) dans un graphe non pondéré.
- **Complexité** : $O(N + E)$.

---

## 4. Algorithme du Plus Court Chemin (Dijkstra)
Calcule les plus courts chemins depuis un sommet source vers tous les autres sommets dans un graphe à poids positifs.
- **Complexité** : $O(E \log N)$ avec une file de priorité (tas binaire)."""

MOD_14_EXAMPLES = """### Exemple de Comparaison DFS (Pile) vs BFS (File)

```pseudo
// Parcours BFS (En Largeur)
Procédure BFS(graphe G, sommet source s)
Variables
    F : File
    visite : Tableau[1..N] de Booléen
Début
    Enfiler(F, s)
    visite[s] <- Vrai
    TantQue (NON FileVide(F)) Faire
        u <- Défiler(F)
        Ecrire(u)
        Pour chaque voisin v de u dans G Faire
            Si (NON visite[v]) Alors
                visite[v] <- Vrai
                Enfiler(F, v)
            FinSi
        FinPour
    FinTantQue
FinProcédure
```"""

MOD_14_ASTUCES = """⚡ **Clés du Concours CRMEF sur les Graphes :**
- **BFS (Breadth-First)** = **File (Queue)** $\rightarrow$ Recherche du plus court chemin dans un graphe non pondéré.
- **DFS (Depth-First)** = **Pile (Stack / Récursivité)** $\rightarrow$ Exploration complète, détection de cycles.
- **Degré d'un sommet** : Nombre d'arêtes incidentes. Somme des degrés = $2 \times |E|$.
- **Matrice d'adjacence d'un graphe non orienté** : Toujours **symétrique** par rapport à la diagonale principale !"""

def enrich_modules():
    print("Updating Module 10 Video URL and enriching Modules 11, 13, 14 content...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            # 1. Module 10 GDrive Video
            cursor.execute(f"UPDATE {table_name} SET video_url = ? WHERE title LIKE '10.%'", (MODULE_10_GDRIVE,))
            
            # 2. Module 11 (No video, enriched content)
            cursor.execute(f"UPDATE {table_name} SET video_url = NULL, content = ?, examples = ?, astuces = ? WHERE title LIKE '11.%'",
                           (MOD_11_CONTENT, MOD_11_EXAMPLES, MOD_11_ASTUCES))
            
            # 3. Module 13 (No video, enriched content)
            cursor.execute(f"UPDATE {table_name} SET video_url = NULL, content = ?, examples = ?, astuces = ? WHERE title LIKE '13.%'",
                           (MOD_13_CONTENT, MOD_13_EXAMPLES, MOD_13_ASTUCES))
            
            # 4. Module 14 (No video, enriched content)
            cursor.execute(f"UPDATE {table_name} SET video_url = NULL, content = ?, examples = ?, astuces = ? WHERE title LIKE '14.%'",
                           (MOD_14_CONTENT, MOD_14_EXAMPLES, MOD_14_ASTUCES))

            conn.commit()
            print(f"Updated database: {db_path}")
            conn.close()

if __name__ == "__main__":
    enrich_modules()
    print("Enrichment complete!")
