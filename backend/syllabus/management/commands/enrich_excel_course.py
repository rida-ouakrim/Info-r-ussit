"""
enrich_excel_course.py
======================
Enriches the Excel & Office course with complete advanced formulas, Pivot Tables (TCD),
logical functions, analysis tools, and exam tips.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

EXCEL_CONTENT = r"""# Analyse de Données et Formules Complexes sur Tableur (Excel)

## Introduction

Microsoft Excel est un tableur puissant et indispensable pour la gestion, la modélisation et l'analyse de données. Dans les concours de recrutement d'enseignants (CRMEF) et de la fonction publique, les questions portent sur la syntaxe exacte des formules, le verrouillage des références (relatives/absolues), les fonctions logiques imbriquées, la recherche complexe (`RECHERCHEV`, `INDEX`/`EQUIV`), l'agrégation conditionnelle et les Tableaux Croisés Dynamiques (TCD).

---

## 1. Références de Cellules : Absolues, Relatives et Mixtes

C'est l'un des pièges les plus fréquents en examen !

| Type de Référence | Syntaxe | Comportement lors de la recopie | Exemple d'utilisation |
|---|---|---|---|
| **Relative** | `A1` | Adapte la colonne ET la ligne selon le déplacement | Calcul sur la même ligne (`=B2*C2`) |
| **Absolue** | `$A$1` | Bloque la colonne ET la ligne (fixe) | Taux de TVA ou constante globale |
| **Mixte (Ligne fixe)** | `A$1` | Bloque la ligne 1, varie la colonne | Entêtes de colonnes dans un tableau à 2 entrées |
| **Mixte (Colonne fixe)** | `$A1` | Bloque la colonne A, varie la ligne | Entêtes de lignes dans une table de multiplication |

**Astuce F4 :** La touche `F4` permet de basculer instantanément entre `A1` ➔ `$A$1` ➔ `A$1` ➔ `$A1`.

---

## 2. Fonctions Logiques et Conditions Imbriquées

### 2.1 La fonction `SI`
Syntaxe : `=SI(test_logique; valeur_si_vrai; valeur_si_faux)`
```excel
=SI(C2>=10; "Admis"; "Ajourné")
```

### 2.2 Imbrication de `SI` (SI multiples / Conditions imbriquées)
```excel
=SI(C2>=16; "Très Bien"; SI(C2>=14; "Bien"; SI(C2>=12; "Assez Bien"; SI(C2>=10; "Passable"; "Ajourné"))))
```

### 2.3 Fonctions `ET` et `OU`
- `=ET(condition1; condition2)` : Renvoie `VRAI` si **toutes** les conditions sont vérifiées.
- `=OU(condition1; condition2)` : Renvoie `VRAI` si **au moins une** condition est vérifiée.
```excel
=SI(ET(NoteEcrit>=10; NoteOral>=10); "Admis Épreuve finale"; "Ajourné")
```

---

## 3. Fonctions de Recherche Avancées (`RECHERCHEV`, `INDEX` + `EQUIV`)

### 3.1 `RECHERCHEV` (VLOOKUP)
Syntaxe : `=RECHERCHEV(valeur_cherchée; table_matrice; numéro_index_colonne; [valeur_proche])`

- `valeur_cherchée` : la clé de recherche à trouver (ex: ID étudiant)
- `table_matrice` : le tableau de données (la clé doit **impérativement être dans la 1ère colonne**)
- `numéro_index_colonne` : le numéro de colonne du résultat à renvoyer (1, 2, 3...)
- `valeur_proche` : `FAUX` (ou `0`) pour une correspondance **exacte**

```excel
=RECHERCHEV(A2; $E$2:$G$100; 3; FAUX)
```

### 3.2 Le couple `INDEX` + `EQUIV` (Recherche multidirectionnelle)
`RECHERCHEV` ne peut pas chercher vers la gauche et échoue si des colonnes sont déplacées. Le couple `INDEX` + `EQUIV` élimine ces contraintes !

- `EQUIV(valeur; plage; 0)` : renvoie la **position** relative d'un élément (numéro de ligne/colonne)
- `INDEX(plage; num_ligne; [num_colonne])` : renvoie la **valeur** à cette position

