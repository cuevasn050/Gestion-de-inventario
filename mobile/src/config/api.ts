// Configuración de la API - Mismo backend que la web
// La URL se puede configurar dinámicamente desde la app para funcionar en cualquier red

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para guardar la URL del backend en AsyncStorage
const BACKEND_URL_KEY = '@aura_backend_url';

// URL por defecto para producción (si tienes un servidor deployado)
// Si tu backend está en producción, cambia esto a tu dominio público
// Ejemplo: 'https://api.tudominio.com' o 'https://tudominio.com/api'
// Si está vacío, la app pedirá la URL al usuario (útil para desarrollo local)
const PRODUCTION_API_URL = 'https://aura-backend-u905.onrender.com'; // URL del backend en producción

// URL por defecto (vacía - debe configurarse desde la app si no hay producción)
let currentApiUrl = PRODUCTION_API_URL;

// Inicializar URL al cargar (síncrono para compatibilidad)
const initializeApiUrl = () => {
  // PRIORIDAD 1: URL de producción (siempre disponible)
  if (PRODUCTION_API_URL && PRODUCTION_API_URL.trim() !== '') {
    currentApiUrl = PRODUCTION_API_URL;
    console.log('[API] Inicializando con URL de producción:', currentApiUrl);
    return;
  }
  
  // PRIORIDAD 2: Expo config
  if (Constants.expoConfig?.extra?.apiUrl) {
    currentApiUrl = Constants.expoConfig.extra.apiUrl;
    return;
  }
  
  // PRIORIDAD 3: Variable de entorno
  if (process.env.API_URL) {
    currentApiUrl = process.env.API_URL;
    return;
  }
  
  // AsyncStorage solo se carga de forma asíncrona (no bloquea la inicialización)
  // La URL de producción ya está configurada arriba
};

// Inicializar al cargar el módulo
initializeApiUrl();

// Obtener URL del backend (síncrono para compatibilidad)
export const getApiUrl = (): string => {
  return currentApiUrl;
};

// Obtener URL del backend de forma asíncrona (para actualizar)
export const getApiUrlAsync = async (): Promise<string> => {
  // PRIORIDAD 1: Si hay URL de producción, usarla primero
  if (PRODUCTION_API_URL && PRODUCTION_API_URL.trim() !== '') {
    currentApiUrl = PRODUCTION_API_URL;
    console.log('[API] Usando URL de producción:', currentApiUrl);
    return currentApiUrl;
  }
  
  // PRIORIDAD 2: Usar la de Expo config
  if (Constants.expoConfig?.extra?.apiUrl && Constants.expoConfig.extra.apiUrl.trim() !== '') {
    currentApiUrl = Constants.expoConfig.extra.apiUrl;
    console.log('[API] Usando URL de Expo config:', currentApiUrl);
    return currentApiUrl;
  }
  
  // PRIORIDAD 3: Si no hay URL de producción, buscar en AsyncStorage (solo para desarrollo)
  try {
    const savedUrl = await AsyncStorage.getItem(BACKEND_URL_KEY);
    if (savedUrl && savedUrl.trim() !== '') {
      currentApiUrl = savedUrl.trim();
      console.log('[API] Usando URL guardada en AsyncStorage:', currentApiUrl);
      return currentApiUrl;
    }
  } catch (error) {
    console.warn('[API] Error al leer URL guardada:', error);
  }
  
  console.warn('[API] No se encontró URL configurada, usando:', currentApiUrl);
  return currentApiUrl;
};

// Guardar URL del backend (para que funcione en cualquier red)
export const saveBackendUrl = async (url: string): Promise<void> => {
  try {
    // Validar formato básico
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('La URL debe comenzar con http:// o https://');
    }
    const cleanUrl = url.trim();
    await AsyncStorage.setItem(BACKEND_URL_KEY, cleanUrl);
    currentApiUrl = cleanUrl;
    console.log('[API] URL del backend guardada:', cleanUrl);
  } catch (error) {
    console.error('[API] Error al guardar URL:', error);
    throw error;
  }
};

export const API_CONFIG = {
  get BASE_URL(): string {
    return currentApiUrl;
  },
  set BASE_URL(url: string) {
    currentApiUrl = url;
  },
  TIMEOUT: 20000, // 20 segundos
};

