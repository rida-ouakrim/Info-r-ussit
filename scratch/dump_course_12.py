import sqlite3

DB_PATH = "c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/concours.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT content, examples, astuces FROM courses WHERE id=12")
row = cursor.fetchone()

with open("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/scratch/course_12_content.md", "w", encoding="utf-8") as f:
    f.write(row[0])

with open("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/scratch/course_12_examples.md", "w", encoding="utf-8") as f:
    f.write(row[1])

with open("c:/Users/RIDA OUAKRIM/Desktop/rida/zrida/scratch/course_12_astuces.md", "w", encoding="utf-8") as f:
    f.write(row[2])

print("Dumped course 12!")
conn.close()
