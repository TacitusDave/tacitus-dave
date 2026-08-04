export type ScaleLevel = "baseline" | "10x" | "100x";

export const scaleLevels: { level: ScaleLevel; label: string }[] = [
  { level: "baseline", label: "Baseline" },
  { level: "10x", label: "10× traffic" },
  { level: "100x", label: "100× traffic" },
];

export interface ArchNode {
  id: string;
  label: string;
  tagline: string;
  decisionTitle: string;
  decisionBody: string;
  row: number;
  /** What has to change at this node once traffic grows — omitted where nothing meaningful changes. */
  scaleNotes?: Partial<Record<Exclude<ScaleLevel, "baseline">, string>>;
}

export const archNodes: ArchNode[] = [
  {
    id: "client",
    label: "Client",
    tagline: "Web or mobile app",
    decisionTitle: "Why a thin client",
    decisionBody:
      "Business logic stays server-side. The client renders UI and holds ephemeral state only, so the same API can serve web and mobile without duplicating rules in two places.",
    row: 1,
  },
  {
    id: "edge",
    label: "Edge / CDN",
    tagline: "Static assets & edge caching",
    decisionTitle: "Why cache at the edge",
    decisionBody:
      "Static assets and cacheable GET responses are served from the edge to cut latency and absorb traffic spikes before they ever reach application infrastructure.",
    row: 2,
    scaleNotes: {
      "10x": "Cache hit rate becomes critical — a cold edge cache at this volume means the spike hits the gateway directly instead of being absorbed.",
      "100x": "Multi-region edge points of presence become worth the operational cost, to keep latency flat as traffic globalizes rather than concentrates.",
    },
  },
  {
    id: "gateway",
    label: "API Gateway",
    tagline: "Single entry point, routing & rate limiting",
    decisionTitle: "Why one gateway",
    decisionBody:
      "Centralizing auth checks, rate limiting, and request routing in one layer means every downstream service can trust the request was already validated, instead of re-implementing those checks everywhere.",
    row: 3,
    scaleNotes: {
      "10x": "Rate limiting needs per-tenant granularity, not just a global limit — one noisy client shouldn't be able to starve everyone else.",
      "100x": "A single gateway cluster starts becoming the choke point itself — usually split by region or workload at this point.",
    },
  },
  {
    id: "observability",
    label: "Observability",
    tagline: "Metrics, logs & traces",
    decisionTitle: "Why cross-cutting",
    decisionBody:
      "Observability is wired into every layer from day one rather than bolted on after an incident. You can't operate reliably what you can't see.",
    row: 3,
    scaleNotes: {
      "10x": "Full tracing on every request gets expensive fast — sampling becomes necessary rather than optional.",
      "100x": "Metrics cardinality explodes at this volume; per-request labels need trimming or the observability stack becomes the thing that falls over first.",
    },
  },
  {
    id: "auth",
    label: "Auth Service",
    tagline: "Identity, sessions, tokens",
    decisionTitle: "Why a separate service",
    decisionBody:
      "Isolating authentication means it can be audited, rotated, and scaled independently of business logic — a compromise in application code doesn't automatically mean a compromise of credentials.",
    row: 4,
    scaleNotes: {
      "10x": "Token/session validation needs to be cacheable (short-lived signed tokens) so it doesn't become a per-request database hit.",
      "100x": "Auth needs its own regional replicas — a single auth service outage now takes down every downstream service at once.",
    },
  },
  {
    id: "app",
    label: "Application Service",
    tagline: "Core business logic",
    decisionTitle: "Why stateless",
    decisionBody:
      "The service holds no session state itself, so any instance can serve any request. That's what makes horizontal scaling and rolling deploys safe.",
    row: 4,
    scaleNotes: {
      "10x": "Needs real autoscaling policies tied to load, not a fixed instance count sized for average traffic.",
      "100x": "One hot code path can start starving the rest of the service — usually the trigger to split into smaller, independently-scaled services.",
    },
  },
  {
    id: "database",
    label: "Primary Database",
    tagline: "Source of truth",
    decisionTitle: "Why relational",
    decisionBody:
      "Most of this domain's data has strong relationships and needs transactional guarantees, which a relational database gives for free instead of re-implementing consistency checks in application code.",
    row: 5,
    scaleNotes: {
      "10x": "Read replicas start taking real pressure off the primary for read-heavy endpoints, which are usually most of the traffic.",
      "100x": "A single primary can't take unlimited writes — sharding or a managed distributed database becomes hard to avoid at this point.",
    },
  },
  {
    id: "cache",
    label: "Cache",
    tagline: "Hot-path reads",
    decisionTitle: "Why cache reads, not writes",
    decisionBody:
      "Caching absorbs read load for data that changes infrequently. Writes still go straight to the database, so the cache never becomes a second source of truth to keep in sync.",
    row: 5,
    scaleNotes: {
      "10x": "Goes from optional to load-bearing — losing the cache at this volume means the database takes the full hit directly.",
      "100x": "Needs its own clustering/replication story; a single cache node has now become a new single point of failure.",
    },
  },
  {
    id: "queue",
    label: "Message Queue",
    tagline: "Decouples slow work",
    decisionTitle: "Why async",
    decisionBody:
      "Anything that doesn't need to block the response — emails, exports, webhooks — goes through a queue, so a slow downstream dependency can't take the whole request path down with it.",
    row: 5,
    scaleNotes: {
      "10x": "Needs partitioning by job type, so one noisy category of jobs can't delay everything else behind it.",
      "100x": "A single queue cluster's throughput ceiling becomes real — usually the point where it's split by domain, not just by priority.",
    },
  },
  {
    id: "worker",
    label: "Background Worker",
    tagline: "Processes queued jobs",
    decisionTitle: "Why separate compute",
    decisionBody:
      "Workers scale independently of the API. A burst of queued jobs doesn't compete with user-facing traffic for the same compute.",
    row: 6,
    scaleNotes: {
      "10x": "Needs autoscaling tied to queue backlog depth, not a fixed pool sized for average load.",
      "100x": "Job processing itself may need to shard by type — a slow job class can otherwise starve fast ones out of the same worker pool.",
    },
  },
];

export interface ArchEdge {
  from: string;
  to: string;
  style: "solid" | "dashed";
}

export const archEdges: ArchEdge[] = [
  { from: "client", to: "edge", style: "solid" },
  { from: "edge", to: "gateway", style: "solid" },
  { from: "gateway", to: "auth", style: "solid" },
  { from: "gateway", to: "app", style: "solid" },
  { from: "app", to: "database", style: "solid" },
  { from: "app", to: "cache", style: "solid" },
  { from: "app", to: "queue", style: "solid" },
  { from: "queue", to: "worker", style: "solid" },
  { from: "worker", to: "database", style: "solid" },
  { from: "observability", to: "app", style: "dashed" },
  { from: "observability", to: "worker", style: "dashed" },
];

export function nodesByRow(): ArchNode[][] {
  const rows = new Map<number, ArchNode[]>();
  for (const node of archNodes) {
    const list = rows.get(node.row) ?? [];
    list.push(node);
    rows.set(node.row, list);
  }
  return [...rows.entries()].sort(([a], [b]) => a - b).map(([, nodes]) => nodes);
}
