import { cache } from "react";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getMembership, type MembershipRecord } from "@/lib/memberships";
import { getOrganization, type OrganizationRecord } from "@/lib/organizations";

export interface AccountContext {
  email: string;
  orgId: string;
  membership: MembershipRecord;
  organization: OrganizationRecord;
}

async function loadAccountContext(token: string | undefined): Promise<AccountContext | null> {
  try {
    const identity = await verifySessionToken(token);
    if (!identity?.orgId) return null;

    const [membership, organization] = await Promise.all([
      getMembership(identity.orgId, identity.email),
      getOrganization(identity.orgId),
    ]);
    if (!membership || !organization) return null;

    return { email: identity.email, orgId: identity.orgId, membership, organization };
  } catch (error) {
    // Fail closed — unlike the Lab tool gate in proxy.ts, account-management
    // surfaces never fail open. A Redis blip here should block, not admit.
    console.error("Account context lookup failed:", error);
    return null;
  }
}

/**
 * For Server Components / pages under src/app/account/*. Wrapped in React's
 * `cache()` so the layout and its page can both call this within the same
 * request without a duplicate Redis round-trip.
 */
export const getAccountContext = cache(async (): Promise<AccountContext | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return loadAccountContext(token);
});

/** For Route Handlers under src/app/api/account/*. */
export async function getAccountContextFromRequest(request: NextRequest): Promise<AccountContext | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return loadAccountContext(token);
}

export function isOwnerOrAdmin(membership: MembershipRecord): boolean {
  return membership.role === "owner" || membership.role === "admin";
}
