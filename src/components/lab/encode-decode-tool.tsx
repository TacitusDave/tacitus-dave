"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { CopyButton } from "@/components/lab/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { encodeBase64, decodeBase64 } from "@/lib/lab/base64";
import { encodeUrlComponent, decodeUrlComponent } from "@/lib/lab/url-encoding";

type Mode = "encode" | "decode";
type Variant = "base64" | "url";

// Function props can't cross the server/client boundary from a Server
// Component page, so the actual encode/decode implementations live here,
// inside the client component, selected by a plain (serializable) string.
const HANDLERS: Record<Variant, { encode: (value: string) => string; decode: (value: string) => string }> = {
  base64: { encode: encodeBase64, decode: decodeBase64 },
  url: { encode: encodeUrlComponent, decode: decodeUrlComponent },
};

export function EncodeDecodeTool({
  variant,
  inputLabel = "Input",
  outputLabel = "Output",
  placeholder,
}: {
  variant: Variant;
  inputLabel?: string;
  outputLabel?: string;
  placeholder?: string;
}) {
  const { encode, decode } = HANDLERS[variant];
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  try {
    output = input ? (mode === "encode" ? encode(input) : decode(input)) : "";
  } catch (err) {
    error = err instanceof Error ? err.message : "Couldn't process that input.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "encode" ? "accent" : "outline"}
          onClick={() => setMode("encode")}
        >
          Encode
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "decode" ? "accent" : "outline"}
          onClick={() => setMode("decode")}
        >
          Decode
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="encode-decode-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          {inputLabel}
        </label>
        <textarea
          id="encode-decode-input"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className={cn(fieldStyles, "resize-none")}
        />
      </div>

      {error ? (
        <p style={{ color: "#d03b3b" }} className="text-sm">
          {error}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="encode-decode-output"
              className="font-mono text-xs uppercase tracking-widest text-foreground-muted"
            >
              {outputLabel}
            </label>
            <CopyButton value={output} />
          </div>
          <textarea
            id="encode-decode-output"
            readOnly
            rows={5}
            value={output}
            className={cn(fieldStyles, "resize-none")}
          />
        </div>
      )}
    </div>
  );
}
