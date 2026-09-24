import { Response, NextFunction } from 'express';
import * as consultationService from '../services/consultationService';
import { AuthRequest } from '../types';

import { Doctor } from '../models/Doctor';
import { Treatment } from '../models/Treatment';
import { Hospital } from '../models/Hospital';

export const createConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const {
      hospital,
      hospitalId,
      doctor,
      doctorId,
      treatment,
      treatmentId,
      message,
      preferredDate,
      documentReference
    } = req.body;

    let targetHospital = hospital || hospitalId;
    const targetDoctor = doctor || doctorId;
    const targetTreatment = treatment || treatmentId;

    // Auto-resolve hospital from doctor if not explicitly supplied
    if (!targetHospital && targetDoctor) {
      const doc = await Doctor.findById(targetDoctor);
      if (doc && doc.hospital) {
        targetHospital = doc.hospital.toString();
      }
    }

    // Auto-resolve hospital from treatment if not explicitly supplied
    if (!targetHospital && targetTreatment) {
      const trt = await Treatment.findById(targetTreatment);
      if (trt && trt.relatedHospitals && trt.relatedHospitals.length > 0) {
        targetHospital = trt.relatedHospitals[0].toString();
      }
    }

    // Fallback to first verified hospital if none specified
    if (!targetHospital) {
      const defaultHosp = await Hospital.findOne({});
      if (defaultHosp) {
        targetHospital = defaultHosp._id.toString();
      }
    }

    if (!targetHospital || !message) {
      res.status(400).json({
        success: false,
        message: 'Inquiry message and hospital selection are required'
      });
      return;
    }

    const consultation = await consultationService.createConsultation({
      patient: patientId,
      hospital: targetHospital,
      doctor: targetDoctor,
      treatment: targetTreatment,
      message,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      documentReference: documentReference || ''
    });

    res.status(201).json({
      success: true,
      message: 'Your consultation request has been submitted.',
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

export const getMyConsultations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const consultations = await consultationService.getConsultationsByPatient(patientId);

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    next(error);
  }
};

export const getAllConsultations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const consultations = await consultationService.getAllConsultations();

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    next(error);
  }
};

export const updateConsultation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const updated = await consultationService.updateConsultation(id, {
      status,
      response
    });

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Consultation request updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