```excel
' Recherche vers la gauche : trouver le Nom (Col A) à partir du Code Client (Col C)
=INDEX(A2:A100; EQUIV(E2; C2:C100; 0))
```

---

## 4. Fonctions d'Agrégation Conditionnelle

- `=NB.SI(plage; critère)` : Compte les cellules répondant à une condition.
- `=SOMME.SI(plage_critère; critère; [plage_somme])` : Calcule la somme des cellules selon un critère.
- `=MOYENNE.SI(plage_critère; critère; [plage_moyenne])` : Calcule la moyenne conditionnelle.
- `=SOMME.SI.ENS(plage_somme; plage_critère1; critère1; plage_critère2; critère2; ...)` : Gère **plusieurs critères simultanés**.

```excel
=NB.SI(C2:C50; ">=10")  ' Compte le nombre d'admis
=SOMME.SI.ENS(D2:D100; A2:A100; "Informatique"; B2:B100; "CRMEF") ' Somme sous 2 critères
```

---

## 5. Outils d'Analyse et Simulation (`TCD`, `Valeur Cible`, `Solveur`)

### 5.1 Tableaux Croisés Dynamiques (TCD)
Un **TCD** permet de synthétiser, croiser et analyser de grands volumes de données en quelques clics sans écrire de formule.

- **Filtres** : Permet de restreindre l'analyse globale (ex: Année 2025)
- **Lignes** : Définit le regroupement vertical (ex: Département ou Filière)
- **Colonnes** : Définit le regroupement horizontal (ex: Genre ou Mention)
- **Valeurs** : Le champ numérique calculé (Somme, Moyenne, Effectif/Nombre, Max, Min)

### 5.2 Outils de Simulation et Scénarios
- **Valeur Cible** (`Données > Analyse de scénarios > Valeur cible`) : Permet de trouver la valeur d'entrée nécessaire pour atteindre un objectif précis (ex: quelle note obtenir à l'oral pour avoir 12 de moyenne générale ?).
- **Gestionnaire de Scénarios** : Permet de comparer plusieurs hypothèses d'analyse (Optimiste, Pessimiste, Réaliste).
- **Solveur** : Outil d'optimisation sous contraintes (ex: maximiser les effectifs d'admis tout en respectant des seuils budgétaires).

---

## 6. Traitement de Texte et Nettoyage de Données

- `=GAUCHE(texte; nb_car)` / `=DROITE(texte; nb_car)` / `=STXT(texte; no_départ; nb_car)` : Extraction de sous-chaînes.
- `=MAJUSCULE(texte)` / `=MINUSCULE(texte)` / `=NOMPROPRE(texte)` : Normalisation de la casse.
- `=SUPPRESPACE(texte)` : Supprime les espaces superflus (début, fin et espaces doubles).
- `=CNUM(texte)` : Convertit une chaîne représentant un nombre en vraie valeur numérique calculable.
- Concaténation : `=CONCATENER(A2; " "; B2)` ou l'opérateur `&` : `=A2 & " " & B2`.
"""

EXCEL_EXAMPLES = r"""# Exemples Pratiques et Exercices Excel

## Exemple 1 : Calcul de Bulletin de Notes et Mention

Considérons le tableau suivant dans les cellules `A1:D5` :

| | A (Nom) | B (Note Écrit) | C (Note Oral) | D (Moyenne Générale) |
|---|---|---|---|---|
| **1** | Nom | Écrit (Coeff 2) | Oral (Coeff 1) | Moyenne |
| **2** | Karim | 14 | 12 | `=(B2*2+C2)/3` |
| **3** | Fatima | 8 | 15 | `=(B3*2+C3)/3` |
| **4** | Youssef | 9 | 9 | `=(B4*2+C4)/3` |

### Formule pour la décision (Colonne E) :
```excel
=SI(D2>=10; "Admis"; SI(D2>=8; "Rattrapage"; "Ajourné"))
```

---

## Exemple 2 : Recherche de Tarif et Désignation avec RECHERCHEV

Tableau de référence des Produits dans `$G$2:$I$10` :
- Col G : Code Produit
- Col H : Désignation
- Col I : Prix Unitaire (DH)

