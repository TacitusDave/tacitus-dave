import { NextRequest, NextResponse } from "next/server";
import { getAccountContextFromRequest, isOwnerOrAdmin } from "@/lib/account-guard";
import { createApiKey, listApiKeys } from "@/lib/api-keys";

export async function GET(request: NextRequest) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const keys = await listApiKeys(context.orgId);
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("Failed to list API keys:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const context = await getAccountContextFromRequest(request);
  if (!context || !isOwnerOrAdmin(context.membership)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const label = (body as { label?: unknown }).label;
  if (typeof label !== "string" || !label.trim()) {
    return NextResponse.json({ error: "Give the key a label." }, { status: 400 });
  }

  try {
    const { record, plaintextKey } = await createApiKey({
      orgId: context.orgId,
      createdBy: context.email,
      label: label.trim(),
    });
    return NextResponse.json({ record, plaintextKey });
  } catch (error) {
    console.error("Failed to create API key:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
