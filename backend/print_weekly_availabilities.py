from db import SessionLocal
from sqlalchemy import text

session = SessionLocal()
rows = session.execute(text('SELECT * FROM weekly_availabilities')).fetchall()
session.close()

print('WEEKLY AVAILABILITIES:')
for row in rows:
    print(row)
