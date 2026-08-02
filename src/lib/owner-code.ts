import { randomBytes, timingSafeEqual } from "node:crypto";
import { getRedis } from "@/lib/redis";

const OWNER_CODE_KEY = "owner-access-code";

/** The `email` value stamped into the session token when redeemed via the owner code. */
export const OWNER_SESSION_EMAIL = "owner";

export interface OwnerCodeRecord {
  code: string;
  rotatedAt: number;
}

function generateCode(): string {
  const raw = randomBytes(15).toString("hex").toUpperCase();
  return raw.match(/.{1,5}/g)!.join("-");
}

export async function getOwnerCode(): Promise<OwnerCodeRecord | null> {
  return getRedis().get<OwnerCodeRecord>(OWNER_CODE_KEY);
}

export async function rotateOwnerCode(): Promise<OwnerCodeRecord> {
  const record: OwnerCodeRecord = {
    code: generateCode(),
    rotatedAt: Math.floor(Date.now() / 1000),
  };
  await getRedis().set(OWNER_CODE_KEY, record);
  return record;
}

export async function verifyOwnerCode(candidate: string): Promise<boolean> {
  const record = await getOwnerCode();
  if (!record) return false;

  const a = Buffer.from(record.code, "utf8");
  const b = Buffer.from(candidate, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
