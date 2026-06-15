import logger from '../utils/logger.js';
import Group from '../models/Group.js';

class GroupsUpdateEvent {
  constructor(client, commandHandler, db) {
    this.name = 'groups.update';
    this.client = client;
    this.commandHandler = commandHandler;
    this.db = db;
  }

  async execute(groupUpdates) {
    try {
      for (const update of groupUpdates) {
        const { id, subject, announce, restrict, desc } = update;

        await Group.findOneAndUpdate(
          { groupId: id },
          {
            $set: {
              groupName: subject,
              'settings.announce': announce,
              'settings.restrict': restrict,
            },
          },
          { upsert: true, new: true }
        );

        logger.debug(`Group ${subject} (${id}) updated`);
      }
    } catch (error) {
      logger.error('Error in groups.update event:', error);
    }
  }
}

export default GroupsUpdateEvent;
