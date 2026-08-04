import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthorizeFlow } from "@/components/lab/authorize-flow";
import { RadialBurst } from "@/components/lab/radial-burst";

export const metadata: Metadata = {
  title: "Lab Authorization",
  description: "Sign in to the Tacitus Dave Lab with your subscriber email.",
};

export default function AuthorizePage() {
  return (
    <section className="gate-dark relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-16">
      <RadialBurst
        className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 text-white/40"
        style={{
          maskImage: "radial-gradient(circle, black 0%, black 35%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, black 35%, transparent 72%)",
        }}
      />

      <div className="relative flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Lab Authorization Center
        </div>

        <div className="gate-dark__terminal w-full overflow-hidden rounded-lg border border-border bg-background-elevated shadow-2xl">
          <div className="relative flex items-center justify-center border-b border-border px-4 py-2.5">
            <div className="absolute left-4 flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-foreground-muted">
              Enter access key
            </p>
          </div>
          <div className="p-6">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-white/5" />}>
              <AuthorizeFlow />
            </Suspense>
          </div>
        </div>

        <p className="max-w-sm text-center text-xs text-foreground-muted">
          The key you were emailed at signup stays valid for as long as your subscription is active.
        </p>
      </div>
    </section>
  );
}
