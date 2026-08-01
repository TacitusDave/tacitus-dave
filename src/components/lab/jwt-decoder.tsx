"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";
import { fieldStyles } from "@/components/lab/field-styles";
import { decodeJwt, isHmacAlgorithm, verifyHmacSignature, type DecodedJwt } from "@/lib/lab/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

type VerifyState = { status: "idle" } | { status: "checking" } | { status: "valid" } | { status: "invalid" } | { status: "error"; message: string };

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>({ status: "idle" });

  function handleChange(value: string) {
    setToken(value);
    setVerifyState({ status: "idle" });
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

  function handleVerify() {
    if (!result || !result.algorithm) return;
    setVerifyState({ status: "checking" });

    verifyHmacSignature(result.signingInput, result.signature, secret, result.algorithm)
      .then((valid) => setVerifyState({ status: valid ? "valid" : "invalid" }))
      .catch((err) =>
        setVerifyState({ status: "error", message: err instanceof Error ? err.message : "Couldn't verify." }),
      );
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

          <div className="flex flex-col gap-3 rounded-md border border-border p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Verify signature</p>

            {isHmacAlgorithm(result.algorithm) ? (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="jwt-secret" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
                    {result.algorithm} secret
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="jwt-secret"
                      type="password"
                      value={secret}
                      onChange={(event) => {
                        setSecret(event.target.value);
                        setVerifyState({ status: "idle" });
                      }}
                      autoComplete="off"
                      className={fieldStyles}
                    />
                    <Button type="button" size="sm" onClick={handleVerify} disabled={!secret}>
                      Verify
                    </Button>
                  </div>
                </div>

                {verifyState.status === "valid" ? (
                  <p style={{ color: "#0ca30c" }} className="font-mono text-xs uppercase tracking-widest">
                    Signature valid — this token was signed with that secret.
                  </p>
                ) : null}
                {verifyState.status === "invalid" ? (
                  <p style={{ color: "#d03b3b" }} className="font-mono text-xs uppercase tracking-widest">
                    Signature does not match that secret.
                  </p>
                ) : null}
                {verifyState.status === "error" ? (
                  <p style={{ color: "#d03b3b" }} className="text-xs">
                    {verifyState.message}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-xs text-foreground-muted">
                {result.algorithm
                  ? `${result.algorithm} uses a public/private key pair, not a shared secret — this tool only verifies HMAC (HS256/384/512) tokens.`
                  : "No recognizable algorithm in the header — can't verify."}
              </p>
            )}
          </div>

          <p className="text-xs text-foreground-muted">
            Nothing here is sent anywhere — decoding and verification both run entirely in your
            browser.
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
