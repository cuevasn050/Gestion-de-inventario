import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Usuario

db = SessionLocal()
try:
    users = db.query(Usuario).all()
    if not users:
        print("No users found in database.")
    for user in users:
        print(f"Username: {user.username}, Email: {user.email}, Role: {user.rol}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
