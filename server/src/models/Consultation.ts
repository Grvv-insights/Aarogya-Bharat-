import { Schema, model } from 'mongoose';
import { IConsultation } from '../types';

const consultationSchema = new Schema<IConsultation>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required']
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital reference is required']
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    message: {
      type: String,
      required: [true, 'Consultation message is required']
    },
    preferredDate: {
      type: Date
    },
    documentReference: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded', 'closed'],
      default: 'pending'
    },
    response: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

consultationSchema.index({ patient: 1, createdAt: -1 });
consultationSchema.index({ hospital: 1, status: 1 });

export const Consultation = model<IConsultation>('Consultation', consultationSchema);
