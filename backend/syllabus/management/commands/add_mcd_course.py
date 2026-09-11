"""
add_mcd_course.py
=================
Adds a comprehensive MCD (Modèle Conceptuel de Données) course to subdomain DEV_SI_BD.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course


MCD_CONTENT = r"""# Modèle Conceptuel de Données (MCD)

## Introduction

Le **Modèle Conceptuel de Données (MCD)** est un outil de modélisation utilisé en phase de conception d'un système d'information. Il permet de représenter graphiquement les **entités**, les **associations** et les **cardinalités** d'un domaine métier, indépendamment de toute technologie de base de données.

Le MCD fait partie de la méthode **MERISE**, largement utilisée dans les pays francophones pour la conception de systèmes d'information.

---

## 1. Les Concepts Fondamentaux

### 1.1 Entité (Entity)

Une **entité** est un objet du monde réel ayant une existence propre et pouvant être identifié de manière unique.

- **Représentation :** Rectangle avec le nom de l'entité en haut
- **Exemples :** Étudiant, Produit, Commande, Professeur

Chaque entité possède des **attributs** (propriétés) qui la décrivent :
- `Étudiant` : nom, prénom, date_naissance, adresse
- `Produit` : référence, désignation, prix_unitaire

### 1.2 Identifiant (Clé)

L'**identifiant** est un attribut (ou ensemble d'attributs) qui permet d'identifier de manière unique chaque occurrence d'une entité.

- **Convention :** souligné dans le schéma
- **Exemples :** `N°Étudiant`, `Code_Produit`, `N°Commande`

> Un bon identifiant est **unique**, **non nul** et **stable** dans le temps.

### 1.3 Association (Relationship)

Une **association** est un lien sémantique entre deux ou plusieurs entités. Elle traduit une règle de gestion du domaine.

- **Représentation :** Losange (ou ovale) relié aux entités participantes
- **Verbe d'action :** Acheter, Enseigner, Inscrire, Commander

**Exemple :** Un Étudiant *s'inscrit* à un Module → Association "Inscrire"

### 1.4 Cardinalités

Les **cardinalités** expriment le nombre minimum et maximum de fois qu'une occurrence d'une entité peut participer à une association.

| Notation | Signification |
|----------|---------------|
| (0,1) | 0 ou 1 fois (optionnel, unique) |
| (1,1) | Exactement 1 fois (obligatoire, unique) |
| (0,n) | 0 ou plusieurs fois (optionnel, multiple) |
| (1,n) | 1 ou plusieurs fois (obligatoire, multiple) |

**Exemple de lecture :**
- Un Étudiant s'inscrit à **(1,n)** modules → au moins 1, possiblement plusieurs
- Un Module accueille **(0,n)** étudiants → 0 ou plusieurs

---

## 2. Types d'Associations

### 2.1 Association binaire
Relie **deux** entités. C'est le cas le plus fréquent.

### 2.2 Association ternaire
Relie **trois** entités simultanément (ex: Fournisseur *livre* Produit à Magasin).

### 2.3 Association réflexive
Une entité est associée **à elle-même** (ex: Employé *dirige* Employé).

### 2.4 Association porteuse de données
L'association peut posséder ses propres attributs (ex: association "Commander" avec attribut `quantité`).

---

## 3. Règles de Gestion

Les **règles de gestion** sont des contraintes métier qui déterminent les cardinalités :

- « Un client peut passer plusieurs commandes » → Cardinalité (0,n) côté Client
- « Chaque commande est passée par un seul client » → Cardinalité (1,1) côté Commande

> **Astuce Concours :** Lisez attentivement l'énoncé pour extraire les règles de gestion. Les mots-clés sont : "un seul", "au moins un", "plusieurs", "peut", "doit", "optionnel".

---

## 4. Passage MCD → MLD (Modèle Logique de Données)

### Règles de transformation :

**Règle 1 : Entité → Table**
Chaque entité devient une table. L'identifiant de l'entité devient la **clé primaire**.

**Règle 2 : Association (1,1) — (0,n) ou (1,n)**
La clé primaire du côté (0,n) migre comme **clé étrangère** dans la table du côté (1,1).

**Règle 3 : Association (0,n) — (0,n)**
L'association devient une **table de liaison** (table intermédiaire) contenant les clés primaires des deux entités.

**Règle 4 : Association porteuse**
Les attributs de l'association sont ajoutés à la table de liaison.

---

## 5. Exemple Complet : Gestion Scolaire

### Règles de gestion :
- Un professeur enseigne au moins un module
- Un module est enseigné par un seul professeur
- Un étudiant s'inscrit à au moins un module
- Un module accueille plusieurs étudiants
- Chaque inscription a une note

### MCD :
```
PROFESSEUR (1,n) ─── Enseigner ─── (1,1) MODULE (0,n) ─── Inscrire ─── (1,n) ÉTUDIANT
                                                          │
                                                        note
```

