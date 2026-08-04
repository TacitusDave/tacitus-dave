"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";

const Terminal = dynamic(() => import("@/components/terminal/terminal").then((m) => m.Terminal), {
  ssr: false,
});
const SocDashboard = dynamic(
  () => import("@/components/security/soc-dashboard").then((m) => m.SocDashboard),
  { ssr: false },
);
const FlowBuilder = dynamic(() => import("@/components/flow/flow-builder").then((m) => m.FlowBuilder), {
  ssr: false,
});

const TABS = [
  {
    id: "terminal",
    label: "Terminal",
    title: "A real shell, not a simulation.",
    description: "A command parser, virtual filesystem, and tab-completion — running entirely in your browser.",
  },
  {
    id: "soc",
    label: "SOC Dashboard",
    title: "Threat monitoring, mapped to MITRE ATT&CK.",
    description: "A live simulated event feed plus a genuinely working security-header scanner you can point at any URL.",
  },
  {
    id: "flow",
    label: "Flow Builder",
    title: "A canvas for any kind of diagram.",
    description: "Flowcharts, shapes, and a 300+ icon library — drag, connect, and export, entirely client-side.",
  },
] as const;

const DURATION_MS = 6000;

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    timeoutRef.current = setTimeout(() => {
      setActive((current) => (current + 1) % TABS.length);
    }, DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, paused]);

  const ActiveComponent = active === 0 ? Terminal : active === 1 ? SocDashboard : FlowBuilder;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex flex-col gap-8"
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
              index === active ? "border-accent bg-background-elevated" : "border-border hover:border-accent/50",
            )}
          >
            <span className="relative h-1 w-full overflow-hidden rounded-full bg-border">
              {index === active ? (
                <span
                  key={`${tab.id}-${paused}`}
                  className="absolute inset-y-0 left-0 block rounded-full bg-accent"
                  style={{
                    animation: `feature-showcase-fill ${DURATION_MS}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              ) : index < active ? (
                <span className="absolute inset-0 rounded-full bg-accent" />
              ) : null}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground">{tab.label}</span>
            <span className="text-xs text-foreground-muted">{tab.title}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background-elevated/40 p-2 shadow-lg sm:p-4">
        <p className="mb-4 px-2 text-sm text-foreground-muted">{TABS[active].description}</p>
        <div className="pointer-events-none max-h-[32rem] overflow-hidden rounded-lg">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
