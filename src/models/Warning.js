import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    groupId: {
      type: String,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    warnedBy: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

warningSchema.index({ userId: 1, groupId: 1 });

const Warning = mongoose.model('Warning', warningSchema);
export default Warning;
