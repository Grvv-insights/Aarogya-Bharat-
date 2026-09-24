import { Hospital } from '../models/Hospital';
import { IHospital, CitySummary } from '../types';

export interface HospitalFilterParams {
  city?: string;
  specialty?: string;
  accreditation?: string;
  treatment?: string;
  verificationStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getHospitals = async (filters: HospitalFilterParams): Promise<IHospital[]> => {
  const query: any = {};

  if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') {
    query.city = { $regex: new RegExp(filters.city, 'i') };
  }

  if (filters.specialty && filters.specialty !== 'All Specialties' && filters.specialty !== 'All') {
    query.specialties = { $regex: new RegExp(filters.specialty, 'i') };
  }

  if (filters.accreditation && filters.accreditation !== 'All') {
    query.accreditation = { $regex: new RegExp(filters.accreditation, 'i') };
  }

  if (filters.verificationStatus && filters.verificationStatus !== 'All') {
    query.verificationStatus = filters.verificationStatus;
  }

  if (filters.treatment && filters.treatment !== 'All') {
    query.$or = [
      { specialties: { $regex: new RegExp(filters.treatment, 'i') } },
      { description: { $regex: new RegExp(filters.treatment, 'i') } }
    ];
  }

  if (filters.search) {
    const searchRegex = { $regex: new RegExp(filters.search, 'i') };
    const searchConditions = [
      { name: searchRegex },
      { city: searchRegex },
      { specialties: searchRegex }
    ];
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  let sortQuery: any = { rating: -1, reviewCount: -1 };
  if (filters.sortBy === 'rating') {
    sortQuery = { rating: filters.sortOrder === 'asc' ? 1 : -1, reviewCount: -1 };
  } else if (filters.sortBy === 'reviews' || filters.sortBy === 'reviewCount') {
    sortQuery = { reviewCount: filters.sortOrder === 'asc' ? 1 : -1 };
  } else if (filters.sortBy === 'beds' || filters.sortBy === 'bedCount') {
    sortQuery = { bedCount: filters.sortOrder === 'asc' ? 1 : -1 };
  } else if (filters.sortBy === 'establishedYear' || filters.sortBy === 'year') {
    sortQuery = { establishedYear: filters.sortOrder === 'asc' ? 1 : -1 };
  }

  return Hospital.find(query)
    .populate('treatments', 'name slug category estimatedCostRange savingsPercentage')
    .sort(sortQuery);
};

export const getHospitalById = async (id: string): Promise<IHospital | null> => {
  return Hospital.findById(id).populate('treatments', 'name slug category estimatedCostRange savingsPercentage overview');
};

export const getHospitalBySlug = async (slug: string): Promise<IHospital | null> => {
  return Hospital.findOne({ slug }).populate('treatments', 'name slug category estimatedCostRange savingsPercentage overview');
};

export const getCitiesSummary = async (): Promise<CitySummary[]> => {
  const cityData = [
    {
      name: 'Delhi NCR',
      state: 'Delhi / Haryana',
      tagline: 'Quaternary Healthcare & Advanced Robotics Hub',
      description: 'Major multi-super speciality network featuring Da Vinci Xi robotic surgery, CyberKnife technology, and comprehensive international patient departments.',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Cardiology', 'Oncology', 'Organ Transplants', 'Robotic Surgery', 'Neurosciences']
    },
    {
      name: 'Mumbai',
      state: 'Maharashtra',
      tagline: 'Tertiary Multispeciality & Specialized Surgery',
      description: 'Established healthcare center with internationally accredited private hospitals, multi-organ transplant units, and dedicated oncology centers.',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Cardiology', 'Robotic Surgery', 'Cosmetic Reconstruction', 'Oncology']
    },
    {
      name: 'Chennai',
      state: 'Tamil Nadu',
      tagline: 'Cardiac Care & Organ Transplantation Network',
      description: 'Prominent medical destination with extensive experience in high-volume cardiac bypass surgeries, joint replacements, and corneal transplants.',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Cardiology', 'Organ Transplants', 'Orthopedics', 'Ophthalmology', 'Bone Marrow']
    },
    {
      name: 'Bengaluru',
      state: 'Karnataka',
      tagline: 'Medical Innovation, IVF & Spine Surgery',
      description: 'Home to leading quaternary hospitals specializing in advanced embryology labs, pediatric heart surgery, and robotic spine treatments.',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Fertility & IVF', 'Pediatric Cardiology', 'Orthopedics & Spine', 'Neurology']
    },
    {
      name: 'Hyderabad',
      state: 'Telangana',
      tagline: 'Transplantation & Minimally Invasive Centers',
      description: 'Features high-capacity transplant intensive care units, rapid linear accelerators, and comprehensive international patient services.',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Liver Transplants', 'Orthopedics', 'Gastroenterology', 'Urology']
    },
    {
      name: 'Kolkata',
      state: 'West Bengal',
      tagline: 'Eastern Healthcare Referral Hub & Oncology Care',
      description: 'Major regional gateway connecting international travelers from neighboring South Asian and Southeast Asian countries for specialized medical care.',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      topSpecialties: ['Cardiology', 'Surgical Oncology', 'Gastroenterology', 'General Surgery']
    }
  ];

  // Dynamically count matching hospitals in DB for each city
  const summaries: CitySummary[] = [];
  for (const c of cityData) {
    const count = await Hospital.countDocuments({
      city: { $regex: new RegExp(c.name, 'i') }
    });
    summaries.push({
      ...c,
      hospitalsCount: count > 0 ? count : 1
    });
  }

  return summaries;
};
