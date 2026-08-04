import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature, type PaystackWebhookEvent } from "@/lib/paystack";
import { getSubscriber, setSubscriber, revokeAccess, type SubscriberRecord } from "@/lib/subscribers";
import { generateAccessKey } from "@/lib/access-key";
import { sendAccessKeyEmail } from "@/lib/email";
import { findOrCreateOrganization, getOrganizationByCustomerCode, setOrganizationStatus } from "@/lib/organizations";
import { createMembershipWithKey } from "@/lib/memberships";
import { appendInvoice } from "@/lib/invoices";

const ANNUAL_PLAN_CODE = process.env.PAYSTACK_PLAN_CODE_ANNUAL;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!verifyPaystackSignature(rawBody, signature)) {
    console.error("Paystack webhook signature verification failed.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    switch (event.event) {
      // Fired on the initial subscription charge and on every successful
      // recurring renewal — both should (re-)grant access.
      case "charge.success":
      case "subscription.create":
        await grantFromEvent(event);
        break;
      // Fired when a subscription is cancelled or completes its final cycle.
      case "subscription.disable":
        await revokeFromEvent(event);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Paystack webhook handling failed:", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function extractEmail(event: PaystackWebhookEvent): string | null {
  return event.data.customer?.email ?? null;
}

function extractPlanCode(event: PaystackWebhookEvent): string | null {
  const plan = event.data.plan;
  if (typeof plan === "string") return plan;
  if (plan && typeof plan === "object" && typeof plan.plan_code === "string") return plan.plan_code;
  return null;
}

function planFromCode(planCode: string | null): SubscriberRecord["plan"] {
  return planCode && planCode === ANNUAL_PLAN_CODE ? "annual" : "monthly";
}

/** Paystack sends amounts in kobo (1 naira = 100 kobo) — see the same conversion note in src/lib/paystack.ts. */
function extractAmountNgn(event: PaystackWebhookEvent): number | null {
  const amount = event.data.amount;
  return typeof amount === "number" ? amount / 100 : null;
}

async function grantFromEvent(event: PaystackWebhookEvent): Promise<void> {
  const email = extractEmail(event);
  if (!email) {
    console.error(`Paystack "${event.event}" event had no customer email — skipping.`);
    return;
  }

  const plan = planFromCode(extractPlanCode(event));

  const nextPaymentDate = event.data.next_payment_date;
  const currentPeriodEnd =
    typeof nextPaymentDate === "string"
      ? Math.floor(new Date(nextPaymentDate).getTime() / 1000)
      : Math.floor(Date.now() / 1000) + (plan === "annual" ? 365 : 31) * 24 * 60 * 60;

  // Reuse the existing key across renewals/re-subscribes so it never
  // silently changes under a subscriber who already has it saved.
  const existing = await getSubscriber(email);
  const isNewKey = !existing?.accessKey;
  const accessKey = existing?.accessKey ?? generateAccessKey();
  const paystackCustomerCode = String(event.data.customer_code ?? email);
  const paystackSubscriptionCode = String(event.data.subscription_code ?? "unknown");

  await setSubscriber({
    email,
    paystackCustomerCode,
    paystackSubscriptionCode,
    status: "active",
    plan,
    currentPeriodEnd,
    accessKey,
  });

  // Dual-write into the org/membership model (Phase 2 of the team-accounts
  // rollout) — the legacy subscriber record above stays the live read path
  // until Phase 3 cuts proxy.ts over. Reuses the same accessKey computed
  // above so a subscriber's key is identical whichever path is read.
  const org = await findOrCreateOrganization({
    paystackCustomerCode,
    paystackSubscriptionCode,
    ownerEmail: email,
    plan,
    status: "active",
    currentPeriodEnd,
  });
  await createMembershipWithKey({ orgId: org.id, email, role: "owner", accessKey });
  await appendInvoice({
    orgId: org.id,
    amountNgn: extractAmountNgn(event),
    plan,
    paidAt: Math.floor(Date.now() / 1000),
  });

  if (isNewKey) {
    await sendAccessKeyEmail(email, accessKey).catch((error) =>
      console.error("Failed to send access key email:", error),
    );
  }
}

async function revokeFromEvent(event: PaystackWebhookEvent): Promise<void> {
  const email = extractEmail(event);
  if (!email) {
    console.error(`Paystack "${event.event}" event had no customer email — skipping.`);
    return;
  }
  await revokeAccess(email);

  // Org-side: flip status rather than delete (see the Phase 2 plan's
  // "cancellation flips status, doesn't delete" rule) — membership records
  // and access keys stay intact but inert, so reactivation is a pure status
  // flip instead of re-provisioning every team member from scratch.
  const customerCode = String(event.data.customer_code ?? email);
  const org = await getOrganizationByCustomerCode(customerCode);
  if (org) {
    await setOrganizationStatus(org.id, "cancelled");
  }
}
