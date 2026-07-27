# Bases de Données Relationnelles et Requêtes SQL (Jointures, Agrégats)

Ce document récapitule les concepts fondamentaux des jointures et des fonctions d'agrégation en SQL, essentiels pour manipuler et analyser des données dans un contexte relationnel.

## 1. Rappels sur les Bases de Données Relationnelles (BDR)

Une BDR organise les données en tables (relations), composées de lignes (enregistrements/tuples) et de colonnes (attributs/champs). Les relations entre tables sont établies via des clés primaires (identifiant unique d'une ligne dans une table) et des clés étrangères (colonne(s) d'une table qui référence(nt) la clé primaire d'une autre table).

## 2. Les Jointures SQL (JOIN)

Les jointures permettent de combiner des lignes de deux ou plusieurs tables basées sur une colonne liée entre elles. Elles sont cruciales pour reconstituer des informations dispersées dans différentes tables.

### 2.1. INNER JOIN (ou JOIN)

Retourne les lignes lorsque la condition de jointure est vraie dans *les deux* tables. C'est la jointure la plus courante.

**Syntaxe:**
```sql
SELECT colonnes
FROM TableA
INNER JOIN TableB ON TableA.colonne_commune = TableB.colonne_commune;
```

### 2.2. LEFT JOIN (ou LEFT OUTER JOIN)

Retourne toutes les lignes de la table de gauche (TableA) et les lignes correspondantes de la table de droite (TableB). Si aucune correspondance n'est trouvée dans TableB, les colonnes de TableB contiendront des valeurs `NULL`.

**Syntaxe:**
```sql
SELECT colonnes
FROM TableA
LEFT JOIN TableB ON TableA.colonne_commune = TableB.colonne_commune;
```

### 2.3. RIGHT JOIN (ou RIGHT OUTER JOIN)

Retourne toutes les lignes de la table de droite (TableB) et les lignes correspondantes de la table de gauche (TableA). Si aucune correspondance n'est trouvée dans TableA, les colonnes de TableA contiendront des valeurs `NULL`.

**Syntaxe:**
```sql
SELECT colonnes
FROM TableA
RIGHT JOIN TableB ON TableA.colonne_commune = TableB.colonne_commune;
```

### 2.4. FULL OUTER JOIN

Retourne toutes les lignes lorsqu'il y a une correspondance dans l'une des tables. Si aucune correspondance n'est trouvée, les colonnes de la table non correspondante contiendront des valeurs `NULL`. (Support variable selon les SGBD, ex: MySQL ne le supporte pas directement, mais peut être simulé avec `UNION` de `LEFT JOIN` et `RIGHT JOIN`).

**Syntaxe (conceptuelle):**
```sql
SELECT colonnes
FROM TableA
FULL OUTER JOIN TableB ON TableA.colonne_commune = TableB.colonne_commune;
```

### 2.5. CROSS JOIN

Produit cartésien de deux tables. Chaque ligne de la première table est combinée avec chaque ligne de la seconde table. À utiliser avec prudence, car le nombre de résultats peut être très élevé.

**Syntaxe:**
```sql
SELECT colonnes
FROM TableA
CROSS JOIN TableB;
-- Ou implicitement:
SELECT colonnes
FROM TableA, TableB;
```

### 2.6. SELF JOIN

Une table est jointe à elle-même. Utile pour comparer des lignes au sein de la même table (ex: trouver des employés qui ont le même manager).

**Syntaxe:**
```sql
SELECT A.colonne1, B.colonne2
FROM TableA AS A
INNER JOIN TableA AS B ON A.colonne_id = B.colonne_ref;
```

## 3. Les Fonctions d'Agrégation SQL

Les fonctions d'agrégation effectuent un calcul sur un ensemble de lignes et retournent une seule valeur. Elles sont souvent utilisées avec la clause `GROUP BY`.

*   `COUNT()`: Compte le nombre de lignes.
    *   `COUNT(*)`: Compte toutes les lignes, y compris celles avec des `NULL`.
    *   `COUNT(colonne)`: Compte les lignes où `colonne` n'est pas `NULL`.
    *   `COUNT(DISTINCT colonne)`: Compte le nombre de valeurs uniques non `NULL` dans `colonne`.
*   `SUM(colonne)`: Calcule la somme des valeurs numériques d'une colonne.
*   `AVG(colonne)`: Calcule la moyenne des valeurs numériques d'une colonne.
*   `MIN(colonne)`: Retourne la valeur minimale d'une colonne.
*   `MAX(colonne)`: Retourne la valeur maximale d'une colonne.

**Syntaxe générale:**
```sql
SELECT fonction_agregation(colonne)
FROM Table;
```

## 4. La Clause GROUP BY

La clause `GROUP BY` regroupe les lignes qui ont les mêmes valeurs dans une ou plusieurs colonnes en un seul résumé. Les fonctions d'agrégation sont ensuite appliquées à chaque groupe.

**Syntaxe:**
```sql
SELECT colonne_groupement, fonction_agregation(colonne)
FROM Table
GROUP BY colonne_groupement;
```

## 5. La Clause HAVING

La clause `HAVING` est utilisée pour filtrer les groupes créés par `GROUP BY`. Contrairement à `WHERE` qui filtre les lignes *avant* le regroupement, `HAVING` filtre les groupes *après* le regroupement et l'application des fonctions d'agrégation.

**Syntaxe:**
```sql
SELECT colonne_groupement, fonction_agregation(colonne)
FROM Table
GROUP BY colonne_groupement
HAVING condition_sur_agregat;
```

## 6. Ordre d'exécution logique des clauses SQL

Comprendre l'ordre d'exécution est crucial pour écrire des requêtes complexes:
1.  `FROM` et `JOIN` (détermine l'ensemble de données initial)
2.  `WHERE` (filtre les lignes individuelles)
3.  `GROUP BY` (regroupe les lignes restantes)
4.  `HAVING` (filtre les groupes)
5.  `SELECT` (sélectionne et calcule les expressions finales)
6.  `ORDER BY` (trie le jeu de résultats final)
7.  `LIMIT`/`OFFSET` (limite le nombre de résultats)