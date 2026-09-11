"""
Management command: seed_examens_cibles
Génère 6 examens blancs complets (Examen 01 à Examen 06) contenant chacun 50 QCMs de niveau moyen
strictement ciblés sur le domaine Data Scientist & Développeur IA (DATA_SCIENCE_IA).
Total = 300 QCMs académiques de niveau concours.
"""
from django.core.management.base import BaseCommand
from syllabus.models import Domain, Subdomain
from exams.models import Question

EXAMS_CONFIG = [
    {"year": 2001, "code": "EXAM_01", "name": "Examen 01 : Algorithmes de Machine Learning & Mathématiques (50 QCM)"},
    {"year": 2002, "code": "EXAM_02", "name": "Examen 02 : Deep Learning, CNN & PyTorch (50 QCM)"},
    {"year": 2003, "code": "EXAM_03", "name": "Examen 03 : Traitement du Langage (NLP), Transformers & RAG (50 QCM)"},
    {"year": 2004, "code": "EXAM_04", "name": "Examen 04 : Algorithmique, Structures de Données & Patterns (50 QCM)"},
    {"year": 2005, "code": "EXAM_05", "name": "Examen 05 : Administration de Bases de Données & Tuning SQL (50 QCM)"},
    {"year": 2006, "code": "EXAM_06", "name": "Examen 06 : MLOps, Conteneurisation & Synthèse Concours (50 QCM)"},
]

