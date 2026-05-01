import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  email: string;
  clinic_id: number;
  clinic_name: string;
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  is_active: boolean;
  is_trial_expired: boolean;
  booking_slug?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, clinicName: string, address: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setUser({
        id: r.data.user_id,
        email: r.data.email,
        clinic_id: r.data.clinic_id,
        clinic_name: r.data.clinic_name,
        trial_start_date: r.data.trial_start_date,
        trial_end_date: r.data.trial_end_date,
        is_active: r.data.is_active,
        is_trial_expired: r.data.is_trial_expired,
        booking_slug: r.data.booking_slug,
      }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data: tokenData } = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', tokenData.access_token);
    const { data } = await api.get('/auth/me');
    setUser({
      id: data.user_id,
      email: data.email,
      clinic_id: data.clinic_id,
      clinic_name: data.clinic_name,
      trial_start_date: data.trial_start_date,
      trial_end_date: data.trial_end_date,
      is_active: data.is_active,
      is_trial_expired: data.is_trial_expired,
      booking_slug: data.booking_slug,
    });
  };

  const register = async (email: string, password: string, clinicName: string, address: string) => {
    const { data: tokenData } = await api.post('/auth/register', { email, password, clinic_name: clinicName, address });
    localStorage.setItem('access_token', tokenData.access_token);
    const { data } = await api.get('/auth/me');
    setUser({
      id: data.user_id,
      email: data.email,
      clinic_id: data.clinic_id,
      clinic_name: data.clinic_name,
      trial_start_date: data.trial_start_date,
      trial_end_date: data.trial_end_date,
      is_active: data.is_active,
      is_trial_expired: data.is_trial_expired,
      booking_slug: data.booking_slug,
    });
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};