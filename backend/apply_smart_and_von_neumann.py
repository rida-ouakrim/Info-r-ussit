import json
import sqlite3
import re

SMART_SECTION = r"""

### C. Définition des Objectifs de Projet : La Méthode SMART 🎯

Un objectif **SMART** est un objectif qui respecte **5 critères essentiels** en gestion de projet pour garantir qu'il soit opérationnel, compréhensible par toute l'équipe et contrôlable lors de la livraison.

#### 1. Que signifie l'acronyme SMART ?

| Lettre | Signification en français | Critère d'évaluation | Question clé à se poser |
| :---: | :--- | :--- | :--- |
| **S** | **Spécifique** | Précis, clair et sans ambiguïté. | *Que veut-on accomplir exactement et pour qui ?* |
| **M** | **Mesurable** | Quantifiable par un indicateur chiffré (KPI). | *Combien ? Quel est le seuil de réussite attendu ?* |
| **A** | **Atteignable / Ambitieux** | Réalisable avec les ressources et compétences disponibles. | *L'équipe dispose-t-elle des moyens techniques et humains ?* |
| **R** | **Réaliste / Pertinent** | Aligné sur la stratégie métier et rentable. | *Est-ce cohérent avec les besoins et contraintes actuels ?* |
| **T** | **Temporellement défini** | Possède une échéance finale précise (date butoir). | *Quelle est la date exacte de livraison ?* |

#### 2. Exemple comparatif en projet logiciel :
* ❌ **Objectif NON-SMART (Vague) :** *« Améliorer la rapidité du site web et refaire la base de données. »*
* ✅ **Objectif SMART (Valide) :** *« Réduire le temps de réponse moyen de l'API sous 200 ms (M) pour les requêtes de recherche (S) d'ici le 31 décembre 2026 (T), en ajoutant des index PostgreSQL et un cache Redis (A, R). »*

> 💡 **Règle d'or de Concours :** Tout objectif de projet qui ne comporte pas d'échéance calendaire (**T**) ou de critère mesurable chiffré (**M**) est considéré comme incomplet dans les jurys d'examen.
"""

VON_NEUMANN_REPLACEMENT = r"""### 2.3. Schéma Fonctionnel de l'Architecture de von Neumann

![Schéma Fonctionnel de l'Architecture de von Neumann](/images/von_neumann_architecture.png)

#### Description des Unités et Bus d'Échange :
* **Unité de Commande (UC) :** Coordonne le processeur (Séquenceur, Décodeur, Compteur Ordinal / IP). Elle émet les signaux de commande via le **Bus de Contrôle**.
* **Unité Arithmétique et Logique (UAL / ALU) :** Effectue les calculs arithmétiques (+, -, *, /) et logiques (ET, OU, NON) assistée de l'Accumulateur.
* **Mémoire Centrale (RAM) :** Stocke indifféremment sous forme binaire les **instructions du programme** et les **données** (principe fondamental de von Neumann).
* **Organes d'Entrée / Sortie (E/S) :** Assurent le dialogue avec les périphériques (clavier, écran, disques).
* **Les 3 Bus Système :**
  - **Bus de Données (Bidirectionnel) :** Transfère les données et instructions entre mémoire, processeur et E/S.
  - **Bus d'Adresses (Unidirectionnel) :** Transmet l'adresse de la cellule mémoire ou du périphérique ciblé.
  - **Bus de Contrôle / Commandes :** Synchronise et pilote les transferts (READ, WRITE, signaux d'horloge).
"""

# 1. Update initial_data.json
try:
    with open('initial_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        if item.get('model') == 'syllabus.course':
            fields = item.get('fields', {})
            title = fields.get('title', '')
            content = fields.get('content', '')

            # GPI
            if 'Gestion de projets' in title:
                if '### C. Définition des Objectifs de Projet : La Méthode SMART' not in content:
                    target = "3. **Périmètre / Qualité (Scope) :** Fonctionnalités attendues et niveau de robustesse technique."
                    if target in content:
                        content = content.replace(target, target + "\n" + SMART_SECTION)
                    else:
                        content = content + "\n" + SMART_SECTION
                    fields['content'] = content
                    fields['content_fr'] = content

            # von Neumann
            if 'von Neumann' in title:
                pattern = r'### 2\.3\. Schéma Fonctionnel Simplifié\s*```[\s\S]*?```'
                if re.search(pattern, content):
                    content = re.sub(pattern, VON_NEUMANN_REPLACEMENT, content)
                elif '### 2.3. Schéma Fonctionnel Simplifié' in content:
                    content = content.replace('### 2.3. Schéma Fonctionnel Simplifié', VON_NEUMANN_REPLACEMENT)
                fields['content'] = content
                fields['content_fr'] = content

    with open('initial_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("initial_data.json updated successfully.")
except Exception as e:
    print("Error updating initial_data.json:", e)

# 2. Update db.sqlite3
try:
    con = sqlite3.connect('db.sqlite3')
    cur = con.cursor()
    cur.execute("SELECT id, title, content FROM syllabus_course WHERE title LIKE '%Gestion de projets%' OR title LIKE '%von Neumann%'")
    rows = cur.fetchall()
    for cid, title, content in rows:
        if 'Gestion de projets' in title and '### C. Définition des Objectifs de Projet : La Méthode SMART' not in content:
            target = "3. **Périmètre / Qualité (Scope) :** Fonctionnalités attendues et niveau de robustesse technique."
            if target in content:
                content = content.replace(target, target + "\n" + SMART_SECTION)
            else:
                content = content + "\n" + SMART_SECTION
            cur.execute("UPDATE syllabus_course SET content = ?, content_fr = ? WHERE id = ?", (content, content, cid))
        if 'von Neumann' in title:
            pattern = r'### 2\.3\. Schéma Fonctionnel Simplifié\s*```[\s\S]*?```'
            if re.search(pattern, content):
                content = re.sub(pattern, VON_NEUMANN_REPLACEMENT, content)
            elif '### 2.3. Schéma Fonctionnel Simplifié' in content:
                content = content.replace('### 2.3. Schéma Fonctionnel Simplifié', VON_NEUMANN_REPLACEMENT)
            cur.execute("UPDATE syllabus_course SET content = ?, content_fr = ? WHERE id = ?", (content, content, cid))
    con.commit()
    con.close()
    print("db.sqlite3 updated successfully.")
except Exception as e:
    print("Error updating db.sqlite3:", e)
