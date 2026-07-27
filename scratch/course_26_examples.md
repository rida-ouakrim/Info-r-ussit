```markdown
## Exercice Résolu : Analyse de Ventes Mensuelles

Considérons un tableau de données de ventes pour une entreprise fictive, avec les colonnes suivantes :
*   `Date`
*   `Produit`
*   `Catégorie`
*   `Région`
*   `Quantité`
*   `Prix Unitaire`
*   `Chiffre d'Affaires` (calculé : `Quantité * Prix Unitaire`)

**Objectif** : Répondre aux questions d'analyse suivantes en utilisant les fonctionnalités d'Excel.

| Date       | Produit    | Catégorie | Région  | Quantité | Prix Unitaire | Chiffre d'Affaires |
|:-----------|:-----------|:----------|:--------|:---------|:--------------|:-------------------| 
| 01/01/2023 | Produit A  | Électronique | Nord    | 10       | 150           | 1500               |
| 05/01/2023 | Produit B  | Vêtements | Sud     | 25       | 30            | 750                |
| 10/01/2023 | Produit C  | Maison    | Est     | 5        | 200           | 1000               |
| 15/01/2023 | Produit A  | Électronique | Ouest   | 8        | 150           | 1200               |
| 20/01/2023 | Produit B  | Vêtements | Nord    | 15       | 30            | 450                |
| 25/01/2023 | Produit D  | Électronique | Sud     | 12       | 100           | 1200               |
| 01/02/2023 | Produit C  | Maison    | Est     | 7        | 200           | 1400               |
| 05/02/2023 | Produit A  | Électronique | Nord    | 12       | 150           | 1800               |
| 10/02/2023 | Produit D  | Électronique | Ouest   | 10       | 100           | 1000               |
| 15/02/2023 | Produit B  | Vêtements | Sud     | 20       | 30            | 600                |

### Question 1 : Calculer le Chiffre d'Affaires total par Catégorie de Produit.

**Solution avec Tableau Croisé Dynamique (TCD)** :
1.  Sélectionnez l'ensemble de vos données (par exemple, de A1 à G11).
2.  Allez dans `Insertion > Tableau croisé dynamique`.
3.  Dans le volet des champs du TCD :
    *   Faites glisser `Catégorie` dans la zone `Lignes`.
    *   Faites glisser `Chiffre d'Affaires` dans la zone `Valeurs`. Assurez-vous que la fonction de synthèse est `Somme`.

**Résultat du TCD** :

| Étiquettes de ligne | Somme de Chiffre d'Affaires |
|:--------------------|:----------------------------|
| Électronique        | 6700                        |
| Maison              | 2400                        |
| Vêtements           | 1800                        |
| **Total général**   | **10900**                   |

### Question 2 : Trouver le 2ème produit le plus vendu (en termes de Chiffre d'Affaires) et son Chiffre d'Affaires.

**Solution avec `GRANDE.VALEUR`, `EQUIV` et `INDEX`** :

Supposons que votre colonne `Produit` est en `B` et `Chiffre d'Affaires` en `G`.

1.  **Calculer le 2ème plus grand Chiffre d'Affaires** :
    *   `=GRANDE.VALEUR(G2:G11; 2)`
    *   *Résultat pour l'exemple :* `1800`

2.  **Trouver la position de ce Chiffre d'Affaires dans la liste** :
    *   `=EQUIV(GRANDE.VALEUR(G2:G11; 2); G2:G11; 0)`
    *   *Résultat pour l'exemple :* `7` (correspond à la 7ème ligne de la plage G2:G11, soit G8)

3.  **Récupérer le nom du produit correspondant à cette position** :
    *   `=INDEX(B2:B11; EQUIV(GRANDE.VALEUR(G2:G11; 2); G2:G11; 0))`
    *   *Résultat pour l'exemple :* `Produit A`

**Formule complète pour le produit** :
`=INDEX(B2:B11; EQUIV(GRANDE.VALEUR(G2:G11; 2); G2:G11; 0))`

**Formule complète pour le CA** :
`=GRANDE.VALEUR(G2:G11; 2)`

### Question 3 : Calculer le Chiffre d'Affaires total pour les ventes du