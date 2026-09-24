import { Schema, model } from 'mongoose';
import { IHospital } from '../types';

const hospitalSchema = new Schema<IHospital>(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    specialties: {
      type: [String],
      required: true,
      default: []
    },
    treatments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Treatment'
      }
    ],
    facilities: {
      type: [String],
      default: []
    },
    accreditation: {
      type: [String],
      default: ['NABH']
    },
    internationalPatientServices: {
      type: [String],
      default: [
        'Dedicated International Lounge',
        'Airport Transfers',
        'Medical Visa Assistance',
        'Multilingual Translation',
        'Foreign Currency Exchange'
      ]
    },
    languagesSupported: {
      type: [String],
      default: ['English', 'Hindi', 'Arabic']
    },
    contact: {
      email: { type: String, required: true },
      phone: { type: String, required: true },
      website: { type: String, default: '' }
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'unverified'],
      default: 'verified'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    bedCount: {
      type: Number,
      required: true
    },
    establishedYear: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    gallery: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

hospitalSchema.index({ city: 1, rating: -1 });
hospitalSchema.index({ specialties: 1 });
hospitalSchema.index({ verificationStatus: 1 });

export const Hospital = model<IHospital>('Hospital', hospitalSchema);
