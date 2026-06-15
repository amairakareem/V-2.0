import mongoose from 'mongoose';

const economySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 1000,
      min: 0,
    },
    bank: {
      type: Number,
      default: 0,
      min: 0,
    },
    inventory: [
      {
        itemId: String,
        name: String,
        quantity: Number,
        durability: Number,
        rarity: String,
      },
    ],
    dailyStreak: {
      type: Number,
      default: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    loans: [
      {
        amount: Number,
        taken: Date,
        due: Date,
        interest: Number,
      },
    ],
  },
  { timestamps: true }
);

economySchema.index({ userId: 1 });
economySchema.index({ balance: -1 });

const Economy = mongoose.model('Economy', economySchema);
export default Economy;
