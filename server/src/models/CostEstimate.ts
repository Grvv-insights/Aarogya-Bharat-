import { Schema, model } from 'mongoose';
import { ICostEstimate } from '../types';

const costRangeSchema = new Schema(
  {
    minINR: { type: Number, required: true },
    maxINR: { type: Number, required: true },
    minUSD: { type: Number, required: true },
    maxUSD: { type: Number, required: true }
  },
  { _id: false }
);

const costEstimateSchema = new Schema<ICostEstimate>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    treatmentName: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true
    },
    complexity: {
      type: String,
      enum: ['standard', 'moderate', 'high_revision'],
      default: 'moderate',
      required: true
    },
    accommodationDuration: {
      type: Number,
      required: true,
      default: 10
    },
    travelDuration: {
      type: Number,
      required: true,
      default: 14
    },
    breakdown: {
      medicalTreatment: { type: costRangeSchema, required: true },
      hospitalClinical: { type: costRangeSchema, required: true },
      accommodation: { type: costRangeSchema, required: true },
      localTransportation: { type: costRangeSchema, required: true },
      travel: { type: costRangeSchema, required: true },
      otherExpenses: { type: costRangeSchema, required: true }
    },
    totals: {
      estimatedMedicalCost: { type: costRangeSchema, required: true },
      estimatedTravelCost: { type: costRangeSchema, required: true },
      estimatedAccommodationCost: { type: costRangeSchema, required: true },
      estimatedTotalRange: { type: costRangeSchema, required: true }
    },
    disclaimer: {
      type: String,
      required: true,
      default:
        'These figures are illustrative estimates for planning purposes only. Actual costs vary by hospital, doctor, treatment plan, patient condition, travel dates and other factors. A final quotation must come directly from the healthcare provider.'
    }
  },
  {
    timestamps: true
  }
);

costEstimateSchema.index({ patient: 1, createdAt: -1 });

export const CostEstimate = model<ICostEstimate>('CostEstimate', costEstimateSchema);
