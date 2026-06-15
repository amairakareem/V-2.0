import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Group from '../../models/Group.js';
import Transaction from '../../models/Transaction.js';

class StatsCommand {
  constructor() {
    this.name = 'stats';
    this.aliases = [];
    this.description = 'Display bot statistics';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;

      const userCount = await User.countDocuments();
      const groupCount = await Group.countDocuments();
      const transactionCount = await Transaction.countDocuments();
      const totalBalance = await User.aggregate([
        {
          $group: {
            _id: null,
            totalWallet: { $sum: '$balance.wallet' },
            totalBank: { $sum: '$balance.bank' },
          },
        },
      ]);

      const stats = totalBalance[0] || { totalWallet: 0, totalBank: 0 };

      const statsText = `📈 *VOLTARIA STATISTICS*

👥 *Users:* ${userCount}
🏠 *Groups:* ${groupCount}
💰 *Transactions:* ${transactionCount}
💳 *Total Wallet:* ${stats.totalWallet.toLocaleString()} NΘ̰
🏛️ *Total Bank:* ${stats.totalBank.toLocaleString()} NΘ̰

🕒 *Uptime:* ${Math.floor(process.uptime() / 3600)}h

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: statsText,
      });

      logger.info(`Stats command executed from ${from}`);
    } catch (error) {
      logger.error('Error in stats command:', error);
    }
  }
}

export default StatsCommand;
