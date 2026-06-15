import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class TakeCommand {
  constructor() {
    this.name = 'take';
    this.aliases = [];
    this.description = 'Take money from user (Admin only)';
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

      if (!args[0] || !args[1]) {
        return await client.sendMessage(from, {
          text: '💰 Usage: .take <user_id> <amount>',
        });
      }

      const userId = args[0].replace(/[^0-9]/g, '');
      const amount = parseInt(args[1]);

      if (isNaN(amount) || amount <= 0) {
        return await client.sendMessage(from, {
          text: '❌ Invalid amount',
        });
      }

      let user = await User.findOne({ userId: `${userId}@s.whatsapp.net` });
      if (!user) {
        return await client.sendMessage(from, {
          text: '❌ User not found',
        });
      }

      user.balance.wallet = Math.max(0, user.balance.wallet - amount);
      await user.save();

      const takeText = `✅ *MONEY TAKEN*

💰 Amount: ${amount.toLocaleString()} 𝑵̶
👤 From: ${userId}
💵 New Balance: ${user.balance.wallet.toLocaleString()} 𝑵̶`;

      await client.sendMessage(from, {
        text: takeText,
      });

      logger.info(`Admin took ${amount} from ${userId}`);
    } catch (error) {
      logger.error('Error in take command:', error);
    }
  }
}

export default TakeCommand;
