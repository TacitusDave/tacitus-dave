"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { contrastRatio, WCAG_THRESHOLDS } from "@/lib/lab/contrast";

export function ContrastChecker() {
  const [foreground, setForeground] = useState("#e8eaed");
  const [background, setBackground] = useState("#0a0b0d");
  const [error, setError] = useState<string | null>(null);

  let ratio: number | null = null;
  try {
    ratio = contrastRatio(foreground, background);
    if (error) setError(null);
  } catch {
    // handled below via ratio === null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField label="Text color" value={foreground} onChange={setForeground} />
        <ColorField label="Background color" value={background} onChange={setBackground} />
      </div>

      <div
        className="flex h-32 items-center justify-center rounded-md border border-border text-lg font-medium"
        style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$/.test(background) ? background : undefined, color: /^#[0-9a-fA-F]{3,6}$/.test(foreground) ? foreground : undefined }}
      >
        The quick brown fox
      </div>

      {ratio === null ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          Enter two valid hex colors to see the contrast ratio.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-2xl text-foreground">{ratio.toFixed(2)} : 1</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {WCAG_THRESHOLDS.map((threshold) => {
              const pass = (ratio as number) >= threshold.value;
              return (
                <div
                  key={threshold.label}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs"
                >
                  <span className="text-foreground-muted">{threshold.label}</span>
                  <span
                    className="font-mono uppercase tracking-widest"
                    style={{ color: pass ? "#0ca30c" : "#d03b3b" }}
                  >
                    {pass ? "Pass" : "Fail"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent"
          aria-label={`${label} picker`}
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label={`${label} hex value`}
          className={fieldStyles}
        />
      </div>
    </div>
  );
}
