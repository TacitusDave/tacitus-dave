import { severityColor, severityLabel, type Severity } from "@/lib/security-sim";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-foreground-muted">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: severityColor[severity] }}
        aria-hidden="true"
      />
      {severityLabel[severity]}
    </span>
  );
}
