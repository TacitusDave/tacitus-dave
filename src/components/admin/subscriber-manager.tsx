"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

interface Subscriber {
  email: string;
  status: string;
  plan: string;
  currentPeriodEnd: number;
  stripeCustomerId: string;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusColor(status: string, currentPeriodEnd: number): string {
  const active = (status === "active" || status === "trialing") && currentPeriodEnd * 1000 > Date.now();
  if (active) return "#0ca30c";
  if (status === "past_due") return "#fab219";
  return "#d03b3b";
}

export function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [grantEmail, setGrantEmail] = useState("");
  const [grantDays, setGrantDays] = useState("30");

  const loadSubscribers = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/subscribers");
      const data = (await response.json()) as { subscribers?: Subscriber[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load subscribers.");
      setSubscribers(data.subscribers ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscribers.");
    }
  }, []);

  // Fetches inline (not via loadSubscribers) so the state updates happen
  // inside a .then() callback rather than a direct call from the effect body.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/subscribers")
      .then((response) => response.json())
      .then((data: { subscribers?: Subscriber[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setSubscribers(data.subscribers ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load subscribers.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function callAction(path: string, body: Record<string, unknown>, email: string) {
    setBusyEmail(email);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      return false;
    } finally {
      setBusyEmail(null);
    }
  }

  async function handleGrant(event: React.FormEvent) {
    event.preventDefault();
    const days = Number(grantDays) || 30;
    const ok = await callAction("/api/admin/subscribers/grant", { email: grantEmail, days }, grantEmail);
    if (ok) {
      setNotice(`Granted ${grantEmail} access for ${days} days.`);
      setGrantEmail("");
      loadSubscribers();
    }
  }

  async function handleRevoke(email: string) {
    const ok = await callAction("/api/admin/subscribers/revoke", { email }, email);
    if (ok) {
      setNotice(`Revoked access for ${email}.`);
      loadSubscribers();
    }
  }

  async function handleExtend(email: string) {
    const ok = await callAction("/api/admin/subscribers/grant", { email, days: 30 }, email);
    if (ok) {
      setNotice(`Extended ${email} by 30 days.`);
      loadSubscribers();
    }
  }

  async function handleResendCode(email: string) {
    const ok = await callAction("/api/admin/subscribers/resend-code", { email }, email);
    if (ok) setNotice(`Sent a fresh access code to ${email}.`);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleGrant} className="flex flex-wrap items-end gap-3 rounded-md border border-border p-4">
        <div className="flex flex-1 min-w-[200px] flex-col gap-2">
          <label htmlFor="grant-email" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Grant access (comp, no Stripe charge)
          </label>
          <input
            id="grant-email"
            type="email"
            required
            value={grantEmail}
            onChange={(event) => setGrantEmail(event.target.value)}
            placeholder="someone@example.com"
            className={fieldStyles}
          />
        </div>
        <div className="flex w-24 flex-col gap-2">
          <label htmlFor="grant-days" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Days
          </label>
          <input
            id="grant-days"
            type="number"
            min={1}
            value={grantDays}
            onChange={(event) => setGrantDays(event.target.value)}
            className={fieldStyles}
          />
        </div>
        <Button type="submit" disabled={busyEmail !== null}>
          Grant
        </Button>
      </form>

      {notice ? <p style={{ color: "#0ca30c" }} className="text-sm">{notice}</p> : null}
      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {subscribers === null ? (
        <p className="text-sm text-foreground-muted">Loading subscribers…</p>
      ) : subscribers.length === 0 ? (
        <p className="text-sm text-foreground-muted">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-muted">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Renews / Expires</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.email}>
                  <td className="px-4 py-3 text-foreground">{subscriber.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs uppercase tracking-widest"
                      style={{ color: statusColor(subscriber.status, subscriber.currentPeriodEnd) }}
                    >
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{subscriber.plan}</td>
                  <td className="px-4 py-3 text-foreground-muted">{formatDate(subscriber.currentPeriodEnd)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busyEmail === subscriber.email}
                        onClick={() => handleExtend(subscriber.email)}
                      >
                        +30 days
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busyEmail === subscriber.email}
                        onClick={() => handleResendCode(subscriber.email)}
                      >
                        Resend code
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busyEmail === subscriber.email}
                        onClick={() => handleRevoke(subscriber.email)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
