import express from 'express';
import { getReferralStats } from '../controllers/referralController.js';
import { authenticate } from '../middleware/auth.js'; // Security middleware

const router = express.Router();

// Protect this route with JWT authentication
router.get('/referral-stats', authenticate, getReferralStats);

export default router;