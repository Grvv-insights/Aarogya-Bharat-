import api from './api';
import { Doctor } from '../types';

export interface DoctorFilters {
  hospitalId?: string;
  hospital?: string;
  city?: string;
  specialty?: string;
  specialization?: string;
  experience?: string | number;
  teleconsult?: boolean;
  search?: string;
}

export const fetchDoctors = async (filters: DoctorFilters = {}): Promise<Doctor[]> => {
  const params = new URLSearchParams();
  const targetHospital = filters.hospitalId || filters.hospital;
  if (targetHospital && targetHospital !== 'All') params.append('hospital', targetHospital);
  if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') params.append('city', filters.city);
  const targetSpecialty = filters.specialty || filters.specialization;
  if (targetSpecialty && targetSpecialty !== 'All' && targetSpecialty !== 'All Specialties') {
    params.append('specialty', targetSpecialty);
  }
  if (filters.experience && filters.experience !== 'All') params.append('experience', String(filters.experience));
  if (filters.teleconsult !== undefined) params.append('teleconsult', String(filters.teleconsult));
  if (filters.search) params.append('search', filters.search);

  const res = await api.get(`/doctors?${params.toString()}`);
  return res.data.data;
};

export const fetchDoctorById = async (idOrSlug: string): Promise<Doctor> => {
  const res = await api.get(`/doctors/${idOrSlug}`);
  return res.data.data;
};

export const fetchDoctorBySlug = fetchDoctorById;
