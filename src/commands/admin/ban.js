import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class BanCommand {
  constructor() {
    this.name = 'ban';
    this.aliases = [];
    this.description = 'Ban a user (Admin only)';
    this.category = 'admin';
    this.ownerOnly = true;
  }

  async execute(message, args, client) {
    try {
      const sender = message.key.participant || message.key.remoteJid;
      const from = message.key.remoteJid;
      const ownerNumber = process.env.OWNER_NUMBER || '254108720384';

      if (!sender.startsWith(ownerNumber)) {
        return await client.sendMessage(from, {
          text: '❌ This command is owner only',
        });
      }

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '🚫 Usage: .ban <user_id> [reason]',
        });
      }

      const userId = args[0].replace(/[^0-9]/g, '');
      const reason = args.slice(1).join(' ') || 'No reason provided';

      let user = await User.findOne({ userId: `${userId}@s.whatsapp.net` });
      if (!user) {
        user = await User.create({ userId: `${userId}@s.whatsapp.net` });
      }

      user.banned = true;
      await user.save();

      const banText = `🚫 *USER BANNED*

👤 User: ${userId}
📝 Reason: ${reason}`;

      await client.sendMessage(from, {
        text: banText,
      });

      logger.info(`User ${userId} banned for: ${reason}`);
    } catch (error) {
      logger.error('Error in ban command:', error);
    }
  }
}

export default BanCommand;
