from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .config import settings
from .database import get_db
from .models import Usuario, RolUsuario

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica contraseña"""
    try:
        # Bcrypt tiene un límite de 72 bytes, truncar si es necesario
        # Asegurarse de que la contraseña sea una cadena válida
        if not plain_password or not isinstance(plain_password, str):
            return False
        
        password_bytes = plain_password.encode('utf-8')
        # Truncar a 72 bytes si es necesario
        if len(password_bytes) > 72:
            plain_password = password_bytes[:72].decode('utf-8', errors='ignore')
        
        # Verificar que el hash sea válido
        if not hashed_password or not isinstance(hashed_password, str):
            return False
        
        # Usar verify directamente con la contraseña (ya truncada si era necesario)
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError as e:
        # Error específico de bcrypt sobre longitud
        if "cannot be longer than 72 bytes" in str(e):
            # Intentar truncar más agresivamente
            try:
                password_bytes = plain_password.encode('utf-8')[:72]
                plain_password_truncated = password_bytes.decode('utf-8', errors='ignore')
                return pwd_context.verify(plain_password_truncated, hashed_password)
            except:
                print(f"[AUTH ERROR] Error al verificar contraseña (después de truncar): {e}")
                return False
        print(f"[AUTH ERROR] Error al verificar contraseña: {e}")
        return False
    except Exception as e:
        # Si hay un error al verificar (hash corrupto, etc.), retornar False
        print(f"[AUTH ERROR] Error al verificar contraseña: {e}")
        import traceback
        traceback.print_exc()
        return False


def get_password_hash(password: str) -> str:
    """Hash de contraseña"""
    try:
        # Bcrypt tiene un límite de 72 bytes, truncar si es necesario
        if not password or not isinstance(password, str):
            raise ValueError("Password must be a non-empty string")
        
        password_bytes = password.encode('utf-8')
        # Truncar a 72 bytes si es necesario
        if len(password_bytes) > 72:
            password = password_bytes[:72].decode('utf-8', errors='ignore')
        
        return pwd_context.hash(password)
    except ValueError as e:
        if "cannot be longer than 72 bytes" in str(e):
            # Intentar truncar más agresivamente
            try:
                password_bytes = password.encode('utf-8')[:72]
                password_truncated = password_bytes.decode('utf-8', errors='ignore')
                return pwd_context.hash(password_truncated)
            except Exception as e2:
                print(f"[AUTH ERROR] Error al generar hash (después de truncar): {e2}")
                raise
        print(f"[AUTH ERROR] Error al generar hash: {e}")
        raise
    except Exception as e:
        print(f"[AUTH ERROR] Error al generar hash: {e}")
        import traceback
        traceback.print_exc()
        raise


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Crea token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    """Obtiene usuario actual desde token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(Usuario).filter(Usuario.username == username).first()
    if user is None or not user.activo:
        raise credentials_exception
    return user


def require_role(allowed_roles: list[RolUsuario]):
    """Dependency para verificar rol de usuario"""
    def role_checker(current_user: Usuario = Depends(get_current_user)):
        if current_user.rol not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta acción"
            )
        return current_user
    return role_checker





