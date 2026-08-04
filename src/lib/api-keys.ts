import { createHash, randomBytes } from "node:crypto";
import { getRedis } from "@/lib/redis";

/**
 * Infrastructure only — generation, hashed storage, and revocation. There is
 * no server-side API for any Lab tool yet (all 23 compute entirely
 * client-side), so nothing actually verifies these keys today. When a real
 * API layer exists, verification is: hash the presented key the same way
 * `createApiKey` does below, then add a `api-key-hash:{hash} -> {orgId, id}`
 * lookup index — deliberately not built yet since there's nothing to look up
 * a hash *for*.
 */
export interface ApiKeyRecord {
  id: string;
  orgId: string;
  createdBy: string;
  label: string;
  keyPreview: string;
  /** Unix seconds. */
  createdAt: number;
}

interface StoredApiKeyRecord extends ApiKeyRecord {
  keyHash: string;
}

function apiKeyRecordKey(orgId: string, id: string): string {
  return `api-key:${orgId}:${id}`;
}

function orgApiKeysKey(orgId: string): string {
  return `org-api-keys:${orgId}`;
}

function hashKey(plaintextKey: string): string {
  return createHash("sha256").update(plaintextKey).digest("hex");
}

function omitHash(record: StoredApiKeyRecord): ApiKeyRecord {
  return {
    id: record.id,
    orgId: record.orgId,
    createdBy: record.createdBy,
    label: record.label,
    keyPreview: record.keyPreview,
    createdAt: record.createdAt,
  };
}

/** The plaintext key is returned exactly once, here — it's never stored or retrievable again, same as GitHub/Stripe-style tokens. */
export async function createApiKey(params: {
  orgId: string;
  createdBy: string;
  label: string;
}): Promise<{ record: ApiKeyRecord; plaintextKey: string }> {
  const id = crypto.randomUUID();
  const secret = randomBytes(24).toString("base64url");
  const plaintextKey = `td_live_${secret}`;

  const record: StoredApiKeyRecord = {
    id,
    orgId: params.orgId,
    createdBy: params.createdBy,
    label: params.label,
    keyHash: hashKey(plaintextKey),
    keyPreview: `td_live_...${secret.slice(-4)}`,
    createdAt: Math.floor(Date.now() / 1000),
  };

  const redis = getRedis();
  await redis.set(apiKeyRecordKey(params.orgId, id), record);
  await redis.sadd(orgApiKeysKey(params.orgId), id);

  return { record: omitHash(record), plaintextKey };
}

export async function listApiKeys(orgId: string): Promise<ApiKeyRecord[]> {
  const redis = getRedis();
  const ids = await redis.smembers(orgApiKeysKey(orgId));
  if (ids.length === 0) return [];

  const records = await redis.mget<(StoredApiKeyRecord | null)[]>(
    ...ids.map((id) => apiKeyRecordKey(orgId, id)),
  );
  return records.filter((record): record is StoredApiKeyRecord => record !== null).map(omitHash);
}

export async function revokeApiKey(orgId: string, id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(apiKeyRecordKey(orgId, id));
  await redis.srem(orgApiKeysKey(orgId), id);
}
