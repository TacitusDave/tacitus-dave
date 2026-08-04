import type { Metadata } from "next";
import { getAccountContext } from "@/lib/account-guard";
import { listOrgMembers } from "@/lib/memberships";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AccountOverviewPage() {
  const context = await getAccountContext();
  if (!context) return null; // layout already redirects — this satisfies TypeScript.

  const members = await listOrgMembers(context.orgId);

  const stats = [
    { label: "Plan", value: context.organization.plan === "annual" ? "Annual" : "Monthly" },
    { label: "Status", value: context.organization.status },
    { label: "Renews", value: formatDate(context.organization.currentPeriodEnd) },
    { label: "Members", value: String(members.length) },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-lg font-medium capitalize text-foreground">{stat.value}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Your role</p>
        <p className="mt-2 text-sm capitalize text-foreground">{context.membership.role}</p>
        <p className="mt-2 text-xs text-foreground-muted">
          Signed in as {context.email}.
        </p>
      </Card>
    </div>
  );
}
