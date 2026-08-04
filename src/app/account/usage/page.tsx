import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccountContext, isOwnerOrAdmin } from "@/lib/account-guard";
import { UsageLog } from "@/components/account/usage-log";

export const metadata: Metadata = { title: "Usage", robots: { index: false, follow: false } };

export default async function UsagePage() {
  const context = await getAccountContext();
  if (!context || !isOwnerOrAdmin(context.membership)) {
    redirect("/account");
  }

  return <UsageLog />;
}
