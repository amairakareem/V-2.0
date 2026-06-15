import logger from '../../utils/logger.js';
import User from '../../models/User.js';

class TestCommand {
  constructor() {
    this.name = 'test';
    this.aliases = [];
    this.description = 'Test bot functionality';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      await client.sendMessage(from, {
        text: `✅ Bot is working!\n\n🤖 Voltaria is online and ready.\n© POWERED BY N£XUS`,
      });

      logger.info(`Test command executed by ${sender}`);
    } catch (error) {
      logger.error('Error in test command:', error);
    }
  }
}

export default TestCommand;
