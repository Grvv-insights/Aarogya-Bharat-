import { Request } from 'express';
import { Types } from 'mongoose';

export type UserRole = 'patient' | 'provider' | 'admin';
export type VerificationStatus = 'verified' | 'pending' | 'unverified';
export type ModerationStatus = 'published' | 'pending' | 'flagged';
export type DocumentVisibility = 'patient_and_doctor' | 'private' | 'hospital_only';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationStatus = 'pending' | 'reviewed' | 'responded' | 'closed';
export type TravelPlanStatus = 'planning' | 'confirmed' | 'in_progress' | 'completed';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  country?: string;
  profile?: {
    avatarUrl?: string;
    bio?: string;
    preferredLanguage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IHospital {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string;
  specialties: string[];
  treatments: Types.ObjectId[];
  facilities: string[];
  accreditation: string[];
  internationalPatientServices: string[];
  languagesSupported: string[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  bedCount: number;
  establishedYear: number;
  image: string;
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctor {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  hospital: Types.ObjectId;
  specialization: string;
  qualification: string;
  experience: number; // in years
  languages: string[];
  bio: string;
  consultationFee: {
    minUSD: number;
    maxUSD: number;
    minINR: number;
    maxINR: number;
    currency: string;
  };
  profileImage: string;
  verificationStatus: VerificationStatus;
  isAvailableForTeleconsult: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITreatment {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  procedureInformation: string;
  estimatedDuration: string;
  estimatedCostRange: {
    minUSD: number;
    maxUSD: number;
    minINR: number;
    maxINR: number;
    usaComparisonUSD: number;
    ukComparisonUSD: number;
    disclaimer: string;
  };
  recoveryInformation: string;
  savingsPercentage: number;
  successRate: number;
  popularCities: string[];
  relatedHospitals: Types.ObjectId[];
  relatedDoctors: Types.ObjectId[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointment {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  hospital: Types.ObjectId;
  treatment?: Types.ObjectId;
  appointmentDate: Date;
  appointmentType: 'teleconsult' | 'in_person';
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConsultation {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  hospital: Types.ObjectId;
  doctor?: Types.ObjectId;
  treatment?: Types.ObjectId;
  message: string;
  preferredDate?: Date;
  documentReference?: string;
  status: ConsultationStatus;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicalDocument {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  documentType:
    | 'medical_report'
    | 'prescription'
    | 'scan'
    | 'lab_report'
    | 'discharge_summary'
    | 'visa_letter'
    | 'report'
    | 'other';
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  uploadDate: Date;
  visibility: DocumentVisibility;
  status: 'verified' | 'pending_review' | 'archived';
  accessInfo: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  hospital: Types.ObjectId;
  doctor?: Types.ObjectId;
  rating: number;
  comment: string;
  moderationStatus: ModerationStatus;
  patientName: string;
  patientCountry: string;
  treatmentName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITravelPlan {
  _id: Types.ObjectId;
  patient: Types.ObjectId;
  destinationCity: string;
  arrivalDate: Date;
  departureDate: Date;
  accommodation: {
    type: 'hotel_3star' | 'hotel_4star' | 'hotel_5star' | 'serviced_apartment' | 'hospital_guest_house';
    details: string;
  };
  transport: {
    airportPickup: boolean;
    details: string;
  };
  hospital?: Types.ObjectId;
  treatment?: Types.ObjectId;
  notes?: string;
  status: TravelPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CitySummary {
  name: string;
  state: string;
  tagline: string;
  description: string;
  image: string;
  hospitalsCount: number;
  topSpecialties: string[];
}

export interface CostRange {
  minINR: number;
  maxINR: number;
  minUSD: number;
  maxUSD: number;
}

export interface ICostEstimateBreakdown {
  medicalTreatment: CostRange;
  hospitalClinical: CostRange;
  accommodation: CostRange;
  localTransportation: CostRange;
  travel: CostRange;
  otherExpenses: CostRange;
}

export interface ICostEstimateTotals {
  estimatedMedicalCost: CostRange;
  estimatedTravelCost: CostRange;
  estimatedAccommodationCost: CostRange;
  estimatedTotalRange: CostRange;
}

export interface ICostEstimate {
  _id: Types.ObjectId;
  patient?: Types.ObjectId;
  treatment?: Types.ObjectId;
  treatmentName: string;
  city: string;
  hospital?: Types.ObjectId;
  hospitalName: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
  breakdown: ICostEstimateBreakdown;
  totals: ICostEstimateTotals;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}
