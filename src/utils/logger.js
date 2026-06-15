import chalk from 'chalk';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

const logPath = process.env.LOG_PATH || './logs';
if (!existsSync(logPath)) {
  mkdirSync(logPath, { recursive: true });
}

class Logger {
  constructor() {
    this.logPath = logPath;
  }

  info(message) {
    console.log(chalk.blue('ℹ️  ' + message));
    this.writeLog(message, 'info');
  }

  success(message) {
    console.log(chalk.green('✅ ' + message));
    this.writeLog(message, 'success');
  }

  warn(message) {
    console.log(chalk.yellow('⚠️  ' + message));
    this.writeLog(message, 'warn');
  }

  error(message, error) {
    console.log(chalk.red('❌ ' + message));
    if (error) console.log(chalk.red(error.stack || error));
    this.writeLog(`${message} - ${error?.message || ''}`, 'error');
  }

  debug(message) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(chalk.gray('🐛 ' + message));
    }
  }

  writeLog(message, type) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
    try {
      appendFileSync(join(this.logPath, 'combined.log'), logEntry);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }
}

export default new Logger();
