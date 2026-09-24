import { Router } from 'express';
import {
  calculateCostEstimate,
  saveCostEstimate,
  getMyCostEstimates,
  deleteCostEstimate
} from '../controllers/costEstimatorController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public calculation endpoint
router.post('/calculate', calculateCostEstimate);

// Protected patient endpoints
router.post('/save', protect, saveCostEstimate);
router.get('/my', protect, getMyCostEstimates);
router.delete('/:id', protect, deleteCostEstimate);

export default router;
