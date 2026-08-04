"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";
import { fieldStyles } from "@/components/lab/field-styles";

interface ApiKey {
  id: string;
  label: string;
  keyPreview: string;
  createdAt: number;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/api-keys")
      .then((response) => response.json())
      .then((data: { keys?: ApiKey[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setKeys(data.keys ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load API keys.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    setNewKey(null);
    try {
      const response = await fetch("/api/account/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        record?: ApiKey;
        plaintextKey?: string;
        error?: string;
      };
      if (!response.ok || !data.record || !data.plaintextKey) {
        throw new Error(data.error || "Couldn't create a key.");
      }
      setKeys((current) => [data.record!, ...(current ?? [])]);
      setNewKey(data.plaintextKey);
      setLabel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create a key.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/account/api-keys/${id}`, { method: "DELETE" });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Couldn't revoke that key.");
      setKeys((current) => (current ?? []).filter((key) => key.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't revoke that key.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-md border border-border p-4 text-xs text-foreground-muted">
        These keys aren&apos;t wired to a live API yet — the Lab tools all run entirely in your
        browser, so there&apos;s nothing to authenticate against today. This is here so keys exist
        and can be managed the moment a real API ships.
      </div>

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 rounded-md border border-border p-4">
        <div className="flex flex-1 min-w-[200px] flex-col gap-2">
          <label htmlFor="key-label" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            New key label
          </label>
          <input
            id="key-label"
            type="text"
            required
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. CI pipeline"
            className={fieldStyles}
          />
        </div>
        <Button type="submit" disabled={creating}>
          {creating ? "Creating…" : "Create key"}
        </Button>
      </form>

      {newKey ? (
        <div className="flex flex-col gap-2 rounded-md border border-accent/40 bg-accent/5 p-4">
          <p className="text-xs text-foreground-muted">
            Copy this now — it won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
              {newKey}
            </code>
            <CopyButton value={newKey} />
          </div>
        </div>
      ) : null}

      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {keys === null ? (
        <p className="text-sm text-foreground-muted">Loading keys…</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-foreground-muted">No API keys yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-widest text-foreground-muted">
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-3 text-foreground">{key.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground-muted">{key.keyPreview}</td>
                  <td className="px-4 py-3 text-foreground-muted">{formatDate(key.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busyId === key.id}
                      onClick={() => handleRevoke(key.id)}
                    >
                      Revoke
                    </Button>
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
