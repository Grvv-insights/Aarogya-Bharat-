import { Schema, model } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    moderationStatus: {
      type: String,
      enum: ['published', 'pending', 'flagged'],
      default: 'published'
    },
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientCountry: {
      type: String,
      required: true,
      trim: true
    },
    treatmentName: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ hospital: 1, moderationStatus: 1, createdAt: -1 });

export const Review = model<IReview>('Review', reviewSchema);