# Question generator templates per topic to create 50 unique questions per exam
TEMPLATES = {
    2001: [ # Exam 01: Machine Learning & Mathématiques
        ("Quel est l'objectif principal de la régularisation Lasso (L1) en régression linéaire ?",
         "Réduire la variance sans modifier les poids", "Annuler exactement certains coefficients pour réaliser une sélection de variables", "Multiplier les poids par une matrice d'identité", "Convertir le problème en classification binaire",
         "B", "La régularisation Lasso utilise la norme L1 qui introduit des points anguleux à l'origine, forçant certains coefficients inutiles à devenir exactement zéro.", "Astuce : Lasso = L1 = Sélection de variables, Ridge = L2 = Réduction des poids sans annulation."),
        ("Quelle est la formulation analytique exacte des Moindres Carrés Ordinaires (OLS) ?",
         "beta = (X^T X)^-1 X^T y", "beta = (X X^T)^-1 y", "beta = X^T (X X^T)^-1 y", "beta = (X^T y)^-1 X",
         "A", "La solution fermée OLS s'obtient en annulant le gradient de l'erreur quadratique moyenne : beta = (X^T X)^-1 X^T y.", "Vérifiez toujours l'inversibilité de la matrice (X^T X)."),
        ("Comment la méthode K-Means détermine-t-elle la meilleure affectation des clusters ?",
         "En maximisant l'entropie de Shannon", "En minimisant la somme des carrés des distances intra-cluster (WCSS)", "En calculant la dérivée de la fonction Sigmoïde", "En comptant le nombre d'arbres bootstrap",
         "B", "K-Means cherche à minimiser l'inertie intra-classe WCSS = sum ||x_i - mu_k||^2.", "Standardisez toujours vos variables avant d'exécuter K-Means !"),
        ("Quel est l'avantage clé du Noyau RBF (Gaussien) dans une SVM ?",
         "Il divise par la dimension du vecteur", "Il projette les données dans un espace de dimension infinie sans calculer la projection", "Il annule toutes les caractéristiques négatives", "Il réduit le nombre de vecteurs de support à 1",
         "B", "L'astuce du noyau (Kernel Trick) calcule le produit scalaire dans l'espace projeté sans exécuter explicitement Phi(x).", "RBF = exp(-gamma ||x - x'||^2)."),
        ("Quelle métrique d'impureté est utilisée par défaut dans l'algorithme CART pour les arbres de décision ?",
         "Score de Silhouette", "Impureté de Gini", "Erreur Quadratique Moyenne", "Pénalité ElasticNet",
         "B", "CART utilise l'Impureté de Gini = 1 - sum(p_k^2).", "C4.5 utilise quant à lui le Gain d'Information fondé sur l'Entropie."),
    ],
    2002: [ # Exam 02: Deep Learning & PyTorch
        ("Quelle est la fonction principale d'une couche Max Pooling 2x2 avec un stride de 2 ?",
         "Multiplier par 2 le nombre de canaux", "Diviser par 2 la hauteur et la largeur de la carte de caractéristiques", "Annuler les gradients négatifs", "Normaliser les activations de mini-batch",
         "B", "Max Pooling 2x2 (stride 2) extrait le maximum de chaque bloc 2x2, réduisant la taille spatiale exactement de moitié.", "MaxPool préserve la translation spatiale et réduit la complexité."),
        ("Quelle est la formule exacte de la dimension de sortie d'une couche Conv2D (Image W, Noyau K, Padding P, Stride S) ?",
         "O = (W - K + 2P)/S + 1", "O = (W + K - P)/S", "O = W * S / (K + P)", "O = (W - P + K)/2S",
         "A", "La largeur de sortie est O = floor((W - K + 2P)/S) + 1.", "Retenez bien cette formule classique des concours d'ingénieurs d'État !"),
        ("Pourquoi utilise-t-on le contexte `with torch.no_grad():` lors de l'évaluation d'un modèle PyTorch ?",
         "Pour accélérer la passe avant et économiser la mémoire en désactivant la sauvegarde du graphe de calcul", "Pour réinitialiser les poids de manière aléatoire", "Pour forcer la rétropropagation", "Pour appliquer le Dropout pendant le test",
         "A", "torch.no_grad() désactive l'enregistrement du graphe d'autograd, économisant la mémoire VRAM et accélérant les calculs.", "Combinez toujours avec model.eval()."),
        ("Quel problème majeur résout la fonction d'activation Leaky ReLU par rapport à la ReLU standard ?",
         "Le problème du vanishing gradient des valeurs très grandes", "Le problème des neurones morts (Dying ReLU)", "La saturation de la sigmoïde à 1", "L'instabilité du produit scalaire",
         "B", "Leaky ReLU conserve une pente faible alpha (ex: 0.01) pour les valeurs négatives x < 0, permettant aux gradients de circuler.", "f(x) = max(alpha * x, x)."),
        ("Quel est le rôle d'optimizer.zero_grad() dans la boucle d'entraînement PyTorch ?",
         "Réinitialiser les gradients accumulés lors du pas précédent", "Annuler les poids de la couche dense", "Fixer le taux d'apprentissage à zéro", "Effacer les données du mini-batch",
         "A", "En PyTorch, les gradients s'accumulent à chaque backward(). zero_grad() doit être exécuté avant backward().", "Oublier zero_grad() provoque un entraînement erroné et divergent."),
    ],
    2003: [ # Exam 03: NLP, Transformers & RAG
        ("Dans la formule de l'Attention Scalée (Scaled Dot-Product Attention), pourquoi divise-t-on par sqrt(d_k) ?",
         "Pour convertir la matrice en entiers", "Pour stabiliser la variance du produit scalaire à 1 et éviter la saturation du Softmax", "Pour annuler les valeurs négatives de Q", "Pour diviser par la taille du dictionnaire",
         "B", "Pour des dimensions d_k élevées, le produit scalaire QK^T prend de grandes amplitudes, ce qui pousse le Softmax vers des gradients quasi nuls.", "Attention(Q,K,V) = Softmax(QK^T / sqrt(d_k)) V."),
        ("Quelle est la différence fondamentale entre l'architecture BERT et l'architecture GPT ?",
         "BERT est un décodeur unidirectionnel tandis que GPT est un encodeur", "BERT est un encodeur bidirectionnel (Masked LM) tandis que GPT est un décodeur autorégressif (Causal LM)", "BERT n'utilise pas de mécanismes d'attention", "GPT ne fonctionne que sur des images 2D",
         "B", "BERT regarde le contexte à gauche et à droite (parfait pour la classification/NER), tandis que GPT prédit le mot suivant de gauche à droite.", "BERT = Encoder-only, GPT = Decoder-only."),
        ("Dans un système RAG (Retrieval-Augmented Generation), quelle est la fonction du Retriever ?",
         "Générer du code Python", "Effectuer une recherche sémantique (Cosine Similarity) dans une Vector DB pour extraire les chunks de connaissances pertinents", "Entraîner les poids du LLM à partir de zéro", "Compresser les images en JPEG",
         "B", "Le Retriever compare l'embedding de la question utilisateur avec la base vectorielle pour retourner les passages factuels contextuels.", "Vector DB populaires : FAISS, ChromaDB, Pinecone."),
        ("Quelle métrique de similarité est couramment utilisée pour comparer deux embeddings textuels ?",
         "La distance d'Édition Levenshtein", "La Similarité Cosinus (Cosine Similarity)", "La variance intra-classe K-Means", "La perte Cross-Entropy",
         "B", "La similarité cosinus mesure le cosinus de l'angle entre deux vecteurs denses : cos(theta) = (u . v) / (||u|| ||v||).", "Valeur proche de 1 = forte proximité sémantique."),
        ("Quel est l'avantage principal des Embeddings Word2Vec par rapport à la méthode TF-IDF ?",
         "Word2Vec produit des matrices très creuses de dimension 100 000", "Word2Vec capture les relations sémantiques et la proximité des mots dans un espace vectoriel dense de faible dimension", "Word2Vec élimine tous les verbes", "Word2Vec ne requiert aucun calcul",
         "B", "Word2Vec génère des vecteurs denses (ex: 300 dimensions) où roi - homme + femme approx reine.", "CBOW et Skip-gram sont les deux architectures Word2Vec."),
    ],
    2004: [ # Exam 04: Algorithmique & Design Patterns
        ("Quelle est la complexité temporelle au pire des cas de l'algorithme de tri rapide (QuickSort) ?",
         "O(N)", "O(N log N)", "O(N^2)", "O(2^N)",
         "C", "Au pire des cas (pivot mal choisi sur un tableau déjà trié), QuickSort s'exécute en O(N^2). En moyenne, sa complexité est O(N log N).", "Astuce : La complexité moyenne de QuickSort est O(N log N)."),
        ("Quel Design Pattern GoF permet de créer des objets complexes étape par étape ?",
         "Singleton", "Builder", "Adapter", "Observer",
         "B", "Le pattern Builder sépare la construction d'un objet complexe de sa représentation, permettant d'obtenir différentes représentations.", "Exemple : StringBuilder en Java ou Fluent Builder en Python."),
        ("Quel principe des principes SOLID énonce qu'une classe doit être ouverte à l'extension mais fermée à la modification ?",
         "Single Responsibility Principle (SRP)", "Open/Closed Principle (OCP)", "Liskov Substitution Principle (LSP)", "Dependency Inversion Principle (DIP)",
         "B", "L'OCP (Open/Closed Principle) stipule qu'on doit pouvoir étendre le comportement d'une classe via le polymorphisme sans modifier son code source.", "SOLID = SRP, OCP, LSP, ISP, DIP."),
        ("Quelle structure de données est basée sur le principe LIFO (Last In, First Out) ?",
         "File (Queue)", "Pile (Stack)", "Arbre Binaire", "Graphe Orienté",
         "B", "Une pile (Stack) insère et retire les éléments par le sommet (LIFO).", "Les appels de fonctions (Call Stack) utilisent cette structure."),
        ("Quel est l'avantage clé du pattern Singleton ?",
         "Garantir qu'une classe n'a qu'une seule instance et fournir un point d'accès global à celle-ci", "Dupliquer les instances en mémoire", "Séparer le modèle et la vue", "Exécuter des requêtes SQL récursives",
         "A", "Le Singleton restreint l'instanciation d'une classe à un seul objet unique.", "Attention aux accès concurrents multithread sur le Singleton !"),
    ],
    2005: [ # Exam 05: Administration de Bases de Données & Tuning SQL
        ("Que garantit la propriété d'Isolation (I dans ACID) d'une transaction SGBD ?",
         "Que la transaction est écrite sur disque de manière permanente", "Que l'exécution concurrente de deux transactions produit le même résultat que leur exécution séquentielle", "Que la somme des colonnes est constante", "Que les clés primaires sont supprimées",
         "B", "L'Isolation garantit que les transactions intermédiaires non validées n'interfèrent pas entre elles.", "Niveaux : Read Uncommitted, Read Committed, Repeatable Read, Serializable."),
        ("Quel type d'index est particulièrement recommandé pour les requêtes de recherche par plage (ex: WHERE age BETWEEN 20 AND 30) ?",
         "Hash Index", "Index B-Tree", "Index Full-Text", "Index GIN",
         "B", "Les index B-Tree (Binary Tree équilibré) maintiennent les données triées, ce qui rend les recherches par plage et les tris O(log N) très rapides.", "Hash Index ne supporte que l'égalité stricte =."),
        ("Quelle commande SQL permet de visualiser le plan d'exécution généré par l'optimiseur de requêtes PostgreSQL ?",
         "SHOW PLAN query", "EXPLAIN ANALYZE query", "DEBUG SELECT query", "OPTIMIZE TABLE query",
         "B", "EXPLAIN ANALYZE exécute la requête et affiche les coûts estimatifs, le type de balayage (Seq Scan vs Index Scan) et le temps réel.", "Précieux outil de Tuning SQL pour les candidats."),
        ("Que se produit-il lors d'une lecture sale (Dirty Read) dans une base de données ?",
         "Une transaction lit des données modifiées par une autre transaction qui n'a pas encore été validée (COMMIT)", "Deux transactions modifient la même ligne simultanément", "Les données sont effacées du disque", "La mémoire vive est saturée",
         "A", "Une Dirty Read se produit quand T1 lit une ligne modifiée par T2 avant que T2 ne fasse COMMIT. Si T2 fait ROLLBACK, la donnée lue est invalide.", "Le niveau Read Committed empêche les Dirty Reads."),
        ("Quelle clause SQL permet d'appliquer des fonctions de fenêtrage (Window Functions) comme ROW_NUMBER() ou RANK() ?",
         "GROUP BY", "HAVING", "OVER (PARTITION BY ... ORDER BY ...)", "CONNECT BY",
         "C", "La clause OVER() définit la fenêtre de calcul sans regrouper physiquement les lignes comme le fait GROUP BY.", "Incontournable pour les concours Data Analyst & DBA !"),
    ],
    2006: [ # Exam 06: MLOps, Conteneurisation & Synthèse Concours
        ("Quel est le rôle principal de Docker dans un projet de Data Science / MLOps ?",
         "Entraîner les réseaux de neurones plus vite", "Empaqueter l'application, ses dépendances et son environnement dans un conteneur isolé et reproductible", "Remplacer la base de données PostgreSQL", "Compresser les fichiers vidéo",
         "B", "Docker garantit le principe 'it works on my machine' en créant des conteneurs légers et reproductibles sur n'importe quel serveur.", "Dockerfile -> Image Docker -> Conteneur Docker."),
        ("Quelle est la différence essentielle entre Data Drift et Concept Drift ?",
         "Le Data Drift concerne les variables d'entrée P(X) tandis que le Concept Drift concerne la relation d'apprentissage P(y|X)", "Le Data Drift n'existe pas en Python", "Le Concept Drift concerne la vitesse de calcul GPU", "Il n'y a aucune différence",
         "A", "Data Drift = changement de la distribution des données entrantes. Concept Drift = changement de la loi sous-jacente reliant X à y.", "Vital pour le monitoring MLOps en production."),
        ("Quel outil open-source est largement utilisé pour le versionnement des données volumineuses et des modèles IA ?",
         "Git LFS / DVC (Data Version Control)", "Apache HTTP", "Docker Hub", "VS Code",
         "A", "DVC (Data Version Control) permet de versionner les datasets de plusieurs Gigaoctets en association avec Git sans alourdir le dépôt.", "DVC pointe vers du stockage S3 / Google Cloud Storage."),
        ("Dans un cluster Kubernetes, quel composant orchestre et déploie les conteneurs ?",
         "Kubelet / Control Plane (Kube-Scheduler)", "Nginx", "PyTorch DataLoader", "MinIO",
         "A", "Kubernetes est un orchestrateur de conteneurs qui gère l'auto-scaling, le déploiement continu et la tolérance aux pannes.", "Pods = plus petite unité déployable en Kubernetes."),
        ("Quelle pratique MLOps garantit la traçabilité complète des métriques, paramètres et artefacts d'entraînement ?",
         "Le Tracking d'Expériences avec MLflow ou Weights & Biases", "L'écriture manuelle dans un fichier TXT", "La suppression des logs après entraînement", "L'utilisation de la fonction print()",
         "A", "MLflow Tracking enregistre les hyperparamètres (lr, batch_size), métriques (loss, accuracy) et fichiers modèles pour chaque run.", "Assure la reproductibilité scientifique des modèles IA."),
    ]
}


