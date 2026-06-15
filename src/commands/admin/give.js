import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class GiveCommand {
  constructor() {
    this.name = 'give';
    this.aliases = [];
    this.description = 'Give money to user (Admin only)';
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
          text: '💰 Usage: .give <user_id> <amount>',
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
        user = await User.create({ userId: `${userId}@s.whatsapp.net` });
      }

      user.balance.wallet += amount;
      await user.save();

      const giveText = `✅ *MONEY GIVEN*

💰 Amount: ${amount.toLocaleString()} 𝑵̶
👤 To: ${userId}
💵 New Balance: ${user.balance.wallet.toLocaleString()} 𝑵̶`;

      await client.sendMessage(from, {
        text: giveText,
      });

      logger.info(`Admin gave ${amount} to ${userId}`);
    } catch (error) {
      logger.error('Error in give command:', error);
    }
  }
}

export default GiveCommand;
