"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { CopyButton } from "@/components/lab/copy-button";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, type RgbColor } from "@/lib/lab/color";

export function ColorConverter() {
  const [rgb, setRgb] = useState<RgbColor>({ r: 45, g: 212, b: 191 });
  const [hexInput, setHexInput] = useState(rgbToHex(rgb));
  const [hexError, setHexError] = useState<string | null>(null);

  const hsl = rgbToHsl(rgb);
  const hex = rgbToHex(rgb);

  function updateFromHex(value: string) {
    setHexInput(value);
    try {
      setRgb(hexToRgb(value));
      setHexError(null);
    } catch (err) {
      setHexError(err instanceof Error ? err.message : "Invalid hex color.");
    }
  }

  function updateRgbChannel(channel: keyof RgbColor, value: number) {
    const next = { ...rgb, [channel]: Math.max(0, Math.min(255, value)) };
    setRgb(next);
    setHexInput(rgbToHex(next));
    setHexError(null);
  }

  function updateHslChannel(channel: "h" | "s" | "l", value: number) {
    const max = channel === "h" ? 360 : 100;
    const nextHsl = { ...hsl, [channel]: Math.max(0, Math.min(max, value)) };
    const nextRgb = hslToRgb(nextHsl);
    setRgb(nextRgb);
    setHexInput(rgbToHex(nextRgb));
    setHexError(null);
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="flex flex-col gap-6">
      <div
        className="h-32 w-full rounded-md border border-border"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="color-hex" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Hex
        </label>
        <div className="flex gap-2">
          <input
            id="color-hex"
            value={hexInput}
            onChange={(event) => updateFromHex(event.target.value)}
            spellCheck={false}
            className={fieldStyles}
          />
          <CopyButton value={hex} />
        </div>
        {hexError ? <p style={{ color: "#d03b3b" }} className="text-xs">{hexError}</p> : null}
      </div>

      <ChannelGroup
        label="RGB"
        value={rgbString}
        fields={[
          { key: "r", value: rgb.r, max: 255 },
          { key: "g", value: rgb.g, max: 255 },
          { key: "b", value: rgb.b, max: 255 },
        ]}
        onChange={(key, value) => updateRgbChannel(key as keyof RgbColor, value)}
      />

      <ChannelGroup
        label="HSL"
        value={hslString}
        fields={[
          { key: "h", value: hsl.h, max: 360 },
          { key: "s", value: hsl.s, max: 100 },
          { key: "l", value: hsl.l, max: 100 },
        ]}
        onChange={(key, value) => updateHslChannel(key as "h" | "s" | "l", value)}
      />
    </div>
  );
}

function ChannelGroup({
  label,
  value,
  fields,
  onChange,
}: {
  label: string;
  value: string;
  fields: Array<{ key: string; value: number; max: number }>;
  onChange: (key: string, value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-widest text-foreground-muted">{label}</label>
        <CopyButton value={value} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {fields.map((field) => (
          <input
            key={field.key}
            type="number"
            min={0}
            max={field.max}
            value={field.value}
            onChange={(event) => onChange(field.key, Number(event.target.value))}
            className={fieldStyles}
            aria-label={`${label} ${field.key}`}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-foreground-muted">{value}</p>
    </div>
  );
}
