import { getRedis } from "@/lib/redis";
import { createSignedToken, verifySignedToken } from "@/lib/signed-token";
import type { MembershipRole } from "@/lib/memberships";

// Own secret, own TTL — not reused from SESSION_SECRET or its 30-day
// lifetime, same key-separation reasoning as ADMIN_SESSION_SECRET being
// kept apart from SESSION_SECRET elsewhere in this codebase.
const INVITE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface InviteRecord {
  id: string;
  orgId: string;
  orgName: string;
  email: string;
  role: MembershipRole;
  invitedBy: string;
  /** Unix seconds. */
  createdAt: number;
}

function requireInviteSecret(): string {
  const secret = process.env.INVITE_SECRET;
  if (!secret) throw new Error("INVITE_SECRET is not set");
  return secret;
}

function inviteKey(id: string): string {
  return `invite:${id}`;
}

function orgInvitesKey(orgId: string): string {
  return `org-invites:${orgId}`;
}

/**
 * Returns both the Redis-backed record and the signed token to put in the
 * email link. The token's signature stops anyone from tampering with the
 * embedded orgId/role by editing the URL; the Redis record (with its own
 * matching TTL) is the actual source of truth for expiry, cancellation, and
 * single-use — a bare signed token can't provide any of those on its own.
 */
export async function createInvite(params: {
  orgId: string;
  orgName: string;
  email: string;
  role: MembershipRole;
  invitedBy: string;
}): Promise<{ record: InviteRecord; token: string }> {
  const id = crypto.randomUUID();
  const record: InviteRecord = {
    id,
    orgId: params.orgId,
    orgName: params.orgName,
    email: params.email.toLowerCase(),
    role: params.role,
    invitedBy: params.invitedBy,
    createdAt: Math.floor(Date.now() / 1000),
  };

  const redis = getRedis();
  await redis.set(inviteKey(id), record, { ex: INVITE_TTL_SECONDS });
  await redis.sadd(orgInvitesKey(params.orgId), id);

  const token = await createSignedToken({ inviteId: id }, requireInviteSecret(), INVITE_TTL_SECONDS);
  return { record, token };
}

/** Read-only peek — used to render "Accept invite from {org}" on GET without consuming anything (link-scanners must not burn the invite). */
export async function peekInvite(token: string): Promise<InviteRecord | null> {
  const payload = await verifySignedToken<{ inviteId: string }>(token, requireInviteSecret());
  if (!payload?.inviteId) return null;
  return getRedis().get<InviteRecord>(inviteKey(payload.inviteId));
}

/**
 * Atomically consumes the invite via GETDEL — a single Redis command, so two
 * concurrent redemptions (a forwarded link, two open tabs) can't both
 * succeed. Whichever request wins gets the record; the other gets null and
 * should show "this invite has already been used."
 */
export async function consumeInvite(token: string): Promise<InviteRecord | null> {
  const payload = await verifySignedToken<{ inviteId: string }>(token, requireInviteSecret());
  if (!payload?.inviteId) return null;

  const record = await getRedis().getdel<InviteRecord>(inviteKey(payload.inviteId));
  if (record) {
    await getRedis().srem(orgInvitesKey(record.orgId), record.id);
  }
  return record;
}

export async function cancelInvite(orgId: string, inviteId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(inviteKey(inviteId));
  await redis.srem(orgInvitesKey(orgId), inviteId);
}

export async function listPendingInvites(orgId: string): Promise<InviteRecord[]> {
  const redis = getRedis();
  const ids = await redis.smembers(orgInvitesKey(orgId));
  if (ids.length === 0) return [];

  const records = await redis.mget<(InviteRecord | null)[]>(...ids.map(inviteKey));
  // Expired invites vanish from Redis on their own (TTL) but can linger in
  // the Set until then — filter nulls rather than trusting the Set alone.
  return records.filter((record): record is InviteRecord => record !== null);
}
