import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class RenameCommand {
  constructor() {
    this.name = 'rename';
    this.aliases = [];
    this.description = 'Change your name';
    this.category = 'economy';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '📛 Usage: .rename <name>\n\nExample: .rename Arashi',
        });
      }

      const name = args.join(' ').substring(0, 50);

      let user = await User.findOne({ userId: sender });
      if (!user) {
        user = await User.create({ userId: sender });
      }

      user.profile.name = name;
      await user.save();

      await client.sendMessage(from, {
        text: `✅ Name updated to: ${name}`,
      });

      logger.info(`Name changed by ${sender} to ${name}`);
    } catch (error) {
      logger.error('Error in rename command:', error);
    }
  }
}

export default RenameCommand;
