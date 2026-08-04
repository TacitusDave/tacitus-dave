"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

interface Member {
  email: string;
  role: "owner" | "admin" | "member";
}

interface Organization {
  id: string;
  name: string;
  ownerEmail: string;
  status: string;
  plan: string;
  currentPeriodEnd: number;
  members: Member[];
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusColor(status: string, currentPeriodEnd: number): string {
  const active = (status === "active" || status === "manual") && currentPeriodEnd * 1000 > Date.now();
  if (active) return "#0ca30c";
  if (status === "attention" || status === "non-renewing") return "#fab219";
  return "#d03b3b";
}

export function OrgManager() {
  const [orgs, setOrgs] = useState<Organization[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [grantEmail, setGrantEmail] = useState("");
  const [grantDays, setGrantDays] = useState("30");

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/organizations");
      const data = (await response.json()) as { organizations?: Organization[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load organizations.");
      setOrgs(data.organizations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organizations.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/organizations")
      .then((response) => response.json())
      .then((data: { organizations?: Organization[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setOrgs(data.organizations ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load organizations.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function callAction(path: string, body: Record<string, unknown>, id: string) {
    setBusyId(id);
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
      setBusyId(null);
    }
  }

  async function handleGrant(event: React.FormEvent) {
    event.preventDefault();
    const days = Number(grantDays) || 30;
    const ok = await callAction("/api/admin/organizations/grant", { email: grantEmail, days }, grantEmail);
    if (ok) {
      setNotice(`Granted ${grantEmail} access for ${days} days.`);
      setGrantEmail("");
      load();
    }
  }

  async function handleRevoke(org: Organization) {
    const ok = await callAction("/api/admin/organizations/revoke", { orgId: org.id }, org.id);
    if (ok) {
      setNotice(`Deactivated ${org.name} — access is revoked for every member immediately.`);
      load();
    }
  }

  async function handleExtend(org: Organization) {
    const ok = await callAction("/api/admin/organizations/grant", { email: org.ownerEmail, days: 30 }, org.id);
    if (ok) {
      setNotice(`Extended ${org.name} by 30 days.`);
      load();
    }
  }

  async function handleResendCode(orgId: string, email: string) {
    const ok = await callAction("/api/admin/organizations/resend-code", { orgId, email }, `${orgId}:${email}`);
    if (ok) setNotice(`Resent ${email}'s access key.`);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleGrant} className="flex flex-wrap items-end gap-3 rounded-md border border-border p-4">
        <div className="flex flex-1 min-w-[200px] flex-col gap-2">
          <label htmlFor="grant-email" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Grant access (comp, no Paystack charge)
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
        <Button type="submit" disabled={busyId !== null}>
          Grant
        </Button>
      </form>

      {notice ? <p style={{ color: "#0ca30c" }} className="text-sm">{notice}</p> : null}
      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {orgs === null ? (
        <p className="text-sm text-foreground-muted">Loading organizations…</p>
      ) : orgs.length === 0 ? (
        <p className="text-sm text-foreground-muted">No organizations yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-muted">
                <th className="px-4 py-3 font-medium">Organization</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Renews / Expires</th>
                <th className="px-4 py-3 font-medium">Members</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orgs.map((org) => (
                <Fragment key={org.id}>
                  <tr>
                    <td className="px-4 py-3 text-foreground">
                      <p>{org.name}</p>
                      <p className="text-xs text-foreground-muted">{org.ownerEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs uppercase tracking-widest"
                        style={{ color: statusColor(org.status, org.currentPeriodEnd) }}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground-muted">{org.plan}</td>
                    <td className="px-4 py-3 text-foreground-muted">
                      {formatDate(org.currentPeriodEnd)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId((current) => (current === org.id ? null : org.id))}
                        className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
                      >
                        {org.members.length} {org.members.length === 1 ? "member" : "members"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === org.id}
                          onClick={() => handleExtend(org)}
                        >
                          +30 days
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busyId === org.id}
                          onClick={() => handleRevoke(org)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === org.id ? (
                    <tr key={`${org.id}-members`}>
                      <td colSpan={6} className="bg-background-elevated/40 px-4 py-3">
                        <ul className="flex flex-col gap-2">
                          {org.members.map((member) => (
                            <li key={member.email} className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-foreground">
                                {member.email} <span className="text-foreground-muted">— {member.role}</span>
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={busyId === `${org.id}:${member.email}`}
                                onClick={() => handleResendCode(org.id, member.email)}
                              >
                                Resend key
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
