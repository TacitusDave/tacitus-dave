import type Stripe from "stripe";
import { getRedis } from "@/lib/redis";

export interface SubscriberRecord {
  email: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: Stripe.Subscription.Status;
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
  if (record.status !== "active" && record.status !== "trialing") return false;
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

/** Admin-only: grant or extend access without going through Stripe (comps, manual overrides). */
export async function grantManualAccess(email: string, days: number): Promise<SubscriberRecord> {
  const existing = await getSubscriber(email);
  const record: SubscriberRecord = {
    email: email.toLowerCase(),
    stripeCustomerId: existing?.stripeCustomerId ?? "manual",
    stripeSubscriptionId: existing?.stripeSubscriptionId ?? "manual",
    status: "active",
    plan: existing?.plan ?? "monthly",
    currentPeriodEnd: Math.floor(Date.now() / 1000) + days * 24 * 60 * 60,
  };
  await setSubscriber(record);
  return record;
}

/** Admin-only: immediately remove a subscriber's access. Does not touch Stripe. */
export async function revokeAccess(email: string): Promise<void> {
  await getRedis().del(subscriberKey(email));
}
