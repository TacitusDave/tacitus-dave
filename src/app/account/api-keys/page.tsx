import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccountContext, isOwnerOrAdmin } from "@/lib/account-guard";
import { ApiKeyManager } from "@/components/account/api-key-manager";

export const metadata: Metadata = { title: "API Keys", robots: { index: false, follow: false } };

export default async function ApiKeysPage() {
  const context = await getAccountContext();
  if (!context || !isOwnerOrAdmin(context.membership)) {
    redirect("/account");
  }

  return <ApiKeyManager />;
}
