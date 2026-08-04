import { getRedis } from "@/lib/redis";
import { generateAccessKey, normalizeAccessKey } from "@/lib/access-key";

export type MembershipRole = "owner" | "admin" | "member";

export interface MembershipRecord {
  orgId: string;
  email: string;
  role: MembershipRole;
  /** Each member gets their own key — revoking one member never affects anyone else's. */
  accessKey: string;
  /** Unix seconds. */
  invitedAt: number;
  /** Unix seconds — always set today (invites live as separate pending `Invite` records until accepted; a Membership only exists once someone has actually joined). Kept nullable for schema flexibility. */
  joinedAt: number | null;
}

interface AccessKeyIndexEntry {
  orgId: string;
  email: string;
}

function membershipKey(orgId: string, email: string): string {
  return `membership:${orgId}:${email.toLowerCase()}`;
}

function orgMembersKey(orgId: string): string {
  return `org-members:${orgId}`;
}

function emailOrgsKey(email: string): string {
  return `email-orgs:${email.toLowerCase()}`;
}

function accessKeyIndexKey(accessKey: string): string {
  return `access-key:${normalizeAccessKey(accessKey)}`;
}

export async function getMembership(orgId: string, email: string): Promise<MembershipRecord | null> {
  return getRedis().get<MembershipRecord>(membershipKey(orgId, email));
}

export async function getMembershipByAccessKey(accessKey: string): Promise<MembershipRecord | null> {
  const entry = await getRedis().get<AccessKeyIndexEntry>(accessKeyIndexKey(accessKey));
  if (!entry) return null;
  return getMembership(entry.orgId, entry.email);
}

/** All orgs this email belongs to, via `email-orgs` — needed because one email can be a member of more than one org. */
export async function getOrgIdsForEmail(email: string): Promise<string[]> {
  return getRedis().smembers(emailOrgsKey(email));
}

export async function listOrgMembers(orgId: string): Promise<MembershipRecord[]> {
  const redis = getRedis();
  const emails = await redis.smembers(orgMembersKey(orgId));
  if (emails.length === 0) return [];

  const records = await redis.mget<(MembershipRecord | null)[]>(
    ...emails.map((email) => membershipKey(orgId, email)),
  );
  return records.filter((record): record is MembershipRecord => record !== null);
}

async function writeMembership(record: MembershipRecord): Promise<void> {
  const redis = getRedis();
  await redis.set(membershipKey(record.orgId, record.email), record);
  await redis.set(accessKeyIndexKey(record.accessKey), {
    orgId: record.orgId,
    email: record.email,
  } satisfies AccessKeyIndexEntry);
  await redis.sadd(orgMembersKey(record.orgId), record.email.toLowerCase());
  await redis.sadd(emailOrgsKey(record.email), record.orgId);
}

/** Creates a brand-new membership with a freshly generated access key. Used for org creation (owner) and invite acceptance. */
export async function createMembership(params: {
  orgId: string;
  email: string;
  role: MembershipRole;
}): Promise<MembershipRecord> {
  const now = Math.floor(Date.now() / 1000);
  const record: MembershipRecord = {
    orgId: params.orgId,
    email: params.email.toLowerCase(),
    role: params.role,
    accessKey: generateAccessKey(),
    invitedAt: now,
    joinedAt: now,
  };
  await writeMembership(record);
  return record;
}

/**
 * Reuses an existing access key rather than generating a new one — used by
 * the Paystack webhook and the one-off migration script, so a subscriber's
 * key never silently changes across a renewal or the org migration.
 */
export async function createMembershipWithKey(params: {
  orgId: string;
  email: string;
  role: MembershipRole;
  accessKey: string;
}): Promise<MembershipRecord> {
  const existing = await getMembership(params.orgId, params.email);
  const now = Math.floor(Date.now() / 1000);
  const record: MembershipRecord = {
    orgId: params.orgId,
    email: params.email.toLowerCase(),
    role: params.role,
    accessKey: params.accessKey,
    invitedAt: existing?.invitedAt ?? now,
    joinedAt: existing?.joinedAt ?? now,
  };
  await writeMembership(record);
  return record;
}

async function countOwners(orgId: string): Promise<number> {
  const members = await listOrgMembers(orgId);
  return members.filter((member) => member.role === "owner").length;
}

/** Throws rather than silently no-op'ing — callers (API routes) should catch and turn this into a 400. */
export async function assertNotLastOwner(orgId: string, email: string): Promise<void> {
  const member = await getMembership(orgId, email);
  if (member?.role !== "owner") return;
  const owners = await countOwners(orgId);
  if (owners <= 1) {
    throw new Error("Can't remove the only owner — promote someone else first.");
  }
}

/** Deletes the membership, its access key, and both index Sets. Enforces the last-owner invariant. */
export async function removeMembership(orgId: string, email: string): Promise<void> {
  await assertNotLastOwner(orgId, email);

  const redis = getRedis();
  const existing = await getMembership(orgId, email);
  await redis.del(membershipKey(orgId, email));
  if (existing?.accessKey) {
    await redis.del(accessKeyIndexKey(existing.accessKey));
  }
  await redis.srem(orgMembersKey(orgId), email.toLowerCase());
  await redis.srem(emailOrgsKey(email), orgId);
}

export async function changeMembershipRole(
  orgId: string,
  email: string,
  role: MembershipRole,
): Promise<MembershipRecord> {
  const existing = await getMembership(orgId, email);
  if (!existing) throw new Error("No such member.");

  if (existing.role === "owner" && role !== "owner") {
    await assertNotLastOwner(orgId, email);
  }

  const updated: MembershipRecord = { ...existing, role };
  await getRedis().set(membershipKey(orgId, email), updated);
  return updated;
}
