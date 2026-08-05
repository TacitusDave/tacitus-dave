import { NextResponse } from "next/server";
import { listOwnerSessions } from "@/lib/owner-sessions";

export async function GET() {
  try {
    const sessions = await listOwnerSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Failed to list owner sessions:", error);
    return NextResponse.json({ error: "Failed to load owner sessions." }, { status: 500 });
  }
}
