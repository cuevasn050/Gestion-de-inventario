-- SQL FINAL para resetear contraseña de admin a "admin123"
-- Este hash fue generado específicamente para la contraseña "admin123"

-- Opción 1: Si el usuario ya existe, actualizar
UPDATE usuarios 
SET password_hash = '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'
WHERE username = 'admin';

-- Opción 2: Si no existe, crear (ejecuta solo si la opción 1 no afecta ninguna fila)
INSERT INTO usuarios (username, email, password_hash, rol, activo)
SELECT 
  'admin',
  'admin@aura.com',
  '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
  'INFORMATICA',
  true
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'admin');

-- Verificar
SELECT username, email, rol, activo, LEFT(password_hash, 30) as hash_preview
FROM usuarios 
WHERE username = 'admin';

