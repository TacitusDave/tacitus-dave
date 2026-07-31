"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { CopyButton } from "@/components/lab/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = JSON.stringify(JSON.parse(input), null, indent);
    } catch (err) {
      error = err instanceof Error ? err.message : "Invalid JSON.";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="json-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Input
        </label>
        <textarea
          id="json-input"
          rows={8}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='{"hello": "world"}'
          spellCheck={false}
          className={cn(fieldStyles, "resize-none")}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted">Indent</span>
        {[2, 4].map((size) => (
          <Button
            key={size}
            type="button"
            size="sm"
            variant={indent === size ? "accent" : "outline"}
            onClick={() => setIndent(size)}
          >
            {size} spaces
          </Button>
        ))}
        <Button type="button" size="sm" variant={indent === 0 ? "accent" : "outline"} onClick={() => setIndent(0)}>
          Minified
        </Button>
      </div>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          {error}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-widest text-foreground-muted">Output</label>
            <CopyButton value={output} />
          </div>
          <pre className="max-h-96 overflow-auto rounded-md border border-border bg-background-elevated p-4 font-mono text-xs text-foreground">
            {output || "—"}
          </pre>
        </div>
      )}
    </div>
  );
}
