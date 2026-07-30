/**
 * Fixed-window, in-memory rate limiter.
 *
 * Deliberately dependency-free and process-local: this portfolio runs as a
 * single instance, and the goal is to blunt casual abuse of the contact form,
 * not to be a distributed quota system. On a multi-instance or serverless
 * deployment each instance keeps its own window, so the effective limit is
 * (limit x instances) — document that before relying on it for anything
 * stricter. Swap in Redis/Upstash if that matters.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Drop expired entries so the map cannot grow without bound. */
function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 } = {},
): RateLimitResult {
  const now = Date.now();

  // Cheap amortised cleanup — only when the map is big enough to matter.
  if (windows.size > 512) sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);

  if (existing.count > limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: limit - existing.count, retryAfter };
}

/** Exposed for tests; not used by the route. */
export function __resetRateLimit() {
  windows.clear();
}
