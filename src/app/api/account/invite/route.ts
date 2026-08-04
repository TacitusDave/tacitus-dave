import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { createInvite } from "@/lib/invites";
import { sendInviteEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, role } = body as { email?: unknown; role?: unknown };
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (role !== "admin" && role !== "member") {
    return NextResponse.json({ error: "Role must be admin or member." }, { status: 400 });
  }

  try {
    const { token } = await createInvite({
      orgId: context.orgId,
      orgName: context.organization.name,
      email,
      role,
      invitedBy: context.email,
    });

    const acceptUrl = `${request.nextUrl.origin}/invite/${token}`;
    await sendInviteEmail({
      email,
      orgName: context.organization.name,
      invitedBy: context.email,
      acceptUrl,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Invite creation failed:", error);
    return NextResponse.json({ error: "Couldn't send the invite. Please try again." }, { status: 500 });
  }
}
