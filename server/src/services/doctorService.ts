import { Doctor } from '../models/Doctor';
import { Hospital } from '../models/Hospital';
import { IDoctor } from '../types';

export interface DoctorFilterParams {
  hospital?: string;
  hospitalId?: string;
  city?: string;
  specialty?: string;
  specialization?: string;
  experience?: string | number;
  teleconsult?: boolean;
  search?: string;
}

export const getDoctors = async (filters: DoctorFilterParams): Promise<IDoctor[]> => {
  const query: any = {};

  const targetHospital = filters.hospital || filters.hospitalId;
  if (targetHospital && targetHospital !== 'All') {
    if (targetHospital.match(/^[0-9a-fA-F]{24}$/)) {
      query.hospital = targetHospital;
    } else {
      const hosp = await Hospital.findOne({
        $or: [
          { slug: targetHospital },
          { name: { $regex: new RegExp(targetHospital, 'i') } }
        ]
      });
      if (hosp) {
        query.hospital = hosp._id;
      }
    }
  } else if (filters.city && filters.city !== 'All Cities' && filters.city !== 'All') {
    const matchingHospitals = await Hospital.find({
      city: { $regex: new RegExp(filters.city, 'i') }
    }).select('_id');
    const hospitalIds = matchingHospitals.map((h) => h._id);
    query.hospital = { $in: hospitalIds };
  }

  const targetSpecialization = filters.specialization || filters.specialty;
  if (targetSpecialization && targetSpecialization !== 'All' && targetSpecialization !== 'All Specialties') {
    query.specialization = { $regex: new RegExp(targetSpecialization, 'i') };
  }

  if (filters.experience) {
    const minExp = typeof filters.experience === 'number' ? filters.experience : parseInt(filters.experience, 10);
    if (!isNaN(minExp) && minExp > 0) {
      query.experience = { $gte: minExp };
    }
  }

  if (filters.teleconsult !== undefined) {
    query.isAvailableForTeleconsult = filters.teleconsult;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: new RegExp(filters.search, 'i') } },
      { specialization: { $regex: new RegExp(filters.search, 'i') } },
      { qualification: { $regex: new RegExp(filters.search, 'i') } }
    ];
  }

  return Doctor.find(query)
    .populate('hospital', 'name slug city address accreditation image contact rating')
    .sort({ experience: -1 });
};

export const getDoctorById = async (id: string): Promise<IDoctor | null> => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const doc = await Doctor.findById(id).populate('hospital', 'name slug city address accreditation image contact rating facilities description');
    if (doc) return doc;
  }
  return Doctor.findOne({ slug: id }).populate('hospital', 'name slug city address accreditation image contact rating facilities description');
};
