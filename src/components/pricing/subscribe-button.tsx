"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";
import type { PricingPlan } from "@/lib/pricing";

export function SubscribeButton({ plan, label }: { plan: PricingPlan["id"]; label: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Something went wrong starting checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className={fieldStyles}
        aria-label={`Email for ${label}`}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Redirecting…" : label}
      </Button>
      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-xs">
          {error}
        </p>
      ) : null}
    </form>
  );
}
