import api from './api';
import { Appointment } from '../types';

export interface BookAppointmentData {
  doctorId: string;
  hospitalId: string;
  treatmentId?: string;
  preferredDate: string;
  appointmentType: 'teleconsult' | 'in_person';
  notes?: string;
}

export const bookAppointment = async (data: BookAppointmentData): Promise<Appointment> => {
  const res = await api.post('/appointments', data);
  return res.data.data;
};

export const fetchMyAppointments = async (): Promise<Appointment[]> => {
  const res = await api.get('/appointments/my');
  return res.data.data;
};

export const fetchAllAppointments = async (): Promise<Appointment[]> => {
  const res = await api.get('/appointments');
  return res.data.data;
};

export const updateAppointmentStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Appointment> => {
  const res = await api.patch(`/appointments/${id}`, { status });
  return res.data.data;
};

