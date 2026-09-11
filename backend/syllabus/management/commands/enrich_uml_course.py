"""
enrich_uml_course.py
====================
Enriches the UML course with complete definitions, diagrams (Use Case, Class, Sequence,
State, Activity), and exam tips.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

UML_CONTENT = r"""# Conception Orientée Objet avec UML 2.5

## Introduction à UML (Unified Modeling Language)

UML est un langage de modélisation visuel standardisé permettant de spécifier, visualiser, construire et documenter les artefacts d'un système logiciel.

UML 2.5 définit **14 types de diagrammes** répartis en deux catégories :
- **Diagrammes Structurels** (statiques) : Diagramme de classes, d'objets, de composants, de déploiement...
- **Diagrammes Comportementaux** (dynamiques) : Diagramme de cas d'utilisation, de séquence, d'activité, d'états-transitions...

---

## 1. Diagramme de Cas d'Utilisation (Use Case Diagram)

Il représente les fonctionnalités du système du point de vue des utilisateurs (**acteurs**).

### Éléments clés :
- **Acteur** : Rôle joué par un utilisateur humain ou un système externe (bonhomme).
- **Cas d'utilisation** : Fonctionnalité offerte par le système (ovale).
- **Relations entre cas d'utilisation :**
  - **`<<include>>` (Inclusion) :** Obligatoire. Le cas source nécessite TOUJOURS l'exécution du cas cible (ex: *Authentification* est inclus dans *Consulter Solde*).
  - **`<<extend>>` (Extension) :** Optionnel/Conditionnel. Le cas cible s'exécute dans certains cas précis (ex: *Générer Reçu* étend *Retirer Argent*).
  - **Généralisation :** Héritage entre acteurs ou cas d'utilisation.

---

## 2. Diagramme de Classes (Class Diagram)

C'est le cœur de la modélisation UML. Il décrit les classes du système, leurs attributs, opérations et relations.

### Relations entre classes :
1. **Association** : Lien simple avec multiplicités `0..1`, `1..*`, `*`.
2. **Agrégation (losange vide ♢) :** Relation "partie-tout" faible. Si le "tout" est détruit, les "parties" peuvent survivre (ex: Université et Étudiants).
3. **Composition (losange plein ◆) :** Relation "partie-tout" forte. La vie des parties est liée au tout (ex: Fichier et Chapitres).
4. **Héritage / Généralisation (flèche triangle vide ▷) :** Relation "est un" (`Client extends Personne`).

---

## 3. Diagramme de Séquence (Sequence Diagram)

Diagramme dynamique chronologique qui montre les échanges de messages entre objets dans le temps.

### Éléments :
- **Ligne de vie (Lifeline) :** Rectangles en haut avec ligne pointillée verticale.
- **Message synchrone (flèche pleine ➔) :** L'émetteur attend la réponse.
- **Message asynchrone (flèche ouverte ➔) :** L'émetteur n'attend pas.
- **Message de retour (flèche pointillée <--).**
- **Alt / Loop / Opt :** Fragments combinés pour les alternatives, boucles et options.

---

## 4. Diagramme d'Activité (Activity Diagram)

Représente le flux de travail (workflow) ou l'enchaînement des activités d'un processus.

### Éléments :
- **Initial State** : Cercle plein ●
- **Final State** : Cercle entouré ◉
- **Action / Activité** : Rectangle aux coins arrondis
- **Noeud de décision (Losange) :** Branchement conditionnel `[si valide]` / `[sinon]`
- **Fork / Join (Barre de synchronisation) :** Exécution parallèle

---

## 5. Diagramme d’États-Transitions (State Machine Diagram)

Décrit les différents états par lesquels passe un **seul objet** au cours de son cycle de vie en réponse à des événements.

- **État** : Situation d'un objet pendant laquelle il satisfait une condition (ex: *En attente*, *Validée*, *Expédiée*).
- **Transition** : Passage d'un état à un autre déclenché par un événement : `Événement [Guard] / Action`.
"""

UML_EXAMPLES = r"""# Exemples et Schémas Textuels UML

