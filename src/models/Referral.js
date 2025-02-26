import mongoose from 'mongoose';
const referralSchema = new mongoose.Schema({
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'successful'],
      default: 'pending',
    },
  }, { timestamps: true });
  
  export const Referral = mongoose.model('Referral', referralSchema);