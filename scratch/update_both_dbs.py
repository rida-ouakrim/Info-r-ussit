import sqlite3

DB_CONCOURS = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"
DB_BACKEND = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"

def update_db(db_path, is_backend):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Course 12 update
    table_name = "syllabus_course" if is_backend else "courses"
    
    cursor.execute(f"SELECT content FROM {table_name} WHERE id=12")
    row = cursor.fetchone()
    if row:
        content = row[0]
        # Replace the math equation or tuple brackets with clean text
        # Old: Une BDR organise les données en tables (relations), composées de lignes (enregistrements/tuples) et de colonnes (attributs/champs).
        # We ensure it's simple text. Let's make sure it doesn't match matrix patterns.
        # We can just change (enregistrements/tuples) to (enregistrements ou tuples) and (attributs/champs) to (attributs ou champs)
        updated_content = content.replace("(enregistrements/tuples)", "(enregistrements ou tuples)")
        updated_content = updated_content.replace("(attributs/champs)", "(attributs ou champs)")
        
        cursor.execute(f"UPDATE {table_name} SET content = ? WHERE id=12", (updated_content,))
        print(f"Updated Course 12 in {db_path}")
    else:
        print(f"Course 12 not found in {db_path}")

    # 2. Course 13 update
    cursor.execute(f"SELECT content FROM {table_name} WHERE id=13")
    row = cursor.fetchone()
    if row:
        content = row[0]
        new_section_4 = """## 4. Outils et Techniques de la GPI

### 4.1. Organigramme des Tâches (WBS - Work Breakdown Structure)
Décomposition hiérarchique du travail total du projet en éléments plus petits et gérables (lots de travail). Chaque niveau représente une décomposition plus détaillée.
*   **Exemple concret (Projet de Site E-commerce) :**
    *   **Niveau 1 :** Projet E-commerce
    *   **Niveau 2 :** Conception (UML, Spécifications) | Développement | Tests & Validation | Déploiement
    *   **Niveau 3 (sous Développement) :** Front-end (UI, intégration) | Back-end (API, Authentification) | Base de données (Schéma, Migrations)

### 4.2. Diagramme de Gantt
Représentation graphique du calendrier du projet sous forme de barres horizontales. Il affiche la liste des tâches, leurs durées, leurs dates de début/fin, les ressources affectées, ainsi que les dépendances (prédécesseurs).
*   **Exemple de planification :**
    | Tâche | Description | Durée (Jours) | Prédécesseurs |
    | :--- | :--- | :--- | :--- |
    | **T1** | Rédaction du cahier des charges | 5 | Aucun |
    | **T2** | Conception de la base de données | 3 | T1 |
    | **T3** | Développement de l'API Backend | 8 | T2 |
    | **T4** | Intégration de l'interface Frontend | 6 | T2 |
    | **T5** | Tests unitaires & Déploiement | 3 | T3, T4 |

### 4.3. Diagramme PERT (Program Evaluation and Review Technique)
Outil de planification sous forme de réseau de tâches (graphe fléché). Il permet de calculer les dates au plus tôt, les dates au plus tard, les marges libres/totales, et d'identifier le **chemin critique** (la suite de tâches sans marge dont le retard retarde l'ensemble du projet).
*   **Calcul de la durée (Moyenne pondérée PERT) :**
    Durée estimée = (O + 4M + P) / 6
    *(O = Optimiste, M = Plus probable, P = Pessimiste)*
*   **Exemple de réseau PERT simple :**
    *   Tâche A (3j) -> Tâche B (5j) -> Tâche D (2j)
    *   Tâche A (3j) -> Tâche C (2j) -> Tâche D (2j)
    *   *Chemin critique :* A -> B -> D (Durée totale = 3 + 5 + 2 = 10 jours). La branche C a 3 jours de marge.

### 4.4. Gestion des Risques
Processus structuré pour anticiper et atténuer les incertitudes. Il comprend l'identification, l'évaluation (Impact x Probabilité), la planification de réponses (Éviter, Atténuer, Transférer, Accepter) et la surveillance.
*   **Exemple de Registre des Risques (Matrice 3x3) :**
    | Risque Identifié | Probabilité | Impact | Plan d'Atténuation (Mitigation) |
    | :--- | :--- | :--- | :--- |
    | Indisponibilité du serveur GCP | Faible | Élevé | Mettre en place des sauvegardes quotidiennes automatisées et redondance multi-zone. |
    | Retard sur les livrables d'authentification | Moyenne | Moyen | Utiliser des bibliothèques standards (OAuth2, JWT) au lieu de réécrire le code de zéro. |
    | Changement des spécifications du client | Élevée | Moyen | Mettre en place un processus formel de demande de changement (Change Request) et des sprints agiles courts. |

### 4.5. Gestion de la Qualité
Processus pour s'assurer que le produit logiciel final répond aux exigences spécifiées (Assurance Qualité) et fonctionne sans régressions (Contrôle Qualité).
*   **Exemples de techniques :**
    *   **Revues de code (Code Reviews) :** Relecture des Pull Requests par les pairs.
    *   **Tests automatisés :** Intégration de tests unitaires (Jest, JUnit, PyTest) exécutés automatiquement lors de chaque commit via une pipeline CI/CD (GitHub Actions, Jenkins).
    *   **Normes de codage :** Utilisation de Linters (ESLint, Black) pour garantir la propreté du code.

### 4.6. Gestion des Parties Prenantes (Stakeholders)
Processus d'identification et de communication avec les acteurs clés (internes ou externes) ayant un intérêt ou une influence sur le projet.
*   **Matrice Pouvoir / Intérêt (Exemple d'alignement) :**
    *   **Pouvoir Élevé / Intérêt Élevé (À gérer de près) :** Client final, Commanditaire (Sponsor).
    *   **Pouvoir Élevé / Intérêt Faible (À satisfaire) :** Directeur financier, Responsable sécurité.
    *   **Pouvoir Faible / Intérêt Élevé (À informer) :** Utilisateurs finaux, Équipe de support.
    *   **Pouvoir Faible / Intérêt Faible (À surveiller) :** Fournisseurs de composants génériques."""
        
        index = content.find("## 4. Outils et Techniques de la GPI")
        if index != -1:
            updated_content = content[:index] + new_section_4
            cursor.execute(f"UPDATE {table_name} SET content = ? WHERE id=13", (updated_content,))
            print(f"Updated Course 13 in {db_path}")
        else:
            print(f"Section 4 heading not found in Course 13 in {db_path}")
    else:
        print(f"Course 13 not found in {db_path}")
        
    conn.commit()
    conn.close()

update_db(DB_CONCOURS, False)
update_db(DB_BACKEND, True)
print("All updates completed successfully!")
