"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";
import { HEADER_CHECK_TOTAL, type HeaderCheckItem } from "@/lib/security-headers";

interface HeaderCheckResponse {
  url: string;
  finalUrl: string;
  status: number;
  items: HeaderCheckItem[];
  score: number;
  error?: string;
}

export function HeaderCheck() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeaderCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/security/header-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json()) as HeaderCheckResponse;
      if (!response.ok) throw new Error(data.error || "Couldn't check that URL.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't check that URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
          Live Security Header Check
        </h2>
        <p className="font-mono text-xs text-foreground-muted">Real, not simulated</p>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
        Enter a real URL and I&apos;ll actually fetch it and inspect its response headers — the
        same starting point a SOC analyst uses to gauge a site&apos;s baseline hardening. This is
        a preview slice of a real audit (six headers); the full Lab covers a lot more surface.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="example.com"
          spellCheck={false}
          className={`${fieldStyles} min-w-[220px] flex-1`}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Scanning…" : "Scan"}
        </Button>
      </form>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="mt-4 text-sm">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <p className="break-all text-sm text-foreground">{result.finalUrl}</p>
            <p className="font-mono text-xs text-foreground-muted">
              HTTP {result.status} · {result.score}/{HEADER_CHECK_TOTAL} headers present
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {result.items.map((item) => (
              <li key={item.header} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-0.5 shrink-0 font-mono text-xs"
                  style={{ color: item.present ? "#0ca30c" : "#d03b3b" }}
                >
                  {item.present ? "PASS" : "MISSING"}
                </span>
                <div className="min-w-0">
                  <p className="text-foreground">{item.label}</p>
                  <p className="text-xs text-foreground-muted">{item.note}</p>
                  {item.value ? (
                    <p className="mt-1 break-all font-mono text-[11px] text-foreground-muted">
                      {item.value}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
