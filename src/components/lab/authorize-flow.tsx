"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

type Step = "email" | "code";

export function AuthorizeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleRequestCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong.");
      }
      setNotice("If that email has an active subscription, a code is on its way.");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Invalid or expired code.");
      }
      router.push("/lab");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="authorize-email" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Subscriber email
          </label>
          <input
            id="authorize-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldStyles}
          />
        </div>
        {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send Access Code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
      {notice ? <p className="text-sm text-foreground-muted">{notice}</p> : null}
      <div className="flex flex-col gap-2">
        <label htmlFor="authorize-code" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          6-digit code
        </label>
        <input
          id="authorize-code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          className={fieldStyles}
        />
      </div>
      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading || code.length !== 6}>
          {loading ? "Verifying…" : "Enter the Lab"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setStep("email")}>
          Use a different email
        </Button>
      </div>
    </form>
  );
}
