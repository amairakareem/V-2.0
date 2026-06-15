import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    groupId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    members: {
      type: [String],
      default: [],
    },
    admins: {
      type: [String],
      default: [],
    },
    botAdmin: {
      type: Boolean,
      default: false,
    },
    settings: {
      antiLink: {
        type: Boolean,
        default: false,
      },
      antiSpam: {
        type: Boolean,
        default: false,
      },
      autoDelete: {
        type: Boolean,
        default: false,
      },
      nsfw: {
        type: Boolean,
        default: false,
      },
    },
    welcome: {
      enabled: {
        type: Boolean,
        default: true,
      },
      message: {
        type: String,
        default: 'Welcome to the group!',
      },
    },
    leave: {
      enabled: {
        type: Boolean,
        default: true,
      },
      message: {
        type: String,
        default: 'Goodbye!',
      },
    },
    stats: {
      messageCount: {
        type: Number,
        default: 0,
      },
      memberCount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

groupSchema.index({ groupId: 1 });
groupSchema.index({ members: 1 });

const Group = mongoose.model('Group', groupSchema);
export default Group;
