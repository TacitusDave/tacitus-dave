import { NextRequest, NextResponse } from "next/server";
import { revokeOwnerSession } from "@/lib/owner-sessions";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { sessionId } = body as { sessionId?: unknown };

  if (typeof sessionId !== "string" || !sessionId) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 });
  }

  try {
    await revokeOwnerSession(sessionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to revoke owner session:", error);
    return NextResponse.json({ error: "Failed to revoke session." }, { status: 500 });
  }
}
