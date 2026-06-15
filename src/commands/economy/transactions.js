import logger from '../../utils/logger.js';
import Transaction from '../../models/Transaction.js';

class TransactionsCommand {
  constructor() {
    this.name = 'transactions';
    this.aliases = [];
    this.description = 'View your transactions';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      const transactions = await Transaction.find({ userId: sender })
        .sort({ timestamp: -1 })
        .limit(10);

      if (transactions.length === 0) {
        return await client.sendMessage(from, {
          text: '📊 No transactions yet',
        });
      }

      let txText = '📊 *RECENT TRANSACTIONS*\n\n';
      transactions.forEach((tx, i) => {
        const icon = tx.type === 'earn' ? '➕' : '➖';
        txText += `${i + 1}. ${icon} ${tx.type.toUpperCase()}\n   ${tx.amount.toLocaleString()} 𝑵̶ - ${tx.reason}\n   ${new Date(tx.timestamp).toLocaleString()}\n\n`;
      });

      await client.sendMessage(from, {
        text: txText + '© POWERED BY N£XUS',
      });

      logger.info(`Transactions viewed by ${sender}`);
    } catch (error) {
      logger.error('Error in transactions command:', error);
    }
  }
}

export default TransactionsCommand;