### MLD résultant :
- **Professeur** (N°Prof, nom, prénom, spécialité)
- **Module** (Code_Module, intitulé, volume_horaire, **#N°Prof**)
- **Étudiant** (N°Étudiant, nom, prénom, date_naissance)
- **Inscrire** (**#Code_Module**, **#N°Étudiant**, note)
"""

MCD_EXAMPLES = r"""# Exercices Corrigés MCD

## Exercice 1 : Bibliothèque

### Énoncé :
Une bibliothèque gère des livres et des adhérents :
- Chaque livre est identifié par un ISBN et a un titre, un auteur et un éditeur
- Chaque adhérent est identifié par un numéro et a un nom, prénom et adresse
- Un adhérent peut emprunter plusieurs livres
- Un livre peut être emprunté par plusieurs adhérents (à des dates différentes)
- Chaque emprunt a une date de début et une date de retour prévue

### Solution MCD :
```
LIVRE (0,n) ─── Emprunter ─── (0,n) ADHÉRENT
                   │
         date_emprunt, date_retour
```

### MLD :
- **Livre** (ISBN, titre, auteur, éditeur)
- **Adhérent** (N°Adhérent, nom, prénom, adresse)
- **Emprunter** (**#ISBN**, **#N°Adhérent**, date_emprunt, date_retour)

---

## Exercice 2 : Agence de Voyage

### Énoncé :
- Un client peut réserver plusieurs voyages
- Un voyage est proposé vers une seule destination
- Une destination peut avoir plusieurs voyages
- Chaque réservation a un nombre de places et un montant

### Solution MCD :
```
CLIENT (0,n) ─── Réserver ─── (1,n) VOYAGE (1,1) ─── Proposer ─── (0,n) DESTINATION
                  │
         nb_places, montant
```

### MLD :
- **Client** (N°Client, nom, prénom, téléphone)
- **Destination** (Code_Dest, ville, pays, description)
- **Voyage** (N°Voyage, date_départ, date_retour, prix, **#Code_Dest**)
- **Réserver** (**#N°Client**, **#N°Voyage**, nb_places, montant)

---

## Exercice 3 : Gestion d'hôpital

### Énoncé :
- Un médecin travaille dans un seul service
- Un service a plusieurs médecins
- Un patient peut consulter plusieurs médecins
- Chaque consultation a une date et un diagnostic

### Solution MCD :
```
SERVICE (1,n) ─── Travailler ─── (1,1) MÉDECIN (0,n) ─── Consulter ─── (0,n) PATIENT
                                                           │
                                                   date, diagnostic
```

### MLD :
- **Service** (Code_Service, nom, étage)
- **Médecin** (N°Médecin, nom, spécialité, **#Code_Service**)
- **Patient** (N°Patient, nom, prénom, date_naissance)
- **Consulter** (**#N°Médecin**, **#N°Patient**, date_consultation, diagnostic)
"""

MCD_ASTUCES = r"""# Astuces & Pièges Concours — MCD

## ⚡ Piège 1 : Confondre (0,n) et (1,n)
- **(0,n)** → L'entité peut NE PAS participer (optionnel)
- **(1,n)** → L'entité DOIT participer au moins une fois
- Relisez l'énoncé : "peut" vs "doit"

## ⚡ Piège 2 : Association ternaire vs 2 binaires
Si 3 entités sont liées **simultanément**, c'est une ternaire. Si les liens sont indépendants, ce sont 2 binaires.

## ⚡ Piège 3 : Passage MCD → MLD
- Cardinalité **(1,1)** → la clé étrangère migre ICI
- Cardinalité **(0,n)** — **(0,n)** → crée une TABLE DE LIAISON
- Ne jamais dupliquer une clé primaire dans 2 tables !

## ⚡ Piège 4 : Identifiant d'association
Une association n'a PAS d'identifiant propre. Son identifiant est la **combinaison des clés** des entités participantes.

## ⚡ Piège 5 : Attribut dans l'association vs l'entité
Si l'attribut dépend de DEUX entités, il va dans l'association (ex: la note d'un étudiant dans un module).
Si l'attribut dépend d'UNE seule entité, il va dans l'entité.

## ⚡ Mémo des cardinalités fréquentes :
| Cas | Côté A | Côté B |
|-----|--------|--------|
| 1 Client → N Commandes | (0,n) | (1,1) |
| N Étudiants ↔ N Modules | (1,n) | (0,n) |
| 1 Employé → 1 Bureau | (1,1) | (0,1) |
| N Fournisseurs → N Produits | (0,n) | (0,n) |
"""


class Command(BaseCommand):
    help = 'Add MCD (Modèle Conceptuel de Données) course to DEV_SI_BD'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='DEV_SI_BD').first()
        if not subdomain:
            self.stderr.write("Subdomain DEV_SI_BD not found!")
            return

        course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Modèle Conceptuel de Données (MCD) : Entité, Association, Cardinalités",
            defaults={
                'content': MCD_CONTENT,
                'examples': MCD_EXAMPLES,
                'astuces': MCD_ASTUCES,
                'video_url': 'https://www.youtube.com/watch?v=SgRPE34cunI&list=PLF2W_rB6QiYAaU6SaT3zCDBXOJ5ufSHXL',
            }
        )

        action = "Créé" if created else "Mis à jour"
        self.stdout.write(self.style.SUCCESS(f"[OK] Cours MCD {action} ! (ID: {course.id})"))
