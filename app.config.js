export default {
  expo: {
    name: "Aura Ingeniería",
    slug: "aura-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    splash: {
      backgroundColor: "#111827"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aura.mobile"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#111827"
      },
      package: "com.aura.mobile",
      permissions: [
        "CAMERA"
      ]
    },
    web: {
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Permitir acceso a la cámara para escanear códigos QR"
        }
      ]
    ],
    scheme: "aura",
    extra: {
      // Para producción: cambia esto a tu dominio público
      // Ejemplo: "https://api.tudominio.com" o "https://tudominio.com/api"
      // Para desarrollo local: déjalo vacío y la app pedirá la IP
      apiUrl: process.env.API_URL || "",
      eas: {
        projectId: "6cfe36ce-1b8e-4173-afdd-9b703f8d2879"
      }
    }
  }
};

