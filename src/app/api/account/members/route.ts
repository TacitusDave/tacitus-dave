import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { listOrgMembers } from "@/lib/memberships";
import { listPendingInvites } from "@/lib/invites";

export async function GET(request: NextRequest) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [members, invites] = await Promise.all([
      listOrgMembers(context.orgId),
      listPendingInvites(context.orgId),
    ]);
    return NextResponse.json({ members, invites });
  } catch (error) {
    console.error("Failed to list members:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
