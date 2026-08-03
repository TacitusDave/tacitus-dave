import { getRedis } from "@/lib/redis";
import { generateAccessKey, normalizeAccessKey } from "@/lib/access-key";

/** Paystack's documented subscription statuses, plus "manual" for admin-granted access with no real subscription behind it. */
export type SubscriptionStatus = "active" | "non-renewing" | "attention" | "completed" | "cancelled" | "manual";

export interface SubscriberRecord {
  email: string;
  paystackCustomerCode: string;
  paystackSubscriptionCode: string;
  status: SubscriptionStatus;
  plan: "monthly" | "annual";
  /** Unix seconds. */
  currentPeriodEnd: number;
  /**
   * Long-lived, license-key-style credential — persists for the life of the
   * subscription rather than expiring after one use. Generated once and
   * reused across grants/renewals so it never silently changes under the
   * subscriber.
   */
  accessKey: string;
}

function subscriberKey(email: string): string {
  return `subscriber:${email.toLowerCase()}`;
}

function accessKeyIndexKey(accessKey: string): string {
  return `access-key:${normalizeAccessKey(accessKey)}`;
}

export async function getSubscriber(email: string): Promise<SubscriberRecord | null> {
  return getRedis().get<SubscriberRecord>(subscriberKey(email));
}

export async function getSubscriberByAccessKey(accessKey: string): Promise<SubscriberRecord | null> {
  const email = await getRedis().get<string>(accessKeyIndexKey(accessKey));
  if (!email) return null;
  return getSubscriber(email);
}

export async function setSubscriber(record: SubscriberRecord): Promise<void> {
  const redis = getRedis();
  await redis.set(subscriberKey(record.email), record);
  await redis.set(accessKeyIndexKey(record.accessKey), record.email);
}

export function isActiveSubscriber(record: SubscriberRecord | null): boolean {
  if (!record) return false;
  if (record.status !== "active" && record.status !== "manual") return false;
  return record.currentPeriodEnd * 1000 > Date.now();
}

/** Admin-only: every subscriber record, most recently updated first isn't tracked — plain list. */
export async function listSubscribers(): Promise<SubscriberRecord[]> {
  const redis = getRedis();
  const keys = await redis.keys("subscriber:*");
  if (keys.length === 0) return [];

  const records = await Promise.all(keys.map((key) => redis.get<SubscriberRecord>(key)));
  return records.filter((record): record is SubscriberRecord => record !== null);
}

/** Admin-only: grant or extend access without going through Paystack (comps, manual overrides). */
export async function grantManualAccess(email: string, days: number): Promise<SubscriberRecord> {
  const existing = await getSubscriber(email);
  const record: SubscriberRecord = {
    email: email.toLowerCase(),
    paystackCustomerCode: existing?.paystackCustomerCode ?? "manual",
    paystackSubscriptionCode: existing?.paystackSubscriptionCode ?? "manual",
    status: existing?.status === "active" ? "active" : "manual",
    plan: existing?.plan ?? "monthly",
    currentPeriodEnd: Math.floor(Date.now() / 1000) + days * 24 * 60 * 60,
    accessKey: existing?.accessKey ?? generateAccessKey(),
  };
  await setSubscriber(record);
  return record;
}

/** Admin-only: immediately remove a subscriber's access. Does not touch Paystack. */
export async function revokeAccess(email: string): Promise<void> {
  const redis = getRedis();
  const existing = await getSubscriber(email);
  await redis.del(subscriberKey(email));
  if (existing?.accessKey) {
    await redis.del(accessKeyIndexKey(existing.accessKey));
  }
}
