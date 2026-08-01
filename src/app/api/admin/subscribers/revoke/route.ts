import { NextRequest, NextResponse } from "next/server";
import { revokeAccess } from "@/lib/subscribers";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email } = body as { email?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    await revokeAccess(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to revoke access:", error);
    return NextResponse.json({ error: "Failed to revoke access." }, { status: 500 });
  }
}
