import { Router } from 'express';
import { getAllHospitals, getHospital } from '../controllers/hospitalController';

const router = Router();

router.get('/', getAllHospitals);
router.get('/:id', getHospital);

export default router;
