import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DJANGO = os.path.join(BASE_DIR, "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(BASE_DIR, "concours.db")

duplicate_ids = [
    582, 587, 583, 588, 584, 589, 585, 590, 586, 591, 775, 776, 777, 778, 779, 780, 
    812, 813, 814, 815, 816, 817, 818, 819, 796, 797, 798, 799, 800, 801, 802, 803, 
    804, 805, 806, 807, 808, 809, 810, 811, 708, 709, 676, 781, 782, 783, 710, 784, 
    711, 712, 785, 786, 787, 788, 713, 789, 714, 694, 695, 790, 791, 792, 715, 793, 
    794, 795, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 755, 756, 757, 
    758, 759, 760, 761, 762, 763
]

def main():
    if not os.path.exists(DB_DJANGO):
        print("Django DB not found")
        return
        
    conn_django = sqlite3.connect(DB_DJANGO)
    cursor_django = conn_django.cursor()
    
    conn_concours = sqlite3.connect(DB_CONCOURS)
    cursor_concours = conn_concours.cursor()

    # Get texts of duplicate questions to delete from concours.db
    duplicate_texts = []
    for q_id in duplicate_ids:
        row = cursor_django.execute("SELECT question_text FROM exams_question WHERE id = ?", (q_id,)).fetchone()
        if row:
            duplicate_texts.append(row[0])

    print(f"Retrieved {len(duplicate_texts)} question texts for deletion from concours.db.")

    # 1. Delete from Django exams_question
    cursor_django.execute(
        f"DELETE FROM exams_question WHERE id IN ({','.join(map(str, duplicate_ids))})"
    )
    django_deleted = cursor_django.rowcount
    print(f"[OK] Deleted {django_deleted} duplicate questions from Django DB.")

    # Delete corresponding bookmarks or user attempts if any orphan references remain (SQLite CASCADE or manual)
    cursor_django.execute(
        f"DELETE FROM exams_bookmark WHERE question_id IN ({','.join(map(str, duplicate_ids))})"
    )
    cursor_django.execute(
        f"DELETE FROM exams_userattempt WHERE question_id IN ({','.join(map(str, duplicate_ids))})"
    )

    # 2. Delete from concours.db (if they exist there as duplicates)
    concours_deleted = 0
    for text in duplicate_texts:
        # Check if there are multiple occurrences of this text in questions table in concours.db
        rows = cursor_concours.execute("SELECT id FROM questions WHERE question_text = ?", (text,)).fetchall()
        if len(rows) > 1:
            # Delete all except the one with the lowest ID
            lowest_id = min(r[0] for r in rows)
            cursor_concours.execute("DELETE FROM questions WHERE question_text = ? AND id != ?", (text, lowest_id))
            concours_deleted += cursor_concours.rowcount

    print(f"[OK] Deleted {concours_deleted} duplicate questions from concours.db.")

    conn_django.commit()
    conn_concours.commit()
    
    conn_django.close()
    conn_concours.close()
    
    print("\nAll duplicate entries deleted successfully!")

if __name__ == '__main__':
    main()
