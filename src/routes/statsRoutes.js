import express from 'express';
import {
    getOverview,
    getApplicationsByProgram,
    getMonthlyTrend,
    getAgeDistribution
} from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All stats routes are protected

router.get('/overview', getOverview);
router.get('/applications-by-program', getApplicationsByProgram);
router.get('/monthly-trend', getMonthlyTrend);
router.get('/age-distribution', getAgeDistribution);

export default router;
