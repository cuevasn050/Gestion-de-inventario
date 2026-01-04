# 📱 Aura Mobile - Expo Go

Aplicación móvil desarrollada con Expo que se sincroniza en tiempo real con el backend compartido.

## 🚀 Inicio Rápido

### 1. Instala Expo Go
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Inicia el Servidor
```powershell
npm install
npx expo start
```

### 3. Escanea el QR
- **Android**: Abre Expo Go → Escanea QR
- **iPhone**: Abre Cámara → Apunta al QR

## ⚙️ Configuración

### Configurar IP del Backend

1. Encuentra tu IP:
```powershell
ipconfig
```

2. Edita `src/config/api.ts`:
```typescript
return 'http://TU_IP:8000';
```

3. O usa variable de entorno:
```powershell
$env:API_URL="http://192.168.1.100:8000"
npx expo start
```

## 🔄 Sincronización

- ✅ Automática cada 30 segundos
- ✅ Pull-to-refresh en todas las pantallas
- ✅ Cambios en web ↔ app en tiempo real

## 📋 Requisitos

- Node.js 18+
- Expo Go instalado en el celular
- Backend corriendo con `--host 0.0.0.0`
- Celular y PC en la misma red WiFi

## 📖 Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Iniciar Expo
npx expo start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios
```
