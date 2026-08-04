import { NextRequest, NextResponse } from "next/server";
import { grantManualOrganization } from "@/lib/organizations";
import { getMembership, createMembership } from "@/lib/memberships";
import { sendAccessKeyEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, days } = body as { email?: unknown; days?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    const org = await grantManualOrganization(email, typeof days === "number" && days > 0 ? days : 30);

    const existingMembership = await getMembership(org.id, email);
    const isNewMember = !existingMembership;
    const membership = existingMembership ?? (await createMembership({ orgId: org.id, email, role: "owner" }));

    if (isNewMember) {
      await sendAccessKeyEmail(email, membership.accessKey, org.name).catch((error) =>
        console.error("Failed to send access key email:", error),
      );
    }

    return NextResponse.json({ organization: org, membership });
  } catch (error) {
    console.error("Failed to grant organization access:", error);
    return NextResponse.json({ error: "Failed to grant access." }, { status: 500 });
  }
}
