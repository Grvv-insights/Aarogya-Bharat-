import { Schema, model } from 'mongoose';
import { IAppointment } from '../types';

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required']
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required']
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital reference is required']
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    appointmentType: {
      type: String,
      enum: ['teleconsult', 'in_person'],
      default: 'teleconsult'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    meetingLink: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ hospital: 1 });

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
