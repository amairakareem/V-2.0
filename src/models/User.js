import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      default: 'User',
    },
    balance: {
      wallet: {
        type: Number,
        default: 1000,
        min: 0,
      },
      bank: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    stats: {
      level: {
        type: Number,
        default: 1,
        min: 1,
      },
      xp: {
        type: Number,
        default: 0,
        min: 0,
      },
      reputation: {
        type: Number,
        default: 0,
      },
      totalCommands: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    profile: {
      bio: {
        type: String,
        default: 'No bio set',
        maxlength: 100,
      },
      age: {
        type: Number,
        default: null,
      },
      name: {
        type: String,
        default: 'User',
      },
    },
    lastDaily: {
      type: Date,
      default: null,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    warnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ userId: 1 });
userSchema.index({ 'balance.wallet': -1 });
userSchema.index({ 'stats.level': -1 });

const User = mongoose.model('User', userSchema);
export default User;
