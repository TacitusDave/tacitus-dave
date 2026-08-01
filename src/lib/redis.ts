import { Redis } from "@upstash/redis";

let client: Redis | null = null;

/** Lazily constructed so a missing key fails at the call site, not at import time (breaking the whole build). */
export function getRedis(): Redis {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set");
  }

  client = new Redis({ url, token });
  return client;
}
