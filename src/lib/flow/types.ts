export type FlowNodeKind = "start" | "end" | "process" | "decision" | "io" | "note";

export interface NodeKindMeta {
  kind: FlowNodeKind;
  label: string;
  description: string;
  defaultLabel: string;
}

export const nodeKinds: NodeKindMeta[] = [
  { kind: "start", label: "Start", description: "Entry point", defaultLabel: "Start" },
  { kind: "process", label: "Process", description: "A step or action", defaultLabel: "Process" },
  { kind: "decision", label: "Decision", description: "A branch point", defaultLabel: "Decision?" },
  { kind: "io", label: "Input / Output", description: "Data in or out", defaultLabel: "Data" },
  { kind: "end", label: "End", description: "Terminal point", defaultLabel: "End" },
  { kind: "note", label: "Note", description: "A comment, not part of the flow", defaultLabel: "Note" },
];
