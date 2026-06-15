import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';

class ProfileCommand {
  constructor() {
    this.name = 'profile';
    this.aliases = ['p'];
    this.description = 'View your profile';
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

      const profileText = `👤 *YOUR PROFILE*

*Personal*
📛 Name: ${user.profile.name}
📝 Bio: ${user.profile.bio}
🎂 Age: ${user.profile.age || 'Not set'}

*Stats*
⏰ Level: ${user.stats.level}
✨ XP: ${user.stats.xp}
⭐ Reputation: ${user.stats.reputation}

*Economy*
💵 Wallet: ${user.balance.wallet.toLocaleString()} 𝑵̶
🏦 Bank: ${user.balance.bank.toLocaleString()} 𝑵̶

*Premium:* ${user.premium ? '✅ Yes' : '❌ No'}

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: profileText,
      });

      logger.info(`Profile viewed by ${sender}`);
    } catch (error) {
      logger.error('Error in profile command:', error);
    }
  }
}

export default ProfileCommand;
