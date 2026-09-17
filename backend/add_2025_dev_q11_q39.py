import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INITIAL_DATA_PATH = os.path.join(BASE_DIR, "initial_data.json")

q11_dev = {
    "model": "exams.question",
    "pk": 2150,
    "fields": {
        "source_type": "past_exam",
        "exam_year": 2025,
        "question_number": "Q11",
        "question_text": "On présente l'extrait d'un algorithme de tri à bulles pour un tableau T[1..N].\nCet extrait contient une erreur de logique.\nLisez attentivement le code proposé et choisissez la réponse correcte.\n\nExtrait de l'algorithme proposé :\n```alg\n// Tri à bulles (version avec possible erreur)\nPour i de 1 à N - 1 Faire\n   Pour j de 1 à N - i Faire\n      Si T[j] > T[j+1] Alors\n         T[j] <- T[j+1]\n         T[j+1] <- T[j]\n      FinSi\n   Fin Pour\nFin Pour\n```",
        "option_a": "La borne de la boucle j est incorrecte pour le tri à bulles.",
        "option_b": "La condition de comparaison est inversée.",
        "option_c": "L'échange des valeurs est mal codé et écrase les données.",
        "option_d": "Il manque la condition Sortir Pour pour arrêter si le tableau est déjà trié.",
        "option_e": "Aucune de ces réponses n'est juste",
        "correct_option": "C",
        "explanation": "Pour échanger deux variables A et B (ou deux cases T[j] et T[j+1]), il faut obligatoirement utiliser une variable temporaire auxiliaire (ex: temp <- T[j]; T[j] <- T[j+1]; T[j+1] <- temp). Dans le code proposé, l'instruction T[j] <- T[j+1] écrase l'ancienne valeur de T[j]. La ligne suivante T[j+1] <- T[j] copie ensuite cette même nouvelle valeur dans T[j+1], dupliquant T[j+1] et écrasant la donnée initiale de T[j].",
        "astuce": "⚡ Échange sans variable temporaire = Écrasement des données ! Pour permuter A et B, il faut toujours 3 instructions avec une variable temporaire.",
        "reference_text": None,
        "domain": "DEV",
        "subdomain": "DEV_ALGO",
        "course": 11,
        "created_at": "2026-09-17T11:00:00.000Z"
    }
}

q39_dev = {
    "model": "exams.question",
    "pk": 2151,
    "fields": {
        "source_type": "past_exam",
        "exam_year": 2025,
        "question_number": "Q39",
        "question_text": "La commande SQL utilisée pour modifier des données existantes dans une table est :",
        "option_a": "MODIFY",
        "option_b": "CHANGE",
        "option_c": "REMOVE",
        "option_d": "UPDATE",
        "option_e": "Aucune de ces réponses n'est juste",
        "correct_option": "D",
        "explanation": "En SQL (DML - Data Manipulation Language), la commande UPDATE permet de modifier les données enregistrées dans les lignes d'une table (ex: UPDATE table SET colonne = valeur WHERE condition). À ne pas confondre avec ALTER TABLE ... MODIFY qui modifie la structure d'une colonne (DDL).",
        "astuce": "⚡ Modifier les DONNÉES = UPDATE. Modifier la STRUCTURE de la table = ALTER TABLE.",
        "reference_text": None,
        "domain": "DEV",
        "subdomain": "DEV_SI_BD",
        "course": 17,
        "created_at": "2026-09-17T11:00:00.000Z"
    }
}

def add_missing_questions():
    with open(INITIAL_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Check if Q11 and Q39 already exist for 2025 DEV
    existing_dev_q11 = any(q.get("model") == "exams.question" and q["fields"].get("exam_year") == 2025 and q["fields"].get("domain") == "DEV" and q["fields"].get("question_number") == "Q11" for q in data)
    existing_dev_q39 = any(q.get("model") == "exams.question" and q["fields"].get("exam_year") == 2025 and q["fields"].get("domain") == "DEV" and q["fields"].get("question_number") == "Q39" for q in data)

    added = 0
    if not existing_dev_q11:
        data.append(q11_dev)
        added += 1
        print("Added Q11 (Tri à bulles - Echange mal codé) to 2025 DEV")

    if not existing_dev_q39:
        data.append(q39_dev)
        added += 1
        print("Added Q39 (SQL UPDATE - Modifier données) to 2025 DEV")

    if added > 0:
        with open(INITIAL_DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved initial_data.json with {added} new questions!")
    else:
        print("Questions Q11 and Q39 already present.")

if __name__ == "__main__":
    add_missing_questions()
