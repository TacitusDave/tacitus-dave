"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "@/lib/pricing";

export function SubscribeButton({ plan, label }: { plan: PricingPlan["id"]; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleClick} disabled={loading} className="w-full">
        {loading ? "Redirecting…" : label}
      </Button>
      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
