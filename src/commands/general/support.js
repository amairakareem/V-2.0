import logger from '../../utils/logger.js';

class SupportCommand {
  constructor() {
    this.name = 'support';
    this.aliases = [];
    this.description = 'Get support group link';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const supportGroup = process.env.OWNER_SUPPORT_GROUP || 'CbM5xDquhcC89Cejis5mbr';

      const supportText = `💻 *SUPPORT*

📧 Join our support group:
https://chat.whatsapp.com/${supportGroup}

Get help and updates from the N£XUS team!

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: supportText,
      });

      logger.info(`Support command executed from ${from}`);
    } catch (error) {
      logger.error('Error in support command:', error);
    }
  }
}

export default SupportCommand;
