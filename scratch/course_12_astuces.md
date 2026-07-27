```markdown
## Astuces, Pièges et Formules Clés pour l'Examen

### 1. Pièges Courants à Éviter

*   **Oubli de la condition `ON` pour les jointures:** Sans `ON` (ou `USING`), un `INNER JOIN` ou `LEFT/RIGHT JOIN` se comporte comme un `CROSS JOIN`, générant un produit cartésien (chaque ligne de la première table avec chaque ligne de la seconde), ce qui est rarement souhaité et peut entraîner des résultats massifs et incorrects.
*   **Confusion `WHERE` vs `HAVING`:**
    *   `WHERE` filtre les *lignes individuelles* AVANT le regroupement (`GROUP BY`). Il ne peut pas utiliser de fonctions d'agrégation.
    *   `HAVING` filtre les *groupes* APRES le regroupement. Il est utilisé pour appliquer des conditions sur les résultats des fonctions d'agrégation.
    *   **Règle d'or:** Si la condition s'applique à une colonne non agrégée, utilisez `WHERE`. Si elle s'applique à une fonction d'agrégation, utilisez `HAVING`.
*   **`NULL` et Fonctions d'Agrégation:**
    *   `COUNT(colonne)` ignore les valeurs `NULL` dans la colonne spécifiée.
    *   `COUNT(*)` compte toutes les lignes, y compris celles contenant des `NULL`.
    *   `SUM()`, `AVG()`, `MIN()`, `MAX()` ignorent les valeurs `NULL` dans leurs calculs. Cela peut affecter la moyenne ou la somme si des valeurs sont manquantes.
*   **Alias de table manquants ou incorrects:** Lors de jointures ou d'auto-jointures, l'utilisation d'alias (`AS`) est essentielle pour la clarté et pour éviter les ambiguïtés (ex: `E.nom_emp` au lieu de `Employes.nom_emp`). Pour les auto-jointures, ils sont obligatoires.
*   **`DISTINCT` avec `COUNT`:** `COUNT(DISTINCT colonne)` est très utile pour compter le nombre de valeurs uniques. Ne pas oublier `DISTINCT` si c'est ce qui est demandé.

### 2. Formules Clés et Rappels Rapides

*   **Structure de requête SQL typique (ordre logique d'exécution):**
    `SELECT [DISTINCT] colonnes_ou_expressions`
    `FROM Table1`
    `[JOIN Table2 ON condition_de_jointure]`
    `[WHERE condition_de_filtrage_lignes]`
    `[GROUP BY colonne_de_groupement]`
    `[HAVING condition_de_filtrage_groupes]`
    `[ORDER BY colonne_de_tri [ASC|DESC]]`
    `[LIMIT nombre_de_lignes]`

*   **Types de Jointures (synthèse):**
    *   `INNER JOIN`: Intersection (correspondances des deux côtés).
    *   `LEFT JOIN`: Tout de gauche + correspondances de droite (NULL si pas de correspondance).
    *   `RIGHT JOIN`: Tout de droite + correspondances de gauche (NULL si pas de correspondance).
    *   `FULL OUTER JOIN`: Tout des deux côtés (NULL si pas de correspondance de l'un ou l'autre).

*   **Fonctions d'Agrégation:**
    *   `COUNT(*)`: Nombre total de lignes.
    *   `COUNT(colonne)`: Nombre de valeurs non NULL dans `colonne`.
    *   `SUM(colonne)`: Somme des valeurs.
    *   `AVG(colonne)`: Moyenne des valeurs.
    *   `MIN(colonne)`: Valeur minimale.
    *   `MAX(colonne)`: Valeur maximale.

### 3. Conseils pour l'Examen

*   **Lisez attentivement la question:** Identifiez les informations demandées, les tables impliquées, les conditions de filtrage et si un regroupement ou une agrégation est nécessaire.
*   **Décomposez la requête:** Pour les requêtes complexes, commencez par la clause `FROM` et les `JOIN` pour construire l'ensemble de données de base. Ajoutez ensuite `WHERE`, puis `GROUP BY`, `HAVING`, et enfin `SELECT` et `ORDER BY`.
*   **Utilisez des alias:** Rendez vos requêtes plus lisibles et plus courtes, surtout avec plusieurs tables ou des auto-jointures.
*   **Testez mentalement les cas limites:** Que se passe-t-il si une table est vide ? Si une colonne contient des `NULL` ? Si aucune correspondance n'est trouvée pour une jointure ?
*   **Performance (rappel rapide):** Bien que moins souvent évalué directement en SQL pur, sachez que l'indexation des colonnes utilisées dans les conditions `ON`, `WHERE`, `GROUP BY` et `ORDER BY` est cruciale pour la performance des requêtes sur de grandes bases de données.
*   **Pratiquez les auto-jointures:** C'est un concept qui déroute souvent mais qui est très puissant pour des problèmes comme trouver des paires, des hiérarchies, etc.

En maîtrisant ces concepts et en étant vigilant aux pièges, vous serez bien préparé pour les questions sur les jointures et les agrégats en SQL.
```