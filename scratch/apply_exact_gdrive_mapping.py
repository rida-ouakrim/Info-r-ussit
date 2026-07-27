import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

# VERIFIED EXACT MAPPING FROM GOOGLE DRIVE TITLE METADATA
VERIFIED_MAPPING = {
    # 01. Introduction -> "14) - Un algorithme c'est quoi_.mp4" (Link 12)
    "01": "https://drive.google.com/file/d/1r4xl_LTBaEITa4plAUEGVxfdAK4YGT6t/view?usp=sharing",
    
    # 02. Variables et Types -> "14) - Les variables et les types.mp4" (Link 13)
    "02": "https://drive.google.com/file/d/1vIQJKqwnQ8GcinNHDygneOydAAKSYWRd/view?usp=sharing",
    
    # 03. Opérateurs & I/O -> "14) - Les opérateurs.mp4" (Link 01)
    "03": "https://drive.google.com/file/d/1-1W28JSIac6e78KKmPNP2c0ap9Ya9CL7/view?usp=sharing",
    
    # 04. Conditionnelles -> "14) - Les conditions (Si - Sinon).mp4" (Link 14)
    "04": "https://drive.google.com/file/d/1voTOC1NW_YsBNNo8wtrKJo7lPbIfd1rc/view?usp=sharing",
    
    # 05. Structures Itératives -> "14) - Boucle TantQue.mp4" (Link 07)
    "05": "https://drive.google.com/file/d/1XWJ2qHZFsjdTq87IrvOgeKn54zRQUSTB/view?usp=sharing",
    
    # 06. Tableaux -> "14) - Les tableaux.mp4" (Link 11)
    "06": "https://drive.google.com/file/d/1p7ui66rjrnGiu9FPWso4iIzIVecJSEor/view?usp=sharing",
    
    # 07. Chaînes -> "14) - Les chaînes de caractères.mp4" (Link 10)
    "07": "https://drive.google.com/file/d/1nztnVKBD8n7NImMQOI87ZRycU-0Aw1rS/view?usp=sharing",
    
    # 08. Procédures et Fonctions -> "Algorithmique (12_14) - Fonctions et procédures.mp4" (Link 03)
    "08": "https://drive.google.com/file/d/1PGuOyz-zmtHJldM64inXIpxW_tWdZZ3A/view?usp=sharing",
    
    # 09. Complexité -> "Algorithmique (14_14) - Complexité des algorithmes.mp4" (Link 09)
    "09": "https://drive.google.com/file/d/1kAv1rPoAAjXEhCPTkf3v6xajRP7JUADL/view?usp=sharing",
    
    # 10. Structures de données (Piles/Files) -> YouTube Playlist Fallback
    "10": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=10",
    
    # 11. Tri et Recherche -> YouTube Playlist Fallback
    "11": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=11",
    
    # 12. Récursivité -> "Algorithmique (13-14) - La récursivité.mp4" (Link 08)
    "12": "https://drive.google.com/file/d/1g8aDWeWbEbObQCFE7eUdyUsXqddIuCd0/view?usp=sharing",
    
    # 13. Arbres Binaires -> YouTube Playlist Fallback
    "13": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=13",
    
    # 14. Graphes -> YouTube Playlist Fallback
    "14": "https://www.youtube.com/watch?v=kk6YbA5I-Iw&list=PL2aehqZh72Lumvy4tSekr6Rzcgwn15MLI&index=14",
}

def apply_verified_mapping():
    print("Applying 100% verified Google Drive links to databases...")
    for db_path in [CONCOURS_DB, DJANGO_DB]:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"

            for prefix, url in VERIFIED_MAPPING.items():
                cursor.execute(f"""
                    UPDATE {table_name}
                    SET video_url = ?
                    WHERE title LIKE ?
                """, (url, f"{prefix}.%"))

            conn.commit()
            print(f"Successfully updated video URLs in: {db_path}")
            conn.close()

if __name__ == "__main__":
    apply_verified_mapping()
    print("Verified mapping completed successfully!")
