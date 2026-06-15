import logger from '../utils/logger.js';
import Group from '../models/Group.js';

class GroupParticipantsUpdateEvent {
  constructor(client, commandHandler, db) {
    this.name = 'group-participants.update';
    this.client = client;
    this.commandHandler = commandHandler;
    this.db = db;
  }

  async execute(data) {
    try {
      const { id, participants, action } = data;

      const group = await Group.findOneAndUpdate(
        { groupId: id },
        { $set: { members: participants } },
        { new: true, upsert: true }
      );

      if (action === 'add') {
        logger.info(`New members added to ${group.groupName}`);
        if (group.welcome.enabled) {
          await this.client.sendMessage(id, {
            text: group.welcome.message,
          });
        }
      } else if (action === 'remove') {
        logger.info(`Members removed from ${group.groupName}`);
        if (group.leave.enabled) {
          await this.client.sendMessage(id, {
            text: group.leave.message,
          });
        }
      }
    } catch (error) {
      logger.error('Error in group-participants.update event:', error);
    }
  }
}

export default GroupParticipantsUpdateEvent;
