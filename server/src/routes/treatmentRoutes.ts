import { Router } from 'express';
import { getAllTreatments, getTreatment } from '../controllers/treatmentController';

const router = Router();

router.get('/', getAllTreatments);
router.get('/:id', getTreatment);

export default router;
