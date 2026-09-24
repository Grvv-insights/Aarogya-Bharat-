import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role?: UserRole; phone?: string; country?: string }) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (role: 'patient' | 'provider' | 'admin') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch (err) {
          console.warn('Stored token invalid or expired. Logging out.');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password: pass });
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    country?: string;
  }): Promise<User> => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role: 'patient' | 'provider' | 'admin'): Promise<User> => {
    const credentials = {
      patient: { email: 'patient@example.com', pass: 'Password123!' },
      provider: { email: 'provider@apollo.com', pass: 'Password123!' },
      admin: { email: 'admin@medvoyage.in', pass: 'Password123!' }
    };
    const { email, pass } = credentials[role];
    return login(email, pass);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
