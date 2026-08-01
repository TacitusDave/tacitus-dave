import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import * as OTPAuth from "otpauth";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/** Run once, locally, to turn a chosen password into ADMIN_PASSWORD_HASH — never sent anywhere. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const storedBuffer = Buffer.from(hashHex, "hex");
  if (derivedKey.length !== storedBuffer.length) return false;

  return timingSafeEqual(derivedKey, storedBuffer);
}

export function verifyTotpCode(code: string, base32Secret: string): boolean {
  const totp = new OTPAuth.TOTP({
    issuer: "Tacitus Dave OS",
    label: "Control Center",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });

  // ±1 step (±30s) tolerance for clock drift between server and authenticator app.
  return totp.validate({ token: code, window: 1 }) !== null;
}
