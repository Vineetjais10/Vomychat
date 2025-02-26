import express from 'express';
import { register, login } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';
import { getReferralStats } from '../controllers/referralController.js';
import { authenticate } from '../middleware/auth.js';
import {logout } from '../controllers/authController.js';
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticate, logout);
// Protected routes
router.get('/referral-stats', authenticate, getReferralStats);

export default router;