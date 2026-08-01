"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { fieldStyles } from "@/components/lab/field-styles";
import { cn } from "@/lib/cn";

const SAMPLE = `# Heading

Some **bold** text, some *italics*, and \`inline code\`.

- One
- Two
- Three

> A blockquote.

\`\`\`js
console.log("a fenced code block");
\`\`\`

[A link](https://example.com)
`;

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.resolve(marked.parse(markdown)).then((rendered) => {
      if (cancelled) return;
      setHtml(DOMPurify.sanitize(rendered));
    });

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="markdown-input" className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
            Markdown
          </label>
          <textarea
            id="markdown-input"
            rows={16}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
            className={cn(fieldStyles, "resize-none")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-muted">Preview</p>
          <div
            className="prose-invert min-h-[24rem] overflow-auto rounded-md border border-border bg-background-elevated p-4 text-sm text-foreground [&_a]:text-accent [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-foreground-muted [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-medium [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-medium [&_li]:ml-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-3 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <p className="text-xs text-foreground-muted">
        Parsed with `marked` and sanitized with DOMPurify before rendering — nothing is sent
        anywhere.
      </p>
    </div>
  );
}
