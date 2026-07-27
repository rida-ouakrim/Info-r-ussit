import sqlite3

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/backend/db.sqlite3"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT examples FROM syllabus_course WHERE id=26")
row = cursor.fetchone()
if row and row[0]:
    with open("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/scratch/course_26_examples.md", "w", encoding="utf-8") as f:
        f.write(row[0])
    print("Dumped Course 26 examples successfully!")
else:
    print("Course 26 examples not found or empty.")
conn.close()
