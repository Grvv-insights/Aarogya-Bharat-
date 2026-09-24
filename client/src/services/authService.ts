import api from './api';
import { User, UserRole } from '../types';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  country?: string;
}): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get('/auth/me');
  return res.data.user;
};
