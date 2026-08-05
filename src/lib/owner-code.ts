import * as OTPAuth from "otpauth";

/** The `email` value stamped into the session token when redeemed via the owner code. */
export const OWNER_SESSION_EMAIL = "owner";

// Long enough to actually type in, short enough to self-rotate as a real
// security property — a leaked code dies on its own within half a day
// even if nobody manually reacts to it.
const PERIOD_SECONDS = 60 * 60 * 12;
const DIGITS = 8;

function requireSecret(): string {
  const secret = process.env.OWNER_CODE_SECRET;
  if (!secret) throw new Error("OWNER_CODE_SECRET is not set");
  return secret;
}

function totp(): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: "Tacitus Dave OS",
    label: "Owner Lab Access",
    algorithm: "SHA1",
    digits: DIGITS,
    period: PERIOD_SECONDS,
    secret: OTPAuth.Secret.fromBase32(requireSecret()),
  });
}

export interface OwnerCodeInfo {
  code: string;
  /** Unix seconds — when this code stops working and the next one takes over. */
  validUntil: number;
}

/**
 * No database involved — the current code is derived fresh from
 * OWNER_CODE_SECRET and the clock on every call, the same way the admin
 * TOTP 2FA already works. Nothing to "load," nothing that can fail to load.
 */
export function getCurrentOwnerCode(): OwnerCodeInfo {
  const code = totp().generate();
  const periodStart = Math.floor(Date.now() / 1000 / PERIOD_SECONDS) * PERIOD_SECONDS;
  return { code, validUntil: periodStart + PERIOD_SECONDS };
}

export function verifyOwnerCode(candidate: string): boolean {
  if (!process.env.OWNER_CODE_SECRET) return false;
  // window: 1 gives +/- one period of tolerance around a rotation boundary.
  return totp().validate({ token: candidate.trim(), window: 1 }) !== null;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * A fingerprint for "the code as it currently stands" — changes on every
 * natural 12-hour rotation (the period boundary) AND on a manual
 * OWNER_CODE_SECRET regeneration (the secret itself changes), independent
 * of each other. owner-sessions.ts stamps this onto every redemption and
 * compares it live on each request: either kind of "the code refreshed"
 * invalidates every previously issued owner-code session at once, with no
 * sweep or cleanup job needed — a stale session just stops matching.
 * Hashed (not the raw secret) so nothing sensitive ends up in Redis.
 */
export async function currentOwnerCodeEpoch(): Promise<string> {
  const periodStart = Math.floor(Date.now() / 1000 / PERIOD_SECONDS) * PERIOD_SECONDS;
  const fingerprint = (await sha256Hex(requireSecret())).slice(0, 16);
  return `${periodStart}:${fingerprint}`;
}
