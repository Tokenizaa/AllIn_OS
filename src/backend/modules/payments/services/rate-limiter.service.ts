import { logger } from '../../../shared/observability/logger.service';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: string;
  limit: number;
}

export class RateLimiterService {
  private static instance: RateLimiterService;
  private requests: Map<string, number[]> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  registerEndpoint(endpoint: string, config: RateLimitConfig): void {
    this.configs.set(endpoint, config);
    logger.info('Registered rate limit config', 'rate-limiter-service', { endpoint, config });
  }

  async checkLimit(
    identifier: string,
    endpoint: string
  ): Promise<RateLimitResult> {
    const config = this.configs.get(endpoint);
    if (!config) {
      // No rate limit configured
      return {
        allowed: true,
        remaining: Number.MAX_SAFE_INTEGER,
        resetTime: new Date(Date.now() + 60000).toISOString(),
        limit: Number.MAX_SAFE_INTEGER,
      };
    }

    const key = `${endpoint}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this identifier
    let timestamps = this.requests.get(key) || [];

    // Filter out requests outside the current window
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    // Check if limit exceeded
    const allowed = timestamps.length < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - timestamps.length);

    if (allowed) {
      // Add current request timestamp
      timestamps.push(now);
      this.requests.set(key, timestamps);
    } else {
      logger.warn('Rate limit exceeded', 'rate-limiter-service', {
        identifier,
        endpoint,
        requests: timestamps.length,
        limit: config.maxRequests,
      });
    }

    // Calculate reset time (when the oldest request in window expires)
    const resetTime = timestamps.length > 0
      ? new Date(timestamps[0] + config.windowMs).toISOString()
      : new Date(now + config.windowMs).toISOString();

    return {
      allowed,
      remaining,
      resetTime,
      limit: config.maxRequests,
    };
  }

  reset(identifier: string, endpoint: string): void {
    const key = `${endpoint}:${identifier}`;
    this.requests.delete(key);
    logger.info('Reset rate limit', 'rate-limiter-service', { identifier, endpoint });
  }

  resetAll(endpoint: string): void {
    const prefix = `${endpoint}:`;
    for (const key of this.requests.keys()) {
      if (key.startsWith(prefix)) {
        this.requests.delete(key);
      }
    }
    logger.info('Reset all rate limits for endpoint', 'rate-limiter-service', { endpoint });
  }

  getStats(identifier: string, endpoint: string): { current: number; limit: number; windowMs: number } {
    const config = this.configs.get(endpoint);
    const key = `${endpoint}:${identifier}`;
    const timestamps = this.requests.get(key) || [];
    const now = Date.now();
    const windowStart = now - (config?.windowMs || 60000);

    const current = timestamps.filter((timestamp) => timestamp > windowStart).length;

    return {
      current,
      limit: config?.maxRequests || 0,
      windowMs: config?.windowMs || 60000,
    };
  }

  private startCleanupInterval(): void {
    // Clean up old request records every minute
    setInterval(() => {
      this.cleanupOldRecords();
    }, 60 * 1000);
  }

  private cleanupOldRecords(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, timestamps] of this.requests.entries()) {
      const endpoint = key.split(':')[0];
      const config = this.configs.get(endpoint);
      const windowMs = config?.windowMs || 60000;
      const windowStart = now - windowMs;

      const filtered = timestamps.filter((timestamp) => timestamp > windowStart);

      if (filtered.length === 0) {
        this.requests.delete(key);
        cleaned++;
      } else if (filtered.length < timestamps.length) {
        this.requests.set(key, filtered);
      }
    }

    if (cleaned > 0) {
      logger.info('Cleaned old rate limit records', 'rate-limiter-service', { cleaned });
    }
  }

  clearAll(): void {
    const count = this.requests.size;
    this.requests.clear();
    logger.info('Cleared all rate limit records', 'rate-limiter-service', { count });
  }

  isConfigured(endpoint: string): boolean {
    return this.configs.has(endpoint);
  }

  removeEndpoint(endpoint: string): void {
    this.configs.delete(endpoint);
    this.resetAll(endpoint);
    logger.info('Removed rate limit config', 'rate-limiter-service', { endpoint });
  }
}

export const rateLimiterService = RateLimiterService.getInstance();
