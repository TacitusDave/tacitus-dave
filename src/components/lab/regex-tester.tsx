"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { testRegex, buildHighlightSegments } from "@/lib/lab/regex";

const FLAG_OPTIONS = [
  { flag: "g", label: "global" },
  { flag: "i", label: "case-insensitive" },
  { flag: "m", label: "multiline" },
  { flag: "s", label: "dotAll" },
];

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Contact us at hello@example.com or support@example.org.");

  const { matches, error } = testRegex(pattern, flags, input);
  const segments = buildHighlightSegments(input, matches);

  function toggleFlag(flag: string) {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="regex-pattern" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Pattern
        </label>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-foreground-muted">/</span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck={false}
            className={fieldStyles}
          />
          <span className="text-foreground-muted">/{flags}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FLAG_OPTIONS.map(({ flag, label }) => (
          <button
            key={flag}
            type="button"
            onClick={() => toggleFlag(flag)}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              flags.includes(flag)
                ? "border-accent text-accent"
                : "border-border text-foreground-muted hover:border-accent hover:text-accent"
            }`}
          >
            {flag} · {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="regex-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Test string
        </label>
        <textarea
          id="regex-input"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          className={`${fieldStyles} resize-none`}
        />
      </div>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          {error}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </p>
            <div className="whitespace-pre-wrap break-words rounded-md border border-border bg-background-elevated p-4 font-mono text-sm text-foreground">
              {segments.map((segment, i) =>
                segment.matched ? (
                  <mark key={i} className="rounded bg-accent/25 text-foreground" style={{ color: "inherit" }}>
                    {segment.text}
                  </mark>
                ) : (
                  <span key={i}>{segment.text}</span>
                ),
              )}
            </div>
          </div>

          {matches.length > 0 ? (
            <div className="flex flex-col divide-y divide-border rounded-md border border-border">
              {matches.map((match, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 text-xs">
                  <span className="font-mono text-foreground">
                    <span className="text-foreground-muted">[{match.index}]</span> {match.match}
                  </span>
                  {match.groups.length > 0 ? (
                    <span className="text-foreground-muted">
                      groups: {match.groups.map((g) => g ?? "—").join(", ")}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
