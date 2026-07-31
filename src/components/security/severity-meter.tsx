import { severityColor, type Severity } from "@/lib/security-sim";
import { SeverityBadge } from "./severity-badge";

export function SeverityMeter({
  severity,
  count,
  max,
}: {
  severity: Severity;
  count: number;
  max: number;
}) {
  const width = max > 0 && count > 0 ? Math.max((count / max) * 100, 6) : 0;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-4">
      <div className="flex items-center justify-between">
        <SeverityBadge severity={severity} />
        <span className="font-mono text-lg text-foreground">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${width}%`, backgroundColor: severityColor[severity] }}
        />
      </div>
    </div>
  );
}
