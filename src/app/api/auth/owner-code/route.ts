import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCode, OWNER_SESSION_EMAIL } from "@/lib/owner-code";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";
import { recordLabActivity } from "@/lib/lab-activity";
import { isLockedOut, recordFailure, clearAttempts } from "@/lib/rate-limit";

const RATE_LIMIT_SCOPE = "owner-code";

function clientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request);

  let locked = false;
  try {
    locked = await isLockedOut(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("Owner-code rate-limit check failed:", error);
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

  const { code } = body as { code?: unknown };
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "Enter the access code." }, { status: 400 });
  }

  try {
    const valid = verifyOwnerCode(code.trim());
    if (!valid) {
      await recordFailure(RATE_LIMIT_SCOPE, identifier).catch(() => {});
      return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
    }

    await clearAttempts(RATE_LIMIT_SCOPE, identifier).catch(() => {});
    recordLabActivity({ type: "owner-code", timestamp: Math.floor(Date.now() / 1000) }).catch((err) =>
      console.error("Failed to record lab activity:", err),
    );

    const token = await createSessionToken(OWNER_SESSION_EMAIL, null);
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
    console.error("Owner-code verification failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
