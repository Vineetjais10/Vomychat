import rateLimit from 'express-rate-limit';

// Limit login/registration attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: "Too many attempts. Try again later.",
});