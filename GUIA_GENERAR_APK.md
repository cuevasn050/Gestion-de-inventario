# 📱 Guía para Generar APK

Para generar la APK de la app móvil, tienes **3 opciones**:

## Opción 1: EAS Build (Recomendado - Más Fácil) ⭐

**Ventajas:**
- ✅ No requiere Android Studio ni Android SDK
- ✅ Se construye en la nube de Expo
- ✅ Más rápido de configurar

**Pasos:**

1. **Crear cuenta en Expo** (si no tienes):
   ```powershell
   npx eas-cli login
   ```

2. **Configurar el proyecto:**
   ```powershell
   npx eas-cli build:configure
   ```

3. **Generar la APK:**
   ```powershell
   npx eas-cli build --platform android --profile preview
   ```

4. **Descargar la APK:**
   - El build se realizará en la nube
   - Recibirás un enlace para descargar la APK cuando termine
   - Tarda aproximadamente 10-15 minutos

---

## Opción 2: Build Local con Android Studio

**Ventajas:**
- ✅ No requiere cuenta de Expo
- ✅ Control total sobre el proceso

**Requisitos:**
- Android Studio instalado
- Android SDK configurado
- Variables de entorno ANDROID_HOME configuradas

**Pasos:**

1. **Instalar Android Studio:**
   - Descarga desde: https://developer.android.com/studio
   - Instala Android SDK (incluido en Android Studio)

2. **Configurar variables de entorno:**
   ```powershell
   # En PowerShell (sesión actual)
   $env:ANDROID_HOME = "C:\Users\usuario\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools"
   $env:PATH += ";$env:ANDROID_HOME\tools"
   ```

   O configurar permanentemente en Windows:
   - Panel de Control → Sistema → Variables de entorno
   - Agregar `ANDROID_HOME` = `C:\Users\usuario\AppData\Local\Android\Sdk`
   - Agregar al PATH: `%ANDROID_HOME%\platform-tools` y `%ANDROID_HOME%\tools`

3. **Generar la APK:**
   ```powershell
   cd mobile
   .\GENERAR_APK.ps1
   ```

---

## Opción 3: Build con Gradle Directo (Avanzado)

Si ya tienes Android Studio instalado, puedes construir directamente:

```powershell
cd mobile\android
.\gradlew assembleRelease
```

La APK estará en: `mobile\android\app\build\outputs\apk\release\app-release.apk`

---

## 📝 Notas Importantes

1. **IP del Backend:** La app está configurada para usar `http://192.168.1.113:8000` por defecto. Si tu IP cambia, edita `mobile/src/config/api.ts` o `mobile/app.config.js` antes de generar la APK.

2. **Firma de la APK:** La APK generada estará firmada con una clave de debug. Para producción, necesitarás crear una keystore y configurarla.

3. **Instalación:** Para instalar la APK en tu dispositivo:
   - Transfiere el archivo `.apk` a tu celular
   - Habilita "Orígenes desconocidos" en Configuración → Seguridad
   - Abre el archivo APK e instálalo

---

## 🚀 Recomendación

**Usa la Opción 1 (EAS Build)** si es la primera vez que generas una APK. Es la más simple y no requiere instalar nada adicional.

