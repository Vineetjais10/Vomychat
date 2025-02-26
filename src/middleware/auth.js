import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// src/middleware/auth.js
export const authenticate = async (req, res, next) => {
  // Safely read cookies (req.cookies exists after cookie-parser is configured)
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify token and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};