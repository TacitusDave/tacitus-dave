"use client";

import { useEffect, useRef, useState } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export interface FlowEdgeData extends Record<string, unknown> {
  label?: string;
  updateLabel?: (label: string) => void;
}

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const edgeData = data as FlowEdgeData | undefined;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(edgeData?.label ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function startEditing() {
    setValue(edgeData?.label ?? "");
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    edgeData?.updateLabel?.(value.trim());
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: selected ? "var(--accent)" : "var(--border)", strokeWidth: selected ? 2.5 : 1.5 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onDoubleClick={startEditing}
        >
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
                  setValue(edgeData?.label ?? "");
                  setEditing(false);
                }
              }}
              style={{ width: Math.max(48, value.length * 7 + 16) }}
              className="rounded border border-accent bg-background px-1.5 py-0.5 text-center font-mono text-[11px] text-foreground outline-none"
            />
          ) : edgeData?.label ? (
            <span className="rounded border border-border bg-background-elevated px-1.5 py-0.5 font-mono text-[11px] text-foreground-muted">
              {edgeData.label}
            </span>
          ) : (
            <span
              aria-hidden="true"
              title="Double-click to label this connection"
              className="block h-2 w-2 rounded-full border border-border bg-background-elevated opacity-60 hover:opacity-100"
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
