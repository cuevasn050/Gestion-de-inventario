
---

## 📋 Paso 5: Configurar Mobile para Producción

### 5.1 Actualizar URL en el código
Edita `mobile/src/config/api.ts`:

```typescript
const PRODUCTION_API_URL = 'https://aura-backend-u905.onrender.com';
```

### 5.2 Actualizar app.config.js
Edita `mobile/app.config.js`:

```javascript
extra: {
  apiUrl: "https://aura-backend-u905.onrender.com",
  eas: {
    projectId: "6cfe36ce-1b8e-4173-afdd-9b703f8d2879"
  }
}
```

### 5.3 Generar APK
```powershell
cd mobile
npx eas-cli build --platform android --profile production
```

El APK funcionará automáticamente sin pedir URL al usuario.

---

