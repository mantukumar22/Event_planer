import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRateLimiter, getClientIp } from '@/lib/rate-limiter';

describe('MemoryRateLimiter', () => {
  let limiter: MemoryRateLimiter;

  beforeEach(() => {
    limiter = new MemoryRateLimiter(1000, 3); // 1 second window, max 3 requests
  });

  it('allows requests within threshold', () => {
    const res1 = limiter.check('ip-1');
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = limiter.check('ip-1');
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = limiter.check('ip-1');
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding threshold with retrySeconds', () => {
    limiter.check('ip-2');
    limiter.check('ip-2');
    limiter.check('ip-2');

    const blocked = limiter.check('ip-2');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThanOrEqual(1);
  });

  it('differentiates distinct keys', () => {
    limiter.check('ip-a');
    limiter.check('ip-a');
    limiter.check('ip-a');

    expect(limiter.check('ip-a').allowed).toBe(false);
    expect(limiter.check('ip-b').allowed).toBe(true);
  });

  it('extracts IP from request headers', () => {
    const reqWithForwarded = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' },
    });
    expect(getClientIp(reqWithForwarded)).toBe('203.0.113.195');

    const reqWithRealIp = new Request('https://example.com', {
      headers: { 'x-real-ip': '198.51.100.4' },
    });
    expect(getClientIp(reqWithRealIp)).toBe('198.51.100.4');

    const reqEmpty = new Request('https://example.com');
    expect(getClientIp(reqEmpty)).toBe('127.0.0.1');
  });
});
