import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# EXACT MAPPING OF COURSE PREFIX TO REAL GOOGLE DRIVE VIDEO LINK
EXACT_MAPPING = {
    "01": "https://drive.google.com/file/d/1-1W28JSIac6e78KKmPNP2c0ap9Ya9CL7/view?usp=sharing",  # Un algorithme c'est quoi
    "02": "https://drive.google.com/file/d/1MyGBpXV2QV4FhOX4t3Gj1w0Rs9g6Avnz/view?usp=sharing",  # Variables et types
    "03": "https://drive.google.com/file/d/1PGuOyz-zmtHJldM64inXIpxW_tWdZZ3A/view?usp=sharing",  # Les opérateurs (+ Lecture et écriture)
    "04": "https://drive.google.com/file/d/1Pfc-i8sqKCMJ8iSVsK_v1uMowZXbXYgy/view?usp=sharing",  # Conditions Si-Sinon (+ Selon)
    "05": "https://drive.google.com/file/d/1R3WVJqOByTBl9OL2UG4jrSuhDVdADfJN/view?usp=sharing",  # Boucles (TantQue, Pour, Répéter)
    "06": "https://drive.google.com/file/d/1Vs9hi4x451Vx5hVSGqnLt2VTfvC_niCm/view?usp=sharing",  # Les tableaux
    "07": "https://drive.google.com/file/d/1XWJ2qHZFsjdTq87IrvOgeKn54zRQUSTB/view?usp=sharing",  # Les chaînes de caractères
    "08": "https://drive.google.com/file/d/1g8aDWeWbEbObQCFE7eUdyUsXqddIuCd0/view?usp=sharing",  # Fonctions et procédures
    "09": "https://drive.google.com/file/d/1kAv1rPoAAjXEhCPTkf3v6xajRP7JUADL/view?usp=sharing",  # Complexité des algorithmes
    "10": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=10",  # Structures de données (Piles, Files)
    "11": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=11",  # Tri et Recherche
    "12": "https://drive.google.com/file/d/1r4xl_LTBaEITa4plAUEGVxfdAK4YGT6t/view?usp=sharing",  # La récursivité
    "13": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=13",  # Arbres binaires (ABR)
    "14": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=14",  # Graphes (DFS, BFS)
}

def fix_mapping():
    print("Fixing exact course-to-video mapping...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            for prefix, video_url in EXACT_MAPPING.items():
                cursor.execute(f"""
                    UPDATE {table_name}
                    SET video_url = ?
                    WHERE title LIKE ?
                """, (video_url, f"{prefix}.%"))

            conn.commit()
            print(f"Successfully updated course video URLs in: {db_path}")
            conn.close()

if __name__ == "__main__":
    fix_mapping()
    print("Mapping fix complete!")
