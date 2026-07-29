import time
import json
from django.core.management.base import BaseCommand
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

from exams.models import Question
from syllabus.models import Course

# Pydantic Schema for Gemini response
class QuestionMapping(BaseModel):
    question_id: int = Field(description="The ID of the question.")
    course_id: int = Field(description="The ID of the selected course from the syllabus.")
    reasoning: str = Field(description="Brief 1-sentence reasoning for this classification.")

class BatchClassification(BaseModel):
    mappings: List[QuestionMapping] = Field(description="List of classified question mappings.")

class Command(BaseCommand):
    help = 'Re-classify all questions in the database to their correct courses, subdomains, and domains using Gemini (Vertex AI).'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Initializing Gemini client..."))
        try:
            client = genai.Client(
                vertexai=True, 
                project="chrome-backbone-496013-p4", 
                location="us-central1"
            )
            self.stdout.write(self.style.SUCCESS("[OK] Gemini client ready."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"[ERROR] Gemini init failed: {e}"))
            return

        # Load all courses
        courses = Course.objects.all().select_related('subdomain', 'subdomain__domain')
        if not courses.exists():
            self.stdout.write(self.style.ERROR("No courses found in database. Please seed courses first."))
            return

        course_map = {c.id: c for c in courses}
        
        # Build courses prompt taxonomy
        grouped = {}
        for c in courses:
            sub = c.subdomain.name
            if sub not in grouped:
                grouped[sub] = []
            grouped[sub].append(c)
            
        lines = []
        for sub, course_list in grouped.items():
            lines.append(f"\n--- Subdomain: {sub} ---")
            for c in course_list:
                lines.append(f"  * Course ID {c.id}: {c.title}")
        courses_prompt_str = "\n".join(lines)

        # Load all questions
        questions = list(Question.objects.all())
        total_questions = len(questions)
        self.stdout.write(self.style.NOTICE(f"Loaded {total_questions} questions from database for classification."))

        batch_size = 15
        batches = [questions[i:i + batch_size] for i in range(0, total_questions, batch_size)]
        
        total_updated = 0

        for idx, batch in enumerate(batches):
            self.stdout.write(self.style.NOTICE(f"Processing batch {idx+1}/{len(batches)} (Size: {len(batch)})..."))
            
            # Format questions
            questions_list = []
            for q in batch:
                q_info = (
                    f"Question ID: {q.id}\n"
                    f"Text: {q.question_text}\n"
                    f"Options: A) {q.option_a}, B) {q.option_b}, C) {q.option_c}, D) {q.option_d}\n"
                    f"Current Subdomain: {q.subdomain.code if q.subdomain else 'None'}\n"
                    f"Explanation: {q.explanation or ''}\n"
                    f"----------------------------------------"
                )
                questions_list.append(q_info)
                
            questions_str = "\n\n".join(questions_list)
            
            prompt = (
                f"You are an expert Computer Science Professor and Examiner.\n"
                f"Classify each of the following multiple-choice questions into the correct course from the complete syllabus below.\n\n"
                f"--- SYLLABUS COURSES ---\n"
                f"{courses_prompt_str}\n\n"
                f"--- QUESTIONS TO CLASSIFY ---\n"
                f"{questions_str}\n\n"
                f"Task: For each question, select the SINGLE most relevant course ID from the syllabus courses list. "
                f"Choose carefully based on the question subject matter. Return only valid course IDs."
            )

            retries = 4
            mappings = []
            for attempt in range(retries):
                try:
                    resp = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=[prompt],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=BatchClassification,
                            temperature=0.1,
                        ),
                    )
                    mappings = json.loads(resp.text).get("mappings", [])
                    break
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"    Attempt {attempt+1} failed: {e}"))
                    time.sleep(10 * (attempt + 1))

            batch_updated = 0
            for m in mappings:
                q_id = m.get('question_id')
                c_id = m.get('course_id')
                
                if q_id and c_id and c_id in course_map:
                    try:
                        q_obj = Question.objects.get(id=q_id)
                        c_obj = course_map[c_id]
                        
                        # Check if attributes changed
                        changed = False
                        if q_obj.course != c_obj:
                            q_obj.course = c_obj
                            changed = True
                        if q_obj.subdomain != c_obj.subdomain:
                            q_obj.subdomain = c_obj.subdomain
                            changed = True
                        if q_obj.domain != c_obj.subdomain.domain:
                            q_obj.domain = c_obj.subdomain.domain
                            changed = True
                            
                        if changed:
                            q_obj.save()
                            batch_updated += 1
                            total_updated += 1
                    except Question.DoesNotExist:
                        continue
                        
            self.stdout.write(self.style.SUCCESS(f"  Re-classified and updated {batch_updated} questions in this batch."))
            time.sleep(2)

        self.stdout.write(self.style.SUCCESS(f"\nFinished re-classification! Total questions corrected/updated: {total_updated}"))
