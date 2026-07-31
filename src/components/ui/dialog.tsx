"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DialogProps {
  /** Render-prop so the trigger element controls its own tag (button, card, etc.) and stays keyboard-accessible. */
  trigger: (open: () => void) => ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (isOpen && !node.open) node.showModal();
    if (!isOpen && node.open) node.close();
  }, [isOpen]);

  return (
    <>
      {trigger(() => setIsOpen(true))}

      <dialog
        ref={ref}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === ref.current) setIsOpen(false);
        }}
        className={cn(
          "w-full max-w-lg rounded-md border border-border bg-background-elevated p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <h2 className="text-lg font-medium text-foreground">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-foreground-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            className="shrink-0 font-mono text-xs uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
          >
            Esc
          </button>
        </div>
        <div className="p-6">{children}</div>
      </dialog>
    </>
  );
}
