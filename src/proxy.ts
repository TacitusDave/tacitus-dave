import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export const config = {
  matcher: ["/lab", "/lab/:path*"],
};

const PUBLIC_LAB_PATHS = new Set(["/lab/authorize"]);

export async function proxy(request: NextRequest) {
  if (PUBLIC_LAB_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let email: string | null = null;
  try {
    email = await verifySessionToken(token);
  } catch (error) {
    // SESSION_SECRET missing, etc. — fail closed (treat as unauthenticated) rather than 500ing.
    console.error("Session verification failed:", error);
  }

  if (!email) {
    const url = request.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
