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
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(409).json({ error: "Email/username exists" });

    // Save plaintext password (pre-save hook will hash it)
    const user = new User({ email, username, passwordHash: password });
    await user.save();

    const token = generateJWT(user._id);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login controller
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: "Missing email/username or password" });
  }

  try {
    console.log("Received login request for:", emailOrUsername);

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      console.log("User not found.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found:", user.username);

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch) {
      console.log("Password does not match.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateJWT(user._id);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Add this to your existing authController.js
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Match cookie settings
    sameSite: 'Lax'
  });
  res.status(200).json({ message: "Logged out successfully" });
};
