import { getRedis } from "@/lib/redis";

const CODE_TTL_SECONDS = 60 * 15; // 15 minutes

function codeKey(email: string): string {
  return `auth-code:${email.toLowerCase()}`;
}

function generateCode(): string {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(value).padStart(6, "0");
}

export async function createAuthCode(email: string): Promise<string> {
  const code = generateCode();
  await getRedis().set(codeKey(email), code, { ex: CODE_TTL_SECONDS });
  return code;
}

/** One-time use: a valid code is deleted immediately after a successful check. */
export async function verifyAuthCode(email: string, code: string): Promise<boolean> {
  const redis = getRedis();
  const stored = await redis.get<string>(codeKey(email));
  if (!stored || stored !== code) return false;
  await redis.del(codeKey(email));
  return true;
}
