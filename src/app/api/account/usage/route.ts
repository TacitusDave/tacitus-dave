import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { listLabActivityForOrg } from "@/lib/lab-activity";

export async function GET(request: NextRequest) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activity = await listLabActivityForOrg(context.orgId);
    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Failed to load usage:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
