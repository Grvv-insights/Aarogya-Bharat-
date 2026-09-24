import { Request, Response, NextFunction } from 'express';
import * as hospitalService from '../services/hospitalService';
import { Doctor } from '../models/Doctor';
import { Review } from '../models/Review';

export const getAllHospitals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { city, specialty, accreditation, treatment, verificationStatus, search, sortBy, sortOrder } = req.query;
    const hospitals = await hospitalService.getHospitals({
      city: city as string,
      specialty: specialty as string,
      accreditation: accreditation as string,
      treatment: treatment as string,
      verificationStatus: verificationStatus as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
    });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    next(error);
  }
};

export const getHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let hospital = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      hospital = await hospitalService.getHospitalById(id);
    }
    if (!hospital) {
      hospital = await hospitalService.getHospitalBySlug(id);
    }

    if (!hospital) {
      res.status(404).json({ success: false, message: 'Hospital not found' });
      return;
    }

    // Also fetch associated doctors and published reviews
    const [doctors, reviews] = await Promise.all([
      Doctor.find({ hospital: hospital._id }),
      Review.find({ hospital: hospital._id, moderationStatus: 'published' }).sort({ createdAt: -1 })
    ]);

    const hospitalObj = (hospital as any).toObject ? (hospital as any).toObject() : hospital;

    res.status(200).json({
      success: true,
      data: {
        ...hospitalObj,
        doctors,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCities = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cities = await hospitalService.getCitiesSummary();
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};
