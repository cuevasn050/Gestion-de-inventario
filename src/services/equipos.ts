import api from './api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface Equipo {
  id: number;
  serie: string;
  marca: string;
  modelo: string;
  tipo: string;
  estado_dispositivo: 'OPERATIVO' | 'MANTENCIÓN' | 'BAJA';
  ram_gb?: number;
  ssd_gb?: number;
  so?: string;
  observaciones?: string;
  prestamo_activo?: any;
  ultimo_prestamo_devuelto?: any;
}

export interface EquiposFilters {
  obra?: string;
  serie?: string;
}

export const equiposService = {
  async getAll(filters?: EquiposFilters): Promise<Equipo[]> {
    // Usar el mismo formato que el frontend web
    const params: any = {};
    if (filters?.obra) params.obra = filters.obra;
    if (filters?.serie) params.serie = filters.serie;

    const response = await api.get<Equipo[]>('/api/equipos/', { params });
    return response.data;
  },

  async getById(id: number): Promise<Equipo> {
    const response = await api.get<Equipo>(`/api/equipos/${id}`);
    return response.data;
  },

  async obtenerInfoQR(equipoId: number): Promise<any> {
    const response = await api.get(`/api/equipos/qr/${equipoId}/info`);
    return response.data;
  },

  async create(equipo: Partial<Equipo>): Promise<Equipo> {
    const response = await api.post<Equipo>('/api/equipos/', equipo);
    return response.data;
  },

  async update(id: number, equipo: Partial<Equipo>): Promise<Equipo> {
    const response = await api.put<Equipo>(`/api/equipos/${id}`, equipo);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/equipos/${id}`);
  },

  async descargarQR(id: number): Promise<string> {
    try {
      const response = await api.get(`/api/equipos/${id}/qr`, {
        responseType: 'arraybuffer'
      });

      // Convertir arraybuffer a base64 usando btoa si está disponible, o manualmente
      let base64: string;
      
      if (typeof btoa !== 'undefined') {
        // En web, usar btoa
        const bytes = new Uint8Array(response.data);
        const binary = String.fromCharCode(...bytes);
        base64 = btoa(binary);
      } else {
        // En React Native, convertir manualmente
        const bytes = new Uint8Array(response.data);
        const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let base64Str = '';
        let i = 0;
        while (i < bytes.length) {
          const a = bytes[i++];
          const b = i < bytes.length ? bytes[i++] : 0;
          const c = i < bytes.length ? bytes[i++] : 0;
          const bitmap = (a << 16) | (b << 8) | c;
          base64Str += base64Chars.charAt((bitmap >> 18) & 63);
          base64Str += base64Chars.charAt((bitmap >> 12) & 63);
          base64Str += i - 2 < bytes.length ? base64Chars.charAt((bitmap >> 6) & 63) : '=';
          base64Str += i - 1 < bytes.length ? base64Chars.charAt(bitmap & 63) : '=';
        }
        base64 = base64Str;
      }
      
      const dataUri = `data:image/png;base64,${base64}`;
      
      // Guardar temporalmente para compartir usando FileSystem
      // Nota: El guardado del archivo es opcional, el dataUri es suficiente para mostrar el QR
      const filename = `QR_equipo_${id}.png`;
      const fileUri = FileSystem.cacheDirectory + filename;
      
      // Intentar guardar el archivo para compartir (opcional)
      // Si falla, no es crítico ya que podemos usar el dataUri directamente
      try {
        // En expo-file-system v19, el encoding puede ser un string o un enum
        // Intentar primero con el string 'base64' que es más compatible
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: 'base64' as any,
        });
      } catch (writeError: any) {
        // No es crítico si falla el guardado, el dataUri funciona para mostrar
        console.warn('No se pudo guardar el archivo QR (no crítico):', writeError?.message || writeError);
      }

      return dataUri;
    } catch (error) {
      console.error('Error al descargar QR:', error);
      throw error;
    }
  },

  async compartirQR(id: number): Promise<void> {
    try {
      const filename = `QR_equipo_${id}.png`;
      const fileUri = FileSystem.cacheDirectory + filename;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'image/png', UTI: 'public.png' });
      } else {
        throw new Error('Compartir no está disponible en esta plataforma');
      }
    } catch (error) {
      console.error('Error al compartir QR:', error);
      throw error;
    }
  },
};

