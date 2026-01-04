# 📱 Cómo Instalar la APK en tu Celular

## Proceso Completo

### 1. Generar la APK con EAS Build

```powershell
cd mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

**Tiempo estimado:** 10-15 minutos

### 2. Descargar la APK

Una vez que el build termine, tendrás **2 opciones**:

#### Opción A: Descargar desde el enlace
- EAS te mostrará un enlace directo para descargar la APK
- Ejemplo: `https://expo.dev/artifacts/...`
- Abre ese enlace en tu celular o descárgalo en tu PC y transfiérelo

#### Opción B: Descargar desde Expo Dashboard
- Ve a: https://expo.dev/accounts/[tu-usuario]/projects/aura-mobile/builds
- Encuentra el build más reciente
- Haz clic en "Download" para descargar la APK

### 3. Transferir la APK al Celular

**Método 1: USB (Opcional)**
- Conecta tu celular por USB
- Copia el archivo `.apk` a la carpeta de descargas del celular
- Desconecta el USB

**Método 2: Email/WhatsApp/Drive (Más Fácil) ⭐**
- Envía el archivo `.apk` por email a ti mismo
- O súbelo a Google Drive/Dropbox
- O envíalo por WhatsApp a ti mismo
- Descárgalo desde tu celular

**Método 3: Descarga Directa**
- Si abriste el enlace de EAS en tu celular, descarga directamente

### 4. Instalar la APK en Android

1. **Habilitar "Orígenes Desconocidos":**
   - Ve a: Configuración → Seguridad (o Privacidad)
   - Activa "Instalar aplicaciones de orígenes desconocidos"
   - O cuando intentes instalar, Android te pedirá permiso

2. **Instalar:**
   - Abre el archivo `.apk` desde el administrador de archivos
   - O desde la notificación de descarga
   - Toca "Instalar"
   - Espera a que termine la instalación
   - Toca "Abrir" o busca "Aura Ingeniería" en tus apps

### 5. Configurar la URL del Backend (Importante)

La primera vez que abras la app, necesitarás configurar la URL del backend:

1. Abre la app "Aura Ingeniería"
2. En la pantalla de login o configuración, ingresa la URL del backend
3. Formato: `http://IP_DEL_SERVIDOR:8000`
   - Ejemplo: `http://192.168.1.113:8000`
   - O si tienes un dominio: `http://tudominio.com:8000`
4. La app guardará esta configuración y funcionará en cualquier red

## 📝 Notas Importantes

- ✅ **No necesitas conexión USB** - Todo se hace por descarga
- ✅ **Funciona en cualquier red** - Solo configura la URL del backend
- ✅ **La APK es independiente** - No necesitas Expo Go instalado
- ⚠️ **Primera instalación:** Android puede pedirte permiso para instalar apps desconocidas

## 🔧 Solución de Problemas

**"No se puede instalar"**
- Verifica que "Orígenes desconocidos" esté activado
- Asegúrate de que el archivo `.apk` se descargó completamente

**"La app no se conecta al backend"**
- Verifica que la URL del backend sea correcta
- Asegúrate de que el servidor esté corriendo y accesible desde tu red
- Si cambias de red, actualiza la URL del backend en la app

