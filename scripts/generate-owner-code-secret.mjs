// Run locally to generate a fresh OWNER_CODE_SECRET.
//
// The owner access code (Control Center > "Owner access code") is derived
// entirely from this secret plus the current time — nothing is stored in a
// database. Generating a new secret and replacing the one in your
// deployment's environment variables immediately invalidates every code
// anyone could compute from the old one, which is your "kill switch" if you
// think the code has leaked.
//
// Usage: node scripts/generate-owner-code-secret.mjs

import { Secret } from "otpauth";

const secret = new Secret({ size: 20 });
console.log(secret.base32);
