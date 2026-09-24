import api from './api';
import { MedicalDocument } from '../types';

export interface UploadDocumentPayload {
  fileName: string;
  documentType:
    | 'medical_report'
    | 'prescription'
    | 'scan'
    | 'lab_report'
    | 'discharge_summary'
    | 'visa_letter'
    | 'other';
  fileSize?: string;
  notes?: string;
  visibility?: 'patient_and_doctor' | 'private' | 'hospital_only';
}

export const fetchMyDocuments = async (): Promise<MedicalDocument[]> => {
  const res = await api.get('/documents/my');
  return res.data.data;
};

export const uploadMockDocument = async (payload: UploadDocumentPayload): Promise<MedicalDocument> => {
  const res = await api.post('/documents/my', payload);
  return res.data.data;
};

export const deleteMyDocument = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};
