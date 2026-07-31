"use client";

import { useState } from "react";
import { CopyButton } from "@/components/lab/copy-button";
import { fieldStyles } from "@/components/lab/field-styles";
import { decodeJwt, type DecodedJwt } from "@/lib/lab/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(value: string) {
    setToken(value);
    if (!value.trim()) {
      setResult(null);
      setError(null);
      return;
    }
    try {
      setResult(decodeJwt(value));
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Couldn't decode that token.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="jwt-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Token
          </label>
          <button
            type="button"
            onClick={() => handleChange(SAMPLE)}
            className="font-mono text-xs text-accent hover:underline"
          >
            Use a sample token
          </button>
        </div>
        <textarea
          id="jwt-input"
          rows={4}
          value={token}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="eyJhbGciOi..."
          className={`${fieldStyles} resize-none`}
          spellCheck={false}
        />
      </div>

      {error ? <p style={{ color: "#d03b3b" }} className="text-sm">{error}</p> : null}

      {result ? (
        <div className="flex flex-col gap-6">
          {result.expiresAt ? (
            <p
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: result.isExpired ? "#d03b3b" : "#0ca30c" }}
            >
              {result.isExpired ? "Expired" : "Valid"} — expires {result.expiresAt.toLocaleString()}
            </p>
          ) : null}

          <JsonBlock label="Header" value={result.header} />
          <JsonBlock label="Payload" value={result.payload} />

          <p className="text-xs text-foreground-muted">
            Signature not verified — this only decodes the token&apos;s contents. It does not
            confirm the token is authentic or was issued by a trusted server.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  const formatted = JSON.stringify(value, null, 2);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{label}</p>
        <CopyButton value={formatted} />
      </div>
      <pre className="overflow-x-auto rounded-md border border-border bg-background-elevated p-4 text-xs text-foreground">
        {formatted}
      </pre>
    </div>
  );
}
