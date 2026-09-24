import { Router } from 'express';
import { getMyTravelPlan, updateMyTravelPlan } from '../controllers/travelPlanController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/my', protect, getMyTravelPlan);
router.post('/my', protect, updateMyTravelPlan);

export default router;
