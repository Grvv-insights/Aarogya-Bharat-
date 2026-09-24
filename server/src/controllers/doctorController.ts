import { Request, Response, NextFunction } from 'express';
import * as doctorService from '../services/doctorService';

export const getAllDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { hospital, hospitalId, city, specialty, specialization, experience, teleconsult, search } = req.query;
    const doctors = await doctorService.getDoctors({
      hospital: (hospital || hospitalId) as string,
      city: city as string,
      specialization: (specialization || specialty) as string,
      experience: experience as string,
      teleconsult: teleconsult ? teleconsult === 'true' : undefined,
      search: search as string
    });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);

    if (!doctor) {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};
