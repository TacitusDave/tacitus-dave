import { NextRequest, NextResponse } from "next/server";
import { consumeInvite } from "@/lib/invites";
import { createMembership } from "@/lib/memberships";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { sendAccessKeyEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token } = body as { token?: unknown };
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Missing invite token." }, { status: 400 });
  }

  try {
    // Atomic GETDEL under the hood — whichever request consumes it first
    // wins; a second click, forwarded link, or link-scanner gets null.
    const invite = await consumeInvite(token);
    if (!invite) {
      return NextResponse.json({ error: "This invite has expired or was already used." }, { status: 410 });
    }

    const membership = await createMembership({
      orgId: invite.orgId,
      email: invite.email,
      role: invite.role,
    });

    await sendAccessKeyEmail(invite.email, membership.accessKey, invite.orgName).catch((error) =>
      console.error("Failed to send access key email after invite accept:", error),
    );

    const sessionToken = await createSessionToken(membership.email, membership.orgId);
    const response = NextResponse.json({ ok: true });
    // Same session-only cookie shape as /api/auth/verify-key — dies when
    // the browser closes, not a "stay signed in" cookie.
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Invite accept failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
