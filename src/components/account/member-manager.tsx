"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

interface Member {
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: number | null;
}

interface Invite {
  id: string;
  email: string;
  role: "admin" | "member";
  invitedBy: string;
  createdAt: number;
}

export function MemberManager() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/account/members");
      const data = (await response.json()) as { members?: Member[]; invites?: Invite[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load members.");
      setMembers(data.members ?? []);
      setInvites(data.invites ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/members")
      .then((response) => response.json())
      .then((data: { members?: Member[]; invites?: Invite[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setMembers(data.members ?? []);
        setInvites(data.invites ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load members.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleInvite(event: React.FormEvent) {
    event.preventDefault();
    setInviting(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/account/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Couldn't send the invite.");
      setNotice(`Invited ${inviteEmail}.`);
      setInviteEmail("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the invite.");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setBusyEmail(email);
    setError(null);
    try {
      const response = await fetch(`/api/account/members/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Couldn't remove that member.");
      setNotice(`Removed ${email}.`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't remove that member.");
    } finally {
      setBusyEmail(null);
    }
  }

  async function handleRoleChange(email: string, role: Member["role"]) {
    setBusyEmail(email);
    setError(null);
    try {
      const response = await fetch(`/api/account/members/${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Couldn't update that member's role.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update that member's role.");
    } finally {
      setBusyEmail(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3 rounded-md border border-border p-4">
        <div className="flex flex-1 min-w-[200px] flex-col gap-2">
          <label htmlFor="invite-email" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Invite a teammate
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="teammate@example.com"
            className={fieldStyles}
          />
        </div>
        <div className="flex w-32 flex-col gap-2">
          <label htmlFor="invite-role" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Role
          </label>
          <select
            id="invite-role"
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as "admin" | "member")}
            className={fieldStyles}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" disabled={inviting}>
          {inviting ? "Sending…" : "Invite"}
        </Button>
      </form>

      {notice ? <p style={{ color: "#0ca30c" }} className="text-sm">{notice}</p> : null}
      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {members === null ? (
        <p className="text-sm text-foreground-muted">Loading members…</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-muted">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.email}>
                  <td className="px-4 py-3 text-foreground">{member.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      disabled={busyEmail === member.email}
                      onChange={(event) => handleRoleChange(member.email, event.target.value as Member["role"])}
                      className="rounded-md border border-border bg-background-elevated px-2 py-1 font-mono text-xs uppercase tracking-widest text-foreground outline-none focus:border-accent"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busyEmail === member.email}
                      onClick={() => handleRemove(member.email)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invites.length > 0 ? (
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">Pending invites</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3 text-sm"
              >
                <span className="text-foreground-muted">
                  {invite.email} <span className="text-xs">— {invite.role}</span>
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">Pending</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
