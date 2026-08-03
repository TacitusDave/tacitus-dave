"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./flow.css";
import { toPng } from "html-to-image";
import { FlowNode, type FlowNodeData } from "./flow-node";
import { FlowEdge, type FlowEdgeData } from "./flow-edge";
import { FlowToolbar } from "./flow-toolbar";
import type { FlowNodeKind } from "@/lib/flow/types";
import { nodeKinds } from "@/lib/flow/types";
import { iconLabel } from "@/lib/flow/icons";
import { layoutFlow } from "@/lib/flow/layout";
import { loadFlow, saveFlow, serializeFlow } from "@/lib/flow/storage";

const nodeTypes: NodeTypes = { flowNode: FlowNode };
const edgeTypes: EdgeTypes = { flowEdge: FlowEdge };

const MARKER_COLOR = "#9aa0a6";
const MAX_HISTORY = 50;
const SAVE_DEBOUNCE_MS = 400;

interface Snapshot {
  nodes: Node[];
  edges: Edge[];
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function FlowCanvasInner() {
  const { screenToFlowPosition } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState<Edge>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [ready, setReady] = useState(false);

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const pastRef = useRef<Snapshot[]>([]);
  const futureRef = useRef<Snapshot[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addOffsetRef = useRef(0);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const pushHistory = useCallback(() => {
    pastRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();
    futureRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const updateNodeLabel = useCallback(
    (id: string, label: string) => {
      pushHistory();
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label } } : n)));
    },
    [pushHistory, setNodes],
  );

  const updateEdgeLabel = useCallback(
    (id: string, label: string) => {
      pushHistory();
      setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, data: { ...e.data, label } } : e)));
    },
    [pushHistory, setEdges],
  );

  const hydrateNode = useCallback(
    (raw: Node): Node => ({
      ...raw,
      type: "flowNode",
      data: {
        label: String(raw.data.label ?? "Untitled"),
        kind: (raw.data.kind ?? "process") as FlowNodeKind,
        iconName: typeof raw.data.iconName === "string" ? raw.data.iconName : undefined,
        updateLabel: (label: string) => updateNodeLabel(raw.id, label),
      } satisfies FlowNodeData,
    }),
    [updateNodeLabel],
  );

  const hydrateEdge = useCallback(
    (raw: Edge): Edge => ({
      ...raw,
      type: "flowEdge",
      markerEnd: { type: MarkerType.ArrowClosed, color: MARKER_COLOR },
      data: {
        label: String(raw.data?.label ?? ""),
        updateLabel: (label: string) => updateEdgeLabel(raw.id, label),
      } satisfies FlowEdgeData,
    }),
    [updateEdgeLabel],
  );

  // Load any saved flow on mount (client-only — localStorage doesn't exist during SSR).
  // Deferred a microtask so the state updates land outside the effect's
  // synchronous body, same pattern used for the data-loading effects
  // elsewhere in the admin panel.
  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      const stored = loadFlow();
      if (stored && stored.nodes.length > 0) {
        setNodes(stored.nodes.map(hydrateNode));
        setEdges(stored.edges.map(hydrateEdge));
      } else {
        setNodes([
          hydrateNode({
            id: nextId("node"),
            type: "flowNode",
            position: { x: 80, y: 160 },
            data: { label: "Start", kind: "start" },
          }),
        ]);
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // Only ever run once on mount — hydrateNode/hydrateEdge are stable via useCallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced autosave whenever the flow changes.
  useEffect(() => {
    if (!ready) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveFlow(serializeFlow(nodes, edges));
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [nodes, edges, ready]);

  const onConnect = useCallback(
    (connection: Connection) => {
      pushHistory();
      const id = nextId("edge");
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id,
            type: "flowEdge",
            markerEnd: { type: MarkerType.ArrowClosed, color: MARKER_COLOR },
            data: { label: "", updateLabel: (label: string) => updateEdgeLabel(id, label) } satisfies FlowEdgeData,
          },
          eds,
        ),
      );
    },
    [pushHistory, setEdges, updateEdgeLabel],
  );

  const nextSpawnPosition = useCallback(() => {
    addOffsetRef.current += 1;
    const offset = (addOffsetRef.current % 6) * 24;

    const center = wrapperRef.current
      ? screenToFlowPosition({
          x: wrapperRef.current.getBoundingClientRect().left + wrapperRef.current.clientWidth / 2,
          y: wrapperRef.current.getBoundingClientRect().top + wrapperRef.current.clientHeight / 2,
        })
      : { x: 200, y: 200 };

    return { x: center.x + offset - 80, y: center.y + offset - 30 };
  }, [screenToFlowPosition]);

  const addNode = useCallback(
    (kind: FlowNodeKind) => {
      pushHistory();
      const meta = nodeKinds.find((k) => k.kind === kind);
      const id = nextId("node");
      const newNode: Node = {
        id,
        type: "flowNode",
        position: nextSpawnPosition(),
        data: {
          label: meta?.defaultLabel ?? "Node",
          kind,
          updateLabel: (label: string) => updateNodeLabel(id, label),
        } satisfies FlowNodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [pushHistory, setNodes, nextSpawnPosition, updateNodeLabel],
  );

  const addIconNode = useCallback(
    (iconName: string) => {
      pushHistory();
      const id = nextId("node");
      const newNode: Node = {
        id,
        type: "flowNode",
        position: nextSpawnPosition(),
        data: {
          label: iconLabel(iconName),
          kind: "icon",
          iconName,
          updateLabel: (label: string) => updateNodeLabel(id, label),
        } satisfies FlowNodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [pushHistory, setNodes, nextSpawnPosition, updateNodeLabel],
  );

  const deleteSelected = useCallback(() => {
    const selectedNodeIds = new Set(nodesRef.current.filter((n) => n.selected).map((n) => n.id));
    const selectedEdgeIds = new Set(edgesRef.current.filter((e) => e.selected).map((e) => e.id));
    if (selectedNodeIds.size === 0 && selectedEdgeIds.size === 0) return;

    pushHistory();
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.has(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) => !selectedEdgeIds.has(e.id) && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target),
      ),
    );
  }, [pushHistory, setNodes, setEdges]);

  const handleTidyUp = useCallback(() => {
    pushHistory();
    setNodes((nds) => layoutFlow(nds, edgesRef.current));
  }, [pushHistory, setNodes]);

  const handleUndo = useCallback(() => {
    const previous = pastRef.current.pop();
    if (!previous) return;
    futureRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
  }, [setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(next.nodes);
    setEdges(next.edges);
    setCanRedo(futureRef.current.length > 0);
    setCanUndo(true);
  }, [setNodes, setEdges]);

  const handleClear = useCallback(() => {
    if (!window.confirm("Start a new flow? This clears the current canvas.")) return;
    pushHistory();
    setEdges([]);
    setNodes([
      hydrateNode({
        id: nextId("node"),
        type: "flowNode",
        position: { x: 80, y: 160 },
        data: { label: "Start", kind: "start" },
      }),
    ]);
  }, [pushHistory, setNodes, setEdges, hydrateNode]);

  const handleExportJson = useCallback(() => {
    const payload = serializeFlow(nodes, edges);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flow.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImportJson = useCallback(
    (file: File) => {
      file
        .text()
        .then((text) => {
          const parsed = JSON.parse(text) as { nodes?: Node[]; edges?: Edge[] };
          if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
            throw new Error("Not a valid flow file.");
          }
          pushHistory();
          setNodes(parsed.nodes.map(hydrateNode));
          setEdges(parsed.edges.map(hydrateEdge));
        })
        .catch(() => {
          window.alert("That file isn't a valid flow export.");
        });
    },
    [pushHistory, setNodes, setEdges, hydrateNode, hydrateEdge],
  );

  const handleExportPng = useCallback(() => {
    if (nodesRef.current.length === 0) return;
    const bounds = getNodesBounds(nodesRef.current);
    const width = Math.max(bounds.width + 160, 400);
    const height = Math.max(bounds.height + 160, 300);
    const viewport = getViewportForBounds(bounds, width, height, 0.2, 2, 0.1);

    const viewportEl = wrapperRef.current?.querySelector<HTMLElement>(".react-flow__viewport");
    if (!viewportEl) return;

    toPng(viewportEl, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#0a0b0d",
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "flow.png";
        a.click();
      })
      .catch(() => {
        window.alert("Couldn't export an image — try again.");
      });
  }, []);

  // Explicit history-aware deletion + undo/redo shortcuts, ignored while
  // typing in a node/edge label input (or any other field).
  useEffect(() => {
    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      if ((event.key === "Delete" || event.key === "Backspace") && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        deleteSelected();
        return;
      }

      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      } else if ((mod && event.key.toLowerCase() === "y") || (mod && event.shiftKey && event.key.toLowerCase() === "z")) {
        event.preventDefault();
        handleRedo();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelected, handleUndo, handleRedo]);

  return (
    <div className="flow-canvas-wrapper flex h-full flex-col overflow-hidden rounded-md border border-border">
      <FlowToolbar
        onAddNode={addNode}
        onAddIcon={addIconNode}
        onTidyUp={handleTidyUp}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportPng={handleExportPng}
        onClear={handleClear}
      />
      <div ref={wrapperRef} className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeBase}
          onEdgesChange={onEdgesChangeBase}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          deleteKeyCode={null}
          fitView
          proOptions={{ hideAttribution: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>
      <p className="border-t border-border px-3 py-1.5 font-mono text-[11px] text-foreground-muted">
        Double-click a node or connection to rename it · drag from a node&apos;s edge to connect ·
        select and press Delete to remove
      </p>
    </div>
  );
}

export function FlowBuilder() {
  return (
    <div className="h-[75vh] min-h-[520px]">
      <ReactFlowProvider>
        <FlowCanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
