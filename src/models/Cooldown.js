import mongoose from 'mongoose';

const cooldownSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    command: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

const Cooldown = mongoose.model('Cooldown', cooldownSchema);
export default Cooldown;
