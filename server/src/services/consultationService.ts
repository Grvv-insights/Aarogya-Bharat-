import { Consultation } from '../models/Consultation';
import { IConsultation } from '../types';

export interface CreateConsultationDTO {
  patient: string;
  hospital: string;
  doctor?: string;
  treatment?: string;
  message: string;
  preferredDate?: Date;
  documentReference?: string;
}

export const createConsultation = async (dto: CreateConsultationDTO): Promise<IConsultation> => {
  const consultation = await Consultation.create({
    ...dto,
    status: 'pending'
  });

  return (await Consultation.findById(consultation._id)
    .populate('hospital', 'name slug city image contact')
    .populate('doctor', 'name specialization profileImage')
    .populate('treatment', 'name category')) as IConsultation;
};

export const getConsultationsByPatient = async (patientId: string): Promise<IConsultation[]> => {
  return Consultation.find({ patient: patientId })
    .populate('hospital', 'name slug city image contact')
    .populate('doctor', 'name specialization profileImage')
    .populate('treatment', 'name category')
    .sort({ createdAt: -1 });
};

export const getAllConsultations = async (filter: Record<string, any> = {}): Promise<IConsultation[]> => {
  return Consultation.find(filter)
    .populate('patient', 'name email country phone')
    .populate('hospital', 'name slug city image contact')
    .populate('doctor', 'name specialization profileImage')
    .populate('treatment', 'name category')
    .sort({ createdAt: -1 });
};

export const updateConsultation = async (
  id: string,
  updates: { status?: 'pending' | 'reviewed' | 'responded' | 'closed'; response?: string }
): Promise<IConsultation | null> => {
  return Consultation.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate('patient', 'name email country phone')
    .populate('hospital', 'name slug city image contact')
    .populate('doctor', 'name specialization profileImage')
    .populate('treatment', 'name category');
};

