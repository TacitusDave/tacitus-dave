"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { CopyButton } from "@/components/lab/copy-button";
import { convertCase } from "@/lib/lab/case-converter";

export function CaseConverter() {
  const [input, setInput] = useState("");
  const result = input.trim() ? convertCase(input) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="case-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Input
        </label>
        <input
          id="case-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="some_example text-here"
          spellCheck={false}
          className={fieldStyles}
        />
      </div>

      {result ? (
        <div className="flex flex-col divide-y divide-border rounded-md border border-border">
          {Object.entries(result).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 p-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">{label}</p>
                <p className="break-all font-mono text-sm text-foreground">{value}</p>
              </div>
              <CopyButton value={value} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
