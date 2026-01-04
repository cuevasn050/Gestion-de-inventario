import api from './api';

export const configService = {
  async getObras(): Promise<string[]> {
    const response = await api.get<string[]>('/api/config/obras');
    return response.data;
  },

  async createObra(nombre: string): Promise<any> {
    const response = await api.post('/api/config/obras', { nombre });
    return response.data;
  },

  async deleteObra(nombre: string): Promise<void> {
    await api.delete(`/api/config/obras/${nombre}`);
  },

  async getTiposEquipos(): Promise<string[]> {
    const response = await api.get<string[]>('/api/config/tipos-equipos');
    return response.data;
  },
};

