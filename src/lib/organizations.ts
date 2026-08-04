import { getRedis } from "@/lib/redis";

/** Same statuses Paystack (plus "manual" for admin-granted access) already uses for individual subscribers. */
export type OrganizationStatus = "active" | "non-renewing" | "attention" | "completed" | "cancelled" | "manual";

export interface OrganizationRecord {
  id: string;
  name: string;
  ownerEmail: string;
  paystackCustomerCode: string;
  paystackSubscriptionCode: string;
  status: OrganizationStatus;
  plan: "monthly" | "annual";
  /** Unix seconds. */
  currentPeriodEnd: number;
  /** Unix seconds. */
  createdAt: number;
}

const ALL_ORG_IDS_KEY = "all-org-ids";

function orgKey(id: string): string {
  return `org:${id}`;
}

function orgByCustomerCodeKey(customerCode: string): string {
  return `org-by-customer-code:${customerCode}`;
}

/**
 * `crypto.randomUUID()` as a bare global (not `node:crypto`) so this works
 * identically whether called from a Node.js route handler or from Proxy,
 * which Next.js can run on either runtime — same reasoning as the Web
 * Crypto usage in signed-token.ts.
 */
export function generateOrgId(): string {
  return crypto.randomUUID();
}

export async function getOrganization(id: string): Promise<OrganizationRecord | null> {
  return getRedis().get<OrganizationRecord>(orgKey(id));
}

export async function getOrganizationByCustomerCode(
  customerCode: string,
): Promise<OrganizationRecord | null> {
  const id = await getRedis().get<string>(orgByCustomerCodeKey(customerCode));
  if (!id) return null;
  return getOrganization(id);
}

export async function setOrganization(record: OrganizationRecord): Promise<void> {
  const redis = getRedis();
  await redis.set(orgKey(record.id), record);
  await redis.set(orgByCustomerCodeKey(record.paystackCustomerCode), record.id);
  await redis.sadd(ALL_ORG_IDS_KEY, record.id);
}

/**
 * Finds the org already billed to this Paystack customer, or creates one.
 * Used by the webhook, which only ever knows the customer code — not
 * whether this is a first charge or a renewal.
 */
export async function findOrCreateOrganization(params: {
  paystackCustomerCode: string;
  paystackSubscriptionCode: string;
  ownerEmail: string;
  plan: OrganizationRecord["plan"];
  status: OrganizationStatus;
  currentPeriodEnd: number;
}): Promise<OrganizationRecord> {
  const existing = await getOrganizationByCustomerCode(params.paystackCustomerCode);
  const record: OrganizationRecord = {
    id: existing?.id ?? generateOrgId(),
    name: existing?.name ?? `${params.ownerEmail}'s workspace`,
    ownerEmail: existing?.ownerEmail ?? params.ownerEmail,
    paystackCustomerCode: params.paystackCustomerCode,
    paystackSubscriptionCode: params.paystackSubscriptionCode,
    status: params.status,
    plan: params.plan,
    currentPeriodEnd: params.currentPeriodEnd,
    createdAt: existing?.createdAt ?? Math.floor(Date.now() / 1000),
  };
  await setOrganization(record);
  return record;
}

export function isActiveOrganization(record: OrganizationRecord | null): boolean {
  if (!record) return false;
  if (record.status !== "active" && record.status !== "manual") return false;
  return record.currentPeriodEnd * 1000 > Date.now();
}

/** Admin-only: every organization, via the `all-org-ids` Set — not a `KEYS org:*` scan (see Phase 2 plan notes on keyspace-wide scan cost). */
export async function listOrganizations(): Promise<OrganizationRecord[]> {
  const redis = getRedis();
  const ids = await redis.smembers(ALL_ORG_IDS_KEY);
  if (ids.length === 0) return [];

  const records = await redis.mget<(OrganizationRecord | null)[]>(...ids.map(orgKey));
  return records.filter((record): record is OrganizationRecord => record !== null);
}

/** Admin-only: flips status without touching Paystack — mirrors the "cancellation flips status, doesn't delete" rule from the Phase 2 plan. */
export async function setOrganizationStatus(id: string, status: OrganizationStatus): Promise<void> {
  const record = await getOrganization(id);
  if (!record) return;
  await setOrganization({ ...record, status });
}

/**
 * Admin-only: grant or extend org access with no real Paystack subscription
 * behind it (comps, manual overrides) — same reasoning as
 * subscribers.ts's grantManualAccess. Uses a synthetic, deterministic
 * "manual:{email}" customer code so repeat grants extend the same org
 * instead of creating duplicates.
 */
export async function grantManualOrganization(email: string, days: number): Promise<OrganizationRecord> {
  const customerCode = `manual:${email.toLowerCase()}`;
  const existing = await getOrganizationByCustomerCode(customerCode);
  const record: OrganizationRecord = {
    id: existing?.id ?? generateOrgId(),
    name: existing?.name ?? `${email}'s workspace`,
    ownerEmail: existing?.ownerEmail ?? email,
    paystackCustomerCode: customerCode,
    paystackSubscriptionCode: existing?.paystackSubscriptionCode ?? "manual",
    status: existing?.status === "active" ? "active" : "manual",
    plan: existing?.plan ?? "monthly",
    currentPeriodEnd: Math.floor(Date.now() / 1000) + days * 24 * 60 * 60,
    createdAt: existing?.createdAt ?? Math.floor(Date.now() / 1000),
  };
  await setOrganization(record);
  return record;
}
