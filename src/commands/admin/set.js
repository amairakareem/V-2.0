import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class SetCommand {
  constructor() {
    this.name = 'set';
    this.aliases = [];
    this.description = 'Set user properties (Admin only)';
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

      if (!args[0] || !args[1] || !args[2]) {
        return await client.sendMessage(from, {
          text: `⚡ Usage: .set <user_id> <property> <value>

Properties:
- level <number>
- xp <number>
- reputation <number>
- premium <true/false>
- bio <text>`,
        });
      }

      const userId = args[0].replace(/[^0-9]/g, '');
      const property = args[1].toLowerCase();
      const value = args.slice(2).join(' ');

      let user = await User.findOne({ userId: `${userId}@s.whatsapp.net` });
      if (!user) {
        user = await User.create({ userId: `${userId}@s.whatsapp.net` });
      }

      switch (property) {
        case 'level':
          user.stats.level = parseInt(value);
          break;
        case 'xp':
          user.stats.xp = parseInt(value);
          break;
        case 'reputation':
          user.stats.reputation = parseInt(value);
          break;
        case 'premium':
          user.premium = value.toLowerCase() === 'true';
          break;
        case 'bio':
          user.profile.bio = value.substring(0, 100);
          break;
        default:
          return await client.sendMessage(from, {
            text: '❌ Unknown property',
          });
      }

      await user.save();

      await client.sendMessage(from, {
        text: `✅ ${property} updated to ${value}`,
      });

      logger.info(`Admin set ${property} for ${userId} to ${value}`);
    } catch (error) {
      logger.error('Error in set command:', error);
    }
  }
}

export default SetCommand;
