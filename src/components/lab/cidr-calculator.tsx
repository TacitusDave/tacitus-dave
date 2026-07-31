"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { parseCidr, type CidrResult } from "@/lib/lab/cidr";

export function CidrCalculator() {
  const [input, setInput] = useState("192.168.1.10/24");
  const [result, setResult] = useState<CidrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(value: string) {
    setInput(value);
    if (!value.trim()) {
      setResult(null);
      setError(null);
      return;
    }
    try {
      setResult(parseCidr(value));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Couldn't parse that.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="cidr-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          CIDR block
        </label>
        <input
          id="cidr-input"
          value={input}
          onChange={(event) => handleChange(event.target.value)}
          spellCheck={false}
          className={fieldStyles}
        />
      </div>

      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {result ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field label="Network address" value={result.networkAddress} />
          <Field label="Broadcast address" value={result.broadcastAddress} />
          <Field label="Subnet mask" value={result.subnetMask} />
          <Field label="Prefix" value={`/${result.prefix}`} />
          <Field
            label="Usable host range"
            value={
              result.firstUsable && result.lastUsable
                ? `${result.firstUsable} – ${result.lastUsable}`
                : "None"
            }
          />
          <Field label="Usable hosts" value={result.usableHosts.toLocaleString()} />
        </dl>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <dt className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}
