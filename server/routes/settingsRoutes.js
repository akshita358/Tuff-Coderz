import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { updateSettings } from '../controllers/settingsController.js';

const router = Router();
router.put('/', requireAuth, updateSettings);

export default router;
