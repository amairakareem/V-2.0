import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Economy from '../../models/Economy.js';

class BalanceCommand {
  constructor() {
    this.name = 'balance';
    this.aliases = ['bal'];
    this.description = 'Check your balance';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      let user = await User.findOne({ userId: sender });
      if (!user) {
        user = await User.create({ userId: sender });
      }

      const balanceText = `💰 *YOUR BALANCE*

💵 Wallet: ${user.balance.wallet.toLocaleString()} 𝑵̶
🏦 Bank: ${user.balance.bank.toLocaleString()} 𝑵̶
📊 Total: ${(user.balance.wallet + user.balance.bank).toLocaleString()} 𝑵̶

⏰ Level: ${user.stats.level}
✨ XP: ${user.stats.xp}

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: balanceText,
      });

      logger.info(`Balance command executed by ${sender}`);
    } catch (error) {
      logger.error('Error in balance command:', error);
      await client.sendMessage(from, {
        text: '❌ Error checking balance',
      });
    }
  }
}

export default BalanceCommand;
