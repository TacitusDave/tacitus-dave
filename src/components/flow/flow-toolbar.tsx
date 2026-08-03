"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { nodeKindGroups, type FlowNodeKind } from "@/lib/flow/types";
import { iconRegistry, iconNames, iconLabel } from "@/lib/flow/icons";

interface FlowToolbarProps {
  onAddNode: (kind: FlowNodeKind) => void;
  onAddIcon: (iconName: string) => void;
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

function IconPicker({ onPick }: { onPick: (iconName: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-foreground-muted transition-colors hover:border-accent hover:text-accent"
      >
        + Icon
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close icon picker"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full z-50 mt-2 grid w-64 grid-cols-6 gap-1 rounded-md border border-border bg-background-elevated p-2 shadow-lg">
            {iconNames.map((name) => {
              const Icon = iconRegistry[name];
              return (
                <button
                  key={name}
                  type="button"
                  title={iconLabel(name)}
                  onClick={() => {
                    onPick(name);
                    setOpen(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-background hover:text-accent"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function FlowToolbar({
  onAddNode,
  onAddIcon,
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
    <div className="flex flex-col gap-2 border-b border-border bg-background-elevated/60 px-3 py-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            Flowchart
          </span>
          {nodeKindGroups.flowchart.map((meta) => (
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

        <div className="h-5 w-px bg-border" />

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            Shapes
          </span>
          {nodeKindGroups.shapes.map((meta) => (
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
          <IconPicker onPick={onAddIcon} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}
