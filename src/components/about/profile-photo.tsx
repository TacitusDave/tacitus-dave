"use client";

import { useState } from "react";
import Image from "next/image";
import profilePlaceholder from "../../../public/profile-placeholder.jpg";
import { siteConfig } from "@/lib/site-config";

export function ProfilePhoto() {
  const [revealed, setRevealed] = useState(false);
  // The real photo is never in the page until this flips — before that, the
  // client only ever has the de-identified placeholder (downsampled to 20px
  // then blurred, not just CSS-blurred), so view-source/save-image/scrapers
  // never see the real face.
  const [interacted, setInteracted] = useState(false);

  return (
    <div className="mx-auto w-48 shrink-0 sm:w-56 lg:mx-0">
      <button
        type="button"
        onClick={() => {
          setInteracted(true);
          setRevealed((r) => !r);
        }}
        onMouseEnter={() => setInteracted(true)}
        onFocus={() => setInteracted(true)}
        aria-pressed={revealed}
        aria-label={
          revealed
            ? `Portrait of ${siteConfig.name} — tap to obscure again`
            : `Portrait of ${siteConfig.name}, obscured — tap or hover to reveal`
        }
        data-revealed={revealed}
        className="profile-frame relative block w-full cursor-pointer border border-border outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          src={profilePlaceholder}
          alt=""
          priority
          sizes="(min-width: 1024px) 224px, 192px"
          className="h-auto w-full object-cover"
        />
        {interacted ? (
          <Image
            src="/profile.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 224px, 192px"
            className="profile-photo absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <span className="profile-overlay" aria-hidden="true" />
      </button>
      <p className="mt-3 text-center font-mono text-[11px] text-foreground-muted lg:text-left">
        ↑ that&apos;s the person building this — hover or tap to look
      </p>
    </div>
  );
}
