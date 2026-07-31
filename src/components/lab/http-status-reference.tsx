"use client";

import { useState } from "react";
import { fieldStyles } from "@/components/lab/field-styles";
import { HTTP_STATUSES, statusColor } from "@/lib/lab/http-status";

export function HttpStatusReference() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = !q
    ? HTTP_STATUSES
    : HTTP_STATUSES.filter(
        (status) =>
          String(status.code).includes(q) ||
          status.title.toLowerCase().includes(q) ||
          status.description.toLowerCase().includes(q),
      );

  return (
    <div className="flex flex-col gap-6">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by code or keyword…"
        className={fieldStyles}
        aria-label="Search HTTP status codes"
      />

      <div className="flex flex-col divide-y divide-border rounded-md border border-border">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">No status codes match &quot;{query}&quot;.</p>
        ) : (
          filtered.map((status) => (
            <div key={status.code} className="flex gap-4 p-4">
              <span
                className="w-14 shrink-0 font-mono text-sm font-medium"
                style={{ color: statusColor(status.code) }}
              >
                {status.code}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{status.title}</p>
                <p className="mt-1 text-xs text-foreground-muted">{status.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
