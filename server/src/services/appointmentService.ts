import { Appointment } from '../models/Appointment';
import { IAppointment } from '../types';

export interface CreateAppointmentDTO {
  patient: string;
  doctor: string;
  hospital: string;
  treatment?: string;
  appointmentDate: Date;
  appointmentType: 'teleconsult' | 'in_person';
  notes?: string;
}

export const createAppointment = async (dto: CreateAppointmentDTO): Promise<IAppointment> => {
  const meetingLink =
    dto.appointmentType === 'teleconsult'
      ? `https://telehealth.medvoyage.in/room/${Math.random().toString(36).substring(2, 9)}`
      : undefined;

  return Appointment.create({
    ...dto,
    status: 'pending',
    meetingLink
  });
};

export const getAppointmentsByPatient = async (patientId: string): Promise<IAppointment[]> => {
  return Appointment.find({ patient: patientId })
    .populate('doctor', 'name specialization profileImage consultationFee')
    .populate('hospital', 'name city image address')
    .populate('treatment', 'name estimatedCostRange')
    .sort({ appointmentDate: -1 });
};

export const getAllAppointments = async (filter: Record<string, any> = {}): Promise<IAppointment[]> => {
  return Appointment.find(filter)
    .populate('patient', 'name email phone country')
    .populate('doctor', 'name specialization profileImage consultationFee')
    .populate('hospital', 'name city image address')
    .populate('treatment', 'name estimatedCostRange')
    .sort({ appointmentDate: -1 });
};

export const updateAppointmentStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<IAppointment | null> => {
  return Appointment.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  )
    .populate('patient', 'name email phone country')
    .populate('doctor', 'name specialization profileImage consultationFee')
    .populate('hospital', 'name city image address')
    .populate('treatment', 'name estimatedCostRange');
};

