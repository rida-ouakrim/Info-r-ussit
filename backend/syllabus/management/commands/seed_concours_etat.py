"""
Management command : seed_concours_etat
Crée le grand domaine CONCOURS_ETAT et ses 7 filières sous-domaines spécialisées.
Injecte les fiches de cours fondamentales pour chaque filière.
"""
from django.core.management.base import BaseCommand
from syllabus.models import Domain, Subdomain, Course

CONCOURS_SUBDOMAINS = [
    {
        "code": "DATA_SCIENCE_IA",
        "name": "Data Scientist & Développeur IA",
        "description": "Machine Learning, Deep Learning (PyTorch/TensorFlow), NLP, Computer Vision, Mathématiques pour l'IA, MLOps et Python Data.",
        "courses": [
            {
                "title": "Fondamentaux du Machine Learning : Algorithmes Supervisés vs Non Supervisés",
                "content": """# Fondamentaux du Machine Learning : Algorithmes Supervisés vs Non Supervisés

> 🎓 **Filière :** Data Scientist & Développeur IA | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

Le Machine Learning (Apprentissage Automatique) est la branche de l'IA qui permet aux systèmes d'apprendre à partir des données sans être explicitement programmés. Dans les concours de la fonction publique (Ministères, ANCFCC, DGI), ce chapitre constitue un socle fondamental.

---

### 1. Apprentissage Supervisé (Supervised Learning)

Dans l'apprentissage supervisé, le modèle s'entraîne sur un ensemble de données étiquetées $\{(x_i, y_i)\}_{i=1}^N$.

*   **Tâche de Régression :** La variable cible $y$ est continue (ex: prédiction de budget, prix, température).
    *   *Algorithmes clés :* Régression Linéaire, Ridge/Lasso, Support Vector Regression (SVR), Arbres de Décision (Decision Trees), Forêts Aléatoires (Random Forests), XGBoost / LightGBM.
*   **Tâche de Classification :** La variable cible $y$ est discrète / catégorielle (ex: détection de fraude fiscale, classification de documents).
    *   *Algorithmes clés :* Régression Logistique, K-Nearest Neighbors (KNN), Naive Bayes, SVM (Support Vector Machines), Random Forest Classifier.

#### Équation de la Régression Linéaire Multiple :
$$\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p = X\beta$$

#### Fonction de Perte Erreur Quadratique Moyenne (MSE) :
$$\text{MSE} = \frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2$$

---

### 2. Apprentissage Non Supervisé (Unsupervised Learning)

Dans l'apprentissage non supervisé, les données n'ont **pas d'étiquettes** $\{x_i\}_{i=1}^N$. Le modèle doit découvrir des structures ou des regroupements sous-jacents.

*   **Clustering (Partitionnement) :** Regroupement de données similaires.
    *   *K-Means :* Algorithme itératif minimisant l'inertie intra-classe.
    *   *DBSCAN :* Clustering basé sur la densité (détecte les formes complexes et le bruit).
    *   *Clustering Hiérarchique (CAH) :* Dendrogramme ascendant ou descendant.
*   **Réduction de Dimensionnalité :**
    *   *PCA (Principal Component Analysis) :* Projection linéaire maximisant la variance tout en réduisant le nombre de variables.
    *   *t-SNE / UMAP :* Visualisation non linéaire en 2D/3D.

---

### 3. Compromis Biais-Variance (Bias-Variance Tradeoff)

L'erreur totale d'un modèle de prédiction se décompose en :

$$\text{Erreur Totale} = \text{Biais}^2 + \text{Variance} + \sigma_{\text{irréductible}}^2$$

*   **Sous-apprentissage (Underfitting / Biais Élevé) :** Le modèle est trop simple (ex: régression linéaire sur des données non linéaires).
*   **Sur-apprentissage (Overfitting / Variance Élevée) :** Le modèle apprend le bruit des données d'entraînement et se généralise mal sur le jeu de test.
*   **Techniques de Régularisation :**
    *   **L1 (Lasso) :** Ajoute $\lambda \sum |\beta_j|$ (favorise la sparsité des variables).
    *   **L2 (Ridge) :** Ajoute $\lambda \sum \beta_j^2$ (réduit l'amplitude des coefficients).
""",
                "examples": """# Exemple Python Scikit-Learn : Entraînement et Évaluation d'une Forêt Aléatoire

import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Génération d'un dataset synthétique
X, y = make_classification(n_samples=1000, n_features=10, n_classes=2, random_state=42)

# 2. Séparation Train / Test (80% / 20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Initialisation et entraînement du modèle Random Forest
clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
clf.fit(X_train, y_train)

# 4. Prédiction et Évaluation
y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]

print("Rapport de classification :")
print(classification_report(y_test, y_pred))
print(f"Score ROC AUC : {roc_auc_score(y_test, y_prob):.4f}")
""",
                "astuces": """⚡ **Pièges et Astuces Concours (Machine Learning) :**

1. **Overfitting & Validation Croisée :** Ne jamais évaluer un modèle sur les mêmes données que l'entraînement ! Utilisez toujours la validation croisée $K$-Fold (`KFold` ou `StratifiedKFold`).
2. **K-Means & Sensibilité aux Échelles :** Toujours normaliser/standardiser les variables (`StandardScaler`) avant d'appliquer K-Means ou KNN, car ils utilisent la distance euclidienne.
3. **Imbalance des Classes :** Lorsque la classe cible est très minoritaire (ex: détection de fraude à 1%), l'exactitude (*Accuracy*) est trompeuse. Utilisez le **F1-Score**, le **Recall** ou l'**AUC-ROC**.
"""
            }
        ]
    },
    {
        "code": "DATA_ENG",
        "name": "Data Engineer & Big Data",
        "description": "Architectures Big Data, Apache Spark (PySpark), Hadoop, Pipelines ETL/ELT, Kafka, Airflow, Data Warehousing & Data Lakes.",
        "courses": [
            {
                "title": "Architecture Big Data & Traitement Distribué avec Apache Spark",
                "content": """# Architecture Big Data & Traitement Distribué avec Apache Spark

> 🎓 **Filière :** Data Engineer & Big Data | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

Apache Spark est un moteur de calcul distribué en mémoire vive (In-Memory Computing) conçu pour traiter de volumineux ensembles de données (*Big Data*) jusqu'à 100 fois plus rapidement que Hadoop MapReduce.

---

### 1. Les 3 V du Big Data
*   **Volume :** Quantité massive de données (Téraoctets, Pétaoctets).
*   **Vélocité :** Vitesse de génération et d'analyse des données (Streaming, Temps réel).
*   **Variété :** Diversité des formats (Données structurées SQL, semi-structurées JSON/XML, non structurées vidéo/texte).

---

### 2. Architecture Interne d'Apache Spark

*   **Driver Node (Nœud Maître) :** Exécute le programme principal (`SparkContext` / `SparkSession`), convertit le code en un graphe orienté acyclique (**DAG - Directed Acyclic Graph**) et distribue les tâches.
*   **Cluster Manager :** Gère les ressources informatiques du cluster (YARN, Kubernetes, Standalone, Mesos).
*   **Worker Nodes (Nœuds Exécuteurs) :** Reçoivent les tâches (*Tasks*), stockent les données en mémoire cache et exécutent le calcul distribué.

```mermaid
graph TD
    Driver["Driver Node (SparkSession)"]
    CM["Cluster Manager (YARN / K8s)"]
    W1["Worker Node 1 (Executor)"]
    W2["Worker Node 2 (Executor)"]

    Driver --> CM
    CM --> W1
    CM --> W2
    Driver -- "Envoie Tasks (DAG)" --> W1
    Driver -- "Envoie Tasks (DAG)" --> W2
```

---

### 3. RDD, DataFrames et Datasets

1.  **RDD (Resilient Distributed Dataset) :** L'abstraction fondamentale de Spark. Immuable, distribuée et tolérante aux pannes.
2.  **DataFrame :** Abstraction organisée en colonnes nommées avec optimisation du plan d'exécution grâce à l'optimiseur **Catalyst**.
3.  **Transformations vs Actions :**
    *   **Transformations (Lazy Evaluation) :** Ne déclenchent pas de calcul immédiat. Construisent le DAG (ex: `map()`, `filter()`, `groupBy()`, `select()`).
    *   **Actions (Eager Evaluation) :** Déclenchent l'exécution effective du DAG et renvoient le résultat au Driver (ex: `count()`, `collect()`, `show()`, `save()`).
""",
                "examples": """# Exemple PySpark : Lecture, Filtrage et Agrégation Distribuée

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, count

# 1. Initialisation de la SparkSession
spark = SparkSession.builder \
    .appName("ConcoursEtatDataEng") \
    .master("local[*]") \
    .getOrCreate()

# 2. Création d'un DataFrame de test
data = [
    ("Informatique", 45000),
    ("Informatique", 52000),
    ("Finance", 60000),
    ("Finance", 65000),
    ("Ressources Humaines", 38000)
]
columns = ["Departement", "Salaire"]

df = spark.createDataFrame(data, columns)

# 3. Transformation & Agrégation
df_filtered = df.filter(col("Salaire") >= 40000) \
                .groupBy("Departement") \
                .agg(
                    count("*").alias("Nombre_Employes"),
                    avg("Salaire").alias("Salaire_Moyen")
                )

# 4. Action (Déclenche le DAG)
df_filtered.show()
""",
                "astuces": """⚡ **Pièges et Astuces Concours (Data Engineering) :**

1. **Lazy Evaluation :** Se souvenir que les transformations Spark (`filter()`, `map()`) sont **fainéantes (*lazy*)**. Aucun calcul n'est effectué tant qu'une **Action** (`count()`, `show()`, `collect()`) n'est pas appelée !
2. **Attention à `collect()` :** La commande `collect()` ramène TOUTES les données distribuées sur le Driver Node. Si le dataset fait plusieurs Téraoctets, cela provoque un crash immédiat Out-Of-Memory (OOM) du Driver !
3. **Partitionnement & Shuffling :** Le *Shuffle* (réorganisation des données à travers le réseau lors d'un `groupBy` ou `join`) est l'opération la plus coûteuse en réseau et CPU.
"""
            }
        ]
    },
    {
        "code": "DATA_ANALYTICS",
        "name": "Data Analyst & Business Intelligence",
        "description": "SQL Avancé, PowerBI, Tableau, Modélisation décisionnelle (Schémas en Étoile/Flocon), Data Warehousing et Statistiques Décisionnelles.",
        "courses": [
            {
                "title": "Modélisation Décisionnelle : Schéma en Étoile (Star Schema) vs Schéma en Flocon (Snowflake)",
                "content": """# Modélisation Décisionnelle : Schéma en Étoile vs Schéma en Flocon

> 🎓 **Filière :** Data Analyst & Business Intelligence | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

Dans les systèmes de Business Intelligence (BI) et Data Warehousing (Entrepôts de Données), la modélisation dimensionnelle (méthode Kimball) est utilisée pour optimiser l'exécution des requêtes décisionnelles analytiques (OLAP) par rapport aux bases de données transactionnelles (OLTP).

---

### 1. Différence Fondamentale OLTP vs OLAP

| Caractéristique | OLTP (Online Transaction Processing) | OLAP (Online Analytical Processing) |
| :--- | :--- | :--- |
| **Objectif** | Gestion des opérations courantes au quotidien | Analyse décisionnelle et reporting |
| **Bases de données** | Modèle entité-association normalisé (3NF) | Modèle dimensionnel (Étoile / Flocon) |
| **Requêtes** | Multiples petites requêtes complexes (INSERT, UPDATE) | Requêtes de lecture complexes (SELECT + GROUP BY) |
| **Volume par requête** | Quelques lignes | Millions de lignes |

---

### 2. Le Schéma en Étoile (Star Schema)

Le schéma en étoile comprend une **Table de Faits** centrale entourée de plusieurs **Tables de Dimensions** dénormalisées.

*   **Table de Faits :** Contient les métriques quantitatives (mesures numériques ex: `Montant_Vente`, `Quantite`) et les clés étrangères vers les dimensions.
*   **Tables de Dimensions :** Contiennent le contexte descriptif des données (ex: `Dim_Client`, `Dim_Temps`, `Dim_Produit`). Elles ne sont pas normalisées.

```mermaid
graph TD
    F["Table de Faits : Ventes (ID_Client, ID_Produit, ID_Temps, Montant)"]
    D1["Dim_Client (ID_Client, Nom, Ville, Pays)"]
    D2["Dim_Produit (ID_Produit, Nom_Produit, Categorie)"]
    D3["Dim_Temps (ID_Temps, Date, Mois, Annee)"]

    F --> D1
    F --> D2
    F --> D3
```

---

### 3. Le Schéma en Flocon (Snowflake Schema)

Le schéma en flocon est une variante du schéma en étoile où les **tables de dimensions sont partiellement ou totalement normalisées** en sous-dimensions.

*   *Avantage :* Réduit la redondance des données descriptives et économise l'espace mémoire.
*   *Inconvénient :* Augmente le nombre de jointures (`JOIN`), ce qui peut ralentir la vitesse d'exécution des requêtes décisionnelles.
""",
                "examples": """-- Exemple SQL OLAP : Requête Décisionnelle avec Window Function (SUM Over / RANK)

SELECT 
    d.Annee,
    d.Mois,
    p.Categorie,
    SUM(f.Montant_Vente) AS Chiffre_Affaires_Total,
    RANK() OVER (PARTITION BY d.Annee ORDER BY SUM(f.Montant_Vente) DESC) AS Rang_Categorie
FROM Fact_Ventes f
JOIN Dim_Temps d ON f.ID_Temps = d.ID_Temps
JOIN Dim_Produit p ON f.ID_Produit = p.ID_Produit
GROUP BY d.Annee, d.Mois, p.Categorie
ORDER BY d.Annee DESC, Chiffre_Affaires_Total DESC;
""",
                "astuces": """⚡ **Pièges et Astuces Concours (Data Analytics & BI) :**

1. **Schéma en Étoile vs Flocon :** Retenez que le **Schéma en Étoile** privilégie la **vitesse d'exécution des requêtes** (moins de jointures), tandis que le **Schéma en Flocon** privilégie l'**absence de redondance** (normalisation 3NF).
2. **Window Functions (`OVER()`) :** Les concours adorent tester les fonctions de fenêtrage (`RANK()`, `DENSE_RANK()`, `ROW_NUMBER()`, `LAG()`, `LEAD()`). Rappelez-vous que `RANK()` saute des numéros en cas d'égalité (ex: 1, 1, 3), alors que `DENSE_RANK()` ne saute aucun numéro (ex: 1, 1, 2).
"""
            }
        ]
    },
    {
        "code": "DBA_ADMIN",
        "name": "Administrateur de Bases de Données (DBA)",
        "description": "PostgreSQL, Oracle Database, MySQL, Tuning SQL, Indexation B-Tree, Transactions & Isolation ACID, Sauvegarde, Restauration & HA.",
        "courses": [
            {
                "title": "Propriétés ACID, Niveaux d'Isolation et Optimisation de Requêtes (SQL Tuning)",
                "content": """# Propriétés ACID, Niveaux d'Isolation et Optimisation de Requêtes (SQL Tuning)

> 🎓 **Filière :** Administrateur de Bases de Données (DBA) | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

L'Administration de Bases de Données (DBA) repose sur le maintien de l'intégrité des données transactionnelles et la garantie de performances élevées même sous forte charge d'accès concourants.

---

### 1. Les Propriétés ACID d'une Transaction

*   **Atomicité (Atomicity) :** La transaction s'exécute entièrement ou pas du tout (*All or Nothing*). Gérée par le journal de transactions (WAL / Redo Log).
*   **Cohérence (Consistency) :** La transaction fait passer la base d'un état valide à un autre état valide en respectant toutes les contraintes d'intégrité (Clés primaires/étrangères, `CHECK`).
*   **Isolation (Isolation) :** Les transactions concourantes ne doivent pas s'interférer mutuellement.
*   **Durabilité (Durability) :** Une fois validée (`COMMIT`), la modification est conservée de manière permanente sur disque même en cas de coupure de courant.

---

### 2. Les 4 Niveaux d'Isolation ANSI SQL

Les niveaux d'isolation contrôlent la protection contre 3 anomalies de concurrence :
1.  **Lecture Sale (Dirty Read) :** Lire des données non encore validées (`COMMIT`) par une autre transaction.
2.  **Lecture Non Répétable (Non-repeatable Read) :** Une même ligne lue deux fois renvoie des valeurs différentes car une autre transaction l'a modifiée et validée entre-temps.
3.  **Lecture Fantôme (Phantom Read) :** Une même requête lue deux fois renvoie un nombre de lignes différent car une autre transaction a inséré ou supprimé des lignes valides.

| Niveau d'Isolation | Lecture Sale | Lecture Non Répétable | Lecture Fantôme |
| :--- | :---: | :---: | :---: |
| **Read Uncommitted** | ❌ Possible | ❌ Possible | ❌ Possible |
| **Read Committed** (Défaut PostgreSQL/Oracle) | ✅ Impossible | ❌ Possible | ❌ Possible |
| **Repeatable Read** | ✅ Impossible | ✅ Impossible | ❌ Possible |
| **Serializable** | ✅ Impossible | ✅ Impossible | ✅ Impossible |

---

### 3. Indexation B-Tree vs Hash Index

*   **Index B-Tree (Balancing Tree) :** L'index par défaut dans PostgreSQL et Oracle. Idéal pour les comparaisons d'égalité (`=`), d'intervalle (`<`, `>`, `BETWEEN`) et le tri (`ORDER BY`).
*   **Index Hash :** Performant uniquement pour les comparaisons d'égalité directe (`=`). Ne gère pas les intervalles.
""",
                "examples": """-- Exemple PostgreSQL DBA : Analyse du Plan d'Exécution et Création d'Index B-Tree

-- 1. Analyse du plan d'exécution sans index (Seq Scan)
EXPLAIN ANALYZE 
SELECT * FROM Utilisateurs 
WHERE email = 'candidat@concours.ma';

-- 2. Création d'un index B-Tree unique
CREATE UNIQUE INDEX idx_utilisateurs_email ON Utilisateurs(email);

-- 3. Analyse du plan d'exécution avec index (Index Scan)
EXPLAIN ANALYZE 
SELECT * FROM Utilisateurs 
WHERE email = 'candidat@concours.ma';
""",
                "astuces": """⚡ **Pièges et Astuces Concours (DBA & SQL) :**

1. **`EXPLAIN ANALYZE` :** `EXPLAIN` donne uniquement l'estimation du coût par l'optimiseur. `EXPLAIN ANALYZE` **exécute réellement la requête** pour mesurer les temps réels en millisecondes.
2. **Sélection de colonnes & `SELECT *` :** Utiliser `SELECT *` empêche le moteur d'utiliser la technique d'**Index Only Scan** (où PostgreSQL lit la réponse directement dans l'index sans toucher à la table sur disque).
3. **Fonctions sur colonnes indexées :** Écrire `WHERE LOWER(email) = '...'` annule l'index standard sur `email` ! Il faut créer un index fonctionnel `CREATE INDEX ON Utilisateurs(LOWER(email))`.
"""
            }
        ]
    },
    {
        "code": "INFO_GEN_GL",
        "name": "Informatique Générale & Génie Logiciel",
        "description": "Algorithmique & Complexité (Big-O), Design Patterns, Architecture Logicielle (MVC, Microservices), POO et Méthodes Agiles.",
        "courses": [
            {
                "title": "Complexité Algorithmique (Big-O) et Patterns de Conception (Design Patterns GoF)",
                "content": """# Complexité Algorithmique (Big-O) et Patterns de Conception (Design Patterns GoF)

> 🎓 **Filière :** Informatique Générale & Génie Logiciel | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

Le Génie Logiciel et l'Algorithmique constituent l'épreuve obligatoire commune dans la quasi-totalité des concours d'État d'Ingénieurs et Techniciens informatiques au Maroc.

---

### 1. Analyse de la Complexité Algorithmique (Notations Grand $O$)

La complexité en temps mesure l'évolution du nombre d'opérations élémentaires exécutées en fonction de la taille $N$ des données d'entrée.

*   $\mathcal{O}(1)$ : **Complexité Constante** (ex: Accès à un élément de tableau par son index).
*   $\mathcal{O}(\log N)$ : **Complexité Logarithmique** (ex: Recherche dichotomique dans un tableau trié).
*   $\mathcal{O}(N)$ : **Complexité Linéaire** (ex: Parcours simple d'un tableau non trié).
*   $\mathcal{O}(N \log N)$ : **Complexité Quasi-linéaire** (ex: Algorithmes de tri efficaces : Tri Fusion / MergeSort, Tri Rapide / QuickSort).
*   $\mathcal{O}(N^2)$ : **Complexité Quadratique** (ex: Tri à bulles, boucles imbriquées).
*   $\mathcal{O}(2^N)$ : **Complexité Exponentielle** (ex: Problème du voyageur de commerce par force brute).

---

### 2. Les Design Patterns de la Bande des Quatre (GoF - Gang of Four)

Les 23 Design Patterns GoF sont répartis en 3 grandes catégories :

#### A. Patterns Créationnels (Creational)
*   **Singleton :** Garantit qu'une classe n'a qu'une seule instance et fournit un point d'accès global.
*   **Factory Method / Abstract Factory :** Dégage l'instanciation d'objets sans spécifier leur classe exacte.
*   **Builder :** Sépare la construction d'un objet complexe de sa représentation.

#### B. Patterns Structurels (Structural)
*   **Adapter :** Permet à des interfaces incompatibles de travailler ensemble.
*   **Decorator :** Ajoute dynamiquement des responsabilités supplémentaires à un objet.
*   **Proxy :** Fournit un intermédiaire pour contrôler l'accès à un objet.

#### C. Patterns Comportementaux (Behavioral)
*   **Observer :** Définit une dépendance 1-à-N entre objets pour notifier les changements d'état (Modèle Événementiel).
*   **Strategy :** Définit une famille d'algorithmes et les rend interchangeables.
""",
                "examples": """// Exemple Java : Implémentation du Design Pattern Singleton (Thread-Safe Bill Pugh)

public class DatabaseConnection {

    // Constructeur privé pour empêcher l'instanciation directe
    private DatabaseConnection() {
        System.out.println("Initialisation du pool de connexion DB...");
    }

    // Classe interne statique responsable de l'instance unique
    private static class Holder {
        private static final DatabaseConnection INSTANCE = new DatabaseConnection();
    }

    // Méthode d'accès globale
    public static DatabaseConnection getInstance() {
        return Holder.INSTANCE;
    }
}
""",
                "astuces": """⚡ **Pièges et Astuces Concours (Génie Logiciel) :**

1. **QuickSort vs MergeSort :** Le tri rapide (*QuickSort*) a une complexité moyenne de $\mathcal{O}(N \log N)$, mais sa complexité au **pire des cas** est $\mathcal{O}(N^2)$ (si le pivot est très mal choisi). Le tri fusion (*MergeSort*) est toujours en $\mathcal{O}(N \log N)$ dans tous les cas.
2. **Principes SOLID :**
   * **S**ingle Responsibility Principle.
   * **O**pen/Closed Principle (Ouvert à l'extension, fermé à la modification).
   * **L**iskov Substitution Principle.
   * **I**nterface Segregation Principle.
   * **D**ependency Inversion Principle.
"""
            }
        ]
    },
    {
        "code": "SYS_CLOUD_DEV",
        "name": "Systèmes, Cloud & DevOps",
        "description": "Administration Linux, Bash, Docker, Kubernetes, CI/CD, AWS/Azure, Virtualisation et Automatisation.",
        "courses": [
            {
                "title": "Conteneurisation avec Docker, Orchestration Kubernetes et Culture DevOps",
                "content": """# Conteneurisation avec Docker, Orchestration Kubernetes et Culture DevOps

> 🎓 **Filière :** Systèmes, Cloud & DevOps | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

La conteneurisation et la démarche DevOps représentent le standard moderne de déploiement d'applications dans le secteur public et privé.

---

### 1. Machine Virtuelle (VM) vs Conteneur Docker

*   **Machine Virtuelle (Hyperviseur) :** Chaque VM embarque un **système d'exploitation invité (Guest OS)** complet, ce qui consomme énormément de RAM et de stockage disque.
*   **Conteneur Docker :** Les conteneurs partagent le **noyau (Kernel) du système hôte**. Ils sont légers, démarrent en quelques secondes et consomment très peu de ressources.

---

### 2. Architecture Kubernetes (K8s)

Kubernetes est la plateforme d'orchestration de conteneurs de référence pour automatiser le déploiement, la mise à l'échelle et la gestion des applications conteneurisées.

*   **Control Plane (Master Node) :**
    *   `kube-apiserver` : Point d'entrée central des commandes (ex: `kubectl`).
    *   `etcd` : Base de données clé-valeur distribuée stockant l'état du cluster.
    *   `kube-scheduler` : Assigne les Pods aux Worker Nodes disponibles.
*   **Worker Node :**
    *   `kubelet` : Agent s'assurant que les conteneurs s'exécutent dans les Pods.
    *   `kube-proxy` : Gère le réseau et la répartition de charge.
    *   **Pod :** La plus petite unité déployable dans Kubernetes (contient 1 ou plusieurs conteneurs).
""",
                "examples": """# Exemple Dockerfile Multistage Build pour Application Python/Flask

# Étape 1 : Build & Dépendances
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Étape 2 : Image Finale Minimale Sécurisée
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .

# Utilisateur non-root pour la sécurité
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000
CMD ["python", "app.py"]
""",
                "astuces": """⚡ **Pièges et Astuces Concours (DevOps & Cloud) :**

1. **Pod Kubernetes :** Un Pod est l'unité de base dans Kubernetes, pas un conteneur individuel ! Un Pod peut héberger plusieurs conteneurs qui partagent le même réseau (`localhost`) et les mêmes volumes.
2. **Commandes Docker Clés :**
   * `docker exec -it <id> bash` : Entrer dans un conteneur interactif.
   * `docker system prune -a` : Nettoyer tous les conteneurs arrêtés, réseaux et images inutilisées.
"""
            }
        ]
    },
    {
        "code": "CYBERSEC",
        "name": "Cybersécurité & Sécurité SI",
        "description": "Cryptographie, Sécurité Réseau, OWASP Top 10, Pentesting, Normes ISO 27001 et IAM.",
        "courses": [
            {
                "title": "Cryptographie (RSA, AES), OWASP Top 10 et Sécurité des Systèmes d'Information",
                "content": """# Cryptographie (RSA, AES), OWASP Top 10 et Sécurité des Systèmes d'Information

> 🎓 **Filière :** Cybersécurité & Sécurité SI | 📌 **Spécialité :** Concours d'État & Administrations

---

## 📌 Résumé Théorique

La sécurité des systèmes d'information est devenue une priorité nationale absolue dans les administrations marocaines (Loi 05-20 relative à la cybersécurité, DGSSI).

---

### 1. Cryptographie Symétrique vs Asymétrique

*   **Chiffrement Symétrique :** Une seule et même clé secrète est utilisée pour le chiffrement et le déchiffrement.
    *   *Avantage :* Très rapide, idéal pour chiffrer de grands volumes de données.
    *   *Algorithmes :* **AES (Advanced Encryption Standard)**, DES (obsolète), 3DES.
*   **Chiffrement Asymétrique :** Utilise une paire de clés : une **clé publique** (diffusée) pour chiffrer et une **clé privée** (gardée secrète) pour déchiffrer.
    *   *Avantage :* Résout le problème de distribution sécurisée des clés.
    *   *Algorithmes :* **RSA**, ECC (Elliptic Curve Cryptography).

---

### 2. Le Top 10 OWASP (Risques de Sécurité Web Majeurs)

1.  **Injection (SQLi, Command Injection) :** L'attaquant envoie des données malveillantes interprétées comme du code.
2.  **Broken Authentication :** Failles dans la gestion des sessions et identifiants.
3.  **Cross-Site Scripting (XSS) :** Injection de scripts JavaScript malveillants exécutés dans le navigateur des victimes.
    *   *XSS Stocké (Stored) / XSS Réfléchi (Reflected).*
4.  **Insecure Deserialization :** Exécution de code à distance via la désérialisation d'objets non contrôlés.
""",
                "examples": """-- Exemple de Prévention contre l'Injection SQL (SQLi) en PHP/PDO

-- ❌ CODE VULNÉRABLE À L'INJECTION SQL :
-- $sql = "SELECT * FROM users WHERE username = '" . $_POST['user'] . "'";

-- ✅ CODE SÉCURISÉ AVEC REQUÊTE PRÉPARÉE (PREPARED STATEMENT) :
$stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = :user');
$stmt->execute(['user' => $_POST['user']]);
$user = $stmt->fetch();
""",
                "astuces": """⚡ **Pièges et Astuces Concours (Cybersécurité) :**

1. **Chiffrement vs Hachage :** Le chiffrement est **réversible** (avec la clé de déchiffrement). Le hachage (ex: SHA-256, BCrypt) est **unidirectionnel et irréversible** ! On hache les mots de passe, on ne les chiffre pas.
2. **Prévention Injection SQL :** La seule vraie protection contre les injections SQL est l'utilisation systématique des **Requêtes Préparées (Prepared Statements / Parameterized Queries)**, pas le simple filtrage de caractères.
"""
            }
        ]
    }
]


