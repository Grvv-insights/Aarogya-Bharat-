import api from './api';
import { Consultation } from '../types';

export interface CreateConsultationPayload {
  hospital?: string;
  hospitalId?: string;
  doctor?: string;
  doctorId?: string;
  treatment?: string;
  treatmentId?: string;
  message: string;
  preferredDate?: string;
  documentReference?: string;
}

export const submitConsultation = async (payload: CreateConsultationPayload): Promise<Consultation> => {
  const res = await api.post('/consultations', payload);
  return res.data.data;
};

export const fetchMyConsultations = async (): Promise<Consultation[]> => {
  const res = await api.get('/consultations/my');
  return res.data.data;
};

export const fetchAllConsultations = async (): Promise<Consultation[]> => {
  const res = await api.get('/consultations');
  return res.data.data;
};

export const updateConsultationStatus = async (
  id: string,
  payload: { status?: 'pending' | 'reviewed' | 'responded' | 'closed'; response?: string }
): Promise<Consultation> => {
  const res = await api.patch(`/consultations/${id}`, payload);
  return res.data.data;
};

