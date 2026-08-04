import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DJANGO = os.path.join(BASE_DIR, "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(BASE_DIR, "concours.db")

c_code_block = """\n\n```c
#include <stdio.h>

int main() {
    int mois;
    printf("Saisir un mois (1-12) : ");
    scanf("%d", &mois);
    
    switch(mois) {
        case 12:
        case 1:
        case 2:
            printf("Hiver\\n");
        case 3:
        case 4:
        case 5:
            printf("Printemps\\n");
        case 6:
        case 7:
        case 8:
            printf("Eté\\n");
        case 9:
        case 10:
        case 11:
            printf("Automne\\n");
        default:
            printf("Mois invalide\\n");
    }
    return 0;
}
```"""

def main():
    if not os.path.exists(DB_DJANGO):
        print("Django DB not found")
        return
        
    conn_django = sqlite3.connect(DB_DJANGO)
    conn_django.row_factory = sqlite3.Row
    cursor_django = conn_django.cursor()
    
    conn_concours = sqlite3.connect(DB_CONCOURS)
    conn_concours.row_factory = sqlite3.Row
    cursor_concours = conn_concours.cursor()

    # 1. Update Question ID 667 (Q56 - Pourquoi le programme affiche-t-il...)
    q56 = cursor_django.execute("SELECT * FROM exams_question WHERE id = 667").fetchone()
    if q56:
        old_text = q56['question_text']
        new_text = "Pourquoi le programme suivant affiche-t-il plusieurs saisons pour un seul mois saisi ?" + c_code_block
        
        # Update Django
        cursor_django.execute("""
            UPDATE exams_question 
            SET question_text = ?, course_id = 30, subdomain_id = 'DID_CONCEPTS', domain_id = 'DIDACTIQUE'
            WHERE id = 667
        """, (new_text,))
        
        # Update Concours.db
        cursor_concours.execute("""
            UPDATE questions 
            SET question_text = ?, course_id = 30, subdomain_code = 'DID_CONCEPTS', domain_code = 'DIDACTIQUE'
            WHERE question_text = ?
        """, (new_text, old_text))
        
        print("[OK] Question 667 (Q56) updated with C code block and moved to Didactique (Course 30).")

    # 2. Update Question ID 668 (Q57 - Quel est le type d'erreur...)
    q57 = cursor_django.execute("SELECT * FROM exams_question WHERE id = 668").fetchone()
    if q57:
        old_text = q57['question_text']
        new_text = "Quel est le type d'erreur présente dans le code fourni ci-dessous ?" + c_code_block
        
        # Update Django
        cursor_django.execute("""
            UPDATE exams_question 
            SET question_text = ?, course_id = 30, subdomain_id = 'DID_CONCEPTS', domain_id = 'DIDACTIQUE'
            WHERE id = 668
        """, (new_text,))
        
        # Update Concours.db
        cursor_concours.execute("""
            UPDATE questions 
            SET question_text = ?, course_id = 30, subdomain_code = 'DID_CONCEPTS', domain_code = 'DIDACTIQUE'
            WHERE question_text = ?
        """, (new_text, old_text))
        
        print("[OK] Question 668 (Q57) updated with C code block and moved to Didactique (Course 30).")

    # 3. Update Question ID 689 (Q18 - La pensée informatique ou computationnelle...)
    q18 = cursor_django.execute("SELECT * FROM exams_question WHERE id = 689").fetchone()
    if q18:
        old_text = q18['question_text']
        
        # Update Django
        cursor_django.execute("""
            UPDATE exams_question 
            SET course_id = 29, subdomain_id = 'DID_CONCEPTS', domain_id = 'DIDACTIQUE'
            WHERE id = 689
        """)
        
        # Update Concours.db
        cursor_concours.execute("""
            UPDATE questions 
            SET course_id = 29, subdomain_code = 'DID_CONCEPTS', domain_code = 'DIDACTIQUE'
            WHERE question_text = ?
        """, (old_text,))
        
        print("[OK] Question 689 (Q18) moved to Didactique (Course 29).")

    conn_django.commit()
    conn_concours.commit()
    
    conn_django.close()
    conn_concours.close()
    
    print("\nDidactique fixes completed successfully!")

if __name__ == '__main__':
    main()
