import { siteConfig } from "@/lib/site-config";

export interface FsFile {
  type: "file";
  content: string;
}

export interface FsDir {
  type: "dir";
  children: Record<string, FsNode>;
}

export type FsNode = FsFile | FsDir;

export const fsRoot: FsDir = {
  type: "dir",
  children: {
    "about.txt": {
      type: "file",
      content:
        "Tacitus Dave — bridging software engineering and cybersecurity.\nRun `open about` for the full page.",
    },
    "resume.txt": {
      type: "file",
      content:
        "Resume — placeholder. Run `open contact` to ask for the real one directly.",
    },
    "skills.txt": {
      type: "file",
      content:
        "TypeScript · Next.js · Go · Kubernetes · AWS · Terraform · Security Engineering",
    },
    "contact.txt": {
      type: "file",
      content: `Email: ${siteConfig.contactEmail}\nGitHub: ${siteConfig.social.github}\nLinkedIn: ${siteConfig.social.linkedin}`,
    },
    projects: {
      type: "dir",
      children: {
        "project-one.md": {
          type: "file",
          content: "Project One — replace with a real case study.",
        },
        "project-two.md": {
          type: "file",
          content: "Project Two — replace with a real case study.",
        },
        "project-three.md": {
          type: "file",
          content: "Project Three — replace with a real case study.",
        },
      },
    },
  },
};

export function resolvePath(cwd: string[], input: string): string[] {
  const isAbsolute = input.startsWith("/");
  const parts = (isAbsolute ? input.slice(1) : input).split("/").filter(Boolean);
  const stack = isAbsolute ? [] : [...cwd];

  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }

  return stack;
}

export function getNode(path: string[]): FsNode | null {
  let node: FsNode = fsRoot;
  for (const part of path) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

export function formatPath(path: string[]): string {
  return "/" + path.join("/");
}
