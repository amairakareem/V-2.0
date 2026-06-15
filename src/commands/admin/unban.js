import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class UnbanCommand {
  constructor() {
    this.name = 'unban';
    this.aliases = [];
    this.description = 'Unban a user (Admin only)';
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
          text: '🚫 Usage: .unban <user_id>',
        });
      }

      const userId = args[0].replace(/[^0-9]/g, '');

      let user = await User.findOne({ userId: `${userId}@s.whatsapp.net` });
      if (!user) {
        return await client.sendMessage(from, {
          text: '❌ User not found',
        });
      }

      user.banned = false;
      await user.save();

      const unbanText = `✅ *USER UNBANNED*

👤 User: ${userId}`;

      await client.sendMessage(from, {
        text: unbanText,
      });

      logger.info(`User ${userId} unbanned`);
    } catch (error) {
      logger.error('Error in unban command:', error);
    }
  }
}

export default UnbanCommand;
