import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.aliases = new Map();
    this.prefix = process.env.PREFIX || '.';
  }

  async load() {
    const commandsPath = join(__dirname, '../commands');
    try {
      const categories = readdirSync(commandsPath);

      for (const category of categories) {
        const categoryPath = join(commandsPath, category);
        const files = readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
          try {
            const { default: Command } = await import(join(categoryPath, file));
            const command = new Command();
            this.commands.set(command.name, command);

            if (command.aliases && Array.isArray(command.aliases)) {
              command.aliases.forEach(alias => {
                this.aliases.set(alias, command.name);
              });
            }
          } catch (error) {
            logger.error(`Error loading command ${file}:`, error);
          }
        }
      }
    } catch (error) {
      logger.warn('Commands directory not found yet');
    }
  }

  async execute(message, args) {
    const commandName = args[0]?.toLowerCase();
    
    let command = this.commands.get(commandName);
    if (!command) {
      const aliasedCommand = this.aliases.get(commandName);
      command = this.commands.get(aliasedCommand);
    }

    if (!command) return null;

    try {
      return await command.execute(message, args.slice(1), this.client);
    } catch (error) {
      logger.error(`Error executing command ${commandName}:`, error);
      throw error;
    }
  }

  getCommand(name) {
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }
}

export default CommandHandler;
