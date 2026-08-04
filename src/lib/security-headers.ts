export interface HeaderCheckItem {
  header: string;
  label: string;
  present: boolean;
  value: string | null;
  note: string;
}

const CHECKED_HEADERS: { header: string; label: string; note: string }[] = [
  {
    header: "strict-transport-security",
    label: "HSTS",
    note: "Forces HTTPS on future visits, blocking downgrade attacks.",
  },
  {
    header: "content-security-policy",
    label: "Content-Security-Policy",
    note: "Restricts what scripts/resources the page can load — the main defense against XSS.",
  },
  {
    header: "x-frame-options",
    label: "X-Frame-Options",
    note: "Blocks the page from being embedded in a hidden iframe (clickjacking).",
  },
  {
    header: "x-content-type-options",
    label: "X-Content-Type-Options",
    note: "Stops the browser from guessing content types in a way attackers can abuse.",
  },
  {
    header: "referrer-policy",
    label: "Referrer-Policy",
    note: "Controls how much of the URL leaks to other sites via the Referer header.",
  },
  {
    header: "permissions-policy",
    label: "Permissions-Policy",
    note: "Restricts which browser features (camera, mic, geolocation) the page can use.",
  },
];

export function evaluateHeaders(headers: Headers): { items: HeaderCheckItem[]; score: number } {
  const items = CHECKED_HEADERS.map(({ header, label, note }) => {
    const value = headers.get(header);
    return { header, label, present: value !== null, value, note };
  });
  const score = items.filter((item) => item.present).length;
  return { items, score };
}

export const HEADER_CHECK_TOTAL = CHECKED_HEADERS.length;
