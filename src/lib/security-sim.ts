export type Severity = "critical" | "high" | "medium" | "low";

/** Status palette is fixed by design-system convention — never themed, always paired with a text label. */
export const severityColor: Record<Severity, string> = {
  critical: "#d03b3b",
  high: "#ec835a",
  medium: "#fab219",
  low: "#0ca30c",
};

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const severityRank: Record<Severity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export const severityOrder: Severity[] = ["critical", "high", "medium", "low"];

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface MitreTactic {
  id: string;
  label: string;
}

/** The 14 MITRE ATT&CK Enterprise tactics, used here for educational/demo structure only. */
export const mitreTactics: MitreTactic[] = [
  { id: "recon", label: "Reconnaissance" },
  { id: "resource-dev", label: "Resource Development" },
  { id: "initial-access", label: "Initial Access" },
  { id: "execution", label: "Execution" },
  { id: "persistence", label: "Persistence" },
  { id: "priv-esc", label: "Privilege Escalation" },
  { id: "defense-evasion", label: "Defense Evasion" },
  { id: "cred-access", label: "Credential Access" },
  { id: "discovery", label: "Discovery" },
  { id: "lateral-movement", label: "Lateral Movement" },
  { id: "collection", label: "Collection" },
  { id: "c2", label: "Command & Control" },
  { id: "exfiltration", label: "Exfiltration" },
  { id: "impact", label: "Impact" },
];

export interface EventTemplate {
  tacticId: string;
  technique: string;
  message: string;
  severity: Severity;
  detail: string;
}

/** Synthetic event templates — illustrative, not derived from any real incident. */
export const eventTemplates: EventTemplate[] = [
  {
    tacticId: "recon",
    technique: "T1595 · Active Scanning",
    message: "Port scan detected from 203.0.113.44",
    severity: "medium",
    detail:
      "Sequential connection attempts across 40+ ports in under 10 seconds — the pattern matches automated scanning tooling (e.g. an Nmap SYN scan).",
  },
  {
    tacticId: "resource-dev",
    technique: "T1583 · Acquire Infrastructure",
    message: "Newly registered domain matched threat intel feed",
    severity: "low",
    detail:
      "A domain registered within the last 48 hours matched an indicator on a subscribed threat-intelligence feed. No inbound connection observed yet.",
  },
  {
    tacticId: "initial-access",
    technique: "T1190 · Exploit Public-Facing Application",
    message: "Exploit attempt blocked at the edge (CVE-2024-21762)",
    severity: "high",
    detail:
      "An inbound request matching a known exploit signature was blocked by the WAF before reaching the application layer.",
  },
  {
    tacticId: "execution",
    technique: "T1059 · Command and Scripting Interpreter",
    message: "Encoded PowerShell execution observed on WEB-03",
    severity: "high",
    detail:
      "A base64-encoded PowerShell command executed outside of normal deployment windows — encoding is a common technique for evading naive string-based detection.",
  },
  {
    tacticId: "persistence",
    technique: "T1053 · Scheduled Task/Job",
    message: "New scheduled task created with SYSTEM privileges",
    severity: "critical",
    detail:
      "A scheduled task was created running as SYSTEM outside of the configuration-management pipeline — a common technique for maintaining access across reboots.",
  },
  {
    tacticId: "priv-esc",
    technique: "T1078 · Valid Accounts",
    message: "Service account privilege escalation detected",
    severity: "critical",
    detail:
      "A low-privilege service account was added to an administrative group. The change did not originate from the identity provider's approved workflow.",
  },
  {
    tacticId: "defense-evasion",
    technique: "T1070 · Indicator Removal",
    message: "Security event log cleared on DB-02",
    severity: "high",
    detail:
      "The Windows Security event log was cleared shortly after an authentication anomaly — a common step to remove evidence of prior activity.",
  },
  {
    tacticId: "cred-access",
    technique: "T1110 · Brute Force",
    message: "47 failed logins for 'admin' — account locked",
    severity: "high",
    detail:
      "Repeated authentication failures against a privileged account triggered the lockout threshold. Source IP has been added to the watchlist.",
  },
  {
    tacticId: "discovery",
    technique: "T1082 · System Information Discovery",
    message: "Recon commands (whoami, systeminfo) observed",
    severity: "low",
    detail:
      "A short sequence of built-in discovery commands ran interactively on an endpoint shortly after an unfamiliar process spawned a shell.",
  },
  {
    tacticId: "lateral-movement",
    technique: "T1021 · Remote Services",
    message: "Unusual RDP session between internal hosts",
    severity: "medium",
    detail:
      "An RDP session was established between two hosts that have never communicated on this port before, outside of the change-management window.",
  },
  {
    tacticId: "collection",
    technique: "T1005 · Data from Local System",
    message: "Bulk file staging detected in a temp directory",
    severity: "medium",
    detail:
      "Several thousand files were copied into a single temporary directory in under a minute — a common precursor to exfiltration.",
  },
  {
    tacticId: "c2",
    technique: "T1071 · Application Layer Protocol",
    message: "Beaconing pattern to an unclassified host every 60s",
    severity: "critical",
    detail:
      "Outbound HTTPS requests to an unclassified host are recurring at a near-exact 60-second interval — consistent with C2 beaconing rather than normal user traffic.",
  },
  {
    tacticId: "exfiltration",
    technique: "T1041 · Exfiltration Over C2 Channel",
    message: "Large outbound transfer flagged (2.3 GB)",
    severity: "critical",
    detail:
      "A 2.3 GB outbound transfer over the same channel identified as a beaconing candidate was flagged and throttled pending review.",
  },
  {
    tacticId: "impact",
    technique: "T1486 · Data Encrypted for Impact",
    message: "Rapid file modification pattern consistent with ransomware",
    severity: "critical",
    detail:
      "A high-velocity file rewrite pattern across multiple directories triggered the ransomware canary. The affected host was automatically isolated from the network.",
  },
];

const statusPool: Record<Severity, string[]> = {
  critical: ["Contained", "Investigating"],
  high: ["Blocked", "Investigating"],
  medium: ["Flagged", "Monitoring"],
  low: ["Logged"],
};

export function pickStatus(severity: Severity): string {
  const pool = statusPool[severity];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickEventTemplate(): EventTemplate {
  return eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
}

export interface SecurityEvent extends EventTemplate {
  id: number;
  timestamp: Date;
  status: string;
}
