"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { formatPath, getNode, resolvePath } from "@/lib/terminal-fs";
import { encodeBase64, decodeBase64 } from "@/lib/lab/base64";
import { encodeUrlComponent, decodeUrlComponent } from "@/lib/lab/url-encoding";
import { computeHash, type HashAlgorithm } from "@/lib/lab/hash";
import { runJs } from "@/lib/terminal-run-js";

interface OutputLine {
  id: number;
  type: "input" | "output" | "error";
  text: string;
}

const COMMANDS = [
  "help",
  "whoami",
  "pwd",
  "ls",
  "cd",
  "cat",
  "clear",
  "echo",
  "date",
  "history",
  "open",
  "sudo",
  "contact",
  "resume",
  "projects",
  "skills",
  "run",
  "base64",
  "urlencode",
  "hash",
  "uuid",
  "json",
  "exit",
];

const ROUTE_MAP: Record<string, string> = {
  home: "/",
  about: "/about",
  projects: "/projects",
  security: "/security",
  architecture: "/architecture",
  terminal: "/terminal",
  browser: "/browser",
  contact: "/contact",
  pricing: "/pricing",
  lab: "/lab",
  flow: "/flow",
};

const HELP_TEXT = [
  "Available commands:",
  "  help              show this list",
  "  whoami            who runs this thing",
  "  ls [path]          list a directory",
  "  cd <path>         change directory",
  "  pwd               print working directory",
  "  cat <file>        print a file's contents",
  "  open <page>       navigate the real site (about, projects, security, architecture, browser, flow, lab, pricing, contact, home)",
  "  contact           show contact details",
  "  resume            shortcut for `cat resume.txt`",
  "  projects          shortcut for `ls projects`",
  "  skills            shortcut for `cat skills.txt`",
  "  history           show command history",
  "  clear             clear the screen",
  "  echo <text>       print text back",
  "",
  "  This part actually runs, not just simulated output:",
  "  run <js code>            execute real JavaScript in your browser and print the result",
  "  base64 encode|decode <t> Base64 in and out",
  "  urlencode encode|decode <t>  percent-encode in and out",
  "  hash <algo> <text>       sha1 | sha256 | sha384 | sha512, via Web Crypto",
  "  uuid                     a real RFC 4122 v4 UUID",
  "  json <text>              parse and pretty-print JSON",
  "  These are preview slices of the full Lab tools — see `open pricing` for the rest.",
];

function promptLabel(cwd: string[]) {
  return `visitor@tacitus-dave-os:${formatPath(cwd)}$`;
}

