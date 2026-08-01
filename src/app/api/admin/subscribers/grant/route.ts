import { NextRequest, NextResponse } from "next/server";
import { grantManualAccess } from "@/lib/subscribers";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, days } = body as { email?: unknown; days?: unknown };

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    const record = await grantManualAccess(email, typeof days === "number" && days > 0 ? days : 30);
    return NextResponse.json({ subscriber: record });
  } catch (error) {
    console.error("Failed to grant access:", error);
    return NextResponse.json({ error: "Failed to grant access." }, { status: 500 });
  }
}
