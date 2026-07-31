function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
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

  const exp =
    typeof payload === "object" && payload !== null && "exp" in payload
      ? (payload as Record<string, unknown>).exp
      : undefined;
  const expiresAt = typeof exp === "number" ? new Date(exp * 1000) : null;
  const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : null;

  return { header, payload, signature, expiresAt, isExpired };
}
