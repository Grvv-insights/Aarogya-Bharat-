import { Router } from 'express';
import { getAllDoctors, getDoctor } from '../controllers/doctorController';

const router = Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctor);

export default router;
