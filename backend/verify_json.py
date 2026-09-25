import json
from collections import Counter

with open("backend/initial_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

models = Counter(item.get("model") for item in data)
print("Models summary:", dict(models))

courses = {item["pk"]: item for item in data if item.get("model") == "syllabus.course"}
subdomains = {item["pk"]: item for item in data if item.get("model") == "syllabus.subdomain"}
domains = {item["pk"]: item for item in data if item.get("model") == "syllabus.domain"}
questions = [item for item in data if item.get("model") == "exams.question"]

print(f"Total courses: {len(courses)}")
print(f"Total subdomains: {len(subdomains)}")
print(f"Total domains: {len(domains)}")
print(f"Total questions: {len(questions)}")

invalid_courses_in_questions = 0
for q in questions:
    c_id = q["fields"].get("course")
    if c_id and c_id not in courses:
        invalid_courses_in_questions += 1

print(f"Questions referencing non-existent courses: {invalid_courses_in_questions}")
