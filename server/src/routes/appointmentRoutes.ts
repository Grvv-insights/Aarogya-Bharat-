import { Router } from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment
} from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);

// Provider and Admin endpoints
router.get('/', protect, authorize('provider', 'admin'), getAllAppointments);
router.patch('/:id', protect, authorize('provider', 'admin'), updateAppointment);

export default router;

