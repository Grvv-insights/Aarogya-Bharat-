import { Schema, model } from 'mongoose';
import { ITravelPlan } from '../types';

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required']
    },
    destinationCity: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true
    },
    arrivalDate: {
      type: Date,
      required: [true, 'Arrival date is required']
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required']
    },
    accommodation: {
      type: {
        type: String,
        enum: ['hotel_3star', 'hotel_4star', 'hotel_5star', 'serviced_apartment', 'hospital_guest_house'],
        default: 'hotel_4star'
      },
      details: {
        type: String,
        default: 'Executive double suite with 24/7 room service & wheelchair accessibility'
      }
    },
    transport: {
      airportPickup: {
        type: Boolean,
        default: true
      },
      details: {
        type: String,
        default: 'Chauffeur airport transfer directly to hospital guest suite'
      }
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'in_progress', 'completed'],
      default: 'planning'
    }
  },
  {
    timestamps: true
  }
);

travelPlanSchema.index({ patient: 1 });

export const TravelPlan = model<ITravelPlan>('TravelPlan', travelPlanSchema);
