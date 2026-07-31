"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { analyzeText, formatMinutes } from "@/lib/lab/text-stats";
import { cn } from "@/lib/cn";

export function TextCounter() {
  const [text, setText] = useState("");
  const stats = analyzeText(text);

  const rows: Array<[string, string]> = [
    ["Characters", stats.characters.toLocaleString()],
    ["Characters (no spaces)", stats.charactersNoSpaces.toLocaleString()],
    ["Words", stats.words.toLocaleString()],
    ["Sentences", stats.sentences.toLocaleString()],
    ["Paragraphs", stats.paragraphs.toLocaleString()],
    ["Reading time", formatMinutes(stats.readingMinutes)],
    ["Speaking time", formatMinutes(stats.speakingMinutes)],
  ];

  return (
    <div className="flex flex-col gap-6">
      <textarea
        rows={10}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste or type text…"
        className={cn(fieldStyles, "resize-none")}
        aria-label="Text to analyze"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-border p-3">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{label}</p>
            <p className="mt-1 font-mono text-lg text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
