import { createSignedToken, verifySignedToken } from "@/lib/signed-token";

export const SESSION_COOKIE = "lab_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function requireSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

export async function createSessionToken(email: string): Promise<string> {
  return createSignedToken({ email }, requireSessionSecret(), SESSION_TTL_SECONDS);
}

export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  const payload = await verifySignedToken<{ email: string }>(token, requireSessionSecret());
  return typeof payload?.email === "string" ? payload.email : null;
}
