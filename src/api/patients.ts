import api from './axios';

export interface Patient {
  id: number;
  clinic_id: number;
  phone: string;
  first_name: string;
  last_name: string | null;
  consent_given: boolean;
}

export const getPatients = () =>
  api.get<Patient[]>('/patients').then(r => r.data);

export const createPatient = (data: { phone: string; first_name: string; last_name?: string; consent_given?: boolean }) =>
  api.post<Patient>('/patients', data).then(r => r.data);

export const updatePatient = (id: number, data: { phone?: string; first_name?: string; last_name?: string; consent_given?: boolean }) =>
  api.put<Patient>(`/patients/${id}`, data).then(r => r.data);

export const deletePatient = (id: number) =>
  api.delete(`/patients/${id}`);
