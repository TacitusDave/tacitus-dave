import { createSignedToken, verifySignedToken } from "@/lib/signed-token";

export const SESSION_COOKIE = "lab_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function requireSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export interface SessionIdentity {
  email: string;
  /** Null for the owner's personal bypass session, which isn't tied to any Organization. */
  orgId: string | null;
  /**
   * Set only for owner-code bypass sessions — the id of the OwnerSessionRecord
   * in Redis this token was minted alongside. Lets an admin revoke one
   * specific redemption (see owner-sessions.ts) without rotating the shared
   * code for everyone. Absent on membership-based sessions, and absent on
   * owner sessions minted before this field existed — those are treated as
   * still-valid (see proxy.ts) rather than retroactively revoked.
   */
  ownerSessionId?: string;
}

/**
 * Deliberately identity-only — never role. Every request that makes a
 * role-based decision re-reads the live Membership from Redis instead, the
 * same way access itself is already re-derived fresh on every request
 * rather than trusted from the token. A stale token must never be able to
 * grant privileges a live Redis check would deny.
 */
export async function createSessionToken(
  email: string,
  orgId: string | null,
  ownerSessionId?: string,
): Promise<string> {
  return createSignedToken({ email, orgId, ownerSessionId }, requireSessionSecret(), SESSION_TTL_SECONDS);
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionIdentity | null> {
  const payload = await verifySignedToken<{ email: string; orgId: string | null; ownerSessionId?: string }>(
    token,
    requireSessionSecret(),
  );
  if (typeof payload?.email !== "string") return null;
  return {
    email: payload.email,
    orgId: typeof payload.orgId === "string" ? payload.orgId : null,
    ownerSessionId: typeof payload.ownerSessionId === "string" ? payload.ownerSessionId : undefined,
  };
}
