import json

with open('backend/initial_data.json', encoding='utf-8') as f:
    data = json.load(f)

# List all DEV_ALGO courses
print("=== DEV_ALGO Courses ===")
courses = [x for x in data if x.get('model') == 'syllabus.course' and x['fields'].get('subdomain') == 'DEV_ALGO']
for c in sorted(courses, key=lambda x: x['pk']):
    print(f"PK={c['pk']} | {c['fields'].get('title', 'N/A')}")

print()

# List ALL courses and their PKs per subdomain
print("=== All Courses by Subdomain ===")
all_courses = [x for x in data if x.get('model') == 'syllabus.course']
from collections import defaultdict
by_sub = defaultdict(list)
for c in all_courses:
    by_sub[c['fields'].get('subdomain', 'N/A')].append((c['pk'], c['fields'].get('title', '')[:50]))
for sub, cs in sorted(by_sub.items()):
    print(f"\n[{sub}]")
    for pk, title in sorted(cs, key=lambda x: x[0]):
        print(f"  PK={pk} | {title}")

print()

# Check what course Q11 2025 DEV is pointing to
print("=== Q11 2025 DEV course assignment ===")
q11 = [q for q in data if q.get('model') == 'exams.question' and q['fields'].get('exam_year') == 2025 and q['fields'].get('domain') == 'DEV' and q['fields'].get('question_number') == 'Q11']
for q in q11:
    course_id = q['fields'].get('course')
    course = next((c for c in all_courses if c['pk'] == course_id), None)
    print(f"Q11 PK={q['pk']}, course_id={course_id}, course_title={course['fields'].get('title') if course else 'NOT FOUND'}")
