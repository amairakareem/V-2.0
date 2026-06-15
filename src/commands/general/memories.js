import logger from '../../utils/logger.js';
import Memory from '../../models/Memory.js';

class MemoriesCommand {
  constructor() {
    this.name = 'memories';
    this.aliases = ['mem'];
    this.description = 'View and manage AI memories';
    this.category = 'general';
  }

  async execute(message, args, client) {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;
      const subcommand = args[0]?.toLowerCase();

      if (!subcommand || subcommand === 'view') {
        const memories = await Memory.find({ userId: sender })
          .sort({ importance: -1, lastAccessed: -1 })
          .limit(10);

        if (memories.length === 0) {
          return await client.sendMessage(from, {
            text: '📝 No memories yet. Create one with `.mem add <text>`',
          });
        }

        let memoryText = '🧠 *YOUR MEMORIES*\n\n';
        memories.forEach((mem, i) => {
          memoryText += `${i + 1}. ${mem.content}\n   ⭐ Importance: ${mem.importance}/10\n\n`;
        });

        await client.sendMessage(from, {
          text: memoryText,
        });
      } else if (subcommand === 'add') {
        const content = args.slice(1).join(' ');
        if (!content) {
          return await client.sendMessage(from, {
            text: '📝 Usage: .mem add <memory text>',
          });
        }

        await Memory.create({
          userId: sender,
          content,
          importance: 5,
          category: 'note',
        });

        await client.sendMessage(from, {
          text: '✅ Memory saved!',
        });
      } else if (subcommand === 'clear') {
        await Memory.deleteMany({ userId: sender });
        await client.sendMessage(from, {
          text: '🗑️ All memories cleared!',
        });
      } else if (subcommand === 'search') {
        const query = args.slice(1).join(' ');
        if (!query) {
          return await client.sendMessage(from, {
            text: '📝 Usage: .mem search <keyword>',
          });
        }

        const results = await Memory.find({
          userId: sender,
          content: { $regex: query, $options: 'i' },
        });

        if (results.length === 0) {
          return await client.sendMessage(from, {
            text: '❌ No memories found matching that query.',
          });
        }

        let searchText = `🔍 *SEARCH RESULTS* (${results.length})\n\n`;
        results.forEach((mem, i) => {
          searchText += `${i + 1}. ${mem.content}\n\n`;
        });

        await client.sendMessage(from, {
          text: searchText,
        });
      }

      logger.info(`Memories command executed by ${sender}`);
    } catch (error) {
      logger.error('Error in memories command:', error);
    }
  }
}

export default MemoriesCommand;
