from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
# database_url = "postgresql://postgres:Auraingenieria@db.hkhkxojsxcrqxhvpvflq.supabase.co:5432/postgres"
print(f"Testing connection to: {database_url}")

try:
    engine = create_engine(database_url)
    connection = engine.connect()
    print("✅ ¡Conexión exitosa a la base de datos!")
    connection.close()
except Exception as e:
    print(f"❌ Error de conexión: {e}")
    # Guarda el error detallado para depuración
    with open("db_error.txt", "w") as f:
        f.write(str(e))
