import api from './api';

export interface Trabajador {
  rut: string;
  nombre: string;
  obra: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export const trabajadoresService = {
  async getAll(filters?: { obra?: string; activo?: boolean }): Promise<Trabajador[]> {
    // Usar el mismo formato que el frontend web
    const params: any = {};
    if (filters?.obra) params.obra = filters.obra;
    if (filters?.activo !== undefined) params.activo = filters.activo;

    const response = await api.get<Trabajador[]>('/api/trabajadores/', { params });
    return response.data;
  },

  async getByRut(rut: string): Promise<Trabajador> {
    const response = await api.get<Trabajador>(`/api/trabajadores/${rut}`);
    return response.data;
  },

  async create(trabajador: Partial<Trabajador>): Promise<Trabajador> {
    const response = await api.post<Trabajador>('/api/trabajadores/', trabajador);
    return response.data;
  },

  async update(rut: string, trabajador: Partial<Trabajador>): Promise<Trabajador> {
    const response = await api.put<Trabajador>(`/api/trabajadores/${rut}`, trabajador);
    return response.data;
  },

  async marcarDespido(rut: string): Promise<void> {
    await api.put(`/api/trabajadores/${rut}/despido`);
  },
};

