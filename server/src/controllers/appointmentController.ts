import { Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointmentService';
import { AuthRequest } from '../types';

export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const { doctor, doctorId, hospital, hospitalId, treatment, treatmentId, appointmentDate, preferredDate, appointmentType, notes } = req.body;

    const targetDoctor = doctor || doctorId;
    const targetHospital = hospital || hospitalId;
    const targetDate = appointmentDate || preferredDate;

    if (!targetDoctor || !targetHospital || !targetDate) {
      res.status(400).json({
        success: false,
        message: 'Doctor, Hospital, and Appointment Date are required'
      });
      return;
    }

    const appointment = await appointmentService.createAppointment({
      patient: patientId,
      doctor: targetDoctor,
      hospital: targetHospital,
      treatment: treatment || treatmentId,
      appointmentDate: new Date(targetDate),
      appointmentType: appointmentType || 'teleconsult',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Appointment requested successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patientId = req.user!._id.toString();
    const appointments = await appointmentService.getAppointmentsByPatient(patientId);

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointments = await appointmentService.getAllAppointments();

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await appointmentService.updateAppointmentStatus(id, status);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

