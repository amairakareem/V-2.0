import logger from '../utils/logger.js';

class CallEvent {
  constructor(client, commandHandler, db) {
    this.name = 'call';
    this.client = client;
    this.commandHandler = commandHandler;
    this.db = db;
  }

  async execute(node) {
    try {
      const from = node.from;
      logger.info(`📞 Call received from ${from}`);

      // Reject calls automatically
      // You can implement call handling logic here if needed
    } catch (error) {
      logger.error('Error in call event:', error);
    }
  }
}

export default CallEvent;
