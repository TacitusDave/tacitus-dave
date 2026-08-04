"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LabMeResponse {
  authenticated: boolean;
  isOwner?: boolean;
  currentPeriodEnd?: number;
}

function formatRemaining(currentPeriodEnd: number, now: number): string {
  const diffMs = currentPeriodEnd * 1000 - now;
  if (diffMs <= 0) return "Expired";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  }
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function SubscriptionCountdown() {
  const [info, setInfo] = useState<LabMeResponse | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;

    fetch("/api/lab/me")
      .then((response) => response.json())
      .then((data: LabMeResponse) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        if (!cancelled) setInfo({ authenticated: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!info?.authenticated || info.isOwner || !info.currentPeriodEnd) return;

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [info]);

  if (!info?.authenticated || info.isOwner || !info.currentPeriodEnd) return null;

  return (
    <Link
      href="/account"
      className="fixed right-4 top-20 z-40 rounded-full border border-border bg-background-elevated/90 px-3 py-1.5 font-mono text-[11px] text-foreground-muted shadow-lg backdrop-blur-sm transition-colors hover:border-accent sm:right-6"
    >
      <span className="text-accent">{formatRemaining(info.currentPeriodEnd, now)}</span>
      <span className="ml-1.5 hidden sm:inline">left</span>
    </Link>
  );
}
