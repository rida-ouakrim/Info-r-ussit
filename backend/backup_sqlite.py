import os
import sys
import sqlite3
import json
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DB_ENGINE'] = 'django.db.backends.sqlite3'

import django
sys.path.insert(0, str(Path(__file__).resolve().parent))
django.setup()

from django.core.management import call_command

print("[BACKUP] Export complet des donnees SQLite...")
output_file = Path(__file__).parent / 'data_backup_sqlite.json'
call_command('dumpdata', '--indent', '2', '--output', str(output_file))
print(f"[OK] Backup complet : {output_file}")

print("\n[BACKUP] Export du contenu uniquement (cours, questions)...")
content_file = Path(__file__).parent / 'data_content_only.json'
call_command('dumpdata', 'syllabus', 'exams.question', '--indent', '2', '--output', str(content_file))
print(f"[OK] Contenu backup : {content_file}")

print("\n[OK] Backups termines ! Verifiez les fichiers dans backend/")
