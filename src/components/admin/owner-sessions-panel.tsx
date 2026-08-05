"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface OwnerSession {
  sessionId: string;
  ip: string;
  createdAt: number;
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

/**
 * The owner access code is a shared secret with no identity attached to it —
 * this panel is the accountability layer: who's redeemed it, from where,
 * and a way to cut off one specific redemption without rotating the code
 * and logging every legitimate use out at once.
 */
export function OwnerSessionsPanel() {
  const [sessions, setSessions] = useState<OwnerSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/owner-sessions")
      .then((response) => response.json())
      .then((data: { sessions?: OwnerSession[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setSessions(data.sessions ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load owner sessions.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRevoke(sessionId: string) {
    setBusyId(sessionId);
    setError(null);
    try {
      const response = await fetch("/api/admin/owner-sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to revoke session.");
      setSessions((current) => current?.filter((s) => s.sessionId !== sessionId) ?? current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke session.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-md border border-border p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Owner code sessions</h2>
      <p className="mt-2 text-xs text-foreground-muted">
        Every redemption of the owner access code, by IP — since the code itself isn&apos;t tied to
        anyone. Revoking one signs that redemption out immediately without touching the code or
        anyone else&apos;s session. Every session here also disappears automatically the moment the
        code above rotates, whether that&apos;s its normal 12-hour refresh or a manual
        regeneration — a fresh start every time, with nothing further to click.
      </p>

      {sessions === null ? (
        <p className="mt-4 text-sm text-foreground-muted">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="mt-4 text-sm text-foreground-muted">No active owner-code sessions.</p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-border">
          {sessions.map((session) => (
            <div key={session.sessionId} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-sm text-foreground">{session.ip}</span>
                <span className="text-xs text-foreground-muted">{formatDate(session.createdAt)}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busyId === session.sessionId}
                onClick={() => handleRevoke(session.sessionId)}
              >
                {busyId === session.sessionId ? "Revoking…" : "Revoke"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <p style={{ color: "#d03b3b" }} className="mt-3 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
