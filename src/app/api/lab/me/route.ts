import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getMembership } from "@/lib/memberships";
import { getOrganization } from "@/lib/organizations";
import { OWNER_SESSION_EMAIL } from "@/lib/owner-code";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let identity: Awaited<ReturnType<typeof verifySessionToken>> = null;
  try {
    identity = await verifySessionToken(token);
  } catch {
    return NextResponse.json({ authenticated: false });
  }

  if (!identity) {
    return NextResponse.json({ authenticated: false });
  }

  const { email, orgId } = identity;

  if (email === OWNER_SESSION_EMAIL) {
    return NextResponse.json({ authenticated: true, isOwner: true });
  }

  if (!orgId) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const [membership, org] = await Promise.all([getMembership(orgId, email), getOrganization(orgId)]);
    if (!membership || !org) return NextResponse.json({ authenticated: false });
    return NextResponse.json({
      authenticated: true,
      isOwner: false,
      role: membership.role,
      currentPeriodEnd: org.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Failed to load membership for /api/lab/me:", error);
    // Redis hiccup shouldn't crash the badge — just render nothing.
    return NextResponse.json({ authenticated: false });
  }
}
