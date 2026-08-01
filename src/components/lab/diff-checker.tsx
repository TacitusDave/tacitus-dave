"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { diffLines, MAX_DIFF_LINES, type DiffLine } from "@/lib/lab/diff";
import { cn } from "@/lib/cn";

function lineBackground(type: DiffLine["type"]): string | undefined {
  if (type === "added") return "rgba(12, 163, 12, 0.1)";
  if (type === "removed") return "rgba(208, 59, 59, 0.1)";
  return undefined;
}

function marker(type: DiffLine["type"]): string {
  if (type === "added") return "+";
  if (type === "removed") return "-";
  return " ";
}

export function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");

  const tooLarge =
    original.split("\n").length > MAX_DIFF_LINES || changed.split("\n").length > MAX_DIFF_LINES;

  const diff = !tooLarge && (original || changed) ? diffLines(original, changed) : [];
  const added = diff.filter((l) => l.type === "added").length;
  const removed = diff.filter((l) => l.type === "removed").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="diff-original" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Original
          </label>
          <textarea
            id="diff-original"
            rows={10}
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            spellCheck={false}
            className={cn(fieldStyles, "resize-none")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="diff-changed" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Changed
          </label>
          <textarea
            id="diff-changed"
            rows={10}
            value={changed}
            onChange={(event) => setChanged(event.target.value)}
            spellCheck={false}
            className={cn(fieldStyles, "resize-none")}
          />
        </div>
      </div>

      {tooLarge ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          That&apos;s more than {MAX_DIFF_LINES} lines on one side — too large to diff smoothly in
          the browser. Try a smaller excerpt.
        </p>
      ) : diff.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            <span style={{ color: "#0ca30c" }}>+{added}</span> ·{" "}
            <span style={{ color: "#d03b3b" }}>-{removed}</span>
          </p>
          <div className="overflow-x-auto rounded-md border border-border font-mono text-xs">
            {diff.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre px-4 py-0.5",
                  line.type === "equal" ? "text-foreground-muted" : "text-foreground",
                )}
                style={{ backgroundColor: lineBackground(line.type) }}
              >
                {marker(line.type)} {line.text || " "}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
