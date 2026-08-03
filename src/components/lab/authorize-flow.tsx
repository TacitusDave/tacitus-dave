"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

type Step = "locked-email" | "key" | "owner";

export function AuthorizeFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoEmail = searchParams.get("email");

  const [step, setStep] = useState<Step>(autoEmail ? "locked-email" : "key");
  const [accessKey, setAccessKey] = useState("");
  const [ownerCode, setOwnerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSendKey(event: React.FormEvent) {
    event.preventDefault();
    if (!autoEmail) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/send-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: autoEmail }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong.");
      }
      setNotice(`If ${autoEmail} has an active subscription, your access key is on its way there.`);
      setStep("key");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyKey(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: accessKey }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Invalid or expired access key.");
      }
      router.push("/lab");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOwnerCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/owner-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ownerCode }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Invalid access code.");
      }
      router.push("/lab");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "locked-email" && autoEmail) {
    return (
      <form onSubmit={handleSendKey} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="authorize-locked-email" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Subscriber email
          </label>
          <input
            id="authorize-locked-email"
            type="email"
            value={autoEmail}
            readOnly
            disabled
            className={`${fieldStyles} cursor-not-allowed opacity-70`}
          />
          <p className="text-xs text-foreground-muted">
            This is the email you just subscribed with — that&apos;s the only one that can access
            the Lab from this checkout.
          </p>
        </div>
        {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send my access key"}
        </Button>
        <p className="text-xs text-foreground-muted">
          Subscribed with a different email?{" "}
          <Link href="/pricing" className="text-accent hover:underline">
            Go back and subscribe with that one
          </Link>
          .
        </p>
      </form>
    );
  }

  if (step === "owner") {
    return (
      <form onSubmit={handleOwnerCode} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="authorize-owner-code" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Access code
          </label>
          <input
            id="authorize-owner-code"
            type="text"
            required
            autoComplete="off"
            value={ownerCode}
            onChange={(event) => setOwnerCode(event.target.value)}
            className={fieldStyles}
          />
        </div>
        {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !ownerCode.trim()}>
            {loading ? "Verifying…" : "Enter the Lab"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setError(null);
              setStep("key");
            }}
          >
            Back
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyKey} className="flex flex-col gap-4">
      {notice ? <p className="text-sm text-foreground-muted">{notice}</p> : null}
      <div className="flex flex-col gap-2">
        <label htmlFor="authorize-key" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Access key
        </label>
        <input
          id="authorize-key"
          type="text"
          autoComplete="off"
          spellCheck={false}
          required
          value={accessKey}
          onChange={(event) => setAccessKey(event.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
          className={`${fieldStyles} font-mono uppercase tracking-widest`}
        />
        <p className="text-xs text-foreground-muted">
          This is the key we emailed you when you subscribed — it stays valid for as long as your
          subscription is active, so you&apos;ll enter this same one every time.
        </p>
      </div>
      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}
      <Button type="submit" disabled={loading || !accessKey.trim()}>
        {loading ? "Verifying…" : "Enter the Lab"}
      </Button>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep("owner");
          }}
          className="self-start text-xs text-foreground-muted transition-colors hover:text-accent"
        >
          Have an owner access code instead?
        </button>
        <p className="text-xs text-foreground-muted">
          Lost your key or subscribed with a different email?{" "}
          <Link href="/pricing" className="text-accent hover:underline">
            Go to pricing
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
