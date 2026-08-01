export const HASH_ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

async function digest(algorithm: HashAlgorithm, data: BufferSource): Promise<string> {
  const buffer = await crypto.subtle.digest(algorithm, data);
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function computeHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  return digest(algorithm, new TextEncoder().encode(text));
}

/** Hashes raw bytes directly — required for files, since converting to text would corrupt binary data. */
export async function computeHashFromBuffer(algorithm: HashAlgorithm, data: ArrayBuffer): Promise<string> {
  return digest(algorithm, data);
}
