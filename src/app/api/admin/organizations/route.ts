import { NextResponse } from "next/server";
import { listOrganizations } from "@/lib/organizations";
import { listOrgMembers } from "@/lib/memberships";

export async function GET() {
  try {
    const organizations = await listOrganizations();
    const withMembers = await Promise.all(
      organizations.map(async (org) => ({
        ...org,
        members: await listOrgMembers(org.id),
      })),
    );
    return NextResponse.json({ organizations: withMembers });
  } catch (error) {
    console.error("Failed to list organizations:", error);
    return NextResponse.json({ error: "Failed to load organizations." }, { status: 500 });
  }
}
