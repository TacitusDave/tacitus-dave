import { NextRequest, NextResponse } from "next/server";
import { getMembership } from "@/lib/memberships";
import { getOrganization } from "@/lib/organizations";
import { sendAccessKeyEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { orgId, email } = body as { orgId?: unknown; email?: unknown };

  if (typeof orgId !== "string" || !orgId || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Missing organization or email." }, { status: 400 });
  }

  try {
    const [membership, org] = await Promise.all([getMembership(orgId, email), getOrganization(orgId)]);
    if (!membership) {
      return NextResponse.json({ error: "No such member." }, { status: 404 });
    }

    // Resends the same persistent key — it never regenerates on its own.
    await sendAccessKeyEmail(email, membership.accessKey, org?.name);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to resend access key:", error);
    return NextResponse.json({ error: "Failed to resend access key." }, { status: 500 });
  }
}
