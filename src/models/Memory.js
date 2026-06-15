import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      index: true,
    },
    groupId: {
      type: String,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    importance: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    category: {
      type: String,
      enum: ['preference', 'favorite', 'topic', 'interaction', 'note'],
      default: 'note',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    accessCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1, importance: -1 });
memorySchema.index({ groupId: 1 });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
