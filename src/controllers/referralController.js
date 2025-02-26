import { Referral } from '../models/Referral.js';

export const getReferralStats = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referredUser', 'username email createdAt'); // Include user details

    res.json({
      total: referrals.length,
      referrals,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};