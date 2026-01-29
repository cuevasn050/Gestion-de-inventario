import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Usuario, RolUsuario
from app.auth import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        username = "admin"
        password = "admin123"
        email = "admin@aura.cl"
        
        # Check if already exists (double check)
        existing = db.query(Usuario).filter(Usuario.username == username).first()
        if existing:
            print(f"User {username} already exists")
            return

        new_user = Usuario(
            username=username,
            email=email,
            password_hash=get_password_hash(password),
            rol=RolUsuario.INFORMATICA,
            activo=True
        )
        db.add(new_user)
        db.commit()
        print(f"✅ Created user '{username}' with password '{password}'")
    except Exception as e:
        print(f"❌ Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
