import { NextRequest, NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscribers";
import { sendAccessKeyEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email } = body as { email?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    const subscriber = await getSubscriber(email);
    if (!subscriber?.accessKey) {
      return NextResponse.json({ error: "No access key on file for that email." }, { status: 404 });
    }

    // Resends the same persistent key — it never regenerates on its own.
    await sendAccessKeyEmail(email, subscriber.accessKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to resend access key:", error);
    return NextResponse.json({ error: "Failed to resend access key." }, { status: 500 });
  }
}
