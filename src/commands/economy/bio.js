import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class BioCommand {
  constructor() {
    this.name = 'bio';
    this.aliases = [];
    this.description = 'Set your bio';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '📝 Usage: .bio <text>\n\nExample: .bio 🎮 Gamer | 🎬 Anime lover',
        });
      }

      const bio = args.join(' ').substring(0, 100);

      let user = await User.findOne({ userId: sender });
      if (!user) {
        user = await User.create({ userId: sender });
      }

      user.profile.bio = bio;
      await user.save();

      await client.sendMessage(from, {
        text: `✅ Bio updated!\n\n📝 "${bio}"`,
      });

      logger.info(`Bio set by ${sender}`);
    } catch (error) {
      logger.error('Error in bio command:', error);
    }
  }
}

export default BioCommand;
