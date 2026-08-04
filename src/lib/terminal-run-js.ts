/**
 * A tiny in-browser JavaScript REPL for the Terminal's `run` command. Code
 * never leaves the visitor's own browser — this is exactly as safe (and as
 * unsafe) as pasting something into their own devtools console.
 */

export interface RunJsResult {
  logs: string[];
  result?: unknown;
  hasResult: boolean;
  error?: string;
}

export function safeStringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === undefined) return "undefined";
  if (typeof value === "function") return value.toString();
  try {
    const json = JSON.stringify(value, null, 2);
    return json ?? String(value);
  } catch {
    return String(value);
  }
}

export function runJs(code: string): RunJsResult {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map((arg) => (typeof arg === "string" ? arg : safeStringify(arg))).join(" "));
  };

  try {
    let value: unknown;
    let hasResult = true;
    try {
      // Try it as a single expression first, so `1 + 1` or `[1,2,3].map(x => x * 2)` echoes a value.
      value = new Function(`"use strict"; return (${code});`)();
    } catch {
      // Not a single expression — run as statements instead (no implicit return).
      value = new Function(`"use strict"; ${code}`)();
      hasResult = value !== undefined;
    }
    return { logs, result: value, hasResult };
  } catch (err) {
    return { logs, hasResult: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    console.log = originalLog;
  }
}
