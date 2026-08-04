import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAccountContext, isOwnerOrAdmin } from "@/lib/account-guard";
import { MemberManager } from "@/components/account/member-manager";

export const metadata: Metadata = { title: "Members", robots: { index: false, follow: false } };

export default async function MembersPage() {
  const context = await getAccountContext();
  if (!context || !isOwnerOrAdmin(context.membership)) {
    redirect("/account");
  }

  return <MemberManager />;
}
