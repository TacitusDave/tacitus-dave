import { NextRequest, NextResponse } from "next/server";
import { getSubscriberByAccessKey, isActiveSubscriber } from "@/lib/subscribers";
import { normalizeAccessKey } from "@/lib/access-key";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { recordLabActivity } from "@/lib/lab-activity";
import { isLockedOut, recordFailure, clearAttempts } from "@/lib/rate-limit";

const RATE_LIMIT_SCOPE = "verify-key";

function clientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request);

  let locked = false;
  try {
    locked = await isLockedOut(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("verify-key rate-limit check failed:", error);
  }
  if (locked) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { key } = body as { key?: unknown };
  if (typeof key !== "string" || !key.trim()) {
    return NextResponse.json({ error: "Enter your access key." }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriberByAccessKey(normalizeAccessKey(key));
    if (!isActiveSubscriber(subscriber) || !subscriber) {
      await recordFailure(RATE_LIMIT_SCOPE, identifier).catch(() => {});
      return NextResponse.json({ error: "Invalid or expired access key." }, { status: 401 });
    }

    await clearAttempts(RATE_LIMIT_SCOPE, identifier).catch(() => {});
    recordLabActivity({
      type: "subscriber",
      email: subscriber.email,
      timestamp: Math.floor(Date.now() / 1000),
    }).catch((err) => console.error("Failed to record lab activity:", err));

    const token = await createSessionToken(subscriber.email);
    const response = NextResponse.json({ ok: true });
    // No maxAge/expires: a session-only cookie that dies when the browser
    // closes, on purpose — this is a shared-device-safe login, not a
    // "stay signed in for a month" one. Re-entering the key (not a fresh
    // code) is what's expected on the next visit.
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("verify-key failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
