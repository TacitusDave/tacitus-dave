"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials.");
      }

      router.push("/control-center");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="off"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldStyles}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="admin-code" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Authenticator code
        </label>
        <input
          id="admin-code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          autoComplete="off"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          className={fieldStyles}
        />
      </div>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading || !password || code.length !== 6}>
        {loading ? "Verifying…" : "Sign In"}
      </Button>
    </form>
  );
}
