import { getRedis } from "@/lib/redis";
import { SESSION_TTL_SECONDS } from "@/lib/session";

// The owner access code (owner-code.ts) is a shared secret, not tied to any
// email — whoever redeems it gets a session with no individual identity
// attached. This module is the accountability layer on top of that: each
// redemption gets its own record (who/when, by IP) so an admin can see who's
// been using it, and revoke one specific redemption without rotating
// OWNER_CODE_SECRET and kicking every legitimate use off at once.
export interface OwnerSessionRecord {
  sessionId: string;
  ip: string;
  /** Unix seconds. */
  createdAt: number;
}

const SESSIONS_SET_KEY = "owner-sessions";

function sessionKey(sessionId: string): string {
  return `owner-session:${sessionId}`;
}

/** Creates a new tracked redemption and returns its id, to be embedded in the session token. */
export async function createOwnerSession(ip: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const record: OwnerSessionRecord = {
    sessionId,
    ip,
    createdAt: Math.floor(Date.now() / 1000),
  };
  const redis = getRedis();
  // TTL matches the session cookie's own lifetime — nothing to track once
  // the token it belongs to can no longer be presented anyway.
  await redis.set(sessionKey(sessionId), record, { ex: SESSION_TTL_SECONDS });
  await redis.sadd(SESSIONS_SET_KEY, sessionId);
  return sessionId;
}

export async function isOwnerSessionActive(sessionId: string): Promise<boolean> {
  const record = await getRedis().get<OwnerSessionRecord>(sessionKey(sessionId));
  return record !== null;
}

/**
 * Lists tracked redemptions, newest first. Opportunistically prunes ids
 * whose record already expired via Redis TTL — the Set doesn't expire on
 * its own, so this keeps it from accumulating dead entries forever without
 * needing a separate cleanup job.
 */
export async function listOwnerSessions(): Promise<OwnerSessionRecord[]> {
  const redis = getRedis();
  const ids = await redis.smembers(SESSIONS_SET_KEY);
  if (ids.length === 0) return [];

  const records = await redis.mget<(OwnerSessionRecord | null)[]>(...ids.map(sessionKey));

  const stale = ids.filter((_, i) => records[i] === null);
  if (stale.length > 0) {
    await redis.srem(SESSIONS_SET_KEY, ...stale);
  }

  return records
    .filter((record): record is OwnerSessionRecord => record !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** Revocation is deletion, not a flag — there's no "reactivate," just re-enter the code for a fresh session. */
export async function revokeOwnerSession(sessionId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(sessionKey(sessionId));
  await redis.srem(SESSIONS_SET_KEY, sessionId);
}
