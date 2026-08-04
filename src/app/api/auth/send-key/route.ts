import { NextRequest, NextResponse } from "next/server";
import { getOrgIdsForEmail, getMembership } from "@/lib/memberships";
import { getOrganization, isActiveOrganization } from "@/lib/organizations";
import { sendAccessKeyEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body as { email?: unknown }).email;
  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    // One email can belong to more than one team — send a key for every
    // org they're an active member of, not just the first one found.
    const orgIds = await getOrgIdsForEmail(email);
    for (const orgId of orgIds) {
      const [membership, org] = await Promise.all([getMembership(orgId, email), getOrganization(orgId)]);
      if (membership && isActiveOrganization(org)) {
        await sendAccessKeyEmail(email, membership.accessKey, org?.name);
      }
    }
    // Same response either way — don't reveal whether an email belongs to any org.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-key failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
