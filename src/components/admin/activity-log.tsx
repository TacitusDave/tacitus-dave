"use client";

import { useEffect, useState } from "react";

interface LabActivityEntry {
  type: "subscriber" | "owner-code";
  email?: string;
  timestamp: number;
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

export function ActivityLog() {
  const [entries, setEntries] = useState<LabActivityEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/activity")
      .then((response) => response.json())
      .then((data: { activity?: LabActivityEntry[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setEntries(data.activity ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load activity.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-md border border-border p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
        Recent Lab access
      </h2>
      <p className="mt-2 text-xs text-foreground-muted">
        Every successful Lab sign-in — by subscriber email, or by the owner access code (logged
        as an unidentified entry, since it isn&apos;t tied to any email).
      </p>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="mt-3 text-sm">
          {error}
        </p>
      ) : null}

      {entries === null ? (
        <p className="mt-4 text-sm text-foreground-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-sm text-foreground-muted">No activity yet.</p>
      ) : (
        <ul className="mt-4 flex max-h-80 flex-col gap-2 overflow-y-auto">
          {entries.map((entry, index) => (
            <li key={index} className="flex items-center justify-between gap-4 text-sm">
              <span
                className={
                  entry.type === "owner-code"
                    ? "font-mono text-xs uppercase tracking-widest text-accent"
                    : "truncate text-foreground"
                }
              >
                {entry.type === "owner-code" ? "Owner code (unidentified source)" : entry.email}
              </span>
              <span className="shrink-0 text-xs text-foreground-muted">
                {formatDate(entry.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
