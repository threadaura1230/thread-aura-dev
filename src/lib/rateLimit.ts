export interface RateLimiterResponse {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

class MemoryRateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private limit: number;
  private intervalMs: number;

  constructor(limit: number, intervalMs: number) {
    this.limit = limit;
    this.intervalMs = intervalMs;
  }

  public limitRequest(ip: string): RateLimiterResponse {
    const now = Date.now();
    let bucket = this.buckets.get(ip);

    if (!bucket) {
      bucket = { tokens: this.limit, lastRefill: now };
      this.buckets.set(ip, bucket);
    } else {
      // Refill tokens based on elapsed time
      const elapsed = now - bucket.lastRefill;
      const refillAmount = (elapsed / this.intervalMs) * this.limit;
      bucket.tokens = Math.min(this.limit, bucket.tokens + refillAmount);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        success: true,
        limit: this.limit,
        remaining: Math.floor(bucket.tokens),
        reset: now + this.intervalMs,
      };
    }

    return {
      success: false,
      limit: this.limit,
      remaining: 0,
      reset: now + this.intervalMs,
    };
  }
}

// Limit: 60 requests per 1 minute (60,000ms) for auth/contact paths
export const apiRateLimiter = new MemoryRateLimiter(60, 60000);
