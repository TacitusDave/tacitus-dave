import { NextResponse } from "next/server";
import { listSubscribers } from "@/lib/subscribers";

export async function GET() {
  try {
    const subscribers = await listSubscribers();
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Failed to list subscribers:", error);
    return NextResponse.json({ error: "Failed to load subscribers." }, { status: 500 });
  }
}
