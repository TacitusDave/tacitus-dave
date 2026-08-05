import { getRedis } from "@/lib/redis";
import { SESSION_TTL_SECONDS } from "@/lib/session";
import { currentOwnerCodeEpoch } from "@/lib/owner-code";

// The owner access code (owner-code.ts) is a shared secret, not tied to any
// email — whoever redeems it gets a session with no individual identity
// attached. This module is the accountability layer on top of that: each
// redemption gets its own record (who/when, by IP) so an admin can see who's
// been using it, and revoke one specific redemption without rotating
// OWNER_CODE_SECRET and kicking every legitimate use off at once.
//
// Every redemption is also stamped with the code's epoch at that moment
// (see currentOwnerCodeEpoch). Whenever the code itself rotates — its
// normal 12-hour self-rotation, or a manual OWNER_CODE_SECRET regeneration —
// the epoch changes, and every session stamped with the old one stops being
// valid the next time it's checked. That's a deliberate "the code refreshed,
// everyone starts fresh" guarantee: no session outlives the code it was
// redeemed with, regardless of the 30-day cookie TTL.
export interface OwnerSessionRecord {
  sessionId: string;
  ip: string;
  /** Unix seconds. */
  createdAt: number;
  /** The code epoch this session was redeemed under — see currentOwnerCodeEpoch. */
  epoch: string;
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
    epoch: await currentOwnerCodeEpoch(),
  };
  const redis = getRedis();
  // TTL matches the session cookie's own lifetime — nothing to track once
  // the token it belongs to can no longer be presented anyway. In practice
  // the epoch check below almost always invalidates a session well before
  // this TTL is reached.
  await redis.set(sessionKey(sessionId), record, { ex: SESSION_TTL_SECONDS });
  await redis.sadd(SESSIONS_SET_KEY, sessionId);
  return sessionId;
}

/**
 * A session is active only if it both exists AND was redeemed under the
 * code's current epoch — a stale-epoch record is treated as inactive (and
 * opportunistically deleted, since there's no scenario where it becomes
 * valid again) even though its own TTL hasn't expired yet.
 */
export async function isOwnerSessionActive(sessionId: string): Promise<boolean> {
  const redis = getRedis();
  const record = await redis.get<OwnerSessionRecord>(sessionKey(sessionId));
  if (!record) return false;

  const epoch = await currentOwnerCodeEpoch();
  if (record.epoch !== epoch) {
    await redis.del(sessionKey(sessionId));
    await redis.srem(SESSIONS_SET_KEY, sessionId);
    return false;
  }
  return true;
}

/**
 * Lists tracked redemptions, newest first. Opportunistically prunes ids
 * whose record already expired via Redis TTL, or whose epoch is stale (the
 * code has rotated since) — the Set doesn't expire on its own, so this
 * keeps it from accumulating dead entries without needing a separate
 * cleanup job, and means the admin panel only ever shows genuinely current
 * sessions.
 */
export async function listOwnerSessions(): Promise<OwnerSessionRecord[]> {
  const redis = getRedis();
  const ids = await redis.smembers(SESSIONS_SET_KEY);
  if (ids.length === 0) return [];

  const [records, epoch] = await Promise.all([
    redis.mget<(OwnerSessionRecord | null)[]>(...ids.map(sessionKey)),
    currentOwnerCodeEpoch(),
  ]);

  const stale = ids.filter((_, i) => {
    const record = records[i];
    return record === null || record.epoch !== epoch;
  });
  if (stale.length > 0) {
    await Promise.all(stale.map((id) => redis.del(sessionKey(id))));
    await redis.srem(SESSIONS_SET_KEY, ...stale);
  }

  return records
    .filter((record): record is OwnerSessionRecord => record !== null && record.epoch === epoch)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** Revocation is deletion, not a flag — there's no "reactivate," just re-enter the code for a fresh session. */
export async function revokeOwnerSession(sessionId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(sessionKey(sessionId));
  await redis.srem(SESSIONS_SET_KEY, sessionId);
}
