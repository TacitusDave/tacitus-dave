"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";
import { analyzePassword, generatePassword, type GeneratorOptions } from "@/lib/lab/password-entropy";

const TOGGLES: Array<{ key: keyof Omit<GeneratorOptions, "length">; label: string }> = [
  { key: "lowercase", label: "a-z" },
  { key: "uppercase", label: "A-Z" },
  { key: "digits", label: "0-9" },
  { key: "symbols", label: "!@#$" },
];

export function PasswordEntropy() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const result = analyzePassword(password);
  const meterWidth = Math.min(100, (result.bits / 128) * 100);

  const [length, setLength] = useState(20);
  const [options, setOptions] = useState<Omit<GeneratorOptions, "length">>({
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
  });

  const noCharsSelected = !options.lowercase && !options.uppercase && !options.digits && !options.symbols;

  function handleGenerate() {
    const generated = generatePassword({ length, ...options });
    if (generated) {
      setPassword(generated);
      setVisible(true);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="password-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Password
        </label>
        <div className="flex gap-2">
          <input
            id="password-input"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className={fieldStyles}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => setVisible((v) => !v)}>
            {visible ? "Hide" : "Show"}
          </Button>
          <CopyButton value={password} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            {result.label}
          </span>
          <span className="font-mono text-sm text-foreground">{result.bits.toFixed(1)} bits</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${meterWidth}%`, backgroundColor: result.color }}
          />
        </div>
      </div>

      <p className="text-xs text-foreground-muted">
        This estimates theoretical entropy from character variety and length only — computed
        entirely in your browser, nothing is transmitted anywhere. It does not check against
        known leaked passwords or dictionary attacks, so a long, common phrase can score higher
        here than it would against a real attacker.
      </p>

      <div className="flex flex-col gap-4 rounded-md border border-border p-4">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Generate one instead</p>

        <div className="flex items-center gap-3">
          <label htmlFor="gen-length" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Length
          </label>
          <input
            id="gen-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="flex-1"
          />
          <span className="w-8 text-right font-mono text-sm text-foreground">{length}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((toggle) => (
            <Button
              key={toggle.key}
              type="button"
              size="sm"
              variant={options[toggle.key] ? "accent" : "outline"}
              onClick={() => setOptions((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
            >
              {toggle.label}
            </Button>
          ))}
        </div>

        {noCharsSelected ? (
          <p style={{ color: "#d03b3b" }} className="text-xs">
            Pick at least one character type.
          </p>
        ) : null}

        <Button type="button" onClick={handleGenerate} disabled={noCharsSelected} className="self-start">
          Generate
        </Button>

        <p className="text-xs text-foreground-muted">
          Generated with the Web Crypto API&apos;s secure random source — not Math.random, which
          isn&apos;t safe for this.
        </p>
      </div>
    </div>
  );
}
