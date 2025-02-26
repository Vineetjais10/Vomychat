import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Use port 587 for TLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password, NOT your Gmail password
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL validation (for testing only)
  },
});

export const sendResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent to:', email);
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send reset email');
  }
};