import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// Verify JWT token (optional, if needed elsewhere)
export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};