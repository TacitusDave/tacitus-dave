import { getRedis } from "@/lib/redis";

const ACTIVITY_KEY = "lab-activity";
const MAX_ENTRIES = 100;

export interface LabActivityEntry {
  type: "subscriber" | "owner-code";
  email?: string;
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
