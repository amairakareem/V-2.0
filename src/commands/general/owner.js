import logger from '../../utils/logger.js';

class OwnerCommand {
  constructor() {
    this.name = 'owner';
    this.aliases = [];
    this.description = 'Get owner number';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const ownerNumber = process.env.OWNER_NUMBER || '254108720384';

      const ownerText = `👤 *OWNER*

💱 Owner Number: +${ownerNumber}

🚨 DM for bot inquiries

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: ownerText,
      });

      logger.info(`Owner command executed from ${from}`);
    } catch (error) {
      logger.error('Error in owner command:', error);
    }
  }
}

export default OwnerCommand;
