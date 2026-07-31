"use client";

import { Dialog } from "@/components/ui/dialog";
import { SeverityBadge } from "./severity-badge";
import { mitreTactics, type SecurityEvent } from "@/lib/security-sim";

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour12: false });
}

export function EventRow({ event }: { event: SecurityEvent }) {
  const tactic = mitreTactics.find((t) => t.id === event.tacticId);

  return (
    <Dialog
      title={event.technique}
      description={tactic?.label}
      trigger={(open) => (
        <button
          type="button"
          onClick={open}
          className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 text-left text-sm outline-none transition-colors hover:bg-background-elevated focus-visible:bg-background-elevated"
        >
          <span className="font-mono text-xs tabular-nums text-foreground-muted">
            {formatTime(event.timestamp)}
          </span>
          <span className="truncate text-foreground">{event.message}</span>
          <SeverityBadge severity={event.severity} />
          <span className="hidden font-mono text-xs uppercase tracking-widest text-foreground-muted sm:inline">
            {event.status}
          </span>
        </button>
      )}
    >
      <div className="flex flex-col gap-4">
        <SeverityBadge severity={event.severity} />
        <p className="text-sm text-foreground-muted">{event.detail}</p>
        <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
          <div>
            <dt className="font-mono uppercase tracking-widest text-foreground-muted">
              Status
            </dt>
            <dd className="mt-1 text-foreground">{event.status}</dd>
          </div>
          <div>
            <dt className="font-mono uppercase tracking-widest text-foreground-muted">
              Detected
            </dt>
            <dd className="mt-1 text-foreground">{formatTime(event.timestamp)}</dd>
          </div>
        </dl>
      </div>
    </Dialog>
  );
}
