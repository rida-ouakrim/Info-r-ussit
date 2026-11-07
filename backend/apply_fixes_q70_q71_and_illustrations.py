import json
import sqlite3

# 1. Update initial_data.json
with open('initial_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    model = item.get('model')
    pk = item.get('pk')
    fields = item.get('fields', {})

    # Fix Q70 (Camembert)
    if model == 'exams.question' and pk == 414:
        fields['explanation'] = (
            "Un graphique en secteurs (camembert) est spécifiquement conçu pour visualiser la contribution de chaque partie à un tout, "
            "c'est-à-dire pour faire ressortir les proportions relatives des différentes catégories de données par rapport au total (100%)."
        )
        fields['astuce'] = (
            "Pensez à une part de gâteau : chaque secteur représente une proportion relative du total (idéal pour visualiser des pourcentages). "
            "Il ne convient pas pour afficher plusieurs séries de données ni des évolutions chronologiques."
        )

    # Fix Q71 ($B$3)
    if model == 'exams.question' and pk == 415:
        fields['question_text'] = "La notation suivante : `$B$3` fait appel au type de référence suivant :"
        fields['explanation'] = (
            "Dans Excel, la notation `$B$3`, avec des signes dollar devant la colonne et la ligne, indique une **référence absolue**. "
            "Cela signifie que la référence à la cellule B3 restera fixe et ne changera pas, même si la formule est recopiée ou étirée vers d'autres cellules."
        )
        fields['astuce'] = (
            "Le signe dollar (`$`) \"verrouille\" la coordonnée qu'il précède :\n"
            "- `$B$3` : **Absolu** (colonne B et ligne 3 verrouillées)\n"
            "- `$B3` ou `B$3` : **Mixte** (seule la colonne OU la ligne est verrouillée)\n"
            "- `B3` : **Relatif** (aucun dollar, les coordonnées s'ajustent lors du copier/glisser)"
        )

    # Add illustrations in Course 9 (von Neumann)
    if model == 'syllabus.course' and ('von Neumann' in fields.get('title', '') or pk == 9):
        content = fields.get('content', '')
        if '/images/central_memory_ram_rom.png' not in content:
            content = content.replace(
                "## 5. La Mémoire Centrale\n\nLa mémoire centrale est un élément clé qui stocke toutes les données et programmes nécessaires au fonctionnement de la machine.",
                "## 5. La Mémoire Centrale\n\nLa mémoire centrale est un élément clé qui stocke toutes les données et programmes nécessaires au fonctionnement de la machine.\n\n![La Mémoire Centrale : RAM vs ROM](/images/central_memory_ram_rom.png)"
            )
        if '/images/motherboard_components.png' not in content:
            content = content.replace(
                "## 7. La Carte Mère\n\nLa carte mère est la carte principale d'un micro-ordinateur, regroupant les circuits principaux et assurant la connexion entre tous les composants.",
                "## 7. La Carte Mère\n\nLa carte mère est la carte principale d'un micro-ordinateur, regroupant les circuits principaux et assurant la connexion entre tous les composants.\n\n![Architecture et Composants d'une Carte Mère Format ATX](/images/motherboard_components.png)"
            )
        fields['content'] = content
        fields['content_fr'] = content

with open('initial_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("initial_data.json updated.")

# 2. Update db.sqlite3
con = sqlite3.connect('db.sqlite3')
cur = con.cursor()

# Fix Q70
cur.execute("""
    UPDATE exams_question
    SET explanation = 'Un graphique en secteurs (camembert) est spécifiquement conçu pour visualiser la contribution de chaque partie à un tout, c''est-à-dire pour faire ressortir les proportions relatives des différentes catégories de données par rapport au total (100%).',
        astuce = 'Pensez à une part de gâteau : chaque secteur représente une proportion relative du total (idéal pour visualiser des pourcentages). Il ne convient pas pour afficher plusieurs séries de données ni des évolutions chronologiques.'
    WHERE id = 414 OR (exam_year = 2023 AND question_number = 'Q70' AND question_text LIKE '%camembert%')
""")

# Fix Q71
cur.execute("""
    UPDATE exams_question
    SET question_text = 'La notation suivante : `$B$3` fait appel au type de référence suivant :',
        explanation = 'Dans Excel, la notation `$B$3`, avec des signes dollar devant la colonne et la ligne, indique une référence absolue. Cela signifie que la référence à la cellule B3 restera fixe et ne changera pas, même si la formule est recopiée ou étirée vers d''autres cellules.',
        astuce = 'Le signe dollar ($) \"verrouille\" la coordonnée qu''il précède : `$B$3` est absolu, `$B3` ou `B$3` est mixte, et `B3` est relatif.'
    WHERE id = 415 OR (exam_year = 2023 AND question_number = 'Q71' AND question_text LIKE '%type de référence suivant%')
""")

# Update Course von Neumann in SQLite if present
rows = cur.execute("SELECT id, content, content_fr FROM syllabus_course WHERE title LIKE '%von Neumann%' OR id = 9").fetchall()
for cid, content, content_fr in rows:
    content = content or ''
    content_fr = content_fr or ''
    if '/images/central_memory_ram_rom.png' not in content:
        content = content.replace('## 5. La Mémoire Centrale', '## 5. La Mémoire Centrale\n\n![La Mémoire Centrale : RAM vs ROM](/images/central_memory_ram_rom.png)')
        content_fr = content_fr.replace('## 5. La Mémoire Centrale', '## 5. La Mémoire Centrale\n\n![La Mémoire Centrale : RAM vs ROM](/images/central_memory_ram_rom.png)')
    if '/images/motherboard_components.png' not in content:
        content = content.replace('## 7. La Carte Mère', '## 7. La Carte Mère\n\n![Architecture et Composants d\'une Carte Mère Format ATX](/images/motherboard_components.png)')
        content_fr = content_fr.replace('## 7. La Carte Mère', '## 7. La Carte Mère\n\n![Architecture et Composants d\'une Carte Mère Format ATX](/images/motherboard_components.png)')
    cur.execute("UPDATE syllabus_course SET content = ?, content_fr = ? WHERE id = ?", (content, content_fr, cid))

con.commit()
con.close()
print("db.sqlite3 updated.")
