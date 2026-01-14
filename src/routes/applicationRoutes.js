import express from 'express';
import {
    submitApplication,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    exportApplications
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { applicationSchema } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.post('/public', validate(applicationSchema), submitApplication);

// Protected routes
router.get('/protected', protect, getApplications);
router.get('/export', protect, exportApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, updateApplicationStatus);

export default router;
