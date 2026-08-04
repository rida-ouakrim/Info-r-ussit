import sqlite3
import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

def clean_fr_content(content: str) -> str:
    """Remove Arabic label markers from French content."""
    if not content:
        return content
    
    # Remove "- **بالفرنسية**: " prefix from bullet points
    content = re.sub(r'[-*]\s*\*\*بالفرنسية\*\*:\s*', '', content)
    content = re.sub(r'[-*]\s*\*\*[Ee]n fran[cç]ais\*\*:\s*', '', content)
    
    # Clean any standalone "بالفرنسية:" prefix
    content = re.sub(r'\*\*بالفرنسية\*\*:\s*', '', content)
    content = re.sub(r'بالفرنسية:\s*', '', content)
    
    # Remove "[FR]" markers
    content = re.sub(r'\*?\*?\[FR\]\*?\*?\s*', '', content)
    
    # Clean double blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.strip()

def clean_ar_content(content: str) -> str:
    """Remove French label markers from Arabic content."""
    if not content:
        return content
    
    # Remove "- **بالعربية**: " prefix from bullet points  
    content = re.sub(r'[-*]\s*\*\*بالعربية\*\*:\s*', '', content)
    content = re.sub(r'\*\*بالعربية\*\*:\s*', '', content)
    content = re.sub(r'بالعربية:\s*', '', content)
    
    # Remove "[AR]" markers
    content = re.sub(r'\*?\*?\[AR\]\*?\*?\s*', '', content)
    
    # Clean double blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.strip()


conn = sqlite3.connect('backend/db.sqlite3')
c = conn.cursor()

COURSE_IDS = [36, 37, 38, 39]

for cid in COURSE_IDS:
    c.execute("SELECT id, title, content_ar, content_fr FROM syllabus_course WHERE id = ?", (cid,))
    row = c.fetchone()
    if not row:
        print(f"Course {cid} not found")
        continue
    
    cid_r, title, content_ar, content_fr = row
    
    print(f"\n{'='*60}")
    print(f"Course {cid_r}: {title[:60]}")
    
    cleaned_fr = clean_fr_content(content_fr)
    cleaned_ar = clean_ar_content(content_ar)
    
    print(f"  FR: {len(content_fr or '')} -> {len(cleaned_fr)} chars")
    print(f"  AR: {len(content_ar or '')} -> {len(cleaned_ar)} chars")
    
    # Show before/after sample
    if content_fr:
        # Find a spot with بالفرنسية in the original
        idx = (content_fr or '').find('بالفرنسية')
        if idx > -1:
            print(f"  FR BEFORE: ...{content_fr[max(0,idx-20):idx+80]}...")
    
    c.execute(
        "UPDATE syllabus_course SET content_ar = ?, content_fr = ? WHERE id = ?",
        (cleaned_ar, cleaned_fr, cid_r)
    )

conn.commit()

# Verify
print("\n\n=== VERIFICATION - Course 36 content_fr first 800 chars ===")
c.execute("SELECT content_fr FROM syllabus_course WHERE id = 36")
print(c.fetchone()[0][:800])

print("\n=== VERIFICATION - Course 36 content_ar first 800 chars ===")
c.execute("SELECT content_ar FROM syllabus_course WHERE id = 36")
print(c.fetchone()[0][:800])

conn.close()
print("\n✅ All courses cleaned!")
