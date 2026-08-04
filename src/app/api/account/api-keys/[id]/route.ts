import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { revokeApiKey } from "@/lib/api-keys";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await revokeApiKey(context.orgId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
