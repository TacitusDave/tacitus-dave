"use client";

import { useState } from "react";
import Image from "next/image";
import profileImage from "../../../public/profile.jpg";
import { siteConfig } from "@/lib/site-config";

export function ProfilePhoto() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mx-auto w-48 shrink-0 sm:w-56 lg:mx-0">
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-pressed={revealed}
        aria-label={
          revealed
            ? `Portrait of ${siteConfig.name} — tap to obscure again`
            : `Portrait of ${siteConfig.name}, obscured — tap or hover to reveal`
        }
        data-revealed={revealed}
        className="profile-frame block w-full cursor-pointer border border-border outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Image
          src={profileImage}
          alt=""
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 224px, 192px"
          className="profile-photo h-auto w-full object-cover"
        />
        <span className="profile-overlay" aria-hidden="true" />
      </button>
      <p className="mt-3 text-center font-mono text-[11px] text-foreground-muted lg:text-left">
        ↑ that&apos;s the person building this — hover or tap to look
      </p>
    </div>
  );
}
