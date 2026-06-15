import logger from '../../utils/logger.js';

class RulesCommand {
  constructor() {
    this.name = 'rules';
    this.aliases = [];
    this.description = 'Display bot rules';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;

      const rulesText = `📜 *N£XUS BOT RULES*

1. 👥 *Group Size:* Minimum 40 members
2. 📚 *Activity:* Group must remain active
3. 🤗 *New Members:* At least 50% new to community
4. 🤖 *Bot Limit:* Maximum 1 bot per group
5. 🔐 *Bot Admin:* Bot must be admin
6. ⎩️ *Admin Approval:* Must be turned off
7. 🟶️ *No Spam:* Don't spam commands
8. ❎ *Bans:* Wait for bot to be unbanned
9. 🏠 *Group Limit:* 2 groups per requester
10. 🤐 *Respect:* No disrespect to bot/mods
11. 🤝 *Acceptance:* All members must accept bot
12. 🚩 *Errors:* Be patient with technical issues

© POWERED BY N£XUS`;

      await client.sendMessage(from, {
        text: rulesText,
      });

      logger.info(`Rules command executed from ${from}`);
    } catch (error) {
      logger.error('Error in rules command:', error);
    }
  }
}

export default RulesCommand;
