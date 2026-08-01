import { NextRequest, NextResponse } from "next/server";
import { createAuthCode } from "@/lib/auth-code";
import { sendAccessCodeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email } = body as { email?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    const code = await createAuthCode(email);
    await sendAccessCodeEmail(email, code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to resend code:", error);
    return NextResponse.json({ error: "Failed to resend code." }, { status: 500 });
  }
}
