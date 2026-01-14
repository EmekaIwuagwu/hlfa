import express from 'express';
import { login, refresh, logout, getSession } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/session', protect, getSession);

export default router;
