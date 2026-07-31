"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/lab/copy-button";
import { fieldStyles } from "@/components/lab/field-styles";
import { HASH_ALGORITHMS, computeHash } from "@/lib/lab/hash";

export function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const generation = useRef(0);

  useEffect(() => {
    if (!text) return;

    const thisGeneration = ++generation.current;
    Promise.all(HASH_ALGORITHMS.map((algo) => computeHash(algo, text))).then((results) => {
      if (thisGeneration !== generation.current) return; // a newer input has superseded this one
      const next: Record<string, string> = {};
      HASH_ALGORITHMS.forEach((algo, i) => {
        next[algo] = results[i];
      });
      setHashes(next);
    });
  }, [text]);

  const displayHashes = text ? hashes : {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="hash-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Input
        </label>
        <textarea
          id="hash-input"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type or paste anything…"
          className={`${fieldStyles} resize-none`}
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col gap-4">
        {HASH_ALGORITHMS.map((algo) => (
          <div key={algo} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{algo}</p>
              <CopyButton value={displayHashes[algo] ?? ""} />
            </div>
            <p className="break-all rounded-md border border-border bg-background-elevated p-3 font-mono text-xs text-foreground">
              {displayHashes[algo] ?? "—"}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-foreground-muted">
        Computed with the Web Crypto API, entirely in your browser — nothing is sent anywhere.
        MD5 isn&apos;t offered here because it&apos;s cryptographically broken; don&apos;t use it for anything
        security-sensitive.
      </p>
    </div>
  );
}
