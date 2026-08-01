import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, verifyTotpCode } from "@/lib/admin-auth";
import { isLockedOut, recordFailure, clearAttempts } from "@/lib/rate-limit";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS } from "@/lib/admin-session";

const RATE_LIMIT_SCOPE = "admin-login";

function clientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// The rate limiter is a supplementary layer on top of password + TOTP, not
// the primary auth boundary — if Redis is unreachable, log it and let the
// real credential check still run rather than 500ing or locking out the
// legitimate admin because of an unrelated outage.
async function checkLockedOut(identifier: string): Promise<boolean> {
  try {
    return await isLockedOut(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("Rate-limit check failed (Redis unreachable?):", error);
    return false;
  }
}

async function recordFailedAttempt(identifier: string): Promise<void> {
  try {
    await recordFailure(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("Recording failed login attempt failed:", error);
  }
}

async function clearFailedAttempts(identifier: string): Promise<void> {
  try {
    await clearAttempts(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("Clearing failed login attempts failed:", error);
  }
}

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request);

  if (await checkLockedOut(identifier)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const { password, code } = body as { password?: unknown; code?: unknown };
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const totpSecret = process.env.ADMIN_TOTP_SECRET;

  const fail = async (message = "Invalid credentials.") => {
    await recordFailedAttempt(identifier);
    return NextResponse.json({ error: message }, { status: 401 });
  };

  if (typeof password !== "string" || typeof code !== "string" || !passwordHash || !totpSecret) {
    if (!passwordHash || !totpSecret) {
      console.error("Admin login attempted before ADMIN_PASSWORD_HASH / ADMIN_TOTP_SECRET were configured.");
    }
    return fail();
  }

  const passwordOk = await verifyPassword(password, passwordHash);
  const totpOk = verifyTotpCode(code, totpSecret);

  if (!passwordOk || !totpOk) {
    return fail();
  }

  await clearFailedAttempts(identifier);

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    path: "/",
  });
  return response;
}
