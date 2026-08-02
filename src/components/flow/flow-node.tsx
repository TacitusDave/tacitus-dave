"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowNodeKind } from "@/lib/flow/types";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  kind: FlowNodeKind;
  updateLabel?: (label: string) => void;
}

const shapeClass: Record<FlowNodeKind, string> = {
  start: "rounded-full border-2 border-[#0ca30c] bg-[#0ca30c1a]",
  end: "rounded-full border-2 border-[#d03b3b] bg-[#d03b3b1a]",
  process: "rounded-md border-2 border-accent bg-background-elevated",
  decision: "border-2 border-[#fab219] bg-[#fab2191a]",
  io: "border-2 border-[#4a9eff] bg-[#4a9eff1a]",
  note: "rounded-md border-2 border-dashed border-border bg-background-elevated/60",
};

function FlowNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nodeData.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function startEditing() {
    setValue(nodeData.label);
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== nodeData.label) {
      nodeData.updateLabel?.(trimmed);
    } else {
      setValue(nodeData.label);
    }
  }

  const isDiamond = nodeData.kind === "decision";
  const isParallelogram = nodeData.kind === "io";

  return (
    <div
      className={`relative flex min-h-[56px] w-[160px] items-center justify-center px-4 py-2 text-center text-sm text-foreground transition-shadow ${shapeClass[nodeData.kind]} ${selected ? "shadow-[0_0_0_2px_var(--accent)]" : ""}`}
      style={
        isDiamond
          ? { clipPath: "polygon(50% 4%, 96% 50%, 50% 96%, 4% 50%)", minHeight: 110 }
          : isParallelogram
            ? { transform: "skewX(-12deg)" }
            : undefined
      }
      onDoubleClick={startEditing}
    >
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-none !bg-accent" />
      <div className="w-full" style={isParallelogram ? { transform: "skewX(12deg)" } : undefined}>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit();
              }
              if (event.key === "Escape") {
                setValue(nodeData.label);
                setEditing(false);
              }
            }}
            className="nodrag w-full bg-transparent text-center text-sm text-foreground outline-none"
          />
        ) : (
          <span className="block break-words">{nodeData.label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-none !bg-accent" />
    </div>
  );
}

export const FlowNode = memo(FlowNodeComponent);
