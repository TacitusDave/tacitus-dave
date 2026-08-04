import type { Metadata } from "next";
import { getAccountContext } from "@/lib/account-guard";
import { listInvoices } from "@/lib/invoices";

export const metadata: Metadata = { title: "Billing", robots: { index: false, follow: false } };

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BillingPage() {
  const context = await getAccountContext();
  if (!context) return null;

  const invoices = await listInvoices(context.orgId);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-background-elevated/60 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Current plan</p>
        <p className="mt-2 text-lg font-medium capitalize text-foreground">
          {context.organization.plan} — {context.organization.status}
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          Renews {formatDate(context.organization.currentPeriodEnd)}.
        </p>
      </div>

      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Invoice history</h2>
        {invoices.length === 0 ? (
          <p className="mt-3 text-sm text-foreground-muted">No invoices yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-muted">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice, index) => (
                  <tr key={`${invoice.paidAt}-${index}`}>
                    <td className="px-4 py-3 text-foreground">{formatDate(invoice.paidAt)}</td>
                    <td className="px-4 py-3 capitalize text-foreground-muted">{invoice.plan}</td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {invoice.amountNgn !== null ? `₦${invoice.amountNgn.toLocaleString()}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
