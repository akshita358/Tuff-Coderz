import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { attend } from '../controllers/eventsController.js';

const router = Router();
router.post('/attend', requireAuth, attend);

export default router;
