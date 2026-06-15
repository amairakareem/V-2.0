import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

class DepositCommand {
  constructor() {
    this.name = 'deposit';
    this.aliases = ['dep'];
    this.description = 'Deposit money to bank';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '💰 Usage: .deposit <amount>\n\nExample: .deposit 1000',
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
        amount = user.balance.wallet;
      }

      let user = await User.findOne({ userId: sender });
      if (!user) {
        user = await User.create({ userId: sender });
      }

      if (user.balance.wallet < amount) {
        return await client.sendMessage(from, {
          text: `❌ Insufficient balance\n\n💵 Available: ${user.balance.wallet.toLocaleString()} 𝑵̶`,
        });
      }

      user.balance.wallet -= amount;
      user.balance.bank += amount;
      await user.save();

      await Transaction.create({
        userId: sender,
        type: 'transfer',
        amount,
        reason: 'Deposited to bank',
      });

      const depositText = `🏦 *DEPOSIT SUCCESSFUL*

💰 Deposited: ${amount.toLocaleString()} 𝑵̶
💵 Wallet: ${user.balance.wallet.toLocaleString()} 𝑵̶
🏦 Bank: ${user.balance.bank.toLocaleString()} 𝑵̶

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: depositText,
      });

      logger.info(`Deposit by ${sender}: ${amount}`);
    } catch (error) {
      logger.error('Error in deposit command:', error);
    }
  }
}

export default DepositCommand;
