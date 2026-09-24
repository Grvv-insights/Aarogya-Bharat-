import api from './api';
import { Treatment } from '../types';

export interface TreatmentFilters {
  category?: string;
  city?: string;
  search?: string;
}

export const fetchTreatments = async (filters: TreatmentFilters = {}): Promise<Treatment[]> => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') params.append('city', filters.city);
  if (filters.search) params.append('search', filters.search);

  const res = await api.get(`/treatments?${params.toString()}`);
  return res.data.data;
};

export const fetchTreatmentById = async (idOrSlug: string): Promise<Treatment> => {
  const res = await api.get(`/treatments/${idOrSlug}`);
  return res.data.data;
};

export const fetchTreatmentBySlug = fetchTreatmentById;
