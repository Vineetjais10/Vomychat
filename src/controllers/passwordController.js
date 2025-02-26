import { User } from '../models/User.js';
import crypto from 'crypto';
import { sendResetEmail } from '../utils/email.js';
import bcrypt from "bcrypt";


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });

    // Generate token with expiration (1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await user.save(); //  Ensure this line is present

    // Send email
    await sendResetEmail(email, resetToken);
    res.json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to process request" });
  }
};

// export const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Find user with valid token and unexpired token
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() }, // Token not expired
//     });

//     if (!user) {
//       return res.status(400).json({ error: "Invalid or expired token" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.passwordHash = await bcrypt.hash(newPassword, salt);
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     await user.save();
//     res.json({ message: "Password updated" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to reset password" });
//   }
// };


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    console.log("Received token:", token);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No matching user found.");
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    console.log("User found, updating password...");

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    console.log("Saving user...");
    await user.save();

    console.log("User saved successfully.");
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
