import { NextResponse } from "next/server";
import { getOwnerCode, rotateOwnerCode } from "@/lib/owner-code";

export async function GET() {
  try {
    const record = await getOwnerCode();
    return NextResponse.json({ record });
  } catch (error) {
    console.error("Failed to load owner code:", error);
    return NextResponse.json({ error: "Failed to load access code." }, { status: 500 });
  }
}

export async function POST() {
  try {
    const record = await rotateOwnerCode();
    return NextResponse.json({ record });
  } catch (error) {
    console.error("Failed to rotate owner code:", error);
    return NextResponse.json({ error: "Failed to rotate access code." }, { status: 500 });
  }
}
