import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models/User';
import { Hospital } from '../models/Hospital';
import { Doctor } from '../models/Doctor';
import { Consultation } from '../models/Consultation';
import { Appointment } from '../models/Appointment';

export const getAdminStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalPatients,
      totalProviders,
      totalHospitals,
      totalDoctors,
      totalConsultations,
      totalAppointments,
      pendingVerifications,
      recentUsers,
      hospitals
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'provider' }),
      Hospital.countDocuments(),
      Doctor.countDocuments(),
      Consultation.countDocuments(),
      Appointment.countDocuments(),
      Hospital.countDocuments({ verificationStatus: { $in: ['pending', 'unverified'] } }),
      User.find().select('name email role country createdAt').sort({ createdAt: -1 }).limit(15),
      Hospital.find().select('name city state accreditation verificationStatus rating reviewCount bedCount').sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPatients,
          totalProviders,
          totalHospitals,
          totalDoctors,
          totalConsultations,
          totalAppointments,
          pendingVerifications
        },
        recentUsers,
        hospitals
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyHospital = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let { verificationStatus } = req.body;

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      res.status(404).json({ success: false, message: 'Hospital not found' });
      return;
    }

    if (!verificationStatus) {
      verificationStatus = hospital.verificationStatus === 'verified' ? 'pending' : 'verified';
    }

    hospital.verificationStatus = verificationStatus;
    await hospital.save();

    res.status(200).json({
      success: true,
      message: `Hospital status updated to ${verificationStatus}`,
      data: hospital
    });
  } catch (error) {
    next(error);
  }
};
