export type FlowNodeKind =
  | "start"
  | "end"
  | "process"
  | "decision"
  | "io"
  | "note"
  | "rectangle"
  | "circle"
  | "text"
  | "icon";

export interface NodeKindMeta {
  kind: FlowNodeKind;
  label: string;
  description: string;
  defaultLabel: string;
}

export type NodeGroup = "flowchart" | "shapes";

export const nodeKindGroups: Record<NodeGroup, NodeKindMeta[]> = {
  flowchart: [
    { kind: "start", label: "Start", description: "Entry point", defaultLabel: "Start" },
    { kind: "process", label: "Process", description: "A step or action", defaultLabel: "Process" },
    { kind: "decision", label: "Decision", description: "A branch point", defaultLabel: "Decision?" },
    { kind: "io", label: "Input / Output", description: "Data in or out", defaultLabel: "Data" },
    { kind: "end", label: "End", description: "Terminal point", defaultLabel: "End" },
    { kind: "note", label: "Note", description: "A comment, not part of the flow", defaultLabel: "Note" },
  ],
  shapes: [
    { kind: "rectangle", label: "Rectangle", description: "A generic labeled box", defaultLabel: "Box" },
    { kind: "circle", label: "Circle", description: "A generic labeled circle", defaultLabel: "Circle" },
    { kind: "text", label: "Text", description: "Free-standing text, no border", defaultLabel: "Text" },
  ],
};

/** Flattened for anything that just needs metadata by kind, e.g. serialization defaults. */
export const nodeKinds: NodeKindMeta[] = [...nodeKindGroups.flowchart, ...nodeKindGroups.shapes];
