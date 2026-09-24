import { Router } from 'express';
import {
  getMyDocuments,
  uploadMockDocument,
  deleteMyDocument
} from '../controllers/medicalDocumentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Strictly protect all medical document endpoints
router.use(protect);

router.get('/my', getMyDocuments);
router.post('/my', uploadMockDocument);
router.delete('/:id', deleteMyDocument);

export default router;
