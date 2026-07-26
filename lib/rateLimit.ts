const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterMs = recent[0] + WINDOW_MS - now;
    hits.set(key, recent);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true, retryAfterMs: 0 };
}
