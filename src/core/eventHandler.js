import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EventHandler {
  constructor(client, commandHandler, db) {
    this.client = client;
    this.commandHandler = commandHandler;
    this.db = db;
    this.events = new Map();
  }

  async load() {
    const eventsPath = join(__dirname, '../events');
    try {
      const files = readdirSync(eventsPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const { default: Event } = await import(join(eventsPath, file));
          const event = new Event(this.client, this.commandHandler, this.db);
          this.events.set(event.name, event);
          this.client.sock.ev.on(event.name, (...args) => event.execute(...args).catch(err => {
            logger.error(`Error in event ${event.name}:`, err);
          }));
        } catch (error) {
          logger.error(`Error loading event ${file}:`, error);
        }
      }
    } catch (error) {
      logger.warn('Events directory not found yet');
    }
  }
}

export default EventHandler;
