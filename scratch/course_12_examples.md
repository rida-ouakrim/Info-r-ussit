```markdown
## Exemples Détaillés et Exercices Résolus

Considérons le schéma de base de données suivant pour une entreprise fictive:

**Table `Departements`:**
| id_dept | nom_dept    | ville     |
|---------|-------------|-----------|
| 10      | Ventes      | Paris     |
| 20      | Marketing   | Lyon      |
| 30      | IT          | Paris     |
| 40      | RH          | Marseille |
| 50      | Recherche   | NULL      |

**Table `Employes`:**
| id_emp | nom_emp | prenom_emp | id_dept | salaire |
|--------|---------|------------|---------|---------|
| 1      | Dupont  | Jean       | 10      | 50000   |
| 2      | Martin  | Sophie     | 20      | 60000   |
| 3      | Dubois  | Pierre     | 10      | 55000   |
| 4      | Petit   | Marie      | 30      | 70000   |
| 5      | Durand  | Paul       | 30      | 65000   |
| 6      | Leroy   | Anne       | 10      | 48000   |
| 7      | Moreau  | Luc        | NULL    | 40000   |

-- Création des tables (pour test)
CREATE TABLE Departements (
    id_dept INT PRIMARY KEY,
    nom_dept VARCHAR(50),
    ville VARCHAR(50)
);

INSERT INTO Departements (id_dept, nom_dept, ville) VALUES
(10, 'Ventes', 'Paris'),
(20, 'Marketing', 'Lyon'),
(30, 'IT', 'Paris'),
(40, 'RH', 'Marseille'),
(50, 'Recherche', NULL);

CREATE TABLE Employes (
    id_emp INT PRIMARY KEY,
    nom_emp VARCHAR(50),
    prenom_emp VARCHAR(50),
    id_dept INT,
    salaire DECIMAL(10, 2),
    FOREIGN KEY (id_dept) REFERENCES Departements(id_dept)
);

INSERT INTO Employes (id_emp, nom_emp, prenom_emp, id_dept, salaire) VALUES
(1, 'Dupont', 'Jean', 10, 50000),
(2, 'Martin', 'Sophie', 20, 60000),
(3, 'Dubois', 'Pierre', 10, 55000),
(4, 'Petit', 'Marie', 30, 70000),
(5, 'Durand', 'Paul', 30, 65000),
(6, 'Leroy', 'Anne', 10, 48000),
(7, 'Moreau', 'Luc', NULL, 40000);


### Exercice 1: Jointures

**1.1. Afficher le nom de chaque employé et le nom de son département.**

```sql
SELECT E.nom_emp, E.prenom_emp, D.nom_dept
FROM Employes E
INNER JOIN Departements D ON E.id_dept = D.id_dept;
```
**Résultat:**
| nom_emp | prenom_emp | nom_dept  |
|---------|------------|-----------|
| Dupont  | Jean       | Ventes    |
| Martin  | Sophie     | Marketing |
| Dubois  | Pierre     | Ventes    |
| Petit   | Marie      | IT        |
| Durand  | Paul       | IT        |
| Leroy   | Anne       | Ventes    |

**Explication:** Seuls les employés ayant un département correspondant sont affichés. L'employé 'Moreau Luc' n'est pas inclus car son `id_dept` est `NULL`.

**1.2. Afficher tous les départements et, s'ils en ont, les employés qui y travaillent.**

```sql
SELECT D.nom_dept, E.nom_emp, E.prenom_emp
FROM Departements D
LEFT JOIN Employes E ON D.id_dept = E.id_dept;
```
**Résultat:**
| nom_dept  | nom_emp | prenom_emp |
|-----------|---------|------------|
| Ventes    | Dupont  | Jean       |
| Ventes    | Dubois  | Pierre     |
| Ventes    | Leroy   | Anne       |
| Marketing | Martin  | Sophie     |
| IT        | Petit   | Marie      |
| IT        | Durand  | Paul       |
| RH        | NULL    | NULL       |
| Recherche | NULL    | NULL       |

**Explication:** Tous les départements sont listés. Pour 'RH' et 'Recherche', il n'y a pas d'employés, donc les colonnes d'employés sont `NULL`.

**1.3. Afficher tous les employés et, s'il existe, le nom de leur département. Inclure les employés sans département.**

```sql
SELECT E.nom_emp, E.prenom_emp, D.nom_dept
FROM Employes E
LEFT JOIN Departements D ON E.id_dept = D.id_dept;
```
**Résultat:**
| nom_emp | prenom_emp | nom_dept  |
|---------|------------|-----------|
| Dupont  | Jean       | Ventes    |
| Martin  | Sophie     | Marketing |
| Dubois  | Pierre     | Ventes    |
| Petit   | Marie      | IT        |
| Durand  | Paul       | IT        |
| Leroy   | Anne       | Ventes    |
| Moreau  | Luc        | NULL      |

**Explication:** Tous les employés sont listés. 'Moreau Luc' est inclus, et son `nom_dept` est `NULL` car il n'a pas de département assigné.


### Exercice 2: Fonctions d'Agrégation et GROUP BY/HAVING

**2.1. Calculer le salaire moyen de tous les employés.**

```sql
SELECT AVG(salaire) AS salaire_moyen_global
FROM Employes;
```
**Résultat:**
| salaire_moyen_global |
|----------------------|
| 56857.14             |

**2.2. Compter le nombre total d'employés.**

```sql
SELECT COUNT(*) AS nombre_total_employes
FROM Employes;
```
**Résultat:**
| nombre_total_employes |
|-----------------------|
| 7                     |

**2.3. Compter le nombre d'employés par département.**

```sql
SELECT D.nom_dept, COUNT(E.id_emp) AS nombre_employes
FROM Departements D
LEFT JOIN Employes E ON D.id_dept = E.id_dept
GROUP BY D.nom_dept;
```
**Résultat:**
| nom_dept  | nombre_employes |
|-----------|-----------------|
| IT        | 2               |
| Marketing | 1               |
| Recherche | 0               |
| RH        | 0               |
| Ventes    | 3               |

**Explication:** On utilise `LEFT JOIN` pour inclure les départements sans employés. `COUNT(E.id_emp)` compte uniquement les employés non `NULL`.

**2.4. Afficher les départements ayant un salaire moyen supérieur à 55000.**

```sql
SELECT D.nom_dept, AVG(E.salaire) AS salaire_moyen_dept
FROM Departements D
INNER JOIN Employes E ON D.id_dept = E.id_dept
GROUP BY D.nom_dept
HAVING AVG(E.salaire) > 55000;
```
**Résultat:**
| nom_dept  | salaire_moyen_dept |
|-----------|--------------------|
| IT        | 67500.00           |
| Marketing | 60000.00           |

**Explication:** On regroupe par département, puis on filtre ces groupes en fonction de la moyenne des salaires calculée pour chaque groupe.

**2.5. Trouver le département avec le salaire le plus élevé et le plus bas.**

```sql
SELECT D.nom_dept, MAX(E.salaire) AS salaire_max, MIN(E.salaire) AS salaire_min
FROM Departements D
INNER JOIN Employes E ON D.id_dept = E.id_dept
GROUP BY D.nom_dept;
```
**Résultat:**
| nom_dept  | salaire_max | salaire_min |
|-----------|-------------|-------------|
| IT        | 70000.00    | 65000.00    |
| Marketing | 60000.00    | 60000.00    |
| Ventes    | 55000.00    | 48000.00    |
```