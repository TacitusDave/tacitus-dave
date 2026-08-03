import { randomInt } from "node:crypto";

// Excludes visually ambiguous characters (0/O, 1/I/L) — this gets typed by
// hand from an email, so every character needs to be unambiguous at a glance.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const GROUP_COUNT = 5;
const GROUP_LENGTH = 4;

/** A long, license-key-style credential — persistent for the subscriber's lifetime, not a short-lived OTP. */
export function generateAccessKey(): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUP_COUNT; g++) {
    let group = "";
    for (let i = 0; i < GROUP_LENGTH; i++) {
      group += ALPHABET[randomInt(ALPHABET.length)];
    }
    groups.push(group);
  }
  return groups.join("-");
}

/** Normalizes user input (case, stray whitespace) before comparing or looking up a key. */
export function normalizeAccessKey(input: string): string {
  return input.trim().toUpperCase();
}
