"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";
import { fieldStyles } from "@/components/lab/field-styles";
import { HASH_ALGORITHMS, computeHash, computeHashFromBuffer } from "@/lib/lab/hash";

type Mode = "text" | "file";

export function HashGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const generation = useRef(0);

  useEffect(() => {
    const source = mode === "text" ? text : fileBuffer;
    if (!source) return;

    const thisGeneration = ++generation.current;
    const compute = mode === "text"
      ? Promise.all(HASH_ALGORITHMS.map((algo) => computeHash(algo, text as string)))
      : Promise.all(HASH_ALGORITHMS.map((algo) => computeHashFromBuffer(algo, fileBuffer as ArrayBuffer)));

    compute.then((results) => {
      if (thisGeneration !== generation.current) return; // a newer input has superseded this one
      const next: Record<string, string> = {};
      HASH_ALGORITHMS.forEach((algo, i) => {
        next[algo] = results[i];
      });
      setHashes(next);
    });
  }, [mode, text, fileBuffer]);

  const hasInput = mode === "text" ? Boolean(text) : Boolean(fileBuffer);
  const displayHashes = hasInput ? hashes : {};

  function loadFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) setFileBuffer(reader.result);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button type="button" size="sm" variant={mode === "text" ? "accent" : "outline"} onClick={() => setMode("text")}>
          Text
        </Button>
        <Button type="button" size="sm" variant={mode === "file" ? "accent" : "outline"} onClick={() => setMode("file")}>
          File
        </Button>
      </div>

      {mode === "text" ? (
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
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) loadFile(file);
          }}
          className={`flex flex-col items-center gap-3 rounded-md border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? "border-accent" : "border-border"
          }`}
        >
          <p className="text-sm text-foreground-muted">
            {fileName ? `Selected: ${fileName}` : "Drag a file here, or choose one"}
          </p>
          <label className={`${fieldStyles} inline-flex w-auto cursor-pointer items-center px-4 py-2`}>
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) loadFile(file);
              }}
            />
          </label>
          <p className="text-xs text-foreground-muted">
            Read directly in your browser via the File API — never uploaded anywhere.
          </p>
        </div>
      )}

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
