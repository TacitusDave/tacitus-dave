import { NextRequest, NextResponse } from "next/server";
import { setOrganizationStatus } from "@/lib/organizations";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { orgId } = body as { orgId?: unknown };

  if (typeof orgId !== "string" || !orgId) {
    return NextResponse.json({ error: "Missing organization id." }, { status: 400 });
  }

  try {
    // Flips status rather than deleting — see the "cancellation flips
    // status, doesn't delete" rule: membership records and access keys stay
    // intact but inert, so re-granting is a pure status flip.
    await setOrganizationStatus(orgId, "cancelled");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to revoke organization access:", error);
    return NextResponse.json({ error: "Failed to revoke access." }, { status: 500 });
  }
}
