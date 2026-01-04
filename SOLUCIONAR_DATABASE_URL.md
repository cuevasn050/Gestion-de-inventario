
4. **Busca la variable `DATABASE_URL`**

 5. **Configura la URL completa con la contraseña:**
   ```
   postgresql://postgres.hkhkxojsxcrqxhvpvflq:Axenoider2000@aws-0-us-west-2.pooler.supabase.com:6543/postgres
   ```
   
   **Nota:** No incluyas `?sslmode=require` - Supabase Session Pooler maneja SSL automáticamente

6. **Si la contraseña cambió en Supabase:**
   - Ve a Supabase → Settings → Database
   - Haz clic en "Reset Database Password" si es necesario
   - Copia la nueva contraseña
   - Actualiza `DATABASE_URL` en Render con la nueva contraseña

7. **Verifica que la URL tenga:**
   - ✅ Usuario correcto: `postgres.hkhkxojsxcrqxhvpvflq`
   - ✅ Contraseña correcta: `Axenoider2000` (o la nueva si la cambiaste)
   - ✅ Host correcto: `aws-0-us-west-2.pooler.supabase.com`
   - ✅ Puerto correcto: `6543` (Session Pooler)
   - ✅ `?sslmode=require` al final

8. **Haz clic en "Save Changes"**

9. **Render redeployará automáticamente**

10. **Verifica en los logs** que ya no aparezca el error de autenticación

---

## 🔍 Verificación:

Después de corregir `DATABASE_URL`, los logs del backend deberían mostrar:
- ✅ Conexión exitosa a Supabase
- ✅ Tablas creadas/verificadas correctamente
- ✅ Sin errores de autenticación

