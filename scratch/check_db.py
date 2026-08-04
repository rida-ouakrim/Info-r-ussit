import sqlite3
import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

def has_arabic(text):
    """Check if text contains Arabic characters."""
    if not text:
        return False
    return bool(re.search(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]', text))

def has_french(text):
    """Check if text is predominantly French (latin chars, common FR words)."""
    if not text:
        return False
    return bool(re.search(r'[a-zA-Z]{2,}', text))

conn = sqlite3.connect('backend/db.sqlite3')
c = conn.cursor()

# Check for mixed questions (both AR + FR in same question_text)
c.execute("""
    SELECT id, exam_year, question_number, question_text, explanation, subdomain_id
    FROM exams_question 
    WHERE subdomain_id IN ('EDU_PSYCHO', 'EDU_SOCIO')
    ORDER BY id
""")
rows = c.fetchall()

mixed_count = 0
for r in rows:
    q_text = r[3] or ''
    explanation = r[4] or ''
    
    q_has_ar = has_arabic(q_text)
    q_has_fr = has_french(q_text)
    
    # Significant mixing: both languages with substantial content
    # Arabic chars > 50 and French words > 3
    arabic_chars = len(re.findall(r'[\u0600-\u06FF]', q_text))
    french_words = len(re.findall(r'\b[a-zA-Z]{3,}\b', q_text))
    
    if arabic_chars > 30 and french_words > 3:
        mixed_count += 1
        if mixed_count <= 5:
            print(f"\nMIXED - ID {r[0]} | {r[1]} | {r[2]} | {r[5]}")
            print(f"  Arabic chars: {arabic_chars}, French words: {french_words}")
            print(f"  Q: {q_text[:200]}")

print(f"\n\nTotal mixed questions: {mixed_count} / {len(rows)}")

# Check specific questions for the QCM display on platform  
c.execute("SELECT COUNT(*) FROM exams_question WHERE subdomain_id IN ('EDU_PSYCHO', 'EDU_SOCIO')")
total = c.fetchone()[0]
print(f"Total EDU questions: {total}")

# Check language distribution
c.execute("""
    SELECT exam_year, COUNT(*) as total,
           SUM(CASE WHEN question_text GLOB '*[ا-ي]*' THEN 1 ELSE 0 END) as ar_count
    FROM exams_question 
    WHERE subdomain_id IN ('EDU_PSYCHO', 'EDU_SOCIO')
    GROUP BY exam_year
""")
print("\nDistribution by year:")
for r in c.fetchall():
    print(f"  {r[0]}: {r[1]} total, ~{r[2]} AR")

conn.close()
