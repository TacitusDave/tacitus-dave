import type { Node, Edge } from "@xyflow/react";

const STORAGE_KEY = "tacitus-flow-builder:v1";

export interface StoredFlow {
  nodes: Node[];
  edges: Edge[];
}

/** Strips non-serializable per-node/edge callback closures before persisting or exporting. */
export function serializeFlow(nodes: Node[], edges: Edge[]): StoredFlow {
  return {
    nodes: nodes.map((node) => ({
      ...node,
      data: { label: node.data.label, kind: node.data.kind, iconName: node.data.iconName },
    })),
    edges: edges.map((edge) => ({
      ...edge,
      data: { label: edge.data?.label ?? "" },
    })),
  };
}

export function loadFlow(): StoredFlow | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredFlow;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFlow(flow: StoredFlow): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
  } catch {
    // Storage full/unavailable — the in-memory canvas is still intact for
    // this session, so silently skipping the save loses nothing critical.
  }
}
