import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { removeMembership, changeMembershipRole, type MembershipRole } from "@/lib/memberships";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await params;

  try {
    await removeMembership(context.orgId, decodeURIComponent(email));
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Includes the last-owner guard in memberships.ts, which throws a
    // user-facing message rather than a generic failure.
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> },
) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const role = (body as { role?: unknown }).role as MembershipRole | undefined;
  if (role !== "owner" && role !== "admin" && role !== "member") {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  try {
    const updated = await changeMembershipRole(context.orgId, decodeURIComponent(email), role);
    return NextResponse.json({ ok: true, member: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
