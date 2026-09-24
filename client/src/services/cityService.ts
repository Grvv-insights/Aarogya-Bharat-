import api from './api';
import { CitySummary } from '../types';

export const fetchCities = async (): Promise<CitySummary[]> => {
  const res = await api.get('/cities');
  return res.data.data;
};
