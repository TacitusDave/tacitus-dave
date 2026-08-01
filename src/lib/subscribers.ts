import { getRedis } from "@/lib/redis";

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
}

function subscriberKey(email: string): string {
  return `subscriber:${email.toLowerCase()}`;
}

export async function getSubscriber(email: string): Promise<SubscriberRecord | null> {
  return getRedis().get<SubscriberRecord>(subscriberKey(email));
}

export async function setSubscriber(record: SubscriberRecord): Promise<void> {
  await getRedis().set(subscriberKey(record.email), record);
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
  };
  await setSubscriber(record);
  return record;
}

/** Admin-only: immediately remove a subscriber's access. Does not touch Paystack. */
export async function revokeAccess(email: string): Promise<void> {
  await getRedis().del(subscriberKey(email));
}
