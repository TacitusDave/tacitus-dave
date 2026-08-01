import { getRedis } from "@/lib/redis";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60 * 15; // 15 minutes

function attemptsKey(scope: string, identifier: string): string {
  return `rate-limit:${scope}:${identifier}`;
}

/**
 * Fixed-window lockout: `identifier` (e.g. an IP address) gets MAX_ATTEMPTS
 * failures within LOCKOUT_SECONDS before being blocked for the rest of that
 * window. Call `recordFailure` only after a failed check; a successful login
 * should call `clearAttempts` so a legitimate user isn't left locked out by
 * their own earlier typos.
 */
export async function isLockedOut(scope: string, identifier: string): Promise<boolean> {
  const redis = getRedis();
  const count = await redis.get<number>(attemptsKey(scope, identifier));
  return (count ?? 0) >= MAX_ATTEMPTS;
}

export async function recordFailure(scope: string, identifier: string): Promise<void> {
  const redis = getRedis();
  const key = attemptsKey(scope, identifier);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, LOCKOUT_SECONDS);
  }
}

export async function clearAttempts(scope: string, identifier: string): Promise<void> {
  await getRedis().del(attemptsKey(scope, identifier));
}
