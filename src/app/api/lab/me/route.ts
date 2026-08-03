import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getSubscriber } from "@/lib/subscribers";
import { OWNER_SESSION_EMAIL } from "@/lib/owner-code";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let email: string | null = null;
  try {
    email = await verifySessionToken(token);
  } catch {
    return NextResponse.json({ authenticated: false });
  }

  if (!email) {
    return NextResponse.json({ authenticated: false });
  }

  if (email === OWNER_SESSION_EMAIL) {
    return NextResponse.json({ authenticated: true, isOwner: true });
  }

  try {
    const subscriber = await getSubscriber(email);
    if (!subscriber) return NextResponse.json({ authenticated: false });
    return NextResponse.json({
      authenticated: true,
      isOwner: false,
      currentPeriodEnd: subscriber.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Failed to load subscriber for /api/lab/me:", error);
    // Redis hiccup shouldn't crash the badge — just render nothing.
    return NextResponse.json({ authenticated: false });
  }
}
