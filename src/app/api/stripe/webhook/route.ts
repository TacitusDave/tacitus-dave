import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { setSubscriber, type SubscriberRecord } from "@/lib/subscribers";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (typeof session.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscriberFromSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriberFromSubscription(subscription);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function syncSubscriberFromSubscription(subscription: Stripe.Subscription): Promise<void> {
  const stripe = getStripe();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted || !customer.email) return;

  const item = subscription.items.data[0];
  const plan: SubscriberRecord["plan"] = item?.price.recurring?.interval === "year" ? "annual" : "monthly";
  const currentPeriodEnd = item?.current_period_end ?? Math.floor(Date.now() / 1000);

  await setSubscriber({
    email: customer.email,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    plan,
    currentPeriodEnd,
  });
}
