import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

class RichCommand {
  constructor() {
    this.name = 'rich';
    this.aliases = [];
    this.description = 'Top 10 richest users';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;

      const users = await User.find()
        .sort({ 'balance.wallet': -1 })
        .limit(10);

      if (users.length === 0) {
        return await client.sendMessage(from, {
          text: '❌ No users found',
        });
      }

      let richText = '💰 *TOP 10 RICHEST USERS*\n\n';
      users.forEach((user, i) => {
        richText += `${i + 1}. ${user.profile.name}\n   💵 ${user.balance.wallet.toLocaleString()} 𝑵̶\n\n`;
      });

      await client.sendMessage(from, {
        text: richText + '© POWERED BY N£XUS',
      });

      logger.info(`Rich leaderboard viewed from ${from}`);
    } catch (error) {
      logger.error('Error in rich command:', error);
    }
  }
}

export default RichCommand;
