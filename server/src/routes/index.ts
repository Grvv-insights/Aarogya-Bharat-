import { Router } from 'express';
import authRoutes from './authRoutes';
import hospitalRoutes from './hospitalRoutes';
import doctorRoutes from './doctorRoutes';
import treatmentRoutes from './treatmentRoutes';
import appointmentRoutes from './appointmentRoutes';
import travelPlanRoutes from './travelPlanRoutes';
import consultationRoutes from './consultationRoutes';
import adminRoutes from './adminRoutes';
import medicalDocumentRoutes from './medicalDocumentRoutes';
import costEstimatorRoutes from './costEstimatorRoutes';
import { getCities } from '../controllers/hospitalController';

const router = Router();

// Cities API
router.get('/cities', getCities);

// Resource Routes
router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/doctors', doctorRoutes);
router.use('/treatments', treatmentRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/travel-plans', travelPlanRoutes);
router.use('/consultations', consultationRoutes);
router.use('/admin', adminRoutes);
router.use('/documents', medicalDocumentRoutes);
router.use('/estimator', costEstimatorRoutes);

export default router;

