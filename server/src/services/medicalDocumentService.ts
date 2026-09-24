import { MedicalDocument } from '../models/MedicalDocument';
import { IMedicalDocument } from '../types';

export interface CreateDocumentDTO {
  documentType:
    | 'medical_report'
    | 'prescription'
    | 'scan'
    | 'lab_report'
    | 'discharge_summary'
    | 'visa_letter'
    | 'other';
  fileName: string;
  fileSize?: string;
  notes?: string;
  visibility?: 'patient_and_doctor' | 'private' | 'hospital_only';
}

export const getDocumentsByPatient = async (patientId: string): Promise<IMedicalDocument[]> => {
  return MedicalDocument.find({ patient: patientId }).sort({ uploadDate: -1 });
};

export const createDocument = async (
  patientId: string,
  dto: CreateDocumentDTO
): Promise<IMedicalDocument> => {
  // Generate simulated secure encrypted storage reference
  const randomRef = Math.random().toString(36).substring(2, 10);
  const secureFileUrl = `secure_vault://enc_patient_${patientId.substring(0, 6)}/${dto.documentType}_${randomRef}.pdf`;

  return MedicalDocument.create({
    patient: patientId,
    documentType: dto.documentType || 'medical_report',
    fileName: dto.fileName,
    fileUrl: secureFileUrl,
    fileSize: dto.fileSize || '1.8 MB',
    uploadDate: new Date(),
    visibility: dto.visibility || 'patient_and_doctor',
    status: 'verified',
    accessInfo: 'Restricted: Patient & Attending Clinical Team (AES-256 Mock Encrypted)',
    notes: dto.notes || ''
  });
};

export const deleteDocument = async (
  patientId: string,
  docId: string
): Promise<IMedicalDocument | null> => {
  return MedicalDocument.findOneAndDelete({ _id: docId, patient: patientId });
};
