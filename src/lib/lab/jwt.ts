function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
  /** The raw "header.payload" string the signature was computed over — needed to verify it. */
  signingInput: string;
  algorithm: string | null;
  expiresAt: Date | null;
  isExpired: boolean | null;
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT has three dot-separated parts (header.payload.signature).");
  }

  const [headerPart, payloadPart, signature] = parts;
  const header: unknown = JSON.parse(base64UrlDecode(headerPart));
  const payload: unknown = JSON.parse(base64UrlDecode(payloadPart));

  const algorithm =
    typeof header === "object" && header !== null && "alg" in header
      ? String((header as Record<string, unknown>).alg)
      : null;

  const exp =
    typeof payload === "object" && payload !== null && "exp" in payload
      ? (payload as Record<string, unknown>).exp
      : undefined;
  const expiresAt = typeof exp === "number" ? new Date(exp * 1000) : null;
  const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : null;

  return {
    header,
    payload,
    signature,
    signingInput: `${headerPart}.${payloadPart}`,
    algorithm,
    expiresAt,
    isExpired,
  };
}

const HMAC_ALGORITHMS: Record<string, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

export function isHmacAlgorithm(algorithm: string | null): boolean {
  return algorithm !== null && algorithm in HMAC_ALGORITHMS;
}

/** Only HMAC (HS256/384/512) is supported — verifying RS/ES algorithms needs the issuer's public key, not a shared secret. */
export async function verifyHmacSignature(
  signingInput: string,
  signature: string,
  secret: string,
  algorithm: string,
): Promise<boolean> {
  const hashName = HMAC_ALGORITHMS[algorithm];
  if (!hashName) {
    throw new Error(`${algorithm} isn't an HMAC algorithm this tool can verify.`);
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: hashName },
    false,
    ["sign"],
  );
  const expectedBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  const expectedSignature = base64UrlEncode(new Uint8Array(expectedBuffer));

  return timingSafeEqual(expectedSignature, signature);
}
