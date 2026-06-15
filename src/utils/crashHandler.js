import logger from './logger.js';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

class CrashHandler {
  constructor() {
    this.logPath = process.env.LOG_PATH || './logs';
    if (!existsSync(this.logPath)) {
      mkdirSync(this.logPath, { recursive: true });
    }
  }

  setupHandlers() {
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.logCrash('uncaughtException', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', reason);
      this.logCrash('unhandledRejection', new Error(String(reason)));
    });

    process.on('SIGTERM', () => {
      logger.warn('SIGTERM received - graceful shutdown');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.warn('SIGINT received - graceful shutdown');
      process.exit(0);
    });
  }

  logCrash(type, error) {
    const timestamp = new Date().toISOString();
    const crashLog = `[${timestamp}] ${type}: ${error.message}\n${error.stack}\n\n`;
    try {
      appendFileSync(join(this.logPath, 'crashes.log'), crashLog);
    } catch (error) {
      console.error('Failed to write crash log:', error);
    }
  }
}

export default CrashHandler;
