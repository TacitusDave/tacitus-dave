import { NextRequest, NextResponse } from "next/server";
import { evaluateHeaders } from "@/lib/security-headers";
import { isLockedOut, recordFailure } from "@/lib/rate-limit";

const RATE_LIMIT_SCOPE = "header-check";
const BLOCKED_HOSTS = new Set(["localhost", "0.0.0.0"]);

function clientIdentifier(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return true;
  if (host === "127.0.0.1" || host === "::1") return true;
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  if (host.endsWith(".local")) return true;
  return false;
}

export async function POST(request: NextRequest) {
  const identifier = clientIdentifier(request);

  // Repurposes the failure-lockout primitive as a flat rate limiter — every
  // completed attempt counts, since the concern here is "don't let this
  // become a free URL-fetching proxy," not "don't lock out a legitimate
  // user who mistyped a password."
  let locked = false;
  try {
    locked = await isLockedOut(RATE_LIMIT_SCOPE, identifier);
  } catch (error) {
    console.error("header-check rate-limit check failed:", error);
  }
  if (locked) {
    return NextResponse.json({ error: "Too many checks. Try again in a bit." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body as { url?: unknown }).url;
  if (typeof raw !== "string" || !raw.trim()) {
    return NextResponse.json({ error: "Enter a URL." }, { status: 400 });
  }

  let target: URL;
  try {
    const withScheme = /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`;
    target = new URL(withScheme);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "Only http/https URLs are supported." }, { status: 400 });
  }
  if (isPrivateHostname(target.hostname)) {
    return NextResponse.json({ error: "Can't scan private or internal addresses." }, { status: 400 });
  }

  await recordFailure(RATE_LIMIT_SCOPE, identifier).catch(() => {});

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(target.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "TacitusDaveOS-HeaderCheck/1.0 (+https://tacitus-dave-os.vercel.app)" },
    });

    const { items, score } = evaluateHeaders(response.headers);

    return NextResponse.json({
      url: target.toString(),
      finalUrl: response.url,
      status: response.status,
      items,
      score,
    });
  } catch (error) {
    console.error("Header check request failed:", error);
    return NextResponse.json({ error: "Couldn't reach that URL — it may be down or blocking requests." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
