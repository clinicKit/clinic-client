import api from './axios';

export interface Appointment {
  id: number;
  clinic_id: number;
  patient_id: number;
  doctor_id: number;
  service_id: number;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'no_show';
  notes: string | null;
  created_at: string;
  // Extended fields from backend JOIN
  patient_name?: string | null;
  doctor_name?: string | null;
  service_name?: string | null;
  service_color?: string | null;
}

export const getAppointments = (start: string, end: string) =>
  api.get<Appointment[]>('/appointments', { params: { start, end } }).then(r => r.data);

export const createAppointment = (data: Omit<Appointment, 'id' | 'status'>) =>
  api.post<Appointment>('/appointments', data).then(r => r.data);

export const updateAppointment = (id: number, data: Partial<Appointment>) =>
  api.put<Appointment>(`/appointments/${id}`, data).then(r => r.data);

export const deleteAppointment = (id: number) =>
  api.delete(`/appointments/${id}`);

export const updateStatus = (id: number, status: string) =>
  api.patch(`/appointments/${id}/status`, { status }).then(r => r.data);