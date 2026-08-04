// One-off: backfills every existing subscriber:{email} Redis record into
// the new Organization + owner Membership model (Phase 2 of the
// team-accounts rollout). Idempotent — skips any subscriber whose Paystack
// customer code already resolves to an org, so it's safe to re-run.
// Reuses each subscriber's existing access key unchanged, so nobody's
// sign-in breaks.
//
// Usage: node scripts/migrate-orgs.mjs
// Needs UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN in the
// environment (or a .env.local file in the project root) pointing at the
// SAME Redis database the live site uses — run this against production
// once, verify the output, before deploying the Phase 3 read-path cutover
// (the one that makes proxy.ts actually depend on these records).

import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

function loadDotEnvLocal() {
  const path = new URL("../.env.local", import.meta.url);
  if (!existsSync(path)) return;
  const contents = readFileSync(path, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnvLocal();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.");
  process.exit(1);
}

const redis = new Redis({ url, token });

// Key naming mirrors src/lib/organizations.ts, memberships.ts, and
// access-key.ts exactly — this script is intentionally self-contained
// (no @/lib imports) the same way every other script under scripts/ is,
// since they run as plain Node, outside Next.js's TS path resolution.
const orgKey = (id) => `org:${id}`;
const orgByCustomerCodeKey = (code) => `org-by-customer-code:${code}`;
const membershipKey = (orgId, email) => `membership:${orgId}:${email.toLowerCase()}`;
const orgMembersKey = (orgId) => `org-members:${orgId}`;
const emailOrgsKey = (email) => `email-orgs:${email.toLowerCase()}`;
const accessKeyIndexKey = (key) => `access-key:${key.trim().toUpperCase()}`;

async function main() {
  const subscriberKeys = await redis.keys("subscriber:*");
  console.log(`Found ${subscriberKeys.length} existing subscriber record(s).`);

  let migrated = 0;
  let skipped = 0;

  for (const key of subscriberKeys) {
    const subscriber = await redis.get(key);
    if (!subscriber) continue;

    const existingOrgId = await redis.get(orgByCustomerCodeKey(subscriber.paystackCustomerCode));
    if (existingOrgId) {
      skipped += 1;
      continue;
    }

    const orgId = randomUUID();
    const now = Math.floor(Date.now() / 1000);

    const org = {
      id: orgId,
      name: `${subscriber.email}'s workspace`,
      ownerEmail: subscriber.email,
      paystackCustomerCode: subscriber.paystackCustomerCode,
      paystackSubscriptionCode: subscriber.paystackSubscriptionCode,
      status: subscriber.status,
      plan: subscriber.plan,
      currentPeriodEnd: subscriber.currentPeriodEnd,
      createdAt: now,
    };
    await redis.set(orgKey(orgId), org);
    await redis.set(orgByCustomerCodeKey(subscriber.paystackCustomerCode), orgId);
    await redis.sadd("all-org-ids", orgId);

    const membership = {
      orgId,
      email: subscriber.email.toLowerCase(),
      role: "owner",
      accessKey: subscriber.accessKey,
      invitedAt: now,
      joinedAt: now,
    };
    await redis.set(membershipKey(orgId, subscriber.email), membership);
    await redis.set(accessKeyIndexKey(subscriber.accessKey), {
      orgId,
      email: subscriber.email.toLowerCase(),
    });
    await redis.sadd(orgMembersKey(orgId), subscriber.email.toLowerCase());
    await redis.sadd(emailOrgsKey(subscriber.email), orgId);

    migrated += 1;
    console.log(`Migrated ${subscriber.email} -> org ${orgId}`);
  }

  console.log(`Done. Migrated ${migrated}, skipped ${skipped} (already migrated).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
