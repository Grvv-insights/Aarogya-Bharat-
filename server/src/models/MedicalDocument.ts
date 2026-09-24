import { Schema, model } from 'mongoose';
import { IMedicalDocument } from '../types';

const medicalDocumentSchema = new Schema<IMedicalDocument>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required']
    },
    documentType: {
      type: String,
      enum: [
        'medical_report',
        'prescription',
        'scan',
        'lab_report',
        'discharge_summary',
        'visa_letter',
        'report',
        'other'
      ],
      default: 'medical_report'
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    fileUrl: {
      type: String,
      required: [true, 'File reference is required'],
      trim: true
    },
    fileSize: {
      type: String,
      default: '1.2 MB'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ['patient_and_doctor', 'private', 'hospital_only'],
      default: 'patient_and_doctor'
    },
    status: {
      type: String,
      enum: ['verified', 'pending_review', 'archived'],
      default: 'verified'
    },
    accessInfo: {
      type: String,
      default: 'Restricted: Patient & Attending Clinical Team'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

medicalDocumentSchema.index({ patient: 1, uploadDate: -1 });

export const MedicalDocument = model<IMedicalDocument>('MedicalDocument', medicalDocumentSchema);
