import { NextRequest, NextResponse } from "next/server";
import { getSubscriber, isActiveSubscriber } from "@/lib/subscribers";
import { verifyAuthCode } from "@/lib/auth-code";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, code } = body as { email?: unknown; code?: unknown };
  if (typeof email !== "string" || typeof code !== "string") {
    return NextResponse.json({ error: "Enter your email and code." }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriber(email);
    if (!isActiveSubscriber(subscriber)) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    }

    const valid = await verifyAuthCode(email, code);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    }

    const token = await createSessionToken(email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("verify-code failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
