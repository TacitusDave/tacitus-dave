import { NextRequest, NextResponse } from "next/server";
import { getSubscriber, isActiveSubscriber } from "@/lib/subscribers";
import { createAuthCode } from "@/lib/auth-code";
import { sendAccessCodeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body as { email?: unknown }).email;
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriber(email);
    if (isActiveSubscriber(subscriber)) {
      const code = await createAuthCode(email);
      await sendAccessCodeEmail(email, code);
    }
    // Same response either way — don't reveal whether an email is a subscriber.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("request-code failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