class Command(BaseCommand):
    help = "Alimente le domaine CONCOURS_ETAT et ses 7 filières sous-domaines dans PostgreSQL"

    def handle(self, *args, **kwargs):
        domain, created = Domain.objects.get_or_create(
            code="CONCOURS_ETAT",
            defaults={
                "name": "Concours de l'État (IT, Data & IA)",
                "description": "Préparation aux concours d'accès aux administrations publiques, ministères et offices (Ingénieurs, Techniciens, Cadres)."
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS("  [NEW] Domaine CONCOURS_ETAT créé avec succès !"))
        else:
            self.stdout.write("  [OK] Domaine CONCOURS_ETAT existant.")

        created_sub_count = 0
        created_course_count = 0

        for sub_data in CONCOURS_SUBDOMAINS:
            subdomain, sub_created = Subdomain.objects.get_or_create(
                code=sub_data["code"],
                defaults={
                    "domain": domain,
                    "name": sub_data["name"],
                    "description": sub_data["description"]
                }
            )

            if sub_created:
                created_sub_count += 1
                self.stdout.write(f"  [NEW Subdomain] {subdomain.name}")
            else:
                self.stdout.write(f"  [OK Subdomain] {subdomain.name}")

            for c_data in sub_data.get("courses", []):
                course, c_created = Course.objects.get_or_create(
                    subdomain=subdomain,
                    title=c_data["title"],
                    defaults={
                        "content": c_data["content"],
                        "examples": c_data.get("examples", ""),
                        "astuces": c_data.get("astuces", "")
                    }
                )
                if c_created:
                    created_course_count += 1
                    self.stdout.write(f"    + [NEW Course] {course.title}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nInitialisation terminée ! Sous-domaines créés: {created_sub_count} | Cours insérés: {created_course_count}"
            )
        )
