import re
import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

conn = sqlite3.connect(DJANGO_DB)
cursor = conn.cursor()

cursor.execute("""
    SELECT id, question_number, question_text, explanation, astuce
    FROM exams_question
    WHERE subdomain_id = 'DEV_ALGO'
""")

questions = cursor.fetchall()
print(f"Total DEV_ALGO Questions: {len(questions)}\n")

STRICT_MODULE_PATTERNS = {
    "01": [r'\balgorithme\b', r'\bpseudo-code\b', r'\borganigramme\b', r'\bfinitude\b', r'\bdéterminisme\b'],
    "02": [r'\bvariable\b', r'\bvariables\b', r'\bconstante\b', r'\bconstantes\b', r'\btype\b', r'\btypes\b', r'\bentier\b', r'\bréel\b', r'\bbooléen\b'],
    "03": [r'\bopérateur\b', r'\bopérateurs\b', r'\bdiv\b', r'\bmod\b', r'\blire\b', r'\bécrire\b', r'\bexpression\b'],
    "04": [r'\bsi\b', r'\bsinon\b', r'\bselon\b', r'\bcondition\b', r'\bconditionnelle\b', r'\bsélective\b'],
    "05": [r'\bboucle\b', r'\bboucles\b', r'\bpour\b', r'\btantque\b', r'\btant que\b', r'\brépéter\b', r'\bitératif\b'],
    "06": [r'\btableau\b', r'\btableaux\b', r'\bvecteur\b', r'\bvecteurs\b', r'\bmatrice\b', r'\bmatrices\b'],
    "07": [r'\bchaîne\b', r'\bchaînes\b', r'\bchaine\b', r'\bchaines\b', r'\bcaractère\b', r'\bcaractères\b', r'\bconcaténation\b', r'\bsous-chaîne\b'],
    "08": [r'\bfonction\b', r'\bfonctions\b', r'\bprocédure\b', r'\bprocédures\b', r'\bsous-programme\b', r'\bparamètre\b', r'\bparamètres\b', r'\bvaleur\b', r'\bréférence\b'],
    "09": [r'\bcomplexité\b', r'\bgrand o\b', r'\bo\(1\)\b', r'\bo\(n\)\b', r'\bo\(n\^2\)\b', r'\bo\(log n\)\b', r'\basymptotique\b'],
    "10": [r'\bpile\b', r'\bpiles\b', r'\bfile\b', r'\bfiles\b', r'\blifo\b', r'\bfifo\b', r'\bempiler\b', r'\bdépiler\b', r'\benfiler\b', r'\bdéfiler\b', r'\bliste chaînée\b'],
    "11": [r'\btri\b', r'\btris\b', r'\bbulle\b', r'\bsélection\b', r'\binsertion\b', r'\bquicksort\b', r'\bmergesort\b', r'\bdichotomie\b', r'\bdichotomique\b'],
    "12": [r'\brécursivité\b', r'\brécursif\b', r'\brécursive\b', r'\bcas de base\b', r'\bhanoi\b'],
    "13": [r'\barbre\b', r'\barbres\b', r'\babr\b', r'\binfixe\b', r'\bpréfixe\b', r'\bpostfixe\b'],
    "14": [r'\bgraphe\b', r'\bgraphes\b', r'\bdfs\b', r'\bbfs\b', r'\bprofondeur\b', r'\blargeur\b', r'\badjacence\b', r'\bdijkstra\b']
}

def get_best_module(q_text, q_expl, q_astuce):
    text = f"{q_text} {q_expl} {q_astuce}".lower()
    scores = {m: 0 for m in STRICT_MODULE_PATTERNS}
    for m, patterns in STRICT_MODULE_PATTERNS.items():
        for pat in patterns:
            matches = len(re.findall(pat, text, re.IGNORECASE))
            scores[m] += matches

    # Special priority overrides for specific topics:
    if re.search(r'\btableau\b|\bvecteur\b|\bmatrice\b', text):
        if not re.search(r'\btri\b|\barbre\b|\bgraphe\b|\bpile\b|\bfile\b', text):
            scores["06"] += 10

    if re.search(r'\bboucle\b|\bpour\b|\btantque\b|\brépéter\b', text):
        if not re.search(r'\btableau\b|\bvecteur\b|\bmatrice\b', text):
            scores["05"] += 10

    if re.search(r'\bsi\b|\bsinon\b|\bselon\b', text) and not re.search(r'\bboucle\b|\btableau\b', text):
        scores["04"] += 10

    best_m = max(scores, key=scores.get)
    if scores[best_m] > 0:
        return best_m
    return "01" # Default to 01 if no matches

module_groups = {m: [] for m in STRICT_MODULE_PATTERNS}
for q in questions:
    q_id, q_num, q_text, q_expl, q_ast = q
    mod = get_best_module(q_text, q_expl, q_ast)
    module_groups[mod].append((q_id, q_num, q_text[:60]))

print("Exact strict classification of QCM per Module:")
for mod, q_list in module_groups.items():
    print(f"Module {mod}: {len(q_list)} QCMs assigned")
    for q_id, q_num, q_txt in q_list[:3]:
        print(f"   - [{q_num}] {q_txt}...")

conn.close()
