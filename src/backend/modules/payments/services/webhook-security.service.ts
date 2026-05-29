import { createHmac, timingSafeEqual } from 'crypto';
import { logger } from '../../../shared/observability/logger.service';

export interface WebhookSecurityConfig {
  secret: string;
  algorithm?: string;
  headerName?: string;
  tolerance?: number;
}

export class WebhookSecurityService {
  private static instance: WebhookSecurityService;
  private configs: Map<string, WebhookSecurityConfig> = new Map();

  private constructor() {}

  static getInstance(): WebhookSecurityService {
    if (!WebhookSecurityService.instance) {
      WebhookSecurityService.instance = new WebhookSecurityService();
    }
    return WebhookSecurityService.instance;
  }

  registerGateway(gatewayName: string, config: WebhookSecurityConfig): void {
    this.configs.set(gatewayName, {
      algorithm: 'sha256',
      headerName: 'x-signature',
      tolerance: 300, // 5 minutes tolerance
      ...config,
    });
    logger.info('Registered webhook security config', 'webhook-security-service', { gatewayName });
  }

  verifyWebhookSignature(
    gatewayName: string,
    payload: string | Buffer,
    signature: string,
    timestamp?: string
  ): { valid: boolean; error?: string } {
    const config = this.configs.get(gatewayName);
    if (!config) {
      return { valid: false, error: 'Gateway not configured' };
    }

    // Check timestamp if provided
    if (timestamp && config.tolerance) {
      const now = Math.floor(Date.now() / 1000);
      const webhookTime = parseInt(timestamp, 10);
      const diff = Math.abs(now - webhookTime);

      if (diff > config.tolerance) {
        logger.warn('Webhook timestamp outside tolerance', 'webhook-security-service', {
          gatewayName,
          diff,
          tolerance: config.tolerance,
        });
        return { valid: false, error: 'Timestamp outside tolerance' };
      }
    }

    // Calculate expected signature
    const expectedSignature = this.calculateSignature(gatewayName, payload, timestamp);

    // Compare signatures safely
    const valid = this.compareSignatures(expectedSignature, signature);

    if (!valid) {
      logger.warn('Webhook signature verification failed', 'webhook-security-service', {
        gatewayName,
        expected: expectedSignature.substring(0, 10) + '...',
        received: signature.substring(0, 10) + '...',
      });
    }

    return { valid };
  }

  private calculateSignature(gatewayName: string, payload: string | Buffer, timestamp?: string): string {
    const config = this.configs.get(gatewayName);
    if (!config) {
      throw new Error('Gateway not configured');
    }

    const hmac = createHmac(config.algorithm!, config.secret);

    if (timestamp) {
      hmac.update(timestamp + '.');
    }

    hmac.update(payload);
    return hmac.digest('hex');
  }

  private compareSignatures(a: string, b: string): boolean {
    try {
      const aBuffer = Buffer.from(a, 'hex');
      const bBuffer = Buffer.from(b, 'hex');

      if (aBuffer.length !== bBuffer.length) {
        return false;
      }

      return timingSafeEqual(aBuffer, bBuffer);
    } catch {
      return false;
    }
  }

  generateSignature(gatewayName: string, payload: string | Buffer, timestamp?: string): string {
    return this.calculateSignature(gatewayName, payload, timestamp);
  }

  extractSignature(headers: Record<string, string>, gatewayName: string): string | null {
    const config = this.configs.get(gatewayName);
    if (!config) {
      return null;
    }

    const headerName = config.headerName!.toLowerCase();
    const signature = headers[headerName] || headers[headerName.replace(/-/g, '_')];

    return signature || null;
  }

  extractTimestamp(headers: Record<string, string>, gatewayName: string): string | null {
    const config = this.configs.get(gatewayName);
    if (!config) {
      return null;
    }

    const timestampHeader = headers['x-timestamp'] || headers['timestamp'];
    return timestampHeader || null;
  }

  isConfigured(gatewayName: string): boolean {
    return this.configs.has(gatewayName);
  }

  removeGateway(gatewayName: string): void {
    this.configs.delete(gatewayName);
    logger.info('Removed webhook security config', 'webhook-security-service', { gatewayName });
  }
}

export const webhookSecurityService = WebhookSecurityService.getInstance();
