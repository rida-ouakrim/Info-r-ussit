// Generated SQL Lessons Dataset
export const sqlLessons = [
  {
    "num": 1,
    "title": "Introduction à MySQL et aux SGBD",
    "title_ar": "مقدمة حول MySQL وقواعد البيانات",
    "duration": "8 min",
    "video_url": "https://drive.google.com/file/d/15I6q8nN9IbmefA98dNIPxPiSbthlF8RG/view?usp=sharing",
    "content": "# Leçon 01 : Introduction à MySQL et aux SGBD\n\n## 1. Cadre Général & Définition\nUne **Base de Données (BDD)** est un conteneur numérique permettant de stocker, organiser et sécuriser des données de manière persistante.\nUn **SGBD (Système de Gestion de Base de Données)** ou *DBMS* est le logiciel serveur qui permet d'administrer et d'interagir avec ces bases de données.\n\n**MySQL** est le SGBDR (Relationnel) open-source le plus utilisé au monde. Il communique via le langage standardisé **SQL (Structured Query Language)**.\n\n## 2. Caractéristiques de MySQL\n* **Modèle relationnel** : Les données sont organisées en tables interconnectées.\n* **Architecture Client-Serveur** : Le client (CLI, phpMyAdmin, DBeaver) envoie des requêtes SQL au serveur MySQL (port 3306 par défaut).\n* **Multi-utilisateurs & Sécurité** : Gestion fine des privilèges d'accès (`GRANT`, `REVOKE`).\n* **Moteurs de stockage** : InnoDB (supporte les transactions ACID et les clés étrangères) et MyISAM.\n\n## 3. Synthèse\n* SQL = Langage de commande universel.\n* MySQL = Le moteur serveur qui exécute les commandes SQL.",
    "examples": "-- Vérifier la version de MySQL\nSELECT VERSION();\n\n-- Afficher la date et l'heure actuelles du serveur\nSELECT NOW();\n\n-- Afficher l'utilisateur connecté\nSELECT USER();",
    "astuces": "⚡ **Conseil Concours :**\n* Le port standard par défaut de MySQL est **3306**.\n* Le moteur de stockage par défaut recommandé pour le respect des transactions ACID et des clés étrangères est **InnoDB**.",
    "quiz": [
      {
        "id": 201,
        "question_number": "Q1",
        "question_text": "Quel est le port réseau standard par défaut utilisé par le serveur MySQL ?",
        "option_a": "80",
        "option_b": "8080",
        "option_c": "3306",
        "option_d": "5432",
        "correct_option": "C",
        "explanation": "Le port par défaut de MySQL est 3306. (5432 est celui de PostgreSQL, 80 HTTP).",
        "astuce": "Retenez : MySQL = 3306."
      },
      {
        "id": 202,
        "question_number": "Q2",
        "question_text": "Quel moteur de stockage MySQL prend en charge les clés étrangères et les transactions ACID ?",
        "option_a": "MyISAM",
        "option_b": "MEMORY",
        "option_c": "InnoDB",
        "option_d": "CSV",
        "correct_option": "C",
        "explanation": "InnoDB est le moteur transactionnel par défaut de MySQL assurant l'intégrité référentielle.",
        "astuce": "InnoDB = Transactions + Clés étrangères."
      }
    ]
  },
  {
    "num": 2,
    "title": "Premier Code SQL et Prise en Main",
    "title_ar": "أول كود SQL والتفاعل مع السيرفر",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1RDRt9Wny608Io2BjjBOBicImoOh19cbX/view?usp=sharing",
    "content": "# Leçon 02 : Premier Code SQL et Prise en Main\n\n## 1. Environnement d'Exécution\nPour exécuter vos commandes SQL, vous pouvez utiliser :\n* L'invite de commandes / Terminal : `mysql -u root -p`\n* Des interfaces graphiques : MySQL Workbench, phpMyAdmin, DBeaver, VS Code.\n\n## 2. Règles de Syntaxe Fondamentales\n1. **Terminaison** : Toute instruction SQL doit se terminer par un point-virgule (`;`).\n2. **Casse (Majuscules/Minuscules)** : Les mots-clés SQL (`SELECT`, `SHOW`) sont insensibles à la casse, mais la convention professionnelle exige de les écrire en **MAJUSCULES**.\n3. **Commentaires** :\n   * Une ligne : `-- commentaire` ou `# commentaire`\n   * Multi-lignes : `/* commentaire */`",
    "examples": "-- Lister toutes les bases de données existantes\nSHOW DATABASES;\n\n-- Afficher l'encodage et les variables système\nSHOW VARIABLES LIKE 'character_set_database';",
    "astuces": "⚡ **Règle d'or :**\nNe jamais oublier le point-virgule (`;`) à la fin de chaque commande SQL ! Sans lui, le client attend la suite de la requête.",
    "quiz": [
      {
        "id": 203,
        "question_number": "Q1",
        "question_text": "Quelle commande permet de lister toutes les bases de données disponibles sur le serveur MySQL ?",
        "option_a": "LIST DATABASES;",
        "option_b": "SHOW DATABASES;",
        "option_c": "DISPLAY DATABASES;",
        "option_d": "SELECT DATABASES;",
        "correct_option": "B",
        "explanation": "La commande d'administration MySQL est SHOW DATABASES;.",
        "astuce": "SHOW sert à inspecter la structure du serveur."
      }
    ]
  },
  {
    "num": 3,
    "title": "Les Types de Données en SQL",
    "title_ar": "أنواع البيانات في SQL",
    "duration": "12 min",
    "video_url": "https://drive.google.com/file/d/1q7OKml9iL-drK3aHaNz6n3CLYCjDtuqb/view?usp=sharing",
    "content": "# Leçon 03 : Les Types de Données en SQL\n\nLe choix du bon type de données est crucial pour la performance et l'espace disque.\n\n## 1. Nombres (Numériques)\n* `INT` ou `INTEGER` : Entier signé standard (-2 milliards à +2 milliards, 4 octets).\n* `BIGINT` : Pour les très grands nombres (identifiants d'envergure, 8 octets).\n* `DECIMAL(M, D)` ou `NUMERIC` : Nombres décimaux exacts à virgule fixe (M = nombre total de chiffres, D = chiffres après la virgule). **Indispensable pour l'argent/salaires** !\n* `FLOAT` / `DOUBLE` : Nombres à virgule flottante approximatifs.\n\n## 2. Chaînes de Caractères\n* `CHAR(n)` : Taille fixe de `n` caractères (remplit les espaces vides). Idéal pour les codes postaux, CNIE, pays ('MA', 'FR').\n* `VARCHAR(n)` : Taille variable jusqu'à `n` caractères. Économise l'espace mémoire.\n* `TEXT` : Textes longs (articles, descriptions).\n\n## 3. Dates et Heures\n* `DATE` : Format `AAAA-MM-JJ` (ex: `2026-10-06`).\n* `TIME` : Format `HH:MM:SS`.\n* `DATETIME` / `TIMESTAMP` : Date et heure précises.",
    "examples": "-- Exemple de table illustrant les différents types\nCREATE TABLE exemples_types (\n    id INT,\n    cnie CHAR(8),                 -- Toujours 8 caractères\n    nom VARCHAR(50),              -- Entre 1 et 50 caractères\n    salaire DECIMAL(10, 2),       -- Jusqu'à 99 999 999.99\n    date_naissance DATE,\n    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
    "astuces": "⚡ **Piège Concours :**\nPourquoi utiliser `DECIMAL` plutôt que `FLOAT` pour les salaires ou montants financiers ?\nParce que `FLOAT` introduit des erreurs d'arrondi binaire, tandis que `DECIMAL` stocke la valeur numérique exacte.",
    "quiz": [
      {
        "id": 204,
        "question_number": "Q1",
        "question_text": "Quelle est la différence fondamentale entre CHAR(10) et VARCHAR(10) ?",
        "option_a": "CHAR accepte les chiffres, VARCHAR non",
        "option_b": "CHAR a une taille fixe réservée de 10 octets, VARCHAR n'occupe que la longueur réelle du texte",
        "option_c": "VARCHAR est limité à 5 caractères",
        "option_d": "Aucune différence",
        "correct_option": "B",
        "explanation": "CHAR(10) alloue toujours 10 octets en complétant par des espaces. VARCHAR(10) adapte sa taille dynamique.",
        "astuce": "CHAR = Fixe, VARCHAR = Variable."
      }
    ]
  },
  {
    "num": 4,
    "title": "Créer et Supprimer une Base de Données (CREATE & DROP DATABASE)",
    "title_ar": "إنشاء وحذف قاعدة بيانات",
    "duration": "9 min",
    "video_url": "https://drive.google.com/file/d/1kDZji-2WHR6EhHMsOnrJFTGO6gDcdj71/view?usp=sharing",
    "content": "# Leçon 04 : Créer et Supprimer une Base de Données\n\n## 1. Création d'une BDD\nL'instruction `CREATE DATABASE` crée un nouvel espace de stockage isolé.\n\n```sql\nCREATE DATABASE nom_base;\n```\n\nBonne pratique : Spécifier l'encodage UTF-8 (`utf8mb4`) pour supporter tous les caractères arabes, accents et emojis.\n\n## 2. Sélectionner la Base Active\nPour indiquer à MySQL sur quelle base de données vont s'appliquer les prochaines commandes, on utilise `USE` :\n```sql\nUSE nom_base;\n```\n\n## 3. Suppression\nL'instruction `DROP DATABASE` supprime définitivement la base et l'intégralité de ses tables.",
    "examples": "-- Créer la base si elle n'existe pas déjà\nCREATE DATABASE IF NOT EXISTS ecole_db \nCHARACTER SET utf8mb4 \nCOLLATE utf8mb4_unicode_ci;\n\n-- Sélectionner la base de travail\nUSE ecole_db;\n\n-- Supprimer une base de test en toute sécurité\nDROP DATABASE IF EXISTS test_db;",
    "astuces": "⚡ **Conseil :**\nToujours ajouter `IF NOT EXISTS` lors de la création pour éviter qu'un script ne plante si la base est déjà présente.",
    "quiz": [
      {
        "id": 205,
        "question_number": "Q1",
        "question_text": "Quelle commande permet de sélectionner la base de données active dans MySQL ?",
        "option_a": "SELECT DATABASE ecole_db;",
        "option_b": "USE ecole_db;",
        "option_c": "OPEN ecole_db;",
        "option_d": "GOTO ecole_db;",
        "correct_option": "B",
        "explanation": "La commande USE nom_base; active la base pour les requêtes suivantes.",
        "astuce": "USE = Utiliser la base."
      }
    ]
  },
  {
    "num": 5,
    "title": "Création des Tables (CREATE TABLE)",
    "title_ar": "إنشاء الجداول في SQL",
    "duration": "11 min",
    "video_url": "https://drive.google.com/file/d/1vUa-cvNFUUcs6UrDIrgV5UarV2Zi0TMY/view?usp=sharing",
    "content": "# Leçon 05 : Création des Tables (CREATE TABLE)\n\nUne table est la structure fondamentale qui accueille vos données sous forme de lignes et de colonnes.\n\n## 1. Syntaxe Générale\n```sql\nCREATE TABLE nom_table (\n    colonne1 TYPE CONTRAINTES,\n    colonne2 TYPE CONTRAINTES,\n    ...\n);\n```\n\n## 2. Inspecter la Structure\n* `DESCRIBE nom_table;` ou `DESC nom_table;` : Affiche les champs, types et clés de la table.\n* `SHOW TABLES;` : Liste les tables de la base active.",
    "examples": "USE ecole_db;\n\nCREATE TABLE etudiants (\n    id INT,\n    nom VARCHAR(50),\n    prenom VARCHAR(50),\n    age INT,\n    filiere VARCHAR(30)\n);\n\n-- Vérifier la création\nDESC etudiants;",
    "astuces": "⚡ **Astuce :**\nPour voir le code SQL exact ayant généré la table :\n`SHOW CREATE TABLE nom_table;`",
    "quiz": [
      {
        "id": 206,
        "question_number": "Q1",
        "question_text": "Quelle commande permet de visualiser les colonnes et les types d'une table ?",
        "option_a": "VIEW nom_table;",
        "option_b": "DESCRIBE nom_table;",
        "option_c": "SCHEMA nom_table;",
        "option_d": "INFO nom_table;",
        "correct_option": "B",
        "explanation": "DESCRIBE nom_table; (ou DESC) affiche le schéma des colonnes.",
        "astuce": "DESCRIBE = Décrire."
      }
    ]
  },
  {
    "num": 6,
    "title": "Contraintes NOT NULL et UNIQUE",
    "title_ar": "القيود NOT NULL و UNIQUE",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1eVBrY6gwfVQoCz6XRyBbyo3P_OlMkKQ4/view?usp=sharing",
    "content": "# Leçon 06 : Contraintes NOT NULL et UNIQUE\n\nLes contraintes imposent des règles strictes sur les données saisies afin de garantir leur intégrité.\n\n## 1. Contrainte `NOT NULL`\n* Interdit l'insertion d'une valeur nulle (`NULL`) dans la colonne.\n* Le champ devient obligatoirement requis.\n\n## 2. Contrainte `UNIQUE`\n* Interdit tout doublon dans la colonne : chaque valeur doit être unique parmi toutes les lignes.\n* Contrairement à la clé primaire, une colonne `UNIQUE` peut accepter une valeur `NULL` (si `NOT NULL` n'est pas spécifié).",
    "examples": "CREATE TABLE utilisateurs (\n    id INT,\n    pseudo VARCHAR(30) NOT NULL UNIQUE,  -- Obligatoire et sans doublon\n    email VARCHAR(100) UNIQUE,           -- Unique mais optionnel\n    mot_de_passe VARCHAR(255) NOT NULL   -- Obligatoire\n);",
    "astuces": "⚡ **Différence Clé :**\nUne table ne peut avoir qu'**UNE SEULE** clé primaire, mais elle peut avoir **PLUSIEURS** colonnes avec contrainte `UNIQUE` !",
    "quiz": [
      {
        "id": 207,
        "question_number": "Q1",
        "question_text": "Combien de contraintes UNIQUE peut comporter une même table SQL ?",
        "option_a": "Une seule",
        "option_b": "Deux au maximum",
        "option_c": "Autant que nécessaire (plusieurs)",
        "option_d": "Zéro",
        "correct_option": "C",
        "explanation": "Une table peut avoir autant de contraintes UNIQUE que souhaité, contrairement à la clé primaire qui est unique.",
        "astuce": "UNIQUE multiple = OUI, PRIMARY KEY multiple = NON (une seule PK par table)."
      }
    ]
  },
  {
    "num": 7,
    "title": "Contraintes CHECK et DEFAULT",
    "title_ar": "القيود CHECK و DEFAULT",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1gzo9Uzx6Nh-FMFccQNBYVfh5jMSFQ38-/view?usp=sharing",
    "content": "# Leçon 07 : Contraintes CHECK et DEFAULT\n\n## 1. Contrainte `DEFAULT`\n* Définit une valeur par défaut attribuée automatiquement lorsqu'aucune valeur n'est spécifiée lors de l'insertion (`INSERT`).\n\n## 2. Contrainte `CHECK`\n* Valide une condition logique avant d'autoriser l'insertion ou la modification.\n* Exemples : vérifier qu'un âge est supérieur à 18, qu'un prix est positif, qu'une note est comprise entre 0 et 20.",
    "examples": "CREATE TABLE produits (\n    id INT,\n    designation VARCHAR(100) NOT NULL,\n    prix DECIMAL(10, 2) CHECK (prix > 0),       -- Le prix doit être strictement positif\n    quantite_stock INT DEFAULT 0,              -- Valeur par défaut : 0\n    statut VARCHAR(20) DEFAULT 'disponible' CHECK (statut IN ('disponible', 'epuise', 'archive'))\n);",
    "astuces": "⚡ **Astuce :**\nDans MySQL 8.0+, la contrainte `CHECK` est strictement appliquée. Dans les anciennes versions MySQL 5.7, elle était seulement parsée sans être évaluée.",
    "quiz": [
      {
        "id": 208,
        "question_number": "Q1",
        "question_text": "À quoi sert la contrainte CHECK (salaire >= 3000) ?",
        "option_a": "À convertir le salaire en devise",
        "option_b": "À rejeter toute insertion ou modification avec un salaire inférieur à 3000",
        "option_c": "À donner la valeur 3000 par défaut",
        "option_d": "À afficher une alerte sans bloquer",
        "correct_option": "B",
        "explanation": "CHECK valide une condition booléenne et bloque la transaction si elle est fausse.",
        "astuce": "CHECK = Contrôle de validité."
      }
    ]
  },
  {
    "num": 8,
    "title": "La Clé Primaire (PRIMARY KEY)",
    "title_ar": "المفتاح الأساسي PRIMARY KEY",
    "duration": "11 min",
    "video_url": "https://drive.google.com/file/d/16l8Ky_IPGEA2aRr7T0PXbnvBbTHDh_-s/view?usp=sharing",
    "content": "# Leçon 08 : La Clé Primaire (PRIMARY KEY)\n\nLa **clé primaire** est la colonne (ou combinaison de colonnes) qui identifie **de manière unique et certaine** chaque ligne d'une table.\n\n## 1. Règles d'une Clé Primaire\n1. **Unicité absolue** : Deux lignes ne peuvent pas avoir la même valeur.\n2. **Non-nullité** : Une clé primaire ne peut JAMAIS être `NULL`.\n3. **Une seule par table** : Une table possède une et une seule clé primaire (qui peut être simple ou composée).\n4. **Auto-incrément** : Très souvent couplée avec `AUTO_INCREMENT` pour générer automatiquement 1, 2, 3...",
    "examples": "-- Déclaration en ligne\nCREATE TABLE clients (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nom VARCHAR(50) NOT NULL,\n    ville VARCHAR(50)\n);\n\n-- Clé primaire composite (sur deux colonnes)\nCREATE TABLE inscriptions (\n    etudiant_id INT,\n    cours_id INT,\n    date_inscription DATE,\n    PRIMARY KEY (etudiant_id, cours_id) -- Clé primaire composite\n);",
    "astuces": "⚡ **Question classique de concours :**\nPeut-on insérer `NULL` dans une colonne définie comme `PRIMARY KEY` ?\n**NON, JAMAIS !** Une clé primaire implique implicitement `NOT NULL` et `UNIQUE`.",
    "quiz": [
      {
        "id": 209,
        "question_number": "Q1",
        "question_text": "Quelle combinaison de contraintes définit mathématiquement une clé primaire ?",
        "option_a": "DEFAULT + CHECK",
        "option_b": "NOT NULL + UNIQUE",
        "option_c": "FOREIGN KEY + INDEX",
        "option_d": "VARCHAR + INT",
        "correct_option": "B",
        "explanation": "Une clé primaire est par définition UNIQUE et NOT NULL.",
        "astuce": "PK = UNIQUE + NOT NULL."
      }
    ]
  },
  {
    "num": 9,
    "title": "La Clé Étrangère (FOREIGN KEY) et Intégrité Référentielle",
    "title_ar": "المفتاح المرجعي FOREIGN KEY والعلاقات",
    "duration": "14 min",
    "video_url": "https://drive.google.com/file/d/1JBhAclqe4X2qB4jhuGf0mfUP0kxMdwCq/view?usp=sharing",
    "content": "# Leçon 09 : La Clé Étrangère (FOREIGN KEY)\n\nLa **clé étrangère** matérialise la relation entre deux tables. Elle pointe vers la clé primaire d'une autre table (table parente).\n\n## 1. Rôle de l'Intégrité Référentielle\nElle empêche d'insérer un enregistrement enfant qui pointerait vers un parent inexistant.\n\n## 2. Options de Suppression / Modification\n* `ON DELETE CASCADE` : Si le parent est supprimé, tous les enfants associés sont supprimés automatiquement.\n* `ON DELETE SET NULL` : Si le parent est supprimé, la clé étrangère de l'enfant devient `NULL`.\n* `ON DELETE RESTRICT` (défaut) : Interdit la suppression du parent s'il possède des enfants.",
    "examples": "-- Table parente\nCREATE TABLE departements (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nom_dept VARCHAR(50) NOT NULL\n);\n\n-- Table enfant\nCREATE TABLE employes (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nom VARCHAR(50) NOT NULL,\n    dept_id INT,\n    CONSTRAINT fk_emp_dept \n        FOREIGN KEY (dept_id) \n        REFERENCES departements(id) \n        ON DELETE SET NULL\n);",
    "astuces": "⚡ **Attention :**\nPour créer une clé étrangère, la table parente doit être créée **avant** la table enfant !",
    "quiz": [
      {
        "id": 210,
        "question_number": "Q1",
        "question_text": "Que produit l'option ON DELETE CASCADE sur une clé étrangère ?",
        "option_a": "Elle empêche la suppression du parent",
        "option_b": "Elle supprime automatiquement les lignes filles associées quand la ligne parente est supprimée",
        "option_c": "Elle met la clé étrangère à NULL",
        "option_d": "Elle crée une sauvegarde",
        "correct_option": "B",
        "explanation": "CASCADE propage la suppression aux enregistrements dépendants.",
        "astuce": "CASCADE = Effet domino."
      }
    ]
  },
  {
    "num": 10,
    "title": "Insertion de Données (INSERT INTO)",
    "title_ar": "إدخال البيانات INSERT INTO",
    "duration": "11 min",
    "video_url": "https://drive.google.com/file/d/1Vz7xPqv9wksEm-n6I4CdjDyLz75GLTRF/view?usp=sharing",
    "content": "# Leçon 10 : Insertion de Données (INSERT INTO)\n\nL'instruction `INSERT INTO` (DML) ajoute de nouvelles lignes dans une table.\n\n## 1. Formes d'Insertion\n* **En spécifiant les colonnes** (Recommandé) : Permet d'omettre les colonnes auto-incrémentées ou avec valeur par défaut.\n* **Sans spécifier les colonnes** : Nécessite de fournir les valeurs de TOUTES les colonnes dans l'ordre exact de la table.\n* **Insertion multiple en lot (*Bulk Insert*)** : Très rapide et optimisé.",
    "examples": "-- Insertion simple\nINSERT INTO departements (nom_dept) VALUES ('Informatique');\n\n-- Insertion multiple de plusieurs lignes en une seule requête\nINSERT INTO employes (nom, dept_id) VALUES \n('Ouakrim', 1),\n('Bennani', 1),\n('Alami', NULL);",
    "astuces": "⚡ **Bonne pratique :**\nToujours nommer explicitement les colonnes : `INSERT INTO table (col1, col2) VALUES (...)`. Cela évite que votre code ne casse si une nouvelle colonne est ajoutée à la table plus tard.",
    "quiz": [
      {
        "id": 211,
        "question_number": "Q1",
        "question_text": "Peut-on insérer plusieurs lignes dans une table en une seule commande INSERT INTO ?",
        "option_a": "Non, une seule ligne par requête",
        "option_b": "Oui, en séparant les tuples de valeurs par des virgules",
        "option_c": "Uniquement avec des fichiers CSV",
        "option_d": "Uniquement avec un curseur PL/SQL",
        "correct_option": "B",
        "explanation": "SQL permet l'insertion multiple : INSERT INTO t VALUES (1), (2), (3);.",
        "astuce": "Bulk insert = Gain de performance majeur."
      }
    ]
  },
  {
    "num": 11,
    "title": "Modifier des Données (UPDATE ... SET)",
    "title_ar": "تعديل البيانات UPDATE TABLE",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1BT_GgCLBIuRJEsK-7PA_9yqAsCelPH1r/view?usp=sharing",
    "content": "# Leçon 11 : Modifier des Données (UPDATE ... SET)\n\nL'instruction `UPDATE` met à jour les valeurs existantes dans une ou plusieurs colonnes.\n\n## 1. Syntaxe\n```sql\nUPDATE nom_table\nSET colonne1 = nouvelle_valeur, colonne2 = nouvelle_valeur\nWHERE condition;\n```\n\n⚠️ **DANGER ABSOLU** : Si vous oubliez la clause `WHERE`, **TOUTES** les lignes de votre table prendront cette nouvelle valeur !",
    "examples": "-- Augmenter le salaire de l'employé #101\nUPDATE employes \nSET salaire = 15000.00 \nWHERE id = 101;\n\n-- Augmenter de 5% le salaire de tous les employés du département 1\nUPDATE employes \nSET salaire = salaire * 1.05 \nWHERE dept_id = 1;",
    "astuces": "⚡ **Règle de sécurité :**\nAvant d'exécuter un `UPDATE`, exécutez d'abord un `SELECT * FROM table WHERE condition;` pour vérifier exactement quelles lignes vont être touchées !",
    "quiz": [
      {
        "id": 212,
        "question_number": "Q1",
        "question_text": "Que se passe-t-il si on exécute : UPDATE employes SET salaire = 10000; sans clause WHERE ?",
        "option_a": "Une erreur de syntaxe est levée",
        "option_b": "Seule la première ligne est modifiée",
        "option_c": "Toutes les lignes de la table ont désormais un salaire de 10000",
        "option_d": "Aucune ligne n'est modifiée",
        "correct_option": "C",
        "explanation": "Sans WHERE, la modification s'applique à l'intégralité des enregistrements de la table.",
        "astuce": "Toujours vérifier la présence du WHERE."
      }
    ]
  },
  {
    "num": 12,
    "title": "Supprimer des Données (DELETE FROM)",
    "title_ar": "حذف البيانات DELETE FROM",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1sjf5ZJJb85J824mmBexfK0J1J36ylWfh/view?usp=sharing",
    "content": "# Leçon 12 : Supprimer des Données (DELETE FROM)\n\nL'instruction `DELETE FROM` supprime une ou plusieurs lignes de la table.\n\n## 1. Syntaxe\n```sql\nDELETE FROM nom_table\nWHERE condition;\n```\n\n## 2. DELETE vs TRUNCATE\n* `DELETE FROM table WHERE ...;` : Supprime ligne par ligne, peut être annulé dans une transaction (`ROLLBACK`).\n* `TRUNCATE TABLE table;` : Vide la table d'un seul coup (DDL), réinitialise l'auto-increment, beaucoup plus rapide.",
    "examples": "-- Supprimer l'employé dont l'id est 102\nDELETE FROM employes \nWHERE id = 102;\n\n-- Supprimer tous les employés sans département\nDELETE FROM employes \nWHERE dept_id IS NULL;",
    "astuces": "⚡ **Piège :**\nPour supprimer une table entière, c'est `DROP TABLE`. Pour vider son contenu en gardant la structure : `TRUNCATE TABLE` ou `DELETE FROM table`.",
    "quiz": [
      {
        "id": 213,
        "question_number": "Q1",
        "question_text": "Quelle instruction réinitialise le compteur AUTO_INCREMENT d'une table tout en vidant ses données ?",
        "option_a": "DELETE FROM table;",
        "option_b": "TRUNCATE TABLE table;",
        "option_c": "REMOVE FROM table;",
        "option_d": "CLEAR table;",
        "correct_option": "B",
        "explanation": "TRUNCATE TABLE réinitialise l'auto-incrément à 1.",
        "astuce": "TRUNCATE = Remise à zéro de la table."
      }
    ]
  },
  {
    "num": 13,
    "title": "Afficher des Constantes (SELECT 'Hello World!')",
    "title_ar": "عرض نص وعمليات بسيطة بـ SELECT",
    "duration": "7 min",
    "video_url": "https://drive.google.com/file/d/15R16yn5V6V0Cop04Cn8ujww9kGx5tX90/view?usp=sharing",
    "content": "# Leçon 13 : Afficher des Constantes et Calculs (SELECT)\n\nL'instruction `SELECT` ne sert pas seulement à lire des tables. En MySQL, elle peut être utilisée comme une calculatrice ou pour tester des expressions scalaires.\n\n## 1. SELECT sans table\n```sql\nSELECT 'Hello World!';\n```\n\n## 2. Calculs Arithmétiques\nSQL sait évaluer directement les opérations mathématiques :\n* Addition `+`, Soustraction `-`, Multiplication `*`, Division `/`, Modulo `%`.",
    "examples": "-- Afficher un message\nSELECT 'Bienvenue sur Info-Réussite !' AS message;\n\n-- Calculs mathématiques\nSELECT (150 * 1.20) AS montant_ttc;\n\n-- Fonctions système\nSELECT CURRENT_DATE(), CURRENT_TIME();",
    "astuces": "⚡ **À savoir :**\nDans certains SGBD comme Oracle, un `SELECT` exige obligatoirement une table, on utilise alors la table factice `DUAL` (`SELECT 2+2 FROM DUAL;`). En MySQL et PostgreSQL, `SELECT 2+2;` fonctionne directement.",
    "quiz": [
      {
        "id": 214,
        "question_number": "Q1",
        "question_text": "Que renvoie la commande SELECT 10 + 5 * 2; en MySQL ?",
        "option_a": "30",
        "option_b": "20",
        "option_c": "Une erreur",
        "option_d": "NULL",
        "correct_option": "B",
        "explanation": "La priorité mathématique s'applique : 5 * 2 = 10, puis 10 + 10 = 20.",
        "astuce": "La priorité des opérateurs s'applique en SQL."
      }
    ]
  },
  {
    "num": 14,
    "title": "Interroger les Tables (SELECT ... FROM)",
    "title_ar": "استرجاع البيانات من الجداول SELECT FROM",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1elYqpZCXrA3bt_XBZ3htbk-6ew82jir9/view?usp=sharing",
    "content": "# Leçon 14 : Interroger les Tables (SELECT ... FROM)\n\n`SELECT ... FROM` est la commande la plus employée en SQL. Elle extrait les données d'une table sous la forme d'un tableau résultat.\n\n## 1. Sélectionner Toutes les Colonnes (`SELECT *`)\nL'étoile (`*`) est un caractère générique signifiant « toutes les colonnes ».\nPratique pour l'exploration, mais déconseillé dans les applications de production à cause du coût mémoire et réseau.\n\n## 2. Projection (Sélection de Colonnes Ciblées)\nIndiquer explicitement les colonnes souhaitées :\n```sql\nSELECT nom, salaire FROM employes;\n```",
    "examples": "-- Récupérer tout\nSELECT * FROM employes;\n\n-- Récupérer uniquement le nom et le poste\nSELECT nom, poste FROM employes;",
    "astuces": "⚡ **Performance :**\nToujours préférer `SELECT nom, email` à `SELECT *` pour limiter la bande passante et exploiter les index de couverture.",
    "quiz": [
      {
        "id": 215,
        "question_number": "Q1",
        "question_text": "Que signifie le caractère étoile '*' dans SELECT * FROM table; ?",
        "option_a": "Sélectionner la première colonne",
        "option_b": "Sélectionner toutes les colonnes",
        "option_c": "Sélectionner les colonnes indexées",
        "option_d": "Multiplier les lignes",
        "correct_option": "B",
        "explanation": "'*' est le wildcard désignant toutes les colonnes de la table.",
        "astuce": "* = Tout."
      }
    ]
  },
  {
    "num": 15,
    "title": "Filtrer avec Conditions (WHERE)",
    "title_ar": "تصفية البيانات بالشروط WHERE",
    "duration": "12 min",
    "video_url": "https://drive.google.com/file/d/1rJGbLYI_cGlJivs6iars2bQY72hDSsKX/view?usp=sharing",
    "content": "# Leçon 15 : Filtrer avec Conditions (WHERE)\n\nLa clause `WHERE` filtre les lignes et ne conserve que celles qui satisfont le prédicat.\n\n## 1. Opérateurs de Comparaison\n* Égalité : `=`\n* Différent : `<>` ou `!=`\n* Supérieur / Inférieur : `>`, `<`, `>=`, `<=`\n* Test de nullité : `IS NULL`, `IS NOT NULL`\n\n⚠️ **Piège du NULL** : Écrire `WHERE col = NULL` est une erreur classique qui ne renvoie JAMAIS de résultat. Utilisez `IS NULL`.",
    "examples": "-- Employés ayant un salaire supérieur à 10000\nSELECT * FROM employes WHERE salaire > 10000;\n\n-- Employés qui n'appartiennent pas au département 1\nSELECT * FROM employes WHERE dept_id <> 1;\n\n-- Employés sans département affecté\nSELECT * FROM employes WHERE dept_id IS NULL;",
    "astuces": "⚡ **Piège Concours :**\nEn logique SQL à trois valeurs (Vrai, Faux, Inconnu), toute comparaison avec `NULL` renvoie `UNKNOWN`. C'est pourquoi seul `IS NULL` est correct.",
    "quiz": [
      {
        "id": 216,
        "question_number": "Q1",
        "question_text": "Quelle est la syntaxe correcte pour trouver les employés dont le département est inconnu (NULL) ?",
        "option_a": "WHERE dept_id = NULL",
        "option_b": "WHERE dept_id IS NULL",
        "option_c": "WHERE dept_id == NULL",
        "option_d": "WHERE dept_id EQUALS NULL",
        "correct_option": "B",
        "explanation": "La comparaison avec NULL se fait obligatoirement avec IS NULL ou IS NOT NULL.",
        "astuce": "Toujours IS NULL."
      }
    ]
  },
  {
    "num": 16,
    "title": "Opérateurs Logiques (AND, OR, XOR, NOT)",
    "title_ar": "الروابط المنطقية AND - OR - XOR - NOT",
    "duration": "11 min",
    "video_url": "https://drive.google.com/file/d/1RngO5C56gWop7Qi-hc2KNLDyyJ2CzDUJ/view?usp=sharing",
    "content": "# Leçon 16 : Opérateurs Logiques (AND, OR, XOR, NOT)\n\nCombinez plusieurs conditions grâce aux opérateurs booléens.\n\n## 1. Les Opérateurs\n* **`AND`** : Toutes les conditions doivent être vraies simultanément.\n* **`OR`** : Au moins une condition doit être vraie.\n* **`NOT`** : Inverse le résultat de la condition.\n* **`XOR`** : Ou exclusif (vrai si l'une est vraie, mais pas les deux).\n\n## 2. Ordre de Priorité\nL'opérateur `AND` est prioritaire sur `OR` ! Utilisez des **parenthèses** `( )` pour éviter toute ambiguïté.",
    "examples": "-- Salariés du dept 1 avec salaire > 12000\nSELECT * FROM employes \nWHERE dept_id = 1 AND salaire > 12000;\n\n-- Emplois de 'Lead Dev' OU basés à 'Rabat'\nSELECT * FROM employes e\nJOIN departements d ON e.dept_id = d.id\nWHERE e.poste = 'Lead Dev' OR d.ville = 'Rabat';\n\n-- Utilisation indispensable des parenthèses\nSELECT * FROM employes \nWHERE (dept_id = 1 OR dept_id = 2) AND salaire >= 10000;",
    "astuces": "⚡ **Conseil :**\nMettez TOUJOURS des parenthèses dès que vous mélangez `AND` et `OR`.",
    "quiz": [
      {
        "id": 217,
        "question_number": "Q1",
        "question_text": "Quel opérateur logique a la priorité la plus haute entre AND et OR sans parenthèses ?",
        "option_a": "OR",
        "option_b": "AND",
        "option_c": "Ils ont la même priorité (évalués de droite à gauche)",
        "option_d": "XOR",
        "correct_option": "B",
        "explanation": "AND a la priorité sur OR, comme la multiplication sur l'addition.",
        "astuce": "AND = Multiplication, OR = Addition."
      }
    ]
  },
  {
    "num": 17,
    "title": "L'Opérateur de Recherche LIKE",
    "title_ar": "البحث الجزئي بالرمزين % و _ باستخدام LIKE",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1krITwhqybwPqRy_yeEuNR2dJx3joCpbJ/view?usp=sharing",
    "content": "# Leçon 17 : L'Opérateur de Recherche LIKE\n\n`LIKE` permet la recherche textuelle par motifs (*pattern matching*).\n\n## Les Caractères Génériques (Wildcards) :\n1. **`%`** : Représente **zéro, un ou plusieurs** caractères quelconques.\n   * `'A%'` : Commence par A.\n   * `'%A'` : Se termine par A.\n   * `'%A%'` : Contient la lettre A.\n2. **`_` (Underscore)** : Représente **exactement UN** caractère unique.\n   * `'_A%'` : Deuxième lettre est un A.\n   * `'___'` : Mot d'exactement 3 caractères.",
    "examples": "-- Noms commençant par 'O'\nSELECT * FROM employes WHERE nom LIKE 'O%';\n\n-- Adresses emails terminant par '@gmail.com'\nSELECT * FROM employes WHERE email LIKE '%@gmail.com';\n\n-- Noms de 4 lettres se terminant par 'a'\nSELECT * FROM employes WHERE nom LIKE '___a';",
    "astuces": "⚡ **Astuce :**\nPour chercher le caractère `%` ou `_` littéral, échappez-le avec un antislash : `LIKE '%\\%%' ESCAPE '\\'`.\nPour inverser la recherche : `NOT LIKE`.",
    "quiz": [
      {
        "id": 218,
        "question_number": "Q1",
        "question_text": "Quel motif LIKE trouve tous les mots dont la 2ème lettre est 'E' ?",
        "option_a": "'%E%'",
        "option_b": "'_E%'",
        "option_c": "'%E_'",
        "option_d": "'__E%'",
        "correct_option": "B",
        "explanation": "'_' représente le 1er caractère, suivi de 'E', suivi de '%' pour le reste.",
        "astuce": "_ = un caractère exact."
      }
    ]
  },
  {
    "num": 18,
    "title": "L'Opérateur d'Intervalle BETWEEN",
    "title_ar": "حصر المجال بالأداة BETWEEN",
    "duration": "9 min",
    "video_url": "https://drive.google.com/file/d/1by9BbXlf3Bj4Q3Ts7tCOxhM5Bn3CotZK/view?usp=sharing",
    "content": "# Leçon 18 : L'Opérateur d'Intervalle BETWEEN\n\nL'opérateur `BETWEEN` vérifie qu'une valeur se situe dans un intervalle fermé.\n\n## Syntaxe\n```sql\nWHERE colonne BETWEEN valeur_min AND valeur_max;\n```\nCe qui équivaut rigoureusement à :\n```sql\nWHERE colonne >= valeur_min AND colonne <= valeur_max;\n```\n⚠️ **Important** : Les bornes `valeur_min` et `valeur_max` sont **incluses** !",
    "examples": "-- Salaires compris entre 8000 et 15000 (inclus)\nSELECT * FROM employes \nWHERE salaire BETWEEN 8000 AND 15000;\n\n-- Embauches effectuées en 2022\nSELECT * FROM employes \nWHERE date_embauche BETWEEN '2022-01-01' AND '2022-12-31';\n\n-- L'inverse avec NOT BETWEEN\nSELECT * FROM employes \nWHERE salaire NOT BETWEEN 8000 AND 15000;",
    "astuces": "⚡ **Question de concours :**\nEst-ce que `BETWEEN 10 AND 20` inclut 10 et 20 ?\n**OUI**, l'intervalle est toujours fermé (`[10, 20]`).",
    "quiz": [
      {
        "id": 219,
        "question_number": "Q1",
        "question_text": "L'expression x BETWEEN 5 AND 10 est strictement équivalente à :",
        "option_a": "x > 5 AND x < 10",
        "option_b": "x >= 5 AND x <= 10",
        "option_c": "x >= 5 OR x <= 10",
        "option_d": "x = 5 OR x = 10",
        "correct_option": "B",
        "explanation": "BETWEEN inclut les deux bornes (>= et <=).",
        "astuce": "BETWEEN est inclusif."
      }
    ]
  },
  {
    "num": 19,
    "title": "L'Opérateur Ensembliste IN",
    "title_ar": "التحقق من التواجد ضمن قائمة IN",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/17I15Gv7DLXAY0RkbPj6-62huFKt9v0L5/view?usp=sharing",
    "content": "# Leçon 19 : L'Opérateur Ensembliste IN\n\nL'opérateur `IN` teste si une valeur appartient à une liste définie ou au résultat d'une sous-requête.\n\n## Avantage sur les OR multiples :\nAu lieu d'écrire :\n`WHERE ville = 'Rabat' OR ville = 'Casablanca' OR ville = 'Tanger'`\nOn écrit simplement :\n`WHERE ville IN ('Rabat', 'Casablanca', 'Tanger')`\n\nC'est plus concis, plus lisible et plus rapide à optimiser pour le moteur SQL.",
    "examples": "-- Employés des départements 1, 3 et 5\nSELECT * FROM employes \nWHERE dept_id IN (1, 3, 5);\n\n-- Employés n'appartenant pas à ces départements\nSELECT * FROM employes \nWHERE dept_id NOT IN (1, 3, 5);\n\n-- Avec une sous-requête\nSELECT * FROM employes \nWHERE dept_id IN (SELECT id FROM departements WHERE ville = 'Rabat');",
    "astuces": "⚡ **Piège Redoutable :**\nSi votre liste dans `NOT IN` contient la valeur `NULL` (ex: `NOT IN (1, 2, NULL)`), la requête renverra **zéro ligne** ! Car la comparaison avec NULL renvoie UNKNOWN.",
    "quiz": [
      {
        "id": 220,
        "question_number": "Q1",
        "question_text": "L'opérateur IN remplace avantageusement une succession de :",
        "option_a": "AND",
        "option_b": "OR",
        "option_c": "XOR",
        "option_d": "NOT",
        "correct_option": "B",
        "explanation": "col IN ('A', 'B') équivaut à (col = 'A' OR col = 'B').",
        "astuce": "IN = Raccourci pour OR multiples."
      }
    ]
  },
  {
    "num": 20,
    "title": "Trier les Résultats (ORDER BY)",
    "title_ar": "ترتيب النتائج ORDER BY تصاعدي وتنازلي",
    "duration": "10 min",
    "video_url": "https://drive.google.com/file/d/1TNbTpvS8Ti_Ff0wU3oNcZlKDg4e-kzLu/view?usp=sharing",
    "content": "# Leçon 20 : Trier les Résultats (ORDER BY)\n\nPar défaut, l'ordre des lignes renvoyées par une table SQL est indéfini. Pour garantir un ordre précis, utilisez `ORDER BY`.\n\n## Sens du Tri :\n* **`ASC`** : Croissant (du plus petit au plus grand, de A à Z). **C'est la valeur par défaut**.\n* **`DESC`** : Décroissant (du plus grand au plus petit, de Z à A).\n\nOn peut trier sur plusieurs colonnes (tri hiérarchique).",
    "examples": "-- Tri par salaire du plus grand au plus petit\nSELECT * FROM employes \nORDER BY salaire DESC;\n\n-- Tri par département (croissant) puis par salaire (décroissant)\nSELECT * FROM employes \nORDER BY dept_id ASC, salaire DESC;",
    "astuces": "⚡ **À savoir :**\nEn SQL standard, la clause `ORDER BY` est l'une des dernières clauses évaluées par le moteur de base de données.",
    "quiz": [
      {
        "id": 221,
        "question_number": "Q1",
        "question_text": "Quel est le sens de tri par défaut si on omet ASC ou DESC dans ORDER BY ?",
        "option_a": "Aléatoire",
        "option_b": "DESC (décroissant)",
        "option_c": "ASC (croissant)",
        "option_d": "L'ordre d'insertion",
        "correct_option": "C",
        "explanation": "Par défaut, SQL trie par ordre croissant (ASC).",
        "astuce": "ASC par défaut."
      }
    ]
  },
  {
    "num": 21,
    "title": "Éliminer les Doublons (DISTINCT)",
    "title_ar": "إزالة التكرار DISTINCT",
    "duration": "8 min",
    "video_url": "https://drive.google.com/file/d/16jPVln20p5Ow7l5A3lO9Rz7EKmHKGHSf/view?usp=sharing",
    "content": "# Leçon 21 : Éliminer les Doublons (DISTINCT)\n\nLe mot-clé `DISTINCT` s'écrit juste après `SELECT` pour éliminer les doublons dans le jeu de résultats.\n\n## Syntaxe\n```sql\nSELECT DISTINCT colonne FROM table;\n```\n\nSi vous mettez plusieurs colonnes :\n`SELECT DISTINCT col1, col2 FROM table;`\nLa combinaison `(col1, col2)` sera unique.",
    "examples": "-- Liste unique des postes existants dans l'entreprise\nSELECT DISTINCT poste FROM employes;\n\n-- Nombre de villes distinctes\nSELECT COUNT(DISTINCT ville) FROM departements;",
    "astuces": "⚡ **Question Concours Récurrente :**\nQuelle requête donne la liste sans doublons des postes des employés ?\n`SELECT DISTINCT poste FROM employes;`",
    "quiz": [
      {
        "id": 222,
        "question_number": "Q1",
        "question_text": "Où se place le mot-clé DISTINCT dans une requête SQL ?",
        "option_a": "Après le nom de la table dans FROM",
        "option_b": "Directement après le mot-clé SELECT",
        "option_c": "Dans la clause WHERE",
        "option_d": "Tout à la fin après ORDER BY",
        "correct_option": "B",
        "explanation": "DISTINCT se place immédiatement après SELECT : SELECT DISTINCT colonne...",
        "astuce": "SELECT DISTINCT..."
      }
    ]
  },
  {
    "num": 22,
    "title": "Limiter et Paginer les Résultats (LIMIT)",
    "title_ar": "حصر النتائج والترقيم LIMIT و OFFSET",
    "duration": "9 min",
    "video_url": "https://drive.google.com/file/d/1ZH0dHu26sher_37e-5aiZX_uXv-b923_/view?usp=sharing",
    "content": "# Leçon 22 : Limiter et Paginer les Résultats (LIMIT)\n\nLa clause `LIMIT` restreint le nombre de lignes retournées par la requête.\n\n## Syntaxe\n* `LIMIT n` : Renvoie au maximum `n` lignes.\n* `LIMIT n OFFSET m` : Saute `m` lignes et renvoie les `n` suivantes.\n* Syntaxe équivalente MySQL : `LIMIT m, n` (m = saut, n = nombre).\n\nIndispensable pour créer la pagination sur une application web.",
    "examples": "-- Top 3 des employés les mieux rémunérés\nSELECT nom, salaire FROM employes \nORDER BY salaire DESC \nLIMIT 3;\n\n-- Page 2 d'une liste d'articles (10 par page : sauter les 10 premiers)\nSELECT * FROM articles \nORDER BY id \nLIMIT 10 OFFSET 10;",
    "astuces": "⚡ **Conseil :**\nToujours associer `LIMIT` à un `ORDER BY` strict pour garantir un résultat déterministe et reproductible.",
    "quiz": [
      {
        "id": 223,
        "question_number": "Q1",
        "question_text": "Comment récupérer la 2ème valeur la plus élevée d'une colonne salaire ?",
        "option_a": "SELECT salaire FROM employes ORDER BY salaire DESC LIMIT 1 OFFSET 1;",
        "option_b": "SELECT salaire FROM employes LIMIT 2;",
        "option_c": "SELECT MAX(salaire) - 1 FROM employes;",
        "option_d": "SELECT SECOND(salaire) FROM employes;",
        "correct_option": "A",
        "explanation": "En triant par ordre décroissant puis en sautant 1 ligne (OFFSET 1) pour en prendre 1 (LIMIT 1), on obtient le 2ème maximum.",
        "astuce": "LIMIT 1 OFFSET 1 = la 2ème ligne."
      }
    ]
  },
  {
    "num": 23,
    "title": "Les Alias de Colonnes et de Tables (AS)",
    "title_ar": "الأسماء المستعارة للأعمدة والجداول ALIAS",
    "duration": "8 min",
    "video_url": "https://drive.google.com/file/d/1tDu1Yi6vZWqjzLUADLuqr4-vgEgqBUil/view?usp=sharing",
    "content": "# Leçon 23 : Les Alias de Colonnes et de Tables (AS)\n\nLes alias permettent de renommer temporairement une colonne ou une table dans le cadre d'une requête.\n\n## 1. Alias de Colonne\n* Améliore la lisibilité du résultat.\n* Donne un nom explicite aux calculs et fonctions.\n\n## 2. Alias de Table\n* Raccourcit les requêtes avec jointures (`employes e JOIN departements d`).\n* Obligatoire lors des auto-jointures (*Self-Join*).",
    "examples": "-- Renommer une colonne calculée\nSELECT nom, salaire * 12 AS salaire_annuel \nFROM employes;\n\n-- Alias de table pour clarifier une jointure\nSELECT e.nom, d.nom_dept \nFROM employes AS e \nJOIN departements AS d ON e.dept_id = d.id;",
    "astuces": "⚡ **Rappel :**\nLe mot-clé `AS` est optionnel (`SELECT nom n FROM employes e`), mais l'écrire améliore la clarté de votre code.",
    "quiz": [
      {
        "id": 224,
        "question_number": "Q1",
        "question_text": "Peut-on filtrer dans la clause WHERE en utilisant un alias de colonne défini dans SELECT ?",
        "option_a": "Oui, toujours",
        "option_b": "Non, car la clause WHERE est exécutée avant la clause SELECT",
        "option_c": "Uniquement avec des nombres",
        "option_d": "Uniquement en MySQL 8",
        "correct_option": "B",
        "explanation": "L'ordre d'évaluation logique est FROM -> WHERE -> SELECT. Les alias du SELECT ne sont donc pas encore connus dans le WHERE.",
        "astuce": "WHERE avant SELECT = pas d'alias dans le WHERE !"
      }
    ]
  },
  {
    "num": 24,
    "title": "Fonctions Scalaires Ligne par Ligne (Single Row Functions)",
    "title_ar": "دوال السطر الواحد النصية والرياضية",
    "duration": "12 min",
    "video_url": "https://drive.google.com/file/d/1AC326e6yo4kxhqFaQmqV1m6yOGJQLQeI/view?usp=sharing",
    "content": "# Leçon 24 : Fonctions Scalaires (Single Row Functions)\n\nLes fonctions scalaires agissent sur **chaque ligne individuellement** et renvoient un résultat pour chaque ligne.\n\n## 1. Fonctions Texte\n* `UPPER(str)` / `LOWER(str)` : Majuscules / Minuscules.\n* `CONCAT(s1, s2, ...)` : Concatène plusieurs chaînes.\n* `LENGTH(str)` : Nombre d'octets / caractères.\n* `SUBSTRING(str, pos, len)` : Extrait une sous-chaîne.\n* `TRIM(str)` : Supprime les espaces inutiles.\n\n## 2. Fonctions Mathématiques\n* `ROUND(n, d)` : Arrondi à `d` décimales.\n* `FLOOR(n)` : Arrondi à l'entier inférieur.\n* `CEIL(n)` : Arrondi à l'entier supérieur.\n* `ABS(n)` : Valeur absolue.",
    "examples": "-- Concaténer nom et prénom en majuscules\nSELECT UPPER(CONCAT(prenom, ' ', nom)) AS nom_complet \nFROM employes;\n\n-- Arrondir le salaire avec prime\nSELECT nom, ROUND(salaire * 1.125, 2) AS salaire_revalorise \nFROM employes;",
    "astuces": "⚡ **À savoir :**\nEn SQL, les indices de chaîne dans `SUBSTRING` commencent à **1** (et non à 0 comme en C, Java ou Python) !",
    "quiz": [
      {
        "id": 225,
        "question_number": "Q1",
        "question_text": "Que renvoie SUBSTRING('INFORMATIQUE', 1, 4) en SQL ?",
        "option_a": "'NFOR'",
        "option_b": "'INFO'",
        "option_c": "'FORM'",
        "option_d": "'I'",
        "correct_option": "B",
        "explanation": "En SQL, l'indexation commence à 1. Du caractère 1 sur une longueur de 4 donne 'INFO'.",
        "astuce": "Index SQL = commence à 1."
      }
    ]
  },
  {
    "num": 25,
    "title": "Fonctions d'Agrégation (COUNT, SUM, AVG, MIN, MAX)",
    "title_ar": "دوال التجميع الإحصائية COUNT - SUM - AVG - MIN - MAX",
    "duration": "13 min",
    "video_url": "https://drive.google.com/file/d/1Ov9XzFV24dW32ZV9aRUhaeDWpKVvaxrg/view?usp=sharing",
    "content": "# Leçon 25 : Fonctions d'Agrégation\n\nContrairement aux fonctions scalaires, les **fonctions d'agrégation** calculent **une valeur unique** résumant un ensemble de lignes.\n\n## Les 5 Grandes Fonctions :\n1. **`COUNT(*)`** : Nombre total de lignes (NULL compris).\n2. **`COUNT(colonne)`** : Nombre de lignes où `colonne` est non NULL.\n3. **`SUM(colonne)`** : Somme des valeurs numériques.\n4. **`AVG(colonne)`** : Moyenne arithmétique (ignore les NULLs).\n5. **`MIN(colonne)`** : Valeur minimale.\n6. **`MAX(colonne)`** : Valeur maximale.",
    "examples": "SELECT \n    COUNT(*) AS total_collaborateurs,\n    ROUND(AVG(salaire), 2) AS salaire_moyen,\n    MIN(salaire) AS salaire_minimum,\n    MAX(salaire) AS salaire_maximum,\n    SUM(salaire) AS masse_salariale_totale\nFROM employes;",
    "astuces": "⚡ **Piège de concours récurrent :**\nSi une colonne contient `[10, 20, NULL]`, que vaut `AVG(col)` ?\nIl vaut **15** ! (30 / 2). La fonction `AVG` ignore la valeur `NULL` et divise par 2, pas par 3.",
    "quiz": [
      {
        "id": 226,
        "question_number": "Q1",
        "question_text": "Si une table contient 5 lignes avec les valeurs de prime : [100, 200, NULL, 300, NULL], que renvoie COUNT(prime) ?",
        "option_a": "5",
        "option_b": "3",
        "option_c": "NULL",
        "option_d": "0",
        "correct_option": "B",
        "explanation": "COUNT(colonne) ignore les NULL et ne compte que les 3 valeurs présentes (100, 200, 300).",
        "astuce": "COUNT(col) ignore les NULLs."
      }
    ]
  },
  {
    "num": 26,
    "title": "Regrouper les Données (GROUP BY et HAVING)",
    "title_ar": "تجميع البيانات والمجموعات GROUP BY و HAVING",
    "duration": "14 min",
    "video_url": "https://drive.google.com/file/d/1RpOrHi33qTb8TPeT7m4TV72Dnn2ZEFcj/view?usp=sharing",
    "content": "# Leçon 26 : Regrouper les Données (GROUP BY et HAVING)\n\n`GROUP BY` partitionne les lignes d'une table en sous-groupes homogènes pour leur appliquer des fonctions d'agrégation.\n\n## 1. Règle Syntaxique Fondamentale\nToute colonne présente dans le `SELECT` qui n'est **PAS** encapsulée dans une fonction d'agrégation **DOIT** figurer dans la clause `GROUP BY` !\n\n## 2. Filtrer les Groupes avec `HAVING`\n* `WHERE` filtre les **lignes individuelles** avant regroupement.\n* `HAVING` filtre les **groupes agrégés** après regroupement.",
    "examples": "-- Salaire moyen par département\nSELECT dept_id, COUNT(*) AS effectif, AVG(salaire) AS moyenne\nFROM employes \nGROUP BY dept_id;\n\n-- Départements ayant plus de 2 employés et une moyenne > 10000\nSELECT dept_id, COUNT(*) AS effectif, AVG(salaire) AS moyenne\nFROM employes \nGROUP BY dept_id \nHAVING COUNT(*) > 2 AND AVG(salaire) > 10000;",
    "astuces": "⚡ **Erreur Classique :**\nÉcrire `WHERE AVG(salaire) > 10000` déclenche une erreur de syntaxe immédiate ! Les fonctions d'agrégation ne sont permises que dans le `HAVING` ou le `SELECT`.",
    "quiz": [
      {
        "id": 227,
        "question_number": "Q1",
        "question_text": "Quelle clause permet de filtrer le résultat d'une fonction d'agrégation comme COUNT(*) > 3 ?",
        "option_a": "WHERE",
        "option_b": "HAVING",
        "option_c": "FILTER",
        "option_d": "LIMIT",
        "correct_option": "B",
        "explanation": "Seule la clause HAVING peut filtrer sur les fonctions d'agrégation.",
        "astuce": "HAVING filtre après GROUP BY."
      }
    ]
  },
  {
    "num": 27,
    "title": "Les Jointures Internes (INNER JOIN)",
    "title_ar": "الربط الداخلي بين الجداول INNER JOIN",
    "duration": "15 min",
    "video_url": "https://drive.google.com/file/d/11gwF2LjcPojyhDlmQByHjOGaP_p2nHTs/view?usp=sharing",
    "content": "# Leçon 27 : Les Jointures Internes (INNER JOIN)\n\nLa **jointure interne (`INNER JOIN`)** est l'opération relationnelle qui combine deux tables sur la base d'une condition d'égalité (prédicat de jointure `ON`).\n\n## 1. Principe (Intersection A ∩ B)\nElle ne conserve que les lignes qui possèdent une **correspondance exacte** dans les deux tables.\n* Si un employé n'a pas de département (`dept_id IS NULL`), il ne sort pas.\n* Si un département n'a aucun employé, il ne sort pas.\n\n## 2. Syntaxe\n```sql\nSELECT colonnes\nFROM tableA a\nINNER JOIN tableB b ON a.cle_etrangere = b.cle_primaire;\n```",
    "examples": "-- Récupérer le nom de chaque employé et le nom de son département\nSELECT \n    e.id AS matricule,\n    e.nom,\n    e.poste,\n    d.nom_dept AS departement,\n    d.ville\nFROM employes e\nINNER JOIN departements d ON e.dept_id = d.id\nORDER BY d.nom_dept, e.nom;",
    "astuces": "⚡ **Guide Concours :**\n* `INNER JOIN` = Uniquement les correspondances mutuelles.\n* Pour conserver aussi les employés sans département, on bascule vers un `LEFT JOIN` !",
    "quiz": [
      {
        "id": 228,
        "question_number": "Q1",
        "question_text": "Dans une requête INNER JOIN entre Employes et Departements sur dept_id = id, qu'advient-il d'un employé dont dept_id est NULL ?",
        "option_a": "Il apparaît avec le nom de département 'NULL'",
        "option_b": "Il est exclu du résultat final",
        "option_c": "Il provoque une erreur d'exécution",
        "option_d": "Il est rattaché au premier département",
        "correct_option": "B",
        "explanation": "INNER JOIN ne conserve que les lignes où la condition de jointure est vérifiée (vrai). NULL n'ayant pas de correspondance, la ligne est exclue.",
        "astuce": "INNER JOIN = Intersection stricte."
      }
    ]
  }
];
