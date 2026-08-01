"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/lab/field-styles";

export function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;

    let cancelled = false;

    QRCode.toDataURL(text, { width: 512, margin: 2, color: { dark: "#0a0b0d", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't generate a QR code for that.");
          setDataUrl(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [text]);

  const displayDataUrl = text ? dataUrl : null;
  const displayError = text ? error : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="qr-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Text or URL
        </label>
        <textarea
          id="qr-input"
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="https://example.com"
          className={`${fieldStyles} resize-none`}
          spellCheck={false}
        />
      </div>

      {displayError ? <p style={{ color: "#d03b3b" }} className="text-sm">{displayError}</p> : null}

      {displayDataUrl ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-border p-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- a data: URL, not an optimizable static asset */}
          <img src={displayDataUrl} alt="Generated QR code" className="h-56 w-56 rounded-md bg-white p-2" />
          <a href={displayDataUrl} download="qr-code.png" className="inline-block">
            <Button type="button" variant="outline" size="sm">
              Download PNG
            </Button>
          </a>
        </div>
      ) : null}

      <p className="text-xs text-foreground-muted">
        Generated entirely in your browser — nothing you type here is sent anywhere.
      </p>
    </div>
  );
}
