import api from './api';
import { Hospital } from '../types';

export interface HospitalFilters {
  city?: string;
  specialty?: string;
  accreditation?: string;
  treatment?: string;
  verificationStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const fetchHospitals = async (filters: HospitalFilters = {}): Promise<Hospital[]> => {
  const params = new URLSearchParams();
  if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') params.append('city', filters.city);
  if (filters.specialty && filters.specialty !== 'All Specialties' && filters.specialty !== 'All') params.append('specialty', filters.specialty);
  if (filters.accreditation && filters.accreditation !== 'All') params.append('accreditation', filters.accreditation);
  if (filters.treatment && filters.treatment !== 'All') params.append('treatment', filters.treatment);
  if (filters.verificationStatus && filters.verificationStatus !== 'All') params.append('verificationStatus', filters.verificationStatus);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const res = await api.get(`/hospitals?${params.toString()}`);
  return res.data.data;
};

export const fetchHospitalById = async (idOrSlug: string): Promise<Hospital> => {
  const res = await api.get(`/hospitals/${idOrSlug}`);
  return res.data.data;
};

export const fetchHospitalBySlug = fetchHospitalById;
