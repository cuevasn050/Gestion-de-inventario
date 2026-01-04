import api from './api';

export interface PrestamoCreate {
  equipo_id: number;
  trabajador_rut: string;
  obra: string;
  estado_entrega_bueno: boolean;
  estado_entrega_con_cargador: boolean;
  observaciones_entrega?: string;
}

export interface PrestamoDevolver {
  estado_devolucion_bueno: boolean;
  estado_devolucion_con_cargador: boolean;
  observaciones_devolucion?: string;
}

export const prestamosService = {
  async create(prestamo: PrestamoCreate): Promise<any> {
    const response = await api.post('/api/prestamos/', prestamo);
    return response.data;
  },

  async devolver(prestamoId: number, data: PrestamoDevolver): Promise<any> {
    const response = await api.put(`/api/prestamos/${prestamoId}/devolver`, data);
    return response.data;
  },

  async getByRut(rut: string): Promise<any[]> {
    const response = await api.get(`/api/prestamos/rut/${rut}`);
    return response.data;
  },

  async getAlertasTrabajador(rut: string): Promise<any[]> {
    const response = await api.get(`/api/prestamos/trabajador/${rut}/alertas`);
    return response.data;
  },

  async marcarCargadorDevuelto(prestamoId: number): Promise<void> {
    await api.put(`/api/prestamos/${prestamoId}/marcar-cargador-devuelto`);
  },

  async delete(prestamoId: number): Promise<void> {
    await api.delete(`/api/prestamos/${prestamoId}`);
  },

  async getAll(filters?: { estado?: string }): Promise<any[]> {
    const params: any = {};
    if (filters?.estado) params.estado = filters.estado;

    const response = await api.get('/api/prestamos/', { params });
    return response.data;
  },
};

