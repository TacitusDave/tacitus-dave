import { getRedis } from "@/lib/redis";

const ACTIVITY_KEY = "lab-activity";
const MAX_ENTRIES = 100;

export interface LabActivityEntry {
  type: "subscriber" | "owner-code";
  email?: string;
  /** Present for "subscriber" entries since the org/membership model — absent on older entries and the owner-code type. */
  orgId?: string;
  timestamp: number;
}

export async function recordLabActivity(entry: LabActivityEntry): Promise<void> {
  const redis = getRedis();
  await redis.lpush(ACTIVITY_KEY, entry);
  await redis.ltrim(ACTIVITY_KEY, 0, MAX_ENTRIES - 1);
}

export async function listLabActivity(limit = 50): Promise<LabActivityEntry[]> {
  return getRedis().lrange<LabActivityEntry>(ACTIVITY_KEY, 0, limit - 1);
}

/** Filters the same capped, global list down to one org — fine at this scale (100-entry cap), not worth a separate per-org key. */
export async function listLabActivityForOrg(orgId: string, limit = 50): Promise<LabActivityEntry[]> {
  const entries = await listLabActivity(MAX_ENTRIES);
  return entries.filter((entry) => entry.orgId === orgId).slice(0, limit);
}
