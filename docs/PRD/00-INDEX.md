# Tacitus Dave OS — PRD Index

Master specification for Tacitus Dave OS. This index tracks every document in the PRD, its status, and where it lives. New sections should be appended as new numbered files in this folder, not pasted into chat.

## Status Legend

- ✅ Complete — written and reviewed
- 🚧 Drafted — content exists but not yet cross-checked against later docs
- ⬜ Not started

## Document 1 — Product Vision & Requirements

| # | Document | Status | File |
|---|---|---|---|
| 1.1 | Executive Summary | 🚧 (referenced, not yet saved as a standalone file) | — |
| 1.2 | Vision, Mission, Brand Identity & Product Philosophy | ✅ | [01.2-vision-mission-brand-identity-philosophy.md](./01.2-vision-mission-brand-identity-philosophy.md) |
| 1.3 | Target Audience, User Personas & User Journeys | ✅ | [01.3-target-audience-personas-journeys.md](./01.3-target-audience-personas-journeys.md) |
| 1.4 | Competitive Analysis & Industry Benchmarking | 🚧 in progress | — |
| 1.4.1 | — Industry Landscape | ✅ | [01.4.1-industry-landscape.md](./01.4.1-industry-landscape.md) |
| 1.4.2 | — Benchmark Companies (Apple, Stripe, Vercel, Linear, Figma, Cloudflare, GitHub, Notion, Arc, Palantir, Raycast, Framer) | ⬜ | — |
| 1.4.3 | — What We Learn From Each (UI/UX/Motion/Typography/Navigation/Performance/Branding/Storytelling) | ⬜ | — |
| 1.4.4 | — Gap Analysis | ⬜ | — |
| 1.4.5 | — Competitive Positioning & USP | ⬜ | — |
| 1.4.6 | — Design Principles Derived From Research | ⬜ | — |
| 1.5 | Functional Requirements | 🚧 (referenced in conversation, not yet saved) | — |
| 1.6 | Non-Functional Requirements Specification | ⬜ | — |

## Document 2 — Software Architecture Document (SAD)

⬜ Not started. Recommended next: folder structure, application architecture, state management, data flow, API surface.

## Document 3 — Design System Specification

⬜ Not started. Recommended next: color system, typography, spacing scale, component inventory, motion principles, accessibility standards.

## Later Phases (per roadmap discussion)

- Implementation Guide
- Build Phases 1–6 (Foundation → Design System → Portfolio → Interactive Features → Advanced Features → Enterprise Features)

## Notes

- This PRD is being written iteratively alongside development, not fully finished before code starts (see project decision log below).
- **2026-07-31:** Decided to begin implementation once the SAD and Design System Specification exist, running further PRD sections in parallel with early build phases rather than blocking on a fully finished 250–500 page spec.
