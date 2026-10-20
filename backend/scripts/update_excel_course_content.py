import json
import os

TP_CONTENT = """
### C. TP Pratique Guidé pas à pas : Manipulations sous Excel

Pour bien maîtriser ces notions sur votre ordinateur, voici les trois manipulations concrètes à réaliser pas à pas :

#### 🔹 Étape 1 : TP Référence Relative (La Facture de Vente)
* **Objectif :** Calculer le Total HT pour chaque produit sans réécrire la formule à chaque ligne.
* **Mise en place dans Excel :**
  * Saisissez les données suivantes :
    * `A2 : Clavier` | `B2 (Qté) : 2` | `C2 (Prix unitaire) : 100`
    * `A3 : Souris`  | `B3 (Qté) : 3` | `C3 (Prix unitaire) : 50`
    * `A4 : Écran`   | `B4 (Qté) : 1` | `C4 (Prix unitaire) : 1200`
* **Action :**
  1. En cellule **D2**, tapez la formule : **`=B2*C2`** puis validez par Entrée (résultat affiché : `200`).
  2. Cliquez sur le petit carré vert en bas à droite de D2 (la poignée de recopie) et **glissez vers le bas jusqu'en D4**.
* **Ce qu'Excel fait :**
  * En D3, la formule devient automatiquement : **`=B3*C3`** (résultat : `150`).
  * En D4, la formule devient : **`=B4*C4`** (résultat : `1200`).
* **Notion & Utilité :**
  > **Référence Relative (`B2*C2`) :** Excel retient une position relative (*"multiplier la case 2 fois à gauche par la case 1 fois à gauche"*). Elle permet d'étirer des calculs sur des millions de lignes instantanément.

---

#### 🔹 Étape 2 : TP Référence Absolue (Taux de TVA Fixe & Raccourci F4)
* **Objectif :** Appliquer un taux de TVA unique situé dans une cellule isolée.
* **Mise en place dans Excel :**
  * En cellule **E1**, écrivez le taux unique : **`20%`** (ou `0,2`).
* **L'erreur classique à éviter :**
  * Si vous écrivez en E2 `=D2*E1` et que vous étirez vers le bas, E3 devient `=D3*E2` (il multiplie par le montant de la TVA de la ligne précédente !) et le calcul est faussé.
* **La bonne méthode :**
  1. En cellule **E2**, tapez : **`=D2*$E$1`** *(Astuce : tapez `=D2*E1` puis appuyez sur la touche `F4`)*.
  2. Étirez vers le bas jusqu'en **E4**.
* **Ce qu'Excel fait :**
  * En E2 : `=D2*$E$1` (résultat : `40`).
  * En E3 : `=D3*$E$1` (résultat : `30`).
  * En E4 : `=D4*$E$1` (résultat : `240`).
* **Notion & Utilité :**
  > **Référence Absolue (`$E$1`) :** Le double cadenas (`$E` et `$1`) fige la cellule. C'est indispensable pour pointer vers un paramètre global fixe (taux de TVA, taux de change, remise générale).

---

#### 🔹 Étape 3 : TP Références Mixtes (Tableau à Double Entrée / Grille de Remises)
* **Objectif :** Remplir toute une grille 2D avec **une seule formule** étirée horizontalement et verticalement.
* **Mise en place dans Excel :**
  * Ligne 1 (Entêtes de colonnes - Taux de remise) : `B1 = 5%` | `C1 = 10%` | `D1 = 20%`
  * Colonne A (Entêtes de lignes - Prix des articles) : `A2 = 100` | `A3 = 200` | `A4 = 500`
* **Action :**
  1. Cliquez en cellule **B2**.
  2. Analysez les besoins de blocage :
     * Le prix est toujours dans la colonne A ➔ On fige la colonne : **`$A2`**.
     * Le taux est toujours sur la ligne 1 ➔ On fige la ligne : **`B$1`**.
  3. Tapez exactement en B2 : **`=$A2*B$1`** *(résultat : `5`)*.
  4. Étirez **B2 vers la droite jusqu'en D2**, puis sans relâcher, **étirez vers le bas jusqu'en D4**.
* **Ce qu'Excel fait :**
  * En B2 : `=$A2*B$1` (100 × 5% = 5)
  * En C2 : `=$A2*C$1` (100 × 10% = 10)
  * En D4 : `=$A4*D$1` (500 × 20% = 100)
* **Notion & Utilité :**
  > **Références Mixtes (`$A2` et `B$1`) :** Permettent de croiser deux dimensions (lignes × colonnes) en évitant d'écrire des formules différentes pour chaque case.

---

#### ⚡ Synthèse Express : Comment choisir sa référence ?

| Je veux que lors de la recopie... | Notation | Raccourci F4 |
|---|:---:|:---:|
| La cellule suive le déplacement partout (lignes et colonnes) | **`A1`** | *(Par défaut)* |
| La cellule reste bloquée sur un point fixe (TVA, paramètre) | **`$A$1`** | 1 appui sur **F4** |
| La ligne reste fixe (pour un tableau étiré vers la droite et le bas) | **`A$1`** | 2 appuis sur **F4** |
| La colonne reste fixe (pour un tableau étiré vers la droite et le bas) | **`$A1`** | 3 appuis sur **F4** |
"""

def update_json():
    json_path = 'backend/initial_data.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated = False
    for item in data:
        if item.get('model') == 'syllabus.course' and item.get('pk') == 16:
            content = item['fields'].get('content_fr') or item['fields'].get('content')
            if 'TP Pratique Guidé pas à pas' not in content:
                # Find Section 2 start
                sec2_marker = '## 2. Fonctions Logiques'
                if sec2_marker in content:
                    idx = content.find(sec2_marker)
                    new_content = content[:idx] + TP_CONTENT + "\n\n---\n\n" + content[idx:]
                    item['fields']['content'] = new_content
                    item['fields']['content_fr'] = new_content
                    updated = True
                    print("Updated initial_data.json Course 16 successfully!")
                else:
                    print("Could not find ## 2. Fonctions Logiques marker")

    if updated:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

def update_migration():
    # Also update enrich_excel_course.py command
    cmd_path = 'backend/syllabus/management/commands/enrich_excel_course.py'
    if os.path.exists(cmd_path):
        with open(cmd_path, 'r', encoding='utf-8') as f:
            code = f.read()
        if 'TP Pratique Guidé pas à pas' not in code:
            sec2 = '## 2. Fonctions Logiques'
            if sec2 in code:
                idx = code.find(sec2)
                new_code = code[:idx] + TP_CONTENT + "\n\n---\n\n" + code[idx:]
                with open(cmd_path, 'w', encoding='utf-8') as f:
                    f.write(new_code)
                print("Updated enrich_excel_course.py successfully!")

if __name__ == '__main__':
    update_json()
    update_migration()
