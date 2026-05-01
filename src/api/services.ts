import api from './axios';

export interface Service {
  id: number;
  clinic_id: number;
  name: string;
  duration_minutes: number;
  color: string;
}

export const getServices = () =>
  api.get<Service[]>('/services').then(r => r.data);

export const createService = (data: { name: string; duration_minutes?: number; color?: string }) =>
  api.post<Service>('/services', data).then(r => r.data);

export const updateService = (id: number, data: { name?: string; duration_minutes?: number; color?: string }) =>
  api.put<Service>(`/services/${id}`, data).then(r => r.data);

export const deleteService = (id: number) =>
  api.delete(`/services/${id}`);
