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
