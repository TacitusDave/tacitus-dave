import { redirect } from "next/navigation";
import { getAccountContext } from "@/lib/account-guard";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const context = await getAccountContext();
  if (!context) {
    redirect("/lab/authorize");
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Account</p>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">{context.organization.name}</h1>
      </div>

      <div className="mt-8">
        <AccountNav canManage={context.membership.role === "owner" || context.membership.role === "admin"} />
      </div>

      <div className="mt-8">{children}</div>
    </section>
  );
}
