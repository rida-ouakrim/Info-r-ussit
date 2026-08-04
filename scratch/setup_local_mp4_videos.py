import os
import shutil
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_VIDEO_DIR = os.path.join(BASE_DIR, "Video algorithme")
DEST_VIDEO_DIR = os.path.join(BASE_DIR, "frontend", "public", "videos")
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# Mapping of file names in 'Video algorithme' to clean public relative URLs
VIDEO_MAPPING = {
    "14) - Un algorithme c'est quoi_.mp4": ("/videos/01_un_algorithme_cest_quoi.mp4", "01. Introduction à l'Algorithmique et Notions de Base"),
    "14) - Les variables et les types.mp4": ("/videos/02_les_variables_et_les_types.mp4", "02. Variables, Constantes et Types de Données"),
    "14) - Les opérateurs.mp4": ("/videos/03_les_operateurs.mp4", "03. Opérateurs, Expressions et Entrées/Sorties (Lire/Écrire)"),
    "14) - Les conditions (Si - Sinon) - Structures conditionnelles.mp4": ("/videos/04_les_conditions_si_sinon.mp4", "04. Structures Conditionnelles (Si...Alors...Sinon, Selon)"),
    "14) - Boucle TantQue - Structures itératives.mp4": ("/videos/05_boucle_tantque.mp4", "05. Structures Itératives et Boucles (TantQue, Pour, Répéter)"),
    "14) - Les tableaux.mp4": ("/videos/06_les_tableaux.mp4", "06. Les Tableaux à 1D et 2D (Vecteurs et Matrices)"),
    "14) - Les chaînes de caractères.mp4": ("/videos/07_les_chaines_de_caracteres.mp4", "07. Chaînes de Caractères et Manipulations"),
    "Algorithmique (12_14) - Fonctions et procédures (sous-programmes).mp4": ("/videos/08_fonctions_et_procedures.mp4", "08. Procédures et Fonctions (Sous-programmes & Modularité)"),
    "Algorithmique (14_14) - Complexité des algorithmes.mp4": ("/videos/09_complexite_des_algorithmes.mp4", "09. Complexité des algorithmes (Notations O)"),
    "14) - Lecture et écriture.mp4": ("/videos/10_lecture_et_ecriture.mp4", "10. Structures de données statiques et dynamiques (Piles, Files, Listes)"),
    "14) - Structure sélective Selon (Structure Cas).mp4": ("/videos/11_structure_selective_selon.mp4", "11. Algorithmes de Tri et Recherche (Tri Bulle, Sélection, Insertion, Rapide, Fusion)"),
    "Algorithmique (13-14) - La récursivité (fonctions récursives).mp4": ("/videos/12_la_recursivite.mp4", "12. Récursivité et approche Diviser pour régner"),
    "14) - Boucle Pour - Structures itératives.mp4": ("/videos/13_boucle_pour.mp4", "13. Arbres binaires et Arbres binaires de recherche (ABR)"),
    "14) - Boucle Répéter - Structures itératives.mp4": ("/videos/14_boucle_repeter.mp4", "14. Graphes : Représentation et parcours (DFS, BFS)")
}

def setup_videos():
    os.makedirs(DEST_VIDEO_DIR, exist_ok=True)
    print(f"Destination folder ready: {DEST_VIDEO_DIR}")

    for src_name, (rel_url, course_title) in VIDEO_MAPPING.items():
        src_path = os.path.join(SRC_VIDEO_DIR, src_name)
        dest_filename = os.path.basename(rel_url)
        dest_path = os.path.join(DEST_VIDEO_DIR, dest_filename)

        if os.path.exists(src_path):
            if not os.path.exists(dest_path):
                print(f"Copying '{src_name}' -> '{dest_filename}'...")
                shutil.copy2(src_path, dest_path)
            else:
                print(f"File '{dest_filename}' already exists.")
        else:
            print(f"Warning: Source file '{src_name}' not found!")

    # Update concours.db and backend/db.sqlite3
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            for src_name, (rel_url, course_title) in VIDEO_MAPPING.items():
                prefix = course_title.split('.')[0].strip() # e.g. "01", "02", etc.
                cursor.execute(f"""
                    UPDATE {table_name}
                    SET video_url = ?
                    WHERE title LIKE ?
                """, (rel_url, f"{prefix}.%"))

            conn.commit()
            print(f"Updated video URLs in database: {db_path}")
            conn.close()

if __name__ == "__main__":
    setup_videos()
    print("Local MP4 videos setup complete!")
