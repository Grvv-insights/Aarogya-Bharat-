import { Treatment } from '../models/Treatment';
import { ITreatment } from '../types';

export interface TreatmentFilterParams {
  category?: string;
  city?: string;
  search?: string;
}

export const getTreatments = async (filters: TreatmentFilterParams): Promise<ITreatment[]> => {
  const query: any = {};

  if (filters.category && filters.category !== 'All') {
    query.category = { $regex: new RegExp(filters.category, 'i') };
  }

  if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') {
    query.popularCities = { $regex: new RegExp(filters.city, 'i') };
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: new RegExp(filters.search, 'i') } },
      { category: { $regex: new RegExp(filters.search, 'i') } },
      { description: { $regex: new RegExp(filters.search, 'i') } },
      { procedureInformation: { $regex: new RegExp(filters.search, 'i') } }
    ];
  }

  return Treatment.find(query)
    .populate('relatedHospitals', 'name slug city rating accreditation image')
    .populate('relatedDoctors', 'name specialization experience profileImage consultationFee')
    .sort({ savingsPercentage: -1 });
};

export const getTreatmentById = async (id: string): Promise<ITreatment | null> => {
  return Treatment.findById(id)
    .populate('relatedHospitals', 'name slug city rating accreditation image contact')
    .populate('relatedDoctors', 'name specialization experience profileImage consultationFee');
};

export const getTreatmentBySlug = async (slug: string): Promise<ITreatment | null> => {
  return Treatment.findOne({ slug })
    .populate('relatedHospitals', 'name slug city rating accreditation image contact')
    .populate('relatedDoctors', 'name specialization experience profileImage consultationFee');
};
