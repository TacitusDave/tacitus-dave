import { createSignedToken, verifySignedToken } from "@/lib/signed-token";

export const ADMIN_SESSION_COOKIE = "admin_session";
// Deliberately much shorter than the Lab subscriber session — this gates
// the control center, not a paid content area.
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 hours

function requireAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

export async function createAdminSessionToken(): Promise<string> {
  return createSignedToken({ role: "admin" }, requireAdminSecret(), ADMIN_SESSION_TTL_SECONDS);
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  const payload = await verifySignedToken<{ role: string }>(token, requireAdminSecret());
  return payload?.role === "admin";
}
