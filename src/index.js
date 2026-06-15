import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from './utils/database.js';
import BotClient from './core/client.js';
import CommandHandler from './core/commandHandler.js';
import EventHandler from './core/eventHandler.js';
import logger from './utils/logger.js';
import CrashHandler from './utils/crashHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const banner = `
${chalk.cyan('╭━━⎋🜍𝗡£𝗫𝗨𝗦🜍 ⎋━━╮')}
${chalk.cyan('┃')}  ${chalk.yellow('𖤓 Prefix:')} ${chalk.white(process.env.PREFIX || '.')}
${chalk.cyan('┃')}  ${chalk.yellow('𖤓 Name:')} ${chalk.white(process.env.BOT_NAME || 'Voltaria')}
${chalk.cyan('┃')}  ${chalk.yellow('𖤓 Creator:')} ${chalk.white(process.env.CREATOR || 'Arashi')}
${chalk.cyan('╰━━━━━━━━━━━━━╯')}
`;

class Voltaria {
  constructor() {
    this.db = null;
    this.client = null;
    this.commandHandler = null;
    this.eventHandler = null;
    this.crashHandler = null;
  }

  async initialize() {
    try {
      console.log(banner);
      logger.info('🚀 Initializing Voltaria Bot...');

      this.crashHandler = new CrashHandler();
      this.crashHandler.setupHandlers();

      logger.info('📦 Connecting to MongoDB...');
      this.db = new Database();
      await this.db.connect();
      logger.success('✅ Database connected');

      logger.info('🤖 Starting Baileys client...');
      this.client = new BotClient();
      await this.client.initialize();
      logger.success('✅ Baileys client initialized');

      logger.info('📋 Loading commands...');
      this.commandHandler = new CommandHandler(this.client);
      await this.commandHandler.load();
      logger.success(`✅ ${this.commandHandler.commands.size} commands loaded`);

      logger.info('⚡ Loading events...');
      this.eventHandler = new EventHandler(this.client, this.commandHandler, this.db);
      await this.eventHandler.load();
      logger.success(`✅ ${this.eventHandler.events.size} events loaded`);

      logger.success('\n🎉 Voltaria is ready!');
      logger.info(`© POWERED BY N£XUS\n`);
    } catch (error) {
      logger.error('Failed to initialize Voltaria:', error);
      process.exit(1);
    }
  }

  async start() {
    await this.initialize();
  }
}

const voltaria = new Voltaria();
voltaria.start().catch(error => {
  logger.error('Fatal error:', error);
  process.exit(1);
});

export default voltaria;
