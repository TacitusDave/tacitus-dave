import { NextResponse } from "next/server";
import { listLabActivity } from "@/lib/lab-activity";

export async function GET() {
  try {
    const activity = await listLabActivity(50);
    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Failed to load lab activity:", error);
    return NextResponse.json({ error: "Failed to load activity." }, { status: 500 });
  }
}
