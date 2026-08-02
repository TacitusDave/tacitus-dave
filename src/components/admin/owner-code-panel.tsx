"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";

interface OwnerCodeRecord {
  code: string;
  rotatedAt: number;
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
  const [record, setRecord] = useState<OwnerCodeRecord | null | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/owner-code")
      .then((response) => response.json())
      .then((data: { record?: OwnerCodeRecord | null; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setRecord(data.record ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load access code.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRotate() {
    setRotating(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/owner-code", { method: "POST" });
      const data = (await response.json().catch(() => ({}))) as {
        record?: OwnerCodeRecord;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "Failed to rotate access code.");
      setRecord(data.record ?? null);
      setRevealed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rotate access code.");
    } finally {
      setRotating(false);
    }
  }

  return (
    <div className="rounded-md border border-border p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
        Owner access code
      </h2>
      <p className="mt-2 text-xs text-foreground-muted">
        Bypasses billing entirely — enter this at /lab/authorize for free Lab access. Rotate it
        any time (e.g. if you suspect someone else has seen it); the old code stops working the
        instant you do.
      </p>

      {record === undefined ? (
        <p className="mt-4 text-sm text-foreground-muted">Loading…</p>
      ) : record === null ? (
        <p className="mt-4 text-sm text-foreground-muted">No code generated yet.</p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <code className="rounded-md border border-border bg-background-elevated px-3 py-2 font-mono text-sm text-foreground">
            {revealed ? record.code : "•".repeat(record.code.length)}
          </code>
          <Button type="button" variant="outline" size="sm" onClick={() => setRevealed((v) => !v)}>
            {revealed ? "Hide" : "Reveal"}
          </Button>
          <CopyButton value={record.code} />
          <span className="text-xs text-foreground-muted">Rotated {formatDate(record.rotatedAt)}</span>
        </div>
      )}

      {error ? (
        <p style={{ color: "#d03b3b" }} className="mt-3 text-sm">
          {error}
        </p>
      ) : null}

      <Button type="button" className="mt-4" disabled={rotating} onClick={handleRotate}>
        {rotating ? "Rotating…" : "Rotate code"}
      </Button>
    </div>
  );
}
