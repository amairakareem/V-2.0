import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

class DailyCommand {
  constructor() {
    this.name = 'daily';
    this.aliases = [];
    this.description = 'Claim daily reward';
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

      const now = new Date();
      const lastDaily = user.lastDaily;
      const cooldownMs = 86400000; // 24 hours

      if (lastDaily && now - lastDaily < cooldownMs) {
        const remainingMs = cooldownMs - (now - lastDaily);
        const hours = Math.floor(remainingMs / 3600000);
        const minutes = Math.floor((remainingMs % 3600000) / 60000);

        return await client.sendMessage(from, {
          text: `⏱️ Already claimed today!\n\n⏰ Come back in ${hours}h ${minutes}m`,
        });
      }

      const reward = 500;
      const streak = lastDaily && now - lastDaily < cooldownMs * 2 ? user.stats.xp + 1 : 1;

      user.balance.wallet += reward;
      user.lastDaily = now;
      user.stats.xp += reward;
      await user.save();

      await Transaction.create({
        userId: sender,
        type: 'daily',
        amount: reward,
        reason: 'Daily claim',
      });

      const dailyText = `✅ *DAILY REWARD CLAIMED*

💰 Reward: +${reward} 𝑵̶
📈 Streak: ${streak}
💵 New Balance: ${user.balance.wallet.toLocaleString()} 𝑵̶

⏰ Next claim: 24 hours

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: dailyText,
      });

      logger.info(`Daily claimed by ${sender}`);
    } catch (error) {
      logger.error('Error in daily command:', error);
    }
  }
}

export default DailyCommand;
