import { APP_CONFIG } from './constants';

interface RateLimitRecord {
  timestamps: number[];
}

export class MemoryRateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(
    windowMs: number = APP_CONFIG.RATE_LIMIT_WINDOW_MS,
    maxRequests: number = APP_CONFIG.RATE_LIMIT_MAX_REQUESTS
  ) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Checks whether the given key is allowed to make a request.
   */
  public check(key: string): {
    allowed: boolean;
    remaining: number;
    resetSeconds: number;
  } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.cache.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.cache.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetMs = oldestInWindow + this.windowMs - now;
      const resetSeconds = Math.max(1, Math.ceil(resetMs / 1000));

      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
      };
    }

    // Add current request
    record.timestamps.push(now);
    const remaining = this.maxRequests - record.timestamps.length;

    return {
      allowed: true,
      remaining,
      resetSeconds: Math.ceil(this.windowMs / 1000),
    };
  }

  /**
   * Resets the limiter for testing purposes.
   */
  public reset(): void {
    this.cache.clear();
  }
}

// Global singleton instance for server routes
export const globalRateLimiter = new MemoryRateLimiter();

/**
 * Extracts client IP safely from request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
