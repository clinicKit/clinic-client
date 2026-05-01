import api from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  clinicName: string;
  address: string;
}

export interface User {
  id: number;
  email: string;
  clinic_id: number;
  clinic_name: string;
}

export const login = (data: LoginRequest) =>
  api.post<User>('/auth/login', data).then(r => r.data);

export const register = (data: RegisterRequest) =>
  api.post<User>('/auth/register', data).then(r => r.data);

export const logout = () =>
  api.post('/auth/logout');

export const getCurrentUser = () =>
  api.get<User>('/auth/me').then(r => r.data);
