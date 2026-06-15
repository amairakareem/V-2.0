import logger from '../utils/logger.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import Cooldown from '../models/Cooldown.js';

class MessageReceiveEvent {
  constructor(client, commandHandler, db) {
    this.name = 'message.receive';
    this.client = client;
    this.commandHandler = commandHandler;
    this.db = db;
  }

  async execute(m) {
    try {
      const message = m.messages[0];
      if (!message) return;

      const from = message.key.remoteJid;
      const sender = message.key.participant || from;
      const isGroup = this.client.isGroup(from);
      const prefix = process.env.PREFIX || '.';

      if (message.message?.conversation) {
        const text = message.message.conversation;
        const args = text.trim().split(/\s+/);
        const command = args[0]?.toLowerCase();

        if (!command?.startsWith(prefix)) return;

        const cleanCommand = command.slice(prefix.length);
        args[0] = cleanCommand;

        logger.debug(`Command: ${cleanCommand} from ${sender} in ${from}`);

        // Check cooldown
        const cooldownDoc = await Cooldown.findOne({
          userId: sender,
          command: cleanCommand,
          expiresAt: { $gt: new Date() },
        });

        if (cooldownDoc) {
          return await this.client.sendMessage(from, {
            text: `⏱️ Command on cooldown. Try again in ${Math.ceil((cooldownDoc.expiresAt - new Date()) / 1000)}s`,
          });
        }

        // Ensure user exists
        await User.findOneAndUpdate(
          { userId: sender },
          { $inc: { 'stats.totalCommands': 1 } },
          { upsert: true, new: true }
        );

        // Execute command
        const result = await this.commandHandler.execute(message, args);

        // Set cooldown (3 seconds default)
        const cooldownMs = 3000;
        const expiresAt = new Date(Date.now() + cooldownMs);
        await Cooldown.create({
          userId: sender,
          command: cleanCommand,
          expiresAt,
        });
      }
    } catch (error) {
      logger.error('Error in message.receive event:', error);
    }
  }
}

export default MessageReceiveEvent;
