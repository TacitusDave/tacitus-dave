// Run locally to turn a chosen password into ADMIN_PASSWORD_HASH.
// Your password never leaves this machine — only the resulting hash goes
// into your environment variables.
//
// Usage: node scripts/hash-admin-password.mjs "your-password-here"

import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "your-password-here"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
console.log(`${salt}:${derivedKey.toString("hex")}`);
