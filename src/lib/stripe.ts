import Stripe from "stripe";

let client: Stripe | null = null;

/** Lazily constructed so a missing key fails at the call site, not at import time (breaking the whole build). */
export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  client = new Stripe(secretKey);
  return client;
}
