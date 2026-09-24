import { Schema, model } from 'mongoose';
import { IDoctor } from '../types';

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital reference is required']
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: 0
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi']
    },
    bio: {
      type: String,
      required: true
    },
    consultationFee: {
      minUSD: { type: Number, default: 40 },
      maxUSD: { type: Number, default: 80 },
      minINR: { type: Number, default: 3000 },
      maxINR: { type: Number, default: 6500 },
      currency: { type: String, default: 'USD' }
    },
    profileImage: {
      type: String,
      required: true
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending'],
      default: 'verified'
    },
    isAvailableForTeleconsult: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.index({ hospital: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ verificationStatus: 1 });

export const Doctor = model<IDoctor>('Doctor', doctorSchema);
