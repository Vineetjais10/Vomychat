const rewardSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['credit', 'premium'],
      default: 'credit',
    },
  }, { timestamps: true });
  
  export const Reward = mongoose.model('Reward', rewardSchema);