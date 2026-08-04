"use client";

import { useEffect, useState } from "react";

interface UsageEntry {
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

export function UsageLog() {
  const [entries, setEntries] = useState<UsageEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/usage")
      .then((response) => response.json())
      .then((data: { activity?: UsageEntry[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setEntries(data.activity ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load usage.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-foreground-muted">
        Sign-ins by anyone on this team — the same activity the site owner sees on their end, just
        scoped to your organization.
      </p>

      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {entries === null ? (
        <p className="text-sm text-foreground-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-foreground-muted">No activity yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((entry, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm"
            >
              <span className="truncate text-foreground">{entry.email}</span>
              <span className="shrink-0 text-xs text-foreground-muted">{formatDate(entry.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
