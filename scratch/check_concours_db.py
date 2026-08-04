import sqlite3, sys
sys.stdout.reconfigure(encoding='utf-8')

# Check concours.db
conn = sqlite3.connect('concours.db')
c = conn.cursor()

# Check tables
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tables:", c.fetchall())

# Check subdomains
try:
    c.execute("SELECT DISTINCT subdomain_code FROM courses WHERE subdomain_code LIKE 'DEV%'")
    print("DEV courses subdomain_codes:", c.fetchall())
except Exception as e:
    print(f"Error: {e}")
    # Try alternative
    c.execute("SELECT sql FROM sqlite_master WHERE name='courses'")
    print("Schema:", c.fetchone())

conn.close()
