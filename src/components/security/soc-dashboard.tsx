"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SeverityMeter } from "./severity-meter";
import { MitreMatrix, type TacticState } from "./mitre-matrix";
import { EventRow } from "./event-row";
import {
  mitreTactics,
  pickEventTemplate,
  pickStatus,
  severityOrder,
  severityRank,
  type Severity,
  type SecurityEvent,
} from "@/lib/security-sim";

const TICK_MS = 2400;
const MAX_EVENTS = 14;

export function SocDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [running, setRunning] = useState(true);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      const template = pickEventTemplate();
      idRef.current += 1;

      const event: SecurityEvent = {
        ...template,
        id: idRef.current,
        timestamp: new Date(),
        status: pickStatus(template.severity),
      };

      setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [running]);

  const counts = severityOrder.reduce<Record<Severity, number>>(
    (acc, severity) => {
      acc[severity] = events.filter((event) => event.severity === severity).length;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  );

  const maxCount = Math.max(1, ...severityOrder.map((severity) => counts[severity]));

  const tacticStates = mitreTactics.reduce<Record<string, TacticState>>(
    (acc, tactic) => {
      const matches = events.filter((event) => event.tacticId === tactic.id);
      const worstSeverity = matches.reduce<Severity | null>((worst, event) => {
        if (!worst || severityRank[event.severity] > severityRank[worst]) {
          return event.severity;
        }
        return worst;
      }, null);
      acc[tactic.id] = { count: matches.length, worstSeverity };
      return acc;
    },
    {},
  );

  const tacticsObserved = Object.values(tacticStates).filter(
    (state) => state.count > 0,
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-background-elevated/40 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full bg-accent ${running ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Simulated environment — synthetic events, not live telemetry
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => setEvents([])}>
            Reset
          </Button>
          <Button
            type="button"
            variant={running ? "outline" : "accent"}
            size="sm"
            onClick={() => setRunning((value) => !value)}
          >
            {running ? "Pause Feed" : "Resume Feed"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {severityOrder.map((severity) => (
          <SeverityMeter
            key={severity}
            severity={severity}
            count={counts[severity]}
            max={maxCount}
          />
        ))}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            MITRE ATT&amp;CK Coverage
          </h2>
          <p className="font-mono text-xs text-foreground-muted">
            {tacticsObserved} / {mitreTactics.length} tactics observed this session
          </p>
        </div>
        <MitreMatrix tacticStates={tacticStates} />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Live Event Feed
        </h2>
        <div className="overflow-hidden rounded-md border border-border">
          {events.length === 0 ? (
            <p className="p-6 text-sm text-foreground-muted">
              Waiting for the first simulated event…
            </p>
          ) : (
            <div className="divide-y divide-border">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
