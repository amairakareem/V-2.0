import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

class WithdrawCommand {
  constructor() {
    this.name = 'withdraw';
    this.aliases = ['wd'];
    this.description = 'Withdraw money from bank';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '💰 Usage: .withdraw <amount>\n\nExample: .withdraw 500',
        });
      }

      let amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0) {
        return await client.sendMessage(from, {
          text: '❌ Invalid amount',
        });
      }

      if (args[0].toLowerCase() === 'all') {
        let user = await User.findOne({ userId: sender });
        amount = user.balance.bank;
      }

      let user = await User.findOne({ userId: sender });
      if (!user) {
        user = await User.create({ userId: sender });
      }

      if (user.balance.bank < amount) {
        return await client.sendMessage(from, {
          text: `❌ Insufficient bank balance\n\n🏦 Available: ${user.balance.bank.toLocaleString()} 𝑵̶`,
        });
      }

      user.balance.bank -= amount;
      user.balance.wallet += amount;
      await user.save();

      await Transaction.create({
        userId: sender,
        type: 'transfer',
        amount,
        reason: 'Withdrawn from bank',
      });

      const withdrawText = `💵 *WITHDRAWAL SUCCESSFUL*

💰 Withdrawn: ${amount.toLocaleString()} 𝑵̶
💵 Wallet: ${user.balance.wallet.toLocaleString()} 𝑵̶
🏦 Bank: ${user.balance.bank.toLocaleString()} 𝑵̶

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: withdrawText,
      });

      logger.info(`Withdraw by ${sender}: ${amount}`);
    } catch (error) {
      logger.error('Error in withdraw command:', error);
    }
  }
}

export default WithdrawCommand;
