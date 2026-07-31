"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/lab/copy-button";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);

  function generate() {
    setUuids((prev) => [crypto.randomUUID(), ...prev].slice(0, 20));
  }

  return (
    <div className="flex flex-col gap-6">
      <Button type="button" onClick={generate} className="self-start">
        Generate UUID
      </Button>

      {uuids.length === 0 ? (
        <p className="text-sm text-foreground-muted">Generated UUIDs will appear here.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-md border border-border">
          {uuids.map((uuid) => (
            <div key={uuid} className="flex items-center justify-between gap-4 p-3">
              <span className="break-all font-mono text-sm text-foreground">{uuid}</span>
              <CopyButton value={uuid} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
