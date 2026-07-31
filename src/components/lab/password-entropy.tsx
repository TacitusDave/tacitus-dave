"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { Button } from "@/components/ui/button";
import { analyzePassword } from "@/lib/lab/password-entropy";

export function PasswordEntropy() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const result = analyzePassword(password);
  const meterWidth = Math.min(100, (result.bits / 128) * 100);

  return (
    <div className="flex flex-col gap-6">
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
    </div>
  );
}
