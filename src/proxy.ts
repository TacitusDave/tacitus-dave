import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export const config = {
  matcher: ["/lab", "/lab/:path*", "/control-center", "/control-center/:path*"],
};

const PUBLIC_LAB_PATHS = new Set(["/lab/authorize"]);
const ADMIN_LOGIN_PATH = "/control-center/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  let email: string | null = null;
  try {
    email = await verifySessionToken(token);
  } catch (error) {
    // SESSION_SECRET missing, etc. — fail closed (treat as unauthenticated) rather than 500ing.
    console.error("Lab session verification failed:", error);
  }

  if (!email) {
    const url = request.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

async function handleControlCenter(request: NextRequest, pathname: string) {
  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  let isAdmin = false;
  try {
    isAdmin = await verifyAdminSessionToken(token);
  } catch (error) {
    console.error("Admin session verification failed:", error);
  }

  if (!isAdmin) {
    // Rewrite (not redirect) to a path that genuinely doesn't exist, so the
    // real not-found page renders while the URL bar still shows
    // /control-center — no redirect flash, no hint that a login page exists.
    return NextResponse.rewrite(new URL("/control-center-unreachable", request.url));
  }

  return NextResponse.next();
}
