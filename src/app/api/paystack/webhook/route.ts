import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature, type PaystackWebhookEvent } from "@/lib/paystack";
import { setSubscriber, revokeAccess, type SubscriberRecord } from "@/lib/subscribers";

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

  await setSubscriber({
    email,
    paystackCustomerCode: String(event.data.customer_code ?? email),
    paystackSubscriptionCode: String(event.data.subscription_code ?? "unknown"),
    status: "active",
    plan,
    currentPeriodEnd,
  });
}

async function revokeFromEvent(event: PaystackWebhookEvent): Promise<void> {
  const email = extractEmail(event);
  if (!email) {
    console.error(`Paystack "${event.event}" event had no customer email — skipping.`);
    return;
  }
  await revokeAccess(email);
}
