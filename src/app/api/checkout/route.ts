import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";
import { pricingPlans } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { plan, email } = body as { plan?: unknown; email?: unknown };

  if (plan !== "monthly" && plan !== "annual") {
    return NextResponse.json({ error: "Choose a monthly or annual plan." }, { status: 400 });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const planConfig = pricingPlans.find((p) => p.id === plan);
  const planCode =
    plan === "annual" ? process.env.PAYSTACK_PLAN_CODE_ANNUAL : process.env.PAYSTACK_PLAN_CODE_MONTHLY;

  if (!planConfig || !planCode) {
    return NextResponse.json(
      { error: "Pricing isn't configured yet — check back soon." },
      { status: 503 },
    );
  }

  try {
    const origin = request.nextUrl.origin;

    const authorizationUrl = await initializeTransaction({
      email,
      amountKobo: planConfig.amountNaira * 100,
      planCode,
      callbackUrl: `${origin}/lab/authorize?checkout=success`,
    });

    return NextResponse.json({ url: authorizationUrl });
  } catch (error) {
    console.error("Paystack transaction initialization failed:", error);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 500 },
    );
  }
}
