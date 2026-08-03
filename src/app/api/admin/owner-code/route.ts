import { NextResponse } from "next/server";
import { getCurrentOwnerCode } from "@/lib/owner-code";

export async function GET() {
  try {
    const info = getCurrentOwnerCode();
    return NextResponse.json({ info });
  } catch (error) {
    console.error("Failed to compute owner code:", error);
    return NextResponse.json({ error: "OWNER_CODE_SECRET isn't set yet." }, { status: 500 });
  }
}
