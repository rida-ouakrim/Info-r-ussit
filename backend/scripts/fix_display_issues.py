import json

json_path = 'backend/initial_data.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    if item.get('model') == 'syllabus.course' and item.get('pk') == 16:
        content = item['fields'].get('content_fr') or item['fields'].get('content')
        
        # Replace the italic-wrapped question line
        old_q = "> **Question d'examen type :** *Si l'on recopie la formule `=2*B$4` située en cellule `A4` vers la cellule `C5`, quelle formule obtient-on ?*"
        new_q = "> **Question d'examen type :** Si l'on recopie la formule `=2*B$4` située en cellule `A4` vers la cellule `C5`, quelle formule obtient-on ?"
        if old_q in content:
            content = content.replace(old_q, new_q)
            print("Successfully updated question line in initial_data.json!")
        else:
            print("old_q not found directly in initial_data.json")

        # Replace LaTeX math with clear inline code badge
        for pat in ['$$\\mathbf{=2*D\\$4}$$', '$$\\mathbf{=2*D$4}$$', '$$=2*D\\$4$$', '$$=2*D$4$$']:
            if pat in content:
                content = content.replace(pat, '`=2*D$4`')
                print(f"Replaced {pat} with `=2*D$4`")

        item['fields']['content'] = content
        item['fields']['content_fr'] = content

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

cmd_path = 'backend/syllabus/management/commands/enrich_excel_course.py'
with open(cmd_path, 'r', encoding='utf-8') as f:
    code = f.read()

old_q = "> **Question d'examen type :** *Si l'on recopie la formule `=2*B$4` située en cellule `A4` vers la cellule `C5`, quelle formule obtient-on ?*"
new_q = "> **Question d'examen type :** Si l'on recopie la formule `=2*B$4` située en cellule `A4` vers la cellule `C5`, quelle formule obtient-on ?"
if old_q in code:
    code = code.replace(old_q, new_q)
    print("Replaced question in enrich_excel_course.py!")

for pat in ['$$\\mathbf{=2*D\\$4}$$', '$$\\mathbf{=2*D$4}$$', '$$=2*D\\$4$$', '$$=2*D$4$$']:
    if pat in code:
        code = code.replace(pat, '`=2*D$4`')
        print(f"Replaced {pat} in enrich_excel_course.py")

with open(cmd_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("All fixes applied successfully!")
