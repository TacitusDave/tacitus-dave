import { getRedis } from "@/lib/redis";

export interface InvoiceRecord {
  orgId: string;
  amountNgn: number | null;
  plan: "monthly" | "annual";
  /** Unix seconds. */
  paidAt: number;
}

function orgInvoicesKey(orgId: string): string {
  return `org-invoices:${orgId}`;
}

/** Append-only — billing history, not a rolling log, so unlike lab-activity.ts this is never trimmed. */
export async function appendInvoice(record: InvoiceRecord): Promise<void> {
  await getRedis().lpush(orgInvoicesKey(record.orgId), record);
}

export async function listInvoices(orgId: string, limit = 100): Promise<InvoiceRecord[]> {
  return getRedis().lrange<InvoiceRecord>(orgInvoicesKey(orgId), 0, limit - 1);
}
