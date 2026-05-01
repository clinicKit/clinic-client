import api from './axios';

export interface Doctor {
  id: number;
  clinic_id: number;
  name: string;
  specialty: string | null;
}

export const getDoctors = () =>
  api.get<Doctor[]>('/doctors').then(r => r.data);

export const createDoctor = (data: { name: string; specialty?: string }) =>
  api.post<Doctor>('/doctors', data).then(r => r.data);

export const updateDoctor = (id: number, data: { name?: string; specialty?: string }) =>
  api.put<Doctor>(`/doctors/${id}`, data).then(r => r.data);

export const deleteDoctor = (id: number) =>
  api.delete(`/doctors/${id}`);
