import logger from '../../utils/logger.js';
import User from '../../models/User.js';
import Group from '../../models/Group.js';

class BroadcastCommand {
  constructor() {
    this.name = 'broadcast';
    this.aliases = [];
    this.description = 'Broadcast message to all groups (Admin only)';
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

      if (!args[0]) {
        return await client.sendMessage(from, {
          text: '💱 Usage: .broadcast <message>',
        });
      }

      const messageText = args.join(' ');
      const groups = await Group.find();

      let sent = 0;
      for (const group of groups) {
        try {
          await client.sendMessage(group.groupId, {
            text: `💱 *BROADCAST*\n\n${messageText}\n\n© POWERED BY N£XUS`,
          });
          sent++;
        } catch (error) {
          logger.error(`Failed to send broadcast to ${group.groupId}:`, error);
        }
      }

      await client.sendMessage(from, {
        text: `✅ Broadcast sent to ${sent}/${groups.length} groups`,
      });

      logger.info(`Broadcast sent to ${sent} groups`);
    } catch (error) {
      logger.error('Error in broadcast command:', error);
    }
  }
}

export default BroadcastCommand;
