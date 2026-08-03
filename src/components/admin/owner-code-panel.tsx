"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";

interface OwnerCodeInfo {
  code: string;
  validUntil: number;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OwnerCodePanel() {
  const [info, setInfo] = useState<OwnerCodeInfo | null | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fetchCode(): Promise<void> {
    return fetch("/api/admin/owner-code")
      .then((response) => response.json())
      .then((data: { info?: OwnerCodeInfo; error?: string }) => {
        if (data.error) throw new Error(data.error);
        setInfo(data.info ?? null);
      })
      .catch((err) => {
        setInfo(null);
        setError(err instanceof Error ? err.message : "Failed to load access code.");
      });
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/owner-code")
      .then((response) => response.json())
      .then((data: { info?: OwnerCodeInfo; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setInfo(data.info ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setInfo(null);
          setError(err instanceof Error ? err.message : "Failed to load access code.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    setLoading(true);
    setError(null);
    fetchCode().finally(() => setLoading(false));
  }

  return (
    <div className="rounded-md border border-border p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
        Owner access code
      </h2>
      <p className="mt-2 text-xs text-foreground-muted">
        Bypasses billing entirely — enter this at /lab/authorize for free Lab access. It rotates
        itself automatically every 12 hours, so there&apos;s nothing to click and nothing that
        depends on a database — a leaked code is only useful until its own expiry below.
      </p>

      {info === undefined ? (
        <p className="mt-4 text-sm text-foreground-muted">Loading…</p>
      ) : info === null ? (
        <p className="mt-4 text-sm text-foreground-muted">
          Not configured yet — add <code className="font-mono text-accent">OWNER_CODE_SECRET</code>{" "}
          to your environment variables (see <code className="font-mono">.env.example</code> for
          how to generate one).
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code className="rounded-md border border-border bg-background-elevated px-3 py-2 font-mono text-sm tracking-widest text-foreground">
            {revealed ? info.code : "•".repeat(info.code.length)}
          </code>
          <Button type="button" variant="outline" size="sm" onClick={() => setRevealed((v) => !v)}>
            {revealed ? "Hide" : "Reveal"}
          </Button>
          <CopyButton value={info.code} />
          <span className="text-xs text-foreground-muted">
            Rotates at {formatDate(info.validUntil)}
          </span>
        </div>
      )}

      {error ? (
        <p style={{ color: "#d03b3b" }} className="mt-3 text-sm">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" disabled={loading} onClick={handleRefresh}>
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
        <span className="text-xs text-foreground-muted">
          Need it dead right now, not in up to 12 hours? Run{" "}
          <code className="font-mono text-accent">node scripts/generate-owner-code-secret.mjs</code>{" "}
          locally, replace <code className="font-mono">OWNER_CODE_SECRET</code> in Vercel with the
          new value, and redeploy — that invalidates every code generated from the old secret
          immediately.
        </span>
      </div>
    </div>
  );
}
