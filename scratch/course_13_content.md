# Gestion de Projets Informatiques et Cycles de Vie Logiciels

## 1. Introduction à la Gestion de Projets Informatiques (GPI)

### 1.1. Définition et Objectifs
La gestion de projet informatique (GPI) est l'application de connaissances, compétences, outils et techniques aux activités du projet pour satisfaire les exigences du projet. Elle vise à livrer un produit, service ou résultat unique dans un délai, un budget et un niveau de qualité définis.

### 1.2. Spécificités des Projets IT
*   **Complexité et Incertitude :** Évolution rapide des technologies, exigences changeantes.
*   **Visibilité Réduite :** Le produit final est souvent abstrait jusqu'à un stade avancé.
*   **Dépendance Technologique :** Nécessite des compétences techniques pointues.
*   **Gestion du Changement :** Impact fort sur les utilisateurs finaux.

### 1.3. Le Triangle d'Or (ou Triple Contrainte)
Tout projet est contraint par trois facteurs interdépendants :
*   **Coût (Budget) :** Les ressources financières allouées.
*   **Délai (Temps) :** La durée impartie pour réaliser le projet.
*   **Qualité / Périmètre (Scope) :** Les fonctionnalités et la performance attendues du livrable.

## 2. Phases de la Gestion de Projet (selon PMBOK)

### 2.1. Démarrage (Initiation)
*   **Objectif :** Définir le projet, ses objectifs, sa faisabilité et obtenir l'autorisation formelle.
*   **Livrables clés :** Charte de projet, identification des parties prenantes.

### 2.2. Planification
*   **Objectif :** Établir la feuille de route détaillée pour atteindre les objectifs du projet.
*   **Livrables clés :** Plan de gestion de projet (WBS, calendrier, budget, plan de gestion des risques, de la qualité, des ressources, de la communication, etc.).

### 2.3. Exécution
*   **Objectif :** Réaliser le travail défini dans le plan de projet.
*   **Activités clés :** Coordination des ressources, gestion des équipes, réalisation des tâches, gestion des approvisionnements.

### 2.4. Suivi et Maîtrise (Monitoring & Control)
*   **Objectif :** Surveiller l'avancement, mesurer la performance, identifier les écarts par rapport au plan et prendre des actions correctives.
*   **Activités clés :** Suivi du budget et du calendrier, gestion des changements, reporting, contrôle qualité.

### 2.5. Clôture
*   **Objectif :** Finaliser toutes les activités du projet, obtenir l'acceptation formelle du client et archiver les documents.
*   **Livrables clés :** Rapport de clôture, leçons apprises, libération des ressources.

## 3. Cycles de Vie Logiciels (SDLC - Software Development Life Cycle)

### 3.1. Modèle en Cascade (Waterfall)
*   **Description :** Séquentiel et linéaire, chaque phase doit être entièrement terminée avant de passer à la suivante (Exigences -> Conception -> Implémentation -> Test -> Déploiement -> Maintenance).
*   **Avantages :** Simple, bien documenté, adapté aux projets avec des exigences stables.
*   **Inconvénients :** Rigide, difficile de gérer les changements, détection tardive des erreurs, faible implication du client en cours de projet.

### 3.2. Modèle en V
*   **Description :** Extension du modèle en cascade, met l'accent sur la vérification et la validation. Chaque phase de développement a une phase de test correspondante (Exigences <-> Tests d'Acceptation, Conception Générale <-> Tests d'Intégration, Conception Détaillée <-> Tests Unitaires).
*   **Avantages :** Meilleure qualité, détection précoce des défauts, traçabilité.
*   **Inconvénients :** Moins flexible que l'Agile, nécessite des exigences claires dès le début.

### 3.3. Modèle en Spirale
*   **Description :** Itératif et incrémental, axé sur la gestion des risques. Chaque itération (spirale) comprend les phases de planification, analyse des risques, ingénierie et évaluation. Le projet évolue par versions successives.
*   **Avantages :** Excellente gestion des risques, flexibilité, implication continue du client.
*   **Inconvénients :** Complexe à gérer, coûteux, nécessite une expertise en analyse de risques.

### 3.4. Méthodes Agiles (Scrum, Kanban)
*   **Description :** Approche itérative et incrémentale, axée sur la collaboration, l'adaptabilité et la livraison rapide de valeur. Le Manifeste Agile repose sur 4 valeurs et 12 principes.
    *   **Valeurs :** Individus et interactions plus que processus et outils ; Logiciel opérationnel plus que documentation exhaustive ; Collaboration avec les clients plus que négociation contractuelle ; Adaptation au changement plus que suivi d'un plan.
*   **Scrum :** Cadre Agile populaire.
    *   **Rôles :** Product Owner (définit le quoi), Scrum Master (facilite le comment), Équipe de Développement (réalise).
    *   **Cérémonies :** Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective.
    *   **Artefacts :** Product Backlog, Sprint Backlog, Incrément.
*   **Kanban :** Méthode visuelle de gestion des flux de travail.
    *   **Principes :** Visualiser le travail, limiter le travail en cours (WIP), gérer le flux, rendre les politiques explicites, améliorer en continu.
*   **Avantages :** Flexibilité, livraison rapide de valeur, satisfaction client, meilleure qualité, motivation de l'équipe.
*   **Inconvénients :** Peut être difficile à scaler, nécessite une forte implication du client, documentation potentiellement moins formelle.

### 3.5. DevOps
*   **Description :** Culture et ensemble de pratiques visant à unifier le développement (Dev) et l'exploitation (Ops) des logiciels. L'objectif est d'automatiser et d'intégrer les processus entre les équipes pour livrer des logiciels plus rapidement et de manière plus fiable.
*   **Principes :** Culture, Automatisation, Lean, Mesure, Partage (CALMS).
*   **Outils :** Git, Jenkins, Docker, Kubernetes, Ansible, etc.
*   **Avantages :** Déploiements plus rapides et fréquents, réduction des erreurs, meilleure collaboration, amélioration continue.

## 4. Outils et Techniques de la GPI

### 4.1. Organigramme des Tâches (WBS - Work Breakdown Structure)
Décomposition hiérarchique du travail total du projet en éléments plus petits et gérables. Chaque niveau représente une décomposition plus détaillée.

### 4.2. Diagramme de Gantt
Représentation graphique du calendrier du projet, montrant les tâches, leurs durées, leurs dépendances et l'avancement.

### 4.3. Diagramme PERT (Program Evaluation and Review Technique)
Outil de planification qui représente les tâches du projet sous forme de réseau, permettant d'identifier le chemin critique et d'estimer les durées avec incertitude.

### 4.4. Gestion des Risques
Processus d'identification, d'analyse, de planification de réponses et de surveillance des risques du projet.

### 4.5. Gestion de la Qualité
Ensemble des processus pour s'assurer que le projet et ses livrables répondent aux exigences de qualité spécifiées.

### 4.6. Gestion des Parties Prenantes (Stakeholders)
Processus d'identification des personnes ou groupes affectés par le projet, d'analyse de leurs attentes et de développement de stratégies pour les engager efficacement.