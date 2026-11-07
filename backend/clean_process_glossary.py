import json
import sqlite3

REPLACEMENTS = [
    ("عملية (Amaliya)", "عملية"),
    ("مجدول (Mujadwil)", "مجدول"),
    ("كتلة التحكم في العمليات (Kutlat al-tahakkum)", "كتلة التحكم في العمليات"),
    ("الاستباق (Al-istibāq)", "الاستباق"),
    ("كمية الوقت (Kammiyat al-waqt)", "كمية الوقت"),
    ("مجاعة (Majā'a)", "مجاعة"),
    ("تبديل السياق (Tabdīl al-siyāq)", "تبديل السياق"),
    ("حالة جاهز (Hālat Jāhiz)", "حالة جاهز"),
    ("حالة التشغيل (Hālat al-tashghīl)", "حالة التشغيل"),
    ("حالة محظور (Hālat Mahdhūr)", "حالة محظور"),
    ("زمن الاستجابة (Zaman al-istijaba)", "زمن الاستجابة"),
    ("زمن الانتظار (Zaman al-intidhār)", "زمن الانتظار"),
]

# 1. Update initial_data.json
try:
    with open('initial_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        if item.get('model') == 'syllabus.course' and 'Gestion des processus' in item['fields'].get('title', ''):
            content = item['fields'].get('content') or ''
            content_fr = item['fields'].get('content_fr') or ''
            for old, new in REPLACEMENTS:
                content = content.replace(old, new)
                content_fr = content_fr.replace(old, new)
            item['fields']['content'] = content
            item['fields']['content_fr'] = content_fr

    with open('initial_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("initial_data.json updated successfully.")
except Exception as e:
    print("Error updating initial_data.json:", e)

# 2. Update db.sqlite3
try:
    con = sqlite3.connect('db.sqlite3')
    cur = con.cursor()
    cur.execute("SELECT id, content, content_fr FROM syllabus_course WHERE title LIKE '%Gestion des processus%'")
    rows = cur.fetchall()
    for cid, content, content_fr in rows:
        content = content or ''
        content_fr = content_fr or ''
        for old, new in REPLACEMENTS:
            content = content.replace(old, new)
            content_fr = content_fr.replace(old, new)
        cur.execute("UPDATE syllabus_course SET content = ?, content_fr = ? WHERE id = ?", (content, content_fr, cid))
    con.commit()
    con.close()
    print("db.sqlite3 updated successfully.")
except Exception as e:
    print("Error updating db.sqlite3:", e)
