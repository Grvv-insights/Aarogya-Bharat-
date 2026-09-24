import { Router } from 'express';
import {
  createConsultation,
  getMyConsultations,
  getAllConsultations,
  updateConsultation
} from '../controllers/consultationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createConsultation);
router.get('/my', protect, getMyConsultations);

// Provider and Admin endpoints
router.get('/', protect, authorize('provider', 'admin'), getAllConsultations);
router.patch('/:id', protect, authorize('provider', 'admin'), updateConsultation);

export default router;

