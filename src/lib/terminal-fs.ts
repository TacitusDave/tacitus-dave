import { siteConfig } from "@/lib/site-config";
import { focusAreas, projects } from "@/lib/content";

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
        "No PDF resume yet — run `open contact` to request one directly, or `cat about.txt` for the short version.",
    },
    "skills.txt": {
      type: "file",
      content: focusAreas.join(" · "),
    },
    "contact.txt": {
      type: "file",
      content: [
        `Email: ${siteConfig.contactEmail}`,
        `GitHub: ${siteConfig.social.github}`,
        `Instagram: ${siteConfig.social.instagram}`,
        `TikTok: ${siteConfig.social.tiktok}`,
        siteConfig.social.linkedin ? `LinkedIn: ${siteConfig.social.linkedin}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    projects: {
      type: "dir",
      children: Object.fromEntries(
        projects.map((project) => [
          `${project.slug}.md`,
          {
            type: "file" as const,
            content: `${project.title}\n\n${project.summary}\n\n${project.details}\n\nRun \`open projects\` to see it on the site.`,
          },
        ]),
      ),
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