## Exemple 1 : Diagramme de Cas d'Utilisation (Système d'Examen)

```text
               +----------------------------------+
               |        Système d'Examen          |
               |                                  |
   (Étudiant) ─┼──> ( Passer Examen )             |
               |         │                        |
               |         │ <<include>>            |
               |         v                        |
               |    ( s'Authentifier ) <───<<include>>── (Enseignant)
               |         ^                        |            │
               |         │ <<extend>>             |            │
               |   ( Changer MotPass )            |            v
               |                                  |    ( Créer Sujet )
               +----------------------------------+
```

---

## Exemple 2 : Diagramme de Classes (Gestion de Commandes)

```text
 +------------------+                 +--------------------+
 |     Client       | 1          0..* |      Commande      |
 +------------------+ ─────────────── +--------------------+
 | - idClient: int  |                 | - numCmd: String   |
 | - nom: String    |                 | - date: Date       |
 +------------------+                 | - statut: String   |
 | + passerCmd()    |                 +--------------------+
 +------------------+                 | + calculerTotal()  |
                                      +--------------------+
                                                │ 1
                                                ◆ (Composition)
                                                │ 1..*
                                      +--------------------+
                                      |   LigneCommande    |
                                      +--------------------+
                                      | - quantite: int    |
                                      | - prixUnitaire: float|
                                      +--------------------+
```

---

## Exemple 3 : Diagramme de Séquence (Authentification Utilisateur)

```text
 Utilisateur              Navigateur               Serveur Web              BaseDeDonnees
      │                       │                         │                         │
      │── 1. Saisir Login ───>│                         │                         │
      │                       │── 2. POST /login ──────>│                         │
      │                       │                         │── 3. SELECT * ─────────>│
      │                       │                         │<── 4. User data ────────│
      │                       │                         │                         │
      │                       │<── 5. 200 OK (Token) ───│                         │
```
"""

UML_ASTUCES = r"""# Astuces & Pièges Concours — UML

## ⚡ Piège 1 : `<<include>>` vs `<<extend>>`
- **`<<include>>` :** La flèche pointe vers le cas OBLIGATOIRE (`A --<<include>>--> B` signifie que A inclut toujours B).
- **`<<extend>>` :** La flèche pointe vers le cas DE BASE (`B --<<extend>>--> A` signifie que B est une option qui étend A).

## ⚡ Piège 2 : Agrégation vs Composition
- **Agrégation (losange vide ♢) :** destruction du tout = la partie EXISTE encore.
- **Composition (losange plein ◆) :** destruction du tout = la partie EST DÉTRUITE aussi.
- *Astuce :* "Le cœur dans le corps est une composition (◆), une voiture dans un garage est une agrégation (♢)".

## ⚡ Piège 3 : Flèches de généralisation (Héritage)
La flèche pointe TOUJOURS **vers la classe mère / le cas général** !

## ⚡ Piège 4 : Multiplicités courantes
- `1` : Exactement un
- `0..1` : Zero ou un (optionnel)
- `*` ou `0..*` : Zero à plusieurs
- `1..*` : Au moins un
"""


class Command(BaseCommand):
    help = 'Enrich UML course content in database'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='DEV_SI_BD').first()
        if not subdomain:
            self.stderr.write("Subdomain DEV_SI_BD not found!")
            return

        course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Conception Orientée Objet : UML 2.5 (Cas d'utilisation, Classes, Séquence, Activité)",
            defaults={
                'content': UML_CONTENT,
                'examples': UML_EXAMPLES,
                'astuces': UML_ASTUCES,
            }
        )

        action = "Créé" if created else "Mis à jour"
        self.stdout.write(self.style.SUCCESS(f"[OK] Cours UML {action} ! (ID: {course.id})"))
