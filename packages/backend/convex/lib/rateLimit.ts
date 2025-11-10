/**
 * Simple in-memory rate limiting utility
 * Tracks operations per identifier (e.g., contactSessionId) within time windows
 */

import {ConvexError} from "convex/values";

// Rate limit storage: identifier => timestamps of recent requests
const rateLimitStore = new Map<string, number[]>();

// Cleanup old rate limit data periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitStore.entries()) {
    // Keep only timestamps from last hour
    const filtered = timestamps.filter(t => now - t < 60 * 60 * 1000);
    if (filtered.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, filtered);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom error message */
  errorMessage?: string;
}

/**
 * Check if an identifier has exceeded rate limits
 * @param identifier - Unique identifier (e.g., contactSessionId, IP address)
 * @param config - Rate limit configuration
 * @throws ConvexError if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): void {
  const now = Date.now();
  const timestamps = rateLimitStore.get(identifier) || [];

  // Filter to only recent timestamps within the window
  const recentTimestamps = timestamps.filter(
    t => now - t < config.windowMs
  );

  if (recentTimestamps.length >= config.maxRequests) {
    const oldestTimestamp = Math.min(...recentTimestamps);
    const resetTime = oldestTimestamp + config.windowMs;
    const waitSeconds = Math.ceil((resetTime - now) / 1000);

    throw new ConvexError({
      code: "TOO_MANY_REQUESTS",
      message: config.errorMessage ||
        `Rate limit exceeded. Please try again in ${waitSeconds} seconds.`,
      retryAfter: waitSeconds
    });
  }

  // Record this request
  recentTimestamps.push(now);
  rateLimitStore.set(identifier, recentTimestamps);
}

/**
 * Common rate limit presets
 */
export const RateLimits = {
  /** 10 messages per minute per session */
  MESSAGE_CREATION: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    errorMessage: "Too many messages. Please wait a moment before sending more."
  },
  /** 5 session creations per 5 minutes per identifier */
  SESSION_CREATION: {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000,
    errorMessage: "Too many session creation attempts. Please try again later."
  }
} as const;