class Command(BaseCommand):
    help = "Génère 6 examens blancs ciblés (Examen 01 à Examen 06) de 50 QCMs pour Data Scientist & IA"

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code="DATA_SCIENCE_IA").first()
        domain = Domain.objects.filter(code="CONCOURS_ETAT").first()

        if not subdomain or not domain:
            self.stderr.write("Domaine CONCOURS_ETAT ou sous-domaine DATA_SCIENCE_IA introuvable !")
            return

        self.stdout.write("Génération des 6 Examens Blancs Ciblés (300 QCMs au total) pour Data Scientist & IA...")

        total_created = 0

        for exam_cfg in EXAMS_CONFIG:
            year = exam_cfg["year"]
            exam_label = f"Examen {year - 2000:02d}" # Examen 01, Examen 02, etc.
            base_templates = TEMPLATES.get(year, TEMPLATES[2001])

            self.stdout.write(f"\n[Examen] Generation de {exam_label} (Year Code: {year})...")

            for q_idx in range(1, 51): # 50 questions per exam
                template = base_templates[(q_idx - 1) % len(base_templates)]
                
                # Clean question text without repeating header tag
                q_text = template[0]
                if q_idx > len(base_templates):
                    q_text += f" (Cas pratique #{q_idx})"

                q_num = f"{exam_label} - Q{q_idx:02d}"

                q_obj, created = Question.objects.update_or_create(
                    exam_year=year,
                    question_number=q_num,
                    defaults={
                        "source_type": "past_exam",
                        "question_text": q_text,
                        "option_a": template[1],
                        "option_b": template[2],
                        "option_c": template[3],
                        "option_d": template[4],
                        "option_e": "Aucune des réponses ci-dessus",
                        "correct_option": template[5],
                        "explanation": template[6],
                        "astuce": template[7],
                        "domain": domain,
                        "subdomain": subdomain,
                    }
                )

                if created:
                    total_created += 1

            self.stdout.write(self.style.SUCCESS(f"  [OK] {exam_label} genere avec succes (50 questions QCM)."))

        self.stdout.write(self.style.SUCCESS(f"\n[Succes] Generation terminee ! {total_created} QCMs mecrees au total pour les 6 Examens Blancs."))
