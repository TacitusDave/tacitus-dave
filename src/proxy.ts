import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken, type SessionIdentity } from "@/lib/session";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";
import { getMembership } from "@/lib/memberships";
import { getOrganization, isActiveOrganization } from "@/lib/organizations";
import { OWNER_SESSION_EMAIL } from "@/lib/owner-code";

export const config = {
  matcher: [
    "/lab",
    "/lab/:path*",
    "/control-center",
    "/control-center/:path*",
    "/api/admin/:path*",
  ],
};

const PUBLIC_LAB_PATHS = new Set(["/lab/authorize"]);
const ADMIN_LOGIN_PATH = "/control-center/login";
const PUBLIC_ADMIN_API_PATHS = new Set(["/api/admin/login", "/api/admin/logout"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    return handleAdminApi(request, pathname);
  }

  if (pathname.startsWith("/control-center")) {
    return handleControlCenter(request, pathname);
  }

  return handleLab(request, pathname);
}

async function handleLab(request: NextRequest, pathname: string) {
  if (PUBLIC_LAB_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let identity: SessionIdentity | null = null;
  try {
    identity = await verifySessionToken(token);
  } catch (error) {
    // SESSION_SECRET missing, etc. — fail closed (treat as unauthenticated) rather than 500ing.
    console.error("Lab session verification failed:", error);
  }

  if (!identity) {
    return redirectToAuthorize(request, pathname);
  }

  const { email, orgId } = identity;

  // The owner's bypass session isn't tied to any Organization, so it has
  // nothing to check here — its only revocation path is rotating the code.
  if (email !== OWNER_SESSION_EMAIL) {
    if (!orgId) {
      return redirectToAuthorize(request, pathname);
    }
    try {
      // Checking live Membership existence (not just "is the org active") is
      // what makes removing a team member take effect immediately, with no
      // session blocklist needed — same mechanism this app already relies
      // on for per-subscriber revocation, just extended by one field.
      const [membership, org] = await Promise.all([getMembership(orgId, email), getOrganization(orgId)]);
      if (!membership || !isActiveOrganization(org)) {
        return redirectToAuthorize(request, pathname);
      }
    } catch (error) {
      // Redis unreachable — fail open. The signed session is still evidence
      // of a legitimate prior grant; an outage shouldn't lock out every
      // paying team at once over an unrelated infrastructure issue.
      console.error("Membership status check failed:", error);
    }
  }

  return NextResponse.next();
}

// Sends people straight to "enter your key" rather than back through
// checkout/pricing — they already have a key from subscribing, this isn't a
// fresh signup each time their (deliberately short-lived) session ends.
function redirectToAuthorize(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/lab/authorize";
  url.search = "";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

async function handleControlCenter(request: NextRequest, pathname: string) {
  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  if (!(await hasAdminSession(request))) {
    // Rewrite (not redirect) to a path that genuinely doesn't exist, so the
    // real not-found page renders while the URL bar still shows
    // /control-center — no redirect flash, no hint that a login page exists.
    return NextResponse.rewrite(new URL("/control-center-unreachable", request.url));
  }

  return NextResponse.next();
}

async function handleAdminApi(request: NextRequest, pathname: string) {
  if (PUBLIC_ADMIN_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (!(await hasAdminSession(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

async function hasAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  try {
    return await verifyAdminSessionToken(token);
  } catch (error) {
    console.error("Admin session verification failed:", error);
    return false;
  }
}
