import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\RIDA OUAKRIM\.gemini\antigravity-ide\brain\19400f5d-e2fa-44c0-9132-d9ef694d6d08\.system_generated\tasks\task-809.log"

print("Log path exists:", os.path.exists(log_path))
if os.path.exists(log_path):
    with open(log_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()
    print(f"Total lines in log: {len(lines)}")
    print("Log contents:")
    for line in lines:
        print(line, end='')
else:
    print("Log file not created yet.")
