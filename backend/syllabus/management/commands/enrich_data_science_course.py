"""
Management command: enrich_data_science_course
Enrichit les cours de la filière Data Scientist & Développeur IA (DATA_SCIENCE_IA)
avec des contenus académiques de très haut niveau, des mathématiques LaTeX impeccables (sans fautes ext...),
des schémas d'architecture illustrés et du code PyTorch / Scikit-Learn exécutable.
"""
from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

COURSES_DATA_SCIENCE = [
    {
        "title": "Module 01 : Algorithmes de Machine Learning Supervisé et Non Supervisé",
        "content": r"""# Module 01 : Algorithmes de Machine Learning Supervisé et Non Supervisé

> 🎓 **Filière :** Data Scientist & Développeur IA | 📌 **Niveau :** Master & Ingénieur d'État

---

## 📌 Résumé Théorique Approfondi

Le Machine Learning (Apprentissage Automatique) repose sur l'apprentissage de motifs statistiques complexes à partir d'observations $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^N$.

### 📊 Décomposition du Compromis Biais-Variance (Bias-Variance Tradeoff)

La décomposition de l'erreur quadratique moyenne de prédiction s'exprime formellement par :

$$\text{Erreur Totale} = \text{Biais}^2 + \text{Variance} + \sigma_{\text{irréductible}}^2$$

![Compromis Biais-Variance](/images/bias_variance_diagram.png)

---

## 1. Apprentissage Supervisé (Supervised Learning)

### 1.1 Régression Linéaire Multiple & Régularisation (Ridge / Lasso / ElasticNet)

Le modèle de régression linéaire estime la cible par :

$$\hat{y}_i = \boldsymbol{\beta}^T \mathbf{x}_i + \beta_0$$

#### Fonction de Perte Erreur Quadratique Moyenne (MSE) :
$$\mathcal{L}_{\text{MSE}}(\boldsymbol{\beta}) = \frac{1}{2N} \sum_{i=1}^N \left(y_i - \boldsymbol{\beta}^T \mathbf{x}_i - \beta_0\right)^2 = \frac{1}{2N} \|\mathbf{y} - \mathbf{X}\boldsymbol{\beta}\|_2^2$$

#### Solution Analytique des Moindres Carrés Ordinaires (OLS) :
$$\hat{\boldsymbol{\beta}}_{\text{OLS}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$$

#### Régularisation L2 (Régression Ridge) :
$$\mathcal{L}_{\text{Ridge}}(\boldsymbol{\beta}) = \frac{1}{2N} \|\mathbf{y} - \mathbf{X}\boldsymbol{\beta}\|_2^2 + \frac{\lambda}{2} \|\boldsymbol{\beta}\|_2^2 \implies \hat{\boldsymbol{\beta}}_{\text{Ridge}} = (\mathbf{X}^T \mathbf{X} + \lambda \mathbf{I})^{-1} \mathbf{X}^T \mathbf{y}$$

#### Régularisation L1 (Régression Lasso) :
$$\mathcal{L}_{\text{Lasso}}(\boldsymbol{\beta}) = \frac{1}{2N} \|\mathbf{y} - \mathbf{X}\boldsymbol{\beta}\|_2^2 + \lambda \|\boldsymbol{\beta}\|_1$$

---

### 1.2 Régression Logistique & Classification Binaire

$$P(y=1 \mid \mathbf{x}) = \sigma(\boldsymbol{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\boldsymbol{w}^T \mathbf{x} + b)}}$$

#### Fonction de Perte Entropie Croisée Binaire (Log-Loss) :
$$\mathcal{L}_{\text{BCE}}(\boldsymbol{w}) = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i) \right]$$

---

### 1.3 Machine à Vecteurs de Support (SVM - Support Vector Machines)

Hyperplan séparateur optimal maximisant la marge géométrique :

$$\max_{\boldsymbol{w}, b} \frac{2}{\|\boldsymbol{w}\|_2} \quad \text{sujet à} \quad y_i (\boldsymbol{w}^T \mathbf{x}_i + b) \geq 1, \quad \forall i=1, \dots, N$$

#### Astuce du Noyau (Kernel Trick) :
*   **Noyau RBF (Gaussien) :** $K(\mathbf{x}, \mathbf{x}') = \exp\left(-\gamma \|\mathbf{x} - \mathbf{x}'\|_2^2\right)$
*   **Noyau Polynomial :** $K(\mathbf{x}, \mathbf{x}') = (\mathbf{x}^T \mathbf{x}' + c)^d$

---

### 1.4 Ensemble Learning : Random Forest vs XGBoost / LightGBM

| Algorithme | Type | Principe de Fonctionnement | Avantages | Pièges Concours |
| :--- | :--- | :--- | :--- | :--- |
| **Random Forest** | Bagging | $M$ arbres indépendants bootstrapés. | Réduit la variance sans augmenter le biais. | Moins adapté aux matrices textuelles très creuses. |
| **XGBoost / LightGBM** | Boosting | Arbres séquentiels corrigeant le gradient residual. | Performance état de l'art sur données tabulaires. | Sensible au sur-apprentissage si $\eta$ est élevé. |

---

## 2. Apprentissage Non Supervisé (Unsupervised Learning)

### 2.1 K-Means & Inertie Intra-Classe (WCSS)

$$\text{WCSS} = \sum_{k=1}^K \sum_{\mathbf{x}_i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|_2^2$$

*   **Score de Silhouette :** $s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$ (valeur proche de $+1$ = excellent clustering).
""",
        "examples": r"""# Implémentation Complete Python / Scikit-Learn : Pipelines, Cross-Validation & Modèles

import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Chargement des données
data = load_breast_cancer()
X, y = data.data, data.target

# 2. Division Stratifiée Train/Test (80% / 20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Standardisation des variables (fit STRICTEMENT sur train)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Réduction de dimensionnalité via ACP (PCA)
pca = PCA(n_components=0.95, random_state=42) # Conserve 95% de la variance
X_train_pca = pca.fit_transform(X_train_scaled)
X_test_pca = pca.transform(X_test_scaled)

print(f"Nombre de composantes retenues par l'ACP : {pca.n_components_}")

# 5. Grid Search CV avec Random Forest
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10],
    'min_samples_split': [2, 5]
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=cv,
    scoring='roc_auc',
    n_jobs=-1
)

grid_search.fit(X_train_pca, y_train)

# 6. Meilleur Modèle & Évaluation sur Jeu de Test
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test_pca)
y_prob = best_model.predict_proba(X_test_pca)[:, 1]

print("\n--- Meilleur Paramétrage ---")
print(grid_search.best_params_)
print("\n--- Rapport de Classification ---")
print(classification_report(y_test, y_pred, target_names=data.target_names))
print(f"Score AUC-ROC final : {roc_auc_score(y_test, y_prob):.4f}")
""",
        "astuces": r"""⚡ **Astuces & Pièges Recurrents des Concours en Machine Learning :**

1. **Formule du Biais-Variance :** Retenez $\text{Erreur} = \text{Biais}^2 + \text{Variance} + \sigma^2$. Un modèle trop simple a un Biais élevé (Sous-apprentissage), un modèle trop complexe a une Variance élevée (Sur-apprentissage).
2. **Fuite de Données (Data Leakage) :** Appliquez toujours `StandardScaler.fit()` uniquement sur le jeu d'entraînement (`X_train`), puis `transform()` sur `X_test`.
3. **Pénalités :** Lasso (L1) = sélection de variables (mise à zéro de poids). Ridge (L2) = réduction contrôlée de la norme des poids.
"""
    },
    {
        "title": "Module 02 : Deep Learning, Reseaux de Neurones et PyTorch",
        "content": r"""# Module 02 : Deep Learning, Reseaux de Neurones et PyTorch

> 🎓 **Filière :** Data Scientist & Développeur IA | 📌 **Niveau :** Master & Ingénieur d'État

---

## 📌 Résumé Théorique Approfondi

Le Deep Learning s'appuie sur des réseaux de neurones profonds capables d'extraire automatiquement des représentations hiérarchiques de données complexes (images, audio, séquences).

![Architecture CNN PyTorch](/images/cnn_architecture_diagram.png)

---

## 1. Architecture du Perceptron Multi-Couches (MLP)

### 1.1 Fonctions d'Activation Principales

*   **ReLU (Rectified Linear Unit) :** $f(x) = \max(0, x)$
*   **Leaky ReLU :** $f(x) = \max(\alpha x, x)$ avec $\alpha \approx 0.01$ (résout le problème des *neurones morts*)
*   **Sigmoïde :** $\sigma(x) = \frac{1}{1 + e^{-x}}$
*   **Softmax :** Distribution de probabilités pour $K$ classes :

$$P(y = k \mid \mathbf{x}) = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}$$

---

### 1.2 Rétropropagation du Gradient (Backpropagation & Chain Rule)

La dérivée partielle de la perte $\mathcal{L}$ par rapport à un poids $w_{ij}^{(l)}$ s'exprime par la règle de dérivation en chaîne :

$$\frac{\partial \mathcal{L}}{\partial w_{ij}^{(l)}} = \frac{\partial \mathcal{L}}{\partial a_j^{(l)}} \cdot \frac{\partial a_j^{(l)}}{\partial z_j^{(l)}} \cdot \frac{\partial z_j^{(l)}}{\partial w_{ij}^{(l)}}$$

---

## 2. Réseaux de Neurones Convolutifs (CNN)

### 2.1 Équation de Dimension de Sortie d'une Conv2D

Pour une image d'entrée de largeur $W$, un noyau $K$, un padding $P$ et un stride $S$ :

$$O = \left\lfloor \frac{W - K + 2P}{S} \right\rfloor + 1$$

---

## 3. Techniques de Régularisation

*   **Dropout :** Désactive aléatoirement une fraction $p$ de neurones durant l'entraînement pour éviter la co-adaptation.
*   **Batch Normalization :** Normalise les activations intermédiaires ($\mu_B, \sigma_B^2$) pour stabiliser et accélérer la convergence.
""",
        "examples": r"""# Implémentation PyTorch Complete : Création, Entraînement et Évaluation d'un CNN

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# 1. Configuration du device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Exécution sur le device : {device}")

# 2. Définition de l'Architecture CNN en PyTorch
class ConvNet(nn.Module):
    def __init__(self, num_classes=10):
        super(ConvNet, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.dropout = nn.Dropout(p=0.4)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(self.relu(self.bn1(self.conv1(x)))) # -> [Batch, 32, 14, 14]
        x = self.pool(self.relu(self.bn2(self.conv2(x)))) # -> [Batch, 64, 7, 7]
        x = x.view(x.size(0), -1)                         # -> Flatten
        x = self.dropout(x)
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# 3. Initialisation Données Synthétiques
dummy_inputs = torch.randn(200, 1, 28, 28)
dummy_labels = torch.randint(0, 10, (200,))
dataset = TensorDataset(dummy_inputs, dummy_labels)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

# 4. Modèle, Criterion & Optimiseur
model = ConvNet(num_classes=10).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 5. Boucle d'Entraînement
model.train()
for epoch in range(3):
    running_loss = 0.0
    for images, labels in dataloader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * images.size(0)
        
    print(f"Époque [{epoch+1}/3] - Perte moyenne : {running_loss / len(dataset):.4f}")
""",
        "astuces": r"""⚡ **Astuces & Pièges Recurrents (Deep Learning & PyTorch) :**

1. **`zero_grad()` Obligatoire :** En PyTorch, réinitialisez toujours les gradients via `optimizer.zero_grad()` avant chaque appel à `loss.backward()`.
2. **Passage de mode `eval()` :** Lors du test, exécutez `model.eval()` et entourez l'inférence par `with torch.no_grad():`.
3. **Calcul de taille Conv2D :** Image $28 \times 28$, noyau $3 \times 3$, padding $1$, stride $1$ $\implies$ sortie $28 \times 28$. Avec MaxPool $2 \times 2$ (stride 2) $\implies$ $14 \times 14$.
"""
    },
    {
        "title": "Module 03 : Traitement du Langage (NLP), Transformers et MLOps",
        "content": r"""# Module 03 : Traitement du Langage (NLP), Transformers et MLOps

> 🎓 **Filière :** Data Scientist & Développeur IA | 📌 **Niveau :** Master & Ingénieur d'État

---

## 📌 Résumé Théorique Approfondi

L'IA moderne s'appuie sur le Traitement du Langage Naturel (NLP), l'Attention des Transformers et les architectures RAG (Retrieval-Augmented Generation).

![Architecture Transformer & RAG](/images/transformer_rag_diagram.png)

---

## 1. Représentations Textuelles & Embeddings

### 1.1 Formule du TF-IDF

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \log\left(\frac{|D|}{|\{d \in D : t \in d\}|}\right)$$

---

## 2. Architecture Transformer & Auto-Attention

### 2.1 Équation Fondamentale de l'Attention Scalée

$$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{Softmax}\left( \frac{\mathbf{Q} \mathbf{K}^T}{\sqrt{d_k}} \right) \mathbf{V}$$

*   **Rôle du facteur d'échelle $\sqrt{d_k}$ :** Empêche la saturation de la fonction Softmax lorsque la dimension $d_k$ est grande.

---

## 3. Architecture RAG & Principes MLOps

### Pipeline RAG :
1.  **Chunking & Embedding :** Vectorisation des documents dans une Vector DB (FAISS / ChromaDB).
2.  **Retrieval :** Recherche des $k$ passages les plus similaires par **Similarité Cosinus** $\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$.
3.  **Generation :** Le LLM génère une réponse factuelle basée sur le contexte extrait.
""",
        "examples": r"""# Exemple Python HuggingFace / Transformers : Classification avec CamemBERT

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# 1. Chargement du Tokenizer et du Modèle Pré-entraîné CamemBERT
model_name = "camembert-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# 2. Préparation du Texte d'Entrée
textes = [
    "Ce modèle de Machine Learning donne de très bons résultats d'exactitude !",
    "L'entraînement a échoué à cause d'une fuite de données critique."
]

# 3. Tokenisation avec Padding et Truncation
tokens = tokenizer(
    textes,
    padding=True,
    truncation=True,
    max_length=64,
    return_tensors="pt"
)

# 4. Inférence (Mode Évaluation sans Gradient)
model.eval()
with torch.no_grad():
    outputs = model(**tokens)
    probabilities = torch.softmax(outputs.logits, dim=-1)

# 5. Affichage des Résultats
for i, texte in enumerate(textes):
    prob_pos = probabilities[i][1].item()
    print(f"Texte : '{texte}'")
    print(f"  -> Probabilité de classe positive : {prob_pos * 100:.2f}%\n")
""",
        "astuces": r"""⚡ **Astuces & Pièges Recurrents (Transformers & MLOps) :**

1. **Rôle de $\sqrt{d_k}$ :** Division indispensable pour **stabiliser la variance** du produit scalaire à $1$, évitant la saturation de la fonction Softmax.
2. **BERT vs GPT :** BERT = Encodeur bidirectionnel (Masked LM), parfait pour la classification. GPT = Décodeur autorégressif (Causal LM), parfait pour la génération.
3. **Data Drift vs Concept Drift :** Data Drift = changement dans $P(\mathbf{X})$. Concept Drift = changement dans la loi $P(y \mid \mathbf{X})$.
"""
    }
]


class Command(BaseCommand):
    help = "Enrichit les cours Data Scientist & IA avec du contenu académique sans fautes LaTeX et avec illustrations visualisées."

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code="DATA_SCIENCE_IA").first()
        if not subdomain:
            self.stderr.write("Sous-domaine DATA_SCIENCE_IA introuvable dans PostgreSQL !")
            return

        self.stdout.write("Mise a jour des cours avec illustrations et LaTeX parfait...")

        for course_data in COURSES_DATA_SCIENCE:
            Course.objects.update_or_create(
                subdomain=subdomain,
                title=course_data["title"],
                defaults={
                    "content": course_data["content"].strip(),
                    "examples": course_data["examples"].strip(),
                    "astuces": course_data["astuces"].strip()
                }
            )
            self.stdout.write(self.style.SUCCESS(f"  [OK] {course_data['title']} mis a jour avec succes."))

        self.stdout.write(self.style.SUCCESS("\nMise a jour des cours terminee avec succes !"))
