import { beforeEach, describe, expect, it, vi } from 'vitest';

import { __resetRateLimit, rateLimit } from './rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    __resetRateLimit();
    vi.useRealTimers();
  });

  it('blocks requests after the configured limit and reports retry time', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    expect(rateLimit('client', { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(rateLimit('client', { limit: 2, windowMs: 60_000 }).allowed).toBe(true);
    expect(rateLimit('client', { limit: 2, windowMs: 60_000 })).toMatchObject({
      allowed: false,
      retryAfter: 60,
    });
  });
});
