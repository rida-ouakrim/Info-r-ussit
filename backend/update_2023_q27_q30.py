import json
import sqlite3

prefix = (
    "> 📋 **Les questions de Q27 à Q30 se rapportent au schéma relationnel suivant :**\n"
    "> - **candidat** (<u>Code_candidat</u>, Nom, prenom)\n"
    "> - **participe** (<u>#Code_candidat</u>, <u>#Code_concours</u>)\n"
    "> - **concours** (<u>Code_concours</u>, Date)\n\n"
)

schema_ref = (
    "**Schéma relationnel (Questions Q27 à Q30) :**\n\n"
    "- **candidat** (<u>Code_candidat</u>, Nom, prenom)\n"
    "- **participe** (<u>#Code_candidat</u>, <u>#Code_concours</u>)\n"
    "- **concours** (<u>Code_concours</u>, Date)"
)

pks = {
    371: "La requête SQL qui permet d'afficher les noms des candidats est :",
    372: 'La requête qui supprime de la table "candidat" le candidat ayant le code 125 est :',
    373: 'La requête SQL qui remplace le prénom du candidat ayant le Code_candidat = 523 par "ahmed" est :',
    374: "La requête SQL pour vider la table candidat est :"
}

# 1. Update initial_data.json
try:
    with open('initial_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        if item.get('model') == 'exams.question' and item.get('pk') in pks:
            pk = item['pk']
            item['fields']['question_text'] = prefix + pks[pk]
            item['fields']['reference_text'] = schema_ref

    with open('initial_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("initial_data.json updated successfully.")
except Exception as e:
    print("Error updating initial_data.json:", e)

# 2. Update local db.sqlite3 if it exists
try:
    con = sqlite3.connect('db.sqlite3')
    cur = con.cursor()
    for pk, qtext in pks.items():
        full_text = prefix + qtext
        cur.execute("UPDATE exams_question SET question_text = ?, reference_text = ? WHERE id = ?", (full_text, schema_ref, pk))
    con.commit()
    con.close()
    print("db.sqlite3 updated successfully.")
except Exception as e:
    print("Error updating db.sqlite3:", e)
