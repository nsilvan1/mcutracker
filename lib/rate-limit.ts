import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000); // Clean every minute

export function rateLimit(config: RateLimitConfig = { interval: 60000, maxRequests: 100 }) {
  return async function rateLimitMiddleware(
    request: NextRequest,
    identifier?: string
  ): Promise<{ success: boolean; remaining: number; reset: number } | null> {
    // Get identifier (IP address or custom identifier)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const key = identifier || ip;
    const now = Date.now();

    // Initialize or get existing record
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + config.interval,
      };
    }

    // Increment count
    store[key].count++;

    const remaining = Math.max(0, config.maxRequests - store[key].count);
    const reset = store[key].resetTime;

    // Check if over limit
    if (store[key].count > config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset,
      };
    }

    return {
      success: true,
      remaining,
      reset,
    };
  };
}

// Helper to create rate limit response
export function rateLimitResponse(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);

  return NextResponse.json(
    {
      error: 'Muitas requisições. Tente novamente em alguns segundos.',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Reset': String(reset),
      },
    }
  );
}

// Preset configurations
export const rateLimitConfigs = {
  // General API: 100 requests per minute
  general: { interval: 60000, maxRequests: 100 },

  // Auth endpoints: 10 requests per minute (stricter)
  auth: { interval: 60000, maxRequests: 10 },

  // Progress updates: 30 requests per minute
  progress: { interval: 60000, maxRequests: 30 },

  // Admin endpoints: 50 requests per minute
  admin: { interval: 60000, maxRequests: 50 },
};

// Helper function to apply rate limiting in API routes
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig = rateLimitConfigs.general
): Promise<NextResponse | null> {
  const limiter = rateLimit(config);
  const result = await limiter(request);

  if (result && !result.success) {
    return rateLimitResponse(result.reset);
  }

  return null; // Continue with the request
}
