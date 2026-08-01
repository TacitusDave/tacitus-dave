"use client";

import { ExternalLinkPanel } from "@/components/ui/external-link-panel";
import { buttonVariants } from "@/components/ui/button";

export function ProjectLiveLink({ url, title }: { url: string; title: string }) {
  return (
    <ExternalLinkPanel
      href={url}
      label={title}
      description="The live, deployed site — opens in a new tab."
      trigger={(open) => (
        <button type="button" onClick={open} className={buttonVariants()}>
          Visit Live Site ↗
        </button>
      )}
    />
  );
}
