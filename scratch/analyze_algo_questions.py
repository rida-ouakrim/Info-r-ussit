import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("""
    SELECT id, question_text, explanation
    FROM exams_question
    WHERE subdomain_id = 'DEV_ALGO'
""")

rows = cursor.fetchall()
print(f"Total DEV_ALGO Questions: {len(rows)}\n")

MODULE_KEYWORDS = {
    "01": ["algorithme", "définition", "pseudo-code", "instruction", "entrée", "sortie", "organigramme", "finitude", "déterminisme"],
    "02": ["variable", "type", "entier", "réel", "booléen", "constante", "déclaration", "affectation", "mémoire", "poids"],
    "03": ["opérateur", "arithmétique", "div", "mod", "et", "ou", "non", "expression", "lire", "écrire", "priorité"],
    "04": ["si", "sinon", "alors", "condition", "selon", "cas", "alternative", "choix multiple", "branchement"],
    "05": ["boucle", "tantque", "tant que", "pour", "répéter", "jusqu'à", "itératif", "compteur", "incrément"],
    "06": ["tableau", "vecteur", "matrice", "indice", "1d", "2d", "dimension", "élément"],
    "07": ["chaîne", "chaine", "caractère", "caractere", "longueur", "concaténation", "sous-chaîne", "string", "ascii"],
    "08": ["fonction", "procédure", "procedure", "sous-programme", "paramètre", "valeur", "référence", "var", "retour"],
    "09": ["complexité", "grand o", "o(1)", "o(n)", "o(n^2)", "o(log n)", "notation", "pire cas", "meilleur cas", "temporelle"],
    "10": ["pile", "file", "lifo", "fifo", "empiler", "dépiler", "enfiler", "défiler", "liste chaînée", "pointeur", "nœud"],
    "11": ["tri", "bulle", "sélection", "selection", "insertion", "quicksort", "mergesort", "recherche dichotomique", "dichotomie", "pivot"],
    "12": ["récursivité", "recursivite", "récursif", "cas de base", "pile d'appel", "diviser pour régner", "fibonacci", "hanoi"],
    "13": ["arbre", "abr", "binaire", "infixe", "préfixe", "postfixe", "racine", "feuille", "hauteur"],
    "14": ["graphe", "dfs", "bfs", "profondeur", "largeur", "adjacence", "sommet", "arc", "dijkstra", "cycle"]
}

course_counts = {k: 0 for k in MODULE_KEYWORDS}

for q_id, q_text, q_expl in rows:
    full_str = (str(q_text) + " " + str(q_expl)).lower()
    matched = False
    for mod_code, kw_list in MODULE_KEYWORDS.items():
        if any(kw in full_str for kw in kw_list):
            course_counts[mod_code] += 1
            matched = True

print("Distribution of questions matched to modules by keywords:")
for k, count in course_counts.items():
    print(f"Module {k}: {count} QCMs matching keywords")

conn.close()