export function Terminal() {
  const router = useRouter();

  const [lines, setLines] = useState<OutputLine[]>([]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const idRef = useRef(0);
  const bannerShown = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function appendLine(type: OutputLine["type"], text: string) {
    idRef.current += 1;
    setLines((prev) => [...prev, { id: idRef.current, type, text }]);
  }

  function appendLines(type: OutputLine["type"], values: string[]) {
    setLines((prev) => [
      ...prev,
      ...values.map((text) => {
        idRef.current += 1;
        return { id: idRef.current, type, text };
      }),
    ]);
  }

  useEffect(() => {
    if (bannerShown.current) return;
    bannerShown.current = true;
    appendLines("output", [
      `${siteConfig.platform} — interactive terminal`,
      "Type `help` to see what's available.",
      "",
    ]);
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  function runCat(target: string) {
    if (!target) {
      appendLine("error", "usage: cat <file>");
      return;
    }
    const path = resolvePath(cwd, target);
    const node = getNode(path);
    if (!node) {
      appendLine("error", `cat: ${target}: no such file`);
    } else if (node.type === "dir") {
      appendLine("error", `cat: ${target}: is a directory`);
    } else {
      appendLines("output", node.content.split("\n"));
    }
  }

  function runLs(target: string) {
    const path = resolvePath(cwd, target || ".");
    const node = target ? getNode(path) : getNode(cwd);
    if (!node) {
      appendLine("error", `ls: ${target}: no such file or directory`);
      return;
    }
    if (node.type === "file") {
      appendLine("output", target);
      return;
    }
    const entries = Object.entries(node.children).map(([name, child]) =>
      child.type === "dir" ? `${name}/` : name,
    );
    appendLine("output", entries.length ? entries.join("  ") : "(empty)");
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    appendLine("input", `${promptLabel(cwd)} ${raw}`);
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    const [cmd, ...args] = trimmed.split(/\s+/);

    switch (cmd) {
      case "help":
        appendLines("output", HELP_TEXT);
        break;
      case "whoami":
        appendLine(
          "output",
          "visitor — exploring the Tacitus Dave OS engineering & cybersecurity platform.",
        );
        break;
      case "pwd":
        appendLine("output", formatPath(cwd));
        break;
      case "ls":
        runLs(args[0]);
        break;
      case "cd": {
        const target = args[0] ?? "/";
        const path = resolvePath(cwd, target);
        const node = getNode(path);
        if (!node) appendLine("error", `cd: ${target}: no such file or directory`);
        else if (node.type !== "dir") appendLine("error", `cd: ${target}: not a directory`);
        else setCwd(path);
        break;
      }
      case "cat":
        runCat(args[0]);
        break;
      case "clear":
        setLines([]);
        return;
      case "echo":
        appendLine("output", args.join(" "));
        break;
      case "date":
        appendLine("output", new Date().toString());
        break;
      case "history":
        appendLines(
          "output",
          history.length ? history.map((entry, i) => `${i + 1}  ${entry}`) : ["(empty)"],
        );
        break;
      case "open": {
        const target = args[0]?.toLowerCase();
        const route = target ? ROUTE_MAP[target] : undefined;
        if (!route) {
          appendLine(
            "error",
            `open: unknown page '${args[0] ?? ""}' — try one of: ${Object.keys(ROUTE_MAP).join(", ")}`,
          );
        } else {
          appendLine("output", `Navigating to ${route} …`);
          router.push(route);
        }
        break;
      }
      case "sudo":
        appendLine(
          "error",
          "Permission denied: this shell runs entirely in your browser, there's nothing to escalate to.",
        );
        break;
      case "contact":
        runCat("contact.txt");
        break;
      case "resume":
        runCat("resume.txt");
        break;
      case "projects":
        runLs("projects");
        break;
      case "skills":
        runCat("skills.txt");
        break;
      case "run": {
        const code = trimmed.slice(cmd.length).trim();
        if (!code) {
          appendLine("error", "usage: run <javascript>");
          break;
        }
        const { logs, result, hasResult, error } = runJs(code);
        logs.forEach((line) => appendLine("output", line));
        if (error) {
          appendLine("error", error);
        } else if (hasResult) {
          appendLine("output", `=> ${result === undefined ? "undefined" : JSON.stringify(result, null, 2) ?? String(result)}`);
        }
        break;
      }
      case "base64": {
        const [sub, ...rest] = args;
        const value = rest.join(" ");
        if ((sub !== "encode" && sub !== "decode") || !value) {
          appendLine("error", "usage: base64 encode|decode <text>");
          break;
        }
        try {
          appendLine("output", sub === "encode" ? encodeBase64(value) : decodeBase64(value));
        } catch (err) {
          appendLine("error", err instanceof Error ? err.message : "Couldn't process that input.");
        }
        break;
      }
      case "urlencode": {
        const [sub, ...rest] = args;
        const value = rest.join(" ");
        if ((sub !== "encode" && sub !== "decode") || !value) {
          appendLine("error", "usage: urlencode encode|decode <text>");
          break;
        }
        try {
          appendLine("output", sub === "encode" ? encodeUrlComponent(value) : decodeUrlComponent(value));
        } catch (err) {
          appendLine("error", err instanceof Error ? err.message : "Couldn't process that input.");
        }
        break;
      }
      case "hash": {
        const algoMap: Record<string, HashAlgorithm> = {
          sha1: "SHA-1",
          sha256: "SHA-256",
          sha384: "SHA-384",
          sha512: "SHA-512",
        };
        const algorithm = algoMap[args[0]?.toLowerCase() ?? ""];
        const value = args.slice(1).join(" ");
        if (!algorithm || !value) {
          appendLine("error", "usage: hash <sha1|sha256|sha384|sha512> <text>");
          break;
        }
        computeHash(algorithm, value).then((digest) => appendLine("output", digest));
        break;
      }
      case "uuid":
        appendLine("output", crypto.randomUUID());
        break;
      case "json": {
        const value = args.join(" ");
        if (!value) {
          appendLine("error", "usage: json <text>");
          break;
        }
        try {
          appendLines("output", JSON.stringify(JSON.parse(value), null, 2).split("\n"));
        } catch (err) {
          appendLine("error", err instanceof Error ? err.message : "Invalid JSON.");
        }
        break;
      }
      case "exit":
      case "logout":
        appendLine("output", "There's no escape hatch here — try `open home`.");
        break;
      default:
        appendLine("error", `command not found: ${cmd} (try 'help')`);
    }
  }

  function handleTabComplete() {
    const parts = inputValue.split(" ");
    const lastIndex = parts.length - 1;
    const last = parts[lastIndex];

    let candidates: string[] = [];

    if (lastIndex === 0) {
      candidates = COMMANDS.filter((c) => c.startsWith(last));
    } else {
      const hasSlash = last.includes("/");
      const dirInput = hasSlash ? last.slice(0, last.lastIndexOf("/")) || "/" : ".";
      const prefix = hasSlash ? last.slice(last.lastIndexOf("/") + 1) : last;
      const node = getNode(resolvePath(cwd, dirInput));
      if (node && node.type === "dir") {
        candidates = Object.keys(node.children).filter((name) => name.startsWith(prefix));
      }
    }

    if (candidates.length === 1) {
      const completed = candidates[0];
      if (lastIndex === 0) {
        parts[lastIndex] = completed;
      } else {
        const hasSlash = last.includes("/");
        const base = hasSlash ? last.slice(0, last.lastIndexOf("/") + 1) : "";
        parts[lastIndex] = base + completed;
      }
      setInputValue(parts.join(" "));
    } else if (candidates.length > 1) {
      appendLine("output", candidates.join("  "));
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      handleTabComplete();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInputValue("");
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      }
    }
  }

  return (
    <div
      className="rounded-md border border-border bg-background-elevated font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 text-xs uppercase tracking-widest text-foreground-muted">
          tacitus-dave-os — terminal
        </span>
      </div>

      <div
        ref={scrollRef}
        aria-live="polite"
        className="h-[70vh] max-h-[28rem] overflow-y-auto overflow-x-hidden px-4 py-4"
      >
        {lines.map((line) => (
          <p
            key={line.id}
            className={
              line.type === "error"
                ? "whitespace-pre-wrap break-words"
                : line.type === "input"
                  ? "whitespace-pre-wrap break-words text-accent"
                  : "whitespace-pre-wrap break-words text-foreground-muted"
            }
            style={line.type === "error" ? { color: "#d03b3b" } : undefined}
          >
            {line.text || " "}
          </p>
        ))}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            runCommand(inputValue);
            setInputValue("");
          }}
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
        >
          <label htmlFor="terminal-input" className="shrink-0 break-all text-accent">
            {promptLabel(cwd)}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-[10ch] flex-1 bg-transparent text-base text-foreground outline-none sm:text-sm"
            aria-label="Terminal command input"
          />
        </form>
      </div>
    </div>
  );
}
