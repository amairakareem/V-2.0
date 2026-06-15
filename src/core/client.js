import { default as makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import qrcode from 'qrcode-terminal';
import logger from '../utils/logger.js';

class BotClient {
  constructor() {
    this.sock = null;
    this.qrGenerated = false;
    this.sessionPath = process.env.SESSION_PATH || './sessions';
  }

  async initialize() {
    if (!existsSync(this.sessionPath)) {
      mkdirSync(this.sessionPath, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ['Voltaria', 'Safari', '3.0'],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      retryRequestDelayMs: 10000,
      maxMsgsInMemory: 100,
      defaultQueryTimeoutMs: 60000,
      maxReconnectRetries: 5,
    });

    this.sock.ev.on('creds.update', saveCreds);
    this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
    this.sock.ev.on('messages.upsert', async (m) => {
      if (!this.sock.user) return;
      try {
        this.sock.ev.emit('message.receive', m);
      } catch (error) {
        logger.error('Error processing message:', error);
      }
    });
  }

  async handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !this.qrGenerated) {
      this.qrGenerated = true;
      logger.info('\n📱 QR Code generated. Scan it to authenticate:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      this.qrGenerated = false;
      logger.success('✅ Bot connected successfully!');
      logger.info(`👤 Connected as: ${this.sock.user.name}`);
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        logger.warn('⚠️ Connection closed. Attempting reconnection...');
        setTimeout(() => this.initialize(), 5000);
      }
    }
  }

  async sendMessage(jid, content) {
    try {
      return await this.sock.sendMessage(jid, content);
    } catch (error) {
      logger.error('Error sending message:', error);
      throw error;
    }
  }

  isGroup(jid) {
    return jid.endsWith('@g.us');
  }
}

export default BotClient;
