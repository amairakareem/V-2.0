import logger from '../../utils/logger.js';

class ModsCommand {
  constructor() {
    this.name = 'mods';
    this.aliases = [];
    this.description = 'Contact moderators';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;

      const modsText = `👤 *MODERATORS*

Contact our mods for assistance:

💱 *Owner:* +${process.env.OWNER_NUMBER || '254108720384'}

🔍 Issues or questions? Reach out to any mod.

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: modsText,
      });

      logger.info(`Mods command executed from ${from}`);
    } catch (error) {
      logger.error('Error in mods command:', error);
    }
  }
}

export default ModsCommand;
