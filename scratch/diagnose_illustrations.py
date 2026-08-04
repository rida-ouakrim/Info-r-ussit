"""
diagnose_illustrations.py
=========================
Checks both databases (db.sqlite3 and concours.db) to list all courses,
detect which ones already have images/illustrations, and group them by domain/subdomain
to diagnose where more illustrations (especially in Didactique and specialty courses) can be integrated.
"""

import sqlite3
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DB_DJANGO = "../backend/db.sqlite3"
DB_CONCOURS = "../concours.db"

def analyze_db(db_path, db_name):
    if not os.path.exists(db_path):
        print(f"⚠️ Database {db_name} not found at {db_path}")
        return None
    
    print(f"\n==================================================")
    print(f"📊 ANALYZING DATABASE: {db_name} ({db_path})")
    print(f"==================================================")
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Let's see the tables
    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in c.fetchall()]
    
    course_table = None
    if "syllabus_course" in tables:
        course_table = "syllabus_course"
    elif "courses" in tables:
        course_table = "courses"
        
    if not course_table:
        print("✗ No courses table found in this database.")
        conn.close()
        return None
        
    print(f"Detected course table: '{course_table}'")
    
    # Query all courses
    c.execute(f"PRAGMA table_info({course_table})")
    cols = [col[1] for col in c.fetchall()]
    
    select_fields = ["id", "title"]
    has_content_ar = "content_ar" in cols
    has_content_fr = "content_fr" in cols
    has_content = "content" in cols
    
    if has_content_ar:
        select_fields.append("content_ar")
    if has_content_fr:
        select_fields.append("content_fr")
    if has_content:
        select_fields.append("content")
        
    subdomain_col = None
    for possible_col in ["subdomain_code", "subdomain", "category"]:
        if possible_col in cols:
            subdomain_col = possible_col
            select_fields.append(subdomain_col)
            break
        
    query = f"SELECT {', '.join(select_fields)} FROM {course_table}"
    c.execute(query)
    rows = c.fetchall()
    
    courses_by_domain = {}
    
    for row in rows:
        domain = row[subdomain_col] if subdomain_col else "Default"
        if not domain:
            domain = "Unknown"
            
        c_id = row['id']
        title = row['title']
        
        # Check for images in content fields
        content_ar = row['content_ar'] if (has_content_ar and row['content_ar']) else ""
        content_fr = row['content_fr'] if (has_content_fr and row['content_fr']) else ""
        content = row['content'] if (has_content and row['content']) else ""
        
        # Markdown image pattern: ![alt](url)
        img_pattern = r'!\[.*?\]\((.*?)\)'
        
        images_ar = re.findall(img_pattern, content_ar)
        images_fr = re.findall(img_pattern, content_fr)
        images_all = re.findall(img_pattern, content)
        
        all_found_images = list(set(images_ar + images_fr + images_all))
        
        if domain not in courses_by_domain:
            courses_by_domain[domain] = []
            
        courses_by_domain[domain].append({
            "id": c_id,
            "title": title,
            "images": all_found_images,
            "has_images": len(all_found_images) > 0
        })
        
    # Print stats
    total_courses = 0
    total_with_images = 0
    
    for dom, list_c in courses_by_domain.items():
        dom_total = len(list_c)
        dom_with_img = sum(1 for item in list_c if item["has_images"])
        total_courses += dom_total
        total_with_images += dom_with_img
        
        print(f"\nDomain/Subdomain: {dom}")
        print(f"  → Total Courses: {dom_total}")
        print(f"  → Courses with Images: {dom_with_img} / {dom_total}")
        for item in list_c:
            status = "🎨 YES" if item["has_images"] else "❌ NO"
            img_list = ", ".join(item["images"]) if item["has_images"] else ""
            print(f"    - [{status}] ID {item['id']}: {item['title']} {f'({img_list})' if img_list else ''}")
            
    print(f"\n📊 Summary for {db_name}:")
    print(f"   Total Courses: {total_courses}")
    print(f"   Courses with Images: {total_with_images} / {total_courses} ({total_with_images/total_courses*100:.1f}%)")
    
    conn.close()

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    analyze_db(os.path.join(script_dir, DB_CONCOURS), "concours.db")
    analyze_db(os.path.join(script_dir, DB_DJANGO), "db.sqlite3")
