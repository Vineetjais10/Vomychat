import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// Register controller
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email/username already exists" });
    }

    // Hash password (this will trigger the pre-save hook)
    const user = new User({
      email,
      username,
      passwordHash: password, // Will be hashed automatically
    });

    await user.save();
    console.log('User saved:', user); 

    // Generate JWT token
    const token = generateJWT(user._id);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login controller
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Find user by email/username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // Validate credentials
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Send JWT token
    const token = generateJWT(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};