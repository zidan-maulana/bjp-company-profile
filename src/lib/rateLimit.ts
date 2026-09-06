/**
 * BJP Security Rate Limiting Engine (Anti-Brute Force & Anti-Spam)
 * 
 * Provides in-memory rate limiting with globalThis persistence:
 * 1. Login Protection: Max 5 failed attempts per email before a 15-minute lockout.
 * 2. OTP Request Protection: 60s cooldown between requests, max 3 requests per 10 minutes.
 * 3. Memory Cleanup: Automatically purges stale records to avoid memory leaks.
 */

interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil?: number;
  lastAttemptAt: number;
}

interface OtpRequestRecord {
  requestTimes: number[];
  lastRequestedAt: number;
}

interface GlobalRateLimitStore {
  loginAttempts?: Map<string, RateLimitRecord>;
  otpRequests?: Map<string, OtpRequestRecord>;
}

const globalForRateLimit = globalThis as unknown as {
  bjpRateLimitStore?: GlobalRateLimitStore;
};

if (!globalForRateLimit.bjpRateLimitStore) {
  globalForRateLimit.bjpRateLimitStore = {
    loginAttempts: new Map<string, RateLimitRecord>(),
    otpRequests: new Map<string, OtpRequestRecord>(),
  };
}

const store = globalForRateLimit.bjpRateLimitStore;
const loginAttemptsMap = store.loginAttempts!;
const otpRequestsMap = store.otpRequests!;

// Configuration Constants
export const RATE_LIMIT_CONFIG = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes lockout
    WINDOW_RESET_MS: 30 * 60 * 1000, // Reset attempt counter if no activity for 30m
  },
  OTP_REQUEST: {
    COOLDOWN_SECONDS: 60, // Minimum 60 seconds between OTP requests
    MAX_REQUESTS_IN_WINDOW: 3, // Max 3 requests per 10 minutes
    WINDOW_MS: 10 * 60 * 1000, // 10 minutes window
  },
  OTP_VERIFY: {
    MAX_GUESSES: 5, // Invalidate OTP after 5 wrong attempts
  },
};

/**
 * Periodically or opportunistically cleans up stale records.
 */
function pruneStaleRecords() {
  const now = Date.now();

  // Prune login records inactive for > 1 hour and not currently locked
  if (loginAttemptsMap.size > 200) {
    for (const [key, record] of loginAttemptsMap.entries()) {
      const isLocked = record.lockedUntil && record.lockedUntil > now;
      const isStale = now - record.lastAttemptAt > 60 * 60 * 1000;
      if (!isLocked && isStale) {
        loginAttemptsMap.delete(key);
      }
    }
  }

  // Prune OTP request records older than 15 minutes
  if (otpRequestsMap.size > 200) {
    for (const [key, record] of otpRequestsMap.entries()) {
      if (now - record.lastRequestedAt > 15 * 60 * 1000) {
        otpRequestsMap.delete(key);
      }
    }
  }
}

/**
 * Check if login is allowed for an email.
 */
export function checkLoginRateLimit(email: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  pruneStaleRecords();
  const key = email.toLowerCase().trim();
  const record = loginAttemptsMap.get(key);
  const now = Date.now();

  if (!record) {
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
    };
  }

  // If locked, check if lockout period has expired
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    } else {
      // Lockout expired: reset record
      loginAttemptsMap.delete(key);
      return {
        allowed: true,
        remainingAttempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
      };
    }
  }

  // If no activity for WINDOW_RESET_MS, reset count
  if (now - record.lastAttemptAt > RATE_LIMIT_CONFIG.LOGIN.WINDOW_RESET_MS) {
    loginAttemptsMap.delete(key);
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
    };
  }

  const remaining = Math.max(0, RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS - record.failedAttempts);
  return {
    allowed: remaining > 0,
    remainingAttempts: remaining,
  };
}

/**
 * Record a failed login attempt for an email.
 */
export function recordFailedLogin(email: string): {
  allowed: boolean;
  remainingAttempts: number;
  locked: boolean;
  retryAfterSeconds?: number;
} {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  let record = loginAttemptsMap.get(key);

  if (!record || (record.lockedUntil && now >= record.lockedUntil)) {
    record = {
      failedAttempts: 0,
      lastAttemptAt: now,
    };
  }

  record.failedAttempts += 1;
  record.lastAttemptAt = now;

  if (record.failedAttempts >= RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS) {
    record.lockedUntil = now + RATE_LIMIT_CONFIG.LOGIN.LOCKOUT_DURATION_MS;
    loginAttemptsMap.set(key, record);
    const retryAfterSeconds = Math.ceil(RATE_LIMIT_CONFIG.LOGIN.LOCKOUT_DURATION_MS / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      locked: true,
      retryAfterSeconds,
    };
  }

  loginAttemptsMap.set(key, record);
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS - record.failedAttempts);

  return {
    allowed: true,
    remainingAttempts: remaining,
    locked: false,
  };
}

/**
 * Reset login attempts on successful authentication.
 */
export function resetLoginAttempts(email: string): void {
  const key = email.toLowerCase().trim();
  loginAttemptsMap.delete(key);
}

/**
 * Check if an OTP request is allowed for an email.
 */
export function checkOtpRequestRateLimit(email: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: "cooldown" | "max_reached";
} {
  pruneStaleRecords();
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const record = otpRequestsMap.get(key);

  if (!record) {
    return { allowed: true };
  }

  // 1. Check Cooldown (Minimum 60 seconds between requests)
  const secondsSinceLast = Math.floor((now - record.lastRequestedAt) / 1000);
  if (secondsSinceLast < RATE_LIMIT_CONFIG.OTP_REQUEST.COOLDOWN_SECONDS) {
    const retryAfterSeconds = RATE_LIMIT_CONFIG.OTP_REQUEST.COOLDOWN_SECONDS - secondsSinceLast;
    return {
      allowed: false,
      retryAfterSeconds,
      reason: "cooldown",
    };
  }

  // 2. Check Window Limits (Max 3 requests per 10 minutes)
  const windowStart = now - RATE_LIMIT_CONFIG.OTP_REQUEST.WINDOW_MS;
  const recentRequests = record.requestTimes.filter((t) => t > windowStart);

  if (recentRequests.length >= RATE_LIMIT_CONFIG.OTP_REQUEST.MAX_REQUESTS_IN_WINDOW) {
    const oldestInWindow = recentRequests[0];
    const retryAfterSeconds = Math.ceil((oldestInWindow + RATE_LIMIT_CONFIG.OTP_REQUEST.WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds,
      reason: "max_reached",
    };
  }

  return { allowed: true };
}

/**
 * Record a dispatched OTP request.
 */
export function recordOtpRequest(email: string): void {
  const key = email.toLowerCase().trim();
  const now = Date.now();
  const record = otpRequestsMap.get(key);

  if (!record) {
    otpRequestsMap.set(key, {
      requestTimes: [now],
      lastRequestedAt: now,
    });
    return;
  }

  const windowStart = now - RATE_LIMIT_CONFIG.OTP_REQUEST.WINDOW_MS;
  const recentRequests = record.requestTimes.filter((t) => t > windowStart);
  recentRequests.push(now);

  otpRequestsMap.set(key, {
    requestTimes: recentRequests,
    lastRequestedAt: now,
  });
}
