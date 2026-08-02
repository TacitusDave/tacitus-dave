"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { nodeKinds, type FlowNodeKind } from "@/lib/flow/types";

interface FlowToolbarProps {
  onAddNode: (kind: FlowNodeKind) => void;
  onTidyUp: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onExportPng: () => void;
  onClear: () => void;
}

export function FlowToolbar({
  onAddNode,
  onTidyUp,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportJson,
  onImportJson,
  onExportPng,
  onClear,
}: FlowToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background-elevated/60 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {nodeKinds.map((meta) => (
          <button
            key={meta.kind}
            type="button"
            title={meta.description}
            onClick={() => onAddNode(meta.kind)}
            className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            + {meta.label}
          </button>
        ))}
      </div>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button type="button" variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
        Undo
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
        Redo
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onTidyUp}>
        Tidy up
      </Button>

      <div className="mx-1 h-5 w-px bg-border" />

      <Button type="button" variant="outline" size="sm" onClick={onExportPng}>
        Export PNG
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onExportJson}>
        Export JSON
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        Import JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImportJson(file);
          event.target.value = "";
        }}
      />

      <div className="ml-auto">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          New flow
        </Button>
      </div>
    </div>
  );
}
