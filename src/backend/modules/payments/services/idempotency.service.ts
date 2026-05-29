import { logger } from '../../../shared/observability/logger.service';

export interface IdempotencyKeyRecord {
  key: string;
  response: unknown;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export class IdempotencyService {
  private static instance: IdempotencyService;
  private store: Map<string, IdempotencyKeyRecord> = new Map();
  private defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): IdempotencyService {
    if (!IdempotencyService.instance) {
      IdempotencyService.instance = new IdempotencyService();
    }
    return IdempotencyService.instance;
  }

  async checkOrSet(
    key: string,
    operation: () => Promise<unknown>,
    ttl?: number
  ): Promise<{ response: unknown; isCached: boolean }> {
    const existing = this.get(key);

    if (existing) {
      logger.info('Returning cached response for idempotent key', 'idempotency-service', { key });
      return { response: existing.response, isCached: true };
    }

    logger.info('Executing operation for new idempotent key', 'idempotency-service', { key });

    const response = await operation();

    this.set(key, {
      response,
      status: 'success',
    }, ttl);

    return { response, isCached: false };
  }

  get(key: string): IdempotencyKeyRecord | null {
    const record = this.store.get(key);

    if (!record) {
      return null;
    }

    // Check if expired
    if (new Date(record.expiresAt) < new Date()) {
      this.store.delete(key);
      return null;
    }

    return record;
  }

  set(key: string, data: { response: unknown; status: string }, ttl?: number): void {
    const expiresAt = new Date(Date.now() + (ttl || this.defaultTTL)).toISOString();

    const record: IdempotencyKeyRecord = {
      key,
      response: data.response,
      status: data.status,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    this.store.set(key, record);
    logger.info('Set idempotency key', 'idempotency-service', { key, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
    logger.info('Deleted idempotency key', 'idempotency-service', { key });
  }

  clear(): void {
    const count = this.store.size;
    this.store.clear();
    logger.info('Cleared all idempotency keys', 'idempotency-service', { count });
  }

  private startCleanupInterval(): void {
    // Clean up expired keys every hour
    setInterval(() => {
      this.cleanupExpired();
    }, 60 * 60 * 1000);
  }

  private cleanupExpired(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [key, record] of this.store.entries()) {
      if (new Date(record.expiresAt) < now) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info('Cleaned expired idempotency keys', 'idempotency-service', { cleaned });
    }
  }

  generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);

    const paramString = JSON.stringify(sortedParams);
    const hash = this.simpleHash(paramString);

    return `${prefix}:${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  getStats(): { total: number; expired: number } {
    const now = new Date();
    let expired = 0;

    for (const record of this.store.values()) {
      if (new Date(record.expiresAt) < now) {
        expired++;
      }
    }

    return {
      total: this.store.size,
      expired,
    };
  }
}

export const idempotencyService = IdempotencyService.getInstance();
