import { Schema, model } from 'mongoose';
import { ITreatment } from '../types';

const treatmentSchema = new Schema<ITreatment>(
  {
    name: {
      type: String,
      required: [true, 'Treatment name is required'],
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    overview: {
      type: String,
      required: true
    },
    procedureInformation: {
      type: String,
      required: true
    },
    estimatedDuration: {
      type: String,
      required: true,
      default: '2 - 4 hours'
    },
    estimatedCostRange: {
      minUSD: { type: Number, required: true },
      maxUSD: { type: Number, required: true },
      minINR: { type: Number, required: true },
      maxINR: { type: Number, required: true },
      usaComparisonUSD: { type: Number, required: true },
      ukComparisonUSD: { type: Number, required: true },
      disclaimer: {
        type: String,
        default: 'Costs shown are realistic demo estimates for planning purposes and do not constitute guaranteed medical quotes. Final pricing depends on clinical evaluation and patient condition.'
      }
    },
    recoveryInformation: {
      type: String,
      required: true
    },
    savingsPercentage: {
      type: Number,
      required: true
    },
    successRate: {
      type: Number,
      default: 95
    },
    popularCities: {
      type: [String],
      default: ['Delhi NCR', 'Chennai', 'Mumbai', 'Bengaluru']
    },
    relatedHospitals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
      }
    ],
    relatedDoctors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
      }
    ],
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

treatmentSchema.index({ category: 1 });

export const Treatment = model<ITreatment>('Treatment', treatmentSchema);
