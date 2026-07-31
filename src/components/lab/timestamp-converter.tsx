"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const unixDate = (() => {
    if (!unixInput.trim()) return null;
    const n = Number(unixInput);
    if (Number.isNaN(n)) return null;
    // Treat anything with 13+ digits as milliseconds, otherwise seconds.
    const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  })();

  const parsedDate = dateInput ? new Date(dateInput) : null;
  const isValidParsedDate = parsedDate && !Number.isNaN(parsedDate.getTime());

  function useNow() {
    const now = new Date();
    setUnixInput(String(Math.floor(now.getTime() / 1000)));
    setDateInput(toDatetimeLocal(now));
  }

  return (
    <div className="flex flex-col gap-8">
      <Button type="button" variant="outline" size="sm" onClick={useNow} className="self-start">
        Use current time
      </Button>

      <div className="flex flex-col gap-2">
        <label htmlFor="unix-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Unix timestamp (seconds or milliseconds)
        </label>
        <input
          id="unix-input"
          value={unixInput}
          onChange={(event) => setUnixInput(event.target.value)}
          placeholder="1700000000"
          spellCheck={false}
          className={fieldStyles}
        />
        {unixDate ? (
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="font-mono text-sm text-foreground">{unixDate.toISOString()}</span>
            <CopyButton value={unixDate.toISOString()} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
          Date &amp; time (local)
        </label>
        <input
          id="date-input"
          type="datetime-local"
          value={dateInput}
          onChange={(event) => setDateInput(event.target.value)}
          className={fieldStyles}
        />
        {isValidParsedDate && parsedDate ? (
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="font-mono text-sm text-foreground">
              {Math.floor(parsedDate.getTime() / 1000)}
            </span>
            <CopyButton value={String(Math.floor(parsedDate.getTime() / 1000))} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
