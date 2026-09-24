import { Router } from 'express';
import { getAdminStats, verifyHospital } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Protect all admin routes strictly for admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.patch('/hospitals/:id/verify', verifyHospital);

export default router;