Si le Code Produit saisi est en `B2` :
- **Désignation** : `=RECHERCHEV(B2; $G$2:$I$10; 2; FAUX)`
- **Prix Unitaire** : `=RECHERCHEV(B2; $G$2:$I$10; 3; FAUX)`

---

## Exemple 3 : Recherche Inverse avec INDEX + EQUIV

Pour obtenir le Nom du candidat ayant le meilleur score (situé dans la colonne A) à partir de la note maximale située en colonne D :

```excel
=INDEX(A2:A50; EQUIV(MAX(D2:D50); D2:D50; 0))
```

---

## Exemple 4 : Formules Texte Courantes aux Concours

- `=GAUCHE("INFORMATIQUE"; 4)` ➔ `"INFO"`
- `=DROITE("INFORMATIQUE"; 4)` ➔ `"TIQUE"`
- `=STXT("INFORMATIQUE"; 4; 4)` ➔ `"ORMA"`
- `=CNUM("123")` ➔ `123` (Convertit du texte en nombre)
- `=CONCATENER(A2; " "; B2)` ou `=A2 & " " & B2` ➔ `"Karim Alami"`
"""

EXCEL_ASTUCES = r"""# Astuces & Pièges Concours — Excel

## ⚡ Piège 1 : Le séparateur de paramètres (Virgule vs Point-virgule)
- En français (Excel FR) : le séparateur est le **point-virgule `;`**
- En anglais (Excel US) : le séparateur est la **virgule `,`**
- Dans les concours marocains (CRMEF, Fonction Publique), c'est **toujours le point-virgule `;`** !

## ⚡ Piège 2 : Oublier le 4ème paramètre de `RECHERCHEV`
Si vous oubliez `FAUX` (ou `0`), Excel effectue une recherche **approchée** et exige que la 1ère colonne soit triée par ordre croissant.
Toujours spécifier `; FAUX` pour une recherche exacte !

## ⚡ Piège 3 : Les erreurs courantes Excel

| Erreur | Cause | Solution / Gestion |
|---|---|---|
| `#DIV/0!` | Division par zéro | Utiliser `=SI(B1=0; 0; A1/B1)` |
| `#N/A` | Valeur non disponible (`RECHERCHEV` n'a rien trouvé) | Utiliser `=SI.ERREUR(RECHERCHEV(...); "Non trouvé")` |
| `#VALEUR!` | Type de donnée incorrect dans un calcul (texte + nombre) | Vérifier le type avec `ESTNUM` ou utiliser `CNUM` |
| `#REF!` | Référence de cellule supprimée ou invalide | Corriger la formule après suppression de ligne/colonne |
| `#####` | Colonne trop étroite pour afficher le nombre | Élargir la colonne |

## ⚡ Piège 4 : Absolu vs Relatif lors de la recopie
- `$A$1` ➔ Ne change jamais.
- `$A1` ➔ La colonne A reste fixe, la ligne varie.
- `A$1` ➔ La colonne varie, la ligne 1 reste fixe.
"""


class Command(BaseCommand):
    help = 'Enrich Excel course content in database'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='LOG_OFFICE').first()
        if not subdomain:
            self.stderr.write("Subdomain LOG_OFFICE not found!")
            return

        # Find Excel course by ID or matching title
        course = Course.objects.filter(subdomain=subdomain, title__icontains="tableur").first()
        if not course:
            course = Course.objects.filter(subdomain=subdomain, title__icontains="excel").first()

        if not course:
            course = Course.objects.create(
                subdomain=subdomain,
                title="Analyse de données et formules complexes sur tableur (Excel)",
                content=EXCEL_CONTENT,
                examples=EXCEL_EXAMPLES,
                astuces=EXCEL_ASTUCES
            )
            action = "Créé"
        else:
            course.title = "Analyse de données et formules complexes sur tableur (Excel)"
            course.content = EXCEL_CONTENT
            course.examples = EXCEL_EXAMPLES
            course.astuces = EXCEL_ASTUCES
            course.save()
            action = "Mis à jour"

        self.stdout.write(self.style.SUCCESS(f"[OK] Cours Excel {action} avec succès ! (ID: {course.id})"))
