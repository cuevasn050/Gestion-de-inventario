# 📱 Generar APK/IPA para Android e iOS

## 🤖 Android (APK)

### Para un solo dispositivo o varios dispositivos:
```powershell
npx eas-cli build --platform android --profile preview
```

**✅ Este comando es correcto** y la APK generada se puede instalar en:
- ✅ Múltiples dispositivos Android
- ✅ Sin límite de instalaciones
- ✅ No requiere registro de dispositivos
- ✅ Solo necesitas transferir el archivo `.apk`

**Distribución:**
- Descargas la APK una vez
- La compartes/instalas en todos los dispositivos que quieras
- No hay restricciones de cantidad

---

## 🍎 iOS (IPA)

### Para desarrollo/Testing (TestFlight o Ad-Hoc):
```powershell
# Para TestFlight (distribución interna)
npx eas-cli build --platform ios --profile preview

# Para Ad-Hoc (instalación directa en dispositivos registrados)
npx eas-cli build --platform ios --profile preview --type adhoc
```

**⚠️ Limitaciones de iOS:**
- ❌ Requiere cuenta de desarrollador de Apple ($99/año)
- ❌ Los dispositivos deben estar registrados en tu cuenta
- ❌ Máximo 100 dispositivos por año (para Ad-Hoc)
- ❌ TestFlight permite hasta 10,000 testers internos
- ❌ No puedes simplemente compartir el archivo `.ipa` como con Android

**Distribución iOS:**
1. **TestFlight (Recomendado):**
   - Subes el build a App Store Connect
   - Invitas testers por email
   - Ellos instalan desde la app TestFlight

2. **Ad-Hoc:**
   - Registras los UDID de los dispositivos
   - Generas el build con esos dispositivos
   - Instalas directamente en esos dispositivos

---

## 📋 Comparación

| Característica | Android (APK) | iOS (IPA) |
|---------------|---------------|-----------|
| **Instalación en múltiples dispositivos** | ✅ Sí, sin límite | ⚠️ Solo dispositivos registrados |
| **Costo** | ✅ Gratis | ❌ $99/año (cuenta desarrollador) |
| **Facilidad de distribución** | ✅ Muy fácil (compartir archivo) | ⚠️ Requiere TestFlight o registro |
| **Límite de dispositivos** | ✅ Sin límite | ❌ 100 dispositivos/año (Ad-Hoc) |
| **Tiempo de build** | 10-15 min | 15-20 min |

---

## 🚀 Comandos Completos

### Android (APK):
```powershell
cd mobile
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

### iOS (IPA):
```powershell
cd mobile
npx eas-cli login
npx eas-cli build --platform ios --profile preview
```

### Ambos (Android + iOS):
```powershell
cd mobile
npx eas-cli login
npx eas-cli build --platform all --profile preview
```

---

## 💡 Recomendación

- **Si tienes Android:** El comando que mencionaste está perfecto. Una sola APK para todos los dispositivos.
- **Si tienes iOS:** Necesitarás cuenta de desarrollador y usar TestFlight para distribución fácil.

