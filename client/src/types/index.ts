export type UserRole = 'patient' | 'provider' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  country?: string;
  profile?: {
    avatarUrl?: string;
    bio?: string;
    preferredLanguage?: string;
  };
  avatarUrl?: string;
}

export interface Hospital {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  specialties: string[];
  treatments?: any[];
  facilities?: string[];
  accreditation?: string[];
  accreditations?: ('JCI' | 'NABH' | 'NABL' | 'ISO' | string)[];
  internationalPatientServices?: string[];
  languagesSupported?: string[];
  languageSupport?: string[];
  contact?: {
    email: string;
    phone: string;
    website?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  description: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  rating: number;
  reviewCount: number;
  establishedYear: number;
  bedCount: number;
  image?: string;
  imageUrl?: string;
  bannerUrl?: string;
  gallery?: string[];
  doctors?: Doctor[];
  reviews?: Review[];
}

export interface Doctor {
  _id: string;
  hospital?: string | Hospital;
  hospitalId?: string | Hospital;
  name: string;
  slug: string;
  specialization?: string;
  specialty?: string;
  subSpecialties?: string[];
  qualification: string;
  experience?: number;
  experienceYears?: number;
  languages: string[];
  consultationFee?: {
    minUSD: number;
    maxUSD: number;
    minINR: number;
    maxINR: number;
    currency: string;
  };
  consultationFeeUSD?: number;
  consultationFeeINR?: number;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
  photoUrl?: string;
  bio: string;
  verificationStatus?: 'verified' | 'pending';
  isAvailableForTeleconsult?: boolean;
  featured?: boolean;
}

export interface Treatment {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  procedureInformation?: string;
  estimatedDuration?: string;
  estimatedCostRange?: {
    minUSD: number;
    maxUSD: number;
    minINR: number;
    maxINR: number;
    usaComparisonUSD: number;
    ukComparisonUSD: number;
    disclaimer: string;
  };
  avgCostUSD?: number;
  avgCostINR?: number;
  usaComparisonCostUSD?: number;
  ukComparisonCostUSD?: number;
  recoveryInformation?: string;
  recoveryDays?: number;
  hospitalStayDays?: number;
  savingsPercentage: number;
  successRate?: number;
  popularCities: string[];
  relatedHospitals?: (string | Hospital)[];
  relatedDoctors?: (string | Doctor)[];
  image?: string;
  suitableForTravel?: boolean;
}

export interface Appointment {
  _id: string;
  patient?: any;
  patientId?: any;
  doctor?: Doctor;
  doctorId?: Doctor;
  hospital?: Hospital;
  hospitalId?: Hospital;
  treatment?: Treatment;
  treatmentId?: Treatment;
  appointmentDate?: string;
  preferredDate?: string;
  appointmentType: 'teleconsult' | 'in_person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

export interface Consultation {
  _id: string;
  patient?: any;
  hospital?: Hospital;
  doctor?: Doctor;
  treatment?: Treatment;
  message: string;
  preferredDate?: string;
  documentReference?: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  response?: string;
  createdAt: string;
}

export interface TravelPlan {
  _id: string;
  patient?: any;
  patientId?: any;
  destinationCity: string;
  arrivalDate: string;
  departureDate?: string;
  returnDate?: string;
  flightDetails?: string;
  accommodation?: {
    type: string;
    details: string;
  };
  transport?: {
    airportPickup: boolean;
    details: string;
  };
  hospital?: Hospital;
  hospitalId?: Hospital;
  treatment?: Treatment;
  treatmentId?: Treatment;
  notes?: string;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
}

export interface Review {
  _id: string;
  patient?: any;
  hospital: string | Hospital;
  doctor?: string | Doctor;
  rating: number;
  comment: string;
  moderationStatus?: 'published' | 'pending' | 'flagged';
  patientName: string;
  patientCountry: string;
  treatmentName?: string;
  createdAt: string;
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

export interface MedicalDocument {
  _id: string;
  patient?: any;
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
  uploadDate: string;
  visibility?: 'patient_and_doctor' | 'private' | 'hospital_only';
  status: 'verified' | 'pending_review' | 'archived';
  accessInfo?: string;
  notes?: string;
  createdAt: string;
}

export interface CostRange {
  minINR: number;
  maxINR: number;
  minUSD: number;
  maxUSD: number;
}

export interface CostEstimateBreakdown {
  medicalTreatment: CostRange;
  hospitalClinical: CostRange;
  accommodation: CostRange;
  localTransportation: CostRange;
  travel: CostRange;
  otherExpenses: CostRange;
}

export interface CostEstimateTotals {
  estimatedMedicalCost: CostRange;
  estimatedTravelCost: CostRange;
  estimatedAccommodationCost: CostRange;
  estimatedTotalRange: CostRange;
}

export interface CalculatedCostEstimate {
  treatmentId?: string;
  treatmentName: string;
  city: string;
  hospitalId?: string;
  hospitalName: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
  breakdown: CostEstimateBreakdown;
  totals: CostEstimateTotals;
  disclaimer: string;
  isEstimateOnly: true;
}

export interface CostEstimate {
  _id: string;
  patient?: any;
  treatment?: Treatment | string;
  treatmentName: string;
  city: string;
  hospital?: Hospital | string;
  hospitalName: string;
  complexity: 'standard' | 'moderate' | 'high_revision';
  accommodationDuration: number;
  travelDuration: number;
  breakdown: CostEstimateBreakdown;
  totals: CostEstimateTotals;
  disclaimer: string;
  createdAt: string;
  updatedAt: string;
}

