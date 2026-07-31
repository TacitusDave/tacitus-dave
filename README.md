# Tacitus Dave OS

A premium engineering and cybersecurity personal platform — not a résumé placed on the web, but a working demonstration of the craft it describes. Built with Next.js 16, TypeScript, Tailwind CSS v4, and React 19.

## What's here

- **Core pages** — Home, About, Projects, Contact
- **The Lab** (`/lab`) — a searchable catalog of interactive tools, grouped by discipline:
  - **Security**: JWT Decoder, Hash Generator, Password Entropy, Contrast Checker
  - **Systems & Networking**: CIDR Calculator, HTTP Status Reference, Timestamp Converter
  - **Developer Utilities**: Base64/URL encode-decode, UUID Generator, JSON Formatter, Case Converter, Text Counter
- **Flagship demonstrations**:
  - `/terminal` — a real in-browser shell with a command parser, virtual filesystem, tab-completion, and history
  - `/security` — a simulated SOC dashboard and threat feed mapped to the MITRE ATT&CK framework
  - `/architecture` — a clickable, self-measuring system architecture diagram
  - `/browser` — an in-site browser panel for local dev ports and privacy-respecting search

Every tool computes its result for real, client-side — nothing fakes its output. Simulated data (the SOC dashboard) is labeled as such.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project docs

Product requirements and brand documentation live in [`docs/PRD`](./docs/PRD), starting with [`00-INDEX.md`](./docs/PRD/00-INDEX.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · React 19 · `next/font` (Geist Sans/Mono) · Web Crypto API — no external UI or animation libraries.
