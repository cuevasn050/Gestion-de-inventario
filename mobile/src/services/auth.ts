import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  rol: 'INFORMATICA' | 'RRHH' | 'JEFE_OBRA' | string;
  obra?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  rol?: string;
  obra?: string;
  user?: User; // Se obtiene después con getMe
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Limpiar espacios en blanco (igual que el frontend web)
    const cleanUsername = credentials.username.trim();
    const cleanPassword = credentials.password.trim();

    // Enviar como JSON (igual que el frontend web)
    const response = await api.post<LoginResponse>('/api/auth/login', {
      username: cleanUsername,
      password: cleanPassword,
    });

    // Guardar token primero
    const token = response.data.access_token;
    if (!token || token.trim() === '') {
      throw new Error('No se recibió token del servidor');
    }
    
    console.log('[AUTH] Guardando token...');
    await AsyncStorage.setItem('auth_token', token);
    
    // Verificar inmediatamente que se guardó
    const savedToken = await AsyncStorage.getItem('auth_token');
    if (!savedToken || savedToken !== token) {
      console.error('[AUTH] Error: El token no se guardó correctamente');
      console.error('[AUTH] Token recibido:', token.substring(0, 20) + '...');
      console.error('[AUTH] Token guardado:', savedToken ? savedToken.substring(0, 20) + '...' : 'null');
      throw new Error('Error al guardar el token en AsyncStorage');
    }
    
    // Verificar todas las keys
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('[AUTH] Token guardado correctamente:', token.substring(0, 20) + '...');
    console.log('[AUTH] Keys en AsyncStorage después de guardar:', allKeys);

    // Obtener datos del usuario después del login (igual que el frontend web)
    let userData: User;
    try {
      // Esperar un poco para asegurar que el interceptor tenga el token
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Crear una nueva instancia de axios con el token para esta petición
      const meResponse = await api.get<User>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userData = meResponse.data;
      console.log('[AUTH] Usuario obtenido:', userData.username);
    } catch (error: any) {
      // Si getMe falla, construir usuario básico desde la respuesta
      console.warn('[AUTH] No se pudo obtener datos del usuario:', error.message);
      userData = {
        id: 0,
        username: cleanUsername,
        email: '',
        rol: (response.data as any).rol || 'RRHH',
        obra: (response.data as any).obra,
      };
    }

    // Guardar usuario
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    console.log('[AUTH] Usuario guardado en AsyncStorage');

    return {
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      rol: response.data.rol,
      obra: response.data.obra,
      user: userData,
    };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  },

  async getStoredUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  },
};

