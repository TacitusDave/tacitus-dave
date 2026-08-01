import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Thin fetch-based wrapper around Paystack's REST API. There's no official
 * Paystack Node SDK (unlike Stripe's), and their API is plain REST/JSON, so
 * a hand-written client is more honest than depending on an unofficial,
 * unverified community package for something this simple. The one place
 * correctness actually matters — webhook signature verification — uses
 * Node's built-in `crypto`, the same HMAC pattern already used elsewhere
 * in this codebase (admin session signing, JWT verification).
 */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function requireSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  planCode: string;
  callbackUrl: string;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(params: InitializeTransactionParams): Promise<string> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      plan: params.planCode,
      callback_url: params.callbackUrl,
    }),
  });

  const data = (await response.json()) as PaystackInitializeResponse;
  if (!response.ok || !data.status || !data.data) {
    throw new Error(data.message || "Paystack couldn't start a transaction.");
  }

  return data.data.authorization_url;
}

/**
 * Verifies the `x-paystack-signature` header: HMAC-SHA512 of the raw
 * request body, keyed with the secret key (Paystack has no separate
 * webhook signing secret the way Stripe does). Must run against the raw,
 * unparsed body — parsing and re-serializing JSON can change byte-for-byte
 * output and break the comparison.
 */
export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const hash = createHmac("sha512", requireSecretKey()).update(rawBody).digest("hex");
  const hashBuffer = Buffer.from(hash, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (hashBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(hashBuffer, signatureBuffer);
}

/**
 * Paystack has no official TypeScript types (no official SDK at all), so
 * this is intentionally loose — verified against Paystack's documented
 * payload shapes, not a vetted type definition. Confirm against a real
 * test webhook delivery once a live account is connected.
 */
export interface PaystackWebhookEvent {
  event: string;
  data: {
    customer?: { email?: string };
    plan?: { plan_code?: string; interval?: string } | string | null;
    subscription_code?: string;
    customer_code?: string;
    status?: string;
    next_payment_date?: string;
    [key: string]: unknown;
  };
}
