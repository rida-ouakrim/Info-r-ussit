#!/usr/bin/env python3
"""
Script d'automatisation des sauvegardes PostgreSQL pour Inforéussit.
Usage: python backup_postgres.py
"""
import os
import sys
import datetime
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def run_backup():
    now = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    backup_dir = BASE_DIR / "backups"
    backup_dir.mkdir(exist_ok=True)
    
    output_json = backup_dir / f"postgres_backup_{now}.json"
    
    print(f"📦 Démarrage de la sauvegarde PostgreSQL vers : {output_json.name}...")
    
    cmd = [
        sys.executable,
        str(BASE_DIR / "manage.py"),
        "dumpdata",
        "--natural-foreign",
        "--natural-primary",
        "-e", "contenttypes",
        "-e", "auth.Permission",
        "--indent", "2"
    ]
    
    try:
        with open(output_json, "w", encoding="utf-8") as f:
            res = subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE, text=True, check=True)
        size_kb = round(os.path.getsize(output_json) / 1024, 1)
        print(f"✅ Sauvegarde réussie ({size_kb} Ko) -> {output_json}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de la sauvegarde : {e.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    run_backup()
